const express = require('express');
require('dotenv').config();

const productRouter = require('./routers/productRouter');
const userRouter = require('./routers/userRouter');
const sellerRouter = require('./routers/sellerRouter');
const adminRouter = require('./routers/adminRouter');
const contactRouter = require('./routers/contactRouter');
const utilRouter = require('./routers/utilRouter');
const reviewRouter = require('./routers/reviewRouter');
const orderRouter = require('./routers/orderRouter');
const feedbackRouter = require('./routers/feedbackRouter');

const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true
}));


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/seller', sellerRouter);
app.use('/admin', adminRouter);
app.use('/review', reviewRouter);
app.use('/contact', contactRouter);
app.use('/util', utilRouter);
app.use('/order', orderRouter);
app.use('/feedback', feedbackRouter);

app.use(express.static('./static/uploads'));

app.post('/create-payment-intent', async (req, res) => {
  const { amount, customerData } = req.body;
  // const { name, address } = customerData;
  console.log(amount);
  const customer = await stripe.customers.create(customerData);
  console.log(customer.id);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'inr',
    description: 'Payment Description',
    customer: customer.id
  });
  res.json({
    clientSecret: paymentIntent.client_secret
  });
})

app.post('/retrieve-payment-intent', async (req, res) => {
  const { paymentIntentId } = req.body;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  res.json(paymentIntent);
});

app.listen(port, () => { 
  console.log(`🚀 Server started successfully on port ${port}`);
  console.log(`📍 API URL: http://localhost:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
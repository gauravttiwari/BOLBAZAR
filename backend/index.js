const express = require('express');
require('dotenv').config();
require('./connection'); // Connect to MongoDB

const productRouter = require('./routers/productRouter');
const userRouter = require('./routers/userRouter');
const sellerRouter = require('./routers/sellerRouter');
const adminRouter = require('./routers/adminRouter');
const contactRouter = require('./routers/contactRouter');
const utilRouter = require('./routers/utilRouter');
const reviewRouter = require('./routers/reviewRouter');
const orderRouter = require('./routers/orderRouter');
const feedbackRouter = require('./routers/feedbackRouter');
const authRouter = require('./routers/authRouter');
const dashboardRouter = require('./routers/dashboardRouter');
const wishlistRouter = require('./routers/wishlistRouter');

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
app.use('/wishlist', wishlistRouter);
app.use('/api/passwordless-auth', authRouter);
app.use('/api', dashboardRouter);

app.use(express.static('./static/uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'BOLBAZAR Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BOLBAZAR API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      products: '/product',
      users: '/user',
      sellers: '/seller',
      admin: '/admin',
      orders: '/order',
      reviews: '/review',
      contact: '/contact',
      feedback: '/feedback',
      passwordlessAuth: '/api/passwordless-auth'
    }
  });
});

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

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start server
app.listen(port, () => { 
  console.log('\n========================================');
  console.log('   🚀 BOLBAZAR Backend Server');
  console.log('========================================');
  console.log(`✅ Server running on port ${port}`);
  console.log(`📍 API URL: http://localhost:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Not Set'}`);
  console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓ Configured' : '✗ Not Configured'}`);
  console.log('========================================\n');
  console.log('📝 Available endpoints:');
  console.log('   GET  /health');
  console.log('   GET  /');
  console.log('   POST /user/add (signup)');
  console.log('   POST /user/authenticate (login)');
  console.log('   POST /api/passwordless-auth/signup');
  console.log('   POST /api/passwordless-auth/request-challenge');
  console.log('   POST /api/passwordless-auth/verify-challenge');
  console.log('========================================\n');
});
# 💳 Payment Gateway - Stripe Integration

## Overview
**BolBazar** uses **Stripe** as the primary payment gateway for online transactions. The integration supports both **online payments (Credit/Debit Card)** and **Cash on Delivery (COD)**.

---

## 🏪 Payment Methods Supported

### 1. **Online Payment (Stripe)**
- Credit Cards (Visa, Mastercard, American Express)
- Debit Cards
- UPI (via Stripe)
- Other payment methods supported by Stripe

### 2. **Cash on Delivery (COD)**
- Direct payment to delivery person
- No payment processing needed

---

## 📊 Stripe Integration Architecture

```
Frontend (React/Next.js)
    ↓
@stripe/react-stripe-js
@stripe/stripe-js
    ↓
Stripe Instance (Client)
    ↓
Create Payment Intent
    ↓
Backend (Express.js)
    ↓
Stripe API
    ↓
Process Payment
    ↓
Payment Success/Failure
```

---

## 🔧 Frontend Implementation

### **File**: [frontend/src/app/user/checkout/page.jsx](frontend/src/app/user/checkout/page.jsx)

#### **1. Stripe Initialization**
```javascript
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
```

**Key Variables**:
- `NEXT_PUBLIC_STRIPE_KEY` - Stripe Publishable Key (from .env)

#### **2. Payment Intent Creation**
```javascript
const getPaymentIntent = async () => {
  const res = await fetch(`${API_URL}/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: totalAmount,
      customerData: {
        name: selectedAddress.name,
        email: currentUser.email,
        address: {
          line1: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postal_code: selectedAddress.pincode,
          country: "IN",
        },
      },
    }),
  });
  
  const data = await res.json();
  setClientSecret(data.clientSecret);
  return data.clientSecret;
};
```

**Parameters**:
- `amount` - Total order amount
- `customerData` - Customer details
  - `name` - Customer name
  - `email` - Customer email
  - `address` - Delivery address

#### **3. Payment Method Selection**
```javascript
const [paymentMethod, setPaymentMethod] = useState('cod'); // Default: COD

// Payment options in checkout form:
// - 'cod' : Cash on Delivery
// - 'online' : Stripe Online Payment
```

#### **4. Order Placement with Payment**
```javascript
const orderData = {
  user: currentUser._id,
  items: cartItems,
  shippingAddress: selectedAddress,
  deliveryOption,
  paymentMethod,        // 'cod' or 'online'
  paymentDetails: { amount: totalAmount },
  mode: paymentMethod === 'cod' ? 'cash' : 'online',
  totalAmount,
  status: 'placed',
  // ... more fields
};
```

---

## 🎨 Payment Gateway Component

### **File**: [frontend/src/app/user/checkout/PaymentGateway.jsx](frontend/src/app/user/checkout/PaymentGateway.jsx)

```javascript
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

const PaymentGateway = ({ email }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/thankyou",
        receipt_email: email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Secure Payment Gateway</h1>
      <PaymentElement />
      <button disabled={!stripe} type="submit">Submit</button>
    </form>
  );
};
```

**Key Features**:
- `PaymentElement` - Pre-built payment form
- `useStripe()` - Stripe instance
- `useElements()` - Form elements access
- `confirmPayment()` - Submits payment

---

## 🔙 Backend Implementation

### **File**: [backend/index.js](backend/index.js)

#### **1. Stripe Initialization**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

#### **2. Create Payment Intent Endpoint**
```javascript
app.post('/create-payment-intent', async (req, res) => {
  const { amount, customerData } = req.body;
  
  // Create Stripe customer
  const customer = await stripe.customers.create(customerData);
  
  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,              // Stripe uses cents
    currency: 'inr',                   // Indian Rupee
    description: 'Payment Description',
    customer: customer.id              // Attach to customer
  });
  
  res.json({
    clientSecret: paymentIntent.client_secret
  });
});
```

**Endpoint**: `POST /create-payment-intent`

**Request Body**:
```json
{
  "amount": 1500,
  "customerData": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "line1": "123 Main St",
      "city": "Delhi",
      "state": "Delhi",
      "postal_code": "110001",
      "country": "IN"
    }
  }
}
```

**Response**:
```json
{
  "clientSecret": "pi_1234567890_secret_1234567890"
}
```

#### **3. Retrieve Payment Intent Endpoint**
```javascript
app.post('/retrieve-payment-intent', async (req, res) => {
  const { paymentIntentId } = req.body;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  res.json(paymentIntent);
});
```

**Endpoint**: `POST /retrieve-payment-intent`

**Purpose**: Retrieve payment status after form submission

---

## 📋 Payment Flow Diagram

```
User Checkout
    ↓
Step 1: Address Selection
    ↓
Step 2: Delivery Option
    ↓
Step 3: Payment Method Selection
    │
    ├─→ COD (Cash on Delivery)
    │   ↓
    │   Order placed directly
    │   Status: "placed"
    │   Mode: "cash"
    │
    └─→ Online (Stripe)
        ↓
        Create Payment Intent
        (POST /create-payment-intent)
        ↓
        Get clientSecret
        ↓
        Render PaymentElement
        ↓
        User enters card details
        ↓
        confirmPayment()
        ↓
        Stripe processes
        ↓
        ├─→ Success
        │   ↓
        │   Order placed
        │   Status: "placed"
        │   Mode: "online"
        │
        └─→ Failure
            ↓
            Show error
            Retry or use COD
```

---

## 🛡️ Security Features

### **Frontend Security**
- ✅ PCI Compliance via Stripe (No card details stored)
- ✅ `@stripe/react-stripe-js` handles sensitive data
- ✅ HTTPS only in production
- ✅ Client-side validation with Yup

### **Backend Security**
- ✅ Stripe Secret Key (server-side only)
- ✅ Environment variables (dotenv)
- ✅ CORS validation
- ✅ JWT authentication for order endpoints
- ✅ No sensitive data in logs

### **Stripe Security**
- ✅ PCI Level 1 Compliance
- ✅ 3D Secure verification
- ✅ Fraud detection
- ✅ Tokenized payments
- ✅ Webhook validation

---

## 📦 Payment Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| **stripe** | 15.3.0 | Backend Stripe SDK |
| **@stripe/stripe-js** | 3.3.0 | Load Stripe.js |
| **@stripe/react-stripe-js** | 2.7.0 | React Stripe components |
| **react-stripe-js** | 1.1.5 | Additional integration |

---

## 🔑 Environment Variables Required

### **Backend (.env)**
```
STRIPE_SECRET_KEY=sk_live_xxxxx  # Secret key from Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # Publishable key
```

### **Frontend (.env.local)**
```
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxxxx  # Public/Publishable key
```

---

## 💰 Amount Handling

### **Important**
```javascript
// Frontend: Send amount in rupees (₹)
amount: 1500  // ₹1500

// Backend: Convert to smallest unit (paise)
amount: 1500 * 100  // 150000 paise = ₹1500
```

**Currency**: INR (Indian Rupee)
**Smallest Unit**: Paise (1 Rupee = 100 Paise)

---

## 🔄 Order Data Structure with Payment

```javascript
{
  user: "user_id",
  items: [
    { productId, quantity, price }
  ],
  shippingAddress: {
    name, mobile, pincode, state, city, address, locality, landmark, addressType
  },
  deliveryOption: "standard/express/overnight",
  deliveryCharge: 50,
  paymentMethod: "cod" | "online",
  paymentDetails: {
    amount: 1500,
    stripeCustomerId: "cus_xxxxx",
    paymentIntentId: "pi_xxxxx"
  },
  mode: "cash" | "online",
  totalAmount: 1550,
  subtotal: 1500,
  status: "placed",
  statusHistory: [{
    status: "placed",
    timestamp: new Date(),
    note: "Order placed successfully"
  }]
}
```

---

## ✅ Checkout Flow Implementation

### **Step 3: Payment Method**
```jsx
<div className="payment-options">
  <label>
    <input 
      type="radio" 
      value="cod" 
      checked={paymentMethod === 'cod'}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    Cash on Delivery
  </label>
  
  <label>
    <input 
      type="radio" 
      value="online" 
      checked={paymentMethod === 'online'}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    Pay with Card
  </label>
</div>
```

### **Step 4: Payment Processing**
```jsx
{paymentMethod === 'cod' && (
  <button onClick={placeOrder}>Place Order (COD)</button>
)}

{paymentMethod === 'online' && (
  <Elements stripe={stripePromise}>
    <PaymentGateway email={currentUser.email} />
  </Elements>
)}
```

---

## 🎯 API Endpoints Related to Payment

```
POST   /create-payment-intent      - Create Stripe payment intent
POST   /retrieve-payment-intent    - Get payment status
POST   /order/add                  - Place order (with payment info)
PUT    /order/notify-seller/:id    - Notify seller of order
```

---

## 🧪 Testing Payment

### **Stripe Test Cards**
| Card Number | Result |
|------------|--------|
| 4242 4242 4242 4242 | Success |
| 5555 5555 5555 4444 | Mastercard |
| 3782 822463 10005 | American Express |
| 4000 0027 6000 3184 | Declines |

**Exp Date**: Any future date
**CVC**: Any 3 digits

### **Test Mode**
```
Use Stripe Dashboard Test Keys
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## 📊 Payment Status Tracking

```javascript
// Order with payment
{
  status: "placed",        // Overall order status
  mode: "online",          // Payment mode: cash | online
  paymentDetails: {
    amount: 1500,
    paymentStatus: "succeeded" | "pending" | "failed"
  }
}
```

---

## 🚀 Deployment Checklist

- [ ] Switch to Live Stripe Keys
- [ ] HTTPS enabled in production
- [ ] Webhook endpoint configured
- [ ] Environment variables set securely
- [ ] Error handling in place
- [ ] User notifications enabled
- [ ] Seller notifications enabled
- [ ] Invoice generation ready
- [ ] Refund policy documented
- [ ] Support email configured

---

## 🔐 Best Practices

✅ **Always**
- Keep Secret Key server-side only
- Use HTTPS in production
- Validate amounts on backend
- Store payment status in database
- Handle errors gracefully
- Log payment events

❌ **Never**
- Expose Secret Key in frontend
- Store card details directly
- Use HTTP in production
- Trust client-side amounts
- Ignore webhook failures
- Log sensitive payment info

---

## 📞 Support & Documentation

- **Stripe Docs**: https://stripe.com/docs
- **Stripe Dashboard**: https://dashboard.stripe.com
- **React Stripe Docs**: https://stripe.com/docs/stripe-js/react
- **API Reference**: https://stripe.com/docs/api

---

## Summary

| Aspect | Details |
|--------|---------|
| **Payment Gateway** | Stripe |
| **Payment Methods** | Cards + UPI + COD |
| **Currency** | INR (Indian Rupee) |
| **Status Tracking** | Real-time via API |
| **Security** | PCI Level 1 Compliant |
| **Test Mode** | Available |
| **Webhooks** | Configurable |
| **Refunds** | Supported |
| **Disputes** | Stripe handles |

---

**Integration Status**: ✅ **Fully Integrated**
**Live Status**: Check environment variables
**Test Status**: Use Stripe test keys

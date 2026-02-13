# 🚀 Order System Quick Start Guide - BolBazar

## 📌 Quick Setup & Testing

### 1️⃣ Start the Application

**Start Backend:**
```bash
cd backend
npm start
# or
node index.js
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🛒 Testing the Complete Order Flow

### **Test Scenario 1: New User Order with COD**

#### **Step 1: Browse & Add to Cart**
1. Go to http://localhost:3000
2. Navigate to Products page
3. Click on any product
4. Click "Add to Cart"
5. Cart sidebar opens showing your item

#### **Step 2: View Cart**
1. Cart shows:
   - Product image
   - Product name
   - Quantity controls
   - Price
   - Total
2. Adjust quantity using +/- buttons
3. Click "Proceed to Pay"

#### **Step 3: Login/Signup**
- If not logged in, you'll be redirected to login
- Create account or login
- You'll be redirected back to checkout

#### **Step 4: Checkout - Address**
1. You'll see the multi-step checkout page
2. **Step 1 - Address:**
   - Click "Add New Address"
   - Fill the form:
     ```
     Name: John Doe
     Mobile: 9876543210
     Pincode: 110001
     State: Delhi
     City: New Delhi
     Address: 123, MG Road
     Locality: Connaught Place
     Landmark: Near Metro Station
     Type: Home
     ```
   - Click "Save Address"
   - Address will be selected automatically
3. Click "Continue"

#### **Step 5: Checkout - Delivery**
1. **Step 2 - Delivery:**
   - Choose "Normal Delivery (FREE)" or "Fast Delivery (₹50)"
   - See estimated delivery date
2. Click "Continue"

#### **Step 6: Checkout - Payment**
1. **Step 3 - Payment:**
   - Select "Cash on Delivery (COD)"
2. Click "Continue"

#### **Step 7: Confirm Order**
1. **Step 4 - Confirmation:**
   - Review order summary
   - Click "Confirm Order"
2. Order placed! 🎉
3. You'll be redirected to order tracking

#### **Step 8: Track Order**
1. Order tracking page shows:
   - Order ID
   - Status: "Placed"
   - Progress bar
   - Items ordered
   - Delivery address
   - Payment details
2. Order status will progress as seller updates

---

### **Test Scenario 2: Seller Processing Order**

#### **Step 1: Login as Seller**
1. Go to http://localhost:3000/sellerLogin
2. Login with seller credentials
3. Go to seller dashboard

#### **Step 2: View Orders**
1. Import and use SellerOrderManagement component:
   ```jsx
   import SellerOrderManagement from '@/components/SellerOrderManagement'
   
   // In your seller dashboard page
   <SellerOrderManagement />
   ```
2. You'll see all orders from your store
3. Click on an order to see details

#### **Step 3: Process Order**
1. Click "Start Processing"
   - Status changes: Placed → Processing
   - Customer gets notification
2. Prepare items for shipping

#### **Step 4: Ship Order**
1. Click "Add Courier Details & Ship"
2. Enter:
   ```
   Courier Name: Blue Dart
   Tracking Number: BD123456789
   AWB Number: AWB98765
   ```
3. Status changes: Processing → Shipped
4. Customer gets tracking number

#### **Step 5: Update Delivery Status**
1. Click "Out for Delivery"
   - Status: Shipped → Out for Delivery
2. Once delivered, click "Mark as Delivered"
   - Status: Out for Delivery → Delivered
   - Customer can now return (if needed)

---

### **Test Scenario 3: Online Payment**

#### **Prerequisites:**
- Set up Stripe account
- Get Stripe publishable key
- Add to `.env.local`:
  ```
  NEXT_PUBLIC_STRIPE_KEY=pk_test_your_key_here
  ```

#### **Testing Online Payment:**
1. Follow Steps 1-5 from Scenario 1
2. At **Payment Method** step:
   - Select "Debit/Credit Card" or "UPI"
3. Click "Continue"
4. Stripe payment form will appear
5. Use test card:
   ```
   Card Number: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   ZIP: Any 5 digits (e.g., 12345)
   ```
6. Click "Pay"
7. Payment processed
8. Order confirmed automatically

---

### **Test Scenario 4: Return & Refund**

#### **Prerequisites:**
- Order must be delivered
- Within return window (7-10 days)

#### **Steps:**
1. Go to order tracking page
2. Find delivered order
3. Click "Request Return"
4. Fill return form:
   ```
   Reason: Product not as expected
   Comments: Size was too large
   ```
5. Submit request
6. Status changes: Delivered → Return Requested

#### **Admin/Seller Reviews Return:**
1. Review return request
2. Approve or reject
3. If approved:
   - Schedule pickup
   - Collect item
   - Inspect quality
   - Process refund

#### **Refund Processing:**
```bash
# API call to process refund
PUT /order/process-refund/:orderId
Body: {
  refundAmount: 1299,
  refundStatus: 'initiated'
}
```

---

## 🔍 Testing API Endpoints

### **Using Thunder Client / Postman:**

#### **1. Add Address**
```http
POST http://localhost:5000/user/address/add/:userId
Content-Type: application/json

{
  "name": "John Doe",
  "mobile": "9876543210",
  "pincode": "110001",
  "state": "Delhi",
  "city": "New Delhi",
  "address": "123, MG Road",
  "locality": "Connaught Place",
  "addressType": "home"
}
```

#### **2. Get User Addresses**
```http
GET http://localhost:5000/user/address/getall/:userId
```

#### **3. Verify Pincode**
```http
GET http://localhost:5000/user/verify-pincode/110001
```

#### **4. Create Order**
```http
POST http://localhost:5000/order/add
Content-Type: application/json

{
  "user": "userId_here",
  "items": [{
    "pname": "Test Product",
    "pprice": 999,
    "quantity": 1
  }],
  "shippingAddress": {
    "name": "John Doe",
    "mobile": "9876543210",
    "address": "123, MG Road",
    "city": "New Delhi",
    "state": "Delhi",
    "pincode": "110001"
  },
  "deliveryOption": "normal",
  "deliveryCharge": 0,
  "paymentMethod": "cod",
  "paymentDetails": { "amount": 999 },
  "mode": "cash",
  "totalAmount": 999,
  "status": "placed"
}
```

#### **5. Update Order Status**
```http
PUT http://localhost:5000/order/update-status/:orderId
Content-Type: application/json

{
  "status": "processing",
  "message": "Order is being processed"
}
```

#### **6. Add Courier Details**
```http
PUT http://localhost:5000/order/add-courier-details/:orderId
Content-Type: application/json

{
  "courierName": "Blue Dart",
  "trackingNumber": "BD123456789",
  "awbNumber": "AWB98765"
}
```

#### **7. Get Order by User**
```http
GET http://localhost:5000/order/getbyuser/:userId
```

#### **8. Get Order by Seller**
```http
GET http://localhost:5000/order/getbyseller/:sellerId
```

#### **9. Request Return**
```http
PUT http://localhost:5000/order/request-return/:orderId
Content-Type: application/json

{
  "returnReason": "Product not as expected"
}
```

#### **10. Process Refund**
```http
PUT http://localhost:5000/order/process-refund/:orderId
Content-Type: application/json

{
  "refundAmount": 999,
  "refundStatus": "initiated"
}
```

---

## 🎨 UI Components Reference

### **1. Checkout Page**
Location: `frontend/src/app/user/checkout/page.jsx`

Features:
- Multi-step progress indicator
- Address management
- Delivery options
- Payment methods
- Order summary sidebar

### **2. Order Tracking**
Location: `frontend/src/app/user/ordertracking/page.jsx`

Features:
- Visual status progress
- Order timeline
- Tracking details
- Order items display
- Payment summary

### **3. Seller Order Management**
Location: `frontend/src/components/SellerOrderManagement.jsx`

Features:
- Order filters by status
- Order list view
- Order details sidebar
- Status update buttons
- Courier details form

---

## 🐛 Common Issues & Solutions

### **Issue 1: Cart items not persisting**
**Solution:**
- Check localStorage in browser DevTools
- Clear cache and reload
- Verify CartContext is properly wrapped

### **Issue 2: User not authenticated**
**Solution:**
```javascript
// Check sessionStorage
const user = JSON.parse(sessionStorage.getItem('user'))
console.log(user)
```

### **Issue 3: Address won't save**
**Solution:**
- Check network tab for API errors
- Verify userId is correct
- Check MongoDB connection

### **Issue 4: Payment gateway not loading**
**Solution:**
- Verify Stripe key in .env.local
- Check console for errors
- Ensure Stripe package is installed:
  ```bash
  npm install @stripe/stripe-js @stripe/react-stripe-js
  ```

### **Issue 5: Order status not updating**
**Solution:**
- Check seller authentication
- Verify orderId is correct
- Check backend logs

---

## 📊 Test Data

### **Sample User:**
```javascript
{
  fname: "Test",
  lname: "User",
  email: "test@example.com",
  password: "password123"
}
```

### **Sample Address:**
```javascript
{
  name: "John Doe",
  mobile: "9876543210",
  pincode: "110001",
  state: "Delhi",
  city: "New Delhi",
  address: "123, ABC Apartments, MG Road",
  locality: "Connaught Place",
  landmark: "Near Metro Station",
  addressType: "home"
}
```

### **Sample Product:**
```javascript
{
  pname: "Test Product",
  pprice: 999,
  pcategory: "Electronics",
  image: "uploads/product.jpg",
  description: "Test product description"
}
```

---

## 🔐 Environment Variables

Create `.env` in backend:
```env
MONGO_URI=mongodb://localhost:27017/bolbazar
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
PORT=5000
```

Create `.env.local` in frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_key_here
```

---

## ✅ Checklist for Testing

- [ ] User can add items to cart
- [ ] Cart persists on page reload
- [ ] User can proceed to checkout
- [ ] Multi-step checkout works
- [ ] Can add new address
- [ ] Pincode verification works
- [ ] Can select delivery option
- [ ] Can choose payment method
- [ ] COD order places successfully
- [ ] Online payment works (Stripe)
- [ ] Order tracking page shows status
- [ ] Seller receives order notification
- [ ] Seller can update order status
- [ ] Customer sees status updates
- [ ] Courier details can be added
- [ ] Return request works
- [ ] Refund processing works

---

## 📱 Mobile Testing

Test on different screen sizes:
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

All pages are responsive and mobile-friendly!

---

## 🎯 Performance Tips

1. **Optimize Images:**
   ```javascript
   // Use Next.js Image component
   import Image from 'next/image'
   <Image src={...} alt={...} width={...} height={...} />
   ```

2. **Lazy Load Components:**
   ```javascript
   const OrderTracking = dynamic(() => import('./OrderTracking'), {
     loading: () => <p>Loading...</p>
   })
   ```

3. **Cache API Responses:**
   - Use SWR or React Query
   - Implement Redis for backend

---

## 📞 Need Help?

If you encounter any issues:
1. Check the console for errors
2. Review the ORDER_FLOW_DOCUMENTATION.md
3. Test API endpoints individually
4. Check MongoDB data
5. Verify environment variables

---

**Happy Testing! 🎉**

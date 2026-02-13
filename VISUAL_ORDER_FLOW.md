# 📊 BolBazar Order Flow - Visual Diagrams

## 🎯 Complete Order Journey Flowchart

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER JOURNEY                                │
└─────────────────────────────────────────────────────────────────────┘

    🛍️ Step 1: Browse Products
           │
           ↓
    🛒 Step 2: Add to Cart
           │
           ├─→ View Cart Sidebar
           │   ├─ Adjust Quantities
           │   ├─ Remove Items
           │   └─ See Total
           │
           ↓
    🔐 Step 3: Click "Proceed to Pay"
           │
           ├─→ Check Login Status
           │   ├─ If Not Logged In → Redirect to Login
           │   └─ If Logged In → Continue
           │
           ↓
    📍 Step 4: Multi-Step Checkout
           │
           ├─→ STEP 1: Address Selection
           │   ├─ View Saved Addresses
           │   ├─ Select Address
           │   └─ Add New Address
           │       ├─ Fill Form
           │       ├─ Verify Pincode
           │       └─ Save
           │
           ↓
           ├─→ STEP 2: Delivery Option
           │   ├─ Normal (FREE, 5-7 days)
           │   └─ Fast (₹50, 2-3 days)
           │
           ↓
           ├─→ STEP 3: Payment Method
           │   ├─ UPI 📱
           │   ├─ Card 💳
           │   ├─ Net Banking 🏦
           │   ├─ Wallet 👝
           │   ├─ EMI 💰
           │   └─ COD 💵
           │
           ↓
           └─→ STEP 4: Confirmation
               ├─ Review Order
               ├─ If COD → Direct Confirm
               └─ If Online → Payment Gateway
                   ├─ Enter Details
                   ├─ OTP Verify
                   └─ Payment Success/Fail
    
    ✅ Order Placed!
           │
           ├─→ Order ID Generated
           ├─→ SMS/Email Sent
           ├─→ Cart Cleared
           └─→ Redirect to Tracking


┌─────────────────────────────────────────────────────────────────────┐
│                       SELLER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

    🔔 Step 5: Seller Notification
           │
           ├─→ Email Notification
           ├─→ SMS Alert
           └─→ Dashboard Update
    
    📦 Step 6: Seller Views Order
           │
           ├─→ Customer Details
           ├─→ Items List
           ├─→ Delivery Address
           └─→ Payment Info
    
    ⚙️ Step 7: Process Order
           │
           ├─→ Click "Start Processing"
           │   └─ Status: Placed → Processing
           │
           ├─→ Pack Items
           │   ├─ Quality Check
           │   └─ Proper Packaging
           │
           └─→ Prepare for Shipping
    
    🚚 Step 8: Ship Order
           │
           ├─→ Add Courier Details
           │   ├─ Courier Name
           │   ├─ Tracking Number
           │   └─ AWB Number
           │
           ├─→ Click "Mark as Shipped"
           │   └─ Status: Processing → Shipped
           │
           └─→ Courier Pickup Scheduled


┌─────────────────────────────────────────────────────────────────────┐
│                      DELIVERY JOURNEY                                │
└─────────────────────────────────────────────────────────────────────┘

    🚛 Step 9: Order in Transit
           │
           ├─→ Package Scanned
           ├─→ Location Updates
           └─→ Customer Tracking Available
    
    🛵 Step 10: Out for Delivery
           │
           ├─→ Delivery Agent Assigned
           ├─→ Status Update
           └─→ SMS to Customer
    
    📬 Step 11: Delivered
           │
           ├─→ Package Delivered
           ├─→ If COD → Payment Collected
           ├─→ Delivery Confirmation
           └─→ Status: Delivered


┌─────────────────────────────────────────────────────────────────────┐
│                    POST-DELIVERY OPTIONS                             │
└─────────────────────────────────────────────────────────────────────┘

    ⏰ Return Window Active (7-10 days)
           │
           ├─→ 🔄 Return Request
           │   ├─ Select Reason
           │   ├─ Submit Request
           │   ├─ Seller Review
           │   ├─ Pickup Scheduled
           │   ├─ Quality Check
           │   └─ Refund Initiated
           │
           ├─→ ⭐ Rate & Review
           │   ├─ Rate Product
           │   ├─ Write Review
           │   └─ Upload Photos
           │
           └─→ 🔁 Buy Again
               └─ Quick Reorder
```

---

## 🔄 Order Status State Machine

```
┌──────────────────────────────────────────────────────────────────┐
│             ORDER STATUS PROGRESSION                              │
└──────────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   PLACED    │ ← Initial Status
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │ PROCESSING  │ ← Seller Action
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │   SHIPPED   │ ← Courier Pickup
                    └──────┬──────┘
                           │
                           ↓
                  ┌────────────────────┐
                  │ OUT FOR DELIVERY   │ ← Last Mile
                  └─────────┬──────────┘
                           │
                           ↓
                    ┌─────────────┐
                    │  DELIVERED  │ ← Final Status
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ↓                         ↓
        ┌──────────┐          ┌──────────────────┐
        │  CLOSED  │          │ RETURN REQUESTED │
        └──────────┘          └────────┬─────────┘
                                       │
                                       ↓
                              ┌──────────────────┐
                              │ RETURN APPROVED  │
                              └────────┬─────────┘
                                       │
                                       ↓
                              ┌──────────────────┐
                              │ REFUND INITIATED │
                              └────────┬─────────┘
                                       │
                                       ↓
                              ┌──────────────────┐
                              │ REFUND COMPLETED │
                              └──────────────────┘

Side Branch (Anytime):
        ┌────────────┐
        │ CANCELLED  │ ← User/Seller Action
        └────────────┘
```

---

## 💾 Database Schema Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │    USER      │
    ├──────────────┤
    │ _id          │◄──────────┐
    │ fname        │           │
    │ lname        │           │
    │ email        │           │
    │ password     │           │
    │ addresses[]  │           │
    │   ├─ name    │           │
    │   ├─ mobile  │           │
    │   ├─ address │           │
    │   ├─ city    │           │
    │   └─ pincode │           │
    └──────────────┘           │
                               │
                               │  Reference
                               │
                    ┌──────────┴──────────┐
                    │       ORDER         │
                    ├─────────────────────┤
                    │ _id                 │
                    │ user (ObjectId) ────┘
                    │ items[]             │
                    │ shippingAddress{}   │
                    │ deliveryOption      │
                    │ deliveryCharge      │
                    │ paymentMethod       │
                    │ status              │
                    │ tracking[]          │
                    │   ├─ status         │
                    │   ├─ message        │
                    │   └─ timestamp      │
                    │ courierDetails{}    │
                    │   ├─ courierName    │
                    │   ├─ trackingNumber │
                    │   └─ awbNumber      │
                    │ totalAmount         │
                    │ returnRequested     │
                    │ refundStatus        │
                    └─────────────────────┘
                               │
                               │ Items Reference
                               ↓
                    ┌──────────────────┐
                    │     PRODUCT      │
                    ├──────────────────┤
                    │ _id              │
                    │ pname            │
                    │ pprice           │
                    │ pcategory        │
                    │ image            │
                    │ description      │
                    │ seller (ObjectId)│
                    │ stock            │
                    └──────────────────┘
```

---

## 🔌 API Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      API REQUEST FLOW                            │
└─────────────────────────────────────────────────────────────────┘

Frontend                  Backend                    Database
  │                         │                           │
  │ 1. Add to Cart         │                           │
  │────────────────────────►│                           │
  │    (localStorage)       │                           │
  │◄────────────────────────│                           │
  │                         │                           │
  │ 2. Place Order         │                           │
  │────POST /order/add─────►│                           │
  │                         │─────Insert Order─────────►│
  │                         │◄─────Order Created───────│
  │◄────Order Response──────│                           │
  │                         │                           │
  │ 3. Get Order           │                           │
  │──GET /order/getbyid────►│                           │
  │                         │─────Find Order───────────►│
  │                         │◄─────Order Data──────────│
  │◄────Order Data──────────│                           │
  │                         │                           │
  │ 4. Update Status       │                           │
  │─PUT /order/update──────►│                           │
  │                         │─────Update Order─────────►│
  │                         │◄─────Updated─────────────│
  │◄────Success─────────────│                           │
  │                         │                           │
  │ 5. Track Order         │                           │
  │─GET /order/tracking────►│                           │
  │                         │─────Get Tracking─────────►│
  │                         │◄─────Tracking Data───────│
  │◄────Tracking Info───────│                           │
```

---

## 📱 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT STRUCTURE                           │
└─────────────────────────────────────────────────────────────────┘

App
 │
 ├─ Layout
 │   ├─ Navbar
 │   ├─ Footer
 │   └─ CartContext Provider
 │
 ├─ Product Pages
 │   ├─ ProductCard
 │   │   └─ Add to Cart Button
 │   │
 │   └─ ProductDetail
 │       └─ Add to Cart Button
 │
 ├─ CartPage (Sidebar)
 │   ├─ Cart Items List
 │   ├─ Quantity Controls
 │   ├─ Total Display
 │   └─ Proceed to Pay Button
 │
 ├─ CheckOut (Multi-Step)
 │   ├─ Progress Steps
 │   │
 │   ├─ Step 1: Address
 │   │   ├─ Address List
 │   │   ├─ Address Form
 │   │   └─ Pincode Verification
 │   │
 │   ├─ Step 2: Delivery
 │   │   ├─ Normal Option
 │   │   └─ Fast Option
 │   │
 │   ├─ Step 3: Payment
 │   │   ├─ Payment Methods List
 │   │   └─ Selection Radio Buttons
 │   │
 │   ├─ Step 4: Confirmation
 │   │   ├─ Order Summary
 │   │   ├─ PaymentGateway (if online)
 │   │   └─ Confirm Button
 │   │
 │   └─ Order Summary Sidebar
 │       ├─ Items List
 │       ├─ Price Breakdown
 │       └─ Delivery Info
 │
 ├─ OrderTracking
 │   ├─ Order List (Sidebar)
 │   ├─ Order Details
 │   ├─ Status Progress Bar
 │   ├─ Delivery Info
 │   ├─ Items Display
 │   └─ Action Buttons
 │
 └─ Seller Dashboard
     └─ SellerOrderManagement
         ├─ Filter Tabs
         ├─ Orders List
         ├─ Order Details Sidebar
         └─ Action Buttons
```

---

## ⚡ Real-Time Updates Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               NOTIFICATION & UPDATE FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Event                   System                    Notification
  │                       │                           │
  │ Order Placed         │                           │
  │─────────────────────►│                           │
  │                       │───SMS to Customer────────►│
  │                       │───Email Confirmation─────►│
  │                       │───Notify Seller──────────►│
  │                       │                           │
  │ Status: Processing   │                           │
  │─────────────────────►│                           │
  │                       │───SMS Update─────────────►│
  │                       │───Push Notification──────►│
  │                       │                           │
  │ Status: Shipped      │                           │
  │─────────────────────►│                           │
  │                       │───SMS with Tracking──────►│
  │                       │───Email with Details─────►│
  │                       │                           │
  │ Status: Delivered    │                           │
  │─────────────────────►│                           │
  │                       │───SMS Confirmation───────►│
  │                       │───Email Thank You────────►│
  │                       │───Request Review─────────►│
```

---

## 🎨 User Interface Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      UI NAVIGATION MAP                           │
└─────────────────────────────────────────────────────────────────┘

Home Page
    │
    ├─► Products ──► Product Detail ──► Add to Cart
    │                                         │
    │                                         ↓
    └────────────────────────────────► Cart Sidebar
                                             │
                                             ↓
                                      Proceed to Pay
                                             │
                                             ↓
                                         Checkout
                                       (4 Steps)
                                             │
                                             ↓
                                    Order Confirmation
                                             │
                                             ↓
                                     Order Tracking
                                             │
                         ┌───────────────────┼───────────────────┐
                         │                   │                   │
                         ↓                   ↓                   ↓
                    My Orders          Need Help?          Download Invoice
```

---

## 📊 Order Metrics Dashboard (Seller View)

```
┌────────────────────────────────────────────────────────────────┐
│                    SELLER DASHBOARD                             │
└────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │  TODAY'S ORDERS  │  │  THIS MONTH      │  │  PENDING ORDERS  │
    │      5 📦        │  │      127 📦      │  │      12 ⏰       │
    │   ₹4,999 💰     │  │   ₹67,890 💰    │  │                  │
    └──────────────────┘  └──────────────────┘  └──────────────────┘

    ┌────────────────────────────────────────────────────────────┐
    │                    ORDER STATUS BREAKDOWN                   │
    │                                                            │
    │  New Orders:         8  ████████░░                        │
    │  Processing:         5  █████░░░░░                        │
    │  Shipped:           15  ███████████████                   │
    │  Delivered:         99  ██████████████████████████████    │
    │  Returns:            3  ███░░░░░░░                        │
    └────────────────────────────────────────────────────────────┘

    Recent Orders:
    ┌─────────┬────────────┬───────────┬──────────────┐
    │ Order # │   Date     │  Status   │    Amount    │
    ├─────────┼────────────┼───────────┼──────────────┤
    │ #A1B2C3 │ Today 2:30 │ Placed    │    ₹1,299   │
    │ #D4E5F6 │ Today 1:15 │ Processing│    ₹2,499   │
    │ #G7H8I9 │ Yesterday  │ Shipped   │    ₹899     │
    └─────────┴────────────┴───────────┴──────────────┘
```

---

## 🔐 Security & Authentication Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   SECURITY ARCHITECTURE                         │
└────────────────────────────────────────────────────────────────┘

User Registration/Login
        │
        ├─► Password Hashing (bcrypt)
        │       │
        │       ↓
        │   Store in Database
        │
        ↓
    JWT Token Generated
        │
        ├─► Stored in sessionStorage
        │
        ↓
Protected Routes
        │
        ├─► Token Verification Middleware
        │       │
        │       ├─► Valid → Access Granted
        │       └─► Invalid → Redirect to Login
        │
        ↓
Secure API Calls
        │
        └─► Headers: { Authorization: Bearer <token> }

Payment Security
        │
        ├─► HTTPS Encryption
        ├─► Stripe PCI Compliance
        ├─► No card storage
        └─► tokenized payments
```

---

**This visual guide provides a clear understanding of the complete order flow system! 🎉**

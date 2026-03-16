# 🛠️ BolBazar - Complete Technology Stack

## 📊 Overview
**BolBazar** is a **full-stack MERN** e-commerce platform with modern technologies for scalability and great user experience.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   FRONTEND (Next.js + React)        │
│   Port: 3000                        │
├─────────────────────────────────────┤
│   API Calls (REST/HTTP)             │
├─────────────────────────────────────┤
│   BACKEND (Express.js + Node.js)    │
│   Port: 5000                        │
├─────────────────────────────────────┤
│   Database (MongoDB)                │
│   ORM: Mongoose                     │
└─────────────────────────────────────┘
```

---

## 📱 FRONTEND TECHNOLOGIES

### **Core Framework**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.2.35 | React framework with SSR, routing, optimization |
| **React** | 18 | UI library for component-based development |
| **React DOM** | 18 | DOM rendering for React components |

### **Styling & UI**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **DaisyUI** | 4.7.2 | Component library built on Tailwind |
| **PostCSS** | 8.4.35 | CSS transformation |
| **Autoprefixer** | 10.4.18 | Vendor prefix automation |

### **State Management & Context**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Context API** | Built-in | Global state management |
| **AppContext** | Custom | User authentication & app state |
| **CartContext** | Custom | Shopping cart state |
| **SellerContext** | Custom | Seller-specific state |
| **VoiceContext** | Custom | Voice command state |

### **Form Handling & Validation**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Formik** | 2.4.5 | Form state management |
| **Yup** | 1.4.0 | Schema validation |

### **Voice & Speech**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **react-speech-recognition** | 3.10.0 | Speech-to-text recognition |
| **regenerator-runtime** | 0.14.1 | Async/await support for speech |
| **Web Speech API** | Browser Native | Voice recognition & synthesis |

### **Payment Integration**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **@stripe/stripe-js** | 3.3.0 | Stripe SDK |
| **@stripe/react-stripe-js** | 2.7.0 | React Stripe components |
| **react-stripe-js** | 1.1.5 | Additional Stripe integration |

### **Animations & Effects**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Framer Motion** | 11.1.7 | Smooth animations & transitions |
| **react-confetti** | 6.4.0 | Celebration effects |

### **UI Components & Icons**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **@headlessui/react** | 1.7.18 | Headless UI components |
| **@heroicons/react** | 2.1.3 | Heroicons icon library |
| **@tabler/icons-react** | 3.1.0 | Tabler icons |
| **react-icons** | 5.1.0 | Multiple icon sets |

### **Charts & Data Visualization**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Chart.js** | 4.5.1 | Charting library |
| **react-chartjs-2** | 5.3.1 | React wrapper for Chart.js |
| **Recharts** | 3.7.0 | React charts library |

### **UI/UX Components**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Swiper** | 11.1.1 | Image/product carousel/slider |
| **react-star-ratings** | 2.3.0 | Star rating component |
| **react-hot-toast** | 2.4.1 | Toast notifications |

### **Utilities**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **pluralize** | 8.0.0 | Singular/plural word conversion |
| **string-similarity-js** | 2.1.4 | String similarity matching |

### **Development Tools**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **ESLint** | 8 | Code quality & linting |
| **next/lint** | Latest | Next.js linting |

---

## 🔌 BACKEND TECHNOLOGIES

### **Runtime & Framework**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest | JavaScript runtime |
| **Express.js** | 4.19.2 | Web framework for APIs |

### **Database**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 8.2.4 | MongoDB ODM/ORM |

### **Authentication & Security**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **jsonwebtoken** | 9.0.2 | JWT token generation & validation |
| **bcrypt** | 6.0.0 | Password hashing |
| **bcryptjs** | 3.0.3 | Alternative bcrypt library |

### **File Upload & Storage**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Multer** | 1.4.5-lts.1 | Middleware for file uploads |
| **Local Storage** | Built-in | File storage in `backend/static/uploads/` |

### **Email Service**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Nodemailer** | 7.0.12 | Email sending service |

### **Payment Processing**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Stripe** | 15.3.0 | Payment gateway integration |

### **CORS & Security**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.4.5 | Environment variable management |

### **Data Visualization** (Backend Support)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Chart.js** | 4.5.1 | Charting library |
| **react-chartjs-2** | 5.3.1 | Chart rendering |

### **Development Tools**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Nodemon** | 3.1.0 | Auto-restart server during development |

---

## 📊 Database Models

### **MongoDB Collections** (Mongoose Models)
```
├── users/              # Customer accounts
├── sellers/            # Seller accounts
├── admins/             # Admin accounts
├── products/           # Product listings
├── orders/             # Order management
├── reviews/            # Product reviews & ratings
├── feedback/           # User feedback
├── contacts/           # Contact messages
├── wishlists/          # Wishlist items
└── (More models based on requirements)
```

---

## 🔗 API Endpoints (Backend Routers)

```javascript
// Static Routes
GET  /static/uploads/  - File serving

// API Routes
POST   /auth/          - Authentication (login, signup)
GET    /user/          - User operations
POST   /user/          - Create/update user
GET    /seller/        - Seller operations
POST   /admin/         - Admin operations
GET    /product/       - Fetch products
POST   /product/       - Create/manage products
GET    /order/         - Order management
POST   /order/         - Create orders
POST   /review/        - Product reviews
GET    /feedback/      - User feedback
GET    /contact/       - Contact submissions
GET    /dashboard/     - Dashboard data
GET    /wishlist/      - Wishlist operations
GET    /util/          - Utility functions
```

---

## 🔐 Environment Variables Setup

### **Backend (.env)**
```
PORT=5000
MONGODB_URI=<mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
STRIPE_SECRET_KEY=<stripe_secret_key>
STRIPE_PUBLISHABLE_KEY=<stripe_publishable_key>
FRONTEND_URL=http://localhost:3000
EMAIL_USER=<nodemailer_email>
EMAIL_PASSWORD=<nodemailer_password>
```

### **Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_KEY=<stripe_publishable_key>
```

---

## 📦 Project Dependencies Summary

### **Frontend Dependencies: 27**
- UI Frameworks: Next.js, React
- Styling: Tailwind CSS, DaisyUI
- State: React Context API
- Forms: Formik, Yup
- Voice: react-speech-recognition
- Payment: Stripe React
- Charts: Chart.js, Recharts
- Icons: @tabler, @heroicons, react-icons
- Animations: Framer Motion
- Components: Swiper, react-star-ratings
- Notifications: react-hot-toast
- Utilities: pluralize, string-similarity-js

### **Backend Dependencies: 12**
- Server: Express.js
- Database: MongoDB, Mongoose
- Auth: JWT, bcrypt
- Files: Multer
- Email: Nodemailer
- Payment: Stripe
- Security: CORS, dotenv
- Dev: Nodemon
- Charts: Chart.js

---

## 🎯 Key Technology Choices & Rationale

### **Why Next.js 14?**
- ✅ Built-in routing (file-based)
- ✅ Server-side rendering (better SEO)
- ✅ API routes
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ TypeScript support

### **Why MongoDB?**
- ✅ Flexible schema for e-commerce
- ✅ Scalable for products, orders, users
- ✅ Easy to work with JSON-like documents
- ✅ Mongoose provides validation

### **Why Stripe?**
- ✅ Secure payment processing
- ✅ PCI compliance included
- ✅ Multiple payment methods
- ✅ Test mode for development

### **Why React Context API?**
- ✅ No extra dependencies
- ✅ Good for app-wide state (auth, cart, voice)
- ✅ Easy to implement
- ✅ Perfect for medium-sized apps

### **Why Tailwind CSS?**
- ✅ Utility-first approach
- ✅ Highly customizable
- ✅ Smaller CSS bundle
- ✅ Rapid development

---

## 🚀 Development & Deployment Commands

### **Frontend**
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run linter
npm run clean        # Clean build files
npm run fresh        # Clean + rebuild + dev
npm run safe-dev     # Kill port 3000 + fresh start
```

### **Backend**
```bash
npm run start        # Start server (port 5000)
npm run dev          # Start with nodemon (auto-reload)
```

---

## 📱 Browser Compatibility

### **Supported Browsers**
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### **Voice Feature Requirements**
- ✅ Chrome (Best)
- ✅ Edge (Best)
- ⚠️ Firefox (Limited)
- ❌ Safari (Limited/No support)

---

## 🔄 Request/Response Flow

```
1. User Action (Frontend)
   ↓
2. React Component State Update
   ↓
3. API Call via fetch/axios
   ↓
4. Express Router (Backend)
   ↓
5. Mongoose Model (Database Query)
   ↓
6. MongoDB Response
   ↓
7. Express Response (JSON)
   ↓
8. Frontend Updates State/UI
   ↓
9. User Sees Updated Content
```

---

## 📊 Performance Features

### **Frontend**
- Next.js Image Optimization
- Code Splitting & Lazy Loading
- CSS Minification (Tailwind)
- Font Optimization
- Bundle Analysis

### **Backend**
- Connection Pooling (MongoDB)
- Indexed Database Queries
- CORS Optimization
- Middleware Optimization

---

## 🔒 Security Features

### **Frontend**
- HTTPS enforcement
- CORS policy
- XSS prevention (React auto-escape)
- CSRF tokens (Stripe)

### **Backend**
- JWT token-based auth
- bcrypt password hashing
- CORS middleware
- Environment variable protection
- Input validation (Yup)

---

## 📈 Scalability & Performance

| Component | Scalability |
|-----------|------------|
| Frontend | Vercel deployment ready |
| Backend | Can scale horizontally with PM2 |
| Database | MongoDB cloud (Atlas) support |
| Files | S3/Cloud storage ready |
| Payment | Stripe handles volume |

---

## 🎓 Technology Learning Path

If new to the stack, learn in this order:
1. **HTML/CSS** → Foundation
2. **JavaScript** → Language
3. **React** → Frontend library
4. **Next.js** → React framework
5. **Node.js/Express** → Backend
6. **MongoDB** → Database
7. **REST APIs** → Communication

---

## 📚 Useful Resources

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Express**: https://expressjs.com
- **MongoDB**: https://docs.mongodb.com
- **Mongoose**: https://mongoosejs.com
- **Tailwind**: https://tailwindcss.com
- **Stripe**: https://stripe.com/docs

---

## Summary Table

| Layer | Technology | Version | Purpose |
|--------|-----------|---------|---------|
| **Frontend Framework** | Next.js | 14.2.35 | React SSR framework |
| **UI Library** | React | 18 | Component library |
| **Styling** | Tailwind CSS + DaisyUI | 3.4.1 | CSS framework |
| **Voice** | react-speech-recognition | 3.10.0 | Voice commands |
| **State** | React Context | Built-in | Global state |
| **Forms** | Formik + Yup | 2.4.5, 1.4.0 | Form handling |
| **Payment** | Stripe | 15.3.0 | Payments |
| **Runtime** | Node.js | Latest | Server runtime |
| **Framework** | Express.js | 4.19.2 | Web framework |
| **Database** | MongoDB | Latest | NoSQL DB |
| **ORM** | Mongoose | 8.2.4 | MongoDB ODM |
| **Auth** | JWT + bcrypt | 9.0.2, 6.0.0 | Authentication |

---

**Total Technologies Used: 40+**
**Frontend Libraries: 27**
**Backend Libraries: 12**
**Dev Tools: Multiple**

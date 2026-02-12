# 🔐 Admin Security & Authentication Guide

## Overview
BOLBAZAR Admin System uses **environment-based authentication** with **bcrypt password hashing** for maximum security. Only pre-registered master admin can access the system.

---

## 🎯 Key Security Features

✅ **Single Master Admin** - Only one admin can login  
✅ **No Public Signup** - Admin registration endpoint disabled  
✅ **Environment Variables** - Credentials not hardcoded  
✅ **Bcrypt Hashing** - Industry-standard password encryption  
✅ **JWT Authentication** - Secure token-based sessions  
✅ **Role-based Access** - Admin role in JWT payload  

---

## 🔑 Master Admin Credentials

### Default Login Credentials:
```
Email: admin@bolbazar.com
Password: Admin@12345
```

> ⚠️ **Important:** Change these credentials before deploying to production!

---

## 🚀 How to Login as Admin

### API Endpoint:
```http
POST http://localhost:5000/admin/authenticate
Content-Type: application/json

{
  "email": "admin@bolbazar.com",
  "password": "Admin@12345"
}
```

### Successful Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "fname": "Super",
  "lname": "Admin",
  "email": "admin@bolbazar.com",
  "role": "admin",
  "message": "Login successful"
}
```

### Error Response (Invalid Credentials):
```json
{
  "message": "Invalid admin credentials"
}
```

---

## 🔧 How to Change Admin Password

### Step 1: Generate New Password Hash
```bash
cd backend
node utils/hashPassword.js "YourNewPassword123"
```

### Step 2: Copy the Generated Hash
You'll see output like:
```
🔐 Password Hashing Successful!

Original Password: YourNewPassword123
Hashed Password: $2b$10$abc123xyz...

📝 Copy this hash to your .env file as MASTER_ADMIN_PASSWORD_HASH
```

### Step 3: Update .env File
Open `backend/.env` and update:
```env
MASTER_ADMIN_PASSWORD_HASH=$2b$10$abc123xyz...
```

### Step 4: Restart Backend Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm start
```

---

## 📂 File Structure

### Backend Files:
```
backend/
├── .env                              # Admin credentials (hashed)
├── routers/
│   └── adminRouter.js               # Admin authentication logic
├── models/
│   └── adminModel.js                # Admin schema (for reference)
└── utils/
    └── hashPassword.js              # Password hash generator
```

### Key Configuration (.env):
```env
# Master Admin Credentials
MASTER_ADMIN_EMAIL=admin@bolbazar.com
MASTER_ADMIN_PASSWORD_HASH=$2b$10$uHR4D1lw0pypVggSZEJLFO.YKqnd7d0a0uXxTeLSJjNGcrjJqz/m2
MASTER_ADMIN_FNAME=Super
MASTER_ADMIN_LNAME=Admin
```

---

## 🛡️ Security Implementation Details

### 1. Disabled Public Admin Registration
```javascript
// backend/routers/adminRouter.js
router.post('/add', (req, res) => {
    res.status(403).json({ 
        message: 'Admin registration is disabled for security reasons.' 
    });
});
```

### 2. Bcrypt Password Verification
```javascript
// Password comparison using bcrypt
const isPasswordValid = await bcrypt.compare(
    password, 
    process.env.MASTER_ADMIN_PASSWORD_HASH
);
```

### 3. JWT Token Generation
```javascript
// Token with admin role and 2-day expiration
jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2 days' })
```

---

## 🧪 Testing Admin Login

### Using Thunder Client / Postman:
1. Create POST request to `http://localhost:5000/admin/authenticate`
2. Set Headers: `Content-Type: application/json`
3. Body (raw JSON):
   ```json
   {
     "email": "admin@bolbazar.com",
     "password": "Admin@12345"
   }
   ```
4. Send request
5. Save the `token` from response for authenticated requests

### Using cURL:
```bash
curl -X POST http://localhost:5000/admin/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bolbazar.com","password":"Admin@12345"}'
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Change default password immediately
- Use strong passwords (min 12 characters, mixed case, numbers, symbols)
- Keep `.env` file in `.gitignore`
- Use different passwords for development and production
- Rotate passwords periodically
- Monitor failed login attempts

### ❌ DON'T:
- Share admin credentials via email/chat
- Commit `.env` file to git
- Use simple passwords like "admin123"
- Store passwords in plain text
- Give admin access to regular users

---

## 🚨 Troubleshooting

### Issue: "Invalid admin credentials"
**Solution:** 
- Verify email matches exactly: `admin@bolbazar.com`
- Check password is correct
- Ensure password hash in .env is not corrupted

### Issue: "Error creating authentication token"
**Solution:**
- Check `JWT_SECRET` is set in `.env`
- Restart backend server

### Issue: Admin signup returns 403
**Solution:**
- This is expected behavior for security
- Only login is allowed, not signup

---

## 📊 Authentication Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ Post credentials
       ▼
┌─────────────────────┐
│   adminRouter.js    │
│  /authenticate      │
└──────┬──────────────┘
       │ 1. Check email
       ▼
┌─────────────────────┐
│  Email matches?     │
└──────┬──────────────┘
       │ Yes
       ▼
┌─────────────────────┐
│ bcrypt.compare()    │
│ Password valid?     │
└──────┬──────────────┘
       │ Yes
       ▼
┌─────────────────────┐
│  Generate JWT       │
│  Token + User Data  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   Return Token      │
│   + Admin Data      │
└─────────────────────┘
```

---

## 🔄 Future Enhancements (Optional)

### Planned Security Features:
- [ ] Two-Factor Authentication (2FA)
- [ ] Login attempt rate limiting
- [ ] Admin activity logging
- [ ] Session management
- [ ] IP whitelisting
- [ ] Email notifications on login

---

## 📞 Support

For security concerns or issues:
1. Check this documentation first
2. Review backend logs for error messages
3. Verify environment variables are set correctly
4. Contact system administrator

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Implemented bcrypt password hashing
- ✅ Disabled public admin registration
- ✅ Environment-based master admin
- ✅ JWT authentication with role
- ✅ Secure login endpoint

---

**Last Updated:** February 12, 2026  
**Status:** Production Ready 🚀

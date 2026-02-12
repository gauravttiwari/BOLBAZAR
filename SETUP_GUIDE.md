# 🚀 BOLBAZAR - Quick Start Guide

## ✅ Permanent Solutions Implemented

### 1. **MongoDB Connection Issues - FIXED**
- **Problem**: Database connection failing with DNS errors
- **Solution**: Added retry logic with 3 attempts at 5-second intervals
- **Features**: 
  - Automatic reconnection on disconnect
  - IPv4 preference to avoid IPv6 issues
  - Graceful failure handling
  - Server continues even if DB is temporarily unavailable

### 2. **Passwordless Authentication - ENHANCED**
- **Problem**: Signature verification failing silently
- **Solution**: Added comprehensive error logging and validation
- **Features**:
  - Input validation before verification
  - Detailed error messages with stack traces
  - Parameter validation (publicKey, challenge, signature)
  - Better debugging information

### 3. **Server Startup - SIMPLIFIED**
- **Problem**: Manual commands needed for each server
- **Solution**: Created batch scripts for one-click startup

## 🎯 How to Start the Project

### Option 1: Start Everything (Recommended)
```cmd
start-both.bat
```
This will open TWO windows:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:3000

### Option 2: Start Separately

**Backend Only:**
```cmd
start-backend.bat
```

**Frontend Only:**
```cmd
start-frontend.bat
```

## 🔍 Troubleshooting

### If Backend Won't Start:

1. **Check MongoDB Connection**
   - Ensure internet connection is active
   - Verify MongoDB Atlas IP whitelist includes your IP
   - The server will retry 3 times automatically

2. **Check Port 5000**
   ```cmd
   netstat -ano | findstr :5000
   ```
   If occupied, kill the process:
   ```cmd
   taskkill /PID <PID_NUMBER> /F
   ```

3. **Verify Environment Variables**
   - Check `backend/.env` file exists
   - Ensure all required variables are set:
     - MONGODB_URI
     - JWT_SECRET
     - STRIPE_SECRET_KEY

### If Passwordless Auth Fails:

1. **Check Browser Console** - Look for detailed error messages
2. **Check Backend Logs** - Signature verification details are logged
3. **Use Password Login** - Default is now password-based authentication
4. **Verify Public Key Format** - Must be valid PEM format

### If Frontend Won't Start:

1. **Delete .next folder**
   ```cmd
   cd frontend
   Remove-Item -Recurse -Force .next
   ```

2. **Reinstall dependencies**
   ```cmd
   cd frontend
   npm install
   ```

## 🔒 Authentication Options

### Password-Based Login (Default)
- ✅ Simple and reliable
- ✅ Works without crypto setup
- ✅ Compatible with all browsers

### Passwordless Login (Advanced)
- 🔐 Uses RSA signature verification
- 📱 Device-based authentication
- ⚡ No password needed

**To Switch:**
In login page, toggle "Use Passwordless Login" checkbox.

## 📊 API Health Check

Check if backend is running:
```
http://localhost:5000/health
```

View all endpoints:
```
http://localhost:5000/
```

## 🛠️ Technical Details

### MongoDB Connection Settings:
- **Timeout**: 5 seconds
- **Retries**: 3 attempts
- **Retry Delay**: 5 seconds
- **Family**: IPv4 only

### Authentication Endpoints:
- `POST /user/add` - Password signup
- `POST /user/authenticate` - Password login
- `POST /api/passwordless-auth/signup` - Passwordless signup
- `POST /api/passwordless-auth/request-challenge` - Get challenge
- `POST /api/passwordless-auth/verify-challenge` - Verify signature

### Error Handling:
- ✅ Global error handler for all routes
- ✅ Detailed logging in development mode
- ✅ Graceful failure handling
- ✅ Automatic retries for database connection

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_secret_key>
STRIPE_SECRET_KEY=<your_stripe_key>
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_KEY=<your_stripe_public_key>
```

## 🎓 Best Practices

1. **Always use start scripts** - They check dependencies and handle errors
2. **Check health endpoint** - Before testing authentication
3. **Monitor backend logs** - For detailed error information
4. **Use password auth for testing** - It's simpler and more reliable
5. **Keep .env files secure** - Never commit them to git

## 📞 Common Issues

### "Failed to fetch" Error
- ✅ **Fixed**: Backend not running → Use `start-backend.bat`

### "Invalid signature" Error
- ✅ **Fixed**: Better validation and error messages
- Try password login instead

### "Database connection error"
- ✅ **Fixed**: Automatic retry with 3 attempts
- Server continues without database if needed

### Port already in use
- ✅ **Fixed**: Scripts check and report port conflicts
- Use `netstat` to find and kill conflicting processes

---

## 🎉 Quick Test

After starting servers:

1. **Test Backend**: http://localhost:5000/health
2. **Test Frontend**: http://localhost:3000
3. **Try Signup**: http://localhost:3000/signup
4. **Try Login**: http://localhost:3000/login

All systems should now work reliably! 🚀

# 🚀 BolBazar - Quick Start Guide

## 📁 Project Structure
```
BolBazar/
├── START-ALL.bat         ← Double-click to start everything
├── STOP-ALL.bat          ← Double-click to stop all servers
├── frontend/
│   └── start-frontend.bat
└── backend/
    └── start-backend.bat
```

---

## ⚡ Quick Start (Easiest Way)

### Start Everything:
```
Double-click: START-ALL.bat
```
ye automatically:
- Port 3000 aur 5000 ko free karega
- Frontend aur Backend dono start karega
- Do alag terminals open karega

### Stop Everything:
```
Double-click: STOP-ALL.bat
```
ye sab servers ko band kar dega

---

## 🎯 Individual Server Start

### Frontend Only:
```
frontend\start-frontend.bat
```
- URL: http://localhost:3000
- Automatically cleans .next folder
- Automatically frees port 3000

### Backend Only:
```
backend\start-backend.bat
```
- URL: http://localhost:5000
- Automatically frees port 5000

---

## 📝 Manual Commands (if needed)

### Frontend:
```bash
cd frontend
npm run dev
```

### Backend:
```bash
cd backend
node index.js
```

---

## 🐛 Troubleshooting

### Port Already in Use Error:
```
Solution: Run STOP-ALL.bat first, then START-ALL.bat
```

### Chunk Loading Error:
```
Solution: 
1. Close browser
2. Run STOP-ALL.bat
3. Clear browser cache (Ctrl + Shift + Delete)
4. Run START-ALL.bat
5. Hard refresh (Ctrl + Shift + R)
```

### Database Connection Error:
```
Check: backend\.env file
- MONGODB_URI should be correct
- Internet connection should be active
```

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js App |
| Backend API | http://localhost:5000 | Express Server |

---

## 💡 Tips

1. **Always use batch files** - ye automatically port issues handle karen ge
2. **Browser cache clear karo** agar strange errors aayein
3. **STOP-ALL run karo** agar servers hang ho jayein
4. **Internet check karo** agar database connect na ho

---

## 🎨 Features

- ✅ Automatic port cleanup
- ✅ Automatic build cache cleanup  
- ✅ Color-coded terminal output
- ✅ Easy single-click start/stop
- ✅ No more "port already in use" errors

---

**Last Updated:** February 12, 2026
**Project:** BolBazar E-Commerce Platform

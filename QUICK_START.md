# Quick Start Guide - InstaFlow Automator

## 🚀 Get Running in 5 Minutes

### Step 1: Backend Setup (2 minutes)
```bash
# Create backend directory
mkdir instaflow-backend
cd instaflow-backend

# Copy the backend files
# Copy backend-package.json to package.json
# Copy backend-server.js to server.js
# Copy backend-.env.example to .env

# Install dependencies
npm install

# Configure environment
# Edit .env file with your Meta App credentials
```

### Step 2: Meta App Setup (2 minutes)
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create new app → Business type
3. Add Instagram Basic Display + Instagram Graph API
4. Set OAuth redirect: `http://localhost:5173/auth/callback`
5. Copy App ID and App Secret to backend `.env`

### Step 3: Start Everything (1 minute)
```bash
# Terminal 1: Start backend
cd instaflow-backend
npm run dev

# Terminal 2: Start frontend
cd instaflow-frontend
npm run dev
```

### Step 4: Test Connection
1. Open `http://localhost:5173`
2. Click "Connect Instagram Business"
3. Complete OAuth flow
4. Start creating automation flows!

## 🔧 Environment Files

### Backend `.env`:
```env
PORT=3001
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
REDIRECT_URI=http://localhost:5173/auth/callback
```

### Frontend `.env`:
```env
VITE_META_APP_ID=your_app_id_here
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:3001
```

## ✅ Verification Checklist
- [ ] Backend server running on port 3001
- [ ] Frontend running on port 5173
- [ ] Meta App configured with correct redirect URI
- [ ] Environment variables set correctly
- [ ] Instagram Business account connected to Facebook page

## 🆘 Common Issues
- **"App ID not configured"** → Check frontend `.env`
- **"Backend not running"** → Start backend server first
- **"OAuth redirect mismatch"** → Verify Meta App settings
- **"Network Error"** → Ensure backend is accessible

## 📚 Next Steps
1. Configure webhooks for real-time events
2. Create your first automation flow
3. Test with real Instagram interactions
4. Deploy to production when ready

Need help? Check the full SETUP_GUIDE.md for detailed instructions!
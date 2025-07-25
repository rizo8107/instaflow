# InstaFlow Automator - Complete Setup Guide

## Overview
This guide will walk you through setting up the complete InstaFlow Automator application, including the required backend server for Instagram OAuth integration.

## Prerequisites
- Node.js 18+ installed
- A Meta Developer account
- An Instagram Business account
- Basic knowledge of environment variables

## Step 1: Meta App Configuration

### 1.1 Create Meta App
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "Create App" → "Business" → "Next"
3. Enter app name: "InstaFlow Automator"
4. Enter contact email and click "Create App"

### 1.2 Add Instagram Products
1. In your app dashboard, click "Add Product"
2. Add "Instagram Basic Display"
3. Add "Instagram Graph API"
4. Add "Webhooks"

### 1.3 Configure Instagram Basic Display
1. Go to Instagram Basic Display → Basic Display
2. Click "Create New App"
3. Add OAuth Redirect URI: `http://localhost:5173/auth/callback`
4. Add Deauthorize Callback URL: `http://localhost:3001/auth/deauthorize`
5. Add Data Deletion Request URL: `http://localhost:3001/auth/data-deletion`

### 1.4 Configure Instagram Graph API
1. Go to Instagram Graph API → Configuration
2. Add the same redirect URI: `http://localhost:5173/auth/callback`

### 1.5 Get App Credentials
1. Go to App Settings → Basic
2. Copy your "App ID" and "App Secret"
3. Keep these secure - you'll need them for environment variables

## Step 2: Backend Server Setup

### 2.1 Create Backend Directory
```bash
mkdir instaflow-backend
cd instaflow-backend
npm init -y
```

### 2.2 Install Backend Dependencies
```bash
npm install express cors dotenv axios helmet morgan
npm install -D nodemon @types/node typescript
```

### 2.3 Backend Environment Variables
Create `.env` file in backend directory:
```env
PORT=3001
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here
REDIRECT_URI=http://localhost:5173/auth/callback
NODE_ENV=development
```

## Step 3: Frontend Environment Setup

### 3.1 Frontend Environment Variables
In your frontend root directory, update `.env`:
```env
VITE_META_APP_ID=your_meta_app_id_here
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:3001
```

## Step 4: Instagram Business Account Setup

### 4.1 Connect Instagram to Facebook Page
1. Go to your Facebook Page settings
2. Click "Instagram" in the left sidebar
3. Connect your Instagram Business account
4. Ensure it's set to "Business" account type

### 4.2 Required Permissions
Your app needs these permissions (request in App Review):
- `pages_manage_engagement`
- `instagram_manage_messages`
- `pages_show_list`
- `instagram_basic`
- `pages_manage_metadata`
- `pages_read_engagement`

## Step 5: Webhook Configuration

### 5.1 Configure Webhook in Meta App
1. Go to Webhooks in your Meta App
2. Click "Add Subscription"
3. Callback URL: `http://localhost:3001/webhook/instagram`
4. Verify Token: `instaflow_webhook_verify_token_2024`
5. Subscribe to fields:
   - `messages`
   - `messaging_postbacks`
   - `comments`
   - `mentions`

### 5.2 Use ngrok for Local Development
```bash
# Install ngrok globally
npm install -g ngrok

# Expose your backend server
ngrok http 3001
```
Use the ngrok URL for webhook configuration in production testing.

## Step 6: Running the Application

### 6.1 Start Backend Server
```bash
cd instaflow-backend
npm run dev
```

### 6.2 Start Frontend Application
```bash
cd instaflow-frontend
npm run dev
```

### 6.3 Access the Application
1. Open `http://localhost:5173`
2. Click "Connect Instagram Business"
3. Complete OAuth flow
4. Start creating automation flows!

## Step 7: Testing

### 7.1 Test OAuth Flow
1. Click connect button
2. Authorize with Instagram
3. Verify successful connection

### 7.2 Test Webhooks
1. Configure webhook URL in app
2. Send test message to your Instagram
3. Check webhook delivery in dashboard

## Troubleshooting

### Common Issues

**"App ID not configured"**
- Check `VITE_META_APP_ID` in frontend `.env`
- Ensure no extra spaces or quotes

**"Backend server not running"**
- Verify backend is running on port 3001
- Check `VITE_API_BASE_URL` points to correct backend

**"OAuth redirect mismatch"**
- Ensure redirect URI matches exactly in Meta App settings
- Check for trailing slashes or protocol mismatches

**"Webhook verification failed"**
- Verify token must match exactly: `instaflow_webhook_verify_token_2024`
- Check webhook URL is accessible from internet

### Development vs Production

**Development:**
- Use `localhost` URLs
- Use ngrok for webhook testing
- Keep app in development mode

**Production:**
- Use HTTPS URLs
- Configure proper domain in Meta App
- Submit app for review for required permissions

## Security Notes

1. **Never expose App Secret in frontend**
2. **Use HTTPS in production**
3. **Validate webhook signatures**
4. **Implement rate limiting**
5. **Store tokens securely**

## Next Steps

1. Complete Meta App Review for required permissions
2. Set up production server with HTTPS
3. Configure production webhook URLs
4. Implement additional automation features
5. Add user management and multi-tenant support

## Support

- Meta Developer Documentation: https://developers.facebook.com/docs/instagram-api
- Instagram Graph API: https://developers.facebook.com/docs/instagram-api/
- Webhook Guide: https://developers.facebook.com/docs/graph-api/webhooks/

For issues with this setup, check the console logs and ensure all environment variables are correctly configured.
# Meta App Webhook Configuration Guide

Based on your Meta Developer Console screenshot, here's how to configure the webhooks properly:

## Step 1: Configure Webhooks (Section 2 in your screenshot)

### Callback URL
In the "Callback URL" field, enter:
```
https://your-ngrok-url.ngrok.io/webhook/instagram
```

**For local development, you need ngrok:**
```bash
# Install ngrok
npm install -g ngrok

# In a new terminal, expose your backend server
ngrok http 3001

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Use: https://abc123.ngrok.io/webhook/instagram
```

### Verify Token
In the "Verify token" field, enter exactly:
```
instaflow_webhook_verify_token_2024
```

### Webhook Fields to Subscribe
After saving the webhook URL, you'll need to subscribe to these fields:
- `messages`
- `messaging_postbacks` 
- `comments`
- `mentions`

## Step 2: Set App Mode to Live
I notice your app is in "Development" mode. For webhooks to work properly:

1. Click the toggle next to "App Mode: Development" 
2. Switch it to "Live"
3. This allows webhooks to receive real events

## Step 3: Complete Instagram Business Login (Section 3)
1. Click "Set up" button in section 3
2. This will configure the Instagram Business API permissions

## Step 4: Backend Server Setup

Make sure your backend server is running with these exact settings:

### backend/.env
```env
PORT=3001
META_APP_ID=915653410738806
META_APP_SECRET=your_app_secret_here
REDIRECT_URI=http://localhost:5173/auth/callback
WEBHOOK_VERIFY_TOKEN=instaflow_webhook_verify_token_2024
```

### Start Backend Server
```bash
cd instaflow-backend
npm run dev
```

### Start ngrok (in separate terminal)
```bash
ngrok http 3001
```

## Step 5: Test Webhook
1. After configuring the webhook URL and verify token
2. Click "Verify and save" 
3. Meta will send a verification request to your webhook
4. Your backend server should respond with the challenge

## Step 6: Frontend Configuration

### frontend/.env
```env
VITE_META_APP_ID=915653410738806
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:3001
```

## Troubleshooting

### If webhook verification fails:
1. Check that ngrok is running and accessible
2. Verify the backend server is responding at `/webhook/instagram`
3. Ensure the verify token matches exactly
4. Check backend console logs for verification attempts

### If OAuth fails:
1. Make sure redirect URI is exactly: `http://localhost:5173/auth/callback`
2. Verify App ID matches in both frontend and backend
3. Ensure App Secret is only in backend .env file

## Testing Flow
1. Configure webhook with ngrok URL
2. Switch app to Live mode
3. Complete Instagram Business login setup
4. Test OAuth flow from frontend
5. Send test message to your Instagram to trigger webhook

Let me know if you need help with any of these steps!
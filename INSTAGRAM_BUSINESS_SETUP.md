# Instagram Business API Setup Guide

## Complete Setup for InstaFlow Automator

This guide walks you through setting up Instagram Business API integration with all required URLs and configurations.

## Prerequisites

- Instagram Business Account (not Personal)
- Facebook Page connected to Instagram Business Account
- Meta Developer Account
- n8n instance (for webhooks)

## Step 1: Meta Developer App Setup

### 1.1 Create Meta App
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"Create App"**
3. Select **"Business"** as app type
4. Enter app details:
   - **App Name**: InstaFlow Automator
   - **Contact Email**: your-email@domain.com
5. Click **"Create App"**

### 1.2 Add Required Products
Add these products to your app:
- **Instagram Basic Display**
- **Instagram Graph API** 
- **Webhooks**

## Step 2: Instagram Basic Display Configuration

### 2.1 Basic Display Settings
1. Go to **Instagram Basic Display** → **Basic Display**
2. Click **"Create New App"**
3. Configure OAuth settings:

**OAuth Redirect URIs:**
```
http://localhost:5173/auth/callback
https://your-production-domain.com/auth/callback
```

**Deauthorize Callback URL:**
```
http://localhost:3001/auth/deauthorize
https://your-backend-domain.com/auth/deauthorize
```

**Data Deletion Request URL:**
```
http://localhost:3001/auth/data-deletion
https://your-backend-domain.com/auth/data-deletion
```

## Step 3: Instagram Graph API Configuration

### 3.1 Configure Instagram Graph API
1. Go to **Instagram Graph API** → **Configuration**
2. Add the same OAuth Redirect URI:
```
http://localhost:5173/auth/callback
```

### 3.2 Required Permissions
Request these permissions in **App Review**:
- `pages_manage_engagement` - Manage page engagement
- `instagram_manage_messages` - Send and receive messages
- `pages_show_list` - Access page list
- `instagram_basic` - Basic Instagram access
- `pages_manage_metadata` - Manage page metadata
- `pages_read_engagement` - Read engagement data

## Step 4: Webhook Configuration

### 4.1 Configure Webhooks
1. Go to **Webhooks** in your Meta App
2. Click **"Add Subscription"**
3. Configure webhook settings:

**Callback URL:**
```
https://your-n8n-instance.com/webhook/instagram-automation
```

**Verify Token:**
```
instaflow_webhook_verify_token_2024
```

**Webhook Fields to Subscribe:**
- `messages` - Direct messages
- `messaging_postbacks` - Button interactions
- `comments` - Post comments
- `mentions` - Story/post mentions

### 4.2 Switch to Live Mode
⚠️ **Important**: Switch your app from "Development" to "Live" mode for webhooks to work.

## Step 5: Environment Configuration

### 5.1 Frontend Environment (.env)
```env
# Meta App Configuration
VITE_META_APP_ID=your_meta_app_id_here
VITE_REDIRECT_URI=http://localhost:5173/auth/callback

# Backend API
VITE_API_BASE_URL=http://localhost:3001

# n8n Webhook
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/instagram-automation
```

### 5.2 Backend Environment (.env)
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Meta App Configuration (KEEP SECRET!)
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here

# OAuth Configuration
REDIRECT_URI=http://localhost:5173/auth/callback

# Webhook Configuration
WEBHOOK_VERIFY_TOKEN=instaflow_webhook_verify_token_2024
```

## Step 6: Instagram Business Account Setup

### 6.1 Connect Instagram to Facebook Page
1. Go to your **Facebook Page Settings**
2. Click **"Instagram"** in left sidebar
3. Connect your Instagram Business account
4. Ensure account type is set to **"Business"**

### 6.2 Verify Business Account
Ensure your Instagram account is:
- ✅ Business account (not Personal)
- ✅ Connected to a Facebook Page
- ✅ Has proper permissions

## Step 7: n8n Webhook Setup

### 7.1 Create n8n Workflow
1. Create new workflow in n8n
2. Add **Webhook** node as trigger
3. Set HTTP Method to **POST**
4. Copy the webhook URL

### 7.2 Configure Webhook Verification
Add webhook verification logic in n8n:
```javascript
// Webhook verification condition
{{ $json.query['hub.mode'] === 'subscribe' && $json.query['hub.verify_token'] === 'instaflow_webhook_verify_token_2024' }}
```

### 7.3 Event Processing
Set up event routing for:
- **Messages**: `$json.body.entry[0].messaging`
- **Comments**: `$json.body.entry[0].changes[0].field === 'comments'`
- **Mentions**: `$json.body.entry[0].changes[0].field === 'mentions'`

## Step 8: Testing & Verification

### 8.1 Test OAuth Flow
1. Start backend server: `npm run dev`
2. Start frontend: `npm run dev`
3. Click "Connect Instagram Business"
4. Complete OAuth authorization
5. Verify successful connection

### 8.2 Test Webhooks
1. Configure webhook URL in Meta App
2. Send test message to your Instagram
3. Verify webhook receives event in n8n
4. Check webhook delivery status in Meta App

## Step 9: Production Deployment

### 9.1 Update URLs for Production
Replace localhost URLs with production domains:
- OAuth Redirect URI
- Webhook Callback URL
- Deauthorize/Data Deletion URLs

### 9.2 SSL/HTTPS Requirements
- All production URLs must use HTTPS
- Webhook endpoints must be publicly accessible
- SSL certificates must be valid

## Required URLs Summary

| Purpose | URL | Where to Configure |
|---------|-----|-------------------|
| OAuth Redirect | `http://localhost:5173/auth/callback` | Meta App → Instagram Basic Display |
| Webhook Callback | `https://your-n8n.com/webhook/instagram-automation` | Meta App → Webhooks |
| Deauthorize Callback | `http://localhost:3001/auth/deauthorize` | Meta App → Instagram Basic Display |
| Data Deletion | `http://localhost:3001/auth/data-deletion` | Meta App → Instagram Basic Display |

## Troubleshooting

### Common Issues

**OAuth Redirect Mismatch:**
- Ensure redirect URI matches exactly in Meta App
- Check for trailing slashes or protocol differences

**Webhook Verification Failed:**
- Verify token must match exactly: `instaflow_webhook_verify_token_2024`
- Webhook URL must be publicly accessible
- App must be in "Live" mode

**Permission Denied:**
- Submit required permissions for App Review
- Ensure Instagram account is Business type
- Verify Facebook Page connection

**Token Expired:**
- Implement token refresh logic
- Monitor token expiry dates
- Handle refresh failures gracefully

### Debug Tools
- [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Webhook Testing Tool](https://developers.facebook.com/tools/webhooks/)
- Browser Developer Console
- n8n Execution Logs

## Security Best Practices

1. **Never expose App Secret in frontend**
2. **Use HTTPS in production**
3. **Validate webhook signatures**
4. **Implement rate limiting**
5. **Store tokens securely**
6. **Monitor API usage**

## Support Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- [Webhook Setup Guide](https://developers.facebook.com/docs/graph-api/webhooks/)
- [Meta App Review Process](https://developers.facebook.com/docs/app-review/)
- [Instagram Business API Permissions](https://developers.facebook.com/docs/permissions/reference/)

This setup provides a complete, production-ready Instagram Business API integration for your automation platform.
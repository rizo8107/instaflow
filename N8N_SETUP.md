# n8n Integration Setup for InstaFlow Automator

## Overview
This guide shows how to integrate n8n with your InstaFlow Automator for handling Instagram webhooks and automation workflows.

## Prerequisites
- n8n instance running (cloud or self-hosted)
- Meta App configured with Instagram API
- InstaFlow Automator frontend running

## Step 1: n8n Webhook Setup

### 1.1 Create New Workflow
1. Open your n8n instance
2. Create a new workflow
3. Name it "Instagram Automation Handler"

### 1.2 Add Webhook Node
1. Add a **Webhook** node as the trigger
2. Set HTTP Method to `POST`
3. Set Path to `/instagram-automation` (or your preferred path)
4. Copy the webhook URL (e.g., `https://your-n8n.com/webhook/instagram-automation`)

### 1.3 Configure Webhook Response
- Set Response Mode to "Respond Immediately"
- Response Code: `200`
- Response Body: `EVENT_RECEIVED`

## Step 2: Meta App Configuration

### 2.1 Configure Webhook in Meta Developer Console
1. Go to your Meta App → Products → Webhooks
2. **Callback URL**: Your n8n webhook URL
3. **Verify Token**: `instaflow_webhook_verify_token_2024`
4. **Subscribe to fields**:
   - `messages`
   - `messaging_postbacks`
   - `comments`
   - `mentions`

### 2.2 Webhook Verification
Add an **IF** node after the webhook to handle verification:

```javascript
// Condition for webhook verification
{{ $json.query['hub.mode'] === 'subscribe' && $json.query['hub.verify_token'] === 'instaflow_webhook_verify_token_2024' }}
```

If true, return the challenge:
```javascript
// Return challenge for verification
{{ $json.query['hub.challenge'] }}
```

## Step 3: Event Processing Workflow

### 3.1 Add Switch Node
After the webhook, add a **Switch** node to route different event types:

**Route 1: Messages**
```javascript
{{ $json.body.entry[0].messaging && $json.body.entry[0].messaging.length > 0 }}
```

**Route 2: Comments**
```javascript
{{ $json.body.entry[0].changes && $json.body.entry[0].changes[0].field === 'comments' }}
```

**Route 3: Mentions**
```javascript
{{ $json.body.entry[0].changes && $json.body.entry[0].changes[0].field === 'mentions' }}
```

### 3.2 Message Processing Branch

#### Extract Message Data
Add a **Set** node to extract message information:
```javascript
{
  "senderId": "{{ $json.body.entry[0].messaging[0].sender.id }}",
  "messageText": "{{ $json.body.entry[0].messaging[0].message.text }}",
  "timestamp": "{{ $json.body.entry[0].messaging[0].timestamp }}",
  "messageId": "{{ $json.body.entry[0].messaging[0].message.mid }}"
}
```

#### Keyword Detection
Add an **IF** node for keyword-based automation:
```javascript
{{ $json.messageText.toLowerCase().includes('price') || $json.messageText.toLowerCase().includes('info') }}
```

#### Send Auto-Reply
Add an **HTTP Request** node to send replies via Instagram Graph API:
- Method: `POST`
- URL: `https://graph.facebook.com/v18.0/me/messages`
- Headers: `Authorization: Bearer YOUR_PAGE_ACCESS_TOKEN`
- Body:
```json
{
  "recipient": {
    "id": "{{ $json.senderId }}"
  },
  "message": {
    "text": "Thanks for your message! Here's the information you requested..."
  }
}
```

### 3.3 Comment Processing Branch

#### Extract Comment Data
```javascript
{
  "commentId": "{{ $json.body.entry[0].changes[0].value.id }}",
  "commentText": "{{ $json.body.entry[0].changes[0].value.text }}",
  "userId": "{{ $json.body.entry[0].changes[0].value.from.id }}",
  "username": "{{ $json.body.entry[0].changes[0].value.from.username }}",
  "mediaId": "{{ $json.body.entry[0].changes[0].value.media.id }}"
}
```

#### Auto-Reply to Comments
HTTP Request to reply to comments:
- URL: `https://graph.facebook.com/v18.0/{{ $json.commentId }}/replies`
- Body:
```json
{
  "message": "Thank you for your comment! 🙏"
}
```

## Step 4: Environment Configuration

### 4.1 Update InstaFlow Frontend
Add to your `.env` file:
```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/instagram-automation
```

### 4.2 n8n Environment Variables
In n8n, set these environment variables:
- `INSTAGRAM_PAGE_ACCESS_TOKEN`: Your Instagram page access token
- `META_APP_SECRET`: Your Meta app secret (for signature verification)

## Step 5: Advanced Automation Examples

### 5.1 Welcome Message for New Followers
Create a separate workflow triggered by follow events:
```javascript
// Trigger condition
{{ $json.body.entry[0].changes && $json.body.entry[0].changes[0].field === 'follows' }}

// Welcome message
{
  "recipient": {
    "id": "{{ $json.body.entry[0].changes[0].value.from.id }}"
  },
  "message": {
    "text": "Welcome to our community! 🎉 Thanks for following us!"
  }
}
```

### 5.2 Scheduled Content Posting
Use n8n's **Cron** node to schedule posts:
- Schedule: `0 9 * * *` (daily at 9 AM)
- HTTP Request to Instagram Graph API for posting

### 5.3 Analytics and Logging
Add **Google Sheets** or **Airtable** nodes to log:
- Message interactions
- Response times
- User engagement metrics
- Automation performance

## Step 6: Testing and Monitoring

### 6.1 Test Webhook
1. Use the InstaFlow webhook testing feature
2. Send test messages to your Instagram account
3. Monitor n8n execution logs

### 6.2 Error Handling
Add **Error Trigger** nodes to handle:
- API rate limits
- Network timeouts
- Invalid webhook payloads

### 6.3 Monitoring Setup
- Enable n8n workflow notifications
- Set up alerts for failed executions
- Monitor Instagram API usage

## Security Best Practices

### 6.1 Webhook Signature Verification
Add signature verification in n8n:
```javascript
// Verify webhook signature
const crypto = require('crypto');
const signature = $json.headers['x-hub-signature-256'];
const payload = JSON.stringify($json.body);
const expectedSignature = 'sha256=' + crypto.createHmac('sha256', process.env.META_APP_SECRET).update(payload).digest('hex');
return signature === expectedSignature;
```

### 6.2 Rate Limiting
Implement rate limiting to avoid Instagram API limits:
- Add **Wait** nodes between API calls
- Track API usage in a database
- Implement exponential backoff for retries

## Troubleshooting

### Common Issues
1. **Webhook not receiving events**: Check Meta App webhook configuration
2. **Verification failed**: Ensure verify token matches exactly
3. **API errors**: Check access token permissions and expiry
4. **n8n workflow errors**: Check execution logs and node configurations

### Debug Tips
- Use n8n's execution view to trace data flow
- Add **No Operation** nodes to inspect data at each step
- Enable detailed logging in webhook nodes
- Test with Instagram's webhook testing tools

This setup provides a robust, scalable automation platform using n8n's visual workflow builder with Instagram's powerful API capabilities.
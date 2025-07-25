const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment validation
const requiredEnvVars = ['META_APP_ID', 'META_APP_SECRET', 'REDIRECT_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log('📱 Meta App ID:', process.env.META_APP_ID);
console.log('🔄 Redirect URI:', process.env.REDIRECT_URI);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Exchange authorization code for access token
app.post('/api/auth/exchange-token', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        error: 'Authorization code is required' 
      });
    }

    console.log('🔄 Exchanging authorization code for access token...');

    // Exchange code for short-lived token
    const tokenResponse = await axios.post('https://graph.facebook.com/v18.0/oauth/access_token', {
      client_id: process.env.META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code: code
    });

    const shortLivedToken = tokenResponse.data.access_token;
    console.log('✅ Short-lived token obtained');

    // Exchange short-lived token for long-lived token
    const longLivedResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: shortLivedToken
      }
    });

    console.log('✅ Long-lived token obtained');

    res.json({
      access_token: longLivedResponse.data.access_token,
      token_type: 'bearer',
      expires_in: longLivedResponse.data.expires_in || 5184000 // 60 days default
    });

  } catch (error) {
    console.error('❌ Token exchange error:', error.response?.data || error.message);
    
    if (error.response?.data?.error) {
      return res.status(400).json({
        error: error.response.data.error.message || 'Token exchange failed',
        error_code: error.response.data.error.code
      });
    }

    res.status(500).json({ 
      error: 'Internal server error during token exchange' 
    });
  }
});

// Refresh access token
app.post('/api/auth/refresh-token', async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ 
        error: 'Access token is required for refresh' 
      });
    }

    console.log('🔄 Refreshing access token...');

    // Refresh the long-lived token
    const refreshResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: access_token
      }
    });

    console.log('✅ Token refreshed successfully');

    res.json({
      access_token: refreshResponse.data.access_token,
      token_type: 'bearer',
      expires_in: refreshResponse.data.expires_in || 5184000 // 60 days default
    });

  } catch (error) {
    console.error('❌ Token refresh error:', error.response?.data || error.message);
    
    if (error.response?.data?.error) {
      return res.status(400).json({
        error: error.response.data.error.message || 'Token refresh failed',
        error_code: error.response.data.error.code
      });
    }

    res.status(500).json({ 
      error: 'Internal server error during token refresh' 
    });
  }
});

// Webhook verification and event handling
app.get('/webhook/instagram', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = 'instaflow_webhook_verify_token_2024';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// Handle webhook events
app.post('/webhook/instagram', (req, res) => {
  const body = req.body;

  console.log('📨 Webhook event received:', JSON.stringify(body, null, 2));

  if (body.object === 'instagram') {
    body.entry.forEach(entry => {
      // Handle messaging events (DMs)
      if (entry.messaging) {
        entry.messaging.forEach(messagingEvent => {
          console.log('💬 New message event:', messagingEvent);
          
          // Extract message data
          const messageData = {
            type: 'message',
            senderId: messagingEvent.sender.id,
            recipientId: messagingEvent.recipient.id,
            messageId: messagingEvent.message?.mid,
            text: messagingEvent.message?.text,
            timestamp: new Date(messagingEvent.timestamp),
            attachments: messagingEvent.message?.attachments || []
          };
          
          // Process automation flows
          processInstagramEvent('new-message', messageData);
        });
      }

      // Handle changes (comments, mentions)
      if (entry.changes) {
        entry.changes.forEach(change => {
          console.log('🔄 Change event:', change);
          
          const { field, value } = change;
          
          switch (field) {
            case 'comments':
              const commentData = {
                type: 'comment',
                commentId: value.id,
                mediaId: value.media?.id,
                text: value.text,
                from: value.from,
                timestamp: new Date()
              };
              processInstagramEvent('new-comment', commentData);
              break;
              
            case 'mentions':
              const mentionData = {
                type: 'mention',
                mediaId: value.media?.id,
                commentId: value.id,
                text: value.text,
                from: value.from,
                timestamp: new Date()
              };
              processInstagramEvent('new-mention', mentionData);
              break;
              
            default:
              console.log('Unhandled change event:', field, value);
          }
        });
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Process Instagram events and trigger automation flows
function processInstagramEvent(eventType, eventData) {
  console.log(`🚀 Processing ${eventType} event:`, eventData);
  
  // Here you would:
  // 1. Query database for active flows matching this event type
  // 2. Execute matching flows with the event data
  // 3. Log execution results
  
  // Example: Auto-reply to messages containing "price"
  if (eventType === 'new-message' && eventData.text?.toLowerCase().includes('price')) {
    console.log('💰 Price inquiry detected, would send auto-reply');
    // sendInstagramMessage(eventData.senderId, "Thanks for your interest! Here's our pricing...");
  }
  
  // Example: Auto-reply to comments
  if (eventType === 'new-comment') {
    console.log('💬 New comment detected, would process for auto-reply');
    // replyToComment(eventData.commentId, "Thank you for your comment!");
  }
}

// Instagram API helper functions (implement these with your access tokens)
async function sendInstagramMessage(recipientId, message) {
  // Implementation would use Instagram Graph API
  console.log(`📤 Would send message to ${recipientId}: ${message}`);
}

async function replyToComment(commentId, message) {
  // Implementation would use Instagram Graph API
  console.log(`📤 Would reply to comment ${commentId}: ${message}`);
}
// Flow execution endpoint (for webhook triggers)
app.post('/api/flows/execute', (req, res) => {
  const { eventType, eventData, timestamp } = req.body;
  
  console.log('🚀 Flow execution triggered:', {
    eventType,
    eventData,
    timestamp
  });

  // In a real implementation, this would:
  // 1. Query database for active flows matching the event type
  // 2. Execute matching flows with the event data
  // 3. Log execution results
  // 4. Return execution summary

  res.json({
    success: true,
    message: 'Flow execution completed',
    executedFlows: 0, // Would be actual count
    timestamp: new Date().toISOString()
  });
});

// OAuth deauthorization callback (required by Meta)
app.post('/auth/deauthorize', (req, res) => {
  console.log('🔓 Deauthorization callback received:', req.body);
  res.status(200).send('OK');
});

// Data deletion callback (required by Meta)
app.post('/auth/data-deletion', (req, res) => {
  console.log('🗑️ Data deletion callback received:', req.body);
  res.status(200).send('OK');
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 InstaFlow Backend Server Started');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 Webhook endpoint: http://localhost:${PORT}/webhook/instagram`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  POST /api/auth/exchange-token - Exchange OAuth code');
  console.log('  POST /api/auth/refresh-token - Refresh access token');
  console.log('  GET  /webhook/instagram - Webhook verification');
  console.log('  POST /webhook/instagram - Webhook events');
  console.log('  POST /api/flows/execute - Flow execution');
  console.log('');
  console.log('🔧 Make sure to configure your Meta App with:');
  console.log(`  📍 OAuth Redirect URI: ${process.env.REDIRECT_URI}`);
  console.log(`  🔗 Webhook URL: http://localhost:${PORT}/webhook/instagram`);
  console.log(`  🔑 Verify Token: instaflow_webhook_verify_token_2024`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});
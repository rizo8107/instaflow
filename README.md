# InstaFlow Automator - Backend API

This is the backend component of the InstaFlow Automator Instagram automation platform. The project has been split into separate frontend and backend repositories for better organization and development workflow.

## Branch Structure

The InstaFlow project is now organized into separate branches:

- `master` - Contains the full application (both frontend and backend)
- `frontend` - Contains only the React + TypeScript frontend application
- `backend` - Contains only the Node.js Express backend API (this branch)

## Features

### 🔐 Instagram OAuth Integration
- Secure Instagram Business account authentication via Meta Graph API
- Automatic token refresh and management
- Support for required Instagram permissions:
  - `pages_manage_engagement`
  - `instagram_manage_messages`
  - `pages_show_list`
  - `instagram_basic`
  - `pages_manage_metadata`
  - `pages_read_engagement`

### 🎨 Visual Flow Builder
- Drag-and-drop interface using React Flow
- Pre-built node types:
  - **Triggers**: New DM, Comment, Follower, Schedule
  - **Conditions**: Keyword Filter, User Filter, Time Filter
  - **Actions**: Send DM, Reply to Comment, Webhook Call
- Flow export/import as JSON
- Real-time flow testing and validation

### 📊 Real-time Dashboard
- Live activity monitoring with charts
- Flow execution statistics
- Token expiry warnings
- Webhook delivery status
- Performance analytics

### 🔗 Webhook Management
- Easy webhook URL configuration
- Real-time event processing
- Support for Instagram events:
  - Direct messages
  - Comments
  - Mentions
  - Follower actions
- Webhook testing with sample payloads
- Delivery status monitoring

## Setup Instructions

### 1. Meta App Configuration

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app and add Instagram Basic Display and Instagram Graph API products
3. Configure OAuth redirect URI: `http://localhost:5173/auth/callback`
4. Add required permissions in App Review
5. Get your App ID and App Secret

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Instagram/Meta App Configuration
VITE_META_APP_ID=your_meta_app_id_here
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:3001
```

**Important Security Note:** The Meta App Secret should NEVER be exposed in the frontend. It must be stored securely on your backend server and used only in server-to-server API calls.

### Backend Server Requirements

You'll need a backend server running at `http://localhost:3001` with the following endpoints:

- `POST /api/auth/exchange-token` - Exchange authorization code for access token
- `POST /api/auth/refresh-token` - Refresh access token

The backend should have the `META_APP_SECRET` environment variable and handle all OAuth operations securely.

### 3. Webhook Setup

1. In your Meta App dashboard, configure webhooks:
   - **Webhook URL**: `https://your-domain.com/webhook/instagram`
   - **Verify Token**: `instaflow_webhook_verify_token_2024`
   - **Webhook Fields**: `messages`, `messaging_postbacks`, `comments`, `mentions`

2. Subscribe your Instagram Business account to webhooks

### 4. Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Integration

### Instagram Graph API Endpoints Used

- **OAuth**: `/oauth/access_token` - Token exchange and refresh
- **User Info**: `/me/accounts` - Get Instagram Business accounts
- **Account Details**: `/{instagram-account-id}` - Get account information
- **Send Message**: `/me/messages` - Send direct messages
- **Reply to Comment**: `/{comment-id}/replies` - Reply to comments
- **Webhook Subscription**: `/{page-id}/subscribed_apps` - Subscribe to webhooks

### Webhook Payload Structure

```json
{
  "object": "instagram",
  "entry": [
    {
      "id": "page_id",
      "time": 1234567890,
      "messaging": [
        {
          "sender": { "id": "user_id" },
          "recipient": { "id": "page_id" },
          "timestamp": 1234567890,
          "message": {
            "mid": "message_id",
            "text": "Hello!"
          }
        }
      ]
    }
  ]
}
```

## Architecture

### Frontend (React + TypeScript)
- **State Management**: Zustand for global state
- **Routing**: React Router for navigation
- **UI Components**: Custom components with Tailwind CSS
- **Flow Builder**: React Flow for visual workflow creation
- **Charts**: Recharts for analytics visualization

### Services
- **Instagram Service**: API integration and token management
- **Webhook Service**: Event processing and flow triggering
- **Flow Engine**: Automation workflow execution

### Key Components
- `AuthCard` - Instagram OAuth login interface
- `AuthCallback` - OAuth callback handler
- `FlowBuilder` - Visual workflow editor
- `Dashboard` - Analytics and monitoring
- `Webhooks` - Webhook configuration and testing

## Flow Types Supported

### 1. Keyword Auto-Reply
```
Trigger: New DM → Condition: Contains "price" → Action: Send pricing info
```

### 2. Comment Response
```
Trigger: New Comment → Condition: Keyword filter → Action: Reply to comment
```

### 3. Welcome Message
```
Trigger: New Follower → Action: Send welcome DM
```

### 4. Scheduled Broadcast
```
Trigger: Daily 10:00 AM → Action: Send promotional message
```

## Security Features

- Secure OAuth 2.0 implementation
- Automatic token refresh
- Environment variable protection
- Webhook signature verification
- Rate limiting and error handling

## Development Tools

- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for styling
- **Vite** for fast development
- **React Flow** for visual editing

## Deployment

### Frontend (Vercel)
```bash
# Build and deploy
npm run build
vercel --prod
```

### Backend Requirements
- Node.js server for webhook handling
- Database for flow storage (MongoDB/PostgreSQL)
- Redis for session management (optional)

## Testing

- Use Meta Graph Explorer for API testing
- Webhook testing with ngrok for local development
- Comprehensive test flows with mock Instagram accounts
- Postman collection for API endpoint testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the GitHub Issues page
- Review Meta's Instagram API documentation
- Contact support for webhook configuration help
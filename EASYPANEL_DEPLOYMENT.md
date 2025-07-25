# InstaFlow Deployment with EasyPanel

This guide explains how to deploy the InstaFlow Instagram Automation Platform using EasyPanel.

## Prerequisites

1. A server with EasyPanel installed
2. Meta/Instagram Developer App credentials
3. Domain name for your deployment (for webhook and OAuth callbacks)

## Environment Variables

Configure the following environment variables in EasyPanel:

### Frontend Service
- `VITE_META_APP_ID`: Your Meta App ID
- `VITE_REDIRECT_URI`: OAuth redirect URI (e.g., https://yourdomain.com/auth/callback)
- `VITE_API_BASE_URL`: Backend API URL (e.g., https://api.yourdomain.com)

### Backend Service
- `META_APP_ID`: Your Meta App ID
- `META_APP_SECRET`: Your Meta App Secret
- `REDIRECT_URI`: Same OAuth redirect URI as frontend
- `PORT`: 3001 (default)

## Deployment Steps

1. In EasyPanel dashboard, click "New Project"
2. Select "Import from Git repository"
3. Enter repository URL: `https://github.com/rizo8107/instaflow.git`
4. Configure the environment variables mentioned above
5. Deploy the project

## Post-Deployment Configuration

1. Update your Meta Developer App settings:
   - Set OAuth redirect URI to your deployed frontend URL
   - Configure webhook URL to your deployed backend URL

2. Test the authentication flow by visiting your frontend URL

3. Configure webhooks in the Meta Developer dashboard:
   - Webhook URL: `https://your-backend-domain.com/webhook/instagram`
   - Verify Token: `instaflow_webhook_verify_token_2024`
   - Subscribe to events: messages, comments, mentions

## Troubleshooting

- Check logs in EasyPanel dashboard for both frontend and backend services
- Verify environment variables are correctly set
- Ensure Meta App has the required permissions enabled
- Check webhook configuration in Meta Developer dashboard

## Scaling

The default configuration allocates 1 CPU core and 1GB of memory to each service.
Adjust the resources in `easypanel.json` if needed for higher traffic.

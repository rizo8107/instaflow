#!/bin/bash

# InstaFlow EasyPanel Deployment Script
# This script helps deploy the InstaFlow application to EasyPanel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if environment variables are set
if [ -z "$EASYPANEL_URL" ] || [ -z "$EASYPANEL_API_KEY" ]; then
  echo -e "${RED}Error: EASYPANEL_URL and EASYPANEL_API_KEY environment variables must be set${NC}"
  echo "Example:"
  echo "export EASYPANEL_URL=https://your-easypanel-instance.com"
  echo "export EASYPANEL_API_KEY=your-api-key"
  exit 1
fi

# Check if .env.easypanel exists
if [ ! -f .env.easypanel ]; then
  echo -e "${RED}Error: .env.easypanel file not found${NC}"
  echo "Please create this file with your environment variables"
  exit 1
fi

echo -e "${GREEN}=== InstaFlow EasyPanel Deployment ===${NC}"
echo -e "${YELLOW}Building application...${NC}"

# Install dependencies
npm install

# Build the application
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed!${NC}"
  exit 1
fi

echo -e "${GREEN}Build successful!${NC}"
echo -e "${YELLOW}Deploying to EasyPanel...${NC}"

# Load environment variables from .env.easypanel
source .env.easypanel

# Create JSON payload for EasyPanel API
JSON_PAYLOAD=$(cat << EOF
{
  "projectId": "instaflow",
  "environmentVariables": {
    "META_APP_ID": "$META_APP_ID",
    "META_APP_SECRET": "$META_APP_SECRET",
    "REDIRECT_URI": "$REDIRECT_URI",
    "VITE_META_APP_ID": "$VITE_META_APP_ID",
    "VITE_REDIRECT_URI": "$VITE_REDIRECT_URI",
    "VITE_API_BASE_URL": "$VITE_API_BASE_URL",
    "VITE_N8N_WEBHOOK_URL": "$VITE_N8N_WEBHOOK_URL"
  }
}
EOF
)

# Deploy to EasyPanel
curl -X POST "$EASYPANEL_URL/api/projects/deploy" \
  -H "Authorization: Bearer $EASYPANEL_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD"

if [ $? -ne 0 ]; then
  echo -e "${RED}Deployment failed!${NC}"
  exit 1
fi

echo -e "${GREEN}Deployment initiated successfully!${NC}"
echo -e "${YELLOW}Check EasyPanel dashboard for deployment status${NC}"

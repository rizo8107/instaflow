# InstaFlow Branch Structure

## Overview

The InstaFlow project has been split into separate branches to better organize development and deployment workflows:

- `master` - Contains the full application (both frontend and backend)
- `frontend` - Contains only the React + TypeScript frontend application
- `backend` - Contains only the Node.js Express backend API

## Working with Branches

### Switching Branches

```bash
# Switch to frontend branch
git checkout frontend

# Switch to backend branch
git checkout backend

# Switch to master branch (full application)
git checkout master
```

### Development Workflow

#### Frontend Development

1. Switch to the frontend branch: `git checkout frontend`
2. Make your changes to the frontend code
3. Test locally: `npm run dev`
4. Commit and push changes: `git add . && git commit -m "Your message" && git push origin frontend`
5. Deploy to EasyPanel using the GitHub workflow or manually

#### Backend Development

1. Switch to the backend branch: `git checkout backend`
2. Make your changes to the backend code
3. Test locally: `node backend-server.mjs`
4. Commit and push changes: `git add . && git commit -m "Your message" && git push origin backend`
5. Deploy to EasyPanel using the GitHub workflow or manually

### Merging Changes

When you need to merge changes between branches:

```bash
# To merge backend changes into master
git checkout master
git merge backend

# To merge frontend changes into master
git checkout master
git merge frontend
```

## Deployment

Each branch has its own EasyPanel configuration and GitHub workflow:

- Frontend: Deploys to `instaflow-frontend` project in EasyPanel
- Backend: Deploys to `instaflow-backend` project in EasyPanel
- Master: Deploys both services to the `instaflow` project in EasyPanel

## Environment Variables

### Frontend Environment Variables
- `VITE_META_APP_ID`
- `VITE_REDIRECT_URI`
- `VITE_API_BASE_URL`
- `VITE_N8N_WEBHOOK_URL`

### Backend Environment Variables
- `META_APP_ID`
- `META_APP_SECRET`
- `REDIRECT_URI`
- `PORT` (default: 3001)

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend-package.json ./package.json
RUN npm install

# Copy backend server file and other necessary files
COPY backend-server.mjs ./
COPY .env.easypanel ./.env

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Start command
CMD ["node", "backend-server.mjs"]

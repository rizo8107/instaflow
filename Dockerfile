# Build stage
FROM node:20-alpine as base

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application with EasyPanel configuration
RUN npm run build:easypanel

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built files and dependencies
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 80

# Copy EasyPanel config to the root directory
COPY --from=base /app/vite.config.easypanel.js ./vite.config.js

# Start command with explicit configuration
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80", "--config", "vite.config.js"]

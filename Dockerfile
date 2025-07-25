FROM node:20-alpine as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine as production

WORKDIR /app

# Copy built files and dependencies
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/backend-server.js ./

# Set environment variables
ENV NODE_ENV=production

# Expose ports
EXPOSE 3001
EXPOSE 80

# Start command (can be overridden in docker-compose)
CMD ["node", "backend-server.js"]

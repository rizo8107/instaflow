# Build stage
FROM node:20-alpine as base

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

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

# Start command (can be overridden in docker-compose)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]

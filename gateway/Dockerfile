# MedPredict AI - API Gateway Dockerfile
# Node.js Express service

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Install dependencies first for better caching
COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY src/ ./src/

# Install dev dependencies for building
RUN npm install typescript ts-node @types/node @types/express @types/cors --save-dev

# Build TypeScript
RUN npx tsc

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Run the application
CMD ["node", "dist/index.js"]


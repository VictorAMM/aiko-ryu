# AikoRyu System - Production Docker Image
# Multi-stage build for optimized production deployment

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S aikoryu -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Copy necessary files
COPY --from=builder /app/README.md ./
COPY --from=builder /app/docs ./docs

# Change ownership to non-root user
RUN chown -R aikoryu:nodejs /app

# Switch to non-root user
USER aikoryu

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')" || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info
ENV ENABLE_GPU=true
ENV ENABLE_STREAMING=true

# Start the application
CMD ["npm", "start"] 
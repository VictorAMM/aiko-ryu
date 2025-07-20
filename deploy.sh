#!/bin/bash

# AikoRyu System - Production Deployment Script
# This script handles the complete production deployment process

set -e

echo "🚀 AikoRyu System - Production Deployment"
echo "=========================================="

# Configuration
PROJECT_NAME="aikoryu-system"
DOCKER_IMAGE="aikoryu-system:latest"
CONTAINER_NAME="aikoryu-production"
PORT=3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if Docker is installed
if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Node.js is installed
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "Pre-deployment checks passed"

# Build the application
print_status "Building the application..."
npm run build
print_success "Application built successfully"

# Run tests
print_status "Running tests..."
npm test
print_success "All tests passed"

# Run analyzer
print_status "Running system analysis..."
npm run analyze
print_success "System analysis completed"

# Build Docker image
print_status "Building Docker image..."
docker build -t $DOCKER_IMAGE .
print_success "Docker image built successfully"

# Stop existing container if running
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    print_status "Stopping existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
    print_success "Existing container stopped and removed"
fi

# Run the container
print_status "Starting production container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    -e NODE_ENV=production \
    -e ENABLE_GPU=true \
    -e ENABLE_STREAMING=true \
    -e LOG_LEVEL=info \
    --restart unless-stopped \
    $DOCKER_IMAGE

print_success "Production container started"

# Wait for container to be ready
print_status "Waiting for container to be ready..."
sleep 10

# Check container status
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    print_success "Container is running"
    
    # Get container logs
    print_status "Container logs:"
    docker logs $CONTAINER_NAME --tail 20
    
    # Health check
    print_status "Performing health check..."
    if curl -f http://localhost:$PORT >/dev/null 2>&1; then
        print_success "Health check passed"
    else
        print_warning "Health check failed - container may still be starting"
    fi
    
    print_success "Deployment completed successfully!"
    echo ""
    echo "🎉 AikoRyu System is now running in production!"
    echo "🌐 Access the system at: http://localhost:$PORT"
    echo "📊 Monitor logs with: docker logs $CONTAINER_NAME -f"
    echo "🛑 Stop the system with: docker stop $CONTAINER_NAME"
    
else
    print_error "Container failed to start"
    docker logs $CONTAINER_NAME
    exit 1
fi 
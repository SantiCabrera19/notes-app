#!/bin/bash

# Notes App - Full Stack Runner Script
# This script sets up and runs the Notes App backend and frontend

set -e  # Exit on any error

echo "🚀 Starting Notes App..."

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Requirements check passed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Check if .env exists, create from example if not
    if [ ! -f ".env" ]; then
        print_warning "No .env file found in backend directory"
        if [ -f ".env.example" ]; then
            print_status "Creating .env from .env.example..."
            cp .env.example .env
            print_warning "Please edit .env file with your database configuration before running again"
            print_status "Required variables:"
            echo "  DATABASE_URL=\"your_database_url_here\""
            echo "  DIRECT_URL=\"your_direct_database_url_here\""
            echo "  PORT=3001"
            echo "  NODE_ENV=development"
            exit 1
        else
            print_error "No .env.example file found. Please create .env manually"
            exit 1
        fi
    fi
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Push database schema
    print_status "Setting up database schema..."
    npx prisma db push
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    print_success "Frontend setup completed"
    cd ..
}

# Start the application
start_app() {
    print_status "Starting Notes App..."
    
    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend in background
    print_status "Starting frontend server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Wait for both processes
    print_success "Notes App is starting up..."
    print_status "Backend: http://localhost:3001"
    print_status "Frontend: http://localhost:5173"
    print_status "Health check: http://localhost:3001/health"
    
    print_success "🎉 Notes App is running!"
    print_status "Press Ctrl+C to stop the application"
    
    # Function to cleanup on exit
    cleanup() {
        print_status "Stopping Notes App..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Notes App stopped"
        exit 0
    }
    
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Wait for background processes
    wait
}

# Check script permissions
check_permissions() {
    if [ ! -x "$0" ]; then
        print_warning "Script is not executable. Making it executable..."
        chmod +x "$0"
    fi
}

# Main execution
main() {
    echo "📝 Notes App - Full Stack Runner"
    echo "=================================="
    
    check_permissions
    check_requirements
    setup_backend
    setup_frontend
    start_app
}

# Run main function
main "$@" 
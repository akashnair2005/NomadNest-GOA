#!/bin/bash
set -e

echo "=== Starting NomadNest Backend ==="

# Pull latest code
echo "Pulling latest code from GitHub..."
git fetch origin main 2>/dev/null || true
git reset --hard origin/main 2>/dev/null || true
git pull origin main 2>/dev/null || true

# Install dependencies
echo "Installing dependencies..."
cd backend
npm ci --legacy-peer-deps 2>/dev/null || npm install

# Start server
echo "Starting API server..."
npm start

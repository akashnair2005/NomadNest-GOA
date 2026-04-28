#!/bin/bash
set -e

echo "=== Starting NomadNest Backend ==="

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Start the server
echo "Starting server..."
npm start


# Install dependencies
echo "Installing dependencies..."
cd backend
npm ci --legacy-peer-deps 2>/dev/null || npm install

# Start server
echo "Starting API server..."
npm start

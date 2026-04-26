#!/bin/bash
set -e

echo "Fetching latest code from GitHub..."
cd /home/runner
git fetch origin main
git reset --hard origin/main

echo "Installing backend dependencies..."
cd /home/runner/backend
npm ci

echo "Starting NomadNest API server..."
npm start

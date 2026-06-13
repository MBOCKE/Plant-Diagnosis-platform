#!/bin/bash
echo "📦 Deploying Auth Service..."
cd "$(dirname "$0")"
npm install --production
echo "✅ Auth Service ready for deployment"
#!/bin/bash
set -e

echo "📦 Installing root dependencies..."
cd ..
npm install

echo "🎨 Building frontend..."
npm run build:frontend

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🗄️ Setting up Prisma..."
npx prisma generate

echo "🏗️ Building Next.js..."
npm run build

echo "✅ Build complete!"

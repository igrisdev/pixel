#!/bin/bash
set -e

echo "Deploying Pixel Portfolio..."

cd /opt/pixel

echo "Pulling latest changes..."
git pull origin main

echo "Building and restarting services..."
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

echo "Running database migrations..."
docker exec pixel_prod_app npx prisma migrate deploy

echo "Deploy complete!"

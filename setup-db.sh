#!/bin/bash

echo "🐳 Starting PostgreSQL with Docker..."
echo ""

# Start Docker container
docker-compose up -d

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if database is ready
until docker exec workspace-app-db pg_isready -U postgres > /dev/null 2>&1; do
  echo "Waiting for database..."
  sleep 2
done

echo ""
echo "✅ PostgreSQL is ready!"
echo ""
echo "📊 Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "✅ Database setup complete!"
echo ""
echo "🎉 You can now test the application at http://localhost:3001"
echo ""
echo "📝 Useful commands:"
echo "  - View database: npx prisma studio"
echo "  - Stop database: docker-compose down"
echo "  - View logs: docker-compose logs -f"

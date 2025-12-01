# Database Setup Guide

## Quick Setup Options

### Option 1: Local PostgreSQL (Fastest for Development)

#### Install PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql
sudo service postgresql start

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Database
```bash
# Create database
createdb workspace_app

# Or using psql
psql postgres
CREATE DATABASE workspace_app;
\q
```

#### Update .env
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/workspace_app"
```

#### Run Migration
```bash
cd workspace-app
npx prisma migrate dev --name init
```

---

### Option 2: Supabase (Free Cloud Database)

#### Steps:
1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Get your database URL from Settings → Database
5. Update `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
```
6. Run migration:
```bash
npx prisma migrate dev --name init
```

---

### Option 3: Vercel Postgres (Integrated with Vercel)

#### Steps:
1. Go to https://vercel.com
2. Create a project
3. Go to Storage → Create Database → Postgres
4. Copy the connection string
5. Update `.env`:
```env
DATABASE_URL="your-vercel-postgres-url"
```
6. Run migration:
```bash
npx prisma migrate dev --name init
```

---

### Option 4: Railway (Simple Cloud Hosting)

#### Steps:
1. Go to https://railway.app
2. Create a new project
3. Add PostgreSQL database
4. Copy the connection string
5. Update `.env`:
```env
DATABASE_URL="your-railway-postgres-url"
```
6. Run migration:
```bash
npx prisma migrate dev --name init
```

---

## After Database Setup

### 1. Verify Connection
```bash
npx prisma db push
```

### 2. Open Prisma Studio (Optional)
```bash
npx prisma studio
```
This opens a GUI at http://localhost:5555 to view your database.

### 3. Test the Application
1. Visit http://localhost:3001
2. Sign up for a new account
3. Create an organization
4. Start using the app!

---

## Troubleshooting

### Connection Error
```
Error: Can't reach database server
```
**Solution**: Check your DATABASE_URL is correct and database is running.

### Migration Error
```
Error: P1001: Can't reach database server
```
**Solution**: 
1. Verify PostgreSQL is running
2. Check database credentials
3. Ensure database exists

### SSL Error (Cloud Databases)
If you get SSL errors with cloud databases, add `?sslmode=require` to your DATABASE_URL:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

---

## Database Schema Overview

The migration will create these tables:
- `users` - User accounts
- `accounts` - Auth credentials
- `sessions` - User sessions
- `organizations` - Organizations
- `organization_members` - Membership with roles
- `outlines` - Outline data
- `invitations` - Invitation tokens

All tables are properly indexed and have foreign key constraints for data integrity.

---

## Quick Start Command

```bash
# 1. Create local database
createdb workspace_app

# 2. Run migration
npx prisma migrate dev --name init

# 3. Start the app (already running)
# Visit http://localhost:3001

# 4. (Optional) Open Prisma Studio
npx prisma studio
```

That's it! Your database is ready. 🎉

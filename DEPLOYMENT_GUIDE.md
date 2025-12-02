# 🚀 Deployment Guide

## Recommended Stack

**Frontend + Backend**: Vercel (Best for Next.js)
**Database**: Neon PostgreSQL (Free tier, serverless)
**Alternative DB**: Supabase PostgreSQL

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables to Set

Create a `.env.production` file with:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# App URL
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"

# Better Auth
BETTER_AUTH_SECRET="your-production-secret-key-min-32-chars"
BETTER_AUTH_URL="https://your-app.vercel.app"
```

### 2. Remove Development-Only Code

- Remove all `console.log()` statements from API routes
- Remove debug logging in production

---

## 🎯 Deployment Option 1: Vercel + Neon (Recommended)

### Step 1: Setup Neon Database (Free)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project: "workspace-app"
4. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Update Database Schema

```bash
# In your local terminal
cd workspace-app

# Set the production database URL
export DATABASE_URL="your-neon-connection-string"

# Push schema to production database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Step 3: Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/workspace-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select "workspace-app" folder as root directory

3. **Configure Environment Variables** in Vercel:
   ```
   DATABASE_URL = your-neon-connection-string
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   BETTER_AUTH_SECRET = generate-a-random-32-char-string
   BETTER_AUTH_URL = https://your-app.vercel.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Step 4: Update App URL

After deployment, update the environment variable:
```
NEXT_PUBLIC_APP_URL = https://your-actual-app-name.vercel.app
```

Then redeploy.

---

## 🎯 Deployment Option 2: Vercel + Supabase

### Step 1: Setup Supabase Database (Free)

1. Go to https://supabase.com
2. Create new project: "workspace-app"
3. Wait for database to initialize
4. Go to Settings → Database
5. Copy the connection string (Transaction mode):
   ```
   postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
   ```

### Step 2: Same as Option 1 (Steps 2-4)

Follow the same steps as Neon deployment above.

---

## 🎯 Deployment Option 3: Railway (All-in-One)

### Step 1: Deploy Everything to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository

### Step 2: Add PostgreSQL

1. Click "New" → "Database" → "PostgreSQL"
2. Railway automatically creates the database
3. Copy the `DATABASE_URL` from the PostgreSQL service

### Step 3: Configure Environment Variables

Add to your Next.js service:
```
DATABASE_URL = ${{Postgres.DATABASE_URL}}
NEXT_PUBLIC_APP_URL = ${{RAILWAY_PUBLIC_DOMAIN}}
BETTER_AUTH_SECRET = your-secret-key
BETTER_AUTH_URL = ${{RAILWAY_PUBLIC_DOMAIN}}
```

### Step 4: Deploy

Railway automatically deploys on every push!

---

## 📝 Post-Deployment Steps

### 1. Test the Deployment

```bash
# Test sign-up
curl -X POST https://your-app.vercel.app/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test sign-in
curl -X POST https://your-app.vercel.app/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Create First Organization

1. Go to https://your-app.vercel.app/sign-up
2. Create an account
3. Create an organization
4. Test all features

### 3. Monitor Logs

**Vercel**:
- Go to your project → Deployments → Click latest → View Function Logs

**Railway**:
- Click on your service → View Logs

---

## 🔒 Security Checklist

### Before Going Live:

- [ ] Change `BETTER_AUTH_SECRET` to a strong random string
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set up CORS if needed
- [ ] Review all API routes for security
- [ ] Remove all `console.log()` statements
- [ ] Set up error monitoring (Sentry)
- [ ] Enable rate limiting on API routes
- [ ] Review database permissions

---

## 🎨 Custom Domain (Optional)

### Vercel:

1. Go to Project Settings → Domains
2. Add your domain: `workspace.yourdomain.com`
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Railway:

1. Go to Service Settings → Networking
2. Add custom domain
3. Update DNS records
4. Update environment variables

---

## 📊 Monitoring & Analytics

### Recommended Tools:

1. **Vercel Analytics** (Built-in)
   - Automatic on Vercel
   - Shows page views, performance

2. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **PostHog** (Product Analytics)
   ```bash
   npm install posthog-js
   ```

---

## 🔄 CI/CD Pipeline

### Automatic Deployments:

**Vercel** (Automatic):
- Push to `main` → Production deployment
- Push to other branches → Preview deployment

**GitHub Actions** (Optional):
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 💰 Cost Estimates

### Free Tier (Perfect for Testing):

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Vercel | ✅ Free | 100GB bandwidth/month |
| Neon | ✅ Free | 0.5GB storage, 1 project |
| Supabase | ✅ Free | 500MB storage, 2GB bandwidth |
| Railway | ✅ $5 credit | ~500 hours/month |

### Production (Paid):

| Service | Cost | Features |
|---------|------|----------|
| Vercel Pro | $20/month | Unlimited bandwidth, team features |
| Neon Scale | $19/month | 10GB storage, autoscaling |
| Supabase Pro | $25/month | 8GB storage, daily backups |

---

## 🚀 Quick Deploy Commands

### One-Command Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd workspace-app
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? workspace-app
# - Directory? ./
# - Override settings? No

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_APP_URL
vercel env add BETTER_AUTH_SECRET

# Deploy to production
vercel --prod
```

---

## 📱 Testing Checklist After Deployment

- [ ] Sign up works
- [ ] Sign in works
- [ ] Create organization works
- [ ] Invite member works
- [ ] Join organization works
- [ ] Create outline works
- [ ] Edit outline works
- [ ] Delete outline works
- [ ] Remove member works
- [ ] All tabs load correctly
- [ ] Sidebar navigation works
- [ ] Sign out works

---

## 🐛 Common Deployment Issues

### Issue 1: Database Connection Fails

**Error**: `Can't reach database server`

**Solution**:
- Check `DATABASE_URL` is correct
- Ensure `?sslmode=require` is in connection string
- Verify database is running

### Issue 2: Auth Not Working

**Error**: `Invalid session`

**Solution**:
- Check `BETTER_AUTH_SECRET` is set
- Verify `BETTER_AUTH_URL` matches your domain
- Clear cookies and try again

### Issue 3: API Routes 404

**Error**: `404 Not Found`

**Solution**:
- Check Vercel build logs
- Ensure all API routes are in `app/api/` directory
- Verify Next.js version compatibility

### Issue 4: Environment Variables Not Loading

**Solution**:
- Redeploy after adding env vars
- Check variable names (no typos)
- Restart Vercel deployment

---

## 📚 Recommended Deployment Flow

### For Development/Testing:
```
Local → GitHub → Vercel (Preview) → Test → Merge to Main → Production
```

### For Production:
```
1. Test locally
2. Push to feature branch
3. Create pull request
4. Review Vercel preview deployment
5. Merge to main
6. Automatic production deployment
7. Monitor logs
8. Test production
```

---

## ✅ Final Checklist

Before submitting/going live:

- [ ] Code pushed to GitHub
- [ ] Database deployed (Neon/Supabase)
- [ ] App deployed to Vercel
- [ ] All environment variables set
- [ ] Database schema migrated
- [ ] All features tested in production
- [ ] Error monitoring set up
- [ ] Custom domain configured (if needed)
- [ ] Documentation updated
- [ ] README.md includes deployment info

---

## 🎉 You're Ready to Deploy!

**Recommended Path**: Vercel + Neon
- Easiest setup
- Best performance
- Free tier available
- Automatic scaling

**Time to Deploy**: ~15 minutes

**Good luck!** 🚀

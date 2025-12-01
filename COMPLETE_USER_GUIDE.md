# 📖 Complete User Guide

## 🎯 Quick Summary

**Your Issue**: You're trying to sign in with an account that doesn't exist yet!

**Solution**: Sign up first, then you can sign in.

---

## 🚀 Step-by-Step Guide

### 1️⃣ First Time: Sign Up

1. Go to **http://localhost:3001**
2. You'll see the sign-in page
3. Click **"Sign up"** link at the bottom
4. Fill in the form:
   ```
   Email: test@gmail.com
   Password: password123
   Confirm Password: password123
   ```
5. Click **"Sign Up"**
6. ✅ Account created! You're automatically signed in

---

### 2️⃣ Create Your Organization

After signing up, you'll be redirected to create organization:

1. Enter organization name: **"My Company"**
2. Click **"Create Organization"**
3. ✅ You're now the Owner!
4. ✅ You'll see the dashboard with sidebar

---

### 3️⃣ Use the Application

Now you can:
- ✅ Add outlines (click "Add Section")
- ✅ Edit outlines (click on header)
- ✅ Delete outlines (click "Delete")
- ✅ Invite team members (click "Team" → "Invite Member")
- ✅ Manage your organization

---

### 4️⃣ Sign Out

When you want to sign out:

1. **Look at the left sidebar**
2. **Scroll to the bottom**
3. **Click "Sign Out" button** (has logout icon 🚪)
4. ✅ You're signed out and redirected to sign-in page

---

### 5️⃣ Sign In Again (Returning User)

Next time you visit:

1. Go to **http://localhost:3001**
2. You'll see the sign-in page
3. Enter your credentials:
   ```
   Email: test@gmail.com
   Password: password123
   ```
4. Click **"Sign In"**
5. ✅ You're signed in and can access your organizations

---

## ❌ Common Errors and Solutions

### Error: "Credential account not found"

**What it means**: You're trying to sign in with an email that doesn't exist

**Solution**: 
- Sign up first with that email
- Or use a different email that you've already registered

---

### Error: "Unauthorized"

**What it means**: You're not signed in

**Solution**:
- Sign in first
- Or sign up if you don't have an account

---

### Error: "Not a member of this organization"

**What it means**: You're trying to access an organization you don't belong to

**Solution**:
- Create your own organization
- Or accept an invitation to join one

---

## 🔐 Account Management

### Create Account (Sign Up)
- **URL**: http://localhost:3001/sign-up
- **Required**: Email, Password
- **Result**: Account created, automatically signed in

### Login (Sign In)
- **URL**: http://localhost:3001/sign-in
- **Required**: Email, Password (must exist)
- **Result**: Signed in, access to your organizations

### Logout (Sign Out)
- **Location**: Bottom of sidebar
- **Result**: Signed out, redirected to sign-in

---

## 📊 View Your Data

To see what's in the database:

```bash
npx prisma studio
```

Then open http://localhost:5555 to browse:
- Users (your accounts)
- Organizations (your companies)
- Outlines (your data)
- Members (team members)

---

## 🎯 Your Current Situation

Based on the error, here's what happened:

1. ❌ You tried to sign in with `test@gmail.com`
2. ❌ That account doesn't exist in the database
3. ❌ Better-auth returned "Credential account not found"

**What you need to do**:

1. ✅ Go to http://localhost:3001/sign-up
2. ✅ Create account with `test@gmail.com`
3. ✅ Now you can sign in with that email

---

## 🚀 Quick Start (Right Now)

**Do this right now**:

1. Open http://localhost:3001/sign-up
2. Enter:
   - Email: `test@gmail.com`
   - Password: `password123`
   - Confirm: `password123`
3. Click "Sign Up"
4. Create organization
5. Start using the app!

**That's it!** 🎉

---

## 📝 Remember

- **First time?** → Sign Up
- **Returning?** → Sign In
- **Want to leave?** → Sign Out (bottom of sidebar)
- **Forgot password?** → Create new account (no reset feature yet)

---

## ✅ Everything is Working!

The error you're seeing is **normal** - it's the app correctly telling you that the account doesn't exist yet. Just sign up first and everything will work perfectly!

**Start here**: http://localhost:3001/sign-up 🚀

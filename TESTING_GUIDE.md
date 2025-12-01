# 🧪 Testing Guide - Step by Step

## ✅ Current Status

- ✅ Server running on http://localhost:3001
- ✅ Database running (Docker PostgreSQL)
- ✅ Schema updated and migrated
- ✅ All code complete

---

## 🚀 How to Test (Correct Order)

### Step 1: Sign Up (Create Account)

1. Open http://localhost:3001
2. You should be redirected to `/sign-in`
3. Click **"Sign up"** link at the bottom
4. Fill in the form:
   - **Name**: Your Name (optional)
   - **Email**: test@example.com
   - **Password**: password123
   - **Confirm Password**: password123
5. Click **"Sign Up"**

**Expected Result**: 
- ✅ Account created
- ✅ Automatically signed in
- ✅ Redirected to `/organizations/create`

---

### Step 2: Create Organization

After signing up, you'll be on the create organization page:

1. Enter **Organization Name**: "My Company"
2. Click **"Create Organization"**

**Expected Result**:
- ✅ Organization created
- ✅ You become the Owner
- ✅ Redirected to `/organizations/[orgId]/outlines`
- ✅ See sidebar with organization name

---

### Step 3: Add Outlines

Now you're on the outlines page:

1. Click **"Add Section"** button
2. Fill in the form:
   - **Header**: Cover Page
   - **Section Type**: Table of Contents
   - **Status**: Pending
   - **Target**: 100
   - **Limit**: 150
   - **Reviewer**: Assim
3. Click **"Create"**

**Expected Result**:
- ✅ Outline appears in table
- ✅ All fields displayed correctly
- ✅ Status badge shows "Pending" in gray

---

### Step 4: Edit Outline

1. Click on the **header** "Cover Page" in the table
2. Change **Status** to "In Progress"
3. Click **"Update"**

**Expected Result**:
- ✅ Outline updated
- ✅ Status badge changes to yellow "In Progress"

---

### Step 5: Test Team Management

1. Click **"Team"** in the sidebar
2. You should see yourself as **Owner**
3. Click **"Invite Member"**
4. Enter email: member@example.com
5. Click **"Send Invitation"**

**Expected Result**:
- ✅ Invitation created
- ✅ You see a success message with invitation link
- ✅ Copy the invitation link

---

### Step 6: Test as Member (Optional)

1. Open a new **incognito/private window**
2. Go to http://localhost:3001
3. Click **"Sign up"**
4. Create account with: member@example.com
5. After signing up, paste the invitation link
6. Click **"Join Organization"**

**Expected Result**:
- ✅ Joined as Member
- ✅ Can see outlines
- ✅ Cannot see "Invite Member" button (Owner only)

---

## ❌ Common Errors and What They Mean

### "Unauthorized" Error
**What it means**: You're not signed in
**Solution**: Go to `/sign-in` and sign up first

### "Not a member of this organization"
**What it means**: You're trying to access an organization you don't belong to
**Solution**: Create your own organization or accept an invitation

### "Only owners can perform this action"
**What it means**: You're a Member trying to do Owner-only actions
**Solution**: This is correct! Members can't invite/remove people

---

## 🐛 Troubleshooting

### Sign Up Not Working
1. Check browser console for errors
2. Make sure you're on http://localhost:3001 (not 3000)
3. Try clearing browser cache (Cmd+Shift+R)

### Database Connection Error
```bash
# Check if Docker is running
docker ps | grep workspace-app-db

# Restart database if needed
docker-compose restart
```

### Server Not Responding
```bash
# Check if server is running
# Should see "Ready in XXXms"

# Restart if needed
# Stop: Ctrl+C
# Start: npm run dev
```

---

## ✅ Success Checklist

After testing, you should have:
- [ ] Created an account
- [ ] Created an organization
- [ ] Added at least one outline
- [ ] Edited an outline
- [ ] Invited a member (optional)
- [ ] Tested as member (optional)

---

## 📊 What to Expect

### Sign Up Flow
```
/sign-in → Click "Sign up" → Fill form → Submit
→ Account created → Redirect to /organizations/create
```

### Create Organization Flow
```
/organizations/create → Enter name → Submit
→ Organization created → Redirect to /organizations/[id]/outlines
```

### Add Outline Flow
```
/organizations/[id]/outlines → Click "Add Section" → Fill form
→ Outline created → Appears in table
```

---

## 🎯 The "Unauthorized" Error is Normal!

If you see "Unauthorized" errors in the console, it's because:
- You tried to access a protected page without signing in
- The app correctly redirected you to sign-in
- This is **expected behavior** and shows security is working!

**Just follow the steps above in order and everything will work!** ✅

---

## 🚀 Quick Start

1. Go to http://localhost:3001
2. Click "Sign up"
3. Create account
4. Create organization
5. Start adding outlines!

That's it! 🎉

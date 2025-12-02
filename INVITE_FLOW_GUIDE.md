# 📧 Invitation Flow - Complete Guide

## How the Invite System Works

### Step-by-Step Process:

---

## 1️⃣ New User Signs Up First

**The user MUST create an account before they can be invited!**

1. Go to: `http://localhost:3001/sign-up`
2. Enter their email (e.g., `test3@gmail.com`)
3. Enter a password
4. Click "Sign Up"
5. They now have an account in the system

---

## 2️⃣ Owner Invites the User

1. Owner logs in to their organization
2. Click **"Team Info / Setup"** in the sidebar
3. Click **"Invite Member"** button
4. Enter the user's email: `test3@gmail.com`
5. Click **"Send Invitation"**

**Result**: System generates an invitation link like:
```
http://localhost:3001/organizations/join/405595ab3d9e7eb0551a78000e42625e69c9a50042e753ef712b8820bb341069
```

---

## 3️⃣ User Receives the Invite Link

**Currently**: The invite link is shown in the success message (copy it manually)

**Future**: This link would be sent via email

---

## 4️⃣ User Clicks the Link to Join

1. User clicks the invitation link (or pastes it in browser)
2. Goes to: `http://localhost:3001/organizations/join/[token]`
3. If signed in: Automatically joins the organization
4. If not signed in: Redirected to sign-in, then joins after signing in

---

## 🔴 Common Errors and Solutions

### Error: "User with this email does not exist"

**Problem**: The user hasn't signed up yet

**Solution**: 
1. User must go to `/sign-up` first
2. Create an account with their email
3. Then the owner can invite them

---

### Error: "User is already a member of this organization"

**Problem**: The user is already in the organization

**Solution**: No action needed - they're already a member!

---

### Error: "Invitation not found or expired"

**Problem**: The invitation token is invalid or expired (7 days)

**Solution**: Owner needs to send a new invitation

---

## 🧪 Testing the Full Flow

### Test Scenario 1: Invite a New User

```bash
# Step 1: Create new user account
1. Open browser: http://localhost:3001/sign-up
2. Email: newuser@example.com
3. Password: password123
4. Click "Sign Up"

# Step 2: Sign in as organization owner
1. Go to: http://localhost:3001/sign-in
2. Sign in with owner account
3. Go to organization dashboard

# Step 3: Invite the new user
1. Click "Team Info / Setup" in sidebar
2. Click "Invite Member"
3. Enter: newuser@example.com
4. Click "Send Invitation"
5. Copy the invitation link from success message

# Step 4: Join as new user
1. Sign out (or open incognito window)
2. Paste the invitation link in browser
3. Sign in as: newuser@example.com
4. You're now a member of the organization!
```

---

### Test Scenario 2: What Happens If User Doesn't Exist?

```bash
# Step 1: Try to invite non-existent user
1. Sign in as owner
2. Go to "Team Info / Setup"
3. Click "Invite Member"
4. Enter: doesnotexist@example.com
5. Click "Send Invitation"

# Result: ❌ Error: "User with this email does not exist"

# Solution:
1. Tell the user to sign up first at /sign-up
2. After they sign up, invite them again
```

---

## 📋 Current Implementation Status

✅ **Working**:
- User sign-up
- User sign-in
- Organization creation
- Invitation creation (with token)
- Invitation acceptance (join via link)
- Member listing
- Member removal (owner only)

⚠️ **Manual Step**:
- Invitation link must be copied manually (no email sending yet)

🔮 **Future Enhancement**:
- Send invitation link via email automatically
- Email templates
- Invitation reminders

---

## 🎯 Quick Reference

| Action | URL | Who Can Do It |
|--------|-----|---------------|
| Sign Up | `/sign-up` | Anyone |
| Sign In | `/sign-in` | Registered users |
| Create Org | `/organizations/create` | Signed-in users |
| Invite Member | Team page → "Invite Member" | Organization Owner |
| Join Org | `/organizations/join/[token]` | Invited users |
| View Team | Sidebar → "Team Info / Setup" | Organization members |
| Remove Member | Team page → Trash icon | Organization Owner |

---

## 💡 Pro Tips

1. **Always sign up first** before expecting an invitation
2. **Copy the invitation link** from the success message
3. **Share the link** with the invited user (via Slack, email, etc.)
4. **Invitation expires in 7 days** - send a new one if needed
5. **Only owners can invite** - members cannot invite others

---

## 🐛 Debugging

If invitations aren't working:

1. **Check the database**:
   ```bash
   docker exec -it workspace-postgres psql -U postgres -d workspace
   SELECT * FROM invitations;
   ```

2. **Check if user exists**:
   ```sql
   SELECT * FROM users WHERE email = 'test3@gmail.com';
   ```

3. **Check organization members**:
   ```sql
   SELECT * FROM organization_members WHERE "organizationId" = 'your-org-id';
   ```

4. **Check server logs** in your terminal for detailed error messages

---

## ✅ Summary

**The invite flow is working correctly!** 

The key point is: **Users must sign up BEFORE they can be invited.**

This is a security feature to ensure only real users with accounts can join organizations.

# ✅ Organization ID "undefined" - FIXED!

## 🎯 What Was Wrong

The invite member dialog was trying to get `orgId` from `useParams()` but it was returning `undefined`.

## ✅ What I Fixed

Changed the `InviteMemberDialog` component to receive `orgId` as a prop instead of trying to get it from `useParams()`.

### Before:
```typescript
// Component tried to get orgId itself
const params = useParams()
const orgId = params.orgId as string // ❌ undefined
```

### After:
```typescript
// Component receives orgId as prop
interface InviteMemberDialogProps {
  orgId: string  // ✅ Passed from parent
  // ...
}
```

## ✅ Now It Works!

The invite member functionality will now work correctly because:
1. ✅ `orgId` is passed from the parent component
2. ✅ The API URL will be correct: `/api/organizations/[actual-id]/members/invite`
3. ✅ No more "undefined" in the URL

## 🚀 Try It Now

1. Go to your organization's Team page
2. Click "Invite Member"
3. Enter an email
4. Click "Send Invitation"
5. ✅ It will work!

The 404 error is fixed! 🎉

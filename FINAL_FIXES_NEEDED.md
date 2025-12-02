# 🔧 Final Fixes Needed to Match Reference Design

## Current Issues vs Reference Design

### 1. ❌ Permission Issue - Members Can Create/Edit/Delete
**Problem**: Members have full access, but they should only be able to VIEW

**Reference Design Shows**:
- Only owners/admins can add/edit/delete
- Members can only view the table
- "Add Section" button should be hidden for members

**Fix Needed**:
- Hide "Add Section" button for members
- Disable edit on click for members
- Hide "More" menu for members
- Show read-only view

---

### 2. ❌ "Assign Reviewer" Should Be Clickable Dropdown
**Problem**: "Assign reviewer" shows as plain text

**Reference Design Shows**:
- "Assign reviewer" is a clickable dropdown (light blue background)
- Clicking it opens a dropdown to select a reviewer
- Shows as a button/select element

**Fix Needed**:
- Make reviewer cell a dropdown when unassigned
- Allow inline editing of reviewer
- Style it with light blue background like reference

---

### 3. ❌ UI Styling Differences

**Current vs Reference**:

| Element | Current | Reference | Fix Needed |
|---------|---------|-----------|------------|
| Checkboxes | ✅ Present | ✅ Present | ✅ Good |
| Drag handles | ✅ Present | ✅ Present | ✅ Good |
| Status dots | ✅ Present | ✅ Present | ✅ Good |
| Section Type | Plain text | Gray text | Make lighter gray |
| Reviewer (assigned) | Plain text | Plain text | ✅ Good |
| Reviewer (unassigned) | Gray text | Blue dropdown | Make clickable dropdown |
| Row hover | Light gray | Light gray | ✅ Good |

---

## Implementation Plan

### Step 1: Add Role-Based Permissions ⚠️ HIGH PRIORITY

**File**: `workspace-app/components/outlines/outlines-table-v2.tsx`

```typescript
// Add userRole prop
interface OutlinesTableV2Props {
  userRole: 'Owner' | 'Member'
}

export function OutlinesTableV2({ userRole }: OutlinesTableV2Props) {
  const isOwner = userRole === 'Owner'
  
  // Hide buttons for members
  {isOwner && (
    <Button onClick={handleAdd}>Add Section</Button>
  )}
  
  // Disable edit for members
  onClick={() => isOwner && handleEdit(outline)}
  
  // Hide more menu for members
  {isOwner && <DropdownMenu>...</DropdownMenu>}
}
```

**File**: `workspace-app/app/(dashboard)/organizations/[orgId]/outlines/page.tsx`

```typescript
// Pass user role to table
const member = await prisma.organizationMember.findFirst({...})
return <OutlinesTableV2 userRole={member.role} />
```

---

### Step 2: Make "Assign Reviewer" Clickable Dropdown

**File**: `workspace-app/components/outlines/outlines-table-v2.tsx`

```typescript
// In the reviewer cell
{visibleColumns.reviewer && (
  <TableCell>
    {outline.reviewer ? (
      <span className="text-sm text-gray-600">{outline.reviewer}</span>
    ) : (
      <Select
        value=""
        onValueChange={(value) => handleReviewerChange(outline.id, value)}
      >
        <SelectTrigger className="h-7 bg-blue-50 text-blue-600 border-0">
          <SelectValue placeholder="Assign reviewer" />
        </SelectTrigger>
        <SelectContent>
          {members.map(member => (
            <SelectItem value={member.user.name}>
              {member.user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </TableCell>
)}
```

---

### Step 3: Style Adjustments

**Section Type Color**:
```typescript
<TableCell className="text-gray-400 text-sm"> // Lighter gray
  {formatSectionType(outline.sectionType)}
</TableCell>
```

---

## Quick Summary of What's Working ✅

1. ✅ Sidebar with organization switcher
2. ✅ Tabs navigation
3. ✅ Table with checkboxes
4. ✅ Drag handles
5. ✅ Status dots with colors
6. ✅ Pagination
7. ✅ Customize columns dropdown
8. ✅ More menu (for owners)
9. ✅ CRUD operations
10. ✅ Team management
11. ✅ Invite flow
12. ✅ Dynamic reviewer list from members

---

## What Still Needs Fixing ❌

1. ❌ **CRITICAL**: Members can create/edit/delete (should be read-only)
2. ❌ **IMPORTANT**: "Assign reviewer" should be clickable dropdown
3. ❌ **MINOR**: Section type text color (should be lighter gray)

---

## Testing Checklist

### As Owner:
- [ ] Can see "Add Section" button
- [ ] Can click header to edit
- [ ] Can use "More" menu to edit/delete
- [ ] Can assign reviewers via dropdown
- [ ] Can customize columns

### As Member:
- [ ] CANNOT see "Add Section" button
- [ ] CANNOT click header to edit
- [ ] CANNOT see "More" menu
- [ ] CAN view all data
- [ ] CAN use pagination
- [ ] CAN use customize columns (view only)

---

## Priority Order

1. **🔴 HIGH**: Fix member permissions (read-only)
2. **🟡 MEDIUM**: Make "Assign reviewer" clickable dropdown
3. **🟢 LOW**: Adjust section type color

---

## Estimated Time

- Member permissions: 15 minutes
- Assign reviewer dropdown: 20 minutes
- Color adjustments: 5 minutes

**Total**: ~40 minutes to complete

---

## Current Status

**Completion**: ~85%
**Remaining**: ~15%

**What's blocking completion**:
- Permission system not enforced in UI
- Reviewer assignment UX not matching reference

**Once these are fixed, the app will be 100% complete!** 🎉

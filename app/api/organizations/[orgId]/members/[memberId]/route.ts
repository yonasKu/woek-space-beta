import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { handleApiError, requireOrgOwner, ApiError } from '@/lib/middleware/org-middleware'

// DELETE /api/organizations/:orgId/members/:memberId - Remove member (Owner only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; memberId: string }> }
) {
  try {
    const { orgId, memberId } = await params
    const session = await requireAuth()
    await requireOrgOwner(session.user.id, orgId)

    // Get member to remove
    const member = await prisma.organizationMember.findUnique({
      where: { id: memberId }
    })

    if (!member) {
      throw new ApiError(404, 'Member not found')
    }

    // Verify member belongs to this organization
    if (member.organizationId !== orgId) {
      throw new ApiError(403, 'Member does not belong to this organization')
    }

    // Cannot remove owner
    if (member.role === 'Owner') {
      throw new ApiError(400, 'Cannot remove organization owner')
    }

    // Cannot remove self
    if (member.userId === session.user.id) {
      throw new ApiError(400, 'Cannot remove yourself')
    }

    // Delete member
    await prisma.organizationMember.delete({
      where: { id: memberId }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Member removed successfully'
    })
  } catch (error) {
    return handleApiError(error)
  }
}

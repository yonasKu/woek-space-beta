import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { handleApiError, requireOrgMember } from '@/lib/middleware/org-middleware'

// GET /api/organizations/:orgId/members - List organization members
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const session = await requireAuth()
    await requireOrgMember(session.user.id, orgId)

    const members = await prisma.organizationMember.findMany({
      where: { organizationId: orgId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      },
      orderBy: [
        { role: 'asc' }, // Owner first
        { joinedAt: 'asc' }
      ]
    })

    return NextResponse.json(members)
  } catch (error) {
    return handleApiError(error)
  }
}

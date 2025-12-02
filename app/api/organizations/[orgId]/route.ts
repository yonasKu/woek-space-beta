import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { handleApiError, requireOrgMember } from '@/lib/middleware/org-middleware'

// GET /api/organizations/:orgId - Get organization details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const session = await requireAuth()
    await requireOrgMember(session.user.id, orgId)

    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        },
        _count: {
          select: {
            members: true,
            outlines: true,
          }
        }
      }
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(organization)
  } catch (error) {
    return handleApiError(error)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { handleApiError, requireOrgOwner, ApiError } from '@/lib/middleware/org-middleware'
import { randomBytes } from 'crypto'

// POST /api/organizations/:orgId/members/invite - Invite member (Owner only)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const session = await requireAuth()
    await requireOrgOwner(session.user.id, orgId)

    const body = await req.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      throw new ApiError(400, 'Email is required')
    }

    // Check if user exists
    const invitedUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!invitedUser) {
      throw new ApiError(404, 'User with this email does not exist')
    }

    // Check if already a member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: orgId,
        userId: invitedUser.id,
      }
    })

    if (existingMember) {
      throw new ApiError(400, 'User is already a member of this organization')
    }

    // Generate invitation token
    const token = randomBytes(32).toString('hex')

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        organizationId: orgId,
        email,
        invitedBy: session.user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        organization: true,
      }
    })

    // TODO: Send email with invitation link
    // For now, return the token so it can be used manually
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/organizations/join/${token}`

    return NextResponse.json({
      invitation,
      inviteLink,
      message: 'Invitation created successfully'
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

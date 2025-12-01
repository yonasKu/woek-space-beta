import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { handleApiError, ApiError } from '@/lib/middleware/org-middleware'

// POST /api/organizations/join - Accept invitation and join organization
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { token } = body

    if (!token || typeof token !== 'string') {
      throw new ApiError(400, 'Invitation token is required')
    }

    // Find invitation
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { organization: true }
    })

    if (!invitation) {
      throw new ApiError(404, 'Invitation not found')
    }

    // Check if expired
    if (invitation.expiresAt < new Date()) {
      throw new ApiError(400, 'Invitation has expired')
    }

    // Check if already accepted
    if (invitation.acceptedAt) {
      throw new ApiError(400, 'Invitation has already been accepted')
    }

    // Check if user email matches invitation
    if (invitation.email !== session.user.email) {
      throw new ApiError(403, 'This invitation is for a different email address')
    }

    // Check if already a member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: invitation.organizationId,
        userId: session.user.id,
      }
    })

    if (existingMember) {
      throw new ApiError(400, 'You are already a member of this organization')
    }

    // Add user as member and mark invitation as accepted
    const [member] = await prisma.$transaction([
      prisma.organizationMember.create({
        data: {
          organizationId: invitation.organizationId,
          userId: session.user.id,
          role: invitation.role,
        },
        include: {
          organization: true,
        }
      }),
      prisma.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() }
      })
    ])

    return NextResponse.json({
      success: true,
      organization: member.organization,
      message: 'Successfully joined organization'
    })
  } catch (error) {
    return handleApiError(error)
  }
}

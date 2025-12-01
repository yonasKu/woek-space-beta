import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { handleApiError } from '@/lib/middleware/org-middleware'

// GET /api/organizations - List user's organizations
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth()

    const memberships = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      include: {
        organization: true,
      },
      orderBy: {
        joinedAt: 'desc'
      }
    })

    const organizations = memberships.map(m => m.organization)

    return NextResponse.json(organizations)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/organizations - Create organization
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth()
    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      )
    }

    // Create organization and add creator as owner in a transaction
    const organization = await prisma.organization.create({
      data: {
        name,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'Owner',
          }
        }
      },
      include: {
        members: true,
      }
    })

    return NextResponse.json(organization, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

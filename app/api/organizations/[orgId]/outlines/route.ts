import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { handleApiError, requireOrgMember, ApiError } from '@/lib/middleware/org-middleware'

// GET /api/organizations/:orgId/outlines - List outlines
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const session = await requireAuth()
    await requireOrgMember(session.user.id, orgId)

    const outlines = await prisma.outline.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(outlines)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/organizations/:orgId/outlines - Create outline
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const session = await requireAuth()
    await requireOrgMember(session.user.id, orgId)

    const body = await req.json()
    const { header, sectionType, status, target, limit, reviewer } = body

    console.log('Received body:', JSON.stringify(body, null, 2))
    console.log('Target:', target, 'Type:', typeof target, 'isNaN:', isNaN(target))
    console.log('Limit:', limit, 'Type:', typeof limit, 'isNaN:', isNaN(limit))

    // Validate required fields
    if (!header || !sectionType || !status || target === undefined || limit === undefined || !reviewer) {
      console.error('Validation failed: missing required fields')
      throw new ApiError(400, 'All fields are required')
    }

    // Validate enums
    const validSectionTypes = ['TableOfContents', 'ExecutiveSummary', 'TechnicalApproach', 'Design', 'Capabilities', 'FocusDocument', 'Narrative']
    const validStatuses = ['Pending', 'InProgress', 'Completed']

    if (!validSectionTypes.includes(sectionType)) {
      console.error('Invalid section type:', sectionType)
      throw new ApiError(400, 'Invalid section type')
    }

    if (!validStatuses.includes(status)) {
      console.error('Invalid status:', status)
      throw new ApiError(400, 'Invalid status')
    }

    // Validate numbers
    if (typeof target !== 'number' || typeof limit !== 'number' || isNaN(target) || isNaN(limit)) {
      console.error('Invalid numbers - Target:', target, typeof target, 'Limit:', limit, typeof limit)
      throw new ApiError(400, `Target and limit must be valid numbers. Got target: ${target} (${typeof target}), limit: ${limit} (${typeof limit})`)
    }

    const outline = await prisma.outline.create({
      data: {
        organizationId: orgId,
        header,
        sectionType,
        status,
        target,
        limit,
        reviewer,
      }
    })

    return NextResponse.json(outline, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

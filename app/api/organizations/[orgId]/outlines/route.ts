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
    console.log('📝 Creating outline with body:', JSON.stringify(body, null, 2))
    
    const { header, sectionType, status, target, limit, reviewer } = body

    // Validate required fields
    if (!header || !sectionType || !status || target === undefined || limit === undefined) {
      throw new ApiError(400, 'Header, section type, status, target, and limit are required')
    }

    // Validate enums
    const validSectionTypes = ['TableOfContents', 'ExecutiveSummary', 'TechnicalApproach', 'Design', 'Capabilities', 'FocusDocument', 'Narrative']
    const validStatuses = ['Pending', 'InProgress', 'Completed']

    if (!validSectionTypes.includes(sectionType)) {
      throw new ApiError(400, 'Invalid section type')
    }

    if (!validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid status')
    }

    // Validate and convert numbers
    const targetNum = typeof target === 'number' ? target : Number(target)
    const limitNum = typeof limit === 'number' ? limit : Number(limit)
    
    if (isNaN(targetNum) || isNaN(limitNum)) {
      throw new ApiError(400, 'Target and limit must be valid numbers')
    }

    console.log('✅ Validation passed, creating outline with:', {
      organizationId: orgId,
      header,
      sectionType,
      status,
      target: targetNum,
      limit: limitNum,
      reviewer: reviewer || null,
    })

    const outline = await prisma.outline.create({
      data: {
        organizationId: orgId,
        header,
        sectionType,
        status,
        target: targetNum,
        limit: limitNum,
        reviewer: reviewer || null,
      }
    })

    console.log('🎉 Outline created successfully:', outline.id)
    return NextResponse.json(outline, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating outline:', error)
    return handleApiError(error)
  }
}

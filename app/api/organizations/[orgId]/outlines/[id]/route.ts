import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { handleApiError, requireOrgMember, ApiError } from '@/lib/middleware/org-middleware'

// PUT /api/organizations/:orgId/outlines/:id - Update outline
export async function PUT(
  req: NextRequest,
  { params }: { params: { orgId: string; id: string } }
) {
  try {
    const session = await requireAuth()
    await requireOrgMember(session.user.id, params.orgId)

    const body = await req.json()

    // Verify outline belongs to this organization
    const existingOutline = await prisma.outline.findFirst({
      where: {
        id: params.id,
        organizationId: params.orgId,
      }
    })

    if (!existingOutline) {
      throw new ApiError(404, 'Outline not found')
    }

    // Validate enums if provided
    if (body.sectionType) {
      const validSectionTypes = ['TableOfContents', 'ExecutiveSummary', 'TechnicalApproach', 'Design', 'Capabilities', 'FocusDocument', 'Narrative']
      if (!validSectionTypes.includes(body.sectionType)) {
        throw new ApiError(400, 'Invalid section type')
      }
    }

    if (body.status) {
      const validStatuses = ['Pending', 'InProgress', 'Completed']
      if (!validStatuses.includes(body.status)) {
        throw new ApiError(400, 'Invalid status')
      }
    }

    if (body.reviewer) {
      const validReviewers = ['Assim', 'Bini', 'Mami']
      if (!validReviewers.includes(body.reviewer)) {
        throw new ApiError(400, 'Invalid reviewer')
      }
    }

    // Update outline
    const outline = await prisma.outline.update({
      where: { id: params.id },
      data: {
        ...(body.header && { header: body.header }),
        ...(body.sectionType && { sectionType: body.sectionType }),
        ...(body.status && { status: body.status }),
        ...(body.target !== undefined && { target: body.target }),
        ...(body.limit !== undefined && { limit: body.limit }),
        ...(body.reviewer && { reviewer: body.reviewer }),
      }
    })

    return NextResponse.json(outline)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/organizations/:orgId/outlines/:id - Delete outline
export async function DELETE(
  req: NextRequest,
  { params }: { params: { orgId: string; id: string } }
) {
  try {
    const session = await requireAuth()
    await requireOrgMember(session.user.id, params.orgId)

    // Verify outline belongs to this organization
    const existingOutline = await prisma.outline.findFirst({
      where: {
        id: params.id,
        organizationId: params.orgId,
      }
    })

    if (!existingOutline) {
      throw new ApiError(404, 'Outline not found')
    }

    // Delete outline
    await prisma.outline.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Outline deleted successfully'
    })
  } catch (error) {
    return handleApiError(error)
  }
}

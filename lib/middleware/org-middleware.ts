import prisma from '@/lib/db/client'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function requireOrgMember(userId: string, orgId: string) {
  const member = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId: orgId,
    },
    include: {
      organization: true,
    }
  })

  if (!member) {
    throw new ApiError(403, 'Not a member of this organization')
  }

  return member
}

export async function requireOrgOwner(userId: string, orgId: string) {
  const member = await requireOrgMember(userId, orgId)

  if (member.role !== 'Owner') {
    throw new ApiError(403, 'Only owners can perform this action')
  }

  return member
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status })
  }
  
  if (error instanceof Error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json({ error: 'Internal server error' }, { status: 500 })
}

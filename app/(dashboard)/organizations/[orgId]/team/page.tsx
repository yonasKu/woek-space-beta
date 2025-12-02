import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { TeamList } from '@/components/team/team-list'

export default async function TeamPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const session = await getSession()
  
  if (!session) {
    redirect('/sign-in')
  }

  const member = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: orgId,
    },
  })

  if (!member) {
    redirect('/dashboard')
  }

  return <TeamList orgId={orgId} isOwner={member.role === 'Owner'} />
}

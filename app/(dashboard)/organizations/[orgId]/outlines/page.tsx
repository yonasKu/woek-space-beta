import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { OutlinesTableV2 } from '@/components/outlines/outlines-table-v2'

export default async function OutlinesPage({ params }: { params: Promise<{ orgId: string }> }) {
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

  return <OutlinesTableV2 userRole={member.role} />
}
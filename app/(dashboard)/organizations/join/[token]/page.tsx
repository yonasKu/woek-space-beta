import { getSession } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db/client'
import { JoinOrgForm } from '@/components/organizations/join-org-form'

interface JoinOrgPageProps {
  params: { token: string }
}

export default async function JoinOrgPage({ params }: JoinOrgPageProps) {
  const session = await getSession()
  
  if (!session) {
    redirect('/sign-in')
  }

  // Get invitation details
  const invitation = await prisma.invitation.findUnique({
    where: { token: params.token },
    include: { organization: true }
  })

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation Not Found</h1>
          <p className="text-gray-600">This invitation link is invalid or has expired.</p>
        </div>
      </div>
    )
  }

  if (invitation.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation Expired</h1>
          <p className="text-gray-600">This invitation has expired. Please request a new one.</p>
        </div>
      </div>
    )
  }

  if (invitation.acceptedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation Already Used</h1>
          <p className="text-gray-600">This invitation has already been accepted.</p>
        </div>
      </div>
    )
  }

  if (invitation.email !== session.user.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wrong Account</h1>
          <p className="text-gray-600">
            This invitation is for {invitation.email}. Please sign in with the correct account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <JoinOrgForm 
        token={params.token}
        organizationName={invitation.organization.name}
      />
    </div>
  )
}
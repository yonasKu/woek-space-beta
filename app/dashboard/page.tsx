import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/server'
import prisma from '@/lib/db/client'

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/sign-in')
  }

  // Get user's organizations
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { joinedAt: 'desc' }
  })

  // If user has organizations, redirect to the first one
  if (memberships.length > 0) {
    const firstOrg = memberships[0].organization
    redirect(`/organizations/${firstOrg.id}/outlines`)
  }

  // If no organizations, show empty state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Organizations Yet</h1>
        <p className="text-gray-600 mb-6">Create an organization or wait for an invitation</p>
        <div className="space-x-4">
          <a 
            href="/organizations/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Create Organization
          </a>
        </div>
      </div>
    </div>
  )
}
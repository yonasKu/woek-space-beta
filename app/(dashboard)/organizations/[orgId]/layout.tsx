import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/server'
import prisma from '@/lib/db/client'
import { TabsNav } from '@/components/dashboard/tabs-nav'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { OrgSwitcher } from '@/components/dashboard/org-switcher'

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ orgId: string }>
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { orgId } = await params
  const session = await getSession()
  
  if (!session) {
    redirect('/sign-in')
  }

  // Verify user is member of this organization
  const member = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: orgId,
    },
    include: {
      organization: true,
    }
  })

  if (!member) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Organization Switcher */}
        <OrgSwitcher 
          currentOrgId={orgId}
          currentOrgName={member.organization.name}
        />

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Platform</h3>
            <div className="space-y-1">
              <a
                href={`/organizations/${orgId}/outlines`}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Table
              </a>
              <a
                href={`/organizations/${orgId}/team`}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Team Info / Setup
              </a>
            </div>
          </div>
        </nav>

        {/* Sign Out at Bottom */}
        <div className="p-4 border-t border-gray-200">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TabsNav orgId={orgId} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FileText, Users, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  orgId: string
  orgName: string
}

export function Sidebar({ orgId, orgName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const navigation = [
    {
      name: 'Outlines',
      href: `/organizations/${orgId}/outlines`,
      icon: FileText,
    },
    {
      name: 'Team',
      href: `/organizations/${orgId}/team`,
      icon: Users,
    },
  ]

  async function handleSignOut() {
    await signOut()
    router.push('/sign-in')
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      {/* Organization Header */}
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {orgName}
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
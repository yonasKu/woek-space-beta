"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TabsNavProps {
  orgId: string
}

export function TabsNav({ orgId }: TabsNavProps) {
  const pathname = usePathname()

  const tabs = [
    { name: 'Outline', href: `/organizations/${orgId}/outlines` },
    { name: 'Past Performance', href: `/organizations/${orgId}/past-performance` },
    { name: 'Key Personnel', href: `/organizations/${orgId}/key-personnel` },
    { name: 'Focus Documents', href: `/organizations/${orgId}/focus-documents` },
  ]

  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                isActive
                  ? 'border-black text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              {tab.name}
              {tab.badge && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {tab.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
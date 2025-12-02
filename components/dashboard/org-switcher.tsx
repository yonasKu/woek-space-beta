"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Organization {
  id: string
  name: string
}

interface OrgSwitcherProps {
  currentOrgId: string
  currentOrgName: string
}

export function OrgSwitcher({ currentOrgId, currentOrgName }: OrgSwitcherProps) {
  const router = useRouter()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  async function fetchOrganizations() {
    try {
      const response = await fetch('/api/organizations')
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data)
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  function switchOrganization(orgId: string) {
    router.push(`/organizations/${orgId}/outlines`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-semibold">
              {currentOrgName.charAt(0)}
            </div>
            <div className="flex-1 text-left">
              <h2 className="font-semibold text-sm">{currentOrgName}</h2>
              <p className="text-xs text-gray-500">Enterprise</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {loading ? (
          <div className="p-2 text-sm text-gray-500">Loading...</div>
        ) : organizations.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">No organizations</div>
        ) : (
          organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => switchOrganization(org.id)}
              className={org.id === currentOrgId ? 'bg-gray-100' : ''}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                  {org.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{org.name}</p>
                  {org.id === currentOrgId && (
                    <p className="text-xs text-gray-500">Current</p>
                  )}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

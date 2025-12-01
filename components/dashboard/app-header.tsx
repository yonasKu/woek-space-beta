"use client"

import { Button } from '@/components/ui/button'
import { ChevronDown, Menu } from 'lucide-react'
import { SignOutButton } from '@/components/auth/sign-out-button'

interface AppHeaderProps {
  orgName: string
}

export function AppHeader({ orgName }: AppHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-black text-white text-sm font-semibold">
              {orgName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-900">{orgName}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-xs text-gray-500">Enterprise</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}
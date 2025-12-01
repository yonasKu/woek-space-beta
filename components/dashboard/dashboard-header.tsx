"use client"

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'

export function DashboardHeader() {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/sign-in')
  }

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
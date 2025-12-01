"use client"

import { useSession } from '@/lib/auth/auth-client'

export function useAuth() {
  const { data: session, isPending, error } = useSession()
  
  return {
    user: session?.user || null,
    session,
    loading: isPending,
    isAuthenticated: !!session?.user,
    error,
  }
}
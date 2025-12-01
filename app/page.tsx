import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/server'

export default async function HomePage() {
  const session = await getSession()
  
  if (session) {
    // User is authenticated, redirect to dashboard
    redirect('/dashboard')
  } else {
    // User is not authenticated, redirect to sign in
    redirect('/sign-in')
  }
}
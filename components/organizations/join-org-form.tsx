"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface JoinOrgFormProps {
  token: string
  organizationName: string
}

export function JoinOrgForm({ token, organizationName }: JoinOrgFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleJoin() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/organizations/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to join organization')
      }

      const data = await response.json()
      
      // Redirect to organization dashboard
      router.push(`/organizations/${data.organization.id}/outlines`)
    } catch (err: any) {
      setError(err.message || 'Failed to join organization')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Join Organization</CardTitle>
        <CardDescription>
          You've been invited to join <strong>{organizationName}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Click the button below to accept the invitation and join the organization.
          </p>
          
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <Button onClick={handleJoin} disabled={loading} className="w-full">
            {loading ? 'Joining...' : 'Join Organization'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
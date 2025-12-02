"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Outline } from '@/lib/types'

interface OutlineSheetProps {
  outline: Outline | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface Member {
  id: string
  user: {
    name: string | null
    email: string
  }
}

export function OutlineSheet({ outline, open, onOpenChange, onSuccess }: OutlineSheetProps) {
  const params = useParams()
  const orgId = params.orgId as string
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [members, setMembers] = useState<Member[]>([])

  // Fetch organization members
  useEffect(() => {
    if (open && orgId) {
      fetch(`/api/organizations/${orgId}/members`)
        .then(res => res.json())
        .then(data => setMembers(data))
        .catch(err => console.error('Failed to fetch members:', err))
    }
  }, [open, orgId])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    const targetValue = formData.get('target') as string
    const limitValue = formData.get('limit') as string
    
    const target = Number(targetValue)
    const limit = Number(limitValue)
    
    const reviewerValue = formData.get('reviewer') as string
    
    const data = {
      header: formData.get('header') as string,
      sectionType: formData.get('sectionType') as string,
      status: formData.get('status') as string,
      target: isNaN(target) ? 0 : target,
      limit: isNaN(limit) ? 0 : limit,
      reviewer: reviewerValue === 'unassigned' ? null : reviewerValue,
    }

    try {
      const url = outline
        ? `/api/organizations/${orgId}/outlines/${outline.id}`
        : `/api/organizations/${orgId}/outlines`

      const method = outline ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save outline')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{outline ? 'Edit' : 'Add'} Section</SheetTitle>
          <SheetDescription>
            {outline ? 'Update the section details below.' : 'Create a new section for your outline.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="header">Header</Label>
            <Input
              id="header"
              name="header"
              defaultValue={outline?.header || ''}
              placeholder="Enter section header"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectionType">Section Type</Label>
            <Select name="sectionType" defaultValue={outline?.sectionType || ''} required>
              <SelectTrigger>
                <SelectValue placeholder="Select section type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TableOfContents">Table of Contents</SelectItem>
                <SelectItem value="ExecutiveSummary">Executive Summary</SelectItem>
                <SelectItem value="TechnicalApproach">Technical Approach</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Capabilities">Capabilities</SelectItem>
                <SelectItem value="FocusDocument">Focus Document</SelectItem>
                <SelectItem value="Narrative">Narrative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={outline?.status || 'Pending'} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                name="target"
                type="number"
                defaultValue={outline?.target || ''}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Limit</Label>
              <Input
                id="limit"
                name="limit"
                type="number"
                defaultValue={outline?.limit || ''}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewer">Reviewer</Label>
            <Select name="reviewer" defaultValue={outline?.reviewer || 'unassigned'}>
              <SelectTrigger>
                <SelectValue placeholder="Assign reviewer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Assign reviewer</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.user.name || member.user.email}>
                    {member.user.name || member.user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : outline ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
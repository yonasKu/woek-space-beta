"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InviteMemberDialog } from './invite-member-dialog'
import type { OrganizationMember } from '@/lib/types'

interface TeamListProps {
  orgId: string
  isOwner: boolean
}

export function TeamList({ orgId, isOwner }: TeamListProps) {
  
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [removeDialog, setRemoveDialog] = useState<{ open: boolean; member: OrganizationMember | null }>({
    open: false,
    member: null,
  })

  useEffect(() => {
    fetchMembers()
  }, [orgId])

  async function fetchMembers() {
    try {
      const response = await fetch(`/api/organizations/${orgId}/members`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleRemove(member: OrganizationMember) {
    setRemoveDialog({ open: true, member })
  }

  async function confirmRemove() {
    if (!removeDialog.member) return

    try {
      const response = await fetch(
        `/api/organizations/${orgId}/members/${removeDialog.member.id}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        await fetchMembers()
        setRemoveDialog({ open: false, member: null })
      }
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  function onInviteSuccess() {
    fetchMembers()
    setInviteDialogOpen(false)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        {isOwner && (
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {member.user?.name?.[0] || member.user?.email[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {member.user?.name || 'Unknown User'}
                  </p>
                  <p className="text-sm text-gray-500">{member.user?.email}</p>
                  <p className="text-xs text-gray-400">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={member.role === 'Owner' ? 'default' : 'secondary'}>
                  {member.role}
                </Badge>
                {isOwner && member.role !== 'Owner' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(member)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InviteMemberDialog
        orgId={orgId}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onSuccess={onInviteSuccess}
      />

      <Dialog open={removeDialog.open} onOpenChange={(open) => setRemoveDialog({ open, member: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {removeDialog.member?.user?.name || removeDialog.member?.user?.email} from this organization?
              They will lose access to all organization data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveDialog({ open: false, member: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
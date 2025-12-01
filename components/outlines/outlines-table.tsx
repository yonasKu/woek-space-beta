"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { OutlineSheet } from './outline-sheet'
import type { Outline } from '@/lib/types'

export function OutlinesTable() {
  const params = useParams()
  const orgId = params.orgId as string
  
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; outline: Outline | null }>({
    open: false,
    outline: null,
  })

  useEffect(() => {
    fetchOutlines()
  }, [orgId])

  async function fetchOutlines() {
    try {
      const response = await fetch(`/api/organizations/${orgId}/outlines`)
      if (response.ok) {
        const data = await response.json()
        setOutlines(data)
      }
    } catch (error) {
      console.error('Failed to fetch outlines:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAdd() {
    setSelectedOutline(null)
    setIsSheetOpen(true)
  }

  function handleEdit(outline: Outline) {
    setSelectedOutline(outline)
    setIsSheetOpen(true)
  }

  function handleDelete(outline: Outline) {
    setDeleteDialog({ open: true, outline })
  }

  async function confirmDelete() {
    if (!deleteDialog.outline) return

    try {
      const response = await fetch(
        `/api/organizations/${orgId}/outlines/${deleteDialog.outline.id}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        await fetchOutlines()
        setDeleteDialog({ open: false, outline: null })
      }
    } catch (error) {
      console.error('Failed to delete outline:', error)
    }
  }

  function onOutlineChange() {
    fetchOutlines()
    setIsSheetOpen(false)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Outlines</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
              <TableHead>Section Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outlines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No outlines yet. Click "Add Section" to create your first outline.
                </TableCell>
              </TableRow>
            ) : (
              outlines.map((outline) => (
                <TableRow key={outline.id}>
                  <TableCell
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => handleEdit(outline)}
                  >
                    {outline.header}
                  </TableCell>
                  <TableCell>{outline.sectionType.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        outline.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : outline.status === 'InProgress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {outline.status === 'InProgress' ? 'In Progress' : outline.status}
                    </span>
                  </TableCell>
                  <TableCell>{outline.target}</TableCell>
                  <TableCell>{outline.limit}</TableCell>
                  <TableCell>{outline.reviewer}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(outline)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(outline)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OutlineSheet
        outline={selectedOutline}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSuccess={onOutlineChange}
      />

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, outline: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Outline</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.outline?.header}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, outline: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
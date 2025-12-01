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
import { GripVertical, MoreHorizontal, Plus, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { cn } from '@/lib/utils'

export function OutlinesTableV2() {
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
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

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

  // Pagination
  const totalPages = Math.ceil(outlines.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentOutlines = outlines.slice(startIndex, endIndex)

  function formatSectionType(type: string) {
    return type.replace(/([A-Z])/g, ' $1').trim()
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'Completed':
        return 'text-green-600'
      case 'InProgress':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          {outlines.length > 0 && `0 of ${outlines.length} row(s) selected.`}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Customize Columns
          </Button>
          <Button onClick={handleAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[30px]"></TableHead>
              <TableHead className="font-semibold">Header</TableHead>
              <TableHead className="font-semibold">Section Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Target</TableHead>
              <TableHead className="font-semibold text-right">Limit</TableHead>
              <TableHead className="font-semibold">Reviewer</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOutlines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                  No outlines yet. Click "Add Section" to create your first outline.
                </TableCell>
              </TableRow>
            ) : (
              currentOutlines.map((outline) => (
                <TableRow key={outline.id} className="hover:bg-gray-50">
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  </TableCell>
                  <TableCell
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => handleEdit(outline)}
                  >
                    {outline.header}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {formatSectionType(outline.sectionType)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", 
                        outline.status === 'Completed' ? 'bg-green-500' :
                        outline.status === 'InProgress' ? 'bg-yellow-500' : 'bg-gray-300'
                      )} />
                      <span className={cn("text-sm", getStatusColor(outline.status))}>
                        {outline.status === 'InProgress' ? 'In Progress' : outline.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm">{outline.target}</TableCell>
                  <TableCell className="text-right text-sm">{outline.limit}</TableCell>
                  <TableCell className="text-sm text-gray-600">{outline.reviewer}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(outline)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(outline)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {outlines.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Rows per page: {rowsPerPage}
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                «
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                »
              </Button>
            </div>
          </div>
        </div>
      )}

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
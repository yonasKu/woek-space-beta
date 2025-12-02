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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OutlinesTableV2Props {
  userRole: 'Owner' | 'Member'
}

export function OutlinesTableV2({ userRole }: OutlinesTableV2Props) {
  const params = useParams()
  const orgId = params.orgId as string
  const isOwner = userRole === 'Owner'
  
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; outline: Outline | null }>({
    open: false,
    outline: null,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [members, setMembers] = useState<Array<{ id: string; user: { name: string | null; email: string } }>>([])
  const [visibleColumns, setVisibleColumns] = useState({
    header: true,
    sectionType: true,
    status: true,
    target: true,
    limit: true,
    reviewer: true,
  })
  const rowsPerPage = 10

  useEffect(() => {
    fetchOutlines()
    fetchMembers()
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

  async function fetchMembers() {
    try {
      const response = await fetch(`/api/organizations/${orgId}/members`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  async function handleReviewerChange(outlineId: string, reviewer: string) {
    try {
      const response = await fetch(`/api/organizations/${orgId}/outlines/${outlineId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer: reviewer === 'unassigned' ? null : reviewer }),
      })

      if (response.ok) {
        await fetchOutlines()
      }
    } catch (error) {
      console.error('Failed to update reviewer:', error)
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

  function toggleRowSelection(id: string) {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  function toggleAllRows() {
    if (selectedRows.size === currentOutlines.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(currentOutlines.map(o => o.id)))
    }
  }

  function toggleColumn(column: keyof typeof visibleColumns) {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-500">
          {selectedRows.size} of {outlines.length} row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Customize Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toggleColumn('header')}>
                <input type="checkbox" checked={visibleColumns.header} readOnly className="mr-2" />
                Header
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleColumn('sectionType')}>
                <input type="checkbox" checked={visibleColumns.sectionType} readOnly className="mr-2" />
                Type
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleColumn('status')}>
                <input type="checkbox" checked={visibleColumns.status} readOnly className="mr-2" />
                Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleColumn('target')}>
                <input type="checkbox" checked={visibleColumns.target} readOnly className="mr-2" />
                Target
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleColumn('limit')}>
                <input type="checkbox" checked={visibleColumns.limit} readOnly className="mr-2" />
                Limit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleColumn('reviewer')}>
                <input type="checkbox" checked={visibleColumns.reviewer} readOnly className="mr-2" />
                Reviewer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isOwner && (
            <Button onClick={handleAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[30px]">
                <input
                  type="checkbox"
                  checked={selectedRows.size === currentOutlines.length && currentOutlines.length > 0}
                  onChange={toggleAllRows}
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead className="w-[30px]"></TableHead>
              {visibleColumns.header && <TableHead className="font-semibold">Header</TableHead>}
              {visibleColumns.sectionType && <TableHead className="font-semibold">Section Type</TableHead>}
              {visibleColumns.status && <TableHead className="font-semibold">Status</TableHead>}
              {visibleColumns.target && <TableHead className="font-semibold text-right">Target</TableHead>}
              {visibleColumns.limit && <TableHead className="font-semibold text-right">Limit</TableHead>}
              {visibleColumns.reviewer && <TableHead className="font-semibold">Reviewer</TableHead>}
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
                    <input
                      type="checkbox"
                      checked={selectedRows.has(outline.id)}
                      onChange={() => toggleRowSelection(outline.id)}
                      className="cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  </TableCell>
                  {visibleColumns.header && (
                    <TableCell
                      className={isOwner ? "font-medium cursor-pointer hover:text-blue-600" : "font-medium"}
                      onClick={() => isOwner && handleEdit(outline)}
                    >
                      {outline.header}
                    </TableCell>
                  )}
                  {visibleColumns.sectionType && (
                    <TableCell className="text-gray-600 text-sm">
                      {formatSectionType(outline.sectionType)}
                    </TableCell>
                  )}
                  {visibleColumns.status && (
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
                  )}
                  {visibleColumns.target && <TableCell className="text-right text-sm">{outline.target}</TableCell>}
                  {visibleColumns.limit && <TableCell className="text-right text-sm">{outline.limit}</TableCell>}
                  {visibleColumns.reviewer && (
                    <TableCell>
                      {outline.reviewer ? (
                        <span className="text-sm text-gray-600">{outline.reviewer}</span>
                      ) : isOwner ? (
                        <Select
                          value="unassigned"
                          onValueChange={(value) => handleReviewerChange(outline.id, value)}
                        >
                          <SelectTrigger className="h-8 w-[140px] bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100">
                            <SelectValue placeholder="Assign reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            {members.map((member) => (
                              <SelectItem key={member.id} value={member.user.name || member.user.email}>
                                {member.user.name || member.user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm text-gray-400">Assign reviewer</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {isOwner && (
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
                    )}
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
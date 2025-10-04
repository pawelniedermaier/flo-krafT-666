"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Sprint, SprintStatus } from "@/lib/types"

interface SprintFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<Sprint>) => void
  sprint?: Sprint
}

export function SprintFormDialog({
  open,
  onOpenChange,
  onSubmit,
  sprint,
}: SprintFormDialogProps) {
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  const [formData, setFormData] = useState<Partial<Sprint>>({
    name: sprint?.name || "",
    status: sprint?.status || "planned",
    startDate: sprint?.startDate,
    endDate: sprint?.endDate,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      status: "planned",
      startDate: undefined,
      endDate: undefined,
    })
  }

  const statuses: Array<{ value: SprintStatus; label: string }> = [
    { value: "planned", label: "Planned" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{sprint ? "Edit Sprint" : "Create New Sprint"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Sprint Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter sprint name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as SprintStatus })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formatDateForInput(formData.startDate)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formatDateForInput(formData.endDate)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{sprint ? "Update" : "Create"} Sprint</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


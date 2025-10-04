"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Issue, IssueStatus, IssuePriority, User, Sprint } from "@/lib/types"

interface IssueFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<Issue>) => void
  issue?: Issue
  users: User[]
  sprints: Sprint[]
}

export function IssueFormDialog({
  open,
  onOpenChange,
  onSubmit,
  issue,
  users,
  sprints,
}: IssueFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Issue>>({
    title: issue?.title || "",
    description: issue?.description || "",
    status: issue?.status || "todo",
    priority: issue?.priority || "P2",
    assigneeId: issue?.assigneeId,
    sprintId: issue?.sprintId,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "P2",
      assigneeId: "",
      sprintId: "",
    })
  }

  const statuses: Array<{ value: IssueStatus; label: string }> = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "in-review", label: "In Review" },
    { value: "done", label: "Done" },
  ]

  const priorities: Array<{ value: IssuePriority; label: string }> = [
    { value: "P0", label: "P0 - Critical" },
    { value: "P1", label: "P1 - High" },
    { value: "P2", label: "P2 - Medium" },
    { value: "P3", label: "P3 - Low" },
    { value: "P4", label: "P4 - Very Low" },
    { value: "P5", label: "P5 - Trivial" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{issue ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as IssueStatus })}
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

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as IssuePriority })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={formData.assigneeId || "unassigned"}
                onValueChange={(value) => setFormData({ ...formData, assigneeId: value === "unassigned" ? undefined : value })}
              >
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprint">Sprint</Label>
              <Select
                value={formData.sprintId || "no-sprint"}
                onValueChange={(value) => setFormData({ ...formData, sprintId: value === "no-sprint" ? undefined : value })}
              >
                <SelectTrigger id="sprint">
                  <SelectValue placeholder="Select sprint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-sprint">No Sprint</SelectItem>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      {sprint.name} ({sprint.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{issue ? "Update" : "Create"} Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


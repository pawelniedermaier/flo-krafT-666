"use client"

import { IssueCard } from "./issue-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Issue, User, IssueStatus } from "@/lib/types"

interface KanbanBoardProps {
  issues: Issue[]
  users: User[]
  onEdit?: (issue: Issue) => void
  onDelete?: (issueId: string) => void
  onAdd?: () => void
  onStatusChange?: (issueId: string, newStatus: IssueStatus) => void
}

const columns: Array<{ status: IssueStatus; label: string; color: string }> = [
  { status: "todo", label: "To Do", color: "bg-gray-500" },
  { status: "in-progress", label: "In Progress", color: "bg-blue-500" },
  { status: "in-review", label: "In Review", color: "bg-yellow-500" },
  { status: "done", label: "Done", color: "bg-green-500" },
]

export function KanbanBoard({
  issues,
  users,
  onEdit,
  onDelete,
  onAdd,
  onStatusChange,
}: KanbanBoardProps) {
  const getIssuesByStatus = (status: IssueStatus) => {
    return issues.filter((issue) => issue.status === status)
  }

  const getUserById = (userId: string | undefined) => {
    if (!userId) return undefined
    return users.find((user) => user.id === userId)
  }

  return (
    <div className="space-y-6">
      {/* Kanban Columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => {
          const columnIssues = getIssuesByStatus(column.status)
          return (
            <div key={column.status} className="flex flex-col gap-4">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-3 rounded-full ${column.color}`} />
                  <h2 className="font-semibold">{column.label}</h2>
                  <span className="text-sm text-muted-foreground">
                    {columnIssues.length}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              <div className="flex flex-col gap-3">
                {columnIssues.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </div>
                ) : (
                  columnIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      assignee={getUserById(issue.assigneeId)}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


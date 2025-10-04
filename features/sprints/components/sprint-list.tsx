"use client"

import { SprintCard } from "./sprint-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Sprint, Issue } from "@/lib/types"

interface SprintListProps {
  sprints: Sprint[]
  issues: Issue[]
  onEdit?: (sprint: Sprint) => void
  onDelete?: (sprintId: string) => void
  onAdd?: () => void
  onActivate?: (sprintId: string) => void
}

export function SprintList({
  sprints,
  issues,
  onEdit,
  onDelete,
  onAdd,
  onActivate,
}: SprintListProps) {
  const getIssueCountForSprint = (sprintId: string) => {
    return issues.filter((issue) => issue.sprintId === sprintId).length
  }

  const activeSprints = sprints.filter((s) => s.status === "active")
  const plannedSprints = sprints.filter((s) => s.status === "planned")
  const completedSprints = sprints.filter((s) => s.status === "completed")

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Sprints</p>
          <p className="text-2xl font-bold">{sprints.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold">{activeSprints.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Planned</p>
          <p className="text-2xl font-bold">{plannedSprints.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">{completedSprints.length}</p>
        </div>
      </div>

      {/* Active Sprints */}
      {activeSprints.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Active</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                issueCount={getIssueCountForSprint(sprint.id)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Planned Sprints */}
      {plannedSprints.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Planned</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plannedSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                issueCount={getIssueCountForSprint(sprint.id)}
                onEdit={onEdit}
                onDelete={onDelete}
                onActivate={onActivate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Sprints */}
      {completedSprints.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Completed</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                issueCount={getIssueCountForSprint(sprint.id)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


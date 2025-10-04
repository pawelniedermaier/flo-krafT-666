"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, Play } from "lucide-react"
import { sprintStatusColors } from "@/lib/constants"
import type { Sprint } from "@/lib/types"

interface SprintCardProps {
  sprint: Sprint
  issueCount?: number
  onEdit?: (sprint: Sprint) => void
  onDelete?: (sprintId: string) => void
  onActivate?: (sprintId: string) => void
}

export function SprintCard({
  sprint,
  issueCount = 0,
  onEdit,
  onDelete,
  onActivate,
}: SprintCardProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not set"
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card className="professional-card hover-lift">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-lg">{sprint.name}</CardTitle>
            <Badge className={sprintStatusColors[sprint.status]} variant="secondary">
              {sprint.status}
            </Badge>
          </div>
          <div className="flex gap-1">
            {sprint.status === "planned" && onActivate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onActivate(sprint.id)}
                aria-label="Activate sprint"
              >
                <Play className="size-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(sprint)}
                aria-label="Edit sprint"
              >
                <Edit className="size-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(sprint.id)}
                aria-label="Delete sprint"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tasks</span>
          <span className="font-semibold">{issueCount}</span>
        </div>
      </CardContent>
    </Card>
  )
}


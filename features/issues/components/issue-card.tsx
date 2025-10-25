"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar } from "lucide-react"
import { priorityColors, statusColors, PLACEHOLDER_AVATAR } from "@/lib/constants"
import type { Issue, User } from "@/lib/types"

interface IssueCardProps {
  issue: Issue
  assignee?: User
  onEdit?: (issue: Issue) => void
  onDelete?: (issueId: string) => void
  onStatusChange?: (issueId: string, newStatus: Issue["status"]) => void
}

export function IssueCard({ issue, assignee, onEdit, onDelete, onStatusChange }: IssueCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card className="professional-card hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${priorityColors[issue.priority]} text-xs`} variant="secondary">
                {issue.priority}
              </Badge>
              <Badge className={`${statusColors[issue.status]} text-xs`} variant="secondary">
                {issue.status}
              </Badge>
            </div>
            <CardTitle className="text-sm lg:text-base leading-tight line-clamp-2">{issue.title}</CardTitle>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(issue)}
                aria-label="Edit issue"
                className="h-8 w-8 lg:h-9 lg:w-9"
              >
                <Edit className="size-3 lg:size-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(issue.id)}
                aria-label="Delete issue"
                className="h-8 w-8 lg:h-9 lg:w-9"
              >
                <Trash2 className="size-3 lg:size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
          {issue.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {assignee ? (
              <>
                <Avatar className="size-5 lg:size-6">
                  <AvatarImage src={assignee.avatar || PLACEHOLDER_AVATAR} alt={assignee.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(assignee.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">{assignee.name}</span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
            <Calendar className="size-3" />
            <span className="hidden sm:inline">{formatDate(issue.createdAt)}</span>
            <span className="sm:hidden">{formatDate(issue.createdAt).split(' ')[0]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


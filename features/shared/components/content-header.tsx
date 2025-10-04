"use client"

import { Button } from "@/components/ui/button"
import { Plus, UserPlus, Calendar } from "lucide-react"
import type { ViewMode, Sprint, Issue, User } from "@/lib/types"

interface ContentHeaderProps {
  activeView: ViewMode | "organization" | "tarot"
  issues: Issue[]
  sprints: Sprint[]
  users: User[]
  onNewIssue?: () => void
  onNewSprint?: () => void
  onNewUser?: () => void
}

export function ContentHeader({
  activeView,
  issues,
  sprints,
  users,
  onNewIssue,
  onNewSprint,
  onNewUser,
}: ContentHeaderProps) {
  const activeSprint = sprints.find((s) => s.status === "active")

  const getTitle = () => {
    switch (activeView) {
      case "issues":
        return "Issues"
      case "kanban":
        return "Board"
      case "sprints":
        return "Sprints"
      case "users":
        return "Users"
      case "organization":
        return "Organization"
      case "tarot":
        return "TAROT AI BOOST™"
      default:
        return ""
    }
  }

  const getSubtitle = () => {
    switch (activeView) {
      case "issues":
        return `${issues.length} issues total`
      case "kanban":
        return activeSprint ? activeSprint.name : "No active sprint 🌑"
      case "sprints":
        return `${sprints.length} sprints`
      case "users":
        return `${users.filter((u) => u.isActive).length} active users`
      case "organization":
        return "Company hierarchy and reporting structure"
      case "tarot":
        return "🔮 Mystical insights for the enlightened leader"
      default:
        return ""
    }
  }

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{getTitle()}</h2>
          <p className="text-sm text-muted-foreground mt-1">{getSubtitle()}</p>
        </div>
        <div className="flex items-center gap-3">
          {activeView === "issues" && onNewIssue && (
            <Button className="gap-2" onClick={onNewIssue}>
              <Plus className="size-4" />
              New Issue
            </Button>
          )}
          {activeView === "kanban" && onNewIssue && (
            <Button className="gap-2" onClick={onNewIssue}>
              <Plus className="size-4" />
              New Task
            </Button>
          )}
          {activeView === "sprints" && onNewSprint && (
            <Button className="gap-2" onClick={onNewSprint}>
              <Calendar className="size-4" />
              New Sprint
            </Button>
          )}
          {activeView === "users" && onNewUser && (
            <Button className="gap-2" onClick={onNewUser}>
              <UserPlus className="size-4" />
              New User
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


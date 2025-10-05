"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/features/shared/components/loading-screen"
import { UserSelection } from "@/features/shared/components/user-selection"
import { Sidebar } from "@/features/shared/components/sidebar"
import { ContentHeader } from "@/features/shared/components/content-header"
import { TarotView } from "@/features/shared/components/tarot-view"
import { TextAnalysisView } from "@/features/shared/components/text-analysis-view"
import { ImageOverlayView } from "@/features/shared/components/image-overlay-view"
import DevilCodeView from "@/features/shared/components/devil-code-view"
import MemeGeneratorView from "@/features/shared/components/meme-generator-view"
import HellsAlarmView from "@/features/shared/components/hells-alarm-view"
import BetrayalRankingView from "@/features/shared/components/betrayal-ranking-view"
import StabBackView from "@/features/shared/components/stab-back-view"
import UserBetrayalView from "@/features/shared/components/user-betrayal-view"
import UserIncidentView from "@/features/shared/components/user-incident-view"
import { NotificationCenter } from "@/features/shared/components/notification-center"
import { NotificationScheduler } from "@/features/shared/components/notification-scheduler"
import { LeaderboardView } from "@/features/shared/components/leaderboard-view"
import { CompetitiveLeaderboardView } from "@/features/shared/components/competitive-leaderboard-view"
import { ReportFormDialog } from "@/features/shared/components/report-form-dialog"
import { UserList } from "@/features/users/components/user-list"
import { UserFormDialog } from "@/features/users/components/user-form-dialog"
import { OrganizationView } from "@/features/users/components/organization-view"
import { IssueList } from "@/features/issues/components/issue-list"
import { KanbanBoard } from "@/features/issues/components/kanban-board"
import { IssueFormDialog } from "@/features/issues/components/issue-form-dialog"
import { SprintList } from "@/features/sprints/components/sprint-list"
import { SprintFormDialog } from "@/features/sprints/components/sprint-form-dialog"
import { useUsers } from "@/features/users/hooks/use-users"
import { useIssues } from "@/features/issues/hooks/use-issues"
import { useSprints } from "@/features/sprints/hooks/use-sprints"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { Issue, User, Sprint, ViewMode } from "@/lib/types"

/**
 * Main application component - orchestrates all features
 * Refactored modular architecture with full feature parity
 */
export default function FlowCraft() {
  // Loading and intro state
  const [isLoading, setIsLoading] = useState(true)

  // View mode and user state
  const [activeView, setActiveView] = useLocalStorage<ViewMode | "organization" | "tarot" | "text-analysis" | "image-overlay" | "notifications" | "leaderboard" | "competitive-reports">("flowcraft-view-mode", "issues")
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>("flowcraft-current-user", null)
  const [theme, setTheme] = useLocalStorage<"light" | "dark" | "cyberpunk" | "turbo-matrix">("flowcraft-theme", "light")

  // Feature hooks (each manages its own state)
  const users = useUsers()
  const issues = useIssues()
  const sprints = useSprints()

  // Loading screen timer (3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove("dark", "cyberpunk", "turbo-matrix")
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (theme === "cyberpunk") {
      document.documentElement.classList.add("cyberpunk")
    } else if (theme === "turbo-matrix") {
      document.documentElement.classList.add("turbo-matrix")
    }
  }, [theme])

  // Dialog states
  const [issueDialog, setIssueDialog] = useState<{ open: boolean; issue?: Issue }>({
    open: false,
  })
  const [userDialog, setUserDialog] = useState<{ open: boolean; user?: User }>({
    open: false,
  })
  const [sprintDialog, setSprintDialog] = useState<{ open: boolean; sprint?: Sprint }>({
    open: false,
  })
  const [reportDialog, setReportDialog] = useState<{ open: boolean }>({
    open: false,
  })

  // Issue handlers
  const handleIssueAdd = () => {
    setIssueDialog({ open: true })
  }

  const handleIssueEdit = (issue: Issue) => {
    setIssueDialog({ open: true, issue })
  }

  const handleIssueSubmit = (data: Partial<Issue>) => {
    if (issueDialog.issue) {
      issues.updateIssue(issueDialog.issue.id, data)
    } else {
      // Convert to IssueFormData by ensuring required fields
      const issueData = {
        title: data.title || "",
        description: data.description || "",
        status: data.status || "todo",
        priority: data.priority || "P2",
        assigneeId: data.assigneeId,
        sprintId: data.sprintId,
      }
      issues.addIssue(issueData)
    }
  }

  const handleIssueDelete = (issueId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      issues.deleteIssue(issueId)
    }
  }

  // User handlers
  const handleUserAdd = () => {
    setUserDialog({ open: true })
  }

  const handleUserEdit = (user: User) => {
    setUserDialog({ open: true, user })
  }

  const handleUserSubmit = (data: Partial<User>) => {
    if (userDialog.user) {
      users.updateUser(userDialog.user.id, data)
    } else {
      // Convert to UserFormData by ensuring required fields
      const userData = {
        name: data.name || "",
        email: data.email || "",
        role: data.role || "developer",
        phone: data.phone,
        location: data.location,
        birthDate: data.birthDate,
        isActive: data.isActive ?? true,
        managerId: data.managerId,
      }
      users.addUser(userData)
    }
  }

  const handleUserDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      users.deleteUser(userId)
    }
  }

  // Sprint handlers
  const handleSprintAdd = () => {
    setSprintDialog({ open: true })
  }

  const handleSprintEdit = (sprint: Sprint) => {
    setSprintDialog({ open: true, sprint })
  }

  const handleSprintSubmit = (data: Partial<Sprint>) => {
    if (sprintDialog.sprint) {
      sprints.updateSprint(sprintDialog.sprint.id, data)
    } else {
      // Convert to SprintFormData by ensuring required fields
      const sprintData = {
        name: data.name || "",
        status: data.status || "planned",
        startDate: data.startDate,
        endDate: data.endDate,
      }
      sprints.addSprint(sprintData)
    }
  }

  const handleSprintDelete = (sprintId: string) => {
    if (confirm("Are you sure you want to delete this sprint?")) {
      sprints.deleteSprint(sprintId)
    }
  }

  const handleSprintActivate = (sprintId: string) => {
    sprints.updateSprint(sprintId, { status: "active" })
  }

  // Report handlers
  const handleReportSubmit = () => {
    setReportDialog({ open: true })
  }

  const handleReportFormSubmit = (report: any) => {
    // Report is already submitted by the form dialog
    console.log('Report submitted:', report)
  }

  // Loading Screen
  if (isLoading) {
    return <LoadingScreen />
  }

  // User Selection Screen
  if (!currentUser) {
    return (
      <UserSelection
        users={users.users}
        issues={issues.issues}
        onUserSelect={setCurrentUser}
      />
    )
  }

  // Main Application
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        currentUser={currentUser}
        users={users.users}
        onUserChange={setCurrentUser}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ContentHeader
          activeView={activeView}
          issues={issues.issues}
          sprints={sprints.sprints}
          users={users.users}
          onNewIssue={handleIssueAdd}
          onNewSprint={handleSprintAdd}
          onNewUser={handleUserAdd}
          onNewReport={handleReportSubmit}
        />

        <div className="flex-1 overflow-auto p-6">
          {/* Issues List View */}
          {activeView === "issues" && (
            <IssueList
              issues={issues.issues}
              users={users.users}
              onEdit={handleIssueEdit}
              onDelete={handleIssueDelete}
              onAdd={handleIssueAdd}
            />
          )}

          {/* Kanban Board View */}
          {activeView === "kanban" && (
            <KanbanBoard
              issues={issues.issues}
              users={users.users}
              onEdit={handleIssueEdit}
              onDelete={handleIssueDelete}
              onAdd={handleIssueAdd}
            />
          )}

          {/* Users/Team View */}
          {activeView === "users" && (
            <UserList
              users={users.users}
              issues={issues.issues}
              onEdit={handleUserEdit}
              onDelete={handleUserDelete}
              onAdd={handleUserAdd}
            />
          )}

          {/* Sprints View */}
          {activeView === "sprints" && (
            <SprintList
              sprints={sprints.sprints}
              issues={issues.issues}
              onEdit={handleSprintEdit}
              onDelete={handleSprintDelete}
              onAdd={handleSprintAdd}
              onActivate={handleSprintActivate}
            />
          )}

          {/* Organization View */}
          {activeView === "organization" && (
            <OrganizationView users={users.users} issues={issues.issues} />
          )}

          {/* Devil in the Code - Only for Boss and Director */}
          {activeView === "text-analysis" && currentUser && (currentUser.role === "boss" || currentUser.role === "director") && (
            <DevilCodeView />
          )}

          {/* Devil in the Code Access Denied */}
          {activeView === "text-analysis" && currentUser && currentUser.role !== "boss" && currentUser.role !== "director" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">🔒 Access Denied</h2>
              <p className="text-muted-foreground">
                The Devil in the Code tool is only available for users with "boss" or "director" roles.
              </p>
            </div>
          )}

          {/* Meme Generator - Only for Boss and Director */}
          {activeView === "image-overlay" && currentUser && (currentUser.role === "boss" || currentUser.role === "director") && (
            <MemeGeneratorView />
          )}

          {/* Meme Generator Access Denied */}
          {activeView === "image-overlay" && currentUser && currentUser.role !== "boss" && currentUser.role !== "director" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">🔒 Access Denied</h2>
              <p className="text-muted-foreground">
                The Meme Generator is only available for users with "boss" or "director" roles.
              </p>
            </div>
          )}

          {/* Notifications - Only for Boss and Director */}
          {activeView === "notifications" && currentUser && (currentUser.role === "boss" || currentUser.role === "director") && (
            <HellsAlarmView />
          )}

          {/* Notifications Access Denied */}
          {activeView === "notifications" && currentUser && currentUser.role !== "boss" && currentUser.role !== "director" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">🔒 Access Denied</h2>
              <p className="text-muted-foreground">
                The Notification System is only available for users with "boss" or "director" roles.
              </p>
            </div>
          )}

          {/* Betrayal Ranking - Different views for different roles */}
          {activeView === "leaderboard" && currentUser && (currentUser.role === "boss" || currentUser.role === "director") && (
            <BetrayalRankingView />
          )}

          {/* User-friendly Betrayal Ranking for regular users */}
          {activeView === "leaderboard" && currentUser && currentUser.role !== "boss" && currentUser.role !== "director" && (
            <UserBetrayalView />
          )}

          {/* Tarot AI Boost */}
          {activeView === "tarot" && currentUser?.role === "boss" && <TarotView />}

          {/* Tarot Access Denied */}
          {activeView === "tarot" && currentUser?.role !== "boss" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">🔒 Access Denied</h2>
              <p className="text-muted-foreground">
                TAROT AI BOOST is only available for users with the "boss" role.
              </p>
            </div>
          )}

          {/* Stab in the Back - Different views for different roles */}
          {activeView === "competitive-reports" && currentUser && (currentUser.role === "boss" || currentUser.role === "director") && (
            <StabBackView />
          )}

          {/* User-friendly Incident Reporting for regular users */}
          {activeView === "competitive-reports" && currentUser && currentUser.role !== "boss" && currentUser.role !== "director" && (
            <UserIncidentView />
          )}
        </div>
      </main>

      {/* Dialogs */}
      <IssueFormDialog
        open={issueDialog.open}
        onOpenChange={(open) => setIssueDialog({ open })}
        onSubmit={handleIssueSubmit}
        issue={issueDialog.issue}
        users={users.users}
        sprints={sprints.sprints}
      />

      <UserFormDialog
        open={userDialog.open}
        onOpenChange={(open) => setUserDialog({ open })}
        onSubmit={handleUserSubmit}
        user={userDialog.user}
        users={users.users}
      />

      <SprintFormDialog
        open={sprintDialog.open}
        onOpenChange={(open) => setSprintDialog({ open })}
        onSubmit={handleSprintSubmit}
        sprint={sprintDialog.sprint}
      />

      <ReportFormDialog
        open={reportDialog.open}
        onOpenChange={(open) => setReportDialog({ open })}
        onSubmit={handleReportFormSubmit}
        reporterId={currentUser?.id || ""}
        users={users.users}
      />
    </div>
  )
}

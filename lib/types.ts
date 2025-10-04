/**
 * Core type definitions for Flow Craft application
 */

// User Management Types
export type UserRole = "boss" | "director" | "manager" | "developer" | "designer" | "qa"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  location?: string
  birthDate?: Date
  joinedAt: Date
  isActive: boolean
  managerId?: string
}

// Issue/Task Management Types
export type IssueStatus = "todo" | "in-progress" | "in-review" | "done"
export type IssuePriority = "P0" | "P1" | "P2" | "P3" | "P4" | "P5"

export interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  assigneeId?: string
  sprintId?: string
  createdAt: Date
}

// Sprint Management Types
export type SprintStatus = "planned" | "active" | "completed"

export interface Sprint {
  id: string
  name: string
  status: SprintStatus
  startDate?: Date
  endDate?: Date
  createdAt: Date
}

// View Types
export type ViewMode = "issues" | "kanban" | "users" | "sprints" | "organization" | "tarot"

// Filter Types
export interface IssueFilters {
  search?: string
  status?: IssueStatus
  priority?: IssuePriority
  assigneeId?: string
  sprintId?: string
}

// Form Types
export type UserFormData = Omit<User, "id" | "joinedAt">
export type IssueFormData = Omit<Issue, "id" | "createdAt">
export type SprintFormData = Omit<Sprint, "id" | "createdAt">


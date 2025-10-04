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
export type ViewMode = "issues" | "kanban" | "users" | "sprints" | "organization" | "tarot" | "text-analysis" | "image-overlay" | "notifications" | "leaderboard" | "competitive-reports"

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

// Text Analysis Types
export interface SentimentScore {
  positive: number
  negative: number
  neutral: number
  compound: number
}

export interface PassiveAggressivePattern {
  type: "backhanded-compliment" | "false-enthusiasm" | "corporate-speak" | "dismissive" | "sarcastic"
  description: string
  intensity: number // 1-10 scale
}

export interface TextAnalysisResult {
  originalText: string
  sentimentScore: SentimentScore
  passiveAggressiveIndex: number
  suggestedAlternatives: string[]
  detectedPatterns: PassiveAggressivePattern[]
  manipulationLevel: "subtle" | "moderate" | "aggressive"
}

// Image Overlay Types
export interface ImageTemplate {
  id: string
  name: string
  description: string
  imageUrl: string
  textAreas: TextArea[]
}

export interface TextArea {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  width: number // percentage
  height: number // percentage
  maxLength: number
  fontSize: number
  fontFamily: string
  color: string
  alignment: "left" | "center" | "right"
}

export interface ImageOverlayResult {
  templateId: string
  textOverlays: TextOverlay[]
  finalImageUrl: string
}

export interface TextOverlay {
  textAreaId: string
  text: string
  position: { x: number; y: number }
  style: {
    fontSize: number
    fontFamily: string
    color: string
    alignment: "left" | "center" | "right"
  }
}

// Notification System Types
export type NotificationStatus = "pending" | "sent" | "responded" | "expired" | "auto-responded"
export type NotificationPriority = "low" | "medium" | "high" | "urgent"
export type NotificationType = "question" | "approval" | "update" | "reminder" | "emergency"

export interface NotificationTemplate {
  id: string
  name: string
  description: string
  content: string
  type: NotificationType
  priority: NotificationPriority
  variables: string[] // e.g., ["userName", "projectName", "deadline"]
  autoResponseTemplate?: string
}

export interface NotificationSchedule {
  id: string
  name: string
  templateId: string
  isActive: boolean
  cronExpression: string // e.g., "0 7 * * 1-5" for weekdays at 7 AM
  timezone: string
  targetUsers: string[] // User IDs
  variables: Record<string, string> // Template variable values
  createdAt: Date
  lastTriggered?: Date
}

export interface Notification {
  id: string
  scheduleId: string
  templateId: string
  userId: string
  content: string
  status: NotificationStatus
  priority: NotificationPriority
  type: NotificationType
  sentAt: Date
  expiresAt: Date
  respondedAt?: Date
  responseTime?: number // milliseconds
  autoResponseSent?: boolean
  autoResponseContent?: string
}

export interface UserScore {
  userId: string
  userName: string
  totalNotifications: number
  respondedNotifications: number
  averageResponseTime: number
  score: number
  rank: number
  streak: number
  lastActive: Date
}

export interface LeaderboardEntry {
  rank: number
  user: UserScore
  trend: "up" | "down" | "stable"
  change: number
}

export interface NotificationResponse {
  notificationId: string
  userId: string
  response: string
  responseTime: number
  timestamp: Date
}

// Competitive Reporting System Types
export type ReportStatus = "pending" | "approved" | "rejected" | "escalated"
export type ReportSeverity = "low" | "medium" | "high" | "critical"

export interface Report {
  id: string
  reporterId: string // Player A - who submitted the report
  reportedUserId: string // Player B - who is being reported
  title: string
  description: string
  comments: string
  severity: ReportSeverity
  status: ReportStatus
  pointsAwarded: number // Points given to reporter
  pointsDeducted: number // Points deducted from reported user
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  reviewComments?: string
}

export interface ReportFormData {
  reportedUserId: string
  title: string
  description: string
  comments: string
  severity: ReportSeverity
}

export interface CompetitiveScore {
  userId: string
  userName: string
  reportsSubmitted: number
  reportsReceived: number
  pointsGained: number
  pointsLost: number
  netScore: number
  rank: number
  lastReportAt?: Date
  averageReportSeverity: number
  approvalRate: number
}

export interface CompetitiveLeaderboardEntry {
  rank: number
  user: CompetitiveScore
  trend: "up" | "down" | "stable"
  change: number
  badges: string[]
}

export interface ReportStats {
  totalReports: number
  pendingReports: number
  approvedReports: number
  rejectedReports: number
  averagePointsPerReport: number
  topReporter: string
  mostReportedUser: string
}


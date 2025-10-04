/**
 * Report Service - Manages competitive reporting system
 * Handles report submission, scoring, and leaderboard calculations
 */

import type { 
  Report, 
  ReportFormData, 
  CompetitiveScore, 
  CompetitiveLeaderboardEntry, 
  ReportStats,
  ReportSeverity,
  ReportStatus,
  User 
} from "@/lib/types"

class ReportService {
  private reports: Report[] = []
  private scores: Map<string, CompetitiveScore> = new Map()
  private lastUpdate: Date = new Date()
  private initialized: boolean = false

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize(): void {
    if (this.initialized) return
    
    this.loadFromStorage()
    this.initializeSampleData()
    this.initialized = true
  }

  /**
   * Submit a new report
   */
  submitReport(reporterId: string, formData: ReportFormData): Report {
    this.initialize()
    const report: Report = {
      id: this.generateId(),
      reporterId,
      reportedUserId: formData.reportedUserId,
      title: formData.title,
      description: formData.description,
      comments: formData.comments,
      severity: formData.severity,
      status: "pending",
      pointsAwarded: this.calculatePointsAwarded(formData.severity),
      pointsDeducted: this.calculatePointsDeducted(formData.severity),
      createdAt: new Date(),
    }

    this.reports.push(report)
    this.updateScores(report)
    this.saveToStorage()
    
    return report
  }

  /**
   * Review a report (approve/reject)
   */
  reviewReport(reportId: string, status: ReportStatus, reviewedBy: string, reviewComments?: string): Report | null {
    this.initialize()
    const report = this.reports.find(r => r.id === reportId)
    if (!report) return null

    const oldStatus = report.status
    report.status = status
    report.reviewedAt = new Date()
    report.reviewedBy = reviewedBy
    report.reviewComments = reviewComments

    // If status changed from pending, update scores
    if (oldStatus === "pending" && status !== "pending") {
      this.updateScores(report)
    }

    this.saveToStorage()
    return report
  }

  /**
   * Get all reports
   */
  getReports(): Report[] {
    this.initialize()
    return [...this.reports].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  /**
   * Get reports by reporter
   */
  getReportsByReporter(userId: string): Report[] {
    this.initialize()
    return this.reports.filter(r => r.reporterId === userId)
  }

  /**
   * Get reports about a user
   */
  getReportsAboutUser(userId: string): Report[] {
    this.initialize()
    return this.reports.filter(r => r.reportedUserId === userId)
  }

  /**
   * Get pending reports
   */
  getPendingReports(): Report[] {
    this.initialize()
    return this.reports.filter(r => r.status === "pending")
  }

  /**
   * Get competitive leaderboard
   */
  getCompetitiveLeaderboard(limit: number = 20): CompetitiveLeaderboardEntry[] {
    this.initialize()
    const scores = Array.from(this.scores.values())
      .sort((a, b) => b.netScore - a.netScore)
      .slice(0, limit)

    return scores.map((score, index) => ({
      rank: index + 1,
      user: { ...score, rank: index + 1 },
      trend: this.calculateTrend(score.userId),
      change: this.calculateChange(score.userId),
      badges: this.calculateBadges(score)
    }))
  }

  /**
   * Get user's competitive score
   */
  getUserScore(userId: string): CompetitiveScore | null {
    this.initialize()
    return this.scores.get(userId) || null
  }

  /**
   * Get report statistics
   */
  getReportStats(): ReportStats {
    this.initialize()
    const totalReports = this.reports.length
    const pendingReports = this.reports.filter(r => r.status === "pending").length
    const approvedReports = this.reports.filter(r => r.status === "approved").length
    const rejectedReports = this.reports.filter(r => r.status === "rejected").length

    const averagePointsPerReport = totalReports > 0 
      ? this.reports.reduce((sum, r) => sum + r.pointsAwarded, 0) / totalReports 
      : 0

    // Find top reporter
    const reporterCounts = new Map<string, number>()
    this.reports.forEach(r => {
      const count = reporterCounts.get(r.reporterId) || 0
      reporterCounts.set(r.reporterId, count + 1)
    })
    const topReporter = Array.from(reporterCounts.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "None"

    // Find most reported user
    const reportedCounts = new Map<string, number>()
    this.reports.forEach(r => {
      const count = reportedCounts.get(r.reportedUserId) || 0
      reportedCounts.set(r.reportedUserId, count + 1)
    })
    const mostReportedUser = Array.from(reportedCounts.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "None"

    return {
      totalReports,
      pendingReports,
      approvedReports,
      rejectedReports,
      averagePointsPerReport,
      topReporter,
      mostReportedUser
    }
  }

  /**
   * Calculate points awarded based on severity
   */
  private calculatePointsAwarded(severity: ReportSeverity): number {
    const pointsMap = {
      low: 10,
      medium: 25,
      high: 50,
      critical: 100
    }
    return pointsMap[severity]
  }

  /**
   * Calculate points deducted based on severity
   */
  private calculatePointsDeducted(severity: ReportSeverity): number {
    const pointsMap = {
      low: 5,
      medium: 15,
      high: 30,
      critical: 60
    }
    return pointsMap[severity]
  }

  /**
   * Update user scores based on report
   */
  private updateScores(report: Report): void {
    // Update reporter score
    const reporterScore = this.scores.get(report.reporterId) || this.createEmptyScore(report.reporterId)
    reporterScore.reportsSubmitted++
    if (report.status === "approved") {
      reporterScore.pointsGained += report.pointsAwarded
    }
    reporterScore.netScore = reporterScore.pointsGained - reporterScore.pointsLost
    reporterScore.lastReportAt = report.createdAt
    reporterScore.approvalRate = this.calculateApprovalRate(report.reporterId)
    this.scores.set(report.reporterId, reporterScore)

    // Update reported user score
    const reportedScore = this.scores.get(report.reportedUserId) || this.createEmptyScore(report.reportedUserId)
    reportedScore.reportsReceived++
    if (report.status === "approved") {
      reportedScore.pointsLost += report.pointsDeducted
    }
    reportedScore.netScore = reportedScore.pointsGained - reportedScore.pointsLost
    this.scores.set(report.reportedUserId, reportedScore)
  }

  /**
   * Create empty score for new user
   */
  private createEmptyScore(userId: string): CompetitiveScore {
    return {
      userId,
      userName: `User ${userId.slice(0, 8)}`, // Fallback name
      reportsSubmitted: 0,
      reportsReceived: 0,
      pointsGained: 0,
      pointsLost: 0,
      netScore: 0,
      rank: 0,
      averageReportSeverity: 0,
      approvalRate: 0
    }
  }

  /**
   * Calculate approval rate for user
   */
  private calculateApprovalRate(userId: string): number {
    const userReports = this.reports.filter(r => r.reporterId === userId && r.status !== "pending")
    if (userReports.length === 0) return 0
    
    const approved = userReports.filter(r => r.status === "approved").length
    return (approved / userReports.length) * 100
  }

  /**
   * Calculate trend for user
   */
  private calculateTrend(userId: string): "up" | "down" | "stable" {
    // Simplified trend calculation - in real app would compare with historical data
    const score = this.scores.get(userId)
    if (!score) return "stable"
    
    if (score.netScore > 100) return "up"
    if (score.netScore < -50) return "down"
    return "stable"
  }

  /**
   * Calculate change for user
   */
  private calculateChange(userId: string): number {
    // Simplified change calculation
    const score = this.scores.get(userId)
    if (!score) return 0
    
    return Math.floor(Math.random() * 20) - 10 // Random change for demo
  }

  /**
   * Calculate badges for user
   */
  private calculateBadges(score: CompetitiveScore): string[] {
    const badges: string[] = []
    
    if (score.reportsSubmitted >= 10) badges.push("Report Master")
    if (score.pointsGained >= 500) badges.push("Point Collector")
    if (score.approvalRate >= 90) badges.push("Accuracy Expert")
    if (score.netScore >= 200) badges.push("Corporate Champion")
    if (score.reportsReceived <= 2) badges.push("Clean Record")
    
    return badges
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    // Check if we're in the browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }
    
    try {
      const stored = localStorage.getItem('flowcraft-reports')
      if (stored) {
        const data = JSON.parse(stored)
        this.reports = data.reports.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          reviewedAt: r.reviewedAt ? new Date(r.reviewedAt) : undefined
        }))
        this.scores = new Map(data.scores)
      }
    } catch (error) {
      console.error('Failed to load reports from storage:', error)
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    // Check if we're in the browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }
    
    try {
      const data = {
        reports: this.reports,
        scores: Array.from(this.scores.entries())
      }
      localStorage.setItem('flowcraft-reports', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save reports to storage:', error)
    }
  }

  /**
   * Initialize sample data for demo
   */
  private initializeSampleData(): void {
    if (this.reports.length > 0) return // Don't override existing data

    const sampleReports: Omit<Report, 'id' | 'createdAt'>[] = [
      {
        reporterId: 'user_1',
        reportedUserId: 'user_2',
        title: 'Inappropriate Slack Usage',
        description: 'User was caught using Slack for personal conversations during work hours',
        comments: 'This is clearly against company policy and affects team productivity.',
        severity: 'medium',
        status: 'approved',
        pointsAwarded: 25,
        pointsDeducted: 15,
        reviewedAt: new Date(Date.now() - 86400000),
        reviewedBy: 'admin_1',
        reviewComments: 'Valid report, action taken.'
      },
      {
        reporterId: 'user_3',
        reportedUserId: 'user_1',
        title: 'Late to Standup',
        description: 'Consistently 5-10 minutes late to daily standup meetings',
        comments: 'This disrupts the team flow and shows lack of respect for others\' time.',
        severity: 'low',
        status: 'approved',
        pointsAwarded: 10,
        pointsDeducted: 5,
        reviewedAt: new Date(Date.now() - 172800000),
        reviewedBy: 'admin_1'
      },
      {
        reporterId: 'user_2',
        reportedUserId: 'user_4',
        title: 'Code Quality Issues',
        description: 'Submitted code with multiple bugs and no tests',
        comments: 'This creates technical debt and slows down the entire team.',
        severity: 'high',
        status: 'pending',
        pointsAwarded: 50,
        pointsDeducted: 30
      }
    ]

    sampleReports.forEach(reportData => {
      const report: Report = {
        ...reportData,
        id: this.generateId(),
        createdAt: new Date(Date.now() - Math.random() * 604800000) // Random time in last week
      }
      this.reports.push(report)
      this.updateScores(report)
    })

    this.saveToStorage()
  }

  /**
   * Update user names in scores (called when users are loaded)
   */
  updateUserNames(users: User[]): void {
    this.initialize()
    users.forEach(user => {
      const score = this.scores.get(user.id)
      if (score) {
        score.userName = user.name
        this.scores.set(user.id, score)
      }
    })
    this.saveToStorage()
  }
}

export const reportService = new ReportService()

/**
 * Notification Service for Corporate Culture Simulation
 * Handles scheduling, sending, and tracking notifications with gamification
 */

import type { 
  Notification, 
  NotificationTemplate, 
  NotificationSchedule, 
  NotificationResponse,
  NotificationStatus,
  NotificationPriority,
  NotificationType
} from "@/lib/types"

// Pre-defined notification templates for corporate culture simulation
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: "urgent-approval",
    name: "Urgent Approval Required",
    description: "High-priority approval request with tight deadline",
    content: "🚨 URGENT: {userName}, we need your approval on {projectName} by {deadline}. This is blocking the entire team!",
    type: "approval",
    priority: "urgent",
    variables: ["userName", "projectName", "deadline"],
    autoResponseTemplate: "Auto-response: {userName} is currently unavailable. Please proceed with alternative approval process."
  },
  {
    id: "weekend-update",
    name: "Weekend Status Update",
    description: "Weekend work status request",
    content: "📊 {userName}, can you provide a quick status update on {projectName}? The client is asking for progress.",
    type: "update",
    priority: "high",
    variables: ["userName", "projectName"],
    autoResponseTemplate: "Auto-response: {userName} is offline. Last known status: In progress."
  },
  {
    id: "early-morning-check",
    name: "Early Morning Check-in",
    description: "Early morning availability check",
    content: "☀️ Good morning {userName}! Are you available for a quick sync on {projectName}?",
    type: "question",
    priority: "medium",
    variables: ["userName", "projectName"],
    autoResponseTemplate: "Auto-response: {userName} is not yet available. Expected online at 9:00 AM."
  },
  {
    id: "deadline-reminder",
    name: "Deadline Reminder",
    description: "Reminder about upcoming deadline",
    content: "⏰ {userName}, just a friendly reminder that {projectName} is due in {timeRemaining}. How's it coming along?",
    type: "reminder",
    priority: "medium",
    variables: ["userName", "projectName", "timeRemaining"],
    autoResponseTemplate: "Auto-response: {userName} is working on {projectName}. Status: In progress."
  },
  {
    id: "emergency-escalation",
    name: "Emergency Escalation",
    description: "Critical issue requiring immediate attention",
    content: "🚨 EMERGENCY: {userName}, we have a critical issue with {projectName}. Please respond immediately!",
    type: "emergency",
    priority: "urgent",
    variables: ["userName", "projectName"],
    autoResponseTemplate: "Auto-response: {userName} is not available. Escalating to backup contact."
  },
  {
    id: "meeting-confirmation",
    name: "Meeting Confirmation",
    description: "Last-minute meeting confirmation",
    content: "📅 {userName}, can you confirm attendance for the {meetingType} meeting in {timeRemaining}?",
    type: "question",
    priority: "high",
    variables: ["userName", "meetingType", "timeRemaining"],
    autoResponseTemplate: "Auto-response: {userName} is tentatively available. Will confirm closer to meeting time."
  }
]

// Pre-defined schedules for non-standard times
export const DEFAULT_SCHEDULES: Omit<NotificationSchedule, "id" | "createdAt">[] = [
  {
    name: "Weekend Work Check",
    templateId: "weekend-update",
    isActive: true,
    cronExpression: "0 10,16 * * 6,0", // 10 AM and 4 PM on weekends
    timezone: "UTC",
    targetUsers: [],
    variables: {
      projectName: "Q4 Initiative"
    }
  },
  {
    name: "Early Morning Sync",
    templateId: "early-morning-check",
    isActive: true,
    cronExpression: "0 6 * * 1-5", // 6 AM weekdays
    timezone: "UTC",
    targetUsers: [],
    variables: {
      projectName: "Daily Standup"
    }
  },
  {
    name: "Late Night Emergency",
    templateId: "emergency-escalation",
    isActive: true,
    cronExpression: "0 22 * * *", // 10 PM daily
    timezone: "UTC",
    targetUsers: [],
    variables: {
      projectName: "Production System"
    }
  }
]

class NotificationService {
  private notifications: Notification[] = []
  private schedules: NotificationSchedule[] = []
  private activeTimers: Map<string, NodeJS.Timeout> = new Map()
  private responseCallbacks: Map<string, (notification: Notification) => void> = new Map()

  constructor() {
    this.initializeSchedules()
    this.startScheduler()
  }

  private initializeSchedules() {
    // Initialize with default schedules
    this.schedules = DEFAULT_SCHEDULES.map(schedule => ({
      ...schedule,
      id: this.generateId(),
      createdAt: new Date()
    }))
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private startScheduler() {
    // Check for scheduled notifications every minute
    setInterval(() => {
      this.checkScheduledNotifications()
    }, 60000)
  }

  private checkScheduledNotifications() {
    const now = new Date()
    
    this.schedules.forEach(schedule => {
      if (!schedule.isActive) return
      
      if (this.shouldTriggerSchedule(schedule, now)) {
        this.triggerSchedule(schedule)
        schedule.lastTriggered = now
      }
    })
  }

  private shouldTriggerSchedule(schedule: NotificationSchedule, now: Date): boolean {
    if (!schedule.lastTriggered) return true
    
    // Simple cron-like checking (in a real app, use a proper cron library)
    const lastTriggered = new Date(schedule.lastTriggered)
    const timeDiff = now.getTime() - lastTriggered.getTime()
    
    // For demo purposes, trigger every 5 minutes if schedule is active
    return timeDiff > 5 * 60 * 1000
  }

  private triggerSchedule(schedule: NotificationSchedule) {
    const template = NOTIFICATION_TEMPLATES.find(t => t.id === schedule.templateId)
    if (!template) return

    schedule.targetUsers.forEach(userId => {
      const notification = this.createNotification(schedule, template, userId)
      this.notifications.push(notification)
      this.sendNotification(notification)
    })
  }

  private createNotification(
    schedule: NotificationSchedule, 
    template: NotificationTemplate, 
    userId: string
  ): Notification {
    const content = this.processTemplate(template.content, schedule.variables)
    const sentAt = new Date()
    const expiresAt = new Date(sentAt.getTime() + 30 * 1000) // 30 seconds to respond

    return {
      id: this.generateId(),
      scheduleId: schedule.id,
      templateId: template.id,
      userId,
      content,
      status: "sent",
      priority: template.priority,
      type: template.type,
      sentAt,
      expiresAt
    }
  }

  private processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template
    Object.entries(variables).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`{${key}}`, 'g'), value)
    })
    return processed
  }

  private sendNotification(notification: Notification) {
    // In a real app, this would send actual notifications
    console.log(`📱 Sending notification to user ${notification.userId}:`, notification.content)
    
    // Start response timer
    this.startResponseTimer(notification)
    
    // Notify any registered callbacks
    const callback = this.responseCallbacks.get(notification.userId)
    if (callback) {
      callback(notification)
    }
  }

  private startResponseTimer(notification: Notification) {
    const timeUntilExpiry = notification.expiresAt.getTime() - Date.now()
    
    const timer = setTimeout(() => {
      this.handleNotificationExpiry(notification)
    }, timeUntilExpiry)
    
    this.activeTimers.set(notification.id, timer)
  }

  private handleNotificationExpiry(notification: Notification) {
    if (notification.status === "responded") return
    
    notification.status = "expired"
    notification.autoResponseSent = true
    
    const template = NOTIFICATION_TEMPLATES.find(t => t.id === notification.templateId)
    if (template?.autoResponseTemplate) {
      notification.autoResponseContent = this.processTemplate(
        template.autoResponseTemplate, 
        { userName: notification.userId }
      )
    }
    
    console.log(`⏰ Notification expired for user ${notification.userId}`)
    this.activeTimers.delete(notification.id)
  }

  // Public API methods
  public getNotificationsForUser(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
  }

  public getActiveNotificationForUser(userId: string): Notification | null {
    return this.notifications.find(n => 
      n.userId === userId && 
      (n.status === "sent" || n.status === "pending") &&
      n.expiresAt > new Date()
    ) || null
  }

  public respondToNotification(notificationId: string, response: string): NotificationResponse | null {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (!notification || notification.status === "responded") return null
    
    const responseTime = Date.now() - notification.sentAt.getTime()
    notification.status = "responded"
    notification.respondedAt = new Date()
    notification.responseTime = responseTime
    
    // Clear the timer
    const timer = this.activeTimers.get(notificationId)
    if (timer) {
      clearTimeout(timer)
      this.activeTimers.delete(notificationId)
    }
    
    const notificationResponse: NotificationResponse = {
      notificationId,
      userId: notification.userId,
      response,
      responseTime,
      timestamp: new Date()
    }
    
    console.log(`✅ User ${notification.userId} responded in ${responseTime}ms:`, response)
    return notificationResponse
  }

  public createSchedule(schedule: Omit<NotificationSchedule, "id" | "createdAt">): NotificationSchedule {
    const newSchedule: NotificationSchedule = {
      ...schedule,
      id: this.generateId(),
      createdAt: new Date()
    }
    
    this.schedules.push(newSchedule)
    return newSchedule
  }

  public updateSchedule(scheduleId: string, updates: Partial<NotificationSchedule>): boolean {
    const index = this.schedules.findIndex(s => s.id === scheduleId)
    if (index === -1) return false
    
    this.schedules[index] = { ...this.schedules[index], ...updates }
    return true
  }

  public deleteSchedule(scheduleId: string): boolean {
    const index = this.schedules.findIndex(s => s.id === scheduleId)
    if (index === -1) return false
    
    this.schedules.splice(index, 1)
    return true
  }

  public getSchedules(): NotificationSchedule[] {
    return [...this.schedules]
  }

  public getTemplates(): NotificationTemplate[] {
    return [...NOTIFICATION_TEMPLATES]
  }

  public getTemplateById(templateId: string): NotificationTemplate | undefined {
    return NOTIFICATION_TEMPLATES.find(t => t.id === templateId)
  }

  public onNotificationReceived(userId: string, callback: (notification: Notification) => void) {
    this.responseCallbacks.set(userId, callback)
  }

  public removeNotificationCallback(userId: string) {
    this.responseCallbacks.delete(userId)
  }

  public getNotificationStats(userId: string) {
    const userNotifications = this.notifications.filter(n => n.userId === userId)
    const total = userNotifications.length
    const responded = userNotifications.filter(n => n.status === "responded").length
    const expired = userNotifications.filter(n => n.status === "expired").length
    const averageResponseTime = userNotifications
      .filter(n => n.responseTime)
      .reduce((sum, n) => sum + (n.responseTime || 0), 0) / responded || 0
    
    return {
      total,
      responded,
      expired,
      responseRate: total > 0 ? (responded / total) * 100 : 0,
      averageResponseTime
    }
  }

  // Manual notification sending for testing
  public sendTestNotification(userId: string, templateId: string, variables: Record<string, string> = {}) {
    const template = this.getTemplateById(templateId)
    if (!template) return null
    
    const schedule: NotificationSchedule = {
      id: this.generateId(),
      name: "Test Notification",
      templateId,
      isActive: true,
      cronExpression: "",
      timezone: "UTC",
      targetUsers: [userId],
      variables,
      createdAt: new Date()
    }
    
    const notification = this.createNotification(schedule, template, userId)
    this.notifications.push(notification)
    this.sendNotification(notification)
    
    return notification
  }
}

// Export singleton instance
export const notificationService = new NotificationService()

/**
 * Leaderboard Service for Corporate Culture Simulation
 * Handles scoring, ranking, and gamification mechanics
 */

import type { 
  UserScore, 
  LeaderboardEntry, 
  NotificationResponse,
  User
} from "@/lib/types"
import { notificationService } from "./notification-service"

class LeaderboardService {
  private userScores: Map<string, UserScore> = new Map()
  private previousScores: Map<string, UserScore> = new Map()
  private scoreHistory: Map<string, number[]> = new Map()

  constructor() {
    this.initializeScores()
  }

  private initializeScores() {
    // Initialize with some demo scores
    const demoUsers = [
      { id: "user1", name: "John Smith", score: 850 },
      { id: "user2", name: "Jane Doe", score: 720 },
      { id: "user3", name: "Mike Johnson", score: 680 },
      { id: "user4", name: "Sarah Wilson", score: 590 },
      { id: "user5", name: "Alex Chen", score: 450 }
    ]

    demoUsers.forEach(user => {
      this.userScores.set(user.id, {
        userId: user.id,
        userName: user.name,
        totalNotifications: Math.floor(Math.random() * 50) + 20,
        respondedNotifications: Math.floor(Math.random() * 40) + 15,
        averageResponseTime: Math.floor(Math.random() * 15000) + 5000,
        score: user.score,
        rank: 0,
        streak: Math.floor(Math.random() * 10) + 1,
        lastActive: new Date(Date.now() - Math.random() * 86400000)
      })
    })

    this.updateRanks()
  }

  public updateUserScore(userId: string, response: NotificationResponse) {
    const currentScore = this.userScores.get(userId)
    if (!currentScore) {
      // Create new user score
      this.userScores.set(userId, {
        userId,
        userName: `User ${userId}`,
        totalNotifications: 1,
        respondedNotifications: 1,
        averageResponseTime: response.responseTime,
        score: this.calculateScore(response.responseTime, true),
        rank: 0,
        streak: 1,
        lastActive: new Date()
      })
    } else {
      // Update existing score
      const newTotalNotifications = currentScore.totalNotifications + 1
      const newRespondedNotifications = currentScore.respondedNotifications + 1
      const newAverageResponseTime = 
        (currentScore.averageResponseTime * currentScore.respondedNotifications + response.responseTime) / 
        newRespondedNotifications

      const responseScore = this.calculateScore(response.responseTime, true)
      const streakBonus = this.calculateStreakBonus(currentScore.streak + 1)
      const newScore = currentScore.score + responseScore + streakBonus

      this.userScores.set(userId, {
        ...currentScore,
        totalNotifications: newTotalNotifications,
        respondedNotifications: newRespondedNotifications,
        averageResponseTime: newAverageResponseTime,
        score: Math.max(0, newScore), // Ensure score doesn't go below 0
        streak: currentScore.streak + 1,
        lastActive: new Date()
      })
    }

    this.updateRanks()
    this.updateScoreHistory(userId)
  }

  public penalizeUser(userId: string, reason: "no_response" | "late_response" | "auto_response") {
    const currentScore = this.userScores.get(userId)
    if (!currentScore) return

    let penalty = 0
    switch (reason) {
      case "no_response":
        penalty = 50
        break
      case "late_response":
        penalty = 25
        break
      case "auto_response":
        penalty = 30
        break
    }

    const newScore = Math.max(0, currentScore.score - penalty)
    const newStreak = reason === "no_response" ? 0 : Math.max(0, currentScore.streak - 1)

    this.userScores.set(userId, {
      ...currentScore,
      score: newScore,
      streak: newStreak,
      lastActive: new Date()
    })

    this.updateRanks()
    this.updateScoreHistory(userId)
  }

  private calculateScore(responseTime: number, responded: boolean): number {
    if (!responded) return 0

    // Base score for responding
    let score = 100

    // Time-based scoring (faster response = higher score)
    if (responseTime < 5000) { // Under 5 seconds
      score += 50
    } else if (responseTime < 10000) { // Under 10 seconds
      score += 30
    } else if (responseTime < 20000) { // Under 20 seconds
      score += 15
    } else if (responseTime < 30000) { // Under 30 seconds
      score += 5
    } else {
      score -= 10 // Penalty for slow response
    }

    return Math.max(0, score)
  }

  private calculateStreakBonus(streak: number): number {
    if (streak < 3) return 0
    if (streak < 5) return 10
    if (streak < 10) return 25
    if (streak < 20) return 50
    return 100 // Max streak bonus
  }

  private updateRanks() {
    const sortedUsers = Array.from(this.userScores.values())
      .sort((a, b) => b.score - a.score)

    sortedUsers.forEach((user, index) => {
      user.rank = index + 1
      this.userScores.set(user.userId, user)
    })
  }

  private updateScoreHistory(userId: string) {
    const currentScore = this.userScores.get(userId)
    if (!currentScore) return

    const history = this.scoreHistory.get(userId) || []
    history.push(currentScore.score)
    
    // Keep only last 30 scores
    if (history.length > 30) {
      history.shift()
    }
    
    this.scoreHistory.set(userId, history)
  }

  public getLeaderboard(limit: number = 10): LeaderboardEntry[] {
    const sortedUsers = Array.from(this.userScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return sortedUsers.map(user => {
      const previousScore = this.previousScores.get(user.userId)
      const change = previousScore ? user.score - previousScore.score : 0
      
      let trend: "up" | "down" | "stable" = "stable"
      if (change > 0) trend = "up"
      else if (change < 0) trend = "down"

      return {
        rank: user.rank,
        user,
        trend,
        change
      }
    })
  }

  public getUserScore(userId: string): UserScore | undefined {
    return this.userScores.get(userId)
  }

  public getUserRank(userId: string): number {
    const userScore = this.userScores.get(userId)
    return userScore?.rank || 0
  }

  public getScoreHistory(userId: string): number[] {
    return this.scoreHistory.get(userId) || []
  }

  public getTopPerformers(limit: number = 5): UserScore[] {
    return Array.from(this.userScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  public getWorstPerformers(limit: number = 5): UserScore[] {
    return Array.from(this.userScores.values())
      .sort((a, b) => a.score - b.score)
      .slice(0, limit)
  }

  public getStreakLeaders(limit: number = 5): UserScore[] {
    return Array.from(this.userScores.values())
      .sort((a, b) => b.streak - a.streak)
      .slice(0, limit)
  }

  public getResponseTimeLeaders(limit: number = 5): UserScore[] {
    return Array.from(this.userScores.values())
      .sort((a, b) => a.averageResponseTime - b.averageResponseTime)
      .slice(0, limit)
  }

  public getGlobalStats() {
    const allUsers = Array.from(this.userScores.values())
    const totalUsers = allUsers.length
    const totalNotifications = allUsers.reduce((sum, user) => sum + user.totalNotifications, 0)
    const totalResponses = allUsers.reduce((sum, user) => sum + user.respondedNotifications, 0)
    const averageScore = allUsers.reduce((sum, user) => sum + user.score, 0) / totalUsers
    const averageResponseTime = allUsers.reduce((sum, user) => sum + user.averageResponseTime, 0) / totalUsers
    const averageStreak = allUsers.reduce((sum, user) => sum + user.streak, 0) / totalUsers

    return {
      totalUsers,
      totalNotifications,
      totalResponses,
      responseRate: totalNotifications > 0 ? (totalResponses / totalNotifications) * 100 : 0,
      averageScore: Math.round(averageScore),
      averageResponseTime: Math.round(averageResponseTime),
      averageStreak: Math.round(averageStreak * 10) / 10
    }
  }

  public saveSnapshot() {
    // Save current scores as previous scores for trend calculation
    this.previousScores = new Map(this.userScores)
  }

  public resetUserScore(userId: string) {
    this.userScores.delete(userId)
    this.scoreHistory.delete(userId)
    this.previousScores.delete(userId)
    this.updateRanks()
  }

  public resetAllScores() {
    this.userScores.clear()
    this.scoreHistory.clear()
    this.previousScores.clear()
    this.initializeScores()
  }

  // Integration with notification service
  public handleNotificationResponse(response: NotificationResponse) {
    this.updateUserScore(response.userId, response)
  }

  public handleNotificationExpiry(userId: string) {
    this.penalizeUser(userId, "no_response")
  }

  public handleAutoResponse(userId: string) {
    this.penalizeUser(userId, "auto_response")
  }
}

// Export singleton instance
export const leaderboardService = new LeaderboardService()

// Set up integration with notification service
notificationService.onNotificationReceived = (userId: string, callback: (notification: any) => void) => {
  // This will be handled by the notification service
}

// Mock some initial data
setTimeout(() => {
  // Simulate some initial activity
  const demoResponses: NotificationResponse[] = [
    {
      notificationId: "demo1",
      userId: "user1",
      response: "Got it, working on it now!",
      responseTime: 3000,
      timestamp: new Date()
    },
    {
      notificationId: "demo2", 
      userId: "user2",
      response: "Will have it done by EOD",
      responseTime: 8000,
      timestamp: new Date()
    },
    {
      notificationId: "demo3",
      userId: "user3", 
      response: "On it!",
      responseTime: 12000,
      timestamp: new Date()
    }
  ]

  demoResponses.forEach(response => {
    leaderboardService.handleNotificationResponse(response)
  })
}, 1000)

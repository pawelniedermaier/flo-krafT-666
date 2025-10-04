"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Send,
  Timer,
  Trophy,
  Zap,
  MessageSquare
} from "lucide-react"
import { notificationService } from "@/lib/services/notification-service"
import { leaderboardService } from "@/lib/services/leaderboard-service"
import type { Notification, NotificationResponse } from "@/lib/types"

interface NotificationCenterProps {
  currentUserId: string
  currentUserName: string
}

/**
 * Notification Center Component
 * Handles incoming notifications with timer and response tracking
 */
export function NotificationCenter({ currentUserId, currentUserName }: NotificationCenterProps) {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null)
  const [response, setResponse] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isResponding, setIsResponding] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([])
  const [userScore, setUserScore] = useState(leaderboardService.getUserScore(currentUserId))
  const [showTestPanel, setShowTestPanel] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load notification history
    const history = notificationService.getNotificationsForUser(currentUserId)
    setNotificationHistory(history)

    // Check for active notification
    const active = notificationService.getActiveNotificationForUser(currentUserId)
    if (active) {
      setActiveNotification(active)
      startTimer(active)
    }

    // Set up notification callback
    notificationService.onNotificationReceived(currentUserId, handleNewNotification)

    // Update user score
    setUserScore(leaderboardService.getUserScore(currentUserId))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
      notificationService.removeNotificationCallback(currentUserId)
    }
  }, [currentUserId])

  const handleNewNotification = (notification: Notification) => {
    setActiveNotification(notification)
    setResponse("")
    startTimer(notification)
  }

  const startTimer = (notification: Notification) => {
    const now = Date.now()
    const expiryTime = notification.expiresAt.getTime()
    const remaining = Math.max(0, expiryTime - now)
    
    setTimeRemaining(remaining)

    // Update timer every 100ms for smooth countdown
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now()
      const newRemaining = Math.max(0, expiryTime - currentTime)
      setTimeRemaining(newRemaining)

      if (newRemaining <= 0) {
        handleNotificationExpiry(notification)
      }
    }, 100)

    // Set timeout for expiry
    timerRef.current = setTimeout(() => {
      handleNotificationExpiry(notification)
    }, remaining)
  }

  const handleNotificationExpiry = (notification: Notification) => {
    setActiveNotification(null)
    setTimeRemaining(0)
    
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Update leaderboard
    leaderboardService.handleNotificationExpiry(currentUserId)
    setUserScore(leaderboardService.getUserScore(currentUserId))

    // Update history
    const updatedHistory = notificationService.getNotificationsForUser(currentUserId)
    setNotificationHistory(updatedHistory)
  }

  const handleResponse = async () => {
    if (!activeNotification || !response.trim() || isResponding) return

    setIsResponding(true)
    
    try {
      const responseTime = Date.now() - activeNotification.sentAt.getTime()
      const notificationResponse: NotificationResponse = {
        notificationId: activeNotification.id,
        userId: currentUserId,
        response: response.trim(),
        responseTime,
        timestamp: new Date()
      }

      const result = notificationService.respondToNotification(activeNotification.id, response.trim())
      
      if (result) {
        // Update leaderboard
        leaderboardService.handleNotificationResponse(result)
        setUserScore(leaderboardService.getUserScore(currentUserId))

        // Clear active notification
        setActiveNotification(null)
        setResponse("")
        setTimeRemaining(0)

        // Clear timers
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        // Update history
        const updatedHistory = notificationService.getNotificationsForUser(currentUserId)
        setNotificationHistory(updatedHistory)
      }
    } catch (error) {
      console.error("Failed to send response:", error)
    } finally {
      setIsResponding(false)
    }
  }

  const sendTestNotification = (templateId: string) => {
    const variables = {
      userName: currentUserName,
      projectName: "Test Project",
      deadline: "End of Day",
      timeRemaining: "2 hours"
    }
    
    notificationService.sendTestNotification(currentUserId, templateId, variables)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertTriangle className="h-4 w-4" />
      case "high": return <Zap className="h-4 w-4" />
      case "medium": return <Bell className="h-4 w-4" />
      case "low": return <MessageSquare className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    return `${seconds}s`
  }

  const getProgressColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100
    if (percentage > 50) return "bg-green-500"
    if (percentage > 25) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Bell className="h-8 w-8 text-blue-600" />
          Notification Center
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay on top of corporate communications! Respond quickly to maintain your score.
        </p>
      </div>

      {/* User Score Card */}
      {userScore && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userScore.score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">#{userScore.rank}</div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userScore.streak}</div>
                <div className="text-sm text-muted-foreground">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(userScore.averageResponseTime / 1000)}s
                </div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Notification */}
      {activeNotification && (
        <Card className="border-2 border-orange-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPriorityIcon(activeNotification.priority)}
                <CardTitle className="text-lg">Incoming Notification</CardTitle>
                <Badge className={getPriorityColor(activeNotification.priority)}>
                  {activeNotification.priority.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Message:</p>
              <p className="text-sm">{activeNotification.content}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Time Remaining</span>
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <Progress 
                value={(timeRemaining / 30000) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Response:</label>
              <Textarea
                placeholder="Type your response here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[80px]"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {response.length}/500 characters
              </div>
            </div>

            <Button 
              onClick={handleResponse}
              disabled={!response.trim() || isResponding || timeRemaining <= 0}
              className="w-full"
            >
              {isResponding ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </>
              )}
            </Button>

            {timeRemaining <= 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Time's up! Your score has been penalized for not responding.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Test Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Notifications</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTestPanel(!showTestPanel)}
            >
              {showTestPanel ? "Hide" : "Show"} Test Panel
            </Button>
          </CardTitle>
        </CardHeader>
        {showTestPanel && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {notificationService.getTemplates().map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  onClick={() => sendTestNotification(template.id)}
                  className="h-auto p-3 text-left"
                >
                  <div>
                    <div className="font-medium text-xs">{template.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {template.priority} priority
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Your notification history and response performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notificationHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications yet. Use the test panel to send yourself a notification!
            </div>
          ) : (
            <div className="space-y-3">
              {notificationHistory.slice(0, 10).map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getPriorityIcon(notification.priority)}
                      <Badge className={getPriorityColor(notification.priority)} size="sm">
                        {notification.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.sentAt.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{notification.content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {notification.status === "responded" ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">
                          {notification.responseTime && Math.round(notification.responseTime / 1000)}s
                        </span>
                      </div>
                    ) : notification.status === "expired" ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span className="text-xs">Expired</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

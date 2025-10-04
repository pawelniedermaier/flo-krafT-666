"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  Target,
  Zap,
  Users,
  BarChart3,
  Crown,
  Star
} from "lucide-react"
import { leaderboardService } from "@/lib/services/leaderboard-service"
import type { LeaderboardEntry, UserScore } from "@/lib/types"

/**
 * Leaderboard View Component
 * Displays user rankings and performance metrics
 */
export function LeaderboardView() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [topPerformers, setTopPerformers] = useState<UserScore[]>([])
  const [streakLeaders, setStreakLeaders] = useState<UserScore[]>([])
  const [responseTimeLeaders, setResponseTimeLeaders] = useState<UserScore[]>([])
  const [globalStats, setGlobalStats] = useState(leaderboardService.getGlobalStats())
  const [activeTab, setActiveTab] = useState("overall")

  useEffect(() => {
    loadLeaderboardData()
    
    // Refresh data every 5 seconds
    const interval = setInterval(loadLeaderboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadLeaderboardData = () => {
    setLeaderboard(leaderboardService.getLeaderboard(20))
    setTopPerformers(leaderboardService.getTopPerformers(10))
    setStreakLeaders(leaderboardService.getStreakLeaders(10))
    setResponseTimeLeaders(leaderboardService.getResponseTimeLeaders(10))
    setGlobalStats(leaderboardService.getGlobalStats())
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Award className="h-5 w-5 text-amber-600" />
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />
      case "stable": return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 800) return "text-green-600"
    if (score >= 600) return "text-blue-600"
    if (score >= 400) return "text-yellow-600"
    if (score >= 200) return "text-orange-600"
    return "text-red-600"
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return "text-purple-600"
    if (streak >= 5) return "text-blue-600"
    if (streak >= 3) return "text-green-600"
    return "text-gray-600"
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${Math.round(ms / 1000)}s`
  }

  const formatResponseRate = (total: number, responded: number) => {
    if (total === 0) return "0%"
    return `${Math.round((responded / total) * 100)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-600" />
          Corporate Leaderboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Compete with your colleagues in the ultimate corporate responsiveness challenge!
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{globalStats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{globalStats.responseRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Response Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{formatResponseTime(globalStats.averageResponseTime)}</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{globalStats.averageStreak}</div>
                <div className="text-sm text-muted-foreground">Avg Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="speed">Speed</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Overall Leaderboard */}
        <TabsContent value="overall" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Overall Performance
              </CardTitle>
              <CardDescription>
                Rankings based on total score, response rate, and consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No data available yet. Start responding to notifications to appear on the leaderboard!
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.user.rank)}
                        </div>
                        <div>
                          <div className="font-medium">{entry.user.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.user.respondedNotifications}/{entry.user.totalNotifications} responses
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(entry.user.score)}`}>
                            {entry.user.score}
                          </div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {formatResponseRate(entry.user.totalNotifications, entry.user.respondedNotifications)}
                          </div>
                          <div className="text-xs text-muted-foreground">Rate</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {formatResponseTime(entry.user.averageResponseTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Time</div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {getTrendIcon(entry.trend)}
                          <span className={`text-sm font-medium ${
                            entry.trend === "up" ? "text-green-600" : 
                            entry.trend === "down" ? "text-red-600" : "text-gray-600"
                          }`}>
                            {entry.change > 0 ? "+" : ""}{entry.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Streak Leaders */}
        <TabsContent value="streaks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Streak Leaders
              </CardTitle>
              <CardDescription>
                Users with the longest response streaks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {streakLeaders.map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {index < 3 ? getRankIcon(index + 1) : <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>}
                      </div>
                      <div>
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.respondedNotifications} consecutive responses
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getStreakColor(user.streak)}`}>
                          {user.streak}
                        </div>
                        <div className="text-xs text-muted-foreground">Streak</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {user.score}
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Speed Leaders */}
        <TabsContent value="speed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Speed Champions
              </CardTitle>
              <CardDescription>
                Fastest average response times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {responseTimeLeaders.map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {index < 3 ? getRankIcon(index + 1) : <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>}
                      </div>
                      <div>
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.respondedNotifications} responses
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatResponseTime(user.averageResponseTime)}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Time</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {user.score}
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Elite (800+)", count: leaderboard.filter(u => u.user.score >= 800).length, color: "bg-green-500" },
                    { label: "Excellent (600-799)", count: leaderboard.filter(u => u.user.score >= 600 && u.user.score < 800).length, color: "bg-blue-500" },
                    { label: "Good (400-599)", count: leaderboard.filter(u => u.user.score >= 400 && u.user.score < 600).length, color: "bg-yellow-500" },
                    { label: "Fair (200-399)", count: leaderboard.filter(u => u.user.score >= 200 && u.user.score < 400).length, color: "bg-orange-500" },
                    { label: "Needs Improvement (<200)", count: leaderboard.filter(u => u.user.score < 200).length, color: "bg-red-500" }
                  ].map((tier, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{tier.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${tier.color}`}
                            style={{ width: `${(tier.count / leaderboard.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{tier.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Lightning Fast", description: "Average response time under 5 seconds", icon: "⚡" },
                    { name: "Streak Master", description: "10+ consecutive responses", icon: "🔥" },
                    { name: "Perfect Score", description: "100% response rate", icon: "💯" },
                    { name: "Corporate Champion", description: "Top 3 overall ranking", icon: "👑" },
                    { name: "Weekend Warrior", description: "Responded to weekend notifications", icon: "🏆" }
                  ].map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 border rounded">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

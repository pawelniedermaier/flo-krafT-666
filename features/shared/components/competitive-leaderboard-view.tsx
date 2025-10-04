"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Zap,
  Users,
  BarChart3,
  Crown,
  Star,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react"
import { reportService } from "@/lib/services/report-service"
import type { CompetitiveLeaderboardEntry, Report, ReportStats } from "@/lib/types"

/**
 * Competitive Leaderboard View Component
 * Displays rankings based on reports submitted and points gained/lost
 */
export function CompetitiveLeaderboardView() {
  const [leaderboard, setLeaderboard] = useState<CompetitiveLeaderboardEntry[]>([])
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [pendingReports, setPendingReports] = useState<Report[]>([])
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [activeTab, setActiveTab] = useState("leaderboard")

  useEffect(() => {
    loadData()
    
    // Refresh data every 10 seconds
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    setLeaderboard(reportService.getCompetitiveLeaderboard(20))
    setRecentReports(reportService.getReports().slice(0, 10))
    setPendingReports(reportService.getPendingReports())
    setStats(reportService.getReportStats())
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />
      case 2: return <Medal className="h-6 w-6 text-gray-400" />
      case 3: return <Award className="h-6 w-6 text-amber-600" />
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
    if (score >= 200) return "text-green-600"
    if (score >= 100) return "text-blue-600"
    if (score >= 0) return "text-yellow-600"
    if (score >= -50) return "text-orange-600"
    return "text-red-600"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />
      case "escalated": return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default: return <Eye className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-orange-600" />
          Competitive Reporting Leaderboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Compete with your colleagues in the ultimate corporate reporting challenge! 
          Submit reports to gain points and climb the rankings.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalReports}</div>
                  <div className="text-sm text-muted-foreground">Total Reports</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.pendingReports}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.approvedReports}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.averagePointsPerReport.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Avg Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Competitive Rankings
              </CardTitle>
              <CardDescription>
                Rankings based on net score (points gained - points lost)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No competitive data available yet. Start submitting reports to appear on the leaderboard!
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div key={entry.user.userId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.user.rank)}
                        </div>
                        <div>
                          <div className="font-medium">{entry.user.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.user.reportsSubmitted} reports submitted • {entry.user.reportsReceived} reports received
                          </div>
                          {entry.badges.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {entry.badges.map((badge, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(entry.user.netScore)}`}>
                            {entry.user.netScore > 0 ? "+" : ""}{entry.user.netScore}
                          </div>
                          <div className="text-xs text-muted-foreground">Net Score</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            +{entry.user.pointsGained}
                          </div>
                          <div className="text-xs text-muted-foreground">Gained</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">
                            -{entry.user.pointsLost}
                          </div>
                          <div className="text-xs text-muted-foreground">Lost</div>
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

        {/* Recent Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Reports
              </CardTitle>
              <CardDescription>
                Latest reports submitted by team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <h4 className="font-medium">{report.title}</h4>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(report.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span>Reporter: <strong>{report.reporterId}</strong></span>
                        <span>Reported: <strong>{report.reportedUserId}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">+{report.pointsAwarded}</span>
                        <span className="text-red-600">-{report.pointsDeducted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Reports Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Review
              </CardTitle>
              <CardDescription>
                Reports awaiting management review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending reports at this time.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingReports.map((report) => (
                    <div key={report.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <h4 className="font-medium">{report.title}</h4>
                          <Badge className={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {report.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span>Reporter: <strong>{report.reporterId}</strong></span>
                          <span>Reported: <strong>{report.reportedUserId}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">+{report.pointsAwarded}</span>
                          <span className="text-red-600">-{report.pointsDeducted}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Champions (200+)", count: leaderboard.filter(u => u.user.netScore >= 200).length, color: "bg-green-500" },
                    { label: "Leaders (100-199)", count: leaderboard.filter(u => u.user.netScore >= 100 && u.user.netScore < 200).length, color: "bg-blue-500" },
                    { label: "Competitors (0-99)", count: leaderboard.filter(u => u.user.netScore >= 0 && u.user.netScore < 100).length, color: "bg-yellow-500" },
                    { label: "Struggling (-50 to -1)", count: leaderboard.filter(u => u.user.netScore >= -50 && u.user.netScore < 0).length, color: "bg-orange-500" },
                    { label: "At Risk (<-50)", count: leaderboard.filter(u => u.user.netScore < -50).length, color: "bg-red-500" }
                  ].map((tier, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{tier.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${tier.color}`}
                            style={{ width: `${leaderboard.length > 0 ? (tier.count / leaderboard.length) * 100 : 0}%` }}
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
                    { name: "Report Master", description: "10+ reports submitted", icon: "📝" },
                    { name: "Point Collector", description: "500+ points gained", icon: "💰" },
                    { name: "Accuracy Expert", description: "90%+ approval rate", icon: "🎯" },
                    { name: "Corporate Champion", description: "200+ net score", icon: "👑" },
                    { name: "Clean Record", description: "2 or fewer reports received", icon: "✨" }
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

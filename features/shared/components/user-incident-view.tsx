"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Sparkles,
  Users,
  Target,
  Zap,
  Clock,
  FileText,
  MessageSquare,
  Heart,
  CheckCircle
} from "lucide-react"

interface IncidentReport {
  id: string
  title: string
  reporter: string
  category: string
  department: string
  priority: "low" | "medium" | "high"
  description: string
  status: "reported" | "in-progress" | "resolved" | "closed"
  date: string
  resolution?: string
}

const INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: "1",
    title: "Team Communication Issue",
    reporter: "Sarah Chen",
    category: "Communication",
    department: "Engineering",
    priority: "medium",
    description: "Need better communication channels between design and development teams",
    status: "in-progress",
    date: "2024-01-15"
  },
  {
    id: "2", 
    title: "Workload Distribution",
    reporter: "Mike Rodriguez",
    category: "Workload",
    department: "Project Management",
    priority: "high",
    description: "Some team members are overloaded while others have lighter workloads",
    status: "reported",
    date: "2024-01-14"
  },
  {
    id: "3",
    title: "Meeting Efficiency",
    reporter: "Emily Watson",
    category: "Process",
    department: "Design",
    priority: "low",
    description: "Meetings could be more focused and productive",
    status: "resolved",
    date: "2024-01-13",
    resolution: "Implemented meeting agenda templates and time limits"
  },
  {
    id: "4",
    title: "Resource Sharing",
    reporter: "David Kim",
    category: "Resources",
    department: "QA",
    priority: "medium",
    description: "Need better sharing of testing tools and documentation",
    status: "in-progress",
    date: "2024-01-12"
  },
  {
    id: "5",
    title: "Feedback Process",
    reporter: "Lisa Thompson",
    category: "Process",
    department: "Marketing",
    priority: "low",
    description: "Would like more structured feedback sessions",
    status: "closed",
    date: "2024-01-11",
    resolution: "Set up monthly feedback sessions with team leads"
  }
]

const PRIORITY_COLORS = {
  low: "bg-green-600",
  medium: "bg-yellow-600",
  high: "bg-red-600"
}

const STATUS_COLORS = {
  reported: "bg-blue-600",
  "in-progress": "bg-yellow-600",
  resolved: "bg-green-600",
  closed: "bg-gray-600"
}

const CATEGORY_ICONS = {
  Communication: <MessageSquare className="size-4" />,
  Workload: <Users className="size-4" />,
  Process: <FileText className="size-4" />,
  Resources: <Shield className="size-4" />
}

export default function UserIncidentView() {
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  const filteredReports = INCIDENT_REPORTS.filter(report => {
    const statusMatch = filterStatus === "all" || report.status === filterStatus
    const priorityMatch = filterPriority === "all" || report.priority === filterPriority
    return statusMatch && priorityMatch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400"
      case "medium": return "text-yellow-400"
      case "low": return "text-green-400"
      default: return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported": return <AlertTriangle className="size-4" />
      case "in-progress": return <Clock className="size-4" />
      case "resolved": return <CheckCircle className="size-4" />
      case "closed": return <Shield className="size-4" />
      default: return <FileText className="size-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-green-900 to-purple-900 text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="size-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold">🔪 TEAM IMPROVEMENT REPORTS</h1>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="size-5 text-white" />
          </div>
        </div>
        <p className="text-xl text-blue-200 mb-2">
          Report issues and suggest improvements for better teamwork
        </p>
        <p className="text-blue-300 flex items-center justify-center gap-2">
          <Sparkles className="size-4" />
          Help make our workplace better for everyone
          <Sparkles className="size-4" />
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-900/50 border-blue-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{INCIDENT_REPORTS.length}</div>
            <div className="text-sm text-blue-200">Total Reports</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/50 border-yellow-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {INCIDENT_REPORTS.filter(r => r.status === "in-progress").length}
            </div>
            <div className="text-sm text-yellow-200">In Progress</div>
          </CardContent>
        </Card>
        <Card className="bg-green-900/50 border-green-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {INCIDENT_REPORTS.filter(r => r.status === "resolved").length}
            </div>
            <div className="text-sm text-green-200">Resolved</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-900/50 border-purple-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {INCIDENT_REPORTS.filter(r => r.priority === "high").length}
            </div>
            <div className="text-sm text-purple-200">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card className="bg-white/10 border-white/20 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="size-5" />
            Filter Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              All Status
            </Button>
            <Button
              variant={filterStatus === "reported" ? "default" : "outline"}
              onClick={() => setFilterStatus("reported")}
              className="bg-blue-600 hover:bg-blue-700 text-white border-transparent"
            >
              Reported
            </Button>
            <Button
              variant={filterStatus === "in-progress" ? "default" : "outline"}
              onClick={() => setFilterStatus("in-progress")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-transparent"
            >
              In Progress
            </Button>
            <Button
              variant={filterStatus === "resolved" ? "default" : "outline"}
              onClick={() => setFilterStatus("resolved")}
              className="bg-green-600 hover:bg-green-700 text-white border-transparent"
            >
              Resolved
            </Button>
            <Button
              variant={filterStatus === "closed" ? "default" : "outline"}
              onClick={() => setFilterStatus("closed")}
              className="bg-gray-600 hover:bg-gray-700 text-white border-transparent"
            >
              Closed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Report Chamber */}
      <Card className="bg-gray-800/80 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="size-5" />
            Team Improvement Reports
            <Eye className="size-5" />
          </CardTitle>
          <CardDescription className="text-gray-300">
            View and track team improvement suggestions and issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card 
                key={report.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedReport?.id === report.id 
                    ? "bg-blue-900/50 border-blue-500" 
                    : "bg-gray-700/50 border-gray-600"
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {CATEGORY_ICONS[report.category as keyof typeof CATEGORY_ICONS]}
                        <span className="text-lg">💡</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{report.title}</span>
                          <Badge className={PRIORITY_COLORS[report.priority]}>
                            {report.priority.toUpperCase()}
                          </Badge>
                          <Badge className={STATUS_COLORS[report.status]}>
                            {getStatusIcon(report.status)}
                            {report.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>Reporter: {report.reporter}</span>
                          <span>Category: {report.category}</span>
                          <span>Dept: {report.department}</span>
                          <span>Date: {report.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getPriorityColor(report.priority)}`}>
                        {report.priority.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">Priority</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Report View */}
      {selectedReport && (
        <Card className="bg-blue-900/50 border-blue-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="size-5" />
              Report Details: {selectedReport.title}
              <Zap className="size-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Report Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Reporter:</span>
                    <span className="text-white font-bold">{selectedReport.reporter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Category:</span>
                    <span className="text-blue-400 font-bold">{selectedReport.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Department:</span>
                    <span className="text-green-400 font-bold">{selectedReport.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Date:</span>
                    <span className="text-gray-400 font-bold">{selectedReport.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Priority:</span>
                    <span className={`font-bold ${getPriorityColor(selectedReport.priority)}`}>
                      {selectedReport.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Status & Resolution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className={`font-bold ${
                      selectedReport.status === "resolved" ? "text-green-400" :
                      selectedReport.status === "in-progress" ? "text-yellow-400" :
                      selectedReport.status === "closed" ? "text-gray-400" :
                      "text-blue-400"
                    }`}>
                      {selectedReport.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  {selectedReport.resolution && (
                    <div>
                      <span className="text-gray-300 text-sm">Resolution:</span>
                      <p className="text-green-300 text-sm mt-1 bg-green-800/30 p-2 rounded">
                        {selectedReport.resolution}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">Description</h4>
              <p className="text-gray-300 bg-gray-800/50 p-3 rounded">
                {selectedReport.description}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Heart className="size-4 mr-2" />
                Support This Issue
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <MessageSquare className="size-4 mr-2" />
                Add Comment
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <FileText className="size-4 mr-2" />
                Suggest Solution
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-blue-300 mb-2">
          Classics of Team Improvement - Positive Change
        </h3>
        <p className="text-gray-400">
          "Every great team is built on continuous improvement and open communication"
        </p>
      </div>
    </div>
  )
}

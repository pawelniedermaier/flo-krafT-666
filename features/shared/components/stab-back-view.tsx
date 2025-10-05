"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  Zap, 
  Eye, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Shield,
  Sword,
  Clock,
  FileText,
  MessageSquare
} from "lucide-react"

interface StabReport {
  id: string
  title: string
  reporter: string
  target: string
  department: string
  severity: "critical" | "high" | "medium" | "low"
  type: "backstab" | "credit-theft" | "sabotage" | "gossip" | "exclusion"
  description: string
  evidence: string[]
  witnesses: string[]
  date: string
  status: "reported" | "investigating" | "confirmed" | "dismissed"
  impact: number
}

const STAB_REPORTS: StabReport[] = [
  {
    id: "1",
    title: "Code Theft in Progress",
    reporter: "Sarah Chen",
    target: "Mike Rodriguez",
    department: "Engineering",
    severity: "critical",
    type: "credit-theft",
    description: "Mike took credit for my entire authentication system during the demo",
    evidence: ["Git commit history", "Slack messages", "Meeting recording"],
    witnesses: ["Emily Watson", "David Kim"],
    date: "2024-01-15",
    status: "investigating",
    impact: 95
  },
  {
    id: "2", 
    title: "Project Sabotage Attempt",
    reporter: "David Kim",
    target: "Lisa Thompson",
    department: "Marketing",
    severity: "high",
    type: "sabotage",
    description: "Lisa deliberately provided wrong requirements to delay our project",
    evidence: ["Email chain", "Requirements document"],
    witnesses: ["Sarah Chen"],
    date: "2024-01-14",
    status: "confirmed",
    impact: 78
  },
  {
    id: "3",
    title: "Meeting Exclusion Incident",
    reporter: "Emily Watson",
    target: "Mike Rodriguez",
    department: "Engineering",
    severity: "medium",
    type: "exclusion",
    description: "Mike organized a critical meeting without inviting the design team",
    evidence: ["Calendar invite", "Meeting notes"],
    witnesses: ["Sarah Chen", "David Kim"],
    date: "2024-01-13",
    status: "reported",
    impact: 45
  },
  {
    id: "4",
    title: "Gossip Campaign",
    reporter: "Lisa Thompson",
    target: "Sarah Chen",
    department: "Engineering",
    severity: "low",
    type: "gossip",
    description: "Sarah has been spreading rumors about my work performance",
    evidence: ["Slack screenshots"],
    witnesses: ["Emily Watson"],
    date: "2024-01-12",
    status: "dismissed",
    impact: 23
  },
  {
    id: "5",
    title: "Direct Backstab",
    reporter: "Mike Rodriguez",
    target: "David Kim",
    department: "Engineering",
    severity: "high",
    type: "backstab",
    description: "David reported my mistake to the boss without talking to me first",
    evidence: ["Email to manager", "Performance review"],
    witnesses: ["Sarah Chen"],
    date: "2024-01-11",
    status: "investigating",
    impact: 67
  }
]

const SEVERITY_COLORS = {
  critical: "bg-red-600",
  high: "bg-orange-600",
  medium: "bg-yellow-600",
  low: "bg-green-600"
}

const STATUS_COLORS = {
  reported: "bg-blue-600",
  investigating: "bg-yellow-600",
  confirmed: "bg-red-600",
  dismissed: "bg-gray-600"
}

const TYPE_ICONS = {
  backstab: <Sword className="size-4" />,
  "credit-theft": <FileText className="size-4" />,
  sabotage: <Target className="size-4" />,
  gossip: <MessageSquare className="size-4" />,
  exclusion: <Users className="size-4" />
}

function StabBackView() {
  const [selectedReport, setSelectedReport] = useState<StabReport | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  const filteredReports = STAB_REPORTS.filter(report => {
    const statusMatch = filterStatus === "all" || report.status === filterStatus
    const severityMatch = filterSeverity === "all" || report.severity === filterSeverity
    return statusMatch && severityMatch
  })

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return "text-red-400"
    if (impact >= 60) return "text-orange-400"
    if (impact >= 40) return "text-yellow-400"
    return "text-green-400"
  }

  const getImpactLabel = (impact: number) => {
    if (impact >= 80) return "DEVASTATING"
    if (impact >= 60) return "SEVERE"
    if (impact >= 40) return "MODERATE"
    return "MINOR"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="size-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold">🔪 STAB IN THE BACK</h1>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Sword className="size-5 text-white" />
          </div>
        </div>
        <p className="text-xl text-red-200 mb-2">
          Document and track corporate backstabbing incidents
        </p>
        <p className="text-red-300 flex items-center justify-center gap-2">
          <Sparkles className="size-4" />
          Report treachery, track patterns, seek justice
          <Sparkles className="size-4" />
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-red-900/50 border-red-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{STAB_REPORTS.length}</div>
            <div className="text-sm text-red-200">Total Reports</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-900/50 border-orange-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {STAB_REPORTS.filter(r => r.status === "investigating").length}
            </div>
            <div className="text-sm text-orange-200">Under Investigation</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/50 border-yellow-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {STAB_REPORTS.filter(r => r.severity === "critical").length}
            </div>
            <div className="text-sm text-yellow-200">Critical Cases</div>
          </CardContent>
        </Card>
        <Card className="bg-green-900/50 border-green-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {STAB_REPORTS.filter(r => r.status === "confirmed").length}
            </div>
            <div className="text-sm text-green-200">Confirmed</div>
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
              variant={filterStatus === "investigating" ? "default" : "outline"}
              onClick={() => setFilterStatus("investigating")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-transparent"
            >
              Investigating
            </Button>
            <Button
              variant={filterStatus === "confirmed" ? "default" : "outline"}
              onClick={() => setFilterStatus("confirmed")}
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
            >
              Confirmed
            </Button>
            <Button
              variant={filterStatus === "dismissed" ? "default" : "outline"}
              onClick={() => setFilterStatus("dismissed")}
              className="bg-gray-600 hover:bg-gray-700 text-white border-transparent"
            >
              Dismissed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Report Chamber */}
      <Card className="bg-gray-800/80 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="size-5" />
            Backstab Incident Reports
            <Eye className="size-5" />
          </CardTitle>
          <CardDescription className="text-gray-300">
            Document and track corporate treachery incidents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card 
                key={report.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedReport?.id === report.id 
                    ? "bg-red-900/50 border-red-500" 
                    : "bg-gray-700/50 border-gray-600"
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {TYPE_ICONS[report.type]}
                        <span className="text-lg">🔪</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{report.title}</span>
                          <Badge className={SEVERITY_COLORS[report.severity]}>
                            {report.severity.toUpperCase()}
                          </Badge>
                          <Badge className={STATUS_COLORS[report.status]}>
                            {report.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>Reporter: {report.reporter}</span>
                          <span>Target: {report.target}</span>
                          <span>Dept: {report.department}</span>
                          <span>Date: {report.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getImpactColor(report.impact)}`}>
                        {report.impact}%
                      </div>
                      <div className="text-xs text-gray-400">Impact Score</div>
                      <div className="text-sm text-red-400 mt-1">
                        {getImpactLabel(report.impact)}
                      </div>
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
        <Card className="bg-red-900/50 border-red-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="size-5" />
              Detailed Report: {selectedReport.title}
              <Zap className="size-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Incident Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Reporter:</span>
                    <span className="text-white font-bold">{selectedReport.reporter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Target:</span>
                    <span className="text-red-400 font-bold">{selectedReport.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Department:</span>
                    <span className="text-blue-400 font-bold">{selectedReport.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Date:</span>
                    <span className="text-gray-400 font-bold">{selectedReport.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Type:</span>
                    <span className="text-yellow-400 font-bold">{selectedReport.type.replace("-", " ").toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Evidence & Witnesses</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-300 text-sm">Evidence:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedReport.evidence.map((item, index) => (
                        <Badge key={index} className="bg-gray-600 text-white text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-300 text-sm">Witnesses:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedReport.witnesses.map((witness, index) => (
                        <Badge key={index} className="bg-green-600 text-white text-xs">
                          {witness}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Shield className="size-4 mr-2" />
                Escalate to HR
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <MessageSquare className="size-4 mr-2" />
                Request Mediation
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileText className="size-4 mr-2" />
                Add Evidence
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-red-300 mb-2">
          Classics of Corporate Warfare - Documentation
        </h3>
        <p className="text-gray-400">
          "Document everything, trust no one, and always have receipts"
        </p>
      </div>
    </div>
  )
}

export default StabBackView

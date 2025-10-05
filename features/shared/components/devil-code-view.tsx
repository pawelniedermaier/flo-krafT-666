"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Code, 
  Bug, 
  AlertTriangle, 
  Zap, 
  Eye, 
  Sparkles,
  Terminal,
  Cpu,
  Database,
  Shield
} from "lucide-react"

interface CodeIssue {
  id: string
  type: "bug" | "vulnerability" | "performance" | "security"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  file: string
  line: number
  demon: string
}

const DEMON_NAMES = [
  "Bugzilla the Destroyer",
  "Memory Leak Leviathan", 
  "Null Pointer Demon",
  "Infinite Loop Beast",
  "Stack Overflow Serpent",
  "Race Condition Wraith",
  "Buffer Overflow Fiend",
  "Deadlock Phantom"
]

const CODE_ISSUES: CodeIssue[] = [
  {
    id: "1",
    type: "bug",
    severity: "critical",
    description: "Infinite recursion in user authentication",
    file: "auth.js",
    line: 42,
    demon: "Bugzilla the Destroyer"
  },
  {
    id: "2", 
    type: "vulnerability",
    severity: "high",
    description: "SQL injection vulnerability detected",
    file: "database.js",
    line: 156,
    demon: "Memory Leak Leviathan"
  },
  {
    id: "3",
    type: "performance",
    severity: "medium", 
    description: "Memory leak in image processing",
    file: "imageUtils.js",
    line: 89,
    demon: "Null Pointer Demon"
  },
  {
    id: "4",
    type: "security",
    severity: "critical",
    description: "Hardcoded API keys in source code",
    file: "config.js", 
    line: 23,
    demon: "Infinite Loop Beast"
  }
]

function DevilCodeView() {
  const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null)
  const [isExorcising, setIsExorcising] = useState(false)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600 text-white"
      case "high": return "bg-orange-600 text-white" 
      case "medium": return "bg-yellow-600 text-white"
      case "low": return "bg-green-600 text-white"
      default: return "bg-gray-600 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug": return <Bug className="size-4" />
      case "vulnerability": return <AlertTriangle className="size-4" />
      case "performance": return <Zap className="size-4" />
      case "security": return <Shield className="size-4" />
      default: return <Code className="size-4" />
    }
  }

  const handleExorcise = async (issue: CodeIssue) => {
    setIsExorcising(true)
    // Simulate exorcism process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsExorcising(false)
    setSelectedIssue(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Code className="size-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold">👹 DEVIL IN THE CODE</h1>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Terminal className="size-5 text-white" />
          </div>
        </div>
        <p className="text-xl text-purple-200 mb-2">
          When your codebase becomes possessed by digital demons
        </p>
        <p className="text-purple-300 flex items-center justify-center gap-2">
          <Sparkles className="size-4" />
          Exorcise the bugs that haunt your development
          <Sparkles className="size-4" />
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-red-900/50 border-red-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{CODE_ISSUES.length}</div>
            <div className="text-sm text-red-200">Demons Detected</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-900/50 border-orange-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">2</div>
            <div className="text-sm text-orange-200">Critical Issues</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/50 border-yellow-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">1</div>
            <div className="text-sm text-yellow-200">High Priority</div>
          </CardContent>
        </Card>
        <Card className="bg-green-900/50 border-green-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-sm text-green-200">Exorcised</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Exorcism Card */}
      <Card className="bg-gray-800/80 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="size-5" />
            Code Exorcism Chamber
            <Eye className="size-5" />
          </CardTitle>
          <CardDescription className="text-gray-300">
            Select a demon-infested code issue to begin the exorcism ritual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CODE_ISSUES.map((issue) => (
              <Card 
                key={issue.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedIssue?.id === issue.id 
                    ? "bg-red-900/50 border-red-500" 
                    : "bg-gray-700/50 border-gray-600"
                }`}
                onClick={() => setSelectedIssue(issue)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(issue.type)}
                      <span className="font-semibold text-white">{issue.demon}</span>
                    </div>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{issue.description}</p>
                  <p className="text-gray-400 text-xs">
                    {issue.file}:{issue.line}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exorcism Action */}
      {selectedIssue && (
        <Card className="bg-red-900/50 border-red-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="size-5" />
              Exorcism Ritual for {selectedIssue.demon}
              <Zap className="size-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-red-800/50 border-red-600">
              <AlertTriangle className="size-4" />
              <AlertDescription className="text-red-200">
                Warning: This demon is of {selectedIssue.severity} severity. 
                Proceed with caution during the exorcism ritual.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-center">
              <Button
                onClick={() => handleExorcise(selectedIssue)}
                disabled={isExorcising}
                className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {isExorcising ? (
                  <>
                    <Cpu className="size-5 mr-2 animate-spin" />
                    EXORCISING DEMON...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5 mr-2" />
                    BEGIN EXORCISM RITUAL
                    <Sparkles className="size-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-purple-300 mb-2">
          Classics of Code Exorcism - Digital Demons
        </h3>
        <p className="text-gray-400">
          "The first rule of debugging: the bug is always in the last place you look"
        </p>
      </div>
    </div>
  )
}

export default DevilCodeView

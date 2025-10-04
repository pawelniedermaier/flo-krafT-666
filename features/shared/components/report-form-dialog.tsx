"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  AlertTriangle, 
  FileText, 
  Target, 
  MessageSquare, 
  Zap,
  Trophy,
  Users,
  Clock
} from "lucide-react"
import { reportService } from "@/lib/services/report-service"
import type { ReportFormData, ReportSeverity, User } from "@/lib/types"

interface ReportFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (report: any) => void
  reporterId: string
  users: User[]
}

export function ReportFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  reporterId, 
  users 
}: ReportFormDialogProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    reportedUserId: "",
    title: "",
    description: "",
    comments: "",
    severity: "medium"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      // Validate form
      const validationErrors = validateForm()
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setIsSubmitting(false)
        return
      }

      // Submit report
      const report = reportService.submitReport(reporterId, formData)
      onSubmit(report)

      // Reset form
      setFormData({
        reportedUserId: "",
        title: "",
        description: "",
        comments: "",
        severity: "medium"
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to submit report:', error)
      setErrors({ submit: 'Failed to submit report. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!formData.reportedUserId) {
      errors.reportedUserId = "Please select a user to report"
    }
    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }
    if (!formData.comments.trim()) {
      errors.comments = "Comments are required"
    }
    if (formData.reportedUserId === reporterId) {
      errors.reportedUserId = "You cannot report yourself"
    }

    return errors
  }

  const getSeverityColor = (severity: ReportSeverity) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800 border-green-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical": return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const getSeverityIcon = (severity: ReportSeverity) => {
    switch (severity) {
      case "low": return "🟢"
      case "medium": return "🟡"
      case "high": return "🟠"
      case "critical": return "🔴"
    }
  }

  const getPointsPreview = (severity: ReportSeverity) => {
    const pointsMap = {
      low: { awarded: 10, deducted: 5 },
      medium: { awarded: 25, deducted: 15 },
      high: { awarded: 50, deducted: 30 },
      critical: { awarded: 100, deducted: 60 }
    }
    return pointsMap[severity]
  }

  const availableUsers = users.filter(user => user.id !== reporterId && user.isActive)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Submit Corporate Report
          </DialogTitle>
          <DialogDescription>
            Report inappropriate behavior or policy violations. Your report will be reviewed by management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="reportedUser">Report User *</Label>
            <Select 
              value={formData.reportedUserId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, reportedUserId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user to report" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <span>{user.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reportedUserId && (
              <p className="text-sm text-red-600">{errors.reportedUserId}</p>
            )}
          </div>

          {/* Severity Selection */}
          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level *</Label>
            <Select 
              value={formData.severity} 
              onValueChange={(value: ReportSeverity) => setFormData(prev => ({ ...prev, severity: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <span>🟢 Low</span>
                    <span className="text-xs text-muted-foreground">Minor issues</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <span>🟡 Medium</span>
                    <span className="text-xs text-muted-foreground">Policy violations</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <span>🟠 High</span>
                    <span className="text-xs text-muted-foreground">Serious misconduct</span>
                  </div>
                </SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <span>🔴 Critical</span>
                    <span className="text-xs text-muted-foreground">Immediate action required</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Points Preview */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Points Impact</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span>You gain: <strong className="text-green-600">+{getPointsPreview(formData.severity).awarded}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-600" />
                  <span>They lose: <strong className="text-red-600">-{getPointsPreview(formData.severity).deducted}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Report Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief summary of the issue"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of what happened, when, and where"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments *</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Your thoughts on the situation and any additional context"
              rows={3}
              className={errors.comments ? "border-red-500" : ""}
            />
            {errors.comments && (
              <p className="text-sm text-red-600">{errors.comments}</p>
            )}
          </div>

          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> False reports may result in point deductions. 
              Only submit reports for genuine policy violations or inappropriate behavior.
            </AlertDescription>
          </Alert>

          {/* Submit Error */}
          {errors.submit && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Submit Report
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

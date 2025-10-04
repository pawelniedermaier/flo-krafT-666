"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Calendar,
  Users,
  Settings,
  Info,
  Zap,
  Bell,
  AlertTriangle
} from "lucide-react"
import { notificationService } from "@/lib/services/notification-service"
import type { NotificationSchedule, NotificationTemplate, User } from "@/lib/types"

interface NotificationSchedulerProps {
  users: User[]
}

/**
 * Notification Scheduler Component
 * Allows setting up automated notifications at non-standard times
 */
export function NotificationScheduler({ users }: NotificationSchedulerProps) {
  const [schedules, setSchedules] = useState<NotificationSchedule[]>([])
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<NotificationSchedule | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    templateId: "",
    isActive: true,
    cronExpression: "",
    timezone: "UTC",
    targetUsers: [] as string[],
    variables: {} as Record<string, string>
  })

  useEffect(() => {
    loadSchedules()
    loadTemplates()
  }, [])

  const loadSchedules = () => {
    const allSchedules = notificationService.getSchedules()
    setSchedules(allSchedules)
  }

  const loadTemplates = () => {
    const allTemplates = notificationService.getTemplates()
    setTemplates(allTemplates)
  }

  const handleCreateSchedule = () => {
    if (!formData.name || !formData.templateId) return

    const newSchedule = notificationService.createSchedule({
      name: formData.name,
      templateId: formData.templateId,
      isActive: formData.isActive,
      cronExpression: formData.cronExpression,
      timezone: formData.timezone,
      targetUsers: formData.targetUsers,
      variables: formData.variables
    })

    setSchedules([...schedules, newSchedule])
    resetForm()
  }

  const handleUpdateSchedule = () => {
    if (!editingSchedule) return

    const success = notificationService.updateSchedule(editingSchedule.id, {
      name: formData.name,
      templateId: formData.templateId,
      isActive: formData.isActive,
      cronExpression: formData.cronExpression,
      timezone: formData.timezone,
      targetUsers: formData.targetUsers,
      variables: formData.variables
    })

    if (success) {
      loadSchedules()
      resetForm()
    }
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      const success = notificationService.deleteSchedule(scheduleId)
      if (success) {
        setSchedules(schedules.filter(s => s.id !== scheduleId))
      }
    }
  }

  const handleToggleSchedule = (scheduleId: string, isActive: boolean) => {
    notificationService.updateSchedule(scheduleId, { isActive })
    loadSchedules()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      templateId: "",
      isActive: true,
      cronExpression: "",
      timezone: "UTC",
      targetUsers: [],
      variables: {}
    })
    setShowCreateForm(false)
    setEditingSchedule(null)
  }

  const startEditing = (schedule: NotificationSchedule) => {
    setEditingSchedule(schedule)
    setFormData({
      name: schedule.name,
      templateId: schedule.templateId,
      isActive: schedule.isActive,
      cronExpression: schedule.cronExpression,
      timezone: schedule.timezone,
      targetUsers: schedule.targetUsers,
      variables: schedule.variables
    })
    setShowCreateForm(true)
  }

  const getSelectedTemplate = () => {
    return templates.find(t => t.id === formData.templateId)
  }

  const getScheduleIcon = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return <Bell className="h-4 w-4" />
    
    switch (template.priority) {
      case "urgent": return <AlertTriangle className="h-4 w-4" />
      case "high": return <Zap className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
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

  const formatCronExpression = (cron: string) => {
    if (!cron) return "Manual trigger"
    
    // Simple formatting for common patterns
    if (cron === "0 6 * * 1-5") return "Weekdays at 6:00 AM"
    if (cron === "0 10,16 * * 6,0") return "Weekends at 10:00 AM & 4:00 PM"
    if (cron === "0 22 * * *") return "Daily at 10:00 PM"
    
    return cron
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Clock className="h-8 w-8 text-blue-600" />
          Notification Scheduler
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Set up automated notifications to be sent at non-standard times. 
          Perfect for simulating the pressure of corporate culture!
        </p>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {editingSchedule ? "Edit Schedule" : "Create New Schedule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Weekend Work Check"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template">Notification Template</Label>
                <Select value={formData.templateId} onValueChange={(value) => setFormData({ ...formData, templateId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          {getScheduleIcon(template.id)}
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {getSelectedTemplate() && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getPriorityColor(getSelectedTemplate()!.priority)}>
                    {getSelectedTemplate()!.priority.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium">{getSelectedTemplate()!.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {getSelectedTemplate()!.description}
                </p>
                <p className="text-sm">
                  <strong>Template:</strong> {getSelectedTemplate()!.content}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cron">Schedule (Cron Expression)</Label>
                <Input
                  id="cron"
                  placeholder="0 6 * * 1-5 (weekdays at 6 AM)"
                  value={formData.cronExpression}
                  onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
                />
                <div className="text-xs text-muted-foreground">
                  Examples: "0 6 * * 1-5" (weekdays 6 AM), "0 10,16 * * 6,0" (weekends 10 AM & 4 PM)
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Users</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={formData.targetUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            targetUsers: [...formData.targetUsers, user.id]
                          })
                        } else {
                          setFormData({
                            ...formData,
                            targetUsers: formData.targetUsers.filter(id => id !== user.id)
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`user-${user.id}`} className="text-sm">
                      {user.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="active">Schedule is active</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}>
                {editingSchedule ? "Update Schedule" : "Create Schedule"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedules List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Notifications
              </CardTitle>
              <CardDescription>
                Manage your automated notification schedules
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No schedules created yet. Create your first schedule to start sending automated notifications!
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => {
                const template = templates.find(t => t.id === schedule.templateId)
                return (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getScheduleIcon(schedule.templateId)}
                        <h3 className="font-medium">{schedule.name}</h3>
                        <Badge variant={schedule.isActive ? "default" : "secondary"}>
                          {schedule.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {template && (
                          <Badge className={getPriorityColor(template.priority)}>
                            {template.priority}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Template: {template?.name || "Unknown"}</div>
                        <div>Schedule: {formatCronExpression(schedule.cronExpression)}</div>
                        <div>Targets: {schedule.targetUsers.length} user(s)</div>
                        {schedule.lastTriggered && (
                          <div>Last triggered: {schedule.lastTriggered.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSchedule(schedule.id, !schedule.isActive)}
                      >
                        {schedule.isActive ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(schedule)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Setup Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Setup Templates
          </CardTitle>
          <CardDescription>
            Pre-configured schedules for common corporate scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Weekend Work Check",
                description: "Send notifications on weekends to simulate work pressure",
                cron: "0 10,16 * * 6,0",
                template: "weekend-update"
              },
              {
                name: "Early Morning Sync",
                description: "Early morning notifications before work hours",
                cron: "0 6 * * 1-5",
                template: "early-morning-check"
              },
              {
                name: "Late Night Emergency",
                description: "Late night notifications to test availability",
                cron: "0 22 * * *",
                template: "emergency-escalation"
              },
              {
                name: "Deadline Reminders",
                description: "Frequent deadline reminders throughout the day",
                cron: "0 9,13,17 * * 1-5",
                template: "deadline-reminder"
              }
            ].map((quickSetup, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{quickSetup.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{quickSetup.description}</p>
                <div className="text-xs text-muted-foreground mb-3">
                  Schedule: {formatCronExpression(quickSetup.cron)}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const template = templates.find(t => t.id === quickSetup.template)
                    if (template) {
                      setFormData({
                        name: quickSetup.name,
                        templateId: quickSetup.template,
                        isActive: true,
                        cronExpression: quickSetup.cron,
                        timezone: "UTC",
                        targetUsers: users.map(u => u.id),
                        variables: {
                          projectName: "Q4 Initiative",
                          deadline: "End of Week",
                          timeRemaining: "2 days"
                        }
                      })
                      setShowCreateForm(true)
                    }
                  }}
                >
                  Use This Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This notification system is designed for educational purposes to demonstrate 
          the pressure and urgency often found in corporate environments. Use responsibly!
        </AlertDescription>
      </Alert>
    </div>
  )
}

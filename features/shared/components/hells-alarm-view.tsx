"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Clock, 
  Bell, 
  AlertTriangle, 
  Zap, 
  Eye, 
  Sparkles,
  Timer,
  Calendar,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Volume2,
  VolumeX
} from "lucide-react"

interface Alarm {
  id: string
  title: string
  time: string
  type: "meeting" | "deadline" | "reminder" | "urgent" | "boss"
  priority: "critical" | "high" | "medium" | "low"
  description: string
  isActive: boolean
  sound: string
}

const HELL_ALARMS: Alarm[] = [
  {
    id: "1",
    title: "🔥 URGENT: Production Down!",
    time: "09:00",
    type: "urgent",
    priority: "critical",
    description: "The entire system is on fire and the client is calling every 5 minutes",
    isActive: true,
    sound: "hell-bells"
  },
  {
    id: "2", 
    title: "📊 Boss Meeting in Hell",
    time: "14:30",
    type: "boss",
    priority: "high",
    description: "Quarterly review with the devil himself - prepare your soul",
    isActive: true,
    sound: "demonic-chant"
  },
  {
    id: "3",
    title: "⏰ Deadline Apocalypse",
    time: "17:00",
    type: "deadline",
    priority: "critical",
    description: "Project due in 2 hours and you haven't started yet",
    isActive: false,
    sound: "doom-timer"
  },
  {
    id: "4",
    title: "👥 Team Standup Torture",
    time: "10:00",
    type: "meeting",
    priority: "medium",
    description: "Daily ritual of explaining why nothing is done",
    isActive: true,
    sound: "screaming"
  },
  {
    id: "5",
    title: "💀 Code Review Hell",
    time: "16:00",
    type: "meeting",
    priority: "high",
    description: "Your code will be judged by the harshest critics in the underworld",
    isActive: false,
    sound: "judgment-bell"
  }
]

const ALARM_SOUNDS = [
  { id: "hell-bells", name: "Hell Bells", emoji: "🔔" },
  { id: "demonic-chant", name: "Demonic Chant", emoji: "👹" },
  { id: "doom-timer", name: "Doom Timer", emoji: "⏰" },
  { id: "screaming", name: "Screaming", emoji: "😱" },
  { id: "judgment-bell", name: "Judgment Bell", emoji: "⚖️" }
]

function HellsAlarmView() {
  const [alarms, setAlarms] = useState<Alarm[]>(HELL_ALARMS)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRinging, setIsRinging] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      checkAlarms()
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const checkAlarms = () => {
    const now = new Date()
    const currentTimeStr = now.toTimeString().slice(0, 5)
    
    const activeAlarms = alarms.filter(alarm => 
      alarm.isActive && alarm.time === currentTimeStr
    )
    
    if (activeAlarms.length > 0 && !isRinging) {
      setIsRinging(true)
      // Simulate alarm ringing
      setTimeout(() => setIsRinging(false), 5000)
    }
  }

  const toggleAlarm = (alarmId: string) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, isActive: !alarm.isActive }
        : alarm
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-600 text-white"
      case "high": return "bg-orange-600 text-white" 
      case "medium": return "bg-yellow-600 text-white"
      case "low": return "bg-green-600 text-white"
      default: return "bg-gray-600 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Users className="size-4" />
      case "deadline": return <Timer className="size-4" />
      case "reminder": return <Bell className="size-4" />
      case "urgent": return <AlertTriangle className="size-4" />
      case "boss": return <Zap className="size-4" />
      default: return <Clock className="size-4" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Clock className="size-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold">⏰ HELL'S ALARM CLOCK</h1>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Bell className="size-5 text-white" />
          </div>
        </div>
        <p className="text-xl text-red-200 mb-2">
          When every meeting feels like eternal damnation
        </p>
        <p className="text-red-300 flex items-center justify-center gap-2">
          <Sparkles className="size-4" />
          Wake up to the sound of corporate hell
          <Sparkles className="size-4" />
        </p>
      </div>

      {/* Current Time & Status */}
      <div className="text-center mb-8">
        <div className="text-6xl font-mono font-bold text-red-400 mb-2">
          {formatTime(currentTime)}
        </div>
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-red-600 text-white">
            {alarms.filter(a => a.isActive).length} Active Alarms
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="border-red-500 text-red-300 hover:bg-red-500/20"
          >
            {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            {soundEnabled ? "Sound On" : "Sound Off"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-red-900/50 border-red-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{alarms.length}</div>
            <div className="text-sm text-red-200">Total Alarms</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-900/50 border-orange-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {alarms.filter(a => a.isActive).length}
            </div>
            <div className="text-sm text-orange-200">Active</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/50 border-yellow-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {alarms.filter(a => a.priority === "critical").length}
            </div>
            <div className="text-sm text-yellow-200">Critical</div>
          </CardContent>
        </Card>
        <Card className="bg-green-900/50 border-green-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {alarms.filter(a => a.type === "boss").length}
            </div>
            <div className="text-sm text-green-200">Boss Meetings</div>
          </CardContent>
        </Card>
      </div>

      {/* Ringing Alert */}
      {isRinging && (
        <Alert className="mb-6 bg-red-800/50 border-red-600 animate-pulse">
          <AlertTriangle className="size-4" />
          <AlertDescription className="text-red-200 font-bold">
            🔥 ALARM RINGING! 🔥 Time for your scheduled torture session!
          </AlertDescription>
        </Alert>
      )}

      {/* Main Alarm Chamber */}
      <Card className="bg-gray-800/80 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye className="size-5" />
            Hell's Alarm Chamber
            <Eye className="size-5" />
          </CardTitle>
          <CardDescription className="text-gray-300">
            Manage your daily dose of corporate torment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alarms.map((alarm) => (
              <Card 
                key={alarm.id}
                className={`transition-all ${
                  alarm.isActive 
                    ? "bg-red-900/50 border-red-500" 
                    : "bg-gray-700/50 border-gray-600"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-mono font-bold text-red-400">
                        {alarm.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(alarm.type)}
                          <span className="font-semibold text-white">{alarm.title}</span>
                          <Badge className={getPriorityColor(alarm.priority)}>
                            {alarm.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm">{alarm.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">Sound:</span>
                          <span className="text-xs text-gray-300">
                            {ALARM_SOUNDS.find(s => s.id === alarm.sound)?.emoji} 
                            {ALARM_SOUNDS.find(s => s.id === alarm.sound)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAlarm(alarm.id)}
                        className={`${
                          alarm.isActive 
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-500" 
                            : "bg-gray-600 hover:bg-gray-700 text-white border-gray-500"
                        }`}
                      >
                        {alarm.isActive ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500 text-orange-300 hover:bg-orange-500/20"
                      >
                        <Clock className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-red-900/50 border-red-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="size-5" />
            Emergency Actions
            <Zap className="size-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4">
            <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
              <Phone className="size-4 mr-2" />
              Call Boss
            </Button>
            <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white">
              <Mail className="size-4 mr-2" />
              Send SOS Email
            </Button>
            <Button className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white">
              <MessageSquare className="size-4 mr-2" />
              Panic Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-red-300 mb-2">
          Classics of Corporate Hell - Time Management
        </h3>
        <p className="text-gray-400">
          "Time is money, and we're all going bankrupt"
        </p>
      </div>
    </div>
  )
}

export default HellsAlarmView

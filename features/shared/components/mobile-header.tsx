"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Menu, 
  Plus, 
  UserPlus, 
  Calendar, 
  AlertTriangle,
  List,
  Kanban,
  Users,
  Building2,
  Sun,
  Moon,
  Zap,
  Bell,
  Trophy
} from "lucide-react"
import Image from "next/image"
import type { ViewMode, User, Issue, Sprint } from "@/lib/types"
import { PLACEHOLDER_AVATAR } from "@/lib/constants"

interface MobileHeaderProps {
  activeView: ViewMode | "organization" | "tarot" | "text-analysis" | "image-overlay" | "notifications" | "leaderboard" | "competitive-reports"
  onViewChange: (view: ViewMode | "organization" | "tarot" | "text-analysis" | "image-overlay" | "notifications" | "leaderboard" | "competitive-reports") => void
  currentUser: User | null
  users: User[]
  onUserChange: (user: User) => void
  theme: "light" | "dark" | "cyberpunk" | "turbo-matrix"
  onThemeChange: (theme: "light" | "dark" | "cyberpunk" | "turbo-matrix") => void
  issues: Issue[]
  sprints: Sprint[]
  onNewIssue?: () => void
  onNewSprint?: () => void
  onNewUser?: () => void
  onNewReport?: () => void
}

export function MobileHeader({
  activeView,
  onViewChange,
  currentUser,
  users,
  onUserChange,
  theme,
  onThemeChange,
  issues,
  sprints,
  onNewIssue,
  onNewSprint,
  onNewUser,
  onNewReport,
}: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const isStandardMode = theme === "light" || theme === "dark"

  const toggleStandardTheme = () => {
    onThemeChange(theme === "light" ? "dark" : "light")
  }

  const toggleCyberpunkTheme = () => {
    onThemeChange(theme === "cyberpunk" ? "turbo-matrix" : "cyberpunk")
  }

  const switchThemeMode = () => {
    if (isStandardMode) {
      onThemeChange("cyberpunk")
    } else {
      onThemeChange("light")
    }
  }

  const menuItems = [
    { id: "issues" as const, label: "Issues", icon: List },
    { id: "kanban" as const, label: "Board", icon: Kanban },
    { id: "sprints" as const, label: "Sprints", icon: Calendar },
    { id: "users" as const, label: "Users", icon: Users },
    { id: "organization" as const, label: "Organization", icon: Building2 },
  ]

  const getTitle = () => {
    switch (activeView) {
      case "issues":
        return "Issues"
      case "kanban":
        return "Board"
      case "sprints":
        return "Sprints"
      case "users":
        return "Users"
      case "organization":
        return "Organization"
      case "tarot":
        return "TAROT AI BOOST™"
      case "competitive-reports":
        return "Competitive Reports"
      default:
        return ""
    }
  }

  const getSubtitle = () => {
    switch (activeView) {
      case "issues":
        return `${issues.length} issues total`
      case "kanban":
        const activeSprint = sprints.find((s) => s.status === "active")
        return activeSprint ? activeSprint.name : "No active sprint 🌑"
      case "sprints":
        return `${sprints.length} sprints`
      case "users":
        return `${users.filter((u) => u.isActive).length} active users`
      case "organization":
        return "Company hierarchy and reporting structure"
      case "tarot":
        return "🔮 Mystical insights for the enlightened leader"
      case "competitive-reports":
        return "Compete with colleagues in the ultimate reporting challenge"
      default:
        return ""
    }
  }

  const getActionButton = () => {
    switch (activeView) {
      case "issues":
        return onNewIssue ? (
          <Button size="sm" className="gap-2" onClick={onNewIssue}>
            <Plus className="size-4" />
            New Issue
          </Button>
        ) : null
      case "kanban":
        return onNewIssue ? (
          <Button size="sm" className="gap-2" onClick={onNewIssue}>
            <Plus className="size-4" />
            New Task
          </Button>
        ) : null
      case "sprints":
        return onNewSprint ? (
          <Button size="sm" className="gap-2" onClick={onNewSprint}>
            <Calendar className="size-4" />
            New Sprint
          </Button>
        ) : null
      case "users":
        return onNewUser ? (
          <Button size="sm" className="gap-2" onClick={onNewUser}>
            <UserPlus className="size-4" />
            New User
          </Button>
        ) : null
      case "competitive-reports":
        return onNewReport ? (
          <Button 
            size="sm" 
            className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500" 
            onClick={onNewReport}
          >
            <AlertTriangle className="size-4" />
            Submit Report
          </Button>
        ) : null
      default:
        return null
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Sidebar Header */}
                  <div className="p-6 border-b border-sidebar-border">
                    <div className="flex items-center justify-center">
                      <div className="relative w-full h-12 flex items-center justify-center">
                        <Image
                          src="/logo2.png"
                          alt="Logo"
                          width={150}
                          height={48}
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Button
                          key={item.id}
                          variant={activeView === item.id ? "default" : "ghost"}
                          onClick={() => {
                            onViewChange(item.id)
                            setIsOpen(false)
                          }}
                          className="w-full justify-start gap-3 h-12 text-base"
                        >
                          <Icon className="size-5" />
                          {item.label}
                        </Button>
                      )
                    })}

                    {/* Corporate Culture Tools */}
                    <div className="my-4 border-t border-sidebar-border" />
                    
                    {/* Devil in the Code - Only for Boss and Director */}
                    {(currentUser?.role === "boss" || currentUser?.role === "director") && (
                      <Button
                        variant={activeView === "text-analysis" ? "default" : "ghost"}
                        onClick={() => {
                          onViewChange("text-analysis")
                          setIsOpen(false)
                        }}
                        className="w-full justify-start gap-3 h-12 text-base"
                      >
                        👹 Devil in the Code
                      </Button>
                    )}

                    {/* Meme Generator - Only for Boss and Director */}
                    {(currentUser?.role === "boss" || currentUser?.role === "director") && (
                      <Button
                        variant={activeView === "image-overlay" ? "default" : "ghost"}
                        onClick={() => {
                          onViewChange("image-overlay")
                          setIsOpen(false)
                        }}
                        className="w-full justify-start gap-3 h-12 text-base"
                      >
                        🤡 Meme Generator
                      </Button>
                    )}

                    {/* Notifications - Only for Boss and Director */}
                    {(currentUser?.role === "boss" || currentUser?.role === "director") && (
                      <Button
                        variant={activeView === "notifications" ? "default" : "ghost"}
                        onClick={() => {
                          onViewChange("notifications")
                          setIsOpen(false)
                        }}
                        className="w-full justify-start gap-3 h-12 text-base"
                      >
                        ⏰ Hell's Alarm Clock
                      </Button>
                    )}

                    {/* Leaderboard - Only for Boss and Director */}
                    {(currentUser?.role === "boss" || currentUser?.role === "director") && (
                      <Button
                        variant={activeView === "leaderboard" ? "default" : "ghost"}
                        onClick={() => {
                          onViewChange("leaderboard")
                          setIsOpen(false)
                        }}
                        className="w-full justify-start gap-3 h-12 text-base"
                      >
                        🫢 The Betrayal Ranking
                      </Button>
                    )}

                    {/* Competitive Reports */}
                    <Button
                      variant={activeView === "competitive-reports" ? "default" : "ghost"}
                      onClick={() => {
                        onViewChange("competitive-reports")
                        setIsOpen(false)
                      }}
                      className="w-full justify-start gap-3 h-12 text-base"
                    >
                      🔪 Stab in the Back
                    </Button>

                    {/* Tarot AI Boost - Only for Boss */}
                    {currentUser?.role === "boss" && (
                      <Button
                        variant={activeView === "tarot" ? "default" : "ghost"}
                        onClick={() => {
                          onViewChange("tarot")
                          setIsOpen(false)
                        }}
                        className={`w-full justify-start gap-3 h-12 text-base ${
                          activeView === "tarot" ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""
                        }`}
                      >
                        🧙‍♂️ Shadow of Mordor Tarot AI
                      </Button>
                    )}
                  </nav>

                  {/* User & Theme Settings */}
                  <div className="p-4 border-t border-sidebar-border space-y-4">
                    {/* Current User */}
                    <div className="px-3 py-2 bg-sidebar-accent rounded-lg">
                      <p className="text-xs text-sidebar-foreground/60 mb-2">Logged in as</p>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage
                            src={currentUser?.avatar || PLACEHOLDER_AVATAR}
                            alt={currentUser?.name || "User"}
                          />
                          <AvatarFallback className="text-xs">
                            {currentUser ? getInitials(currentUser.name) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-sidebar-foreground truncate">
                            {currentUser?.name || "No user"}
                          </p>
                          <p className="text-xs text-sidebar-foreground/60">{currentUser?.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* User Switcher */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          const currentIndex = users.findIndex((u) => u.id === currentUser?.id)
                          const nextIndex = (currentIndex + 1) % users.length
                          onUserChange(users[nextIndex])
                        }}
                      >
                        Switch User
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          localStorage.removeItem("flowcraft-current-user")
                          window.location.reload()
                        }}
                      >
                        Choose Different User
                      </Button>
                    </div>

                    {/* Theme Controls */}
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleStandardTheme}
                        className={`w-full justify-start gap-3 ${isStandardMode ? "bg-sidebar-accent" : ""}`}
                      >
                        {theme === "light" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                        {theme === "light" ? "Dark mode" : theme === "dark" ? "Light mode" : "Standard"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleCyberpunkTheme}
                        className={`w-full justify-start gap-3 ${!isStandardMode ? "bg-sidebar-accent" : ""}`}
                      >
                        <Zap className="size-4" />
                        {theme === "cyberpunk" ? "Turbo Matrix" : theme === "turbo-matrix" ? "Cyberpunk" : "Cyber"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={switchThemeMode}
                        className="w-full text-xs bg-transparent"
                      >
                        {isStandardMode ? "🎨 Go Cyberpunk" : "🌟 Go Standard"}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">{getTitle()}</h1>
              <p className="text-xs text-muted-foreground">{getSubtitle()}</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            {getActionButton()}
          </div>
        </div>
      </header>
    </>
  )
}

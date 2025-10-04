"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { 
  List, 
  Kanban, 
  Calendar, 
  Users, 
  Building2,
  Sparkles,
  Sun,
  Moon,
  Zap
} from "lucide-react"
import type { User, ViewMode } from "@/lib/types"
import { PLACEHOLDER_AVATAR } from "@/lib/constants"

interface SidebarProps {
  activeView: ViewMode | "issues" | "organization" | "tarot"
  onViewChange: (view: ViewMode | "issues" | "organization" | "tarot") => void
  currentUser: User | null
  users: User[]
  onUserChange: (user: User) => void
  theme: "light" | "dark" | "cyberpunk" | "turbo-matrix"
  onThemeChange: (theme: "light" | "dark" | "cyberpunk" | "turbo-matrix") => void
}

export function Sidebar({
  activeView,
  onViewChange,
  currentUser,
  users,
  onUserChange,
  theme,
  onThemeChange,
}: SidebarProps) {
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

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center">
          <div className="relative w-full h-16 flex items-center justify-center">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={200}
              height={64}
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
              onClick={() => onViewChange(item.id)}
              className="w-full justify-start gap-3 h-10"
            >
              <Icon className="size-4" />
              {item.label}
            </Button>
          )
        })}

        {/* Tarot AI Boost - Only for Boss */}
        {currentUser?.role === "boss" && (
          <>
            <div className="my-2 border-t border-sidebar-border" />
            <Button
              variant={activeView === "tarot" ? "default" : "ghost"}
              onClick={() => onViewChange("tarot")}
              className={`w-full justify-start gap-3 h-10 ${
                activeView === "tarot" ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""
              }`}
            >
              <Sparkles className="size-4" />
              TAROT AI BOOST
            </Button>
          </>
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
        <div className="space-y-1">
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
        </div>

        {/* Theme Controls */}
        <div className="space-y-2">
          {/* Standard Light/Dark Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleStandardTheme}
            className={`w-full justify-start gap-3 ${isStandardMode ? "bg-sidebar-accent" : ""}`}
          >
            {theme === "light" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {theme === "light" ? "Dark mode" : theme === "dark" ? "Light mode" : "Standard"}
          </Button>

          {/* Cyberpunk Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCyberpunkTheme}
            className={`w-full justify-start gap-3 ${!isStandardMode ? "bg-sidebar-accent" : ""}`}
          >
            <Zap className="size-4" />
            {theme === "cyberpunk" ? "Turbo Matrix" : theme === "turbo-matrix" ? "Cyberpunk" : "Cyber"}
          </Button>

          {/* Theme Mode Switch */}
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
    </aside>
  )
}


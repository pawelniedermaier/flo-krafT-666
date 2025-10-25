"use client"

import { Button } from "@/components/ui/button"
import { 
  List, 
  Kanban, 
  Calendar, 
  Users, 
  Building2,
  AlertTriangle
} from "lucide-react"
import type { ViewMode } from "@/lib/types"

interface MobileBottomNavProps {
  activeView: ViewMode | "organization" | "tarot" | "text-analysis" | "image-overlay" | "notifications" | "leaderboard" | "competitive-reports"
  onViewChange: (view: ViewMode | "organization" | "tarot" | "text-analysis" | "image-overlay" | "notifications" | "leaderboard" | "competitive-reports") => void
}

export function MobileBottomNav({
  activeView,
  onViewChange,
}: MobileBottomNavProps) {
  const navItems = [
    { 
      id: "issues" as const, 
      label: "Issues", 
      icon: List,
      shortLabel: "Issues"
    },
    { 
      id: "kanban" as const, 
      label: "Board", 
      icon: Kanban,
      shortLabel: "Board"
    },
    { 
      id: "sprints" as const, 
      label: "Sprints", 
      icon: Calendar,
      shortLabel: "Sprints"
    },
    { 
      id: "users" as const, 
      label: "Users", 
      icon: Users,
      shortLabel: "Users"
    },
    { 
      id: "competitive-reports" as const, 
      label: "Reports", 
      icon: AlertTriangle,
      shortLabel: "Reports"
    },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-1 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 h-16 w-full px-2 ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{item.shortLabel}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}

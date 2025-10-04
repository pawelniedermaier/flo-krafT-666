"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Kanban, Users, Calendar, BarChart3 } from "lucide-react"
import type { ViewMode } from "@/lib/types"

interface AppHeaderProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function AppHeader({ currentView, onViewChange }: AppHeaderProps) {
  const navItems: Array<{ view: ViewMode; label: string; icon: typeof Kanban }> = [
    { view: "kanban", label: "Board", icon: Kanban },
    { view: "users", label: "Team", icon: Users },
    { view: "sprints", label: "Sprints", icon: Calendar },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="floŁ krafT"
            width={40}
            height={40}
            className="size-10"
          />
          <h1 className="text-xl font-bold">floŁ krafT</h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.view}
                variant={currentView === item.view ? "default" : "ghost"}
                onClick={() => onViewChange(item.view)}
              >
                <Icon className="size-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}


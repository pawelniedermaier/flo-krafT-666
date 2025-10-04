"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { roleColors, PLACEHOLDER_AVATAR } from "@/lib/constants"
import type { User, Issue } from "@/lib/types"

interface UserSelectionProps {
  users: User[]
  issues: Issue[]
  onUserSelect: (user: User) => void
}

export function UserSelection({ users, issues, onUserSelect }: UserSelectionProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-8">
      <div className="w-full max-w-6xl animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={200}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Profile</h2>
          <p className="text-muted-foreground">Select a user to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users
            .filter((user) => user.isActive)
            .map((user) => {
              const userIssues = issues.filter((issue) => issue.assigneeId === user.id)
              const completedIssues = userIssues.filter((issue) => issue.status === "done")

              return (
                <Card
                  key={user.id}
                  className="professional-card hover-lift cursor-pointer transition-all hover:scale-105"
                  onClick={() => onUserSelect(user)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <Avatar className="size-24 ring-4 ring-primary/10">
                        <AvatarImage src={user.avatar || PLACEHOLDER_AVATAR} alt={user.name} />
                        <AvatarFallback className="text-2xl">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="text-xl font-semibold text-foreground">{user.name}</h3>
                          {!user.managerId && (
                            <Badge
                              variant="default"
                              className="text-xs bg-gradient-to-r from-purple-600 to-blue-600"
                            >
                              Top Mgmt
                            </Badge>
                          )}
                        </div>
                        <Badge className={roleColors[user.role]} variant="outline">
                          {user.role}
                        </Badge>
                      </div>

                      <div className="w-full pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tasks</p>
                            <p className="text-lg font-semibold text-foreground">
                              {userIssues.length}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Done</p>
                            <p className="text-lg font-semibold text-green-600">
                              {completedIssues.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      </div>
    </div>
  )
}


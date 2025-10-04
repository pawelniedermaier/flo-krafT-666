"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Edit, Trash2, Users } from "lucide-react"
import { roleColors, PLACEHOLDER_AVATAR } from "@/lib/constants"
import { calculateAge } from "@/lib/utils/age-calculator"
import type { User, Issue } from "@/lib/types"

interface UserCardProps {
  user: User
  manager?: User | null
  directReports?: User[]
  issues?: Issue[]
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
}

export function UserCard({ 
  user, 
  manager, 
  directReports = [], 
  issues = [], 
  onEdit, 
  onDelete 
}: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const userIssues = issues.filter((issue) => issue.assigneeId === user.id)
  const completedIssues = userIssues.filter((issue) => issue.status === "done")
  const completionRate = userIssues.length > 0 
    ? Math.round((completedIssues.length / userIssues.length) * 100) 
    : 0

  return (
    <Card className="professional-card hover-lift">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage src={user.avatar || PLACEHOLDER_AVATAR} alt={user.name} />
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <Badge className={roleColors[user.role]} variant="secondary">
                {user.role}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(user)}
                aria-label="Edit user"
              >
                <Edit className="size-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(user.id)}
                aria-label="Delete user"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" />
              <span>{user.phone}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span>{user.location}</span>
            </div>
          )}
        </div>

        {/* Task Statistics */}
        {userIssues.length > 0 && (
          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tasks Assigned</span>
              <span className="font-semibold">{userIssues.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-semibold text-green-600">{completedIssues.length}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Completion Rate</span>
                <span className="font-semibold">{completionRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Organizational Hierarchy */}
        {(manager || directReports.length > 0) && (
          <div className="pt-3 border-t space-y-2">
            {manager && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Reports to:</span>
                <div className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarImage src={manager.avatar || PLACEHOLDER_AVATAR} alt={manager.name} />
                    <AvatarFallback className="text-xs">{getInitials(manager.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{manager.name}</span>
                </div>
              </div>
            )}
            {directReports.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {directReports.length} Direct Report{directReports.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Status and Join Date */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {user.birthDate && (
            <div className="text-xs text-muted-foreground">
              <div>Born {user.birthDate.toLocaleDateString()} (Age: {calculateAge(user.birthDate)})</div>
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Joined {user.joinedAt.toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


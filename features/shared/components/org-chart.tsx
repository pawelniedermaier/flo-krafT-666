"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin } from "lucide-react"
import { roleColors, PLACEHOLDER_AVATAR } from "@/lib/constants"
import type { User, Issue } from "@/lib/types"

interface OrgNode {
  user: User
  children: OrgNode[]
}

interface OrgChartProps {
  node: OrgNode
  issues: Issue[]
}

export function OrgChart({ node, issues }: OrgChartProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const userIssues = issues.filter((issue) => issue.assigneeId === node.user.id)
  const completedIssues = userIssues.filter((issue) => issue.status === "done")

  return (
    <div className="flex flex-col items-center">
      {/* User Card */}
      <Card className="professional-card hover-lift w-80 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="size-12">
              <AvatarImage src={node.user.avatar || PLACEHOLDER_AVATAR} alt={node.user.name} />
              <AvatarFallback>{getInitials(node.user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{node.user.name}</h3>
                {!node.user.managerId && (
                  <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                    Top Mgmt
                  </Badge>
                )}
              </div>
              <Badge className={`${roleColors[node.user.role]} text-xs`} variant="outline">
                {node.user.role}
              </Badge>
            </div>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="size-3" />
              <span className="truncate">{node.user.email}</span>
            </div>
            {node.user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-3" />
                <span>{node.user.location}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span>Tasks: {userIssues.length}</span>
              <span className="text-green-600">Done: {completedIssues.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connecting Line */}
      {node.children.length > 0 && (
        <div className="relative">
          <div className="w-px h-6 bg-border mx-auto" />
          <div className="w-full h-px bg-border absolute top-6 left-0" />
        </div>
      )}

      {/* Children */}
      {node.children.length > 0 && (
        <div className="flex gap-8 mt-6 relative">
          {node.children.map((child) => (
            <div key={child.user.id} className="relative">
              {/* Vertical line to child */}
              <div className="absolute w-px h-6 bg-border left-1/2 -translate-x-1/2 -top-6" />
              <OrgChart node={child} issues={issues} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { OrgChart } from "@/features/shared/components/org-chart"
import type { User, Issue } from "@/lib/types"

interface OrgNode {
  user: User
  children: OrgNode[]
}

interface OrganizationViewProps {
  users: User[]
  issues: Issue[]
}

export function OrganizationView({ users, issues }: OrganizationViewProps) {
  const buildOrgTree = (): OrgNode[] => {
    const topLevel = users.filter((u) => !u.managerId)
    
    const buildNode = (user: User): OrgNode => {
      const children = users
        .filter((u) => u.managerId === user.id)
        .map(buildNode)
      return { user, children }
    }

    return topLevel.map(buildNode)
  }

  const orgTree = buildOrgTree()
  
  // Overall organization stats
  const totalTasks = issues.length
  const completedTasks = issues.filter((i) => i.status === "done").length
  const overallCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Organization Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Organization Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Total Members</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-600">{totalTasks}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">Completion</p>
              <p className="text-3xl font-bold text-purple-600">{overallCompletion}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Tree Chart */}
      <div className="flex justify-center overflow-x-auto p-8 bg-muted/30 rounded-lg border">
        <div className="flex gap-16">
          {orgTree.map((node) => (
            <OrgChart key={node.user.id} node={node} issues={issues} />
          ))}
        </div>
      </div>
    </div>
  )
}


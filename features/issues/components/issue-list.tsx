"use client"

import { useState } from "react"
import { IssueCard } from "./issue-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import type { Issue, User } from "@/lib/types"

interface IssueListProps {
  issues: Issue[]
  users: User[]
  onEdit?: (issue: Issue) => void
  onDelete?: (issueId: string) => void
  onAdd?: () => void
}

export function IssueList({ issues, users, onEdit, onDelete, onAdd }: IssueListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredIssues = issues.filter((issue) => {
    const query = searchQuery.toLowerCase()
    return (
      issue.title.toLowerCase().includes(query) || issue.description.toLowerCase().includes(query)
    )
  })

  const getUserById = (userId: string | undefined) => {
    if (!userId) return undefined
    return users.find((user) => user.id === userId)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Issues Grid */}
      {filteredIssues.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No issues found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              assignee={getUserById(issue.assigneeId)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}


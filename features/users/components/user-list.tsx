"use client"

import { useState } from "react"
import { UserCard } from "./user-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { User, Issue } from "@/lib/types"

interface UserListProps {
  users: User[]
  issues?: Issue[]
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
  onAdd?: () => void
}

export function UserList({ users, issues = [], onEdit, onDelete, onAdd }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const getUserById = (id: string) => users.find((u) => u.id === id)
  const getDirectReports = (managerId: string) => users.filter((u) => u.managerId === managerId)

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Developers</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === "developer").length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Managers</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.role === "manager" || u.role === "boss").length}
          </p>
        </div>
      </div>

      {/* User Grid */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredUsers.map((user) => {
            const manager = user.managerId ? getUserById(user.managerId) : null
            const directReports = getDirectReports(user.id)

            return (
              <UserCard
                key={user.id}
                user={user}
                manager={manager}
                directReports={directReports}
                issues={issues}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}


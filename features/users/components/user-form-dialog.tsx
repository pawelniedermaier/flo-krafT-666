"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PLACEHOLDER_AVATAR } from "@/lib/constants"
import type { User, UserRole } from "@/lib/types"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<User>) => void
  user?: User
  users: User[]
}

export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
  users,
}: UserFormDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "developer",
    phone: user?.phone || "",
    location: user?.location || "",
    birthDate: user?.birthDate,
    isActive: user?.isActive ?? true,
    managerId: user?.managerId,
    avatar: user?.avatar,
  })
  
  const [isTopManagement, setIsTopManagement] = useState(!user?.managerId && user?.id !== undefined)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ""
    return date.toISOString().split("T")[0]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      managerId: isTopManagement ? undefined : formData.managerId,
    }
    onSubmit(submitData)
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      email: "",
      role: "developer",
      phone: "",
      location: "",
      birthDate: undefined,
      isActive: true,
      managerId: undefined,
      avatar: undefined,
    })
    setIsTopManagement(false)
  }

  const roles: Array<{ value: UserRole; label: string }> = [
    { value: "boss", label: "Boss" },
    { value: "director", label: "Director" },
    { value: "manager", label: "Manager" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "qa", label: "QA" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4 p-4 border border-border rounded-lg bg-muted/30">
            <Avatar className="size-24">
              <AvatarImage src={formData.avatar || PLACEHOLDER_AVATAR} alt="User avatar" />
              <AvatarFallback className="text-2xl">
                {formData.name ? getInitials(formData.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="w-full">
              <Label htmlFor="avatar">Avatar Image</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload an image from your computer
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">Manager / Reports To</Label>
              <Select
                value={formData.managerId || "none"}
                onValueChange={(value) => {
                  setFormData({ ...formData, managerId: value === "none" ? undefined : value })
                  setIsTopManagement(value === "none")
                }}
              >
                <SelectTrigger id="manager">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Manager (Top Management)</SelectItem>
                  {users
                    .filter((u) => u.id !== user?.id && (u.role === "manager" || u.role === "director" || u.role === "boss"))
                    .map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select who this person reports to
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={formatDateForInput(formData.birthDate)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  birthDate: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{user ? "Update" : "Add"} User</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


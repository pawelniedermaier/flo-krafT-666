import { useCallback, useEffect } from "react"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { initialUsers } from "../data/initial-users"
import type { User, UserFormData } from "@/lib/types"

// Data version to force refresh when structure changes
const DATA_VERSION = "2.0.0"
const VERSION_KEY = "flowcraft-data-version"

/**
 * Custom hook for managing users
 * Provides CRUD operations with localStorage persistence
 */
export function useUsers() {
  const [users, setUsers] = useLocalStorage<User[]>(STORAGE_KEYS.USERS, initialUsers)

  // Check if we need to refresh data due to version change (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const currentVersion = localStorage.getItem(VERSION_KEY)
    if (currentVersion !== DATA_VERSION) {
      localStorage.removeItem(STORAGE_KEYS.USERS)
      localStorage.setItem(VERSION_KEY, DATA_VERSION)
      // Reset to initial data
      setUsers(initialUsers)
    }
  }, [setUsers])

  const addUser = useCallback(
    (userData: Omit<User, "id" | "joinedAt">) => {
      const maxId = Math.max(0, ...users.map((u) => Number.parseInt(u.id.split("-")[1]) || 0))
      const newUser: User = {
        ...userData,
        id: `USR-${String(maxId + 1).padStart(3, "0")}`,
        joinedAt: new Date(),
      }
      setUsers((prev) => [...prev, newUser])
      return newUser
    },
    [users, setUsers]
  )

  const updateUser = useCallback(
    (id: string, updates: Partial<User>) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...updates } : user
        )
      )
    },
    [setUsers]
  )

  const deleteUser = useCallback(
    (id: string) => {
      setUsers((prev) => prev.filter((user) => user.id !== id))
    },
    [setUsers]
  )

  const getUserById = useCallback(
    (id: string) => {
      return users.find((user) => user.id === id)
    },
    [users]
  )

  const getUsersByRole = useCallback(
    (role: User["role"]) => {
      return users.filter((user) => user.role === role)
    },
    [users]
  )

  const getActiveUsers = useCallback(() => {
    return users.filter((user) => user.isActive)
  }, [users])

  const toggleUserStatus = useCallback(
    (id: string) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isActive: !user.isActive } : user
        )
      )
    },
    [setUsers]
  )

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByRole,
    getActiveUsers,
    toggleUserStatus,
  }
}


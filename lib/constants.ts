/**
 * Application constants and configuration
 */

import type { UserRole } from "./types"

// Role styling configuration
export const roleColors: Record<UserRole, string> = {
  boss: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  director: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  developer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  designer: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  qa: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

// Priority colors
export const priorityColors = {
  P0: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  P1: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  P2: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  P3: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  P4: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  P5: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
}

// Status colors
export const statusColors = {
  todo: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-review": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

// Sprint status colors
export const sprintStatusColors = {
  planned: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

// Local storage keys
export const STORAGE_KEYS = {
  USERS: "flowcraft-users",
  ISSUES: "flowcraft-issues",
  SPRINTS: "flowcraft-sprints",
  THEME: "flowcraft-theme",
  VIEW_MODE: "flowcraft-view-mode",
} as const

// Default placeholder images
export const PLACEHOLDER_AVATAR = "/placeholder-user.jpg"
export const PLACEHOLDER_IMAGE = "/placeholder.jpg"


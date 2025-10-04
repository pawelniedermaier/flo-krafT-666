import { useCallback, useMemo } from "react"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { initialIssues } from "../data/initial-issues"
import type { Issue, IssueFormData, IssueFilters } from "@/lib/types"

/**
 * Custom hook for managing issues/tasks
 * Provides CRUD operations with filtering and localStorage persistence
 */
export function useIssues() {
  const [issues, setIssues] = useLocalStorage<Issue[]>(STORAGE_KEYS.ISSUES, initialIssues)

  const addIssue = useCallback(
    (issueData: Omit<Issue, "id" | "createdAt">) => {
      const maxId = Math.max(0, ...issues.map((i) => Number.parseInt(i.id.split("-")[1]) || 0))
      const newIssue: Issue = {
        ...issueData,
        id: `TSK-${String(maxId + 1).padStart(3, "0")}`,
        createdAt: new Date(),
      }
      setIssues((prev) => [...prev, newIssue])
      return newIssue
    },
    [issues, setIssues]
  )

  const updateIssue = useCallback(
    (id: string, updates: Partial<Issue>) => {
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === id ? { ...issue, ...updates } : issue
        )
      )
    },
    [setIssues]
  )

  const deleteIssue = useCallback(
    (id: string) => {
      setIssues((prev) => prev.filter((issue) => issue.id !== id))
    },
    [setIssues]
  )

  const getIssueById = useCallback(
    (id: string) => {
      return issues.find((issue) => issue.id === id)
    },
    [issues]
  )

  const filterIssues = useCallback(
    (filters: IssueFilters) => {
      return issues.filter((issue) => {
        if (filters.search) {
          const query = filters.search.toLowerCase()
          const matchesSearch =
            issue.title.toLowerCase().includes(query) ||
            issue.description.toLowerCase().includes(query)
          if (!matchesSearch) return false
        }
        if (filters.status && issue.status !== filters.status) return false
        if (filters.priority && issue.priority !== filters.priority) return false
        if (filters.assigneeId && issue.assigneeId !== filters.assigneeId) return false
        if (filters.sprintId && issue.sprintId !== filters.sprintId) return false
        return true
      })
    },
    [issues]
  )

  const getIssuesByStatus = useCallback(
    (status: Issue["status"]) => {
      return issues.filter((issue) => issue.status === status)
    },
    [issues]
  )

  const getIssuesBySprint = useCallback(
    (sprintId: string) => {
      return issues.filter((issue) => issue.sprintId === sprintId)
    },
    [issues]
  )

  const getIssuesByAssignee = useCallback(
    (assigneeId: string) => {
      return issues.filter((issue) => issue.assigneeId === assigneeId)
    },
    [issues]
  )

  const stats = useMemo(() => {
    return {
      total: issues.length,
      todo: issues.filter((i) => i.status === "todo").length,
      inProgress: issues.filter((i) => i.status === "in-progress").length,
      inReview: issues.filter((i) => i.status === "in-review").length,
      done: issues.filter((i) => i.status === "done").length,
      p0: issues.filter((i) => i.priority === "P0").length,
      p1: issues.filter((i) => i.priority === "P1").length,
    }
  }, [issues])

  return {
    issues,
    addIssue,
    updateIssue,
    deleteIssue,
    getIssueById,
    filterIssues,
    getIssuesByStatus,
    getIssuesBySprint,
    getIssuesByAssignee,
    stats,
  }
}


import { useCallback, useMemo } from "react"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { initialSprints } from "../data/initial-sprints"
import type { Sprint, SprintFormData } from "@/lib/types"

/**
 * Custom hook for managing sprints
 * Provides CRUD operations with localStorage persistence
 */
export function useSprints() {
  const [sprints, setSprints] = useLocalStorage<Sprint[]>(STORAGE_KEYS.SPRINTS, initialSprints)

  const addSprint = useCallback(
    (sprintData: Omit<Sprint, "id" | "createdAt">) => {
      const maxId = Math.max(0, ...sprints.map((s) => Number.parseInt(s.id.split("-")[1]) || 0))
      const newSprint: Sprint = {
        ...sprintData,
        id: `SPR-${String(maxId + 1).padStart(3, "0")}`,
        createdAt: new Date(),
      }
      setSprints((prev) => [...prev, newSprint])
      return newSprint
    },
    [sprints, setSprints]
  )

  const updateSprint = useCallback(
    (id: string, updates: Partial<Sprint>) => {
      setSprints((prev) =>
        prev.map((sprint) =>
          sprint.id === id ? { ...sprint, ...updates } : sprint
        )
      )
    },
    [setSprints]
  )

  const deleteSprint = useCallback(
    (id: string) => {
      setSprints((prev) => prev.filter((sprint) => sprint.id !== id))
    },
    [setSprints]
  )

  const getSprintById = useCallback(
    (id: string) => {
      return sprints.find((sprint) => sprint.id === id)
    },
    [sprints]
  )

  const getActiveSprint = useCallback(() => {
    return sprints.find((sprint) => sprint.status === "active")
  }, [sprints])

  const getSprintsByStatus = useCallback(
    (status: Sprint["status"]) => {
      return sprints.filter((sprint) => sprint.status === status)
    },
    [sprints]
  )

  const stats = useMemo(() => {
    return {
      total: sprints.length,
      planned: sprints.filter((s) => s.status === "planned").length,
      active: sprints.filter((s) => s.status === "active").length,
      completed: sprints.filter((s) => s.status === "completed").length,
    }
  }, [sprints])

  return {
    sprints,
    addSprint,
    updateSprint,
    deleteSprint,
    getSprintById,
    getActiveSprint,
    getSprintsByStatus,
    stats,
  }
}


import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { STORAGE_KEYS } from "@/lib/constants"
import type { ViewMode } from "@/lib/types"

/**
 * Custom hook for managing the current view mode
 * Persists view preference to localStorage
 */
export function useViewMode() {
  return useLocalStorage<ViewMode>(STORAGE_KEYS.VIEW_MODE, "issues")
}


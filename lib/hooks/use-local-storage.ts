import { useState, useEffect } from "react"

/**
 * Custom hook for syncing state with localStorage
 * Automatically serializes/deserializes JSON and handles Date objects
 * 
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 * @returns [value, setValue] tuple like useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isClient, setIsClient] = useState(false)

  // Initialize from localStorage on client side
  useEffect(() => {
    setIsClient(true)
    
    if (typeof window === "undefined") {
      return
    }
    
    try {
      const item = window.localStorage.getItem(key)
      
      if (item) {
        // Parse JSON and revive Date objects
        const parsedValue = JSON.parse(item, (key, value) => {
          // Check if value is a date string and convert to Date object
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            return new Date(value)
          }
          return value
        })
        setStoredValue(parsedValue)
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
    }
  }, [key])

  // Update localStorage when value changes
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to localStorage only on client side
      if (isClient && typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error)
    }
  }

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    if (!isClient || typeof window === "undefined") {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue, (key, value) => {
            if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
              return new Date(value)
            }
            return value
          })
          setStoredValue(newValue)
        } catch (error) {
          console.error(`Error syncing localStorage key "${key}":`, error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [key, isClient])

  return [storedValue, setValue]
}


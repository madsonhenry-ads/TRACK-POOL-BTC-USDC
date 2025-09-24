import type { WeeklyEntry } from "@/types/pool-data"

const STORAGE_KEY = "liquidity-pool-data"

export function saveWeeklyEntries(entries: WeeklyEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch (error) {
    console.error("Failed to save data to localStorage:", error)
  }
}

export function loadWeeklyEntries(): WeeklyEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to load data from localStorage:", error)
    return []
  }
}

export function addWeeklyEntry(entry: WeeklyEntry): WeeklyEntry[] {
  const entries = loadWeeklyEntries()
  const updatedEntries = [...entries, entry]
  saveWeeklyEntries(updatedEntries)
  return updatedEntries
}

export function updateWeeklyEntry(entryId: string, updates: Partial<WeeklyEntry>): WeeklyEntry[] {
  const entries = loadWeeklyEntries()
  const updatedEntries = entries.map((entry) => (entry.id === entryId ? { ...entry, ...updates } : entry))
  saveWeeklyEntries(updatedEntries)
  return updatedEntries
}

export function deleteWeeklyEntry(entryId: string): WeeklyEntry[] {
  const entries = loadWeeklyEntries()
  const updatedEntries = entries.filter((entry) => entry.id !== entryId)
  saveWeeklyEntries(updatedEntries)
  return updatedEntries
}

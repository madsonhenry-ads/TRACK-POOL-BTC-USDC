import type { WeeklyEntry } from "@/types/pool-data"
import { saveWeeklyEntries, loadWeeklyEntries } from "./local-storage"

export interface ExportData {
  version: string
  exportDate: string
  entries: WeeklyEntry[]
}

export function exportData(): string {
  const entries = loadWeeklyEntries()
  const exportData: ExportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    entries,
  }
  return JSON.stringify(exportData, null, 2)
}

export function downloadDataAsFile(): void {
  try {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `liquidity-pool-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Failed to export data:", error)
    throw new Error("Falha ao exportar dados")
  }
}

export function validateImportData(data: any): data is ExportData {
  if (!data || typeof data !== "object") {
    return false
  }

  if (!data.version || !data.exportDate || !Array.isArray(data.entries)) {
    return false
  }

  for (const entry of data.entries) {
    if (!entry.id || !entry.date || typeof entry.weekNumber !== "number") {
      continue // Skip invalid entries instead of failing completely
    }

    const requiredFields = [
      "currentLiquidity",
      "cumulativeFees",
      "contribution",
      "initialLiquidity",
      "weeklyFees",
      "priceVariation",
      "weeklyNetResult",
      "weeklyFeeReturnPercentage",
      "weeklyTotalReturnPercentage",
    ]

    for (const field of requiredFields) {
      if (typeof entry[field] !== "number" || !isFinite(entry[field])) {
        continue // Skip entries with invalid numeric fields
      }
    }
  }

  return true
}

export function importData(jsonString: string, replaceExisting = false): WeeklyEntry[] {
  try {
    const data = JSON.parse(jsonString)

    if (!validateImportData(data)) {
      throw new Error("Formato de dados inválido")
    }

    const validEntries = data.entries.filter((entry: any) => {
      if (!entry.id || !entry.date || typeof entry.weekNumber !== "number") {
        return false
      }

      const requiredFields = [
        "currentLiquidity",
        "cumulativeFees",
        "contribution",
        "initialLiquidity",
        "weeklyFees",
        "priceVariation",
        "weeklyNetResult",
        "weeklyFeeReturnPercentage",
        "weeklyTotalReturnPercentage",
      ]

      return requiredFields.every((field) => typeof entry[field] === "number" && isFinite(entry[field]))
    })

    let finalEntries: WeeklyEntry[] = validEntries

    if (!replaceExisting) {
      const existingEntries = loadWeeklyEntries()
      const existingIds = new Set(existingEntries.map((entry) => entry.id))

      // Only add entries that don't already exist
      const newEntries = validEntries.filter((entry: WeeklyEntry) => !existingIds.has(entry.id))
      finalEntries = [...existingEntries, ...newEntries]

      // Sort by week number
      finalEntries.sort((a, b) => a.weekNumber - b.weekNumber)
    }

    saveWeeklyEntries(finalEntries)
    return finalEntries
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Falha ao importar dados")
  }
}

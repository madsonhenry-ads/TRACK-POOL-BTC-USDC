"use client"

import { useState, useEffect } from "react"
import type { WeeklyEntry, PoolKPIs } from "@/types/pool-data"
import { loadWeeklyEntries, addWeeklyEntry, deleteWeeklyEntry, updateWeeklyEntry } from "@/lib/local-storage"
import { calculateWeeklyEntry, calculateKPIs } from "@/lib/pool-calculations"

export function usePoolData() {
  const [entries, setEntries] = useState<WeeklyEntry[]>([])
  const [kpis, setKPIs] = useState<PoolKPIs>({
    totalLiquidity: 0,
    totalInvested: 0,
    totalFeesGenerated: 0,
    netResult: 0,
    overallROI: 0,
  })

  useEffect(() => {
    const loadedEntries = loadWeeklyEntries()
    setEntries(loadedEntries)
    setKPIs(calculateKPIs(loadedEntries))
  }, [])

  const refreshData = () => {
    const loadedEntries = loadWeeklyEntries()
    setEntries(loadedEntries)
    setKPIs(calculateKPIs(loadedEntries))
  }

  const addEntry = (entryData: {
    date: string
    weekNumber: number
    cumulativeFees: number
    contribution: number
  }) => {
    const previousEntry = entries.length > 0 ? entries[entries.length - 1] : undefined
    const calculatedEntry = calculateWeeklyEntry(entryData, previousEntry)
    const updatedEntries = addWeeklyEntry(calculatedEntry)

    setEntries(updatedEntries)
    setKPIs(calculateKPIs(updatedEntries))
  }

  const deleteEntry = (entryId: string) => {
    const updatedEntries = deleteWeeklyEntry(entryId)
    setEntries(updatedEntries)
    setKPIs(calculateKPIs(updatedEntries))
  }

  const updateEntry = (entryId: string, harvestedFees: number) => {
    const entryToUpdate = entries.find((entry) => entry.id === entryId)
    if (!entryToUpdate) return

    const baseForFeeCalculation = entryToUpdate.initialLiquidity + entryToUpdate.contribution
    const feeReturnPercentage = baseForFeeCalculation > 0 ? (harvestedFees / baseForFeeCalculation) * 100 : 0

    const newCumulativeFees = entryToUpdate.cumulativeFees + harvestedFees

    const updatedEntry = {
      ...entryToUpdate,
      weeklyFees: harvestedFees,
      cumulativeFees: newCumulativeFees,
      currentLiquidity: entryToUpdate.currentLiquidity + harvestedFees,
      weeklyNetResult: harvestedFees, // Only fees since no price variation
      weeklyFeeReturnPercentage: feeReturnPercentage,
      weeklyTotalReturnPercentage: feeReturnPercentage,
    }

    const updatedEntries = updateWeeklyEntry(entryId, updatedEntry)

    // Recalculate all subsequent entries since liquidity changed
    const recalculatedEntries = recalculateSubsequentEntries(updatedEntries, entryId)

    setEntries(recalculatedEntries)
    setKPIs(calculateKPIs(recalculatedEntries))
  }

  const recalculateSubsequentEntries = (entries: WeeklyEntry[], updatedEntryId: string): WeeklyEntry[] => {
    const updatedIndex = entries.findIndex((entry) => entry.id === updatedEntryId)
    if (updatedIndex === -1) return entries

    const recalculatedEntries = [...entries]

    // Recalculate all entries after the updated one
    for (let i = updatedIndex + 1; i < recalculatedEntries.length; i++) {
      const previousEntry = recalculatedEntries[i - 1]
      const currentEntry = recalculatedEntries[i]

      const initialLiquidity = previousEntry.currentLiquidity
      const currentLiquidity = initialLiquidity + currentEntry.contribution + currentEntry.weeklyFees

      recalculatedEntries[i] = {
        ...currentEntry,
        initialLiquidity,
        currentLiquidity,
      }
    }

    return recalculatedEntries
  }

  return {
    entries,
    kpis,
    addEntry,
    updateEntry,
    deleteEntry,
    refreshData, // Added refreshData to return object
  }
}

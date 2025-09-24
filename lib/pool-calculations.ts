import type { WeeklyEntry } from "@/types/pool-data"

export function calculateWeeklyEntry(
  newEntry: {
    date: string
    weekNumber: number
    cumulativeFees: number
    contribution: number
  },
  previousEntry?: WeeklyEntry,
): WeeklyEntry {
  let initialLiquidity: number
  let currentLiquidity: number
  let weeklyFees: number

  if (!previousEntry) {
    initialLiquidity = 0
    weeklyFees = 0
    currentLiquidity = newEntry.contribution
  } else {
    initialLiquidity = previousEntry.currentLiquidity
    weeklyFees = 0
    currentLiquidity = initialLiquidity + newEntry.contribution
  }

  // Price variation/IL is 0 when only dealing with contributions and fees
  const priceVariation = 0

  const weeklyNetResult = weeklyFees + priceVariation

  const baseForFeeCalculation = initialLiquidity + newEntry.contribution
  const weeklyFeeReturnPercentage = baseForFeeCalculation > 0 ? (weeklyFees / baseForFeeCalculation) * 100 : 0

  const weeklyTotalReturnPercentage = baseForFeeCalculation > 0 ? (weeklyNetResult / baseForFeeCalculation) * 100 : 0

  return {
    ...newEntry,
    id: Date.now().toString(),
    initialLiquidity,
    currentLiquidity,
    weeklyFees,
    priceVariation,
    weeklyNetResult,
    weeklyFeeReturnPercentage,
    weeklyTotalReturnPercentage,
  }
}

export function calculateKPIs(entries: WeeklyEntry[]) {
  if (entries.length === 0) {
    return {
      totalLiquidity: 0,
      totalInvested: 0,
      totalFeesGenerated: 0,
      netResult: 0,
      overallROI: 0,
    }
  }

  const latestEntry = entries[entries.length - 1]
  const totalLiquidity = latestEntry.currentLiquidity
  const totalInvested = entries.reduce((sum, entry) => sum + entry.contribution, 0)
  const totalFeesGenerated = latestEntry.cumulativeFees
  const netResult = totalLiquidity - totalInvested
  const overallROI = totalInvested > 0 ? (netResult / totalInvested) * 100 : 0

  return {
    totalLiquidity,
    totalInvested,
    totalFeesGenerated,
    netResult,
    overallROI,
  }
}

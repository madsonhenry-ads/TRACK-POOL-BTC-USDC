export interface WeeklyEntry {
  id: string // unique ID, e.g., timestamp or uuid
  date: string // e.g., '2025-08-16'
  weekNumber: number

  // User-provided data
  currentLiquidity: number // Liquidez Atual (USD)
  cumulativeFees: number // Taxas Acumuladas (USD)
  contribution: number // Aporte/Retirada da semana (pode ser negativo)

  // Calculated data
  initialLiquidity: number // Liquidez no início da semana
  weeklyFees: number // Taxas geradas APENAS nesta semana
  priceVariation: number // Variação por IL / Preço
  weeklyNetResult: number // Resultado líquido da semana
  weeklyFeeReturnPercentage: number // Retorno % (apenas taxas)
  weeklyTotalReturnPercentage: number // Retorno % (total)
}

export interface PoolKPIs {
  totalLiquidity: number
  totalInvested: number
  totalFeesGenerated: number
  netResult: number
  overallROI: number
}

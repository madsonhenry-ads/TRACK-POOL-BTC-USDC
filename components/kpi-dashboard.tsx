import type { PoolKPIs } from "@/types/pool-data"
import { KPICard } from "./kpi-card"

interface KPIDashboardProps {
  kpis: PoolKPIs
}

export function KPIDashboard({ kpis }: KPIDashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Liquidity"
        value={formatCurrency(kpis.totalLiquidity)}
        description="Current total value of the pool"
      />

      <KPICard
        title="Total Invested"
        value={formatCurrency(kpis.totalInvested)}
        description="Sum of all contributions"
      />

      <KPICard
        title="Net Result (P/L)"
        value={formatCurrency(kpis.netResult)}
        description="Overall profit or loss"
        trend={kpis.netResult >= 0 ? "positive" : "negative"}
      />

      <KPICard
        title="Overall ROI"
        value={formatPercentage(kpis.overallROI)}
        description="Net result as % of total invested"
        trend={kpis.overallROI >= 0 ? "positive" : "negative"}
      />
    </div>
  )
}

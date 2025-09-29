"use client"

// 1. Importar o dynamic
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { KPIDashboard } from "@/components/kpi-dashboard"
// As importações dos modais serão removidas daqui
// import { ContributionModal } from "@/components/contribution-modal"
// import { HarvestModal } from "@/components/harvest-modal"
// import { DataManagementModal } from "@/components/data-management-modal"
import { LiquidityEvolutionChart } from "@/components/liquidity-evolution-chart"
import { WeeklyPerformanceChart } from "@/components/weekly-performance-chart"
import { HistoricalDataTable } from "@/components/historical-data-table"
import { ImpermanentLossCard } from "@/components/impermanent-loss-card"
import { usePoolData } from "@/hooks/use-pool-data"
import { Plus, TrendingUp, Database } from "lucide-react"

// 2. Substituir as importações estáticas por importações dinâmicas (client-side only)
const ContributionModal = dynamic(
  () => import("@/components/contribution-modal").then((mod) => mod.ContributionModal),
  {
    ssr: false,
    loading: () => (
      <Button className="flex items-center gap-2" disabled>
        <Plus className="h-4 w-4" />
        Add Weekly Record
      </Button>
    ),
  }
)

const HarvestModal = dynamic(
  () => import("@/components/harvest-modal").then((mod) => mod.HarvestModal),
  {
    ssr: false,
    loading: () => (
      <Button variant="outline" className="flex items-center gap-2 bg-transparent" disabled>
        <TrendingUp className="h-4 w-4" />
        Add Harvest Fee Weekly
      </Button>
    ),
  }
)

const DataManagementModal = dynamic(
  () => import("@/components/data-management-modal").then((mod) => mod.DataManagementModal),
  {
    ssr: false,
    loading: () => (
      <Button variant="outline" className="flex items-center gap-2 bg-transparent" disabled>
        <Database className="h-4 w-4" />
        Import/Export
      </Button>
    ),
  }
)

export default function HomePage() {
  const { entries, kpis, addEntry, updateEntry, deleteEntry, refreshData } = usePoolData()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Liquidity Pool Tracker: BTC/USDC</h1>
              <p className="text-muted-foreground mt-1">Track your DeFi pool performance and profitability</p>
            </div>
            {/* 3. O resto do seu componente permanece igual. Os modais funcionarão normalmente. */}
            <div className="flex gap-3">
              <ContributionModal onAddEntry={addEntry}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Weekly Record
                </Button>
              </ContributionModal>
              <HarvestModal onUpdateEntry={updateEntry} existingEntries={entries}>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <TrendingUp className="h-4 w-4" />
                  Add Harvest Fee Weekly
                </Button>
              </HarvestModal>
              <DataManagementModal onDataImported={refreshData}>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Database className="h-4 w-4" />
                  Import/Export
                </Button>
              </DataManagementModal>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* KPI Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          <KPIDashboard kpis={kpis} />
        </section>

        {/* Impermanent Loss Calculator Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>
          <ImpermanentLossCard totalLiquidity={kpis.totalLiquidity} />
        </section>

        {/* Charts Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Performance Charts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <LiquidityEvolutionChart entries={entries} />
            <WeeklyPerformanceChart entries={entries} />
          </div>
        </section>

        {/* Historical Data Table */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
          <HistoricalDataTable entries={entries} onDeleteEntry={deleteEntry} />
        </section>
      </main>
    </div>
  )
}

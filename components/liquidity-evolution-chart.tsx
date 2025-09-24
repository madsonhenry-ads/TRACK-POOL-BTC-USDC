"use client"

import type { WeeklyEntry } from "@/types/pool-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

interface LiquidityEvolutionChartProps {
  entries: WeeklyEntry[]
}

const chartConfig = {
  totalLiquidity: {
    label: "Total Liquidity",
    color: "hsl(var(--chart-1))",
  },
  totalInvested: {
    label: "Total Invested",
    color: "hsl(var(--chart-2))",
  },
}

export function LiquidityEvolutionChart({ entries }: LiquidityEvolutionChartProps) {
  const chartData = entries.map((entry, index) => {
    // Calculate cumulative invested up to this point
    const cumulativeInvested = entries.slice(0, index + 1).reduce((sum, e) => sum + e.contribution, 0)

    return {
      week: `W${entry.weekNumber}`,
      date: entry.date,
      totalLiquidity: entry.currentLiquidity,
      totalInvested: cumulativeInvested,
    }
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Evolution</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data available. Add your first weekly record to see the chart.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidity Evolution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [formatCurrency(value)]}
              labelFormatter={(label) => `Week ${label}`}
            />
            <Line
              type="monotone"
              dataKey="totalLiquidity"
              stroke="var(--color-totalLiquidity)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="totalInvested"
              stroke="var(--color-totalInvested)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

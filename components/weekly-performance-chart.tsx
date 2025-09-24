"use client"

import type { WeeklyEntry } from "@/types/pool-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface WeeklyPerformanceChartProps {
  entries: WeeklyEntry[]
}

const chartConfig = {
  feeReturn: {
    label: "Weekly Fee Return %",
    color: "hsl(var(--chart-3))",
  },
  totalReturn: {
    label: "Weekly Total Return %",
    color: "hsl(var(--chart-4))",
  },
}

export function WeeklyPerformanceChart({ entries }: WeeklyPerformanceChartProps) {
  const chartData = entries.map((entry) => ({
    week: `W${entry.weekNumber}`,
    date: entry.date,
    feeReturn: entry.weeklyFeeReturnPercentage,
    totalReturn: entry.weeklyTotalReturnPercentage,
  }))

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance %</CardTitle>
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
        <CardTitle>Weekly Performance %</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatPercentage} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [formatPercentage(value)]}
              labelFormatter={(label) => `Week ${label}`}
            />
            <Bar dataKey="feeReturn" fill="var(--color-feeReturn)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="totalReturn" fill="var(--color-totalReturn)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

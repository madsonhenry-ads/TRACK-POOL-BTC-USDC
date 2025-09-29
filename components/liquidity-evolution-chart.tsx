"use client"

import type { WeeklyEntry } from "@/types/pool-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

interface LiquidityEvolutionChartProps {
  entries: WeeklyEntry[]
}

const chartConfig = {
  weeklyNetResult: {
    label: "Weekly P/L",
    color: "hsl(var(--chart-1))",
  },
}

export function LiquidityEvolutionChart({ entries }: LiquidityEvolutionChartProps) {
  const aggregatedData = entries.reduce<Record<number, { week: string; date: string; weeklyNetResult: number; weekNumber: number }>>((acc, entry) => {
    const weekKey = entry.weekNumber;
    
    if (!acc[weekKey]) {
      acc[weekKey] = {
        weekNumber: weekKey,
        week: `W${weekKey}`,
        date: entry.date,
        weeklyNetResult: 0,
      }
    }
    
    acc[weekKey].weeklyNetResult += entry.weeklyNetResult;
    acc[weekKey].date = entry.date;

    return acc;
  }, {});

  const chartData = Object.values(aggregatedData).sort(
    (a, b) => a.weekNumber - b.weekNumber
  );

  const minChartWidth = Math.max(400, chartData.length * 60);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly P/L Evolution</CardTitle>
        </CardHeader> {/* <-- CORRIGIDO AQUI */}
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No data available. Add your first weekly record to see the chart.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly P/L Evolution</CardTitle>
      </CardHeader> {/* <-- CORRIGIDO AQUI */}
      <CardContent>
        <div className="w-full overflow-x-auto">
          <ChartContainer config={chartConfig} style={{ minWidth: `${minChartWidth}px` }} className="h-[300px]">
            <LineChart
              data={chartData}
              width={minChartWidth}
              height={300}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} domain={['auto', 'auto']} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatCurrency(value), "Weekly P/L"]}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return `Week ${payload[0].payload.weekNumber} (${payload[0].payload.date})`
                  }
                  return label
                }}
              />
              <Line
                type="monotone"
                dataKey="weeklyNetResult"
                stroke="var(--color-weeklyNetResult)"
                strokeWidth={3}
                dot={{ r: 5 }}
                connectNulls={true}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

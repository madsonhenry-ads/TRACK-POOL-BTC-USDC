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
    color: "hsl(var(--chart-3))", // Você pode querer usar --chart-1 ou --chart-2 para outra cor
  },
}

export function WeeklyPerformanceChart({ entries }: WeeklyPerformanceChartProps) {
  // A agregação é importante aqui também para evitar barras duplicadas na mesma semana
  const aggregatedData = entries.reduce<
    Record<number, { week: string; date: string; feeReturn: number; weekNumber: number }>
  >((acc, entry) => {
    const weekKey = entry.weekNumber
    if (!acc[weekKey]) {
      acc[weekKey] = {
        weekNumber: weekKey,
        week: `W${weekKey}`,
        date: entry.date,
        feeReturn: 0,
      }
    }
    // Para porcentagens, geralmente não somamos, mas pegamos a última ou a média.
    // Vamos assumir que queremos o valor da última entrada da semana.
    acc[weekKey].feeReturn = entry.weeklyFeeReturnPercentage
    acc[weekKey].date = entry.date

    return acc
  }, {})

  const chartData = Object.values(aggregatedData).sort((a, b) => a.weekNumber - b.weekNumber)

  // --- ALTERAÇÃO 1: CALCULAR LARGURA MÍNIMA DO GRÁFICO ---
  // Damos um pouco mais de espaço para as barras. 80px por semana é um bom começo.
  const minChartWidth = Math.max(400, chartData.length * 80)

  const formatPercentage = (value: number) => {
    // A porcentagem já vem como 0.24, então multiplicamos por 100
    const displayValue = value * 100
    return `${displayValue >= 0 ? "+" : ""}${displayValue.toFixed(2)}%`
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
        {/* --- ALTERAÇÃO 2: ADICIONAR O CONTÊINER DE ROLAGEM --- */}
        <div className="w-full overflow-x-auto">
          <ChartContainer config={chartConfig} style={{ minWidth: `${minChartWidth}px` }} className="h-[300px]">
            {/* --- ALTERAÇÃO 3: PASSAR LARGURA E ALTURA PARA O BARCHART --- */}
            <BarChart
              data={chartData}
              width={minChartWidth} // Largura dinâmica
              height={300} // Altura fixa
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={formatPercentage} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatPercentage(value), "Fee Return"]}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return `Week ${payload[0].payload.weekNumber}`
                  }
                  return label
                }}
              />
              <Bar dataKey="feeReturn" fill="var(--color-feeReturn)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

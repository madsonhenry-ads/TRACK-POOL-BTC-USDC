"use client"

import type { WeeklyEntry } from "@/types/pool-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"

interface HistoricalDataTableProps {
  entries: WeeklyEntry[]
  onDeleteEntry?: (entryId: string) => void
}

export function HistoricalDataTable({ entries, onDeleteEntry }: HistoricalDataTableProps) {
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

  const getPercentageBadgeVariant = (value: number) => {
    if (value > 0) return "default"
    if (value < 0) return "destructive"
    return "secondary"
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Data</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available. Add your first weekly record to see the history.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Liquidity (USD)</TableHead>
                <TableHead className="text-right">Weekly Contribution</TableHead>
                <TableHead className="text-right">Total Weekly P/L</TableHead>
                <TableHead className="text-right">Fee Return %</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">W{entry.weekNumber}</TableCell>
                  <TableCell>{format(new Date(entry.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(entry.currentLiquidity)}</TableCell>
                  <TableCell className="text-right font-mono">
                    <span className={entry.contribution >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(entry.contribution)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span className={entry.weeklyNetResult >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(entry.weeklyNetResult)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getPercentageBadgeVariant(entry.weeklyFeeReturnPercentage)}>
                      {formatPercentage(entry.weeklyFeeReturnPercentage)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {onDeleteEntry ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Registro</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o registro da semana {entry.weekNumber} (
                              {format(new Date(entry.date), "dd/MM/yyyy")})? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteEntry(entry.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

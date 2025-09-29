"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingDown, TrendingUp } from "lucide-react"

interface ImpermanentLossCardProps {
  totalLiquidity: number
}

export function ImpermanentLossCard({ totalLiquidity }: ImpermanentLossCardProps) {
  const [currentPoolPrice, setCurrentPoolPrice] = useState<string>("")
  const [isCalculated, setIsCalculated] = useState(false)

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

  const calculateImpermanentLoss = () => {
    const price = Number.parseFloat(currentPoolPrice)
    if (isNaN(price) || price <= 0) return null

    const difference = price - totalLiquidity
    const percentageDifference = totalLiquidity > 0 ? (difference / totalLiquidity) * 100 : 0

    return {
      absolute: difference,
      percentage: percentageDifference,
      isPositive: difference >= 0,
    }
  }

  const handleCalculate = () => {
    setIsCalculated(true)
  }

  const impermanentLoss = calculateImpermanentLoss()
  const canCalculate = currentPoolPrice && Number.parseFloat(currentPoolPrice) > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Impermanent Loss Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-price">Current Pool Price (USD)</Label>
          <Input
            id="current-price"
            type="number"
            step="0.01"
            placeholder="Enter current pool price"
            value={currentPoolPrice}
            onChange={(e) => {
              setCurrentPoolPrice(e.target.value)
              setIsCalculated(false)
            }}
          />
        </div>

        <Button onClick={handleCalculate} disabled={!canCalculate} className="w-full">
          Calculate Impermanent Loss
        </Button>

        {isCalculated && impermanentLoss && (
          <div className="space-y-3 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Liquidity</p>
                <p className="font-mono font-semibold">{formatCurrency(totalLiquidity)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Pool Price</p>
                <p className="font-mono font-semibold">{formatCurrency(Number.parseFloat(currentPoolPrice))}</p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {impermanentLoss.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p className="font-medium">
                  {impermanentLoss.isPositive ? "Divergent Loss (Positive)" : "Impermanent Loss"}
                </p>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-lg font-bold font-mono ${
                    impermanentLoss.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(Math.abs(impermanentLoss.absolute))}
                </p>
                <p className={`text-sm font-mono ${impermanentLoss.isPositive ? "text-green-600" : "text-red-600"}`}>
                  {formatPercentage(Math.abs(impermanentLoss.percentage))}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {impermanentLoss.isPositive
                ? "Your current pool price is higher than your total liquidity, indicating a divergent gain."
                : "Your current pool price is lower than your total liquidity, indicating impermanent loss."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

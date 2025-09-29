"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription, // 1. Importar DialogDescription
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ContributionModalProps {
  onAddEntry: (entry: {
    date: string
    weekNumber: number
    cumulativeFees: number
    contribution: number
  }) => void
  children: React.ReactNode
}

export function ContributionModal({ onAddEntry, children }: ContributionModalProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [contribution, setContribution] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      alert("Por favor, selecione uma data")
      return
    }

    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)

    onAddEntry({
      date: format(date, "yyyy-MM-dd"),
      weekNumber,
      cumulativeFees: 0,
      contribution: Number.parseFloat(contribution) || 0,
    })

    setContribution("")
    setDate(undefined)
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setContribution("")
      setDate(undefined)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Weekly Contribution</DialogTitle>
          {/* 2. Adicionar a descrição para corrigir o warning de acessibilidade */}
          <DialogDescription>
            Enter the date and amount for your weekly contribution.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            {/* 3. Manter a correção modal={false} */}
            <Popover modal={false}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              {/* 4. Adicionar o z-index para garantir a visibilidade */}
              <PopoverContent className="w-auto p-0 z-[60]" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  fromYear={2020}
                  toYear={2030}
                  captionLayout="dropdown-buttons"
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">Selecione a data da semana que deseja registrar</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution">Weekly Contribution (USD)</Label>
            <Input
              id="contribution"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the amount you're contributing this week. Use negative number for withdrawal.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!date || !contribution}>
              Save Contribution
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

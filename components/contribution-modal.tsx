"use client"

import type React from "react"
// 1. Remover useRef, não é mais necessário
import { useState } from "react" 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from "@/components/ui/popover"
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  // 2. Usar useState para armazenar o nó do DOM do DialogContent
  const [dialogContentNode, setDialogContentNode] = useState<HTMLDivElement | null>(null)

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
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setIsCalendarOpen(false) 
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* 3. Usar a função de state `setDialogContentNode` como a ref */}
      <DialogContent ref={setDialogContentNode} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Weekly Contribution</DialogTitle>
          <DialogDescription>
            Enter the date and amount for your weekly contribution.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} modal={false}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              
              {/* 4. Renderizar o Portal condicionalmente, somente quando o container existir */}
              {dialogContentNode && (
                <PopoverPortal container={dialogContentNode}>
                  <PopoverContent className="w-auto p-0 z-[60]" align="start" sideOffset={4}>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      fromYear={2020}
                      toYear={2030}
                      captionLayout="dropdown-buttons"
                    />
                  </PopoverContent>
                </PopoverPortal>
              )}
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

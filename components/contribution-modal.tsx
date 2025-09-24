"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  const [date, setDate] = useState<Date>(new Date())
  const [contribution, setContribution] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate week number (simple implementation - weeks since start of year)
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)

    onAddEntry({
      date: format(date, "yyyy-MM-dd"),
      weekNumber,
      cumulativeFees: 0, // No fees in contribution entry
      contribution: Number.parseFloat(contribution) || 0,
    })

    // Reset form
    setContribution("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Weekly Contribution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
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
            <Button type="submit">Save Contribution</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

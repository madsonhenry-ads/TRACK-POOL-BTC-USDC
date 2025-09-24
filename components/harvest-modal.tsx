"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WeeklyEntry } from "@/types/pool-data"

interface HarvestModalProps {
  onUpdateEntry: (entryId: string, harvestedFees: number) => void
  existingEntries: WeeklyEntry[]
  children: React.ReactNode
}

export function HarvestModal({ onUpdateEntry, existingEntries, children }: HarvestModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedEntryId, setSelectedEntryId] = useState("")
  const [harvestedFees, setHarvestedFees] = useState("")

  const availableEntries = existingEntries.filter((entry) => entry.weeklyFees === 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEntryId || !harvestedFees) return

    onUpdateEntry(selectedEntryId, Number.parseFloat(harvestedFees) || 0)

    // Reset form
    setSelectedEntryId("")
    setHarvestedFees("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Harvest Fee Weekly</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="week">Select Week to Update</Label>
            <Select value={selectedEntryId} onValueChange={setSelectedEntryId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a week to add fees" />
              </SelectTrigger>
              <SelectContent>
                {availableEntries.map((entry) => (
                  <SelectItem key={entry.id} value={entry.id}>
                    W{entry.weekNumber} - {entry.date} (${entry.currentLiquidity.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableEntries.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No weeks available for fee harvest. All weeks already have fees recorded.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvestedFees">Fees Harvested This Week (USD)</Label>
            <Input
              id="harvestedFees"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={harvestedFees}
              onChange={(e) => setHarvestedFees(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the amount of fees you harvested/collected for the selected week.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedEntryId || !harvestedFees}>
              Save Harvest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

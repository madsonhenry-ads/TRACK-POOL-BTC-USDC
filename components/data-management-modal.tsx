"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { downloadDataAsFile, importData } from "@/lib/data-import-export"
import { Download, AlertCircle, CheckCircle } from "lucide-react"

interface DataManagementModalProps {
  children: React.ReactNode
  onDataImported: () => void
}

export function DataManagementModal({ children, onDataImported }: DataManagementModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [replaceExisting, setReplaceExisting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      downloadDataAsFile()
      setImportStatus({
        type: "success",
        message: "Dados exportados com sucesso!",
      })
    } catch (error) {
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Erro ao exportar dados",
      })
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      importData(text, replaceExisting)

      setImportStatus({
        type: "success",
        message: replaceExisting
          ? "Dados importados e substituídos com sucesso!"
          : "Dados importados e mesclados com sucesso!",
      })

      onDataImported()

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Erro ao importar dados",
      })
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setImportStatus({ type: null, message: "" })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Dados</DialogTitle>
          <DialogDescription>Exporte seus dados para backup ou importe dados de outro navegador.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Section */}
          <div className="space-y-3">
            <h4 className="font-medium">Exportar Dados</h4>
            <p className="text-sm text-muted-foreground">
              Baixe todos os seus dados em formato JSON para backup ou transferência.
            </p>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
          </div>

          <Separator />

          {/* Import Section */}
          <div className="space-y-3">
            <h4 className="font-medium">Importar Dados</h4>
            <p className="text-sm text-muted-foreground">
              Selecione um arquivo JSON exportado anteriormente para importar os dados.
            </p>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="replace-existing"
                checked={replaceExisting}
                onCheckedChange={(checked) => setReplaceExisting(checked as boolean)}
              />
              <Label htmlFor="replace-existing" className="text-sm">
                Substituir dados existentes (caso contrário, mesclar)
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-input">Selecionar arquivo</Label>
              <Input
                id="file-input"
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Status Messages */}
          {importStatus.type && (
            <Alert className={importStatus.type === "error" ? "border-destructive" : "border-green-500"}>
              {importStatus.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertDescription>{importStatus.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

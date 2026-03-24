"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { NuevoProyectoDialog } from "./nuevo-proyecto-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectsHeaderProps {
  onCreated?: () => void
  onExportCSV?: () => void
  onExportExcel?: () => void
}

export function ProjectsHeader({ onCreated, onExportCSV, onExportExcel }: ProjectsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border/40 backdrop-blur-xl bg-background/60 sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onExportCSV}>Exportar CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={onExportExcel}>Exportar Excel (.xlsx)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </div>
        </div>
      </div>

      <NuevoProyectoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={() => onCreated?.()}
      />
    </>
  )
}

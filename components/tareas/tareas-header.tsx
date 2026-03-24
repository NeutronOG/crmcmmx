"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download, LayoutGrid, List } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TareasHeaderProps {
  vista: "board" | "list"
  onVistaChange: (vista: "board" | "list") => void
  onNuevaTarea: () => void
  onExportCSV?: () => void
  onExportExcel?: () => void
}

export function TareasHeader({ vista, onVistaChange, onNuevaTarea, onExportCSV, onExportExcel }: TareasHeaderProps) {
  return (
    <div className="border-b border-border/40 backdrop-blur-xl bg-background/60 sticky top-[72px] z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-background/50">
            <Button
              variant={vista === "board" ? "secondary" : "ghost"}
              size="sm"
              className="h-8"
              onClick={() => onVistaChange("board")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={vista === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8"
              onClick={() => onVistaChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
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
          <Button size="sm" className="gap-2" onClick={onNuevaTarea}>
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      </div>
    </div>
  )
}

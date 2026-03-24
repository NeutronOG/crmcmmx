"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ReportsHeaderProps {
  onExportCSV?: () => void
  onExportExcel?: () => void
}

export function ReportsHeader({ onExportCSV, onExportExcel }: ReportsHeaderProps) {
  return (
    <div className="border-b border-border/40 backdrop-blur-xl bg-background/60 sticky top-[72px] z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar Reporte
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportCSV}>Exportar CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={onExportExcel}>Exportar Excel (.xlsx)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

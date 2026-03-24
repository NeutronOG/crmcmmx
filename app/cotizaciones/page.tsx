"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { CotizacionesList } from "@/components/cotizaciones/cotizaciones-list"
import { CotizacionesStats } from "@/components/cotizaciones/cotizaciones-stats"
import { CotizacionesKanban } from "@/components/cotizaciones/cotizaciones-kanban"
import { NuevaCotizacionDialog } from "@/components/cotizaciones/nueva-cotizacion-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { getCotizaciones } from "@/lib/store"
import { exportToCSV } from "@/lib/export-csv"
import { exportCotizacionesToExcel } from "@/lib/excel-utils"
import { toast } from "sonner"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CotizacionesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey(k => k + 1)

  const handleExportCSV = async () => {
    const data = await getCotizaciones()
    exportToCSV(data, [
      { key: "cliente", label: "Cliente" },
      { key: "proyecto", label: "Proyecto" },
      { key: "valor", label: "Valor ($)" },
      { key: "estado", label: "Estado" },
      { key: "fechaCreacion", label: "Fecha Creación" },
      { key: "fechaVencimiento", label: "Fecha Vencimiento" },
      { key: "seguimientos", label: "Seguimientos" },
      { key: "responsable", label: "Responsable" },
    ], "cotizaciones")
    toast.success("Cotizaciones exportadas a CSV")
  }

  const handleExportExcel = async () => {
    const data = await getCotizaciones()
    exportCotizacionesToExcel(data)
    toast.success("Cotizaciones exportadas a Excel")
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-8 pb-20">
          <div className="flex items-end justify-between gap-4 pt-6 flex-wrap">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
                Cotizaciones y Seguimiento
              </h1>
              <p className="text-lg text-muted-foreground/90">
                Gestiona cotizaciones, negociaciones y seguimiento de propuestas
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportCSV}>Exportar CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel}>Exportar Excel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nueva Cotización
              </Button>
            </div>
          </div>

          <CotizacionesStats key={`stats-${refreshKey}`} />
          <CotizacionesKanban refreshKey={refreshKey} onRefresh={refresh} />
          <CotizacionesList refreshKey={refreshKey} onRefresh={refresh} />
        </main>
      </div>

      <NuevaCotizacionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={refresh}
      />
    </div>
  )
}

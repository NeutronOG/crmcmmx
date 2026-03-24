"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { NuevoNegocioList } from "@/components/nuevo-negocio/nuevo-negocio-list"
import { NuevoNegocioStats } from "@/components/nuevo-negocio/nuevo-negocio-stats"
import { NuevoNegocioFilters } from "@/components/nuevo-negocio/nuevo-negocio-filters"
import { getLeads, updateLead, deleteLead } from "@/lib/store"
import type { Lead } from "@/lib/store"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export-csv"
import { exportLeadesToExcel } from "@/lib/excel-utils"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function NuevoNegocioPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("all")

  const loadLeads = useCallback(async () => {
    setLoading(true)
    const data = await getLeads()
    // Nuevo negocio only shows active pipeline (not Ganado/Perdido)
    setLeads(data.filter(l => !["Ganado", "Perdido"].includes(l.estado)))
    setLoading(false)
  }, [])

  useEffect(() => { loadLeads() }, [loadLeads])

  const handleCambiarEstado = async (id: string, estado: Lead["estado"]) => {
    await updateLead(id, { estado })
    toast.success(`Movido a ${estado}`)
    await loadLeads()
  }

  const handleEliminar = async (id: string) => {
    await deleteLead(id)
    toast.success("Oportunidad eliminada")
    await loadLeads()
  }

  const leadsFiltrados = useMemo(() => {
    return leads.filter((l) => {
      if (busqueda) {
        const q = busqueda.toLowerCase()
        const match =
          l.nombre.toLowerCase().includes(q) ||
          l.empresa.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.responsable.toLowerCase().includes(q) ||
          l.origen.toLowerCase().includes(q)
        if (!match) return false
      }
      if (filtroEstado !== "all" && l.estado !== filtroEstado) return false
      return true
    })
  }, [leads, busqueda, filtroEstado])

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-8 pb-20">
          <div className="flex items-end justify-between gap-4 pt-6 flex-wrap">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
                Nuevo Negocio / Branding
              </h1>
              <p className="text-lg text-muted-foreground/90">
                Gestiona oportunidades de negocio y proyectos de branding
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  exportToCSV(leads, [
                    { key: "nombre", label: "Nombre" },
                    { key: "empresa", label: "Empresa" },
                    { key: "email", label: "Email" },
                    { key: "estado", label: "Estado" },
                    { key: "valorEstimado", label: "Valor Estimado" },
                    { key: "responsable", label: "Responsable" },
                  ], "oportunidades")
                  toast.success("Exportado a CSV")
                }}>Exportar CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  exportLeadesToExcel(leads, "oportunidades_negocio")
                  toast.success("Exportado a Excel")
                }}>Exportar Excel (.xlsx)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <NuevoNegocioStats />
          <NuevoNegocioFilters
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            filtroEstado={filtroEstado}
            onFiltroEstadoChange={setFiltroEstado}
          />
          <NuevoNegocioList
            leads={leadsFiltrados}
            loading={loading}
            onCambiarEstado={handleCambiarEstado}
            onEliminar={handleEliminar}
          />
        </main>
      </div>
    </div>
  )
}

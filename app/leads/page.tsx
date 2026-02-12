"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { LeadsHeader } from "@/components/leads/leads-header"
import { LeadsKanban } from "@/components/leads/leads-kanban"
import { LeadsFilters, type LeadQuickFilter } from "@/components/leads/leads-filters"
import { LiquidBackground } from "@/components/liquid-background"
import { getLeads, updateLead, deleteLead } from "@/lib/store"
import type { Lead } from "@/lib/store"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export-csv"

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [quickFilter, setQuickFilter] = useState<LeadQuickFilter>("todos")

  const loadLeads = useCallback(async () => {
    setLoading(true)
    const data = await getLeads()
    setLeads(data)
    setLoading(false)
  }, [])

  useEffect(() => { loadLeads() }, [loadLeads])

  const handleCambiarEstado = async (id: string, estado: Lead["estado"]) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, estado } : l))
    await updateLead(id, { estado })
    toast.success(`Lead movido a ${estado}`)
    await loadLeads()
  }

  const handleEliminar = async (id: string) => {
    await deleteLead(id)
    toast.success("Lead eliminado")
    await loadLeads()
  }

  const leadsFiltrados = useMemo(() => {
    const ahora = new Date()
    const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    return leads.filter((l) => {
      // Text search
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
      // Quick filters
      if (quickFilter === "alto_score") return l.probabilidad >= 90
      if (quickFilter === "nuevos_24h") return l.fechaCreacion >= hace24h
      if (quickFilter === "alta_prioridad") return l.valorEstimado >= 50000 || l.probabilidad >= 70
      return true
    })
  }, [leads, busqueda, quickFilter])

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <LeadsHeader onCreated={loadLeads} onExport={() => {
            exportToCSV(leads, [
              { key: "nombre", label: "Nombre" },
              { key: "empresa", label: "Empresa" },
              { key: "email", label: "Email" },
              { key: "telefono", label: "Teléfono" },
              { key: "origen", label: "Origen" },
              { key: "estado", label: "Estado" },
              { key: "valorEstimado", label: "Valor Estimado" },
              { key: "probabilidad", label: "Probabilidad %" },
              { key: "responsable", label: "Responsable" },
              { key: "fechaCreacion", label: "Fecha Creación" },
              { key: "notas", label: "Notas" },
            ], "leads")
            toast.success("Leads exportados")
          }} />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
              Gestión de Leads
            </h1>
            <p className="text-lg text-muted-foreground/90">Captura, califica y convierte prospectos automáticamente</p>
          </div>

          <LeadsFilters
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
          />
          <LeadsKanban
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

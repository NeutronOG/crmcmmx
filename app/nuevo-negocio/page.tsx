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
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Nuevo Negocio / Branding
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Gestiona oportunidades de negocio y proyectos de branding
            </p>
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

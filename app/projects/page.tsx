"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsBoard } from "@/components/projects/projects-board"
import { ProjectsFilters, type ProjectQuickFilter } from "@/components/projects/projects-filters"
import { LiquidBackground } from "@/components/liquid-background"
import { getProyectos, updateProyecto, deleteProyecto } from "@/lib/store"
import type { Proyecto } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export-csv"

export default function ProjectsPage() {
  const { usuario } = useAuth()
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [quickFilter, setQuickFilter] = useState<ProjectQuickFilter>("todos")

  const loadProyectos = useCallback(async () => {
    setLoading(true)
    const data = await getProyectos()
    setProyectos(data)
    setLoading(false)
  }, [])

  useEffect(() => { loadProyectos() }, [loadProyectos])

  const handleCambiarEstado = async (id: string, estado: Proyecto["estado"]) => {
    await updateProyecto(id, { estado, progreso: estado === "Completado" ? 100 : undefined })
    toast.success(`Proyecto movido a ${estado}`)
    await loadProyectos()
  }

  const handleEliminar = async (id: string) => {
    await deleteProyecto(id)
    toast.success("Proyecto eliminado")
    await loadProyectos()
  }

  const proyectosFiltrados = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0]
    return proyectos.filter((p) => {
      // Text search
      if (busqueda) {
        const q = busqueda.toLowerCase()
        const match =
          p.nombre.toLowerCase().includes(q) ||
          p.cliente.toLowerCase().includes(q) ||
          p.tipo.toLowerCase().includes(q) ||
          p.responsable.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q)
        if (!match) return false
      }
      // Quick filters
      if (quickFilter === "en_progreso") return p.estado === "En Progreso"
      if (quickFilter === "completados") return p.estado === "Completado"
      if (quickFilter === "atrasados") {
        return p.fechaEntrega && p.fechaEntrega < hoy && p.estado !== "Completado"
      }
      if (quickFilter === "mis_proyectos") {
        return usuario ? p.responsable.toLowerCase().includes(usuario.nombre.toLowerCase()) : false
      }
      return true
    })
  }, [proyectos, busqueda, quickFilter, usuario])

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <ProjectsHeader onCreated={loadProyectos} onExport={() => {
            exportToCSV(proyectos, [
              { key: "nombre", label: "Nombre" },
              { key: "cliente", label: "Cliente" },
              { key: "tipo", label: "Tipo" },
              { key: "estado", label: "Estado" },
              { key: "progreso", label: "Progreso %" },
              { key: "presupuesto", label: "Presupuesto" },
              { key: "responsable", label: "Responsable" },
              { key: "fechaInicio", label: "Fecha Inicio" },
              { key: "fechaEntrega", label: "Fecha Entrega" },
              { key: "descripcion", label: "Descripción" },
            ], "proyectos")
            toast.success("Proyectos exportados")
          }} />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Gestión de Proyectos
            </h1>
            <p className="text-lg text-muted-foreground/90">Administra proyectos, tareas y workflows de aprobación</p>
          </div>

          <ProjectsFilters
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            quickFilter={quickFilter}
            onQuickFilterChange={setQuickFilter}
          />
          <ProjectsBoard
            proyectos={proyectosFiltrados}
            loading={loading}
            onCambiarEstado={handleCambiarEstado}
            onEliminar={handleEliminar}
          />
        </main>
      </div>
    </div>
  )
}

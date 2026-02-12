"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { TareasHeader } from "@/components/tareas/tareas-header"
import { TareasBoard } from "@/components/tareas/tareas-board"
import { TareasList } from "@/components/tareas/tareas-list"
import { TareasFilters } from "@/components/tareas/tareas-filters"
import { TareaDetailDialog } from "@/components/tareas/tarea-detail-dialog"
import { NuevaTareaDialog } from "@/components/tareas/nueva-tarea-dialog"
import { EditarTareaDialog } from "@/components/tareas/editar-tarea-dialog"
import { useAuth } from "@/components/auth-provider"
import { LiquidBackground } from "@/components/liquid-background"
import { getTareas, getTareaById, updateTarea, deleteTarea, recalcularProgresoProyecto } from "@/lib/store"
import type { Tarea } from "@/lib/store"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export-csv"

export default function TareasPage() {
  const { isAdmin } = useAuth()
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [vista, setVista] = useState<"board" | "list">("board")
  const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [nuevaTareaOpen, setNuevaTareaOpen] = useState(false)
  const [editTarea, setEditTarea] = useState<Tarea | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [filtroPrioridad, setFiltroPrioridad] = useState("todas")
  const [filtroAsignado, setFiltroAsignado] = useState("todos")

  const loadTareas = useCallback(async () => {
    const data = await getTareas()
    setTareas(data)
  }, [])

  useEffect(() => {
    loadTareas()
  }, [loadTareas])

  const asignados = useMemo(() => {
    const set = new Set(tareas.map((t) => t.asignado).filter(Boolean))
    return Array.from(set).sort()
  }, [tareas])

  const tareasFiltradas = useMemo(() => {
    return tareas.filter((t) => {
      if (busqueda) {
        const q = busqueda.toLowerCase()
        const match =
          t.titulo.toLowerCase().includes(q) ||
          t.descripcion.toLowerCase().includes(q) ||
          t.cliente.toLowerCase().includes(q) ||
          t.proyecto.toLowerCase().includes(q) ||
          t.asignado.toLowerCase().includes(q) ||
          t.etiquetas.some((e) => e.toLowerCase().includes(q))
        if (!match) return false
      }
      if (filtroPrioridad !== "todas" && t.prioridad !== filtroPrioridad) return false
      if (filtroAsignado !== "todos" && t.asignado !== filtroAsignado) return false
      return true
    })
  }, [tareas, busqueda, filtroPrioridad, filtroAsignado])

  const handleVer = (tarea: Tarea) => {
    setSelectedTarea(tarea)
    setDetailOpen(true)
  }

  const handleEditar = (tarea: Tarea) => {
    if (isAdmin) {
      setEditTarea(tarea)
      setEditOpen(true)
    } else {
      toast.error("Solo el administrador puede editar tareas")
    }
  }

  const handleEliminar = async (id: string) => {
    await deleteTarea(id)
    toast.success("Tarea eliminada")
    await loadTareas()
  }

  const handleCambiarEstado = async (id: string, estado: Tarea["estado"]) => {
    const tarea = tareas.find(t => t.id === id)
    await updateTarea(id, {
      estado,
      fechaCompletada: estado === "Completada" ? new Date().toISOString().split("T")[0] : "",
    })
    if (tarea?.proyecto) {
      const nuevoProgreso = await recalcularProgresoProyecto(tarea.proyecto)
      toast.success(`Tarea movida a ${estado} — Proyecto al ${nuevoProgreso}%`)
    } else {
      toast.success(`Tarea movida a ${estado}`)
    }
    await loadTareas()
  }

  const handleDetailUpdate = async () => {
    await loadTareas()
    // Refresh the selected tarea with latest data
    if (selectedTarea) {
      const updated = await getTareaById(selectedTarea.id)
      if (updated) setSelectedTarea(updated)
    }
  }

  const totalPendientes = tareas.filter((t) => t.estado === "Pendiente").length
  const totalEnProgreso = tareas.filter((t) => t.estado === "En Progreso").length
  const totalEnRevision = tareas.filter((t) => t.estado === "En Revisión").length
  const totalCompletadas = tareas.filter((t) => t.estado === "Completada").length

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <TareasHeader
          vista={vista}
          onVistaChange={setVista}
          onNuevaTarea={() => setNuevaTareaOpen(true)}
          onExport={() => {
            exportToCSV(tareas, [
              { key: "titulo", label: "Título" },
              { key: "descripcion", label: "Descripción" },
              { key: "proyecto", label: "Proyecto" },
              { key: "cliente", label: "Cliente" },
              { key: "asignado", label: "Asignado" },
              { key: "estado", label: "Estado" },
              { key: "prioridad", label: "Prioridad" },
              { key: "fechaCreacion", label: "Fecha Creación" },
              { key: "fechaVencimiento", label: "Fecha Vencimiento" },
              { key: "etiquetas", label: "Etiquetas" },
            ], "tareas")
            toast.success("Tareas exportadas")
          }}
        />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
              Gestión de Tareas
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Administra tareas, asigna responsables y sube evidencias
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-slate-600">{totalPendientes}</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600">{totalEnProgreso}</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">En Revisión</p>
              <p className="text-2xl font-bold text-yellow-600">{totalEnRevision}</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{totalCompletadas}</p>
            </div>
          </div>

          <TareasFilters
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            filtroPrioridad={filtroPrioridad}
            onFiltroPrioridadChange={setFiltroPrioridad}
            filtroAsignado={filtroAsignado}
            onFiltroAsignadoChange={setFiltroAsignado}
            asignados={asignados}
          />

          {vista === "board" ? (
            <TareasBoard
              tareas={tareasFiltradas}
              onVer={handleVer}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onCambiarEstado={handleCambiarEstado}
            />
          ) : (
            <TareasList
              tareas={tareasFiltradas}
              onVer={handleVer}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
              onCambiarEstado={handleCambiarEstado}
            />
          )}
        </main>
      </div>

      <TareaDetailDialog
        tarea={selectedTarea}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdate={handleDetailUpdate}
      />

      <NuevaTareaDialog
        open={nuevaTareaOpen}
        onOpenChange={setNuevaTareaOpen}
        onCreated={loadTareas}
      />

      <EditarTareaDialog
        tarea={editTarea}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={loadTareas}
      />
    </div>
  )
}

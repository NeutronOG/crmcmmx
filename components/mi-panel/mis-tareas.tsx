"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react"
import { getTareasByUsuario, updateTarea, recalcularProgresoProyecto } from "@/lib/store"
import type { Tarea } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

interface MisTareasProps {
  onSelectTarea: (tarea: Tarea) => void
}

export function MisTareas({ onSelectTarea }: MisTareasProps) {
  const { usuario } = useAuth()
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<"todas" | "Pendiente" | "En Progreso" | "En Revisión">("todas")

  const loadTareas = useCallback(async () => {
    if (!usuario) return
    const data = await getTareasByUsuario(usuario.nombre)
    setTareas(data.filter(t => t.estado !== "Completada"))
    setLoading(false)
  }, [usuario])

  useEffect(() => {
    loadTareas()
  }, [loadTareas])

  const handleCambiarEstado = async (id: string, nuevoEstado: Tarea["estado"]) => {
    const tarea = tareas.find(t => t.id === id)
    await updateTarea(id, {
      estado: nuevoEstado,
      fechaCompletada: nuevoEstado === "Completada" ? new Date().toISOString().split("T")[0] : "",
    })
    if (tarea?.proyecto) {
      const nuevoProgreso = await recalcularProgresoProyecto(tarea.proyecto)
      toast.success(`Tarea movida a ${nuevoEstado} — Proyecto al ${nuevoProgreso}%`)
    } else {
      toast.success(`Tarea movida a ${nuevoEstado}`)
    }
    await loadTareas()
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta": return "satin-red-bg satin-red border satin-red-border"
      case "Media": return "satin-yellow-bg satin-yellow border satin-yellow-border"
      case "Baja": return "bg-white/5 text-white/50 border-white/10"
      default: return ""
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Pendiente": return <Clock className="size-3.5 text-white/40" />
      case "En Progreso": return <AlertTriangle className="size-3.5 satin-yellow" />
      case "En Revisión": return <CheckCircle2 className="size-3.5 satin-yellow" />
      default: return null
    }
  }

  const tareasFiltradas = filtro === "todas" ? tareas : tareas.filter(t => t.estado === filtro)

  const contadores = {
    todas: tareas.length,
    Pendiente: tareas.filter(t => t.estado === "Pendiente").length,
    "En Progreso": tareas.filter(t => t.estado === "En Progreso").length,
    "En Revisión": tareas.filter(t => t.estado === "En Revisión").length,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl satin-yellow-bg flex items-center justify-center">
          <ClipboardCheck className="size-5 satin-yellow" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mis Tareas</h2>
          <p className="text-sm text-muted-foreground">{tareas.length} tarea{tareas.length !== 1 ? "s" : ""} pendiente{tareas.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["todas", "Pendiente", "En Progreso", "En Revisión"] as const).map((f) => (
          <Button
            key={f}
            variant={filtro === f ? "default" : "outline"}
            size="sm"
            className={`rounded-full text-xs ${filtro === f ? "liquid-gradient border-white/20" : "glass-card border-white/10 hover:bg-white/10"}`}
            onClick={() => setFiltro(f)}
          >
            {f === "todas" ? "Todas" : f} ({contadores[f]})
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-muted-foreground">Cargando tareas...</div>
        </div>
      ) : tareasFiltradas.length === 0 ? (
        <Card className="glass-card p-8 rounded-xl text-center">
          <ClipboardCheck className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">
            {filtro === "todas" ? "No tienes tareas pendientes" : `No tienes tareas en "${filtro}"`}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {tareasFiltradas.map((tarea) => (
            <Card
              key={tarea.id}
              className="glass-card p-4 rounded-xl hover:scale-[1.005] transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectTarea(tarea)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getEstadoIcon(tarea.estado)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{tarea.titulo}</p>
                    <Badge variant="outline" className={`rounded-full text-[10px] shrink-0 ${getPrioridadColor(tarea.prioridad)}`}>
                      {tarea.prioridad}
                    </Badge>
                  </div>
                  {tarea.descripcion && (
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{tarea.descripcion}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {tarea.proyecto && <span>{tarea.proyecto}</span>}
                    {tarea.cliente && <span>&middot; {tarea.cliente}</span>}
                    {tarea.fechaVencimiento && (
                      <span className="ml-auto flex items-center gap-1">
                        <Clock className="size-3" />
                        {tarea.fechaVencimiento}
                      </span>
                    )}
                  </div>
                  {tarea.evidencias.length > 0 && (
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {tarea.evidencias.length} evidencia{tarea.evidencias.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>

              <div className="flex gap-1.5 mt-3 pt-3 border-t border-white/5">
                {tarea.estado === "Pendiente" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 rounded-full glass-card border-white/10 hover:bg-white/10 hover:satin-blue"
                    onClick={(e) => { e.stopPropagation(); handleCambiarEstado(tarea.id, "En Progreso") }}
                  >
                    Iniciar
                  </Button>
                )}
                {tarea.estado === "En Progreso" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 rounded-full glass-card border-white/10 hover:satin-yellow-bg hover:satin-yellow"
                    onClick={(e) => { e.stopPropagation(); handleCambiarEstado(tarea.id, "En Revisión") }}
                  >
                    Enviar a Revisión
                  </Button>
                )}
                {tarea.estado === "En Revisión" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 rounded-full glass-card border-white/10 hover:satin-green-bg hover:satin-green"
                    onClick={(e) => { e.stopPropagation(); handleCambiarEstado(tarea.id, "Completada") }}
                  >
                    Marcar Completada
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

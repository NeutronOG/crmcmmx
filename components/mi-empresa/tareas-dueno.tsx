"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { getTareasByUsuario, updateTarea, recalcularProgresoProyecto } from "@/lib/store"
import type { Tarea } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

export function TareasDueno() {
  const { usuario } = useAuth()
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [filtro, setFiltro] = useState<"todas" | "Pendiente" | "En Progreso" | "En Revisión">("todas")

  const loadTareas = async () => {
    if (!usuario) return
    const data = await getTareasByUsuario(usuario.nombre)
    setTareas(data.filter((t) => t.estado !== "Completada"))
  }

  useEffect(() => {
    loadTareas()
  }, [usuario])

  const handleCambiarEstado = async (id: string, nuevoEstado: Tarea["estado"]) => {
    await updateTarea(id, { estado: nuevoEstado })
    const tarea = tareas.find((t) => t.id === id)
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

  const tareasFiltradas = filtro === "todas" ? tareas : tareas.filter((t) => t.estado === filtro)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl satin-yellow-bg flex items-center justify-center">
          <ClipboardCheck className="size-5 satin-yellow" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mis Tareas</h2>
          <p className="text-sm text-muted-foreground">
            {tareas.length} tarea{tareas.length !== 1 ? "s" : ""} pendiente{tareas.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["todas", "Pendiente", "En Progreso", "En Revisión"] as const).map((f) => (
          <Button
            key={f}
            variant={filtro === f ? "default" : "outline"}
            size="sm"
            className={`text-xs h-8 rounded-full ${filtro === f ? "bg-white/15 border-white/20" : "border-white/10"}`}
            onClick={() => setFiltro(f)}
          >
            {f === "todas" ? "Todas" : f} ({f === "todas" ? tareas.length : tareas.filter((t) => t.estado === f).length})
          </Button>
        ))}
      </div>

      {tareasFiltradas.length === 0 ? (
        <Card className="glass-card p-8 rounded-xl text-center">
          <p className="text-muted-foreground">No hay tareas en esta categoría</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {tareasFiltradas.map((tarea) => (
            <Card key={tarea.id} className="glass-card p-4 rounded-xl hover:border-white/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getEstadoIcon(tarea.estado)}
                    <span className="font-medium text-sm">{tarea.titulo}</span>
                    <Badge variant="outline" className={`text-[10px] rounded-full ${getPrioridadColor(tarea.prioridad)}`}>
                      {tarea.prioridad}
                    </Badge>
                  </div>
                  {tarea.descripcion && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{tarea.descripcion}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {tarea.proyecto && <span>Proyecto: {tarea.proyecto}</span>}
                    {tarea.fechaVencimiento && (
                      <span>Límite: {new Date(tarea.fechaVencimiento).toLocaleDateString("es-MX")}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {tarea.estado === "Pendiente" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 rounded-full border-white/10"
                      onClick={() => handleCambiarEstado(tarea.id, "En Progreso")}
                    >
                      Iniciar
                    </Button>
                  )}
                  {tarea.estado !== "Completada" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 rounded-full border-white/10 hover:satin-green-bg hover:satin-green"
                      onClick={() => handleCambiarEstado(tarea.id, "Completada")}
                    >
                      Completar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

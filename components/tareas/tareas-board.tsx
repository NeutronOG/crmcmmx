"use client"

import { useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { TareaCard } from "./tarea-card"
import { usePipelineDrag } from "@/hooks/use-pipeline-drag"
import type { Tarea } from "@/lib/store"

interface TareasBoardProps {
  tareas: Tarea[]
  onVer: (tarea: Tarea) => void
  onEditar: (tarea: Tarea) => void
  onEliminar: (id: string) => void
  onCambiarEstado: (id: string, estado: Tarea["estado"]) => void
}

const columnas = [
  { id: "Pendiente" as const, label: "Pendiente", color: "satin-slate-bg" },
  { id: "En Progreso" as const, label: "En Progreso", color: "satin-blue-solid" },
  { id: "En Revisión" as const, label: "En Revisión", color: "satin-yellow-solid" },
  { id: "Completada" as const, label: "Completada", color: "satin-green-bg" },
]

export function TareasBoard({ tareas, onVer, onEditar, onEliminar, onCambiarEstado }: TareasBoardProps) {
  const handleChangeStage = useCallback((id: string, stage: string) => {
    onCambiarEstado(id, stage as Tarea["estado"])
  }, [onCambiarEstado])

  const {
    draggingId,
    dragOverStage,
    registerColumn,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    onTouchStart,
  } = usePipelineDrag({
    items: tareas,
    getId: (t) => t.id,
    getStage: (t) => t.estado,
    onChangeStage: handleChangeStage,
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columnas.map((columna) => {
        const tareasColumna = tareas.filter((t) => t.estado === columna.id)
        return (
          <div
            key={columna.id}
            ref={(el) => registerColumn(columna.id, el)}
            className={`space-y-4 rounded-2xl p-1 transition-all duration-200 ${
              dragOverStage === columna.id
                ? "bg-primary/10 ring-2 ring-primary/30 scale-[1.02]"
                : ""
            }`}
            onDragOver={(e) => onDragOver(e, columna.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, columna.id)}
          >
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${columna.color}`} />
                  <h3 className="font-semibold">{columna.label}</h3>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {tareasColumna.length}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {tareasColumna.map((tarea) => (
                <div
                  key={tarea.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, tarea.id)}
                  onDragEnd={onDragEnd}
                  onTouchStart={(e) => onTouchStart(e, tarea.id)}
                  className={`transition-all duration-300 select-none ${
                    draggingId === tarea.id ? "opacity-40 scale-95" : ""
                  }`}
                >
                  <TareaCard
                    tarea={tarea}
                    onVer={onVer}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                    onCambiarEstado={onCambiarEstado}
                  />
                </div>
              ))}
              {tareasColumna.length === 0 && (
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                  dragOverStage === columna.id
                    ? "border-primary/50 bg-primary/5"
                    : "border-white/10"
                }`}>
                  <p className="text-sm text-muted-foreground">Sin tareas</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

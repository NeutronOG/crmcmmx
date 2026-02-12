"use client"

import { useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, DollarSign, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePipelineDrag } from "@/hooks/use-pipeline-drag"
import type { Proyecto } from "@/lib/store"

const stages = [
  { id: "Planificación", label: "Planificación", color: "satin-blue-solid" },
  { id: "En Progreso", label: "En Progreso", color: "satin-purple-solid" },
  { id: "En Revisión", label: "Revisión", color: "satin-yellow-solid" },
  { id: "Completado", label: "Completados", color: "satin-green-bg" },
  { id: "Pausado", label: "Pausados", color: "satin-red-solid" },
]

interface ProjectsBoardProps {
  proyectos: Proyecto[]
  loading?: boolean
  onCambiarEstado: (id: string, estado: Proyecto["estado"]) => void
  onEliminar: (id: string) => void
}

export function ProjectsBoard({ proyectos, loading, onCambiarEstado, onEliminar }: ProjectsBoardProps) {
  const handleChangeStage = useCallback((id: string, stage: string) => {
    onCambiarEstado(id, stage as Proyecto["estado"])
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
    items: proyectos,
    getId: (p) => p.id,
    getStage: (p) => p.estado,
    onChangeStage: handleChangeStage,
  })

  const grouped: Record<string, Proyecto[]> = {}
  for (const s of stages) grouped[s.id] = []
  for (const p of proyectos) {
    if (grouped[p.estado]) grouped[p.estado].push(p)
  }

  if (loading) {
    return <div className="text-center py-12"><div className="animate-pulse text-muted-foreground">Cargando proyectos...</div></div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stages.map((stage) => (
        <div
          key={stage.id}
          ref={(el) => registerColumn(stage.id, el)}
          className={`space-y-4 rounded-2xl p-1 transition-all duration-200 ${
            dragOverStage === stage.id
              ? "bg-primary/10 ring-2 ring-primary/30 scale-[1.02]"
              : ""
          }`}
          onDragOver={(e) => onDragOver(e, stage.id)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, stage.id)}
        >
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-semibold">{stage.label}</h3>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {grouped[stage.id]?.length || 0}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {grouped[stage.id]?.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => onDragStart(e, p.id)}
                onDragEnd={onDragEnd}
                onTouchStart={(e) => onTouchStart(e, p.id)}
                className={`transition-all duration-300 select-none cursor-grab active:cursor-grabbing ${
                  draggingId === p.id ? "opacity-40 scale-95" : ""
                }`}
              >
                <Card className="glass-card p-4 rounded-xl space-y-3 hover:scale-[1.02] transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{p.nombre}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground truncate">{p.cliente}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="">
                        {p.estado !== "En Progreso" && <DropdownMenuItem onClick={() => onCambiarEstado(p.id, "En Progreso")}>Mover a En Progreso</DropdownMenuItem>}
                        {p.estado !== "En Revisión" && <DropdownMenuItem onClick={() => onCambiarEstado(p.id, "En Revisión")}>Mover a Revisión</DropdownMenuItem>}
                        {p.estado !== "Completado" && <DropdownMenuItem onClick={() => onCambiarEstado(p.id, "Completado")}>Marcar Completado</DropdownMenuItem>}
                        {p.estado !== "Pausado" && <DropdownMenuItem onClick={() => onCambiarEstado(p.id, "Pausado")}>Pausar</DropdownMenuItem>}
                        <DropdownMenuItem className="text-destructive" onClick={() => onEliminar(p.id)}>Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-semibold">{p.progreso}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${p.progreso >= 75 ? 'satin-green-bg' : p.progreso >= 50 ? 'satin-blue-solid' : p.progreso >= 25 ? 'satin-yellow-solid' : 'satin-slate-bg'}`} style={{ width: `${p.progreso}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {p.fechaEntrega && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{p.fechaEntrega}</span>
                      </div>
                    )}
                    {p.presupuesto > 0 && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>${p.presupuesto.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {p.tipo && (
                    <Badge variant="outline" className="rounded-full text-xs">{p.tipo}</Badge>
                  )}
                </Card>
              </div>
            ))}
            {grouped[stage.id]?.length === 0 && (
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                dragOverStage === stage.id
                  ? "border-primary/50 bg-primary/5"
                  : "border-white/10"
              }`}>
                <p className="text-sm text-muted-foreground/50">Arrastra aquí</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

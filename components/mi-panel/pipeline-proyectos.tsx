"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Calendar, User, TrendingUp } from "lucide-react"
import { getProyectosPipeline } from "@/lib/store"
import type { Proyecto } from "@/lib/store"

export function PipelineProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProyectosPipeline().then((data) => {
      setProyectos(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl satin-green-bg flex items-center justify-center">
          <Rocket className="size-5 satin-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold">En Radar</h2>
          <p className="text-sm text-muted-foreground">Proyectos por venir en planificación</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-muted-foreground">Cargando pipeline...</div>
        </div>
      ) : proyectos.length === 0 ? (
        <Card className="glass-card p-8 rounded-xl text-center">
          <Rocket className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No hay proyectos en planificación</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {proyectos.map((proyecto) => (
            <Card key={proyecto.id} className="glass-card p-4 rounded-xl hover:scale-[1.005] transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{proyecto.nombre}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{proyecto.cliente}</p>
                </div>
                <Badge variant="outline" className="rounded-full text-xs shrink-0 ml-2 bg-white/5 text-white/40 border-white/10">
                  Planificación
                </Badge>
              </div>

              {proyecto.descripcion && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{proyecto.descripcion}</p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {proyecto.tipo && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    <span>{proyecto.tipo}</span>
                  </div>
                )}
                {proyecto.fechaInicio && (
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>Inicio: {proyecto.fechaInicio}</span>
                  </div>
                )}
                {proyecto.responsable && (
                  <div className="flex items-center gap-1">
                    <User className="size-3" />
                    <span>{proyecto.responsable}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

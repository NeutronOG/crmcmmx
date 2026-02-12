"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"
import type { Creador, CreadorCalificacion } from "@/lib/store"

interface CreadoresCalidadProps {
  creadores: Creador[]
  calificaciones: CreadorCalificacion[]
}

export function CreadoresCalidad({ creadores, calificaciones }: CreadoresCalidadProps) {
  // Compute average metrics across all ratings
  const categorias = [
    { key: "calidadVisual" as const, label: "Calidad Visual" },
    { key: "puntualidad" as const, label: "Puntualidad" },
    { key: "creatividad" as const, label: "Creatividad" },
    { key: "comunicacion" as const, label: "Comunicación" },
    { key: "seguimientoBrief" as const, label: "Seguimiento Brief" },
  ]

  const metricas = categorias.map(cat => {
    if (calificaciones.length === 0) return { label: cat.label, valor: 0 }
    const sum = calificaciones.reduce((s, c) => s + c[cat.key], 0)
    return { label: cat.label, valor: (sum / calificaciones.length) * 20 } // scale 1-5 → 0-100
  })

  // Top creadores by average rating
  const creadorRatings = creadores.map(cr => {
    const cals = calificaciones.filter(c => c.creadorId === cr.id)
    if (cals.length === 0) return { ...cr, avgRating: 0, numRatings: 0 }
    const avg = cals.reduce((s, c) => s + (c.calidadVisual + c.puntualidad + c.creatividad + c.comunicacion + c.seguimientoBrief) / 5, 0) / cals.length
    return { ...cr, avgRating: avg, numRatings: cals.length }
  }).filter(c => c.numRatings > 0).sort((a, b) => b.avgRating - a.avgRating).slice(0, 5)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 satin-yellow" />
            Métricas de Calidad (Promedio General)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {calificaciones.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sin calificaciones aún. Evalúa a un creador para ver métricas.</p>
          ) : (
            metricas.map((m) => (
              <div key={m.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.label}</span>
                  <span className="text-sm font-bold">{Math.round(m.valor)}%</span>
                </div>
                <Progress value={m.valor} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 satin-yellow fill-amber-500" />
            Top Creadores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {creadorRatings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Agrega creadores y califícalos para ver el ranking.</p>
          ) : (
            creadorRatings.map((cr, index) => (
              <div
                key={cr.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{cr.nombre}</p>
                    <p className="text-xs text-muted-foreground">{cr.especialidad || "General"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 satin-yellow fill-amber-500" />
                    <span className="font-bold">{cr.avgRating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cr.numRatings} evaluación{cr.numRatings !== 1 ? "es" : ""}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

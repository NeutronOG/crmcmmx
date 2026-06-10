"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarDays, Calendar } from "lucide-react"
import { getTareas } from "@/lib/store"
import { getUsuarios } from "@/lib/auth"
import type { Tarea } from "@/lib/store"

type VistaOcupacion = "diaria" | "semanal"

type DiaData = {
  label: string
  fecha: string
  tareas: Tarea[]
}

function getDiasSemana(): DiaData[] {
  const hoy = new Date()
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() - hoy.getDay() + 1)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes)
    d.setDate(lunes.getDate() + i)
    const fecha = d.toISOString().split("T")[0]
    const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    return { label: labels[i], fecha, tareas: [] }
  })
}

function getHoy(): string {
  return new Date().toISOString().split("T")[0]
}

export function ResponsablesOcupacion() {
  const [vista, setVista] = useState<VistaOcupacion>("semanal")
  const [loading, setLoading] = useState(true)
  const [datos, setDatos] = useState<
    { nombre: string; rol: string; diasData: DiaData[]; tareasHoy: Tarea[] }[]
  >([])

  useEffect(() => {
    Promise.all([getUsuarios(), getTareas()]).then(([users, tareas]) => {
      const hoy = getHoy()
      const diasBase = getDiasSemana()

      const data = users
        .filter(u => u.rol !== "admin")
        .map(u => {
          const misTareas = tareas.filter(t => t.asignado === u.nombre && t.estado !== "Completada")

          // Ocupación semanal: agrupar por fecha de vencimiento dentro de esta semana
          const diasData: DiaData[] = diasBase.map(d => ({
            ...d,
            tareas: misTareas.filter(t => t.fechaVencimiento === d.fecha),
          }))

          // Ocupación diaria: tareas que vencen hoy o están en progreso
          const tareasHoy = misTareas.filter(
            t => t.fechaVencimiento === hoy || t.estado === "En Progreso"
          )

          return { nombre: u.nombre, rol: u.rol, diasData, tareasHoy }
        })
        .filter(d => d.diasData.some(dia => dia.tareas.length > 0) || d.tareasHoy.length > 0)

      setDatos(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-muted-foreground">Cargando ocupación...</div>
      </div>
    )
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Ocupación del Equipo
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={vista === "diaria" ? "default" : "outline"}
              size="sm"
              onClick={() => setVista("diaria")}
              className="gap-1"
            >
              <Calendar className="h-4 w-4" />
              Diaria
            </Button>
            <Button
              variant={vista === "semanal" ? "default" : "outline"}
              size="sm"
              onClick={() => setVista("semanal")}
              className="gap-1"
            >
              <CalendarDays className="h-4 w-4" />
              Semanal
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {datos.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No hay tareas asignadas esta semana.
          </p>
        ) : vista === "diaria" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tareas activas hoy — {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            {datos.map(d => (
              <div key={d.nombre} className="flex items-start gap-4 p-4 rounded-xl glass">
                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold text-xs">
                    {d.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-sm">{d.nombre}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        d.tareasHoy.length > 5
                          ? "satin-red-bg satin-red"
                          : d.tareasHoy.length > 2
                          ? "satin-yellow-bg satin-yellow"
                          : "satin-green-bg satin-green"
                      }`}
                    >
                      {d.tareasHoy.length} tarea{d.tareasHoy.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {d.tareasHoy.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Sin tareas para hoy</p>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {d.tareasHoy.map(t => (
                        <Badge key={t.id} variant="outline" className="text-xs truncate max-w-[180px]">
                          {t.titulo}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header de días */}
            <div className="grid grid-cols-8 gap-2 text-xs text-muted-foreground font-medium">
              <div className="col-span-1" />
              {getDiasSemana().map(d => (
                <div
                  key={d.fecha}
                  className={`text-center py-1 px-2 rounded-lg ${
                    d.fecha === getHoy() ? "bg-primary/20 text-primary font-bold" : ""
                  }`}
                >
                  {d.label}
                  <div className="text-[10px] opacity-70">
                    {new Date(d.fecha + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>

            {datos.map(d => (
              <div key={d.nombre} className="grid grid-cols-8 gap-2 items-start">
                <div className="col-span-1 flex items-center gap-2">
                  <Avatar className="h-8 w-8 shrink-0 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold text-xs">
                      {d.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium leading-tight hidden xl:block">{d.nombre.split(" ")[0]}</p>
                </div>
                {d.diasData.map(dia => (
                  <div
                    key={dia.fecha}
                    className={`min-h-[48px] rounded-lg p-1 text-center ${
                      dia.tareas.length === 0
                        ? "bg-white/3 border border-white/5"
                        : dia.tareas.length >= 4
                        ? "satin-red-bg border border-red-500/30"
                        : dia.tareas.length >= 2
                        ? "satin-yellow-bg border border-amber-500/30"
                        : "satin-green-bg border border-green-500/30"
                    } ${dia.fecha === getHoy() ? "ring-1 ring-primary/50" : ""}`}
                  >
                    {dia.tareas.length > 0 && (
                      <div className="text-xs font-bold mt-1">
                        {dia.tareas.length}
                      </div>
                    )}
                    {dia.tareas.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        className="text-[9px] leading-tight truncate opacity-80 mt-0.5"
                        title={t.titulo}
                      >
                        {t.titulo.slice(0, 12)}
                      </div>
                    ))}
                    {dia.tareas.length > 2 && (
                      <div className="text-[9px] opacity-60">+{dia.tareas.length - 2}</div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-white/10">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded satin-green-bg border border-green-500/30" />
                1–1 tareas
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded satin-yellow-bg border border-amber-500/30" />
                2–3 tareas
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded satin-red-bg border border-red-500/30" />
                4+ tareas
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

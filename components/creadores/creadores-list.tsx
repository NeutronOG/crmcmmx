"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Star, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Creador, CreadorCalificacion } from "@/lib/store"

interface CreadoresListProps {
  creadores: Creador[]
  calificaciones: CreadorCalificacion[]
  onRate: (creador: Creador) => void
  onDelete: (id: string) => void
}

export function CreadoresList({ creadores, calificaciones, onRate, onDelete }: CreadoresListProps) {
  const getAvgRating = (creadorId: string) => {
    const cals = calificaciones.filter(c => c.creadorId === creadorId)
    if (cals.length === 0) return null
    return cals.reduce((s, c) => s + (c.calidadVisual + c.puntualidad + c.creatividad + c.comunicacion + c.seguimientoBrief) / 5, 0) / cals.length
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Disponible": return "satin-green-bg satin-green"
      case "Ocupado": return "satin-yellow-bg satin-yellow"
      default: return "bg-white/10 text-white/50"
    }
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle>Creadores de Contenido</CardTitle>
      </CardHeader>
      <CardContent>
        {creadores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay creadores registrados. Agrega uno para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {creadores.map((creador) => {
              const avg = getAvgRating(creador.id)
              return (
                <div
                  key={creador.id}
                  className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                        {creador.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {creador.nombre}
                      </h4>
                      {creador.email && <p className="text-sm text-muted-foreground">{creador.email}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        {creador.especialidad && (
                          <Badge variant="outline" className="text-xs">{creador.especialidad}</Badge>
                        )}
                        {creador.tarifa && (
                          <span className="text-xs satin-green font-medium">{creador.tarifa}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center hidden md:block">
                      {avg !== null ? (
                        <>
                          <div className="flex items-center gap-1 justify-center">
                            <Star className="h-4 w-4 satin-yellow fill-amber-500" />
                            <span className="font-bold">{avg.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground">Sin evaluar</p>
                      )}
                    </div>

                    <Badge className={getEstadoColor(creador.estado)}>{creador.estado}</Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => onRate(creador)}
                    >
                      <Star className="h-3 w-3" />
                      Evaluar
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onRate(creador)}>Evaluar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(creador.id)}>
                          <Trash2 className="h-3 w-3 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

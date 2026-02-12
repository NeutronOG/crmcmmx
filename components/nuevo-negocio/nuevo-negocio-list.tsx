"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, DollarSign } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Lead } from "@/lib/store"

const estadoColor: Record<string, string> = {
  "Nuevo": "satin-green-bg satin-green",
  "Contactado": "bg-white/10 text-white/70",
  "Calificado": "satin-yellow-bg satin-yellow",
  "Propuesta": "bg-white/10 text-white/70",
  "Negociación": "satin-yellow-bg satin-yellow",
  "Ganado": "satin-green-bg satin-green",
  "Perdido": "satin-red-bg satin-red",
}

interface NuevoNegocioListProps {
  leads: Lead[]
  loading?: boolean
  onCambiarEstado: (id: string, estado: Lead["estado"]) => void
  onEliminar: (id: string) => void
}

export function NuevoNegocioList({ leads, loading, onCambiarEstado, onEliminar }: NuevoNegocioListProps) {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Oportunidades de Negocio</span>
          <Badge variant="secondary" className="rounded-full">{leads.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8"><div className="animate-pulse text-muted-foreground">Cargando...</div></div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Sin oportunidades activas</div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                      {lead.empresa.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {lead.empresa}
                    </h4>
                    <p className="text-sm text-muted-foreground">{lead.nombre}</p>
                    {lead.origen && (
                      <Badge variant="outline" className="text-xs mt-1">{lead.origen}</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    {lead.valorEstimado > 0 && (
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <DollarSign className="h-4 w-4 satin-green" />
                        ${lead.valorEstimado.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {lead.probabilidad > 0 && (
                    <div className="hidden lg:flex flex-col items-center gap-1">
                      <div className="text-xs text-muted-foreground">Probabilidad</div>
                      <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                          style={{ width: `${lead.probabilidad}%` }}
                        />
                      </div>
                      <div className="text-xs font-medium">{lead.probabilidad}%</div>
                    </div>
                  )}

                  <Badge className={estadoColor[lead.estado] || "bg-gray-500/20 text-gray-400"}>{lead.estado}</Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="">
                      <DropdownMenuItem onClick={() => onCambiarEstado(lead.id, "Propuesta")}>Enviar Propuesta</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCambiarEstado(lead.id, "Negociación")}>Mover a Negociación</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCambiarEstado(lead.id, "Ganado")}>Marcar como Ganado</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onEliminar(lead.id)}>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Play, Pause, Users, MoreVertical, Clock, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const sequences = [
  {
    id: 1,
    name: "Bienvenida Nuevos Leads",
    status: "active",
    emails: 5,
    recipients: 143,
    openRate: 72.5,
    clickRate: 28.3,
    conversions: 24,
    lastSent: "Hace 2 horas",
  },
  {
    id: 2,
    name: "Seguimiento Post-Reunión",
    status: "active",
    emails: 3,
    recipients: 89,
    openRate: 85.2,
    clickRate: 42.1,
    conversions: 18,
    lastSent: "Hace 5 horas",
  },
  {
    id: 3,
    name: "Recuperación de Leads Fríos",
    status: "active",
    emails: 4,
    recipients: 256,
    openRate: 45.8,
    clickRate: 15.7,
    conversions: 12,
    lastSent: "Hace 1 día",
  },
  {
    id: 4,
    name: "Propuesta Enviada - Follow Up",
    status: "paused",
    emails: 6,
    recipients: 67,
    openRate: 78.4,
    clickRate: 35.2,
    conversions: 31,
    lastSent: "Hace 3 días",
  },
]

export function EmailSequences() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Secuencias de Email</h2>
        <Button variant="outline" size="sm">
          Ver Todas
        </Button>
      </div>

      <div className="grid gap-4">
        {sequences.map((sequence) => (
          <Card key={sequence.id} className="glass-card p-6 rounded-xl hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{sequence.name}</h3>
                    <Badge variant={sequence.status === "active" ? "default" : "secondary"} className="rounded-full">
                      {sequence.status === "active" ? (
                        <>
                          <Play className="h-3 w-3 mr-1" /> Activa
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3 mr-1" /> Pausada
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Emails</p>
                      <p className="text-sm font-semibold">{sequence.emails} mensajes</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Destinatarios</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 satin-blue" />
                        <p className="text-sm font-semibold">{sequence.recipients}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Apertura</p>
                      <p className="text-sm font-semibold satin-green">{sequence.openRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Clicks</p>
                      <p className="text-sm font-semibold satin-blue">{sequence.clickRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Conversiones</p>
                      <div className="flex items-center gap-1">
                        <Check className="h-3 w-3 satin-green" />
                        <p className="text-sm font-semibold">{sequence.conversions}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Último envío: {sequence.lastSent}</span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                  <DropdownMenuItem>Editar secuencia</DropdownMenuItem>
                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                  <DropdownMenuItem>{sequence.status === "active" ? "Pausar" : "Activar"}</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Bell, Clock, AlertCircle, CheckCircle, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const rules = [
  {
    id: 1,
    name: "Notificar lead sin respuesta 24h",
    trigger: "Lead sin respuesta por 24 horas",
    action: "Enviar email de seguimiento + WhatsApp",
    status: "active",
    triggered: 45,
    icon: Clock,
    color: "satin-blue",
  },
  {
    id: 2,
    name: "Alerta propuesta sin respuesta",
    trigger: "Propuesta enviada sin respuesta por 3 días",
    action: "Notificar al ejecutivo de ventas",
    status: "active",
    triggered: 12,
    icon: AlertCircle,
    color: "satin-yellow",
  },
  {
    id: 3,
    name: "Bienvenida cliente nuevo",
    trigger: "Cliente cerrado en CRM",
    action: "Enviar email de bienvenida + documentos",
    status: "active",
    triggered: 8,
    icon: CheckCircle,
    color: "satin-green",
  },
  {
    id: 4,
    name: "Recordatorio reunión kickoff",
    trigger: "24h antes de reunión kickoff",
    action: "Email + SMS recordatorio",
    status: "active",
    triggered: 23,
    icon: Bell,
    color: "satin-blue",
  },
]

export function AutomationRules() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reglas de Automatización</h2>
        <Button variant="outline" size="sm">
          Ver Todas
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((rule) => (
          <Card
            key={rule.id}
            className="glass-card p-6 rounded-xl hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background/50 ${rule.color}`}>
                  <rule.icon className="h-5 w-5" />
                </div>
                <Badge variant="default" className="rounded-full">
                  <Zap className="h-3 w-3 mr-1" /> Activa
                </Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Editar regla</DropdownMenuItem>
                  <DropdownMenuItem>Ver historial</DropdownMenuItem>
                  <DropdownMenuItem>Pausar</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{rule.name}</h3>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Disparador: </span>
                  <span className="text-foreground">{rule.trigger}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Acción: </span>
                  <span className="text-foreground">{rule.action}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Activaciones este mes</span>
                <Badge variant="secondary" className="rounded-full">
                  {rule.triggered}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

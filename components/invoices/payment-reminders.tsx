"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, DollarSign, AlertTriangle } from "lucide-react"
import { getCotizaciones } from "@/lib/store"
import type { Cotizacion } from "@/lib/store"

export function PaymentReminders() {
  const [pendientes, setPendientes] = useState<Cotizacion[]>([])

  useEffect(() => {
    getCotizaciones().then(data => {
      setPendientes(data.filter(c => c.estado === "Enviada" || c.estado === "En Negociación"))
    })
  }, [])

  if (pendientes.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 satin-yellow" />
          <h2 className="text-2xl font-bold">Cotizaciones Pendientes</h2>
          <Badge variant="secondary" className="rounded-full">0</Badge>
        </div>
        <Card className="glass-card p-8 rounded-xl text-center text-muted-foreground">
          No hay cotizaciones pendientes de respuesta.
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 satin-yellow" />
        <h2 className="text-2xl font-bold">Cotizaciones Pendientes</h2>
        <Badge variant="secondary" className="rounded-full">{pendientes.length}</Badge>
      </div>

      <div className="grid gap-4">
        {pendientes.map(c => {
          const isNeg = c.estado === "En Negociación"
          return (
            <Card key={c.id} className="glass-card p-5 rounded-xl hover:scale-[1.005] transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isNeg ? "satin-yellow-bg" : "satin-blue-bg"}`}>
                  {isNeg ? <AlertTriangle className="h-5 w-5 satin-yellow" /> : <Clock className="h-5 w-5 satin-blue" />}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold">{c.cliente || "—"}</h3>
                    <Badge variant={isNeg ? "secondary" : "outline"} className="rounded-full">{c.estado}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.proyecto || "Sin proyecto"}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 satin-green" />
                        <span className="font-semibold satin-green">${c.valor.toLocaleString("es-MX")}</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Creada</p>
                      <span>{c.fechaCreacion || "—"}</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground">Responsable</p>
                      <span>{c.responsable || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

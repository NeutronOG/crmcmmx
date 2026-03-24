"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, DollarSign, User, Calendar } from "lucide-react"
import { getCotizaciones } from "@/lib/store"
import type { Cotizacion } from "@/lib/store"

const statusStyle: Record<Cotizacion["estado"], string> = {
  Borrador: "bg-white/10 text-white/60",
  Enviada: "bg-blue-500/20 text-blue-300",
  "En Negociación": "bg-yellow-500/20 text-yellow-300",
  Aprobada: "bg-green-500/20 text-green-300",
  Rechazada: "bg-red-500/20 text-red-300",
}

export function InvoicesList() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCotizaciones().then(data => { setCotizaciones(data); setLoading(false) })
  }, [])

  if (loading) return <p className="text-sm text-muted-foreground py-6 text-center">Cargando cotizaciones...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cotizaciones</h2>
        <Badge variant="secondary">{cotizaciones.length} registros</Badge>
      </div>

      {cotizaciones.length === 0 ? (
        <Card className="glass-card p-10 rounded-xl text-center text-muted-foreground">
          Sin cotizaciones registradas. Crea una desde el apartado de Cotizaciones.
        </Card>
      ) : (
        <div className="grid gap-4">
          {cotizaciones.map(c => (
            <Card key={c.id} className="glass-card p-5 rounded-xl hover:scale-[1.005] transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{c.proyecto || "Sin nombre"}</h3>
                    <Badge className={statusStyle[c.estado]}>{c.estado}</Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>{c.cliente || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 satin-green" />
                      <span className="font-semibold satin-green">${c.valor.toLocaleString("es-MX")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{c.fechaCreacion || "—"}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Resp: <span className="text-foreground">{c.responsable || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DollarSign, FileText, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"
import { getCotizaciones, getIngresos } from "@/lib/store"
import type { Cotizacion, Ingreso } from "@/lib/store"

export function InvoicesOverview() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [ingresos, setIngresos] = useState<Ingreso[]>([])

  useEffect(() => {
    Promise.all([getCotizaciones(), getIngresos()]).then(([c, i]) => {
      setCotizaciones(c)
      setIngresos(i)
    })
  }, [])

  const mesActual = new Date().getMonth() + 1
  const añoActual = new Date().getFullYear()

  const ingresosMes = ingresos.filter(i => {
    const d = new Date(i.fecha)
    return d.getMonth() + 1 === mesActual && d.getFullYear() === añoActual
  })
  const facturadoMes = ingresosMes.reduce((s, i) => s + i.monto, 0)

  const aprobadas = cotizaciones.filter(c => c.estado === "Aprobada")
  const pendientes = cotizaciones.filter(c => c.estado === "Enviada" || c.estado === "En Negociación")
  const rechazadas = cotizaciones.filter(c => c.estado === "Rechazada")

  const valorAprobado = aprobadas.reduce((s, c) => s + c.valor, 0)
  const valorPendiente = pendientes.reduce((s, c) => s + c.valor, 0)

  const tasaCobro = cotizaciones.length > 0
    ? ((aprobadas.length / cotizaciones.length) * 100).toFixed(1)
    : "0.0"

  const stats = [
    { label: "Facturado Este Mes", value: `$${facturadoMes.toLocaleString("es-MX")}`, sub: `${ingresosMes.length} ingresos`, icon: DollarSign, color: "satin-green", bgColor: "satin-green-bg" },
    { label: "Cotizaciones Total", value: `${cotizaciones.length}`, sub: "registradas", icon: FileText, color: "satin-blue", bgColor: "satin-blue-bg" },
    { label: "En Negociación", value: `$${valorPendiente.toLocaleString("es-MX")}`, sub: `${pendientes.length} cotizaciones`, icon: Clock, color: "satin-yellow", bgColor: "satin-yellow-bg" },
    { label: "Aprobadas", value: `$${valorAprobado.toLocaleString("es-MX")}`, sub: `${aprobadas.length} cotizaciones`, icon: CheckCircle2, color: "satin-green", bgColor: "satin-green-bg" },
    { label: "Rechazadas", value: `${rechazadas.length}`, sub: "cotizaciones", icon: AlertCircle, color: "satin-red", bgColor: "satin-red-bg" },
    { label: "Tasa de Cierre", value: `${tasaCobro}%`, sub: "cotizaciones ganadas", icon: TrendingUp, color: "satin-cyan", bgColor: "satin-cyan-bg" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass-card p-5 rounded-xl hover:scale-105 transition-all duration-300 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-muted-foreground">{stat.sub}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

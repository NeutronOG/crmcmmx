"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Percent, CreditCard } from "lucide-react"
import { getNominaEmpleados } from "@/lib/store"
import type { NominaEmpleado } from "@/lib/store"

export function NominaStats() {
  const [empleados, setEmpleados] = useState<NominaEmpleado[]>([])

  useEffect(() => {
    getNominaEmpleados().then(setEmpleados)
  }, [])

  const totalSalarios = empleados.reduce((s, e) => s + e.salarioBase, 0)
  const totalBonos = empleados.reduce((s, e) => s + e.bonos, 0)
  const totalNomina = totalSalarios + totalBonos
  const pendientes = empleados.filter(e => e.estado === "Pendiente" || e.estado === "Procesando")
  const totalPendiente = pendientes.reduce((s, e) => s + e.salarioBase + e.bonos, 0)

  const stats = [
    { title: "Nómina Total", value: `$${totalNomina.toLocaleString("es-MX")}`, icon: DollarSign, color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]" },
    { title: "Empleados", value: `${empleados.length}`, icon: Users, color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]" },
    { title: "Bonos / Comisiones", value: `$${totalBonos.toLocaleString("es-MX")}`, icon: Percent, color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.12_350)]" },
    { title: "Pagos Pendientes", value: `$${totalPendiente.toLocaleString("es-MX")}`, icon: CreditCard, color: "from-[oklch(0.76_0.10_70)] to-[oklch(0.74_0.11_55)]" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass border-white/10 hover:border-white/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">datos en tiempo real</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

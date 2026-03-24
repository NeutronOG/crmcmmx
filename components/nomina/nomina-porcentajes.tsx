"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Percent, DollarSign } from "lucide-react"
import { getNominaEmpleados } from "@/lib/store"
import type { NominaEmpleado } from "@/lib/store"

export function NominaPorcentajes() {
  const [empleados, setEmpleados] = useState<NominaEmpleado[]>([])

  useEffect(() => {
    getNominaEmpleados().then(setEmpleados)
  }, [])

  const totalSalarios = empleados.reduce((s, e) => s + e.salarioBase, 0)
  const totalBonos = empleados.reduce((s, e) => s + e.bonos, 0)
  const totalNomina = totalSalarios + totalBonos

  const pctSalarios = totalNomina > 0 ? Math.round((totalSalarios / totalNomina) * 100) : 0
  const pctBonos = totalNomina > 0 ? Math.round((totalBonos / totalNomina) * 100) : 0

  const distribucion = [
    { nombre: "Salarios Base", valor: pctSalarios, monto: totalSalarios },
    { nombre: "Bonos / Comisiones", valor: pctBonos, monto: totalBonos },
  ]

  const porEmpleado = empleados.slice(0, 8)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Estructura por Empleado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {porEmpleado.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sin datos de nómina. Agrega salarios desde la tabla de usuarios en Supabase.</p>
          ) : (
            porEmpleado.map(e => (
              <div key={e.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{e.nombre}</span>
                  <Badge className="bg-primary/20 text-primary text-xs">
                    {e.porcentajeComision}% comisión
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Base</p>
                    <p className="font-medium">${e.salarioBase.toLocaleString("es-MX")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bonos</p>
                    <p className="font-medium satin-green">${e.bonos.toLocaleString("es-MX")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold">${(e.salarioBase + e.bonos).toLocaleString("es-MX")}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 satin-green" />
            Distribución de Nómina
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {distribucion.map(item => (
            <div key={item.nombre} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.nombre}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">${item.monto.toLocaleString("es-MX")}</span>
                  <Badge variant="outline" className="text-xs">{item.valor}%</Badge>
                </div>
              </div>
              <Progress value={item.valor} className="h-3" />
            </div>
          ))}

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Nómina</span>
              <span className="text-2xl font-bold satin-green">${totalNomina.toLocaleString("es-MX")}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{empleados.length} empleados registrados</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

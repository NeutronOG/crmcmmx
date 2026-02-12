"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { fetchIngresosFromGoogleSheet, type IngresoGoogleSheet } from "@/lib/google-sheets"

export function IngresosMensuales() {
  const [ingresos, setIngresos] = useState<IngresoGoogleSheet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadIngresos = async () => {
    setIsLoading(true)
    try {
      const data = await fetchIngresosFromGoogleSheet()
      setIngresos(data)
    } catch (error) {
      console.error('Error al cargar ingresos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadIngresos()
  }, [])

  // Calcular totales
  const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0)
  const mesActual = new Date().getMonth() + 1
  const añoActual = new Date().getFullYear()
  const ingresosMesActual = ingresos.filter(i => i.mes === mesActual && i.año === añoActual)
  const totalMesActual = ingresosMesActual.reduce((sum, i) => sum + i.monto, 0)

  // Ordenar por fecha (más reciente primero)
  const ingresosOrdenados = [...ingresos].sort((a, b) => {
    const fechaA = new Date(a.año, a.mes - 1, a.dia)
    const fechaB = new Date(b.año, b.mes - 1, b.dia)
    return fechaB.getTime() - fechaA.getTime()
  })

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ingresos Mensuales</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {ingresos.length} registros
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadIngresos}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl satin-green-bg">
              <DollarSign className="h-5 w-5 satin-green" />
            </div>
            <div>
              <p className="text-2xl font-bold satin-green">
                ${totalIngresos.toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">Total Ingresos</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl satin-blue-bg">
              <Calendar className="h-5 w-5 satin-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold satin-blue">
                ${totalMesActual.toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">Este Mes ({meses[mesActual - 1]})</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl satin-cyan-bg">
              <TrendingUp className="h-5 w-5 satin-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold satin-blue">
                ${ingresos.length > 0 ? Math.round(totalIngresos / ingresos.length).toLocaleString('es-MX') : 0}
              </p>
              <p className="text-xs text-muted-foreground">Promedio por Ingreso</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de todos los ingresos */}
      <Card className="glass-card p-4 rounded-xl">
        <h3 className="font-semibold mb-4">Todos los Ingresos ({ingresosOrdenados.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {ingresosOrdenados.map((ingreso, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{ingreso.tipoDeGasto}</p>
                <p className="text-xs text-muted-foreground">
                  {ingreso.dia}/{ingreso.mes}/{ingreso.año}
                </p>
              </div>
              <p className="font-bold satin-green">
                ${ingreso.monto.toLocaleString('es-MX')}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

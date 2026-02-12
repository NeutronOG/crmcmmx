"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingDown, Calendar, AlertCircle } from "lucide-react"
import { fetchGastosFromGoogleSheet, type GastoGoogleSheet } from "@/lib/google-sheets"

export function GastosMensuales() {
  const [gastos, setGastos] = useState<GastoGoogleSheet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadGastos = async () => {
    setIsLoading(true)
    try {
      const data = await fetchGastosFromGoogleSheet()
      setGastos(data)
    } catch (error) {
      console.error('Error al cargar gastos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGastos()
  }, [])

  // Calcular totales
  const totalGastos = gastos.reduce((sum, g) => sum + g.importe, 0)
  const mesActual = new Date().getMonth() + 1
  const añoActual = new Date().getFullYear()
  const gastosMesActual = gastos.filter(g => g.mes === mesActual && g.año === añoActual)
  const totalMesActual = gastosMesActual.reduce((sum, g) => sum + g.importe, 0)

  // Ordenar por fecha (más reciente primero)
  const gastosOrdenados = [...gastos].sort((a, b) => {
    const fechaA = new Date(a.año, a.mes - 1, a.dia)
    const fechaB = new Date(b.año, b.mes - 1, b.dia)
    return fechaB.getTime() - fechaA.getTime()
  })

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gastos Mensuales</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {gastos.length} registros
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadGastos}
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
            <div className="p-3 rounded-xl satin-red-bg">
              <TrendingDown className="h-5 w-5 satin-red" />
            </div>
            <div>
              <p className="text-2xl font-bold satin-red">
                ${totalGastos.toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">Total Gastos</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl satin-yellow-bg">
              <Calendar className="h-5 w-5 satin-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold satin-yellow">
                ${totalMesActual.toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">Este Mes ({meses[mesActual - 1]})</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl satin-yellow-bg">
              <AlertCircle className="h-5 w-5 satin-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold satin-yellow">
                ${gastos.length > 0 ? Math.round(totalGastos / gastos.length).toLocaleString('es-MX') : 0}
              </p>
              <p className="text-xs text-muted-foreground">Promedio por Gasto</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de todos los gastos */}
      <Card className="glass-card p-4 rounded-xl">
        <h3 className="font-semibold mb-4">Todos los Gastos ({gastosOrdenados.length})</h3>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {gastosOrdenados.map((gasto, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{gasto.tipoDeGasto}</p>
                <p className="text-xs text-muted-foreground">
                  {gasto.dia}/{gasto.mes}/{gasto.año}
                </p>
              </div>
              <p className="font-bold satin-red">
                -${gasto.importe.toLocaleString('es-MX')}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

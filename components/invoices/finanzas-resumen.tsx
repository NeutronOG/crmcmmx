"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, DollarSign, TrendingUp, TrendingDown, Calculator, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { fetchIngresosFromGoogleSheet, fetchGastosFromGoogleSheet, type IngresoGoogleSheet, type GastoGoogleSheet } from "@/lib/google-sheets"

type Vista = 'resumen' | 'ingresos' | 'gastos'

export function FinanzasResumen() {
  const [ingresos, setIngresos] = useState<IngresoGoogleSheet[]>([])
  const [gastos, setGastos] = useState<GastoGoogleSheet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [vista, setVista] = useState<Vista>('resumen')

  const loadAll = async () => {
    setIsLoading(true)
    try {
      const [ingresosData, gastosData] = await Promise.all([
        fetchIngresosFromGoogleSheet(),
        fetchGastosFromGoogleSheet()
      ])
      setIngresos(ingresosData)
      setGastos(gastosData)
    } catch (error) {
      console.error('Error al cargar finanzas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  // Calcular totales
  const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0)
  const totalGastos = gastos.reduce((sum, g) => sum + g.importe, 0)
  const utilidad = totalIngresos - totalGastos
  const margenUtilidad = totalIngresos > 0 ? ((utilidad / totalIngresos) * 100).toFixed(1) : 0

  // Mes actual
  const mesActual = new Date().getMonth() + 1
  const añoActual = new Date().getFullYear()
  const ingresosMesActual = ingresos.filter(i => i.mes === mesActual && i.año === añoActual)
  const gastosMesActual = gastos.filter(g => g.mes === mesActual && g.año === añoActual)
  const totalIngresosMes = ingresosMesActual.reduce((sum, i) => sum + i.monto, 0)
  const totalGastosMes = gastosMesActual.reduce((sum, g) => sum + g.importe, 0)
  const utilidadMes = totalIngresosMes - totalGastosMes

  // Ordenar por fecha
  const ingresosOrdenados = [...ingresos].sort((a, b) => {
    const fechaA = new Date(a.año, a.mes - 1, a.dia)
    const fechaB = new Date(b.año, b.mes - 1, b.dia)
    return fechaB.getTime() - fechaA.getTime()
  })

  const gastosOrdenados = [...gastos].sort((a, b) => {
    const fechaA = new Date(a.año, a.mes - 1, a.dia)
    const fechaB = new Date(b.año, b.mes - 1, b.dia)
    return fechaB.getTime() - fechaA.getTime()
  })

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  return (
    <div className="space-y-4">
      {/* Header con tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Finanzas</h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-lg p-1">
            <Button 
              variant={vista === 'resumen' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setVista('resumen')}
              className="rounded-md"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Resumen
            </Button>
            <Button 
              variant={vista === 'ingresos' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setVista('ingresos')}
              className="rounded-md"
            >
              <ArrowUpCircle className="h-4 w-4 mr-2 satin-green" />
              Ingresos
            </Button>
            <Button 
              variant={vista === 'gastos' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setVista('gastos')}
              className="rounded-md"
            >
              <ArrowDownCircle className="h-4 w-4 mr-2 satin-red" />
              Gastos
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadAll}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Tarjetas de resumen - siempre visibles */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg satin-green-bg">
              <TrendingUp className="h-4 w-4 satin-green" />
            </div>
            <div>
              <p className="text-lg font-bold satin-green">
                ${totalIngresos.toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">Total Ingresos</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg satin-red-bg">
              <TrendingDown className="h-4 w-4 satin-red" />
            </div>
            <div>
              <p className="text-lg font-bold satin-red">
                ${totalGastos.toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">Total Gastos</p>
            </div>
          </div>
        </Card>

        <Card className={`glass-card p-4 rounded-xl ${utilidad >= 0 ? 'satin-green-border' : 'satin-red-border'}`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${utilidad >= 0 ? 'satin-green-bg' : 'satin-red-bg'}`}>
              <DollarSign className={`h-4 w-4 ${utilidad >= 0 ? 'satin-green' : 'satin-red'}`} />
            </div>
            <div>
              <p className={`text-lg font-bold ${utilidad >= 0 ? 'satin-green' : 'satin-red'}`}>
                ${Math.abs(utilidad).toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">
                {utilidad >= 0 ? 'Utilidad' : 'Pérdida'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/10">
              <Calculator className="h-4 w-4 satin-blue" />
            </div>
            <div>
              <p className={`text-lg font-bold ${Number(margenUtilidad) >= 0 ? 'satin-blue' : 'satin-red'}`}>
                {margenUtilidad}%
              </p>
              <p className="text-xs text-muted-foreground">Margen</p>
            </div>
          </div>
        </Card>

        <Card className={`glass-card p-4 rounded-xl ${utilidadMes >= 0 ? 'border-white/10' : 'satin-yellow-border'}`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${utilidadMes >= 0 ? 'satin-blue-bg' : 'satin-yellow-bg'}`}>
              <DollarSign className={`h-4 w-4 ${utilidadMes >= 0 ? 'satin-blue' : 'satin-yellow'}`} />
            </div>
            <div>
              <p className={`text-lg font-bold ${utilidadMes >= 0 ? 'satin-blue' : 'satin-yellow'}`}>
                ${Math.abs(utilidadMes).toLocaleString('es-MX')}
              </p>
              <p className="text-xs text-muted-foreground">
                {utilidadMes >= 0 ? 'Utilidad' : 'Pérdida'} {meses[mesActual - 1]}
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/10">
              <Calculator className="h-4 w-4 satin-blue" />
            </div>
            <div>
              <p className="text-lg font-bold satin-blue">
                {ingresos.length + gastos.length}
              </p>
              <p className="text-xs text-muted-foreground">Movimientos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Vista de Resumen */}
      {vista === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Últimos Ingresos */}
          <Card className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4 satin-green" />
                Últimos Ingresos
              </h3>
              <Badge variant="secondary">{ingresos.length}</Badge>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {ingresosOrdenados.slice(0, 10).map((ingreso, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium text-sm">{ingreso.tipoDeGasto}</p>
                    <p className="text-xs text-muted-foreground">{ingreso.dia}/{ingreso.mes}/{ingreso.año}</p>
                  </div>
                  <p className="font-bold satin-green">${ingreso.monto.toLocaleString('es-MX')}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setVista('ingresos')}>
              Ver todos los ingresos →
            </Button>
          </Card>

          {/* Últimos Gastos */}
          <Card className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ArrowDownCircle className="h-4 w-4 satin-red" />
                Últimos Gastos
              </h3>
              <Badge variant="secondary">{gastos.length}</Badge>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {gastosOrdenados.slice(0, 10).map((gasto, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div>
                    <p className="font-medium text-sm">{gasto.tipoDeGasto}</p>
                    <p className="text-xs text-muted-foreground">{gasto.dia}/{gasto.mes}/{gasto.año}</p>
                  </div>
                  <p className="font-bold satin-red">-${gasto.importe.toLocaleString('es-MX')}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setVista('gastos')}>
              Ver todos los gastos →
            </Button>
          </Card>
        </div>
      )}

      {/* Vista de Ingresos */}
      {vista === 'ingresos' && (
        <Card className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 satin-green" />
              Todos los Ingresos
            </h3>
            <Badge variant="secondary" className="satin-green-bg satin-green">
              {ingresos.length} registros • ${totalIngresos.toLocaleString('es-MX')}
            </Badge>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {ingresosOrdenados.map((ingreso, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{ingreso.tipoDeGasto}</p>
                  <p className="text-xs text-muted-foreground">{ingreso.dia}/{ingreso.mes}/{ingreso.año}</p>
                </div>
                <p className="font-bold satin-green text-lg">${ingreso.monto.toLocaleString('es-MX')}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Vista de Gastos */}
      {vista === 'gastos' && (
        <Card className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 satin-red" />
              Todos los Gastos
            </h3>
            <Badge variant="secondary" className="satin-red-bg satin-red">
              {gastos.length} registros • ${totalGastos.toLocaleString('es-MX')}
            </Badge>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {gastosOrdenados.map((gasto, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{gasto.tipoDeGasto}</p>
                  <p className="text-xs text-muted-foreground">{gasto.dia}/{gasto.mes}/{gasto.año}</p>
                </div>
                <p className="font-bold satin-red text-lg">-${gasto.importe.toLocaleString('es-MX')}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart, PieChart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { getProyectos, getIngresos } from "@/lib/store"

const colors = ["bg-primary/70", "satin-blue-solid", "satin-cyan-solid", "satin-purple-solid", "satin-yellow-solid"]

export function PerformanceCharts() {
  const { isAdmin } = useAuth()
  const [projectsByType, setProjectsByType] = useState<{ type: string; count: number; percentage: number; color: string }[]>([])
  const [totalProjects, setTotalProjects] = useState(0)
  const [monthlyData, setMonthlyData] = useState<number[]>([])
  const [ingresoStats, setIngresoStats] = useState({ promedio: 0, maximo: 0, minimo: 0 })

  useEffect(() => {
    Promise.all([getProyectos(), getIngresos()]).then(([proyectos, ingresos]) => {
      // Group projects by type
      const typeCount: Record<string, number> = {}
      proyectos.forEach(p => {
        const tipo = p.tipo || "Sin categoría"
        typeCount[tipo] = (typeCount[tipo] || 0) + 1
      })
      
      const total = proyectos.length
      setTotalProjects(total)
      
      const types = Object.entries(typeCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([type, count], i) => ({
          type,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          color: colors[i % colors.length],
        }))
      setProjectsByType(types)

      // Monthly income data (last 12 months)
      const now = new Date()
      const monthly: number[] = []
      for (let i = 11; i >= 0; i--) {
        const month = now.getMonth() - i
        const year = now.getFullYear() + Math.floor(month / 12)
        const m = ((month % 12) + 12) % 12 + 1
        const monthIngresos = ingresos.filter(ing => ing.mes === m && ing.año === year)
        const total = monthIngresos.reduce((sum, ing) => sum + ing.monto, 0)
        monthly.push(total)
      }
      setMonthlyData(monthly)

      // Calculate stats
      const allMontos = ingresos.map(i => i.monto)
      if (allMontos.length > 0) {
        const sum = allMontos.reduce((a, b) => a + b, 0)
        setIngresoStats({
          promedio: Math.round(sum / allMontos.length),
          maximo: Math.max(...allMontos),
          minimo: Math.min(...allMontos),
        })
      }
    })
  }, [])
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Análisis de Rendimiento</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <LineChart className="h-4 w-4 mr-2" />
            Líneas
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Barras
          </Button>
          <Button variant="outline" size="sm">
            <PieChart className="h-4 w-4 mr-2" />
            Circular
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 ${isAdmin ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
        {/* Ingresos Mensuales - Solo visible para admins */}
        {isAdmin && (
          <Card className="glass-card p-6 rounded-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Ingresos Mensuales</h3>
                <Button variant="ghost" size="sm">
                  Ver más
                </Button>
              </div>

              <div className="h-[300px] flex items-end justify-between gap-2">
                {monthlyData.length > 0 ? monthlyData.map((value, i) => {
                  const maxVal = Math.max(...monthlyData, 1)
                  const height = Math.max((value / maxVal) * 100, 5)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary via-secondary to-accent transition-all duration-500 hover:scale-105"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                      </span>
                    </div>
                  )
                }) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Sin datos de ingresos
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Promedio</p>
                  <p className="text-lg font-bold text-foreground">${ingresoStats.promedio.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Máximo</p>
                  <p className="text-lg font-bold satin-green">${ingresoStats.maximo.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mínimo</p>
                  <p className="text-lg font-bold satin-blue">${ingresoStats.minimo.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="glass-card p-6 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Proyectos por Tipo</h3>
              <Button variant="ghost" size="sm">
                Ver más
              </Button>
            </div>

            <div className="space-y-3">
              {projectsByType.length > 0 ? projectsByType.map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.type}</span>
                    <span className="font-semibold">{item.count} proyectos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 rounded-full bg-background/50 overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium min-w-[40px] text-right">{item.percentage}%</span>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-4">Sin proyectos registrados</p>
              )}
            </div>

            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Proyectos</p>
                <p className="text-2xl font-bold text-foreground">{totalProjects}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

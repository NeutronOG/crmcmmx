"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart, PieChart } from "lucide-react"

export function PerformanceCharts() {
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card p-6 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Ingresos Mensuales</h3>
              <Button variant="ghost" size="sm">
                Ver más
              </Button>
            </div>

            <div className="h-[300px] flex items-end justify-between gap-2">
              {[65, 85, 72, 90, 78, 95, 88, 92, 85, 98, 89, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary via-secondary to-accent transition-all duration-500 hover:scale-105"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Promedio</p>
                <p className="text-lg font-bold text-foreground">$85,200</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Máximo</p>
                <p className="text-lg font-bold satin-green">$125,430</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Mínimo</p>
                <p className="text-lg font-bold satin-blue">$52,800</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Proyectos por Tipo</h3>
              <Button variant="ghost" size="sm">
                Ver más
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { type: "Publicidad Digital", count: 18, percentage: 38, color: "bg-white/70" },
                { type: "Redes Sociales", count: 15, percentage: 32, color: "satin-blue-solid" },
                { type: "Branding", count: 8, percentage: 17, color: "satin-cyan-solid" },
                { type: "Desarrollo Web", count: 6, percentage: 13, color: "satin-slate-bg" },
              ].map((item) => (
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
              ))}
            </div>

            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Proyectos</p>
                <p className="text-2xl font-bold text-foreground">47</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

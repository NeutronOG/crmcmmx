"use client"

import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsOverview } from "@/components/reports/reports-overview"
import { PerformanceCharts } from "@/components/reports/performance-charts"
import { ClientReports } from "@/components/reports/client-reports"
import { KPIAlerts } from "@/components/reports/kpi-alerts"
import { LiquidBackground } from "@/components/liquid-background"
import { getClientes, getProyectos, getLeads, getTareas, getIngresos, getGastos } from "@/lib/store"
import { exportToCSV } from "@/lib/export-csv"
import { toast } from "sonner"

export default function ReportsPage() {
  const handleExport = async () => {
    const [clientes, proyectos, leads, tareas, ingresos, gastos] = await Promise.all([
      getClientes(), getProyectos(), getLeads(), getTareas(), getIngresos(), getGastos(),
    ])
    const totalIngresos = ingresos.reduce((s, i) => s + i.monto, 0)
    const totalGastos = gastos.reduce((s, g) => s + g.importe, 0)
    const rows = [
      { metrica: "Total Clientes", valor: clientes.length },
      { metrica: "Clientes Activos", valor: clientes.filter(c => c.estado === "Activo").length },
      { metrica: "Total Proyectos", valor: proyectos.length },
      { metrica: "Proyectos En Progreso", valor: proyectos.filter(p => p.estado === "En Progreso").length },
      { metrica: "Proyectos Completados", valor: proyectos.filter(p => p.estado === "Completado").length },
      { metrica: "Total Leads", valor: leads.length },
      { metrica: "Leads Ganados", valor: leads.filter(l => l.estado === "Ganado").length },
      { metrica: "Total Tareas", valor: tareas.length },
      { metrica: "Tareas Completadas", valor: tareas.filter(t => t.estado === "Completada").length },
      { metrica: "Ingresos Totales", valor: totalIngresos },
      { metrica: "Gastos Totales", valor: totalGastos },
      { metrica: "Balance", valor: totalIngresos - totalGastos },
    ]
    exportToCSV(rows, [
      { key: "metrica", label: "Métrica" },
      { key: "valor", label: "Valor" },
    ], "reporte_general")
    toast.success("Reporte exportado")
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <ReportsHeader onExport={handleExport} />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
              Reportes y Análisis
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Genera reportes automáticos y monitorea KPIs en tiempo real
            </p>
          </div>

          <ReportsOverview />
          <KPIAlerts />
          <PerformanceCharts />
          <ClientReports />
        </main>
      </div>
    </div>
  )
}

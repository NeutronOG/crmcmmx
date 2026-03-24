"use client"

import { InvoicesHeader } from "@/components/invoices/invoices-header"
import { InvoicesOverview } from "@/components/invoices/invoices-overview"
import { InvoicesList } from "@/components/invoices/invoices-list"
import { PaymentReminders } from "@/components/invoices/payment-reminders"
import { FinanzasResumen } from "@/components/invoices/finanzas-resumen"
import { LiquidBackground } from "@/components/liquid-background"
import { DashboardHeader } from "@/components/dashboard-header"
import { getIngresos, getGastos } from "@/lib/store"
import { exportToCSV } from "@/lib/export-csv"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { toast } from "sonner"

async function buildFinanzasRows() {
  const [ingresos, gastos] = await Promise.all([getIngresos(), getGastos()])
  return [
    ...ingresos.map(i => ({ tipo: "Ingreso", concepto: i.concepto, monto: i.monto, fecha: i.fecha, categoria: i.categoria })),
    ...gastos.map(g => ({ tipo: "Gasto", concepto: g.concepto, monto: g.monto, fecha: g.fecha, categoria: g.categoria })),
  ]
}

export default function InvoicesPage() {
  const handleExportCSV = async () => {
    const rows = await buildFinanzasRows()
    exportToCSV(rows, [
      { key: "tipo", label: "Tipo" },
      { key: "concepto", label: "Concepto" },
      { key: "monto", label: "Monto" },
      { key: "fecha", label: "Fecha" },
      { key: "categoria", label: "Categoría" },
    ], "finanzas")
    toast.success("Finanzas exportadas a CSV")
  }

  const handleExportExcel = async () => {
    const rows = await buildFinanzasRows()
    const data = rows.map(r => ({
      "Tipo": r.tipo, "Concepto": r.concepto, "Monto": r.monto,
      "Fecha": r.fecha, "Categoría": r.categoria,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    ws["!cols"] = [{ wch: 10 }, { wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 16 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Finanzas")
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `finanzas_${new Date().toISOString().split("T")[0]}.xlsx`
    )
    toast.success("Finanzas exportadas a Excel")
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <InvoicesHeader onExportCSV={handleExportCSV} onExportExcel={handleExportExcel} />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Facturación y Cobranza
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Genera facturas automáticas y gestiona cobros eficientemente
            </p>
          </div>

          <InvoicesOverview />
          <FinanzasResumen />
          <PaymentReminders />
          <InvoicesList />
        </main>
      </div>
    </div>
  )
}

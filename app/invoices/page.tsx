"use client"

import { InvoicesHeader } from "@/components/invoices/invoices-header"
import { InvoicesOverview } from "@/components/invoices/invoices-overview"
import { InvoicesList } from "@/components/invoices/invoices-list"
import { PaymentReminders } from "@/components/invoices/payment-reminders"
import { FinanzasResumen } from "@/components/invoices/finanzas-resumen"
import { LiquidBackground } from "@/components/liquid-background"
import { getIngresos, getGastos } from "@/lib/store"
import { exportToCSV } from "@/lib/export-csv"
import { toast } from "sonner"

export default function InvoicesPage() {
  const handleExport = async () => {
    const [ingresos, gastos] = await Promise.all([getIngresos(), getGastos()])
    const rows = [
      ...ingresos.map(i => ({ tipo: "Ingreso", concepto: i.tipoDeGasto, monto: i.monto, dia: i.dia, mes: i.mes, año: i.año })),
      ...gastos.map(g => ({ tipo: "Gasto", concepto: g.tipoDeGasto, monto: g.importe, dia: g.dia, mes: g.mes, año: g.año })),
    ]
    exportToCSV(rows, [
      { key: "tipo", label: "Tipo" },
      { key: "concepto", label: "Concepto" },
      { key: "monto", label: "Monto" },
      { key: "dia", label: "Día" },
      { key: "mes", label: "Mes" },
      { key: "año", label: "Año" },
    ], "finanzas")
    toast.success("Finanzas exportadas")
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <InvoicesHeader onExport={handleExport} />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
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

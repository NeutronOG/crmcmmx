"use client"

import { useState } from "react"
import { ClientsHeader } from "@/components/clients/clients-header"
import { OnboardingPipeline } from "@/components/clients/onboarding-pipeline"
import { ClientsList } from "@/components/clients/clients-list"
import { LiquidBackground } from "@/components/liquid-background"
import { DashboardHeader } from "@/components/dashboard-header"
import { getClientes } from "@/lib/store"
import { exportToCSV } from "@/lib/export-csv"
import { exportClientesToExcel } from "@/lib/excel-utils"
import { toast } from "sonner"

export default function ClientsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleExportCSV = async () => {
    const clientes = await getClientes()
    exportToCSV(clientes, [
      { key: "nombre", label: "Nombre" },
      { key: "empresa", label: "Empresa" },
      { key: "email", label: "Email" },
      { key: "telefono", label: "Teléfono" },
      { key: "estado", label: "Estado" },
      { key: "valorMensual", label: "Valor Mensual" },
      { key: "responsable", label: "Responsable" },
      { key: "fechaInicio", label: "Fecha Inicio" },
      { key: "ultimoContacto", label: "Último Contacto" },
      { key: "notas", label: "Notas" },
    ], "clientes")
    toast.success("Clientes exportados a CSV")
  }

  const handleExportExcel = async () => {
    const clientes = await getClientes()
    exportClientesToExcel(clientes)
    toast.success("Clientes exportados a Excel")
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <ClientsHeader
          onCreated={() => setRefreshKey(k => k + 1)}
          onExportCSV={handleExportCSV}
          onExportExcel={handleExportExcel}
        />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Gestión de Clientes
            </h1>
            <p className="text-lg text-muted-foreground/90">Onboarding automatizado y gestión completa de clientes</p>
          </div>

          <OnboardingPipeline key={`onb-${refreshKey}`} />
          <ClientsList key={`cli-${refreshKey}`} />
        </main>
      </div>
    </div>
  )
}

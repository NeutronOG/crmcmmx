"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { CotizacionesList } from "@/components/cotizaciones/cotizaciones-list"
import { CotizacionesStats } from "@/components/cotizaciones/cotizaciones-stats"
import { CotizacionesKanban } from "@/components/cotizaciones/cotizaciones-kanban"

export default function CotizacionesPage() {
  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-8 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Cotizaciones y Seguimiento
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Gestiona cotizaciones, negociaciones y seguimiento de propuestas
            </p>
          </div>

          <CotizacionesStats />
          <CotizacionesKanban />
          <CotizacionesList />
        </main>
      </div>
    </div>
  )
}

"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { NominaList } from "@/components/nomina/nomina-list"
import { NominaStats } from "@/components/nomina/nomina-stats"
import { NominaPorcentajes } from "@/components/nomina/nomina-porcentajes"

export default function NominaPage() {
  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-8 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
              Nómina y Porcentajes
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Gestión de pagos, comisiones y porcentajes del equipo
            </p>
          </div>

          <NominaStats />
          <NominaPorcentajes />
          <NominaList />
        </main>
      </div>
    </div>
  )
}

"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { ResponsablesList } from "@/components/responsables/responsables-list"
import { ResponsablesStats } from "@/components/responsables/responsables-stats"
import { ResponsablesAsignaciones } from "@/components/responsables/responsables-asignaciones"

export default function ResponsablesPage() {
  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-8 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
              Responsables
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Asignación y seguimiento de responsables por proyecto
            </p>
          </div>

          <ResponsablesStats />
          <ResponsablesAsignaciones />
          <ResponsablesList />
        </main>
      </div>
    </div>
  )
}

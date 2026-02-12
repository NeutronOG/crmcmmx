"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { Calendario } from "@/components/calendario/calendario"

export default function CalendarioPage() {
  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
              Calendario
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Gestiona tu agenda, eventos y fechas de entrega
            </p>
          </div>

          <div className="max-w-5xl">
            <Calendario />
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { ProductosList } from "@/components/productos/productos-list"
import { ProductosStats } from "@/components/productos/productos-stats"
import { ProductosCategorias } from "@/components/productos/productos-categorias"

export default function ProductosPage() {
  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-8 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Productos y Diseño
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Diseño gráfico, pantallas de producto y entregables
            </p>
          </div>

          <ProductosStats />
          <ProductosCategorias />
          <ProductosList />
        </main>
      </div>
    </div>
  )
}

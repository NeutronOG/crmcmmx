import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { RecentClients } from "@/components/recent-clients"
import { ActiveProjects } from "@/components/active-projects"
import { RecentActivity } from "@/components/recent-activity"
import { LiquidBackground } from "@/components/liquid-background"

export default function DashboardPage() {
  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-8 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Panel de Control
            </h1>
            <p className="text-lg text-white/50">Vista general de Central Marketing</p>
          </div>

          <StatsCards />

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentClients />
            <ActiveProjects />
          </div>

          <RecentActivity />
        </main>
      </div>
    </div>
  )
}

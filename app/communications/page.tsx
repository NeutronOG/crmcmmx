import { CommunicationsHeader } from "@/components/communications/communications-header"
import { EmailSequences } from "@/components/communications/email-sequences"
import { AutomationRules } from "@/components/communications/automation-rules"
import { CommunicationStats } from "@/components/communications/communication-stats"
import { LiquidBackground } from "@/components/liquid-background"

export default function CommunicationsPage() {
  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <CommunicationsHeader />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Comunicaciones Automatizadas
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Gestiona secuencias de email, notificaciones y recordatorios automáticos
            </p>
          </div>

          <CommunicationStats />
          <EmailSequences />
          <AutomationRules />
        </main>
      </div>
    </div>
  )
}

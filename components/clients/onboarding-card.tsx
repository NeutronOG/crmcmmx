"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Building2, Mail, Phone, User, Calendar, CheckCircle2, Circle, MoreVertical, ArrowRight, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { updateOnboarding, deleteOnboarding } from "@/lib/store"
import { toast } from "sonner"

type OnboardingClientData = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  stage: string
  progress: number
  startDate: string
  assignedTo: string
  nextStep: string
  briefCompleted: boolean
  kickoffScheduled: boolean
  documentsReceived: boolean
  projectCreated: boolean
}

interface OnboardingCardProps {
  client: OnboardingClientData
  onUpdated: () => void
}

const STAGE_FLOW: Record<string, { next: string; nextLabel: string; progress: number; siguientePaso: string }> = {
  bienvenida: { next: "Documentación", nextLabel: "Pasar a Documentación", progress: 25, siguientePaso: "Recibir documentos corporativos y completar brief" },
  documentación: { next: "Kickoff", nextLabel: "Pasar a Kickoff", progress: 65, siguientePaso: "Agendar y realizar reunión de kickoff" },
  kickoff: { next: "Activo", nextLabel: "Activar Cliente", progress: 100, siguientePaso: "Cliente activo — Proyecto en marcha" },
  activo: { next: "", nextLabel: "", progress: 100, siguientePaso: "Cliente activo — Proyecto en marcha" },
}

export function OnboardingCard({ client, onUpdated }: OnboardingCardProps) {
  const [loading, setLoading] = useState(false)

  const stageInfo = STAGE_FLOW[client.stage] || STAGE_FLOW["bienvenida"]
  const isActive = client.stage === "activo"

  const checklist = [
    { key: "welcome", label: "Email de bienvenida", completed: client.progress >= 10 },
    { key: "documentsReceived", label: "Documentos recibidos", completed: client.documentsReceived },
    { key: "briefCompleted", label: "Brief completado", completed: client.briefCompleted },
    { key: "kickoffScheduled", label: "Kickoff programado", completed: client.kickoffScheduled },
    { key: "projectCreated", label: "Proyecto creado", completed: client.projectCreated },
  ]

  const handleToggleCheck = async (key: string) => {
    setLoading(true)
    try {
      const updates: Record<string, any> = {}
      if (key === "documentsReceived") updates.documentosRecibidos = !client.documentsReceived
      if (key === "briefCompleted") updates.briefCompletado = !client.briefCompleted
      if (key === "kickoffScheduled") updates.kickoffAgendado = !client.kickoffScheduled
      if (key === "projectCreated") updates.proyectoCreado = !client.projectCreated
      if (key === "welcome") {
        updates.progreso = client.progress < 10 ? 10 : client.progress
      }

      // Recalculate progress based on checklist
      const doc = key === "documentsReceived" ? !client.documentsReceived : client.documentsReceived
      const brief = key === "briefCompleted" ? !client.briefCompleted : client.briefCompleted
      const kick = key === "kickoffScheduled" ? !client.kickoffScheduled : client.kickoffScheduled
      const proj = key === "projectCreated" ? !client.projectCreated : client.projectCreated
      const welcome = key === "welcome" ? true : client.progress >= 10
      const completed = [welcome, doc, brief, kick, proj].filter(Boolean).length
      updates.progreso = Math.round((completed / 5) * 100)

      await updateOnboarding(client.id, updates)
      onUpdated()
    } catch {
      toast.error("Error al actualizar")
    } finally {
      setLoading(false)
    }
  }

  const handleAdvanceStage = async () => {
    if (isActive || !stageInfo.next) return
    setLoading(true)
    try {
      await updateOnboarding(client.id, {
        etapa: stageInfo.next as any,
        progreso: stageInfo.progress,
        siguientePaso: stageInfo.siguientePaso,
        // Auto-complete relevant checklist items based on stage
        ...(stageInfo.next === "Documentación" ? {} : {}),
        ...(stageInfo.next === "Kickoff" ? { documentosRecibidos: true, briefCompletado: true } : {}),
        ...(stageInfo.next === "Activo" ? { documentosRecibidos: true, briefCompletado: true, kickoffAgendado: true, proyectoCreado: true } : {}),
      })
      toast.success(`${client.name} avanzó a ${stageInfo.next}`)
      onUpdated()
    } catch {
      toast.error("Error al avanzar etapa")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteOnboarding(client.id)
      toast.success("Registro de onboarding eliminado")
      onUpdated()
    } catch {
      toast.error("Error al eliminar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card p-4 rounded-xl space-y-4 hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{client.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{client.company}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!isActive && (
              <DropdownMenuItem onClick={handleAdvanceStage}>
                <ArrowRight className="h-3 w-3 mr-2" />
                {stageInfo.nextLabel}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground truncate text-xs">{client.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">{client.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">Asignado: {client.assignedTo}</span>
        </div>

        {client.startDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">
              Inicio: {new Date(client.startDate).toLocaleDateString("es-ES")}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-semibold">{client.progress}%</span>
        </div>
        <Progress value={client.progress} className="h-2" />
      </div>

      <div className="space-y-2 pt-2 border-t border-border/40">
        <p className="text-xs font-medium text-muted-foreground">Checklist de Onboarding:</p>
        <div className="space-y-1.5">
          {checklist.map((item) => (
            <button
              key={item.key}
              className="flex items-center gap-2 w-full text-left hover:bg-white/5 rounded-md px-1 py-0.5 transition-colors"
              onClick={() => handleToggleCheck(item.key)}
              disabled={loading}
            >
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 satin-green shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className={`text-xs ${item.completed ? "text-foreground line-through" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {!isActive && (
        <div className="pt-2 border-t border-border/40">
          <p className="text-xs text-muted-foreground mb-2">{client.nextStep}</p>
          <Button
            size="sm"
            className="w-full gap-2 text-xs"
            onClick={handleAdvanceStage}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ArrowRight className="h-3 w-3" />
            )}
            {stageInfo.nextLabel}
          </Button>
        </div>
      )}

      {isActive && (
        <div className="pt-2 border-t border-border/40">
          <Badge className="satin-green-bg satin-green satin-green-border text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Cliente Activo
          </Badge>
        </div>
      )}
    </Card>
  )
}

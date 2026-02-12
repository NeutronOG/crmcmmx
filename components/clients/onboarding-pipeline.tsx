"use client"

import { useState, useEffect, useCallback } from "react"
import { OnboardingCard } from "./onboarding-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { getOnboarding, updateOnboarding, type OnboardingClient } from "@/lib/store"
import { usePipelineDrag } from "@/hooks/use-pipeline-drag"
import { toast } from "sonner"

const stages = [
  { id: "Bienvenida", label: "Bienvenida", color: "satin-blue-solid" },
  { id: "Documentación", label: "Documentación", color: "satin-purple-solid" },
  { id: "Kickoff", label: "Kickoff", color: "satin-yellow-solid" },
  { id: "Activo", label: "Activos", color: "satin-green-bg" },
]

export function OnboardingPipeline() {
  const [onboardingData, setOnboardingData] = useState<OnboardingClient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadOnboarding = async () => {
    setIsLoading(true)
    try {
      const data = await getOnboarding()
      setOnboardingData(data)
    } catch (error) {
      console.error('Error al cargar onboarding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOnboarding()
  }, [])

  const handleChangeStage = useCallback(async (id: string, newStage: string) => {
    try {
      await updateOnboarding(id, { etapa: newStage as OnboardingClient["etapa"] })
      toast.success(`Movido a ${newStage}`)
      await loadOnboarding()
    } catch {
      toast.error("Error al cambiar etapa")
    }
  }, [])

  const {
    draggingId,
    dragOverStage,
    registerColumn,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    onTouchStart,
  } = usePipelineDrag({
    items: onboardingData,
    getId: (c) => c.id,
    getStage: (c) => c.etapa,
    onChangeStage: handleChangeStage,
  })

  // Agrupar por etapa
  const groupedByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = onboardingData.filter(item => item.etapa === stage.id)
    return acc
  }, {} as Record<string, OnboardingClient[]>)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pipeline de Onboarding</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {onboardingData.length} en proceso
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadOnboarding}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <div
            key={stage.id}
            ref={(el) => registerColumn(stage.id, el)}
            className={`space-y-4 rounded-2xl p-1 transition-all duration-200 ${
              dragOverStage === stage.id
                ? "bg-primary/10 ring-2 ring-primary/30 scale-[1.02]"
                : ""
            }`}
            onDragOver={(e) => onDragOver(e, stage.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, stage.id)}
          >
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold">{stage.label}</h3>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {groupedByStage[stage.id]?.length || 0}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {groupedByStage[stage.id]?.map((client) => (
                <div
                  key={client.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, client.id)}
                  onDragEnd={onDragEnd}
                  onTouchStart={(e) => onTouchStart(e, client.id)}
                  className={`transition-all duration-300 select-none cursor-grab active:cursor-grabbing ${
                    draggingId === client.id ? "opacity-40 scale-95" : ""
                  }`}
                >
                  <OnboardingCard client={{
                    id: client.id,
                    name: client.nombre,
                    company: client.empresa,
                    email: client.email,
                    phone: client.telefono,
                    stage: client.etapa.toLowerCase(),
                    progress: client.progreso,
                    startDate: client.fechaInicio,
                    assignedTo: client.responsable,
                    nextStep: client.siguientePaso,
                    briefCompleted: client.briefCompletado,
                    kickoffScheduled: client.kickoffAgendado,
                    documentsReceived: client.documentosRecibidos,
                    projectCreated: client.proyectoCreado,
                  }} onUpdated={loadOnboarding} />
                </div>
              ))}
              {groupedByStage[stage.id]?.length === 0 && (
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                  dragOverStage === stage.id
                    ? "border-primary/50 bg-primary/5"
                    : "border-white/10"
                }`}>
                  <p className="text-sm text-muted-foreground/50">Arrastra aquí</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

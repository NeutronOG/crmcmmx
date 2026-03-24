"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PanelHeader } from "@/components/mi-panel/panel-header"
import { MisProyectos } from "@/components/mi-panel/mis-proyectos"
import { MisTareas } from "@/components/mi-panel/mis-tareas"
import { SubirEvidencias } from "@/components/mi-panel/subir-evidencias"
import { PipelineProyectos } from "@/components/mi-panel/pipeline-proyectos"
import { IdeaRoomList } from "@/components/idea-room/idea-room-list"
import { IdeaRoomChat } from "@/components/idea-room/idea-room-chat"
import { Calendario } from "@/components/calendario/calendario"
import { LiquidBackground } from "@/components/liquid-background"
import { useAuth } from "@/components/auth-provider"
import { getTareaById } from "@/lib/store"
import type { Tarea, IdeaRoom } from "@/lib/store"
import { Briefcase, ClipboardCheck, Upload, Rocket, Lightbulb, Calendar } from "lucide-react"

type Seccion = "proyectos" | "tareas" | "evidencias" | "pipeline" | "idea_room" | "calendario"

const validSecciones: Seccion[] = ["proyectos", "tareas", "evidencias", "pipeline", "idea_room", "calendario"]

export default function MiPanelPage() {
  const { usuario } = useAuth()
  const searchParams = useSearchParams()
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("tareas")

  // Read tab from URL query param (from notification redirect)
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && validSecciones.includes(tab as Seccion)) {
      setSeccionActiva(tab as Seccion)
    }
  }, [searchParams])
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<IdeaRoom | null>(null)

  const handleSelectTarea = (tarea: Tarea) => {
    setTareaSeleccionada(tarea)
    setSeccionActiva("evidencias")
  }

  const handleEvidenciaUpdate = useCallback(async () => {
    if (tareaSeleccionada) {
      const updated = await getTareaById(tareaSeleccionada.id)
      if (updated) setTareaSeleccionada(updated)
    }
  }, [tareaSeleccionada])

  const handleCloseEvidencias = () => {
    setTareaSeleccionada(null)
    setSeccionActiva("tareas")
  }

  const handleSelectRoom = (room: IdeaRoom) => {
    setSelectedRoom(room)
  }

  const secciones: { id: Seccion; label: string; icon: React.ReactNode }[] = [
    { id: "tareas", label: "Mis Tareas", icon: <ClipboardCheck className="size-4" /> },
    { id: "proyectos", label: "Mis Proyectos", icon: <Briefcase className="size-4" /> },
    { id: "evidencias", label: "Subir Avances", icon: <Upload className="size-4" /> },
    { id: "idea_room", label: "Idea Room", icon: <Lightbulb className="size-4" /> },
    { id: "calendario", label: "Calendario", icon: <Calendar className="size-4" /> },
    { id: "pipeline", label: "En Radar", icon: <Rocket className="size-4" /> },
  ]

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <PanelHeader />

        <main className="container mx-auto p-4 sm:p-6 pb-20">
          {/* Welcome */}
          <div className="space-y-2 pt-4 sm:pt-6 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Hola, {usuario?.nombre?.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground">Tu espacio de trabajo en Central Marketing</p>
          </div>

          {/* Navigation tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {secciones.map((sec) => (
              <button
                key={sec.id}
                onClick={() => { setSeccionActiva(sec.id); setSelectedRoom(null) }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  seccionActiva === sec.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10 scale-105"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {sec.icon}
                {sec.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-5xl">
            {seccionActiva === "proyectos" && <MisProyectos />}
            {seccionActiva === "tareas" && <MisTareas onSelectTarea={handleSelectTarea} />}
            {seccionActiva === "evidencias" && (
              <SubirEvidencias
                tarea={tareaSeleccionada}
                onUpdate={handleEvidenciaUpdate}
                onClose={handleCloseEvidencias}
              />
            )}
            {seccionActiva === "pipeline" && <PipelineProyectos />}
            {seccionActiva === "idea_room" && (
              selectedRoom ? (
                <IdeaRoomChat room={selectedRoom} onBack={() => setSelectedRoom(null)} />
              ) : (
                <IdeaRoomList onSelectRoom={handleSelectRoom} />
              )
            )}
            {seccionActiva === "calendario" && <Calendario />}
          </div>
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { CreadoresList } from "@/components/creadores/creadores-list"
import { CreadoresStats } from "@/components/creadores/creadores-stats"
import { CreadoresCalidad } from "@/components/creadores/creadores-calidad"
import { NuevoCreadorDialog } from "@/components/creadores/nuevo-creador-dialog"
import { CalificarCreadorDialog } from "@/components/creadores/calificar-creador-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getCreadores, getAllCalificaciones, deleteCreador } from "@/lib/store"
import type { Creador, CreadorCalificacion } from "@/lib/store"
import { toast } from "sonner"

export default function CreadoresPage() {
  const [creadores, setCreadores] = useState<Creador[]>([])
  const [calificaciones, setCalificaciones] = useState<CreadorCalificacion[]>([])
  const [nuevoOpen, setNuevoOpen] = useState(false)
  const [rateCreador, setRateCreador] = useState<Creador | null>(null)
  const [rateOpen, setRateOpen] = useState(false)

  const load = useCallback(async () => {
    const [c, cal] = await Promise.all([getCreadores(), getAllCalificaciones()])
    setCreadores(c)
    setCalificaciones(cal)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    await deleteCreador(id)
    toast.success("Creador eliminado")
    load()
  }

  const handleRate = (creador: Creador) => {
    setRateCreador(creador)
    setRateOpen(true)
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-8 pb-20">
          <div className="flex items-start justify-between pt-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-balance text-white">
                Creadores de Contenido
              </h1>
              <p className="text-lg text-muted-foreground/90">
                Seguimiento, calidad y gestión de creadores
              </p>
            </div>
            <Button className="gap-2" onClick={() => setNuevoOpen(true)}>
              <Plus className="h-4 w-4" />
              Nuevo Creador
            </Button>
          </div>

          <CreadoresStats creadores={creadores} calificaciones={calificaciones} />
          <CreadoresCalidad creadores={creadores} calificaciones={calificaciones} />
          <CreadoresList
            creadores={creadores}
            calificaciones={calificaciones}
            onRate={handleRate}
            onDelete={handleDelete}
          />
        </main>
      </div>

      <NuevoCreadorDialog open={nuevoOpen} onOpenChange={setNuevoOpen} onCreated={load} />
      <CalificarCreadorDialog creador={rateCreador} open={rateOpen} onOpenChange={setRateOpen} onSaved={load} />
    </div>
  )
}

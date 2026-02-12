"use client"

import { useAuth } from "@/components/auth-provider"
import { EmpresaHeader } from "@/components/mi-empresa/empresa-header"
import { ResumenEjecutivo } from "@/components/mi-empresa/resumen-ejecutivo"
import { TareasDueno } from "@/components/mi-empresa/tareas-dueno"
import { Autorizaciones } from "@/components/mi-empresa/autorizaciones"
import { GestionUsuarios } from "@/components/mi-empresa/gestion-usuarios"
import { LiquidBackground } from "@/components/liquid-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, ClipboardCheck, ShieldCheck, Users } from "lucide-react"

export default function MiEmpresaPage() {
  const { usuario } = useAuth()

  if (!usuario) return null

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />
      <EmpresaHeader />
      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-6 max-w-6xl">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenido, {usuario.nombre.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">Panel ejecutivo de Central Marketing</p>
        </div>

        <Tabs defaultValue="resumen" className="space-y-6">
          <TabsList className="glass border border-white/10 p-1 h-auto flex-wrap">
            <TabsTrigger value="resumen" className="gap-2 data-[state=active]:bg-white/10">
              <BarChart3 className="size-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="tareas" className="gap-2 data-[state=active]:bg-white/10">
              <ClipboardCheck className="size-4" />
              Mis Tareas
            </TabsTrigger>
            <TabsTrigger value="autorizaciones" className="gap-2 data-[state=active]:bg-white/10">
              <ShieldCheck className="size-4" />
              Autorizaciones
            </TabsTrigger>
            <TabsTrigger value="equipo" className="gap-2 data-[state=active]:bg-white/10">
              <Users className="size-4" />
              Equipo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen">
            <ResumenEjecutivo />
          </TabsContent>
          <TabsContent value="tareas">
            <TareasDueno />
          </TabsContent>
          <TabsContent value="autorizaciones">
            <Autorizaciones />
          </TabsContent>
          <TabsContent value="equipo">
            <GestionUsuarios />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

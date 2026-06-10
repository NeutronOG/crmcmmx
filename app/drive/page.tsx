"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { DriveHeader } from "@/components/drive/drive-header"
import { DriveConnect } from "@/components/drive/drive-connect"
import { DriveExplorer } from "@/components/drive/drive-explorer"
import { toast } from "sonner"

export default function DrivePage() {
  const searchParams = useSearchParams()
  const [isConnected, setIsConnected] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Verificar si ya hay sesión de Drive activa llamando a la API
    const error = searchParams.get("error")
    const connected = searchParams.get("connected")

    if (error) {
      toast.error("Error al conectar con Google Drive", { description: error })
    }

    if (connected === "1") {
      setIsConnected(true)
      setChecked(true)
      toast.success("Google Drive conectado correctamente")
      // Limpiar parámetros de la URL sin recargar
      window.history.replaceState({}, "", "/drive")
      return
    }

    // Probar si el token existe intentando cargar archivos
    fetch("/api/drive/files?folderId=root")
      .then(res => {
        setIsConnected(res.status !== 401)
      })
      .catch(() => setIsConnected(false))
      .finally(() => setChecked(true))
  }, [searchParams])

  const handleDisconnect = async () => {
    await fetch("/api/drive/disconnect", { method: "POST" }).catch(() => null)
    setIsConnected(false)
    toast.success("Sesión de Google Drive cerrada")
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <DriveHeader isConnected={isConnected} onDisconnect={handleDisconnect} />

        <main className="container mx-auto p-6 pb-20">
          <div className="space-y-3 pt-6 pb-8">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Google Drive
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Explora y gestiona archivos de tu unidad directamente desde el CRM
            </p>
          </div>

          {!checked ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 rounded-full border-2 border-border border-t-foreground animate-spin" />
            </div>
          ) : isConnected ? (
            <DriveExplorer />
          ) : (
            <DriveConnect />
          )}
        </main>
      </div>
    </div>
  )
}

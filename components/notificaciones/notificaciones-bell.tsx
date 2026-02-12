"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, CheckCheck, X, Lightbulb, ClipboardCheck, Users, Briefcase, MessageSquare, Calendar, ExternalLink } from "lucide-react"
import { getNotificaciones, getNotificacionesNoLeidas, marcarNotificacionLeida, marcarTodasLeidas } from "@/lib/store"
import type { Notificacion } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"

// Map notification tipo → admin route and mi-panel tab
const tipoRouteMap: Record<string, { adminRoute: string; panelTab: string }> = {
  idea_room: { adminRoute: "/idea-room", panelTab: "idea_room" },
  tarea: { adminRoute: "/tareas", panelTab: "tareas" },
  proyecto: { adminRoute: "/projects", panelTab: "proyectos" },
  cliente: { adminRoute: "/clients", panelTab: "proyectos" },
  mensaje: { adminRoute: "/idea-room", panelTab: "idea_room" },
  calendario: { adminRoute: "/calendario", panelTab: "calendario" },
}

export function NotificacionesBell() {
  const { usuario, isAdmin, isDueno } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [noLeidas, setNoLeidas] = useState(0)

  const load = useCallback(async () => {
    if (!usuario) return
    const [notifs, count] = await Promise.all([
      getNotificaciones(usuario.nombre),
      getNotificacionesNoLeidas(usuario.nombre),
    ])
    setNotificaciones(notifs)
    setNoLeidas(count)
  }, [usuario])

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [load])

  const handleNotificacionClick = async (n: Notificacion) => {
    // Mark as read
    if (!n.leida) {
      await marcarNotificacionLeida(n.id)
      await load()
    }
    setOpen(false)

    // Determine destination
    if (n.enlace) {
      // If the notification has an explicit link, use it
      router.push(n.enlace)
      return
    }

    const mapping = tipoRouteMap[n.tipo]
    if (!mapping) return

    if (isDueno) {
      // Dueño stays on /mi-empresa
      router.push("/mi-empresa")
    } else if (isAdmin) {
      router.push(mapping.adminRoute)
    } else {
      // For non-admin, navigate to /mi-panel with tab query param
      router.push(`/mi-panel?tab=${mapping.panelTab}`)
    }
  }

  const handleMarcarTodas = async () => {
    if (!usuario) return
    await marcarTodasLeidas(usuario.nombre)
    await load()
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "idea_room": return <Lightbulb className="size-4 text-white/70" />
      case "tarea": return <ClipboardCheck className="size-4 text-white/70" />
      case "proyecto": return <Briefcase className="size-4 text-white/70" />
      case "cliente": return <Users className="size-4 text-white/70" />
      case "mensaje": return <MessageSquare className="size-4 text-white/70" />
      case "calendario": return <Calendar className="size-4 text-white/70" />
      default: return <Bell className="size-4 text-muted-foreground" />
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Ahora"
    if (mins < 60) return `Hace ${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `Hace ${hrs}h`
    const days = Math.floor(hrs / 24)
    return `Hace ${days}d`
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-white/10 hover:scale-110 transition-all duration-300 relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="size-4" />
        {noLeidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 size-5 bg-[oklch(0.45_0.12_18)] rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse shadow-lg shadow-[oklch(0.45_0.12_18)]/40">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <Card className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Notificaciones</h3>
              <div className="flex items-center gap-1">
                {noLeidas > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-white/10" onClick={handleMarcarTodas}>
                    <CheckCheck className="size-3 mr-1" />
                    Leer todas
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10" onClick={() => setOpen(false)}>
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notificaciones.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Sin notificaciones</p>
                </div>
              ) : (
                notificaciones.slice(0, 20).map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 ${!n.leida ? "bg-white/[0.03]" : ""}`}
                    onClick={() => handleNotificacionClick(n)}
                  >
                    <div className="mt-0.5 shrink-0">{getIcon(n.tipo)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.leida ? "font-medium" : "text-muted-foreground"}`}>{n.titulo}</p>
                      {n.mensaje && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.mensaje}</p>}
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 mt-1">
                      {!n.leida && (
                        <div className="size-2 rounded-full bg-[oklch(0.45_0.12_18)] shrink-0" />
                      )}
                      <ExternalLink className="size-3 text-muted-foreground/40" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

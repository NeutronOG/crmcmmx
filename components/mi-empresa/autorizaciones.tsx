"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Check, X, DollarSign, Megaphone, FileText, Briefcase } from "lucide-react"
import { getProyectos, getLeads, getCotizaciones, crearNotificacion } from "@/lib/store"
import type { Proyecto, Lead, Cotizacion } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

type ItemAutorizacion = {
  id: string
  tipo: "cotizacion" | "proyecto" | "campaña"
  titulo: string
  descripcion: string
  valor: string
  solicitante: string
  fecha: string
  estado: "pendiente" | "aprobado" | "rechazado"
}

export function Autorizaciones() {
  const { usuario } = useAuth()
  const [items, setItems] = useState<ItemAutorizacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCotizaciones(), getProyectos(), getLeads()]).then(([cots, proys, leads]) => {
      const autorizaciones: ItemAutorizacion[] = []

      // Cotizaciones pendientes como autorizaciones
      cots
        .filter((c) => c.estado === "Enviada" || c.estado === "En Negociación")
        .forEach((c) => {
          autorizaciones.push({
            id: `cot-${c.id}`,
            tipo: "cotizacion",
            titulo: `Cotización: ${c.cliente}`,
            descripcion: c.proyecto || "Sin proyecto asignado",
            valor: c.valor ? `$${c.valor.toLocaleString()}` : "$0",
            solicitante: c.responsable || "Equipo",
            fecha: c.fechaCreacion || "",
            estado: "pendiente",
          })
        })

      // Proyectos en planificación como autorizaciones de campaña
      proys
        .filter((p) => p.estado === "Planificación")
        .forEach((p) => {
          autorizaciones.push({
            id: `proy-${p.id}`,
            tipo: "proyecto",
            titulo: `Proyecto: ${p.nombre}`,
            descripcion: `Cliente: ${p.cliente}`,
            valor: p.presupuesto ? `$${p.presupuesto.toLocaleString()}` : "Sin presupuesto",
            solicitante: p.responsable || "Sin asignar",
            fecha: p.fechaInicio || "",
            estado: "pendiente",
          })
        })

      // Leads en negociación como autorizaciones de campaña
      leads
        .filter((l) => l.estado === "Negociación" || l.estado === "Propuesta")
        .forEach((l) => {
          autorizaciones.push({
            id: `lead-${l.id}`,
            tipo: "campaña",
            titulo: `Campaña: ${l.nombre}`,
            descripcion: l.empresa || "Sin empresa",
            valor: l.valorEstimado > 0 ? `$${l.valorEstimado.toLocaleString()}` : "Por definir",
            solicitante: l.responsable || "Equipo",
            fecha: l.fechaCreacion || "",
            estado: "pendiente",
          })
        })

      setItems(autorizaciones)
      setLoading(false)
    })
  }, [])

  const handleAutorizar = async (id: string) => {
    const item = items.find((i) => i.id === id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, estado: "aprobado" as const } : i)))
    toast.success("Autorización aprobada")
    // Notify admin (Neyda) that Guillermo approved
    if (item) {
      await crearNotificacion({
        usuarioDestino: "Neyda",
        tipo: item.tipo === "cotizacion" ? "cliente" : "proyecto",
        titulo: `${usuario?.nombre || "Dueño"} aprobó: ${item.titulo}`,
        mensaje: `Valor: ${item.valor} — Aprobado para proceder`,
      })
    }
  }

  const handleRechazar = async (id: string) => {
    const item = items.find((i) => i.id === id)
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, estado: "rechazado" as const } : i)))
    toast.success("Autorización rechazada")
    // Notify admin (Neyda) that Guillermo rejected
    if (item) {
      await crearNotificacion({
        usuarioDestino: "Neyda",
        tipo: item.tipo === "cotizacion" ? "cliente" : "proyecto",
        titulo: `${usuario?.nombre || "Dueño"} rechazó: ${item.titulo}`,
        mensaje: `Valor: ${item.valor} — Rechazado`,
      })
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "cotizacion": return <FileText className="size-4" />
      case "proyecto": return <Briefcase className="size-4" />
      case "campaña": return <Megaphone className="size-4" />
      default: return <DollarSign className="size-4" />
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "cotizacion": return "satin-blue"
      case "proyecto": return "satin-purple"
      case "campaña": return "satin-yellow"
      default: return "text-white/60"
    }
  }

  const getTipoBg = (tipo: string) => {
    switch (tipo) {
      case "cotizacion": return "satin-blue-bg"
      case "proyecto": return "satin-purple-bg"
      case "campaña": return "satin-yellow-bg"
      default: return "bg-white/10"
    }
  }

  const pendientes = items.filter((i) => i.estado === "pendiente")
  const resueltos = items.filter((i) => i.estado !== "pendiente")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl satin-green-bg flex items-center justify-center">
          <ShieldCheck className="size-5 satin-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Autorizaciones</h2>
          <p className="text-sm text-muted-foreground">
            {pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""} de aprobación
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-muted-foreground">Cargando autorizaciones...</div>
        </div>
      ) : pendientes.length === 0 && resueltos.length === 0 ? (
        <Card className="glass-card p-8 rounded-xl text-center">
          <ShieldCheck className="size-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No hay elementos pendientes de autorización</p>
        </Card>
      ) : (
        <>
          {pendientes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Pendientes</h3>
              {pendientes.map((item) => (
                <Card key={item.id} className="glass-card p-4 rounded-xl hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getTipoBg(item.tipo)} shrink-0 mt-0.5`}>
                        <div className={getTipoColor(item.tipo)}>{getTipoIcon(item.tipo)}</div>
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{item.titulo}</span>
                          <Badge variant="outline" className="text-[10px] rounded-full satin-yellow-bg satin-yellow border satin-yellow-border">
                            Pendiente
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.descripcion}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="satin-green font-medium">{item.valor}</span>
                          <span>Solicitante: {item.solicitante}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="h-8 text-xs rounded-full satin-green-bg satin-green border satin-green-border hover:opacity-80"
                        onClick={() => handleAutorizar(item.id)}
                      >
                        <Check className="size-3 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs rounded-full satin-red-bg satin-red border satin-red-border hover:opacity-80"
                        onClick={() => handleRechazar(item.id)}
                      >
                        <X className="size-3 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {resueltos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Resueltos</h3>
              {resueltos.map((item) => (
                <Card key={item.id} className="glass-card p-4 rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTipoBg(item.tipo)} shrink-0`}>
                      <div className={getTipoColor(item.tipo)}>{getTipoIcon(item.tipo)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm">{item.titulo}</span>
                      <p className="text-xs text-muted-foreground">{item.valor}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] rounded-full ${
                        item.estado === "aprobado"
                          ? "satin-green-bg satin-green border satin-green-border"
                          : "satin-red-bg satin-red border satin-red-border"
                      }`}
                    >
                      {item.estado === "aprobado" ? "Aprobado" : "Rechazado"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

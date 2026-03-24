"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DollarSign, Calendar, MoreVertical, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCotizaciones, updateCotizacion, deleteCotizacion } from "@/lib/store"
import type { Cotizacion } from "@/lib/store"
import { toast } from "sonner"

const COLUMNAS: { id: Cotizacion["estado"]; titulo: string; color: string }[] = [
  { id: "Borrador", titulo: "Borrador", color: "#6b7280" },
  { id: "Enviada", titulo: "Enviada", color: "#3b82f6" },
  { id: "En Negociación", titulo: "En Negociación", color: "#a855f7" },
  { id: "Aprobada", titulo: "Aprobada", color: "#22c55e" },
  { id: "Rechazada", titulo: "Rechazada", color: "#ef4444" },
]

interface CotizacionesKanbanProps {
  refreshKey?: number
  onRefresh?: () => void
}

export function CotizacionesKanban({ refreshKey, onRefresh }: CotizacionesKanbanProps) {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await getCotizaciones()
    setCotizaciones(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [refreshKey])

  const handleCambiarEstado = async (id: string, estado: Cotizacion["estado"]) => {
    setCotizaciones(prev => prev.map(c => c.id === id ? { ...c, estado } : c))
    await updateCotizacion(id, { estado })
    toast.success(`Cotización movida a ${estado}`)
    onRefresh?.()
  }

  const handleEliminar = async (id: string) => {
    await deleteCotizacion(id)
    toast.success("Cotización eliminada")
    await load()
    onRefresh?.()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNAS.map(c => (
          <Card key={c.id} className="glass border-white/10">
            <CardContent className="p-4 space-y-3">
              {[1,2].map(i => <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />)}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {COLUMNAS.map((columna) => {
        const items = cotizaciones.filter(c => c.estado === columna.id)
        const totalValor = items.reduce((s, c) => s + c.valor, 0)
        return (
          <Card key={columna.id} className="glass border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: columna.color }} />
                {columna.titulo}
                <Badge variant="secondary" className="ml-auto text-xs">{items.length}</Badge>
              </CardTitle>
              {items.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  ${totalValor.toLocaleString("es-MX")}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4 opacity-50">Sin cotizaciones</p>
              )}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group border border-white/5"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-[10px]">
                          {item.cliente.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-xs truncate">{item.cliente}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100 shrink-0">
                          <MoreVertical className="size-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {COLUMNAS.filter(c => c.id !== item.estado).map(c => (
                          <DropdownMenuItem key={c.id} onClick={() => handleCambiarEstado(item.id, c.id)}>
                            Mover a {c.titulo}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem className="text-red-400" onClick={() => handleEliminar(item.id)}>
                          <Trash2 className="size-3 mr-1" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {item.proyecto && (
                    <p className="text-[10px] text-muted-foreground truncate mb-1">{item.proyecto}</p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="size-3 text-green-400" />
                      <span className="text-green-400 font-medium">${item.valor.toLocaleString("es-MX")}</span>
                    </div>
                    {item.fechaVencimiento && (
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {item.fechaVencimiento}
                      </div>
                    )}
                  </div>
                  {item.responsable && (
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">👤 {item.responsable}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

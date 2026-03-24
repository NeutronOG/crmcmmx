"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Calendar, DollarSign, FileText, Trash2 } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { getCotizaciones, updateCotizacion, deleteCotizacion } from "@/lib/store"
import type { Cotizacion } from "@/lib/store"
import { toast } from "sonner"

const ESTADO_COLORS: Record<Cotizacion["estado"], string> = {
  Borrador: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Enviada: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "En Negociación": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Aprobada: "bg-green-500/20 text-green-400 border-green-500/30",
  Rechazada: "bg-red-500/20 text-red-400 border-red-500/30",
}

interface CotizacionesListProps {
  refreshKey?: number
  onRefresh?: () => void
}

export function CotizacionesList({ refreshKey, onRefresh }: CotizacionesListProps) {
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
    toast.success(`Cotización actualizada a ${estado}`)
    onRefresh?.()
  }

  const handleEliminar = async (id: string) => {
    await deleteCotizacion(id)
    toast.success("Cotización eliminada")
    await load()
    onRefresh?.()
  }

  const handleAgregarSeguimiento = async (id: string) => {
    const cot = cotizaciones.find(c => c.id === id)
    if (!cot) return
    await updateCotizacion(id, { seguimientos: cot.seguimientos + 1 })
    toast.success("Seguimiento registrado")
    await load()
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Historial de Cotizaciones</span>
          <Badge variant="secondary" className="ml-auto">{cotizaciones.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />)}
          </div>
        ) : cotizaciones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No hay cotizaciones registradas</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>Cliente</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Seguimientos</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotizaciones.map((cot) => (
                <TableRow key={cot.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
                          {cot.cliente.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{cot.cliente}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cot.proyecto || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-400 font-medium text-sm">
                      <DollarSign className="h-3.5 w-3.5" />
                      {cot.valor.toLocaleString("es-MX")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs border ${ESTADO_COLORS[cot.estado]}`}>{cot.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    {cot.fechaVencimiento ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {cot.fechaVencimiento}
                      </div>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{cot.seguimientos} contactos</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cot.responsable || "—"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCambiarEstado(cot.id, "Enviada")}>Marcar Enviada</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCambiarEstado(cot.id, "Aprobada")}>Marcar Aprobada</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCambiarEstado(cot.id, "Rechazada")}>Marcar Rechazada</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAgregarSeguimiento(cot.id)}>Agregar seguimiento</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400" onClick={() => handleEliminar(cot.id)}>
                          <Trash2 className="size-3 mr-1" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

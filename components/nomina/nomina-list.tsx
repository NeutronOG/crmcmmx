"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Calendar, CheckCircle, Clock, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getNominaEmpleados, updateNominaEmpleado } from "@/lib/store"
import type { NominaEmpleado } from "@/lib/store"
import { toast } from "sonner"

const estadoStyle: Record<NominaEmpleado["estado"], string> = {
  Pagado: "satin-green-bg satin-green",
  Pendiente: "satin-yellow-bg satin-yellow",
  Procesando: "bg-white/10 satin-blue",
}

export function NominaList() {
  const [empleados, setEmpleados] = useState<NominaEmpleado[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    getNominaEmpleados().then(d => { setEmpleados(d); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleEstado = async (id: string, estado: NominaEmpleado["estado"]) => {
    setUpdating(id)
    try {
      await updateNominaEmpleado(id, { estado })
      setEmpleados(prev => prev.map(e => e.id === id ? { ...e, estado } : e))
      toast.success("Estado actualizado")
    } catch { toast.error("Error al actualizar") } finally { setUpdating(null) }
  }

  if (loading) return <p className="text-sm text-muted-foreground py-6 text-center">Cargando nómina...</p>

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 satin-green" />
          Registro de Nómina
        </CardTitle>
      </CardHeader>
      <CardContent>
        {empleados.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Sin empleados registrados. Ejecuta el SQL para agregar los usuarios al sistema.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>Empleado</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Salario Base</TableHead>
                <TableHead>Bonos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empleados.map(e => (
                <TableRow key={e.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
                          {e.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{e.nombre}</p>
                        <p className="text-xs text-muted-foreground">{e.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{e.rol}</Badge></TableCell>
                  <TableCell className="font-medium">${e.salarioBase.toLocaleString("es-MX")}</TableCell>
                  <TableCell className="satin-green">${e.bonos.toLocaleString("es-MX")}</TableCell>
                  <TableCell className="font-bold">${(e.salarioBase + e.bonos).toLocaleString("es-MX")}</TableCell>
                  <TableCell>
                    {updating === e.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Select value={e.estado} onValueChange={v => handleEstado(e.id, v as NominaEmpleado["estado"])}>
                        <SelectTrigger className="h-7 w-32 text-xs border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="Procesando">Procesando</SelectItem>
                          <SelectItem value="Pagado">Pagado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {e.fechaPago || "—"}
                    </div>
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

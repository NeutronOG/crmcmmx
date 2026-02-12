"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, ArrowRight, Calendar, DollarSign, FileText, Download, Send } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const cotizaciones: {
  id: string; cliente: string; proyecto: string; valor: string;
  estado: string; estadoColor: string; fechaCreacion: string;
  fechaVencimiento: string; seguimiento: number;
}[] = []

export function CotizacionesList() {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Historial de Cotizaciones</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Ver todas <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Seguimientos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cotizaciones.map((cotizacion) => (
              <TableRow key={cotizacion.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-mono text-sm">{cotizacion.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
                        {cotizacion.cliente.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {cotizacion.cliente}
                  </div>
                </TableCell>
                <TableCell>{cotizacion.proyecto}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 satin-green font-medium">
                    <DollarSign className="h-4 w-4" />
                    {cotizacion.valor}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cotizacion.estadoColor}>{cotizacion.estado}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {cotizacion.fechaVencimiento}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{cotizacion.seguimiento} contactos</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Send className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="">
                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem>Agregar seguimiento</DropdownMenuItem>
                        <DropdownMenuItem>Convertir a proyecto</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

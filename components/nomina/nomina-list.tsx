"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, ArrowRight, DollarSign, Calendar, CheckCircle, Clock } from "lucide-react"
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

const empleados = [
  {
    id: 1,
    nombre: "María García",
    rol: "Director Creativo",
    salarioBase: "$3,500",
    comision: "$2,250",
    total: "$5,750",
    estado: "Pagado",
    estadoColor: "satin-green-bg satin-green",
    fechaPago: "1 Dic 2024",
  },
  {
    id: 2,
    nombre: "Carlos Ruiz",
    rol: "Diseñador Senior",
    salarioBase: "$2,800",
    comision: "$1,500",
    total: "$4,300",
    estado: "Pagado",
    estadoColor: "satin-green-bg satin-green",
    fechaPago: "1 Dic 2024",
  },
  {
    id: 3,
    nombre: "Ana López",
    rol: "Community Manager",
    salarioBase: "$2,200",
    comision: "$880",
    total: "$3,080",
    estado: "Pendiente",
    estadoColor: "satin-yellow-bg satin-yellow",
    fechaPago: "15 Dic 2024",
  },
  {
    id: 4,
    nombre: "Juan Pérez",
    rol: "Ejecutivo de Cuentas",
    salarioBase: "$2,500",
    comision: "$1,800",
    total: "$4,300",
    estado: "Pendiente",
    estadoColor: "satin-yellow-bg satin-yellow",
    fechaPago: "15 Dic 2024",
  },
  {
    id: 5,
    nombre: "Laura Martínez",
    rol: "Creador de Contenido",
    salarioBase: "$1,800",
    comision: "$450",
    total: "$2,250",
    estado: "Procesando",
    estadoColor: "bg-white/10 satin-blue",
    fechaPago: "15 Dic 2024",
  },
]

export function NominaList() {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 satin-green" />
            <span>Registro de Nómina</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Ver historial <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>Empleado</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Salario Base</TableHead>
              <TableHead>Comisión</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Pago</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleados.map((empleado) => (
              <TableRow key={empleado.id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
                        {empleado.nombre.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {empleado.nombre}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{empleado.rol}</Badge>
                </TableCell>
                <TableCell>{empleado.salarioBase}</TableCell>
                <TableCell className="satin-green">{empleado.comision}</TableCell>
                <TableCell className="font-bold">{empleado.total}</TableCell>
                <TableCell>
                  <Badge className={empleado.estadoColor}>
                    {empleado.estado === "Pagado" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {empleado.estado === "Pendiente" && <Clock className="h-3 w-3 mr-1" />}
                    {empleado.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {empleado.fechaPago}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="">
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Procesar pago</DropdownMenuItem>
                      <DropdownMenuItem>Ver historial</DropdownMenuItem>
                      <DropdownMenuItem>Generar recibo</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

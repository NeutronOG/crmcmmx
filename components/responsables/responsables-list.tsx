"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, ArrowRight, Briefcase, CheckCircle, Clock, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getProyectos, getTareas } from "@/lib/store"
import { getUsuarios, rolesLabels } from "@/lib/auth"

type ResponsableData = {
  id: string
  nombre: string
  email: string
  rol: string
  proyectosActivos: number
  tareasCompletadas: number
  tareasPendientes: number
  estado: string
  estadoColor: string
  cargaTrabajo: number
}

export function ResponsablesList() {
  const [responsables, setResponsables] = useState<ResponsableData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUsuarios(), getProyectos(), getTareas()]).then(([users, proyectos, tareas]) => {
      const data = users.filter(u => u.rol !== "admin").map(u => {
        const misProyectos = proyectos.filter(p => p.responsable === u.nombre && p.estado !== "Completado").length
        const misTareasComp = tareas.filter(t => t.asignado === u.nombre && t.estado === "Completada").length
        const misTareasPend = tareas.filter(t => t.asignado === u.nombre && t.estado !== "Completada").length
        // Carga basada en proyectos activos: >= 6 = sobrecargado, 4-5 = ocupado, < 4 = disponible
        const carga = Math.min(100, Math.round((misProyectos / 6) * 100))
        const estado = misProyectos >= 6 ? "Sobrecargado" : misProyectos >= 4 ? "Ocupado" : "Disponible"
        const estadoColor = misProyectos >= 6 ? "satin-red-bg satin-red" : misProyectos >= 4 ? "satin-yellow-bg satin-yellow" : "satin-green-bg satin-green"
        return {
          id: u.id,
          nombre: u.nombre,
          email: u.email,
          rol: rolesLabels[u.rol] || u.rol,
          proyectosActivos: misProyectos,
          tareasCompletadas: misTareasComp,
          tareasPendientes: misTareasPend,
          estado,
          estadoColor,
          cargaTrabajo: carga,
        }
      })
      setResponsables(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="text-center py-8"><div className="animate-pulse text-muted-foreground">Cargando responsables...</div></div>
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Equipo de Responsables</span>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Ver todos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {responsables.map((responsable) => (
            <div
              key={responsable.id}
              className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                    {responsable.nombre.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    {responsable.nombre}
                  </h4>
                  <p className="text-sm text-muted-foreground">{responsable.email}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {responsable.rol}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center hidden md:block">
                  <div className="flex items-center gap-1 justify-center">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-bold">{responsable.proyectosActivos}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Proyectos</p>
                </div>

                <div className="text-center hidden lg:block">
                  <div className="flex items-center gap-1 justify-center satin-green">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-bold">{responsable.tareasCompletadas}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Completadas</p>
                </div>

                <div className="text-center hidden lg:block">
                  <div className="flex items-center gap-1 justify-center satin-yellow">
                    <Clock className="h-4 w-4" />
                    <span className="font-bold">{responsable.tareasPendientes}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>

                <div className="hidden xl:flex flex-col items-center gap-1">
                  <div className="text-xs text-muted-foreground">Carga (proy)</div>
                  <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        responsable.proyectosActivos >= 6 ? 'satin-red-solid' :
                        responsable.proyectosActivos >= 4 ? 'satin-yellow-solid' : 'satin-green-bg'
                      }`}
                      style={{ width: `${Math.min(100, (responsable.proyectosActivos / 6) * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium">{responsable.proyectosActivos}/6</div>
                </div>

                <Badge className={responsable.estadoColor}>
                  {responsable.estado === "Sobrecargado" && <AlertCircle className="h-3 w-3 mr-1" />}
                  {responsable.estado}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="">
                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                    <DropdownMenuItem>Ver proyectos</DropdownMenuItem>
                    <DropdownMenuItem>Asignar tarea</DropdownMenuItem>
                    <DropdownMenuItem>Ver rendimiento</DropdownMenuItem>
                    <DropdownMenuItem>Reasignar proyectos</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

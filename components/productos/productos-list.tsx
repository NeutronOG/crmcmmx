"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, ArrowRight, Calendar, Eye, Download, Palette } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const productos = [
  {
    id: 1,
    nombre: "Logo TechStart",
    cliente: "TechStart Inc.",
    categoria: "Diseño Gráfico",
    estado: "Completado",
    estadoColor: "satin-green-bg satin-green",
    fecha: "15 Dic 2024",
    versiones: 5,
    responsable: "María G.",
  },
  {
    id: 2,
    nombre: "App Móvil Fitness",
    cliente: "Fitness Pro",
    categoria: "Pantallas UI/UX",
    estado: "En Revisión",
    estadoColor: "satin-yellow-bg satin-yellow",
    fecha: "14 Dic 2024",
    versiones: 3,
    responsable: "Carlos R.",
  },
  {
    id: 3,
    nombre: "Pack Redes Sociales",
    cliente: "Café Artesanal",
    categoria: "Contenido Visual",
    estado: "En Progreso",
    estadoColor: "bg-white/10 satin-blue",
    fecha: "12 Dic 2024",
    versiones: 2,
    responsable: "Ana L.",
  },
  {
    id: 4,
    nombre: "Video Promocional",
    cliente: "Restaurant Gourmet",
    categoria: "Video & Motion",
    estado: "Pendiente",
    estadoColor: "bg-gray-500/20 text-gray-400",
    fecha: "10 Dic 2024",
    versiones: 1,
    responsable: "Juan P.",
  },
  {
    id: 5,
    nombre: "Identidad Corporativa",
    cliente: "Inmobiliaria Plus",
    categoria: "Diseño Gráfico",
    estado: "Completado",
    estadoColor: "satin-green-bg satin-green",
    fecha: "8 Dic 2024",
    versiones: 8,
    responsable: "Laura M.",
  },
]

export function ProductosList() {
  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <span>Productos Recientes</span>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            Ver todos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Palette className="h-8 w-8 text-primary/60" />
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    {producto.nombre}
                  </h4>
                  <p className="text-sm text-muted-foreground">{producto.cliente}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {producto.categoria}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      v{producto.versiones}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <div className="flex items-center gap-1 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-secondary/20">
                        {producto.responsable.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">{producto.responsable}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    {producto.fecha}
                  </div>
                </div>

                <Badge className={producto.estadoColor}>{producto.estado}</Badge>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="">
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Nueva versión</DropdownMenuItem>
                      <DropdownMenuItem>Compartir</DropdownMenuItem>
                      <DropdownMenuItem>Archivar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

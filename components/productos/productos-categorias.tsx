"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Palette, Monitor, FileImage, Video, PenTool, Layout, Plus } from "lucide-react"

const categorias = [
  {
    id: 1,
    nombre: "Diseño Gráfico",
    descripcion: "Logos, branding, material impreso",
    icon: Palette,
    color: "from-[oklch(0.70_0.10_350)] to-[oklch(0.68_0.12_18)]",
    items: 45,
    activos: 12,
  },
  {
    id: 2,
    nombre: "Pantallas UI/UX",
    descripcion: "Interfaces, wireframes, prototipos",
    icon: Monitor,
    color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.48_0.14_275)]",
    items: 89,
    activos: 23,
  },
  {
    id: 3,
    nombre: "Contenido Visual",
    descripcion: "Posts, stories, banners",
    icon: FileImage,
    color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.14_300)]",
    items: 156,
    activos: 34,
  },
  {
    id: 4,
    nombre: "Video & Motion",
    descripcion: "Reels, animaciones, videos",
    icon: Video,
    color: "from-[oklch(0.74_0.11_55)] to-[oklch(0.76_0.10_70)]",
    items: 67,
    activos: 8,
  },
  {
    id: 5,
    nombre: "Ilustraciones",
    descripcion: "Ilustraciones personalizadas",
    icon: PenTool,
    color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]",
    items: 34,
    activos: 5,
  },
  {
    id: 6,
    nombre: "Templates",
    descripcion: "Plantillas reutilizables",
    icon: Layout,
    color: "from-[oklch(0.72_0.08_200)] to-[oklch(0.55_0.10_200)]",
    items: 28,
    activos: 15,
  },
]

export function ProductosCategorias() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categorias.map((categoria) => (
        <Card
          key={categoria.id}
          className="glass border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${categoria.color} group-hover:scale-110 transition-transform duration-300`}>
                <categoria.icon className="h-6 w-6 text-white" />
              </div>
              <Badge variant="outline" className="text-xs">
                {categoria.activos} activos
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
              {categoria.nombre}
            </CardTitle>
            <p className="text-sm text-muted-foreground mb-3">{categoria.descripcion}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{categoria.items}</span>
              <span className="text-xs text-muted-foreground">productos</span>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="glass border-white/10 border-dashed hover:border-primary/50 transition-all duration-300 cursor-pointer group flex items-center justify-center min-h-[200px]">
        <CardContent className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <Plus className="h-8 w-8" />
          <span className="text-sm font-medium">Nueva Categoría</span>
        </CardContent>
      </Card>
    </div>
  )
}

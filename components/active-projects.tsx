"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { getProyectos } from "@/lib/store"
import Link from "next/link"

const gradients = [
  "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]",
  "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.14_300)]",
  "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]",
  "from-[oklch(0.78_0.10_85)] to-[oklch(0.62_0.12_85)]",
  "from-[oklch(0.72_0.08_200)] to-[oklch(0.55_0.10_200)]",
]

export function ActiveProjects() {
  const [projects, setProjects] = useState<{ name: string; client: string; progress: number; status: string; deadline: string; gradient: string }[]>([])

  useEffect(() => {
    getProyectos().then((data) => {
      const activos = data.filter(p => p.estado !== "Completado").slice(0, 5)
      setProjects(activos.map((p, i) => {
        let deadline = ""
        if (p.fechaEntrega) {
          const days = Math.ceil((new Date(p.fechaEntrega).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          deadline = days > 0 ? `${days} días` : days === 0 ? "Hoy" : `${Math.abs(days)}d atrás`
        }
        return {
          name: p.nombre,
          client: p.cliente,
          progress: p.progreso,
          status: p.estado,
          deadline,
          gradient: gradients[i % gradients.length],
        }
      }))
    })
  }, [])

  return (
    <Card className="glass-intense border-white/10 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold">Proyectos Activos</CardTitle>
          <CardDescription className="text-muted-foreground/80">Proyectos en curso y su progreso</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="hover:bg-white/10 gap-2 group">
          Ver todos
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="space-y-3 p-4 rounded-2xl glass-subtle hover:glass-intense transition-all duration-300 group border border-white/5 hover:border-white/20"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="font-semibold leading-none text-white group-hover:text-white/80 transition-colors duration-300">
                    {project.name}
                  </p>
                  <p className="text-sm text-muted-foreground/80">{project.client}</p>
                </div>
                <Badge
                  variant="outline"
                  className="gap-1.5 glass-subtle border-white/20 group-hover:border-white/40 transition-all duration-300"
                >
                  <Clock className="size-3" />
                  {project.deadline}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground/80">{project.status}</span>
                  <span className="font-bold text-white">{project.progress}%</span>
                </div>
                <div className="relative h-3 rounded-full glass-subtle overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${project.gradient} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                    style={{ width: `${project.progress}%` }}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                      style={{
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

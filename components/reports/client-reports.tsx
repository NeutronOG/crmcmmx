"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Send, Calendar, Briefcase, Users, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { getClientes, getProyectos } from "@/lib/store"

interface ClientReport {
  id: string
  client: string
  proyectosActivos: number
  proyectosCompletados: number
  totalProyectos: number
  estado: string
}

export function ClientReports() {
  const [reports, setReports] = useState<ClientReport[]>([])

  useEffect(() => {
    Promise.all([getClientes(), getProyectos()]).then(([clientes, proyectos]) => {
      const clientReports = clientes.map(cliente => {
        const clientProjects = proyectos.filter(p => p.cliente === cliente.empresa || p.cliente === cliente.nombre)
        const activos = clientProjects.filter(p => p.estado !== "Completado" && p.estado !== "Pausado").length
        const completados = clientProjects.filter(p => p.estado === "Completado").length
        
        return {
          id: cliente.id,
          client: cliente.empresa || cliente.nombre,
          proyectosActivos: activos,
          proyectosCompletados: completados,
          totalProyectos: clientProjects.length,
          estado: cliente.estado,
        }
      }).filter(r => r.totalProyectos > 0 || r.estado === "Activo")

      setReports(clientReports)
    })
  }, [])

  if (reports.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reportes de Clientes</h2>
        </div>
        <Card className="glass-card p-8 rounded-xl text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Sin reportes disponibles</h3>
          <p className="text-muted-foreground">Agrega clientes y proyectos para generar reportes automáticos.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reportes de Clientes</h2>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="glass-card p-6 rounded-xl hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{report.client}</h3>
                      <Badge
                        variant={report.estado === "Activo" ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {report.estado}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Proyectos Activos</p>
                    <p className="text-lg font-bold satin-blue">{report.proyectosActivos}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Completados</p>
                    <p className="text-lg font-bold satin-green">{report.proyectosCompletados}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-foreground">{report.totalProyectos}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Send className="h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

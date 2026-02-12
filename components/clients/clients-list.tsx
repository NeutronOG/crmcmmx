"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, DollarSign, Calendar, MoreVertical, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getClientes, type Cliente } from "@/lib/store"

export function ClientsList() {
  const [clientes, setClientesState] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadClientes = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    try {
      const data = await getClientes()
      setClientesState(data)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClientes()
  }, [])

  const getStatusBadge = (estado: Cliente["estado"]) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline", label: string, color: string }> = {
      "Activo": { variant: "default", label: "Activo", color: "satin-green" },
      "Inactivo": { variant: "secondary", label: "Inactivo", color: "text-white/40" },
      "Prospecto": { variant: "outline", label: "Prospecto", color: "satin-yellow" },
      "En Onboarding": { variant: "outline", label: "Onboarding", color: "text-white/70" },
    }
    return variants[estado] || variants["Prospecto"]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes Activos ({clientes.length})</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => loadClientes()}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid gap-4">
        {clientes.map((cliente) => {
          const statusInfo = getStatusBadge(cliente.estado)

          return (
            <Card
              key={cliente.id}
              className="glass-card p-6 rounded-xl hover:scale-[1.01] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="size-12 border-2 border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-lg font-semibold">
                      {cliente.nombre
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {cliente.nombre}
                      </h3>
                      <Badge variant={statusInfo.variant} className="rounded-full">
                        {statusInfo.label}
                      </Badge>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {cliente.etapaOnboarding}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{cliente.empresa}</span>
                      <span className="text-sm text-muted-foreground">• {cliente.email}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Valor Mensual</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 satin-green" />
                          <p className="text-sm font-semibold satin-green">
                            ${cliente.valorMensual.toLocaleString("es-MX")}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Responsable</p>
                        <p className="text-sm font-semibold text-foreground">{cliente.responsable}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Cliente desde</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 satin-blue" />
                          <p className="text-sm font-semibold text-foreground">
                            {cliente.fechaInicio ? new Date(cliente.fechaInicio).toLocaleDateString("es-ES") : "Pendiente"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Último contacto</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 satin-blue" />
                          <p className="text-sm font-semibold text-foreground">
                            {new Date(cliente.ultimoContacto).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {cliente.notas && (
                      <div className="text-xs text-muted-foreground bg-white/5 p-2 rounded">
                        📝 {cliente.notas}
                      </div>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="">
                    <DropdownMenuItem>Ver perfil completo</DropdownMenuItem>
                    <DropdownMenuItem>Ver proyectos</DropdownMenuItem>
                    <DropdownMenuItem>Ver facturas</DropdownMenuItem>
                    <DropdownMenuItem>Programar reunión</DropdownMenuItem>
                    <DropdownMenuItem>Editar cliente</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

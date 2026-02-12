"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Mail, Phone, Calendar } from "lucide-react"
import { getClientesByUsuario } from "@/lib/store"
import type { Cliente } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"

export function MisClientes() {
  const { usuario } = useAuth()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!usuario) return
    getClientesByUsuario(usuario.nombre).then((data) => {
      setClientes(data)
      setLoading(false)
    })
  }, [usuario])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activo": return "satin-green-bg satin-green satin-green-border"
      case "Inactivo": return "bg-white/5 text-white/40 border-white/10"
      case "Prospecto": return "satin-yellow-bg satin-yellow satin-yellow-border"
      case "En Onboarding": return "satin-yellow-bg satin-yellow satin-yellow-border"
      default: return ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl satin-blue-bg flex items-center justify-center">
          <Users className="size-5 satin-blue" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mis Clientes</h2>
          <p className="text-sm text-muted-foreground">{clientes.length} cliente{clientes.length !== 1 ? "s" : ""} asignado{clientes.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-muted-foreground">Cargando clientes...</div>
        </div>
      ) : clientes.length === 0 ? (
        <Card className="glass-card p-8 rounded-xl text-center">
          <Users className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No tienes clientes asignados</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {clientes.map((cliente) => (
            <Card key={cliente.id} className="glass-card p-4 rounded-xl hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{cliente.nombre}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Building2 className="size-3" />
                    <span className="truncate">{cliente.empresa}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`rounded-full text-xs shrink-0 ml-2 ${getEstadoColor(cliente.estado)}`}>
                  {cliente.estado}
                </Badge>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {cliente.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="size-3" />
                    <span className="truncate">{cliente.email}</span>
                  </div>
                )}
                {cliente.telefono && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3" />
                    <span>{cliente.telefono}</span>
                  </div>
                )}
                {cliente.fechaInicio && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3" />
                    <span>Desde {cliente.fechaInicio}</span>
                  </div>
                )}
              </div>
              {cliente.valorMensual > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-sm font-medium satin-green">
                    ${cliente.valorMensual.toLocaleString()}/mes
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

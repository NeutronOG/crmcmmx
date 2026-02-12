"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import { LiquidBackground } from "@/components/liquid-background"
import { getUsuarios, rolesLabels } from "@/lib/auth"
import type { Usuario } from "@/lib/auth"

interface LoginScreenProps {
  onLogin: (usuario: Usuario) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [busqueda, setBusqueda] = useState("")
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsuarios().then((data) => {
      setUsuarios(data)
      setLoading(false)
    })
  }, [])

  const filtrados = usuarios.filter((u) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      rolesLabels[u.rol]?.toLowerCase().includes(q)
    )
  })

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "admin": return "bg-white/15 text-white border-white/20"
      default: return "bg-white/10 text-white/70 border-white/15"
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6" style={{ backgroundColor: "#050505" }}>
      <LiquidBackground />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <Image src="/logo.jpg" alt="Central Marketing" width={600} height={150} className="h-40 sm:h-48 w-auto mx-auto" priority />
          <p className="text-white/50">Selecciona tu perfil para ingresar al sistema</p>
        </div>

        <div className="relative max-w-sm mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 bg-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <div className="animate-pulse text-muted-foreground">Cargando usuarios...</div>
            </div>
          ) : (
            <>
              {filtrados.map((usuario) => (
                <Card
                  key={usuario.id}
                  className="glass-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                  onClick={() => onLogin(usuario)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                      <AvatarFallback className="bg-white text-black font-bold text-sm">
                        {usuario.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-white group-hover:text-white transition-colors">
                        {usuario.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline" className={`rounded-full text-xs ${getRolColor(usuario.rol)}`}>
                      {rolesLabels[usuario.rol]}
                    </Badge>
                  </div>
                </Card>
              ))}
              {filtrados.length === 0 && (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No se encontraron usuarios
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

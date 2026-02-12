"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut } from "lucide-react"
import { NotificacionesBell } from "@/components/notificaciones/notificaciones-bell"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { rolesLabels } from "@/lib/auth"

export function PanelHeader() {
  const { usuario, logout } = useAuth()

  const initials = usuario
    ? usuario.nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "?"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-intense">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/mi-panel" className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Central Marketing" width={140} height={32} className="h-6 w-auto hidden sm:block" priority />
            <span className="sm:hidden text-white font-bold text-sm">CM</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <NotificacionesBell />
          <div className="hidden sm:flex items-center gap-2">
            <Avatar className="size-9 ring-2 ring-white/20">
              <AvatarFallback className="bg-white text-black font-bold text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">{usuario?.nombre}</p>
              {usuario && (
                <Badge variant="outline" className="rounded-full text-[10px] px-1.5 py-0 border-white/20 text-white/70">
                  {rolesLabels[usuario.rol]}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-white/10 text-muted-foreground hover:text-destructive transition-all"
            onClick={logout}
          >
            <LogOut className="size-4 mr-1" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

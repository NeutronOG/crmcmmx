"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Star } from "lucide-react"
import { NotificacionesBell } from "@/components/notificaciones/notificaciones-bell"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export function EmpresaHeader() {
  const { usuario, logout } = useAuth()
  const { theme } = useTheme()

  const initials = usuario?.nombre
    ? usuario.nombre.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "?"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-intense">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/mi-empresa" className="flex items-center gap-3">
            <Image 
              src={theme === "light" ? "/LOGOTIPO_CMMX_DARK.png" : "/Diseño sin título (20).png"} 
              alt="Central Marketing" 
              width={180} 
              height={40} 
              className="h-8 w-auto" 
              priority 
            />
          </Link>
          <span className="text-xs text-muted-foreground border-l border-white/10 pl-4">Panel Ejecutivo</span>
          <Link href="/creadores" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-4">
            <Star className="size-3.5" />
            Evaluar Creadores
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NotificacionesBell />
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{usuario?.nombre}</p>
              <p className="text-xs text-muted-foreground">Dueño</p>
            </div>
            <Avatar className="size-9 ring-2 ring-white/20">
              <AvatarFallback className="bg-white/10 text-white text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="size-9 hover:bg-white/10" onClick={logout}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

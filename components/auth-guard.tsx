"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginScreen } from "@/components/login-screen"
import type { Seccion } from "@/lib/auth"
import { usePathname, useRouter } from "next/navigation"
import { rutaSeccion } from "@/lib/auth"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { usuario, loading, login, tieneAcceso, isAdmin, isDueno } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Determine which section the current route belongs to
  const seccionActual: Seccion | undefined = rutaSeccion[pathname]

  // Determine if user has dashboard access (admin, administracion)
  const hasDashboardAccess = tieneAcceso("dashboard")
  
  // Each role's home route based on permissions
  const homeRoute = isAdmin ? "/" : isDueno ? "/mi-empresa" : hasDashboardAccess ? "/" : "/mi-panel"

  useEffect(() => {
    if (!loading && usuario) {
      // Dueño users → only allowed sections
      if (isDueno && pathname !== "/mi-empresa" && !(seccionActual && tieneAcceso(seccionActual))) {
        router.replace("/mi-empresa")
        return
      }
      // Admin users trying to access /mi-panel or /mi-empresa → redirect to dashboard
      if (isAdmin && (pathname === "/mi-panel" || pathname === "/mi-empresa")) {
        router.replace("/")
        return
      }
      // Users with dashboard access trying to access /mi-panel or /mi-empresa → redirect to dashboard
      if (hasDashboardAccess && !isAdmin && !isDueno && (pathname === "/mi-panel" || pathname === "/mi-empresa")) {
        router.replace("/")
        return
      }
      // Users without dashboard access (mi_panel users) trying to access admin routes → redirect to /mi-panel
      if (!hasDashboardAccess && !isDueno && pathname !== "/mi-panel") {
        router.replace("/mi-panel")
        return
      }
      // If user doesn't have access to the current section → redirect
      if (seccionActual && !tieneAcceso(seccionActual)) {
        router.replace(homeRoute)
      }
    }
  }, [loading, usuario, seccionActual, tieneAcceso, isAdmin, isDueno, hasDashboardAccess, router, pathname, homeRoute])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!usuario) {
    return <LoginScreen onLogin={login} />
  }

  // Dueño on non-allowed routes: show loading while redirect happens
  if (isDueno && pathname !== "/mi-empresa" && !(seccionActual && tieneAcceso(seccionActual))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Redirigiendo...</div>
      </div>
    )
  }

  // Users with dashboard access on /mi-panel or /mi-empresa: show loading while redirect happens
  if (hasDashboardAccess && !isAdmin && !isDueno && (pathname === "/mi-panel" || pathname === "/mi-empresa")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Redirigiendo...</div>
      </div>
    )
  }

  // Users without dashboard access on admin routes: show loading while redirect happens
  if (!hasDashboardAccess && !isDueno && pathname !== "/mi-panel") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Redirigiendo...</div>
      </div>
    )
  }

  // Admin on /mi-panel or /mi-empresa: show loading while redirect happens
  if (isAdmin && (pathname === "/mi-panel" || pathname === "/mi-empresa")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Redirigiendo...</div>
      </div>
    )
  }

  // If user doesn't have access to this section, show access denied briefly before redirect
  if (seccionActual && !tieneAcceso(seccionActual)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-destructive">Acceso denegado</p>
          <p className="text-sm text-muted-foreground">No tienes permisos para ver esta sección</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

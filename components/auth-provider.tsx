"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Usuario, Rol, Seccion } from "@/lib/auth"
import { getUsuarioActual, login as authLogin, logout as authLogout, tienePermiso, getSeccionesPermitidas } from "@/lib/auth"

interface AuthContextType {
  usuario: Usuario | null
  loading: boolean
  login: (usuario: Usuario) => void
  logout: () => void
  tieneAcceso: (seccion: Seccion) => boolean
  seccionesPermitidas: Seccion[]
  isAdmin: boolean
  isDueno: boolean
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  loading: true,
  login: () => {},
  logout: () => {},
  tieneAcceso: () => false,
  seccionesPermitidas: [],
  isAdmin: false,
  isDueno: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(() => {
    const user = getUsuarioActual()
    setUsuario(user)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadUser()

    const handleAuthChange = () => loadUser()
    window.addEventListener("crm-auth-changed", handleAuthChange)
    return () => window.removeEventListener("crm-auth-changed", handleAuthChange)
  }, [loadUser])

  const handleLogin = useCallback((user: Usuario) => {
    authLogin(user)
    setUsuario(user)
  }, [])

  const handleLogout = useCallback(() => {
    authLogout()
    setUsuario(null)
  }, [])

  const tieneAcceso = useCallback(
    (seccion: Seccion) => {
      if (!usuario) return false
      return tienePermiso(usuario.rol, seccion)
    },
    [usuario]
  )

  const seccionesPermitidas = usuario ? getSeccionesPermitidas(usuario.rol) : []
  const isAdmin = usuario?.rol === "admin"
  const isDueno = usuario?.rol === "dueno"

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        login: handleLogin,
        logout: handleLogout,
        tieneAcceso,
        seccionesPermitidas,
        isAdmin,
        isDueno,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}

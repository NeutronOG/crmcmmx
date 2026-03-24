"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Eye, EyeOff, ArrowLeft, LogIn, Fingerprint } from "lucide-react"
import Image from "next/image"
import { LiquidBackground } from "@/components/liquid-background"
import { useTheme } from "next-themes"
import { getUsuarios, rolesLabels } from "@/lib/auth"
import { getRolColor } from "@/lib/rol-colors"
import type { Usuario } from "@/lib/auth"
import { BiometricPrompt } from "@/components/biometric-prompt"
import {
  isBiometricSupported,
  isDeviceRegisteredLocally,
  authenticateWithBiometric,
  getCredentials,
} from "@/lib/biometrics"

interface LoginScreenProps {
  onLogin: (usuario: Usuario) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { theme } = useTheme()
  const [busqueda, setBusqueda] = useState("")
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Usuario | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [checking, setChecking] = useState(false)
  const [showBioPrompt, setShowBioPrompt] = useState(false)
  const [pendingUser, setPendingUser] = useState<Usuario | null>(null)
  const [bioChecking, setBioChecking] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsuarios()
        setUsuarios(data)
      } catch (error) {
        console.error('Error fetching usuarios:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsuarios()
    
    // Refresh usuarios every 30 seconds to keep in sync with Supabase
    const interval = setInterval(fetchUsuarios, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selected) {
      setPassword("")
      setError("")
      setTimeout(() => passwordRef.current?.focus(), 100)
    }
  }, [selected])

  const filtrados = usuarios.filter((u) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      rolesLabels[u.rol]?.toLowerCase().includes(q)
    )
  })


  const initials = (nombre: string) =>
    nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()

  // After password success: check if we should prompt for biometrics
  const finishLogin = (user: Usuario) => {
    const supported = isBiometricSupported()
    const alreadyRegistered = isDeviceRegisteredLocally(user.id)
    if (supported && !alreadyRegistered) {
      // Check if they have capacity (< 2 creds) — show prompt
      setPendingUser(user)
      setShowBioPrompt(true)
    } else {
      onLogin(user)
    }
  }

  const handlePasswordSubmit = () => {
    if (!selected) return
    setChecking(true)
    if (!selected.password || password === selected.password) {
      finishLogin(selected)
      setChecking(false)
    } else {
      setError("Contraseña incorrecta")
      setPassword("")
      setChecking(false)
    }
  }

  // Biometric quick-login for a user whose device is already registered
  const handleBiometricLogin = async (usuario: Usuario) => {
    setBioChecking(true)
    try {
      const ok = await authenticateWithBiometric(usuario.id)
      if (ok) {
        onLogin(usuario)
      } else {
        setError("Biométrico no reconocido")
      }
    } catch {
      setError("Error al verificar biométrico")
    } finally {
      setBioChecking(false)
    }
  }

  // ── PASSWORD STEP ──────────────────────────────────────────
  if (selected) {
    return (
      <>
      <div className="min-h-screen relative flex items-center justify-center p-6" style={{ backgroundColor: "#050505" }}>
        <LiquidBackground />
        <div className="relative z-10 w-full max-w-sm space-y-8">
          <div className="text-center">
            <Image
              src={theme === "light" ? "/LOGOTIPO_CMMX_DARK.png" : "/Diseño sin título (20).png"}
              alt="Central Marketing"
              width={400}
              height={100}
              className="h-20 w-auto mx-auto"
              priority
            />
          </div>

          <Card className="glass-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 ring-2 ring-white/20">
                {selected.avatar && <AvatarImage src={selected.avatar} />}
                <AvatarFallback className="bg-white text-black font-bold text-lg">
                  {initials(selected.nombre)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">{selected.nombre}</p>
                <p className="text-xs text-white/50">{selected.email}</p>
                <Badge variant="outline" className={`mt-1 rounded-full text-xs ${getRolColor(selected.rol)}`}>
                  {rolesLabels[selected.rol]}
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Contraseña</Label>
              <div className="relative">
                <Input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError("") }}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  placeholder="••••••••••"
                  className="bg-white/5 border-white/10 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>

            {isBiometricSupported() && isDeviceRegisteredLocally(selected.id) && (
              <Button
                variant="outline"
                className="w-full gap-2 bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20"
                onClick={() => handleBiometricLogin(selected)}
                disabled={bioChecking}
              >
                <Fingerprint className="h-4 w-4" />
                {bioChecking ? "Verificando..." : "Entrar con biométrico"}
              </Button>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2 bg-transparent border-white/10 text-white/60 hover:text-white"
                onClick={() => setSelected(null)}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handlePasswordSubmit}
                disabled={checking}
              >
                <LogIn className="h-4 w-4" />
                {checking ? "Verificando..." : "Entrar"}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {showBioPrompt && pendingUser && (
        <BiometricPrompt
          userId={pendingUser.id}
          userName={pendingUser.nombre}
          onDone={() => {
            setShowBioPrompt(false)
            onLogin(pendingUser!)
            setPendingUser(null)
          }}
        />
      )}
      </>
    )
  }

  // ── USER SELECTION STEP ───────────────────────────────────
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6" style={{ backgroundColor: "#050505" }}>
      <LiquidBackground />

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <Image
            src={theme === "light" ? "/LOGOTIPO_CMMX_DARK.png" : "/Diseño sin título (20).png"}
            alt="Central Marketing"
            width={600}
            height={150}
            className="h-32 sm:h-40 w-auto mx-auto"
            priority
          />
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
                  onClick={() => setSelected(usuario)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                      {usuario.avatar && <AvatarImage src={usuario.avatar} />}
                      <AvatarFallback className="bg-white text-black font-bold text-sm">
                        {initials(usuario.nombre)}
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
                      {rolesLabels[usuario.rol] ?? usuario.rol}
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

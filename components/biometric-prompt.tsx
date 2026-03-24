"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Fingerprint, X, Shield, Smartphone } from "lucide-react"
import {
  registerBiometric,
  getDeviceName,
  markDeviceRegisteredLocally,
  isBiometricSupported,
} from "@/lib/biometrics"
import { toast } from "sonner"

interface BiometricPromptProps {
  userId: string
  userName: string
  onDone: () => void
}

export function BiometricPrompt({ userId, userName, onDone }: BiometricPromptProps) {
  const [loading, setLoading] = useState(false)

  if (!isBiometricSupported()) {
    onDone()
    return null
  }

  const handleRegister = async () => {
    setLoading(true)
    try {
      const deviceName = getDeviceName()
      await registerBiometric(userId, userName, deviceName)
      markDeviceRegisteredLocally(userId)
      toast.success(`Biométrico registrado en ${deviceName}`)
      onDone()
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo registrar el biométrico")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="glass-card w-full max-w-sm p-6 rounded-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Fingerprint className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Acceso biométrico</p>
              <p className="text-xs text-muted-foreground">Face ID / Touch ID / Windows Hello</p>
            </div>
          </div>
          <button
            onClick={onDone}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          ¿Quieres usar el biométrico de este dispositivo para iniciar sesión más rápido la próxima vez?
          Puedes gestionarlo en cualquier momento desde <strong>Mi Perfil</strong>.
        </p>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground">
          <Smartphone className="h-4 w-4 shrink-0" />
          <span>Se registrará <strong className="text-foreground">{getDeviceName()}</strong> como dispositivo de confianza</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 text-sm"
            onClick={onDone}
            disabled={loading}
          >
            Ahora no
          </Button>
          <Button
            className="flex-1 gap-2 text-sm"
            onClick={handleRegister}
            disabled={loading}
          >
            <Shield className="h-4 w-4" />
            {loading ? "Registrando..." : "Activar"}
          </Button>
        </div>
      </Card>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Eye, EyeOff, Save, Upload, User, Fingerprint, Plus, Trash2, Smartphone, ShieldCheck } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { rolesLabels, updateUsuarioPerfil } from "@/lib/auth"
import { getRolColor } from "@/lib/rol-colors"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  isBiometricSupported,
  getCredentials,
  registerBiometric,
  removeCredential,
  getDeviceName,
  markDeviceRegisteredLocally,
  isDeviceRegisteredLocally,
} from "@/lib/biometrics"
import type { BiometricCredential } from "@/lib/biometrics"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export default function MiPerfilPage() {
  const { usuario, login } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [bioCredentials, setBioCredentials] = useState<BiometricCredential[]>([])
  const [bioLoading, setBioLoading] = useState(false)
  const [bioRegistering, setBioRegistering] = useState(false)

  useEffect(() => {
    if (!usuario) return
    getCredentials(usuario.id).then(setBioCredentials)
  }, [usuario])

  if (!usuario) return null

  const bioSupported = isBiometricSupported()
  const deviceAlreadyRegistered = isDeviceRegisteredLocally(usuario.id)

  const handleAddBiometric = async () => {
    setBioRegistering(true)
    try {
      const deviceName = getDeviceName()
      const newCred = await registerBiometric(usuario.id, usuario.nombre, deviceName)
      markDeviceRegisteredLocally(usuario.id)
      setBioCredentials(prev => [...prev, newCred])
      toast.success(`Biométrico registrado: ${deviceName}`)
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo registrar el biométrico")
    } finally {
      setBioRegistering(false)
    }
  }

  const handleRemoveBiometric = async (credId: string) => {
    setBioLoading(true)
    try {
      await removeCredential(usuario.id, credId)
      setBioCredentials(prev => prev.filter(c => c.id !== credId))
      toast.success("Dispositivo eliminado")
    } catch {
      toast.error("Error al eliminar el dispositivo")
    } finally {
      setBioLoading(false)
    }
  }

  const initials = usuario.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  // ── UPLOAD PHOTO ────────────────────────────────────────────
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error("La imagen no puede superar 5 MB")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen")
      return
    }

    setUploadingPhoto(true)
    try {
      const ext = file.name.split(".").pop()
      const path = `avatars/${usuario.id}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      const avatarUrl = `${data.publicUrl}?t=${Date.now()}`

      await updateUsuarioPerfil(usuario.id, { avatar: avatarUrl })
      login({ ...usuario, avatar: avatarUrl })
      toast.success("Foto actualizada correctamente")
    } catch (err: any) {
      console.error(err)
      toast.error("Error al subir la foto: " + (err?.message ?? "intenta de nuevo"))
    } finally {
      setUploadingPhoto(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  // ── CHANGE PASSWORD ─────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Completa los campos de nueva contraseña")
      return
    }
    // Verify current password only if user has one set
    if (usuario.password && currentPassword !== usuario.password) {
      toast.error("La contraseña actual es incorrecta")
      return
    }
    if (newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden")
      return
    }

    setSavingPassword(true)
    try {
      await updateUsuarioPerfil(usuario.id, { password: newPassword })
      login({ ...usuario, password: newPassword })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Contraseña actualizada correctamente")
    } catch {
      toast.error("Error al guardar la contraseña")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />
      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 pb-20 max-w-2xl space-y-8">
          <div className="space-y-2 pt-6">
            <h1 className="text-4xl font-bold tracking-tight">Mi Perfil</h1>
            <p className="text-muted-foreground">Gestiona tu foto de perfil y contraseña</p>
          </div>

          {/* ── AVATAR CARD ── */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Foto de perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6 flex-wrap">
              <div className="relative group">
                <Avatar className="size-24 ring-4 ring-border">
                  {usuario.avatar && <AvatarImage src={usuario.avatar} />}
                  <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-lg">{usuario.nombre}</p>
                  <p className="text-sm text-muted-foreground">{usuario.email}</p>
                  <Badge variant="outline" className={`mt-1 text-xs rounded-full border ${getRolColor(usuario.rol)}`}>
                    {rolesLabels[usuario.rol] ?? usuario.rol}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingPhoto ? "Subiendo..." : "Cambiar foto"}
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — máx. 5 MB</p>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </CardContent>
          </Card>

          {/* ── PASSWORD CARD ── */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-base">Cambiar contraseña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {usuario.password && (
                <div className="space-y-1.5">
                  <Label className="text-sm">Contraseña actual</Label>
                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-sm">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Confirmar nueva contraseña</Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                className="gap-2 w-full"
                onClick={handleChangePassword}
                disabled={savingPassword || !newPassword || !confirmPassword}
              >
                <Save className="h-4 w-4" />
                {savingPassword ? "Guardando..." : "Actualizar contraseña"}
              </Button>
            </CardContent>
          </Card>

          {/* ── BIOMETRIC CARD ── */}
          {bioSupported && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Fingerprint className="h-4 w-4" />
                  Acceso biométrico
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {bioCredentials.length}/2 dispositivos
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Registra hasta 2 dispositivos con Face ID, Touch ID o Windows Hello para iniciar sesión sin contraseña.
                </p>

                {bioCredentials.length === 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4 shrink-0" />
                    No tienes dispositivos biométricos registrados
                  </div>
                )}

                <div className="space-y-2">
                  {bioCredentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                          <ShieldCheck className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{cred.deviceName}</p>
                          <p className="text-xs text-muted-foreground">
                            Registrado {new Date(cred.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => handleRemoveBiometric(cred.id)}
                        disabled={bioLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {bioCredentials.length < 2 && (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleAddBiometric}
                    disabled={bioRegistering || deviceAlreadyRegistered}
                  >
                    <Plus className="h-4 w-4" />
                    {bioRegistering
                      ? "Registrando..."
                      : deviceAlreadyRegistered
                      ? "Este dispositivo ya está registrado"
                      : `Agregar ${getDeviceName()}`}
                  </Button>
                )}

                {bioCredentials.length >= 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Límite alcanzado. Elimina un dispositivo para agregar otro.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

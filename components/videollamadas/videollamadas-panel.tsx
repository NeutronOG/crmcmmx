"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Video,
  Plus,
  Copy,
  Users,
  Briefcase,
  UserCheck,
  Loader2,
  Trash2,
  PhoneCall,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  getVideollamadas,
  createVideollamada,
  deleteVideollamada,
  type Videollamada,
} from "@/lib/store"
import { UserMultiSelect } from "@/components/user-multi-select"
import { toast } from "sonner"
import { JitsiRoom } from "./jitsi-room"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function VideollamadasPanel() {
  const { usuario } = useAuth()
  const [salas, setSalas] = useState<Videollamada[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [salaActiva, setSalaActiva] = useState<Videollamada | null>(null)
  const [filtro, setFiltro] = useState<"Todas" | "Interna" | "Con Cliente">("Todas")

  // Form state
  const [nombre, setNombre] = useState("")
  const [tipo, setTipo] = useState<"Interna" | "Con Cliente">("Interna")
  const [descripcion, setDescripcion] = useState("")
  const [proyectoNombre, setProyectoNombre] = useState("")
  const [clienteNombre, setClienteNombre] = useState("")
  const [participantes, setParticipantes] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getVideollamadas()
    setSalas(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setNombre("")
    setTipo("Interna")
    setDescripcion("")
    setProyectoNombre("")
    setClienteNombre("")
    setParticipantes([])
  }

  const handleCreate = async () => {
    if (!nombre.trim()) { toast.error("El nombre de la sala es obligatorio"); return }
    if (!usuario) return
    setSaving(true)
    try {
      await createVideollamada({
        nombre: nombre.trim(),
        tipo,
        descripcion: descripcion.trim(),
        proyectoNombre: proyectoNombre.trim() || undefined,
        clienteNombre: clienteNombre.trim() || undefined,
        creadoPor: usuario.nombre,
        participantes,
      })
      toast.success("Sala creada correctamente")
      setDialogOpen(false)
      resetForm()
      load()
    } catch (err) {
      toast.error("Error al crear la sala")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (sala: Videollamada) => {
    if (!confirm(`¿Eliminar la sala "${sala.nombre}"?`)) return
    try {
      await deleteVideollamada(sala.id)
      toast.success("Sala eliminada")
      load()
    } catch {
      toast.error("Error al eliminar la sala")
    }
  }

  const copyLink = (roomId: string) => {
    const url = `https://meet.jit.si/${roomId}`
    navigator.clipboard.writeText(url)
    toast.success("Enlace copiado al portapapeles")
  }

  const salasFiltradas = salas.filter(s =>
    filtro === "Todas" ? true : s.tipo === filtro
  )

  if (salaActiva) {
    return (
      <JitsiRoom
        roomId={salaActiva.roomId}
        roomName={salaActiva.nombre}
        displayName={usuario?.nombre || "Usuario"}
        onClose={() => setSalaActiva(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Video className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Videollamadas</h1>
            <p className="text-xs text-muted-foreground">Salas internas y con clientes</p>
          </div>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gap-2"
          size="sm"
        >
          <Plus className="size-4" />
          Nueva sala
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        {(["Todas", "Interna", "Con Cliente"] as const).map(f => (
          <Button
            key={f}
            variant={filtro === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltro(f)}
            className="text-xs"
          >
            {f}
          </Button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          {salasFiltradas.length} sala{salasFiltradas.length !== 1 ? "s" : ""} activa{salasFiltradas.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Lista de salas */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : salasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Video className="size-8 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-medium text-foreground">No hay salas activas</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crea una sala para iniciar una videollamada
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} variant="outline" size="sm" className="gap-2">
            <Plus className="size-4" />
            Crear primera sala
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {salasFiltradas.map(sala => (
            <SalaCard
              key={sala.id}
              sala={sala}
              currentUser={usuario?.nombre || ""}
              onJoin={() => setSalaActiva(sala)}
              onCopyLink={() => copyLink(sala.roomId)}
              onDelete={() => handleDelete(sala)}
            />
          ))}
        </div>
      )}

      {/* Dialog nueva sala */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="size-4 text-primary" />
              Nueva sala de videollamada
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre de la sala *</Label>
              <Input
                placeholder="Ej: Reunión de equipo semanal"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={v => setTipo(v as "Interna" | "Con Cliente")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interna">
                    <div className="flex items-center gap-2">
                      <Users className="size-4" />
                      Interna (solo equipo)
                    </div>
                  </SelectItem>
                  <SelectItem value="Con Cliente">
                    <div className="flex items-center gap-2">
                      <UserCheck className="size-4" />
                      Con Cliente
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipo === "Con Cliente" && (
              <div className="space-y-1.5">
                <Label>Cliente</Label>
                <Input
                  placeholder="Nombre del cliente"
                  value={clienteNombre}
                  onChange={e => setClienteNombre(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Proyecto relacionado (opcional)</Label>
              <Input
                placeholder="Nombre del proyecto"
                value={proyectoNombre}
                onChange={e => setProyectoNombre(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Descripción (opcional)</Label>
              <Textarea
                placeholder="Agenda o descripción de la reunión..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Participantes del equipo</Label>
              <UserMultiSelect
                value={participantes}
                onChange={setParticipantes}
                placeholder="Seleccionar miembros..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm() }}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Video className="size-4" />}
              Crear sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Tarjeta de sala ──────────────────────────────────────────────────────────

function SalaCard({
  sala,
  currentUser,
  onJoin,
  onCopyLink,
  onDelete,
}: {
  sala: Videollamada
  currentUser: string
  onJoin: () => void
  onCopyLink: () => void
  onDelete: () => void
}) {
  const isInterna = sala.tipo === "Interna"

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
            isInterna ? "bg-blue-500/10" : "bg-purple-500/10"
          }`}>
            {isInterna
              ? <Users className="size-4 text-blue-500" />
              : <UserCheck className="size-4 text-purple-500" />
            }
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">{sala.nombre}</p>
            <Badge
              variant="secondary"
              className={`text-[10px] mt-0.5 ${
                isInterna
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
              }`}
            >
              {sala.tipo}
            </Badge>
          </div>
        </div>

        {sala.creadoPor === currentUser && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="size-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Info */}
      {(sala.clienteNombre || sala.proyectoNombre) && (
        <div className="space-y-1">
          {sala.clienteNombre && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <UserCheck className="size-3" />
              <span className="truncate">{sala.clienteNombre}</span>
            </div>
          )}
          {sala.proyectoNombre && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Briefcase className="size-3" />
              <span className="truncate">{sala.proyectoNombre}</span>
            </div>
          )}
        </div>
      )}

      {sala.descripcion && (
        <p className="text-xs text-muted-foreground line-clamp-2">{sala.descripcion}</p>
      )}

      {/* Participantes */}
      {sala.participantes.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3 shrink-0" />
          <span className="truncate">{sala.participantes.slice(0, 3).join(", ")}{sala.participantes.length > 3 ? ` +${sala.participantes.length - 3}` : ""}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground flex-1">
          {sala.creadoPor} · {format(new Date(sala.createdAt), "d MMM", { locale: es })}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopyLink}
          className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
          title="Copiar enlace para invitar"
        >
          <Copy className="size-3" />
        </Button>
        <Button
          size="sm"
          onClick={onJoin}
          className="h-7 px-3 text-xs gap-1.5 bg-primary hover:bg-primary/90"
        >
          <PhoneCall className="size-3" />
          Unirse
        </Button>
      </div>
    </div>
  )
}

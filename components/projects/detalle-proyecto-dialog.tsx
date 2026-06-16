"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateProyecto } from "@/lib/store"
import type { Proyecto } from "@/lib/store"
import { UserMultiSelect } from "@/components/user-multi-select"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Calendar,
  DollarSign,
  HardDrive,
  Video,
  Pencil,
  Save,
  X,
  User,
  Tag,
  ChevronRight,
  LayoutList,
  Link2,
} from "lucide-react"

interface DetalleProyectoDialogProps {
  proyecto: Proyecto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function DetalleProyectoDialog({
  proyecto,
  open,
  onOpenChange,
  onUpdated,
}: DetalleProyectoDialogProps) {
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit fields
  const [nombre, setNombre] = useState("")
  const [cliente, setCliente] = useState("")
  const [tipo, setTipo] = useState("Marketing Digital")
  const [estado, setEstado] = useState<Proyecto["estado"]>("Brief")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaEntrega, setFechaEntrega] = useState("")
  const [presupuesto, setPresupuesto] = useState("")
  const [responsable, setResponsable] = useState<string[]>([])
  const [descripcion, setDescripcion] = useState("")
  const [driveUrl, setDriveUrl] = useState("")
  const [videollamadaUrl, setVideollamadaUrl] = useState("")
  const [progreso, setProgreso] = useState(0)

  useEffect(() => {
    if (open && proyecto) {
      setNombre(proyecto.nombre)
      setCliente(proyecto.cliente)
      setTipo(proyecto.tipo)
      setEstado(proyecto.estado)
      setFechaInicio(proyecto.fechaInicio || "")
      setFechaEntrega(proyecto.fechaEntrega || "")
      setPresupuesto(String(proyecto.presupuesto || ""))
      setResponsable(proyecto.responsable ? proyecto.responsable.split(", ").filter(Boolean) : [])
      setDescripcion(proyecto.descripcion || "")
      setDriveUrl(proyecto.driveUrl || "")
      setVideollamadaUrl(proyecto.videollamadaUrl || "")
      setProgreso(proyecto.progreso || 0)
      setEditMode(false)
    }
  }, [open, proyecto])

  if (!proyecto) return null

  const getEstadoColor = (est: Proyecto["estado"]) => {
    switch (est) {
      case "Brief": return "bg-slate-400"
      case "Cotización": return "bg-cyan-400"
      case "Propuesta": return "bg-violet-400"
      case "Planificación": return "bg-blue-400"
      case "Revisión Interna": return "bg-orange-400"
      case "Revisión Cliente": return "bg-amber-400"
      case "En Progreso": return "bg-purple-400"
      case "En Revisión": return "bg-yellow-400"
      case "Completado": return "bg-emerald-400"
      case "Pausado": return "bg-red-400"
      default: return "bg-muted"
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!proyecto) return
    if (!nombre.trim()) {
      toast.error("El nombre del proyecto es obligatorio")
      return
    }
    if (responsable.length === 0) {
      toast.error("Debe haber al menos un responsable")
      return
    }

    setSaving(true)
    try {
      await updateProyecto(proyecto.id, {
        nombre: nombre.trim(),
        cliente: cliente.trim(),
        tipo,
        estado,
        fechaInicio,
        fechaEntrega,
        presupuesto: parseFloat(presupuesto) || 0,
        responsable: responsable.join(", "),
        progreso,
        descripcion: descripcion.trim(),
        driveUrl: driveUrl.trim(),
        videollamadaUrl: videollamadaUrl.trim(),
      })
      toast.success("Proyecto actualizado")
      setEditMode(false)
      onUpdated()
    } catch {
      toast.error("Error al guardar cambios")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) setEditMode(false); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-primary" />
                {editMode ? "Editar Proyecto" : proyecto.nombre}
              </DialogTitle>
              {!editMode && (
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    {proyecto.cliente || "Sin cliente"}
                  </span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className={`inline-block w-2 h-2 rounded-full ${getEstadoColor(proyecto.estado)}`} />
                  {proyecto.estado}
                </DialogDescription>
              )}
            </div>
            {!editMode && (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)} className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre del proyecto *</Label>
              <Input id="edit-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cliente">Cliente</Label>
                <Input id="edit-cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                    <SelectItem value="Redes Sociales">Redes Sociales</SelectItem>
                    <SelectItem value="Branding">Branding</SelectItem>
                    <SelectItem value="Diseño 3D">Diseño 3D</SelectItem>
                    <SelectItem value="Producción Audiovisual">Producción Audiovisual</SelectItem>
                    <SelectItem value="Fotografía">Fotografía</SelectItem>
                    <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Estrategia">Estrategia</SelectItem>
                    <SelectItem value="Experiencias">Experiencias</SelectItem>
                    <SelectItem value="Stands">Stands</SelectItem>
                    <SelectItem value="Campaña">Campaña</SelectItem>
                    <SelectItem value="Licitación">Licitación</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={estado} onValueChange={(v) => setEstado(v as Proyecto["estado"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brief">Brief</SelectItem>
                    <SelectItem value="Cotización">Cotización</SelectItem>
                    <SelectItem value="Propuesta">Propuesta</SelectItem>
                    <SelectItem value="Planificación">Planificación</SelectItem>
                    <SelectItem value="Revisión Interna">Revisión Interna</SelectItem>
                    <SelectItem value="Revisión Cliente">Revisión Cliente</SelectItem>
                    <SelectItem value="En Progreso">En Progreso</SelectItem>
                    <SelectItem value="En Revisión">En Revisión</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                    <SelectItem value="Pausado">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Progreso (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={progreso}
                    onChange={(e) => setProgreso(Math.min(100, Math.max(0, Number(e.target.value))))}
                  />
                  <span className="text-sm text-muted-foreground w-8">{progreso}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-fechaInicio">Fecha inicio</Label>
                <Input id="edit-fechaInicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fechaEntrega">Fecha entrega</Label>
                <Input id="edit-fechaEntrega" type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-presupuesto">Presupuesto ($)</Label>
                <Input id="edit-presupuesto" type="number" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Responsable(s) *</Label>
                <UserMultiSelect value={responsable} onChange={setResponsable} placeholder="Seleccionar equipo..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-descripcion">Descripción</Label>
              <Textarea id="edit-descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-drive">Google Drive</Label>
                <Input id="edit-drive" value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} placeholder="https://drive.google.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-meet">Videollamada</Label>
                <Input id="edit-meet" value={videollamadaUrl} onChange={(e) => setVideollamadaUrl(e.target.value)} placeholder="https://meet.google.com/..." />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                <X className="w-4 h-4 mr-1" /> Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-1" /> {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Estado + Progreso */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-semibold">{proyecto.progreso}%</span>
              </div>
              <Progress value={proyecto.progreso} className="h-2" />
            </div>

            {/* Grid de detalles */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {proyecto.tipo && (
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">{proyecto.tipo}</span>
                </div>
              )}
              {proyecto.responsable && (
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Responsable:</span>
                  <span className="font-medium">{proyecto.responsable}</span>
                </div>
              )}
              {proyecto.fechaInicio && (
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Inicio:</span>
                  <span className="font-medium">{proyecto.fechaInicio}</span>
                </div>
              )}
              {proyecto.fechaEntrega && (
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Entrega:</span>
                  <span className="font-medium">{proyecto.fechaEntrega}</span>
                </div>
              )}
              {proyecto.presupuesto > 0 && (
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Presupuesto:</span>
                  <span className="font-medium">${proyecto.presupuesto.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Descripción */}
            {proyecto.descripcion && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Descripción</p>
                <p className="text-sm text-foreground bg-muted/30 rounded-lg p-3">{proyecto.descripcion}</p>
              </div>
            )}

            {/* Links */}
            <div className="flex gap-2 flex-wrap">
              {proyecto.driveUrl && (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(proyecto.driveUrl, '_blank')}>
                  <HardDrive className="w-4 h-4" /> Google Drive
                </Button>
              )}
              {proyecto.videollamadaUrl && (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(proyecto.videollamadaUrl, '_blank')}>
                  <Video className="w-4 h-4" /> Videollamada
                </Button>
              )}
            </div>

            {/* Etapa del pipeline */}
            <div className="space-y-2 pt-2 border-t border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Etapa del Pipeline</p>
              <div className="flex items-center gap-1 text-sm">
                {["Brief", "Cotización", "Propuesta", "Planificación", "Revisión Interna", "Revisión Cliente", "En Progreso", "En Revisión", "Completado"].map((etapa, idx) => (
                  <span key={etapa} className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        proyecto.estado === etapa
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/30 text-muted-foreground"
                      }`}
                    >
                      {etapa}
                    </span>
                    {idx < 8 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

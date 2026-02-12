"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { updateTarea, getProyectos, recalcularProgresoProyecto } from "@/lib/store"
import type { Tarea, Proyecto } from "@/lib/store"
import { UserMultiSelect } from "@/components/user-multi-select"
import { toast } from "sonner"

interface EditarTareaDialogProps {
  tarea: Tarea | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EditarTareaDialog({ tarea, open, onOpenChange, onUpdated }: EditarTareaDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [proyecto, setProyecto] = useState("")
  const [cliente, setCliente] = useState("")
  const [asignado, setAsignado] = useState<string[]>([])
  const [prioridad, setPrioridad] = useState<"Alta" | "Media" | "Baja">("Media")
  const [estado, setEstado] = useState<"Pendiente" | "En Progreso" | "En Revisión" | "Completada">("Pendiente")
  const [fechaVencimiento, setFechaVencimiento] = useState("")
  const [etiquetas, setEtiquetas] = useState("")
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && tarea) {
      setTitulo(tarea.titulo)
      setDescripcion(tarea.descripcion)
      setProyecto(tarea.proyecto)
      setCliente(tarea.cliente)
      setAsignado(tarea.asignado ? tarea.asignado.split(", ").filter(Boolean) : [])
      setPrioridad(tarea.prioridad)
      setEstado(tarea.estado)
      setFechaVencimiento(tarea.fechaVencimiento || "")
      setEtiquetas(tarea.etiquetas.join(", "))
      getProyectos().then(setProyectos)
    }
  }, [open, tarea])

  const handleProyectoSelect = (nombreProyecto: string) => {
    setProyecto(nombreProyecto)
    const proy = proyectos.find(p => p.nombre === nombreProyecto)
    if (proy) {
      setCliente(proy.cliente || "")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tarea) return

    if (!titulo.trim()) {
      toast.error("El título es obligatorio")
      return
    }
    if (asignado.length === 0) {
      toast.error("Debes asignar la tarea a alguien")
      return
    }

    setSaving(true)
    try {
      const oldProyecto = tarea.proyecto
      const oldEstado = tarea.estado

      await updateTarea(tarea.id, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        proyecto: proyecto.trim(),
        cliente: cliente.trim(),
        asignado: asignado.join(", "),
        estado,
        prioridad,
        fechaVencimiento,
        fechaCompletada: estado === "Completada" ? new Date().toISOString().split("T")[0] : "",
        etiquetas: etiquetas
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })

      // Recalculate project progress if project or estado changed
      if (oldProyecto && (oldProyecto !== proyecto.trim() || oldEstado !== estado)) {
        await recalcularProgresoProyecto(oldProyecto)
      }
      if (proyecto.trim() && proyecto.trim() !== oldProyecto) {
        await recalcularProgresoProyecto(proyecto.trim())
      }

      toast.success("Tarea actualizada")
      onOpenChange(false)
      onUpdated()
    } catch {
      toast.error("Error al actualizar la tarea")
    } finally {
      setSaving(false)
    }
  }

  if (!tarea) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg ">
        <DialogHeader>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogDescription>Modifica los campos de la tarea</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-titulo">Título *</Label>
            <Input
              id="edit-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-descripcion">Descripción</Label>
            <Textarea
              id="edit-descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Proyecto</Label>
              {proyectos.length > 0 ? (
                <Select value={proyecto} onValueChange={handleProyectoSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {proyectos.map(p => (
                      <SelectItem key={p.id} value={p.nombre}>
                        {p.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={proyecto}
                  onChange={(e) => setProyecto(e.target.value)}
                  placeholder="Nombre del proyecto"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cliente">Cliente</Label>
              <Input
                id="edit-cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Auto-llenado al elegir proyecto"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asignado a *</Label>
              <UserMultiSelect
                value={asignado}
                onChange={setAsignado}
                placeholder="Buscar miembro del equipo..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fecha">Fecha de vencimiento</Label>
              <Input
                id="edit-fecha"
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={prioridad} onValueChange={(v) => setPrioridad(v as typeof prioridad)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v as typeof estado)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Progreso">En Progreso</SelectItem>
                  <SelectItem value="En Revisión">En Revisión</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-etiquetas">Etiquetas</Label>
            <Input
              id="edit-etiquetas"
              placeholder="Separadas por comas: Diseño, Web, Urgente"
              value={etiquetas}
              onChange={(e) => setEtiquetas(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

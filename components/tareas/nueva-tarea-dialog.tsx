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
import { addTarea, getProyectos } from "@/lib/store"
import type { Proyecto } from "@/lib/store"
import { UserMultiSelect } from "@/components/user-multi-select"
import { toast } from "sonner"

interface NuevaTareaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function NuevaTareaDialog({ open, onOpenChange, onCreated }: NuevaTareaDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [proyecto, setProyecto] = useState("")
  const [cliente, setCliente] = useState("")
  const [proyectos, setProyectos] = useState<Proyecto[]>([])

  useEffect(() => {
    if (open) {
      getProyectos().then(setProyectos)
    }
  }, [open])

  const handleProyectoSelect = (nombreProyecto: string) => {
    setProyecto(nombreProyecto)
    const proy = proyectos.find(p => p.nombre === nombreProyecto)
    if (proy) {
      setCliente(proy.cliente || "")
    }
  }
  const [asignado, setAsignado] = useState<string[]>([])
  const [prioridad, setPrioridad] = useState<"Alta" | "Media" | "Baja">("Media")
  const [estado, setEstado] = useState<"Pendiente" | "En Progreso" | "En Revisión" | "Completada">("Pendiente")
  const [fechaVencimiento, setFechaVencimiento] = useState("")
  const [etiquetas, setEtiquetas] = useState("")

  const resetForm = () => {
    setTitulo("")
    setDescripcion("")
    setProyecto("")
    setCliente("")
    setAsignado([])
    setPrioridad("Media")
    setEstado("Pendiente")
    setFechaVencimiento("")
    setEtiquetas("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim()) {
      toast.error("El título es obligatorio")
      return
    }
    if (asignado.length === 0) {
      toast.error("Debes asignar la tarea a alguien")
      return
    }

    try {
      await addTarea({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        proyecto: proyecto.trim(),
        cliente: cliente.trim(),
        asignado: asignado.join(", "),
        estado,
        prioridad,
        fechaCreacion: new Date().toISOString().split("T")[0],
        fechaVencimiento,
        fechaCompletada: estado === "Completada" ? new Date().toISOString().split("T")[0] : "",
        etiquetas: etiquetas
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })

      toast.success("Tarea creada exitosamente")
      resetForm()
      onOpenChange(false)
      onCreated()
    } catch {
      toast.error("Error al crear la tarea")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-lg ">
        <DialogHeader>
          <DialogTitle>Nueva Tarea</DialogTitle>
          <DialogDescription>Crea una nueva tarea y asígnala a un miembro del equipo</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Ej: Diseñar banner para campaña"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe los detalles de la tarea..."
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
                  placeholder="Nombre del proyecto"
                  value={proyecto}
                  onChange={(e) => setProyecto(e.target.value)}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                placeholder="Auto-llenado al elegir proyecto"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
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
              <Label htmlFor="fechaVencimiento">Fecha de vencimiento</Label>
              <Input
                id="fechaVencimiento"
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
              <Label>Estado inicial</Label>
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
            <Label htmlFor="etiquetas">Etiquetas</Label>
            <Input
              id="etiquetas"
              placeholder="Separadas por comas: Diseño, Web, Urgente"
              value={etiquetas}
              onChange={(e) => setEtiquetas(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false) }}>
              Cancelar
            </Button>
            <Button type="submit">Crear Tarea</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

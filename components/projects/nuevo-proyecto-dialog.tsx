"use client"

import { useState } from "react"
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
import { addProyecto, notificarDueno } from "@/lib/store"
import { UserMultiSelect } from "@/components/user-multi-select"
import { toast } from "sonner"

interface NuevoProyectoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function NuevoProyectoDialog({ open, onOpenChange, onCreated }: NuevoProyectoDialogProps) {
  const [nombre, setNombre] = useState("")
  const [cliente, setCliente] = useState("")
  const [tipo, setTipo] = useState("Marketing Digital")
  const [estado, setEstado] = useState<"Planificación" | "En Progreso">("Planificación")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaEntrega, setFechaEntrega] = useState("")
  const [presupuesto, setPresupuesto] = useState("")
  const [responsable, setResponsable] = useState<string[]>([])
  const [descripcion, setDescripcion] = useState("")

  const resetForm = () => {
    setNombre("")
    setCliente("")
    setTipo("Marketing Digital")
    setEstado("Planificación")
    setFechaInicio("")
    setFechaEntrega("")
    setPresupuesto("")
    setResponsable([])
    setDescripcion("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      toast.error("El nombre del proyecto es obligatorio")
      return
    }
    if (responsable.length === 0) {
      toast.error("Debes asignar al menos un responsable")
      return
    }

    try {
      await addProyecto({
        nombre: nombre.trim(),
        cliente: cliente.trim(),
        tipo,
        estado,
        fechaInicio: fechaInicio || new Date().toISOString().split("T")[0],
        fechaEntrega: fechaEntrega || "",
        presupuesto: parseFloat(presupuesto) || 0,
        responsable: responsable.join(", "),
        progreso: 0,
        descripcion: descripcion.trim(),
      })
      toast.success("Proyecto creado exitosamente")
      // Projects with budget go directly to Guillermo (dueño)
      const budget = parseFloat(presupuesto) || 0
      if (budget > 0) {
        await notificarDueno({
          tipo: "proyecto",
          titulo: `Nuevo proyecto: ${nombre.trim()} — $${budget.toLocaleString()}`,
          mensaje: `Cliente: ${cliente.trim() || "Sin cliente"} | Presupuesto requiere autorización`,
          enlace: "/mi-empresa",
        })
      }
      resetForm()
      onOpenChange(false)
      onCreated()
    } catch {
      toast.error("Error al crear el proyecto")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-lg ">
        <DialogHeader>
          <DialogTitle>Nuevo Proyecto</DialogTitle>
          <DialogDescription>Crea un nuevo proyecto y asígnalo al equipo</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del proyecto *</Label>
            <Input id="nombre" placeholder="Ej: Campaña Digital Q1" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" placeholder="Nombre del cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado inicial</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v as typeof estado)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planificación">Planificación</SelectItem>
                  <SelectItem value="En Progreso">En Progreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="presupuesto">Presupuesto ($)</Label>
              <Input id="presupuesto" type="number" placeholder="0" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de inicio</Label>
              <Input id="fechaInicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaEntrega">Fecha de entrega</Label>
              <Input id="fechaEntrega" type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Responsable(s) *</Label>
            <UserMultiSelect value={responsable} onChange={setResponsable} placeholder="Seleccionar equipo responsable..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" placeholder="Describe el proyecto..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false) }}>Cancelar</Button>
            <Button type="submit">Crear Proyecto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

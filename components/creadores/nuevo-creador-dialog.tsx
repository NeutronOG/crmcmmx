"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addCreador } from "@/lib/store"
import { toast } from "sonner"

interface NuevoCreadorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function NuevoCreadorDialog({ open, onOpenChange, onCreated }: NuevoCreadorDialogProps) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [especialidad, setEspecialidad] = useState("")
  const [tarifa, setTarifa] = useState("")
  const [estado, setEstado] = useState("Disponible")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    setSaving(true)
    try {
      await addCreador({ nombre: nombre.trim(), email: email.trim(), especialidad: especialidad.trim(), tarifa: tarifa.trim(), estado })
      toast.success("Creador agregado")
      setNombre(""); setEmail(""); setEspecialidad(""); setTarifa(""); setEstado("Disponible")
      onOpenChange(false)
      onCreated()
    } catch {
      toast.error("Error al agregar creador")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Creador de Contenido</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre completo" required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>Especialidad</Label>
            <Input value={especialidad} onChange={e => setEspecialidad(e.target.value)} placeholder="Ej: Video, Fotografía, Diseño..." />
          </div>
          <div className="space-y-2">
            <Label>Tarifa</Label>
            <Input value={tarifa} onChange={e => setTarifa(e.target.value)} placeholder="Ej: $500/proyecto" />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Disponible">Disponible</SelectItem>
                <SelectItem value="Ocupado">Ocupado</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving || !nombre.trim()}>
              {saving ? "Guardando..." : "Agregar Creador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

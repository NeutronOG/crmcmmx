"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addCotizacion } from "@/lib/store"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

interface NuevaCotizacionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

export function NuevaCotizacionDialog({ open, onOpenChange, onCreated }: NuevaCotizacionDialogProps) {
  const { usuario } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    cliente: "",
    proyecto: "",
    valor: "",
    estado: "Borrador" as const,
    fechaVencimiento: "",
    responsable: "",
  })

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    if (!form.cliente.trim() || !form.valor) {
      toast.error("Cliente y valor son requeridos")
      return
    }
    setLoading(true)
    try {
      await addCotizacion({
        cliente: form.cliente.trim(),
        proyecto: form.proyecto.trim(),
        valor: Number(form.valor),
        estado: form.estado,
        fechaCreacion: new Date().toISOString().split("T")[0],
        fechaVencimiento: form.fechaVencimiento,
        seguimientos: 0,
        responsable: form.responsable || usuario?.nombre || "",
      })
      toast.success("Cotización creada")
      setForm({ cliente: "", proyecto: "", valor: "", estado: "Borrador", fechaVencimiento: "", responsable: "" })
      onOpenChange(false)
      onCreated?.()
    } catch (e) {
      toast.error("Error al crear cotización")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Cotización</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Cliente *</Label>
            <Input placeholder="Nombre del cliente" value={form.cliente} onChange={e => set("cliente", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Proyecto</Label>
            <Input placeholder="Nombre del proyecto" value={form.proyecto} onChange={e => set("proyecto", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Valor ($) *</Label>
              <Input type="number" placeholder="0" value={form.valor} onChange={e => set("valor", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={v => set("estado", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Borrador">Borrador</SelectItem>
                  <SelectItem value="Enviada">Enviada</SelectItem>
                  <SelectItem value="En Negociación">En Negociación</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                  <SelectItem value="Rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Fecha Vencimiento</Label>
              <Input type="date" value={form.fechaVencimiento} onChange={e => set("fechaVencimiento", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Responsable</Label>
              <Input placeholder={usuario?.nombre || "Responsable"} value={form.responsable} onChange={e => set("responsable", e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
              {loading ? "Guardando..." : "Crear Cotización"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

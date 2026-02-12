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
import { addCliente } from "@/lib/store"
import { UserMultiSelect } from "@/components/user-multi-select"
import { toast } from "sonner"

interface NuevoClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function NuevoClienteDialog({ open, onOpenChange, onCreated }: NuevoClienteDialogProps) {
  const [nombre, setNombre] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [estado, setEstado] = useState<"Activo" | "Prospecto" | "En Onboarding">("Prospecto")
  const [valorMensual, setValorMensual] = useState("")
  const [responsable, setResponsable] = useState<string[]>([])
  const [notas, setNotas] = useState("")

  const resetForm = () => {
    setNombre("")
    setEmpresa("")
    setEmail("")
    setTelefono("")
    setEstado("Prospecto")
    setValorMensual("")
    setResponsable([])
    setNotas("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }
    if (!empresa.trim()) {
      toast.error("La empresa es obligatoria")
      return
    }

    try {
      await addCliente({
        nombre: nombre.trim(),
        empresa: empresa.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        estado,
        etapaOnboarding: estado === "En Onboarding" ? "Bienvenida" : estado === "Activo" ? "Completado" : "Bienvenida",
        valorMensual: parseFloat(valorMensual) || 0,
        fechaInicio: estado === "Activo" || estado === "En Onboarding" ? new Date().toISOString().split("T")[0] : "",
        ultimoContacto: new Date().toISOString().split("T")[0],
        responsable: responsable.join(", "),
        notas: notas.trim(),
      })
      toast.success("Cliente creado exitosamente")
      resetForm()
      onOpenChange(false)
      onCreated()
    } catch {
      toast.error("Error al crear el cliente")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-lg ">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
          <DialogDescription>Registra un nuevo cliente en el sistema</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" placeholder="Nombre del contacto" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa *</Label>
              <Input id="empresa" placeholder="Nombre de la empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="correo@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" placeholder="+52 55 1234 5678" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v as typeof estado)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prospecto">Prospecto</SelectItem>
                  <SelectItem value="En Onboarding">En Onboarding</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorMensual">Valor mensual ($)</Label>
              <Input id="valorMensual" type="number" placeholder="0" value={valorMensual} onChange={(e) => setValorMensual(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Responsable</Label>
            <UserMultiSelect value={responsable} onChange={setResponsable} placeholder="Seleccionar responsable..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea id="notas" placeholder="Notas sobre el cliente..." value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false) }}>Cancelar</Button>
            <Button type="submit">Crear Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

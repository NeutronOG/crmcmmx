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
import { addLead, notificarDueno } from "@/lib/store"
import { UserMultiSelect } from "@/components/user-multi-select"
import { toast } from "sonner"

interface NuevoLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function NuevoLeadDialog({ open, onOpenChange, onCreated }: NuevoLeadDialogProps) {
  const [nombre, setNombre] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [origen, setOrigen] = useState("Web")
  const [estado, setEstado] = useState<"Nuevo" | "Contactado" | "Calificado" | "Propuesta" | "Negociación">("Nuevo")
  const [valorEstimado, setValorEstimado] = useState("")
  const [probabilidad, setProbabilidad] = useState("20")
  const [responsable, setResponsable] = useState<string[]>([])
  const [notas, setNotas] = useState("")

  const resetForm = () => {
    setNombre("")
    setEmpresa("")
    setEmail("")
    setTelefono("")
    setOrigen("Web")
    setEstado("Nuevo")
    setValorEstimado("")
    setProbabilidad("20")
    setResponsable([])
    setNotas("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    try {
      await addLead({
        nombre: nombre.trim(),
        empresa: empresa.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        origen,
        estado,
        valorEstimado: parseFloat(valorEstimado) || 0,
        probabilidad: parseInt(probabilidad) || 20,
        fechaCreacion: new Date().toISOString().split("T")[0],
        ultimoContacto: new Date().toISOString().split("T")[0],
        responsable: responsable.join(", "),
        notas: notas.trim(),
      })
      toast.success("Lead creado exitosamente")
      // Financial leads go directly to Guillermo (dueño)
      const valor = parseFloat(valorEstimado) || 0
      if (valor > 0) {
        await notificarDueno({
          tipo: "cliente",
          titulo: `Nuevo lead: ${nombre.trim()} — $${valor.toLocaleString()}`,
          mensaje: `Empresa: ${empresa.trim() || "Sin empresa"} | Responsable: ${responsable.join(", ") || "Sin asignar"}`,
          enlace: "/mi-empresa",
        })
      }
      resetForm()
      onOpenChange(false)
      onCreated()
    } catch {
      toast.error("Error al crear el lead")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-lg ">
        <DialogHeader>
          <DialogTitle>Nuevo Lead</DialogTitle>
          <DialogDescription>Registra un nuevo prospecto en el pipeline</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" placeholder="Nombre del contacto" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
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
              <Label>Origen</Label>
              <Select value={origen} onValueChange={setOrigen}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Referido">Referido</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="Evento">Evento</SelectItem>
                  <SelectItem value="Llamada">Llamada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v as typeof estado)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nuevo">Nuevo</SelectItem>
                  <SelectItem value="Contactado">Contactado</SelectItem>
                  <SelectItem value="Calificado">Calificado</SelectItem>
                  <SelectItem value="Propuesta">Propuesta</SelectItem>
                  <SelectItem value="Negociación">Negociación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorEstimado">Valor estimado ($)</Label>
              <Input id="valorEstimado" type="number" placeholder="0" value={valorEstimado} onChange={(e) => setValorEstimado(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="probabilidad">Probabilidad (%)</Label>
              <Input id="probabilidad" type="number" min="0" max="100" placeholder="20" value={probabilidad} onChange={(e) => setProbabilidad(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Responsable</Label>
            <UserMultiSelect value={responsable} onChange={setResponsable} placeholder="Seleccionar responsable..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea id="notas" placeholder="Notas sobre el lead..." value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false) }}>Cancelar</Button>
            <Button type="submit">Crear Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

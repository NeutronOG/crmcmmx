"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Plus, Pencil, Trash2, X, Check, Shield } from "lucide-react"
import { getUsuarios, rolesLabels } from "@/lib/auth"
import type { Usuario, Rol } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const rolesDisponibles: { value: Rol; label: string }[] = [
  { value: "admin", label: "Administrador" },
  { value: "dueno", label: "Dueño" },
  { value: "diseñador_grafico", label: "Diseñador Gráfico" },
  { value: "diseñador_industrial", label: "Diseñador Industrial" },
  { value: "produccion_audiovisual", label: "Producción Audiovisual" },
  { value: "produccion_activaciones", label: "Producción de Activaciones" },
  { value: "marketing_digital", label: "Marketing Digital" },
  { value: "auxiliar_marketing", label: "Auxiliar de Marketing" },
  { value: "creador_contenido", label: "Creador de Contenido" },
  { value: "creador_parrilla", label: "Creador de Parrilla" },
  { value: "administracion", label: "Administración" },
  { value: "influencer", label: "Influencer" },
  { value: "freelancer", label: "Freelancer" },
]

export function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [rol, setRol] = useState<Rol>("diseñador_grafico")

  const loadUsuarios = async () => {
    const data = await getUsuarios()
    setUsuarios(data)
    setLoading(false)
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  const resetForm = () => {
    setNombre("")
    setEmail("")
    setRol("diseñador_grafico")
    setShowForm(false)
    setEditingId(null)
  }

  const handleCrear = async () => {
    if (!nombre.trim() || !email.trim()) {
      toast.error("Nombre y email son requeridos")
      return
    }
    const { error } = await supabase.from("usuarios").insert({
      nombre: nombre.trim(),
      email: email.trim(),
      rol,
    })
    if (error) {
      toast.error("Error al crear usuario")
      console.error(error)
      return
    }
    toast.success(`Usuario ${nombre} creado`)
    resetForm()
    await loadUsuarios()
  }

  const handleEditar = (u: Usuario) => {
    setEditingId(u.id)
    setNombre(u.nombre)
    setEmail(u.email)
    setRol(u.rol)
    setShowForm(true)
  }

  const handleGuardar = async () => {
    if (!editingId || !nombre.trim() || !email.trim()) return
    const { error } = await supabase
      .from("usuarios")
      .update({ nombre: nombre.trim(), email: email.trim(), rol })
      .eq("id", editingId)
    if (error) {
      toast.error("Error al actualizar usuario")
      console.error(error)
      return
    }
    toast.success(`Usuario ${nombre} actualizado`)
    resetForm()
    await loadUsuarios()
  }

  const handleEliminar = async (id: string, nombreUsuario: string) => {
    if (!confirm(`¿Eliminar a ${nombreUsuario}? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from("usuarios").delete().eq("id", id)
    if (error) {
      toast.error("Error al eliminar usuario")
      console.error(error)
      return
    }
    toast.success(`Usuario ${nombreUsuario} eliminado`)
    await loadUsuarios()
  }

  const getRolColor = (r: Rol) => {
    switch (r) {
      case "admin": return "satin-red-bg satin-red border satin-red-border"
      case "dueno": return "satin-green-bg satin-green border satin-green-border"
      default: return "bg-white/5 text-white/50 border-white/10"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl satin-blue-bg flex items-center justify-center">
            <Users className="size-5 satin-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Equipo de Trabajo</h2>
            <p className="text-sm text-muted-foreground">{usuarios.length} miembro{usuarios.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-2 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 text-white font-medium"
          onClick={() => { resetForm(); setShowForm(true) }}
        >
          <Plus className="size-4" />
          Nuevo Miembro
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="glass-card p-5 rounded-xl border-white/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{editingId ? "Editar Miembro" : "Nuevo Miembro"}</h3>
            <Button variant="ghost" size="icon" className="size-7" onClick={resetForm}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre</Label>
              <Input
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="bg-transparent border-white/10 h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                placeholder="correo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-white/10 h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rol</Label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as Rol)}
                className="w-full h-9 rounded-md border border-white/10 bg-transparent text-sm px-3 text-white"
              >
                {rolesDisponibles.map((r) => (
                  <option key={r.value} value={r.value} className="bg-[#1a1a1a]">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="rounded-full border-white/10 text-xs" onClick={resetForm}>
              Cancelar
            </Button>
            <Button
              size="sm"
              className="rounded-full bg-white/10 border border-white/20 text-xs gap-1"
              onClick={editingId ? handleGuardar : handleCrear}
            >
              <Check className="size-3" />
              {editingId ? "Guardar" : "Crear"}
            </Button>
          </div>
        </Card>
      )}

      {/* Users list */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-muted-foreground">Cargando equipo...</div>
        </div>
      ) : (
        <div className="space-y-2">
          {usuarios.map((u) => {
            const initials = u.nombre.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
            return (
              <Card key={u.id} className="glass-card p-4 rounded-xl hover:border-white/20 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-2 ring-white/10">
                      <AvatarFallback className="bg-white/10 text-white text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{u.nombre}</span>
                        {(u.rol === "admin" || u.rol === "dueno") && (
                          <Shield className="size-3.5 satin-yellow" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`text-[10px] rounded-full ${getRolColor(u.rol)}`}>
                      {rolesLabels[u.rol] || u.rol}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 hover:bg-white/10"
                        onClick={() => handleEditar(u)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 hover:bg-white/10 hover:text-red-400"
                        onClick={() => handleEliminar(u.id, u.nombre)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

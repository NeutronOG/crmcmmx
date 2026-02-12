"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Lightbulb, Plus, Users, Briefcase, Trash2, Settings } from "lucide-react"
import { getIdeaRooms, getIdeaRoomsByUsuario, createIdeaRoom, deleteIdeaRoom, updateIdeaRoomParticipantes, getProyectos, crearNotificacion } from "@/lib/store"
import { getUsuarios } from "@/lib/auth"
import type { IdeaRoom } from "@/lib/store"
import type { Usuario } from "@/lib/auth"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

interface IdeaRoomListProps {
  onSelectRoom: (room: IdeaRoom) => void
}

export function IdeaRoomList({ onSelectRoom }: IdeaRoomListProps) {
  const { usuario, isAdmin } = useAuth()
  const [rooms, setRooms] = useState<IdeaRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingRoom, setEditingRoom] = useState<string | null>(null)

  // Create form
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [proyectoId, setProyectoId] = useState("")
  const [selectedParticipantes, setSelectedParticipantes] = useState<string[]>([])

  // Data
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [proyectos, setProyectos] = useState<{ id: string; nombre: string }[]>([])

  const load = useCallback(async () => {
    if (!usuario) return
    const data = isAdmin ? await getIdeaRooms() : await getIdeaRoomsByUsuario(usuario.nombre)
    setRooms(data)
    setLoading(false)
  }, [usuario, isAdmin])

  useEffect(() => {
    load()
    if (isAdmin) {
      getUsuarios().then(setUsuarios)
      getProyectos().then(p => setProyectos(p.map(pr => ({ id: pr.id, nombre: pr.nombre }))))
    }
  }, [load, isAdmin])

  const handleCreate = async () => {
    if (!usuario || !nombre.trim()) return
    try {
      const participantes = [...selectedParticipantes]
      if (!participantes.includes(usuario.nombre)) participantes.push(usuario.nombre)

      await createIdeaRoom({
        nombre: nombre.trim(),
        proyectoId: proyectoId || undefined,
        descripcion,
        creadoPor: usuario.nombre,
        participantes,
      })

      for (const p of selectedParticipantes) {
        if (p !== usuario.nombre) {
          await crearNotificacion({
            usuarioDestino: p,
            tipo: "idea_room",
            titulo: "Nuevo Idea Room",
            mensaje: `${usuario.nombre} te agregó al Idea Room "${nombre.trim()}"`,
          })
        }
      }

      toast.success("Idea Room creado")
      setNombre("")
      setDescripcion("")
      setProyectoId("")
      setSelectedParticipantes([])
      setShowCreate(false)
      await load()
    } catch {
      toast.error("Error al crear Idea Room")
    }
  }

  const handleDelete = async (id: string) => {
    await deleteIdeaRoom(id)
    toast.success("Idea Room archivado")
    await load()
  }

  const handleUpdateParticipantes = async (roomId: string, participantes: string[]) => {
    await updateIdeaRoomParticipantes(roomId, participantes)
    toast.success("Participantes actualizados")
    setEditingRoom(null)
    await load()
  }

  const toggleParticipante = (nombre: string) => {
    setSelectedParticipantes(prev =>
      prev.includes(nombre) ? prev.filter(p => p !== nombre) : [...prev, nombre]
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl satin-yellow-bg flex items-center justify-center">
            <Lightbulb className="size-5 satin-yellow" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Idea Room</h2>
            <p className="text-sm text-muted-foreground">{rooms.length} sala{rooms.length !== 1 ? "s" : ""} activa{rooms.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        {isAdmin && (
          <Button size="sm" className="liquid-gradient border border-white/20 text-white" onClick={() => setShowCreate(!showCreate)}>
            <Plus className="size-3.5 mr-1" />
            Nuevo
          </Button>
        )}
      </div>

      {/* Create form (admin only) */}
      {showCreate && isAdmin && (
        <Card className="glass-card rounded-xl p-4 space-y-3">
          <Input placeholder="Nombre del Idea Room" value={nombre} onChange={e => setNombre(e.target.value)} className="bg-transparent border-white/10 text-sm" />
          <Input placeholder="Descripción (opcional)" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="bg-transparent border-white/10 text-sm" />
          <select
            value={proyectoId}
            onChange={e => setProyectoId(e.target.value)}
            className="w-full h-9 rounded-md border border-white/10 bg-transparent px-3 text-sm"
          >
            <option value="">Sin proyecto específico</option>
            {proyectos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Participantes:</p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {usuarios.filter(u => u.rol !== "admin").map(u => (
                <button
                  key={u.id}
                  onClick={() => toggleParticipante(u.nombre)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                    selectedParticipantes.includes(u.nombre)
                      ? "bg-primary text-primary-foreground"
                      : "glass-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {u.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={handleCreate} disabled={!nombre.trim()}>Crear Sala</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
          </div>
        </Card>
      )}

      {/* Room list */}
      {loading ? (
        <div className="text-center py-8"><div className="animate-pulse text-muted-foreground">Cargando salas...</div></div>
      ) : rooms.length === 0 ? (
        <Card className="glass-card p-8 rounded-xl text-center">
          <Lightbulb className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">{isAdmin ? "Crea tu primer Idea Room" : "No estás en ningún Idea Room"}</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {rooms.map(room => (
            <Card
              key={room.id}
              className="glass-card p-4 rounded-xl hover:scale-[1.005] transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectRoom(room)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{room.nombre}</h3>
                  {room.descripcion && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{room.descripcion}</p>}
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10" onClick={() => setEditingRoom(editingRoom === room.id ? null : room.id)}>
                      <Settings className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7 hover:satin-red-bg hover:satin-red" onClick={() => handleDelete(room.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="size-3" />
                  <span>{room.participantes.length} participante{room.participantes.length !== 1 ? "s" : ""}</span>
                </div>
                <span className="text-muted-foreground/30">&middot;</span>
                <span>Creado por {room.creadoPor}</span>
              </div>

              {/* Edit participants (admin) */}
              {editingRoom === room.id && isAdmin && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2" onClick={e => e.stopPropagation()}>
                  <p className="text-xs font-medium">Editar participantes:</p>
                  <div className="flex flex-wrap gap-1">
                    {usuarios.filter(u => u.rol !== "admin").map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          const current = room.participantes.includes(u.nombre)
                            ? room.participantes.filter(p => p !== u.nombre)
                            : [...room.participantes, u.nombre]
                          handleUpdateParticipantes(room.id, current)
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] transition-all ${
                          room.participantes.includes(u.nombre)
                            ? "bg-primary text-primary-foreground"
                            : "glass-card text-muted-foreground"
                        }`}
                      >
                        {u.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

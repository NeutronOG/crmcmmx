"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Plus, X, Clock, Calendar as CalIcon, Users, AlertTriangle, CheckCircle2, Circle, Trash2 } from "lucide-react"
import { getEventosCalendario, addEventoCalendario, deleteEventoCalendario, getTareasByUsuario, addTarea, crearNotificacion } from "@/lib/store"
import type { EventoCalendario, Tarea } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { UserMultiSelect } from "@/components/user-multi-select"
import { toast } from "sonner"

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

const IMPORTANCIA = [
  { id: "alta" as const, label: "Urgente", color: "#c06060", bg: "satin-red-solid", icon: <AlertTriangle className="size-3" /> },
  { id: "media" as const, label: "Normal", color: "#b8a050", bg: "satin-yellow-solid", icon: <Circle className="size-3" /> },
  { id: "baja" as const, label: "Baja", color: "#60a878", bg: "satin-green-bg", icon: <CheckCircle2 className="size-3" /> },
]

const TIPOS_EVENTO = [
  { id: "evento", label: "Evento" },
  { id: "reunion", label: "Reunión" },
  { id: "entrega", label: "Entrega" },
  { id: "recordatorio", label: "Recordatorio" },
]

export function Calendario() {
  const { usuario } = useAuth()
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [mesActual, setMesActual] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState<"evento" | "tarea">("evento")
  const [loading, setLoading] = useState(true)

  // Form state
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [horaInicio, setHoraInicio] = useState("09:00")
  const [horaFin, setHoraFin] = useState("10:00")
  const [todoElDia, setTodoElDia] = useState(true)
  const [importancia, setImportancia] = useState<"alta" | "media" | "baja">("media")
  const [tipoEvento, setTipoEvento] = useState("evento")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  // Task form extra
  const [tareaProyecto, setTareaProyecto] = useState("")
  const [tareaAsignado, setTareaAsignado] = useState<string[]>([])

  const load = useCallback(async () => {
    if (!usuario) return
    const [evts, tareas] = await Promise.all([
      getEventosCalendario(usuario.nombre),
      getTareasByUsuario(usuario.nombre),
    ])
    const tareaEvents: EventoCalendario[] = tareas
      .filter(t => t.fechaVencimiento && t.estado !== "Completada")
      .map(t => ({
        id: `tarea-${t.id}`,
        titulo: t.titulo,
        descripcion: `Tarea: ${t.proyecto || "Sin proyecto"}`,
        fechaInicio: `${t.fechaVencimiento}T09:00:00`,
        todoElDia: true,
        color: t.prioridad === "Alta" ? "#ef4444" : t.prioridad === "Media" ? "#eab308" : "#22c55e",
        tipo: "tarea",
        importancia: t.prioridad === "Alta" ? "alta" as const : t.prioridad === "Media" ? "media" as const : "baja" as const,
        usuario: usuario.nombre,
        participantes: [t.asignado],
        proyecto: t.proyecto,
        tareaId: t.id,
      }))
    setEventos([...evts, ...tareaEvents])
    setLoading(false)
  }, [usuario])

  useEffect(() => { load() }, [load])

  const year = mesActual.getFullYear()
  const month = mesActual.getMonth()

  const diasDelMes = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6
    const days: { date: Date; isCurrentMonth: boolean }[] = []
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    return days
  }, [year, month])

  const getEventosForDate = (dateStr: string) =>
    eventos.filter(e => e.fechaInicio.split("T")[0] === dateStr)

  const formatDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  const today = formatDateStr(new Date())

  const resetForm = () => {
    setTitulo("")
    setDescripcion("")
    setHoraInicio("09:00")
    setHoraFin("10:00")
    setTodoElDia(true)
    setImportancia("media")
    setTipoEvento("evento")
    setSelectedParticipants([])
    setTareaProyecto("")
    setTareaAsignado([])
    setShowForm(false)
    setFormMode("evento")
  }

  const handleAddEvento = async () => {
    if (!usuario || !selectedDate || !titulo.trim()) return
    try {
      const imp = IMPORTANCIA.find(i => i.id === importancia)
      await addEventoCalendario({
        titulo: titulo.trim(),
        descripcion,
        fechaInicio: todoElDia ? `${selectedDate}T00:00:00` : `${selectedDate}T${horaInicio}:00`,
        fechaFin: todoElDia ? undefined : `${selectedDate}T${horaFin}:00`,
        todoElDia,
        color: imp?.color || "#eab308",
        tipo: tipoEvento,
        importancia,
        usuario: usuario.nombre,
        participantes: selectedParticipants,
        proyecto: "",
      })
      // Notify participants
      for (const p of selectedParticipants) {
        if (p !== usuario.nombre) {
          await crearNotificacion({
            usuarioDestino: p,
            tipo: "calendario",
            titulo: `Nuevo ${tipoEvento}: ${titulo.trim()}`,
            mensaje: `${usuario.nombre} te agregó a "${titulo.trim()}" el ${selectedDate}`,
          })
        }
      }
      toast.success("Evento creado")
      resetForm()
      await load()
    } catch {
      toast.error("Error al crear evento")
    }
  }

  const handleAddTarea = async () => {
    if (!usuario || !selectedDate || !titulo.trim() || tareaAsignado.length === 0) return
    try {
      await addTarea({
        titulo: titulo.trim(),
        descripcion,
        proyecto: tareaProyecto,
        cliente: "",
        asignado: tareaAsignado.join(", "),
        estado: "Pendiente",
        prioridad: importancia === "alta" ? "Alta" : importancia === "media" ? "Media" : "Baja",
        fechaCreacion: new Date().toISOString().split("T")[0],
        fechaVencimiento: selectedDate,
        fechaCompletada: "",
        etiquetas: [],
      })
      for (const assignee of tareaAsignado) {
        if (assignee !== usuario.nombre) {
          await crearNotificacion({
            usuarioDestino: assignee,
            tipo: "tarea",
        titulo: "Nueva tarea asignada",
            mensaje: `${usuario.nombre} te asignó la tarea "${titulo.trim()}" para el ${selectedDate}`,
          })
        }
      }
      toast.success("Tarea creada y asignada")
      resetForm()
      await load()
    } catch {
      toast.error("Error al crear tarea")
    }
  }

  const handleDeleteEvento = async (id: string) => {
    if (id.startsWith("tarea-")) {
      toast.info("Las tareas se gestionan desde Tareas")
      return
    }
    await deleteEventoCalendario(id)
    toast.success("Evento eliminado")
    await load()
  }

  const getImportanciaInfo = (imp: string) =>
    IMPORTANCIA.find(i => i.id === imp) || IMPORTANCIA[1]

  const selectedEvents = selectedDate ? getEventosForDate(selectedDate) : []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
            <CalIcon className="size-5 satin-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Calendario</h2>
            <p className="text-sm text-muted-foreground">Agenda y tareas del equipo</p>
          </div>
        </div>
        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3">
          {IMPORTANCIA.map(imp => (
            <div key={imp.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="size-2.5 rounded-full" style={{ backgroundColor: imp.color }} />
              {imp.label}
            </div>
          ))}
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={() => setMesActual(new Date(year, month - 1))}>
          <ChevronLeft className="size-4" />
        </Button>
        <h3 className="text-lg font-semibold">{MESES[month]} {year}</h3>
        <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={() => setMesActual(new Date(year, month + 1))}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      <Card className="glass-card rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/10">
          {DIAS.map(d => (
            <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {diasDelMes.map(({ date, isCurrentMonth }, idx) => {
            const dateStr = formatDateStr(date)
            const dayEvents = getEventosForDate(dateStr)
            const isToday = dateStr === today
            const isSelected = dateStr === selectedDate
            const hasUrgent = dayEvents.some(e => e.importancia === "alta")

            return (
              <div
                key={idx}
                className={`min-h-[80px] sm:min-h-[90px] p-1 border-b border-r border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                  !isCurrentMonth ? "opacity-30" : ""
                } ${isSelected ? "bg-primary/10 ring-1 ring-primary/30" : ""}`}
                onClick={() => { setSelectedDate(dateStr); setShowForm(false) }}
              >
                <div className="flex items-center gap-1">
                  <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? "bg-primary text-primary-foreground" : ""
                  }`}>
                    {date.getDate()}
                  </div>
                  {hasUrgent && <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />}
                </div>
                <div className="space-y-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map(e => {
                    const imp = getImportanciaInfo(e.importancia)
                    return (
                      <div
                        key={e.id}
                        className="text-[10px] px-1 py-0.5 rounded truncate font-medium flex items-center gap-0.5"
                        style={{ backgroundColor: `${imp.color}15`, color: imp.color }}
                      >
                        <div className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: imp.color }} />
                        <span className="truncate">{e.titulo}</span>
                      </div>
                    )
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} más</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Selected date detail */}
      {selectedDate && (
        <Card className="glass-card rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-semibold text-sm">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
            </h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-xs liquid-gradient border border-white/20 text-white"
                onClick={() => { setShowForm(true); setFormMode("evento") }}
              >
                <Plus className="size-3 mr-1" />
                Evento
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-white/20"
                onClick={() => { setShowForm(true); setFormMode("tarea") }}
              >
                <Plus className="size-3 mr-1" />
                Tarea
              </Button>
            </div>
          </div>

          {/* Events list */}
          {selectedEvents.length === 0 && !showForm && (
            <p className="text-sm text-muted-foreground text-center py-4">Sin eventos para este día</p>
          )}

          {selectedEvents.map(e => {
            const imp = getImportanciaInfo(e.importancia)
            return (
              <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-white/5">
                {/* Importance bar */}
                <div className="w-1 min-h-[40px] rounded-full shrink-0" style={{ backgroundColor: imp.color }} />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{e.titulo}</p>
                    <div
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: imp.color }}
                      title={imp.label}
                    />
                  </div>
                  {e.descripcion && <p className="text-xs text-muted-foreground">{e.descripcion}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!e.todoElDia && e.fechaInicio && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{new Date(e.fechaInicio).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
                        {e.fechaFin && (
                          <span>- {new Date(e.fechaFin).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span>
                        )}
                      </div>
                    )}
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px]"
                      style={{ borderColor: `${imp.color}40`, color: imp.color }}
                    >
                      {e.tipo === "tarea" ? "Tarea" : e.tipo === "reunion" ? "Reunión" : e.tipo === "entrega" ? "Entrega" : e.tipo === "recordatorio" ? "Recordatorio" : "Evento"}
                    </Badge>
                    <Badge variant="outline" className="rounded-full text-[10px]" style={{ borderColor: `${imp.color}40`, color: imp.color }}>
                      {imp.label}
                    </Badge>
                  </div>
                  {/* Participants */}
                  {e.participantes && e.participantes.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Users className="size-3 text-muted-foreground" />
                      {e.participantes.map(p => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">{p}</span>
                      ))}
                    </div>
                  )}
                </div>
                {e.tipo !== "tarea" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 group-hover:opacity-100 hover:satin-red-bg hover:satin-red shrink-0"
                    onClick={() => handleDeleteEvento(e.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            )
          })}

          {/* ===== CREATE FORM ===== */}
          {showForm && (
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-semibold">
                  {formMode === "evento" ? "Nuevo Evento" : "Nueva Tarea"}
                </h5>
                <Button variant="ghost" size="icon" className="size-6 hover:bg-white/10" onClick={resetForm}>
                  <X className="size-3.5" />
                </Button>
              </div>

              {/* Mode tabs */}
              <div className="flex gap-1 p-0.5 rounded-lg bg-white/5">
                <button
                  className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${formMode === "evento" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setFormMode("evento")}
                >
                  Evento
                </button>
                <button
                  className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${formMode === "tarea" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setFormMode("tarea")}
                >
                  Tarea
                </button>
              </div>

              {/* Title */}
              <Input
                placeholder={formMode === "evento" ? "Título del evento" : "Título de la tarea"}
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                className="bg-transparent border-white/10 text-sm"
              />

              {/* Description */}
              <textarea
                placeholder="Descripción (opcional)"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />

              {/* Event type (only for events) */}
              {formMode === "evento" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tipo de evento</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {TIPOS_EVENTO.map(t => (
                      <button
                        key={t.id}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          tipoEvento === t.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        }`}
                        onClick={() => setTipoEvento(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Importance */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Importancia</label>
                <div className="flex gap-2">
                  {IMPORTANCIA.map(imp => (
                    <button
                      key={imp.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        importancia === imp.id
                          ? "border-current scale-105"
                          : "border-transparent bg-white/5 opacity-60 hover:opacity-100"
                      }`}
                      style={importancia === imp.id ? { backgroundColor: `${imp.color}15`, color: imp.color, borderColor: `${imp.color}40` } : {}}
                      onClick={() => setImportancia(imp.id)}
                    >
                      <div className="size-3 rounded-full" style={{ backgroundColor: imp.color }} />
                      {imp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              {formMode === "evento" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Horario</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={todoElDia}
                        onChange={e => setTodoElDia(e.target.checked)}
                        className="rounded accent-primary"
                      />
                      Todo el día
                    </label>
                    {!todoElDia && (
                      <div className="flex items-center gap-2">
                        <Input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} className="bg-transparent border-white/10 text-xs h-8 w-28" />
                        <span className="text-xs text-muted-foreground">a</span>
                        <Input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} className="bg-transparent border-white/10 text-xs h-8 w-28" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Assign to (for tasks) */}
              {formMode === "tarea" && (
                <UserMultiSelect
                  label="Asignar a"
                  value={tareaAsignado}
                  onChange={setTareaAsignado}
                  placeholder="Buscar miembro del equipo..."
                />
              )}

              {/* Participants (for events) */}
              {formMode === "evento" && (
                <UserMultiSelect
                  label="Participantes"
                  value={selectedParticipants}
                  onChange={setSelectedParticipants}
                  placeholder="Buscar personal..."
                  excludeSelf={usuario?.nombre}
                />
              )}

              {/* Project (for tasks) */}
              {formMode === "tarea" && (
                <Input
                  placeholder="Proyecto (opcional)"
                  value={tareaProyecto}
                  onChange={e => setTareaProyecto(e.target.value)}
                  className="bg-transparent border-white/10 text-sm"
                />
              )}

              {/* Submit */}
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="flex-1 liquid-gradient border border-white/20 text-white"
                  onClick={formMode === "evento" ? handleAddEvento : handleAddTarea}
                  disabled={!titulo.trim() || (formMode === "tarea" && !tareaAsignado)}
                >
                  {formMode === "evento" ? "Crear Evento" : "Crear Tarea"}
                </Button>
                <Button size="sm" variant="ghost" className="text-xs" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

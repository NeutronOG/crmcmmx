"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Mail, User, DollarSign, MoreVertical, GripVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Lead } from "@/lib/store"

const stages = [
  { id: "Nuevo", label: "Nuevos", color: "satin-blue-solid" },
  { id: "Contactado", label: "Contactados", color: "satin-purple-solid" },
  { id: "Calificado", label: "Calificados", color: "satin-yellow-solid" },
  { id: "Propuesta", label: "Propuesta", color: "satin-cyan-solid" },
  { id: "Negociación", label: "Negociación", color: "satin-cyan-solid" },
  { id: "Ganado", label: "Ganados", color: "satin-green-bg" },
]

interface LeadsKanbanProps {
  leads: Lead[]
  loading?: boolean
  onCambiarEstado: (id: string, estado: Lead["estado"]) => void
  onEliminar: (id: string) => void
}

export function LeadsKanban({ leads, loading, onCambiarEstado, onEliminar }: LeadsKanbanProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  // Touch drag state
  const touchRef = useRef<{ id: string; startX: number; startY: number; el: HTMLElement | null; ghost: HTMLElement | null } | null>(null)
  const columnsRef = useRef<Map<string, HTMLElement>>(new Map())

  // ---- HTML5 Drag (desktop) ----
  const onDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", leadId)
    setDraggingId(leadId)
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.4"
    }
  }

  const onDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1"
    }
    setDraggingId(null)
    setDragOverStage(null)
  }

  const onDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverStage(stageId)
  }

  const onDragLeave = () => {
    setDragOverStage(null)
  }

  const onDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData("text/plain")
    setDragOverStage(null)
    setDraggingId(null)
    if (leadId) {
      const lead = leads.find(l => l.id === leadId)
      if (lead && lead.estado !== stageId) {
        onCambiarEstado(leadId, stageId as Lead["estado"])
      }
    }
  }

  // ---- Touch Drag (iPad / mobile) ----
  const onTouchStart = (e: React.TouchEvent, leadId: string) => {
    const touch = e.touches[0]
    const el = e.currentTarget as HTMLElement

    // Create ghost element
    const ghost = el.cloneNode(true) as HTMLElement
    ghost.style.position = "fixed"
    ghost.style.zIndex = "9999"
    ghost.style.width = `${el.offsetWidth}px`
    ghost.style.pointerEvents = "none"
    ghost.style.opacity = "0.85"
    ghost.style.transform = "rotate(2deg) scale(1.05)"
    ghost.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)"
    ghost.style.left = `${touch.clientX - el.offsetWidth / 2}px`
    ghost.style.top = `${touch.clientY - 30}px`
    document.body.appendChild(ghost)

    el.style.opacity = "0.3"
    setDraggingId(leadId)

    touchRef.current = { id: leadId, startX: touch.clientX, startY: touch.clientY, el, ghost }
  }

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!touchRef.current?.ghost) return
    e.preventDefault()
    const touch = e.touches[0]
    const { ghost } = touchRef.current

    ghost.style.left = `${touch.clientX - ghost.offsetWidth / 2}px`
    ghost.style.top = `${touch.clientY - 30}px`

    // Detect which column we're over
    let foundStage: string | null = null
    columnsRef.current.forEach((colEl, stageId) => {
      const rect = colEl.getBoundingClientRect()
      if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        foundStage = stageId
      }
    })
    setDragOverStage(foundStage)
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchRef.current) return
    const { id, el, ghost } = touchRef.current

    // Clean up ghost
    if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost)
    if (el) el.style.opacity = "1"

    // Drop on the stage we're over
    setDragOverStage(prev => {
      if (prev) {
        const lead = leads.find(l => l.id === id)
        if (lead && lead.estado !== prev) {
          onCambiarEstado(id, prev as Lead["estado"])
        }
      }
      return null
    })

    setDraggingId(null)
    touchRef.current = null
  }, [leads])

  // Register global touch listeners
  useEffect(() => {
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("touchend", onTouchEnd)
    return () => {
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [onTouchMove, onTouchEnd])

  const grouped: Record<string, Lead[]> = {}
  for (const s of stages) grouped[s.id] = []
  for (const l of leads) {
    if (grouped[l.estado]) grouped[l.estado].push(l)
  }

  if (loading) {
    return <div className="text-center py-12"><div className="animate-pulse text-muted-foreground">Cargando leads...</div></div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stages.map((stage) => (
        <div
          key={stage.id}
          ref={(el) => { if (el) columnsRef.current.set(stage.id, el) }}
          className={`space-y-3 rounded-2xl p-1 transition-all duration-200 ${
            dragOverStage === stage.id
              ? "bg-primary/10 ring-2 ring-primary/30 scale-[1.02]"
              : ""
          }`}
          onDragOver={(e) => onDragOver(e, stage.id)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, stage.id)}
        >
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <h3 className="font-semibold text-sm">{stage.label}</h3>
              </div>
              <Badge variant="secondary" className="rounded-full text-xs">
                {grouped[stage.id]?.length || 0}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 min-h-[60px]">
            {grouped[stage.id]?.map((lead) => (
              <Card
                key={lead.id}
                draggable
                onDragStart={(e) => onDragStart(e, lead.id)}
                onDragEnd={onDragEnd}
                onTouchStart={(e) => onTouchStart(e, lead.id)}
                className={`glass-card p-3 rounded-xl space-y-2 transition-all duration-300 group cursor-grab active:cursor-grabbing select-none ${
                  draggingId === lead.id ? "opacity-40 scale-95" : "hover:scale-[1.02]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 hidden sm:block" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{lead.nombre}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground truncate">{lead.empresa}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><MoreVertical className="h-3.5 w-3.5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="">
                      {stages.filter(s => s.id !== lead.estado).map(s => (
                        <DropdownMenuItem key={s.id} onClick={() => onCambiarEstado(lead.id, s.id as Lead["estado"])}>
                          Mover a {s.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem className="text-destructive" onClick={() => onEliminar(lead.id)}>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  {lead.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /><span className="truncate">{lead.email}</span></div>}
                  {lead.responsable && <div className="flex items-center gap-1"><User className="h-3 w-3" /><span className="truncate">{lead.responsable}</span></div>}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  {lead.valorEstimado > 0 && (
                    <div className="flex items-center gap-1 text-xs font-medium satin-green">
                      <DollarSign className="h-3 w-3" />{lead.valorEstimado.toLocaleString()}
                    </div>
                  )}
                  {lead.probabilidad > 0 && (
                    <Badge variant="outline" className="rounded-full text-[10px]">{lead.probabilidad}%</Badge>
                  )}
                </div>
              </Card>
            ))}

            {/* Empty state drop target */}
            {grouped[stage.id]?.length === 0 && (
              <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
                dragOverStage === stage.id
                  ? "border-primary/50 bg-primary/5"
                  : "border-white/10"
              }`}>
                <p className="text-xs text-muted-foreground/50">Arrastra aquí</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

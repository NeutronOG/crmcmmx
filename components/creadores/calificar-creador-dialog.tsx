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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { upsertCalificacion, getCalificaciones } from "@/lib/store"
import type { Creador } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

interface CalificarCreadorDialogProps {
  creador: Creador | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const categorias = [
  { key: "calidadVisual", label: "Calidad Visual" },
  { key: "puntualidad", label: "Puntualidad" },
  { key: "creatividad", label: "Creatividad" },
  { key: "comunicacion", label: "Comunicación" },
  { key: "seguimientoBrief", label: "Seguimiento Brief" },
] as const

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className="transition-transform hover:scale-110"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hover || value)
                ? "text-amber-400 fill-amber-400"
                : "text-white/20"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export function CalificarCreadorDialog({ creador, open, onOpenChange, onSaved }: CalificarCreadorDialogProps) {
  const { usuario } = useAuth()
  const [ratings, setRatings] = useState({
    calidadVisual: 3,
    puntualidad: 3,
    creatividad: 3,
    comunicacion: 3,
    seguimientoBrief: 3,
  })
  const [comentario, setComentario] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && creador && usuario) {
      // Load existing rating by this evaluator
      getCalificaciones(creador.id).then(cals => {
        const existing = cals.find(c => c.evaluador === usuario.nombre)
        if (existing) {
          setRatings({
            calidadVisual: existing.calidadVisual,
            puntualidad: existing.puntualidad,
            creatividad: existing.creatividad,
            comunicacion: existing.comunicacion,
            seguimientoBrief: existing.seguimientoBrief,
          })
          setComentario(existing.comentario)
        } else {
          setRatings({ calidadVisual: 3, puntualidad: 3, creatividad: 3, comunicacion: 3, seguimientoBrief: 3 })
          setComentario("")
        }
      })
    }
  }, [open, creador, usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!creador || !usuario) return
    setSaving(true)
    try {
      await upsertCalificacion({
        creadorId: creador.id,
        evaluador: usuario.nombre,
        ...ratings,
        comentario: comentario.trim(),
      })
      toast.success(`Calificación guardada para ${creador.nombre}`)
      onOpenChange(false)
      onSaved()
    } catch {
      toast.error("Error al guardar calificación")
    } finally {
      setSaving(false)
    }
  }

  if (!creador) return null

  const promedio = Object.values(ratings).reduce((s, v) => s + v, 0) / 5

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Evaluar a {creador.nombre}</DialogTitle>
          <DialogDescription>
            Tu calificación personal como {usuario?.nombre || "evaluador"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {categorias.map(cat => (
            <div key={cat.key} className="flex items-center justify-between">
              <Label className="text-sm">{cat.label}</Label>
              <StarRating
                value={ratings[cat.key]}
                onChange={(v) => setRatings(prev => ({ ...prev, [cat.key]: v }))}
              />
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-sm font-medium">Promedio</span>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-lg">{promedio.toFixed(1)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Comentario (opcional)</Label>
            <Textarea
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              placeholder="Observaciones sobre el creador..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Calificación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

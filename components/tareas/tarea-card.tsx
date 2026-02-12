"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar,
  MoreVertical,
  AlertTriangle,
  Paperclip,
  Building2,
  Briefcase,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Tarea } from "@/lib/store"

interface TareaCardProps {
  tarea: Tarea
  onVer: (tarea: Tarea) => void
  onEditar: (tarea: Tarea) => void
  onEliminar: (id: string) => void
  onCambiarEstado: (id: string, estado: Tarea["estado"]) => void
}

export function TareaCard({ tarea, onVer, onEditar, onEliminar, onCambiarEstado }: TareaCardProps) {
  const isOverdue = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date() && tarea.estado !== "Completada"
  const daysLeft = tarea.fechaVencimiento
    ? Math.ceil((new Date(tarea.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "satin-red border satin-red-border"
      case "Media":
        return "satin-yellow border satin-yellow-border"
      case "Baja":
        return "satin-green border satin-green-border"
      default:
        return "text-white/50"
    }
  }

  const estados: Tarea["estado"][] = ["Pendiente", "En Progreso", "En Revisión", "Completada"]

  return (
    <Card
      className="glass-card p-4 rounded-xl space-y-3 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
      onClick={() => onVer(tarea)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={`rounded-full text-xs ${getPrioridadColor(tarea.prioridad)}`}>
              {tarea.prioridad}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="rounded-full text-xs gap-1">
                <AlertTriangle className="h-3 w-3" />
                Atrasada
              </Badge>
            )}
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {tarea.titulo}
          </h4>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onVer(tarea)}>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditar(tarea)}>Editar tarea</DropdownMenuItem>
            {estados
              .filter((e) => e !== tarea.estado)
              .map((estado) => (
                <DropdownMenuItem key={estado} onClick={() => onCambiarEstado(tarea.id, estado)}>
                  Mover a {estado}
                </DropdownMenuItem>
              ))}
            <DropdownMenuItem className="text-destructive" onClick={() => onEliminar(tarea.id)}>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {tarea.descripcion && (
        <p className="text-sm text-muted-foreground line-clamp-2">{tarea.descripcion}</p>
      )}

      <div className="space-y-1.5">
        {tarea.cliente && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate">{tarea.cliente}</span>
          </div>
        )}
        {tarea.proyecto && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate">{tarea.proyecto}</span>
          </div>
        )}
        {tarea.fechaVencimiento && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground text-xs">
              {new Date(tarea.fechaVencimiento).toLocaleDateString("es-ES")}
              {!isOverdue && daysLeft !== null && daysLeft > 0 && (
                <span className="ml-1 satin-blue">({daysLeft} días)</span>
              )}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <Avatar className="size-6 border-2 border-background">
            <AvatarFallback className="text-xs bg-primary/20">
              {tarea.asignado
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">{tarea.asignado}</span>
        </div>

        <div className="flex items-center gap-2">
          {tarea.evidencias.length > 0 && (
            <Badge variant="secondary" className="rounded-full text-xs gap-1">
              <Paperclip className="h-3 w-3" />
              {tarea.evidencias.length}
            </Badge>
          )}
          {tarea.etiquetas.slice(0, 1).map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}

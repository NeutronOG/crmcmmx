"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar,
  MoreVertical,
  AlertTriangle,
  Paperclip,
  Building2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Tarea } from "@/lib/store"

interface TareasListProps {
  tareas: Tarea[]
  onVer: (tarea: Tarea) => void
  onEditar: (tarea: Tarea) => void
  onEliminar: (id: string) => void
  onCambiarEstado: (id: string, estado: Tarea["estado"]) => void
}

export function TareasList({ tareas, onVer, onEditar, onEliminar, onCambiarEstado }: TareasListProps) {
  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta": return "satin-red border satin-red-border"
      case "Media": return "satin-yellow border satin-yellow-border"
      case "Baja": return "satin-green border satin-green-border"
      default: return ""
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "bg-white/5 text-white/50 border-white/10"
      case "En Progreso": return "satin-yellow-bg satin-yellow border satin-yellow-border"
      case "En Revisión": return "satin-yellow-bg satin-yellow border satin-yellow-border"
      case "Completada": return "satin-green-bg satin-green border satin-green-border"
      default: return ""
    }
  }

  const estados: Tarea["estado"][] = ["Pendiente", "En Progreso", "En Revisión", "Completada"]

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Tarea</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">Cliente</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">Asignado</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4">Estado</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden sm:table-cell">Prioridad</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden lg:table-cell">Vencimiento</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-4 hidden md:table-cell">Evidencias</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-4"></th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((tarea) => {
              const isOverdue = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date() && tarea.estado !== "Completada"
              return (
                <tr
                  key={tarea.id}
                  className="border-b border-border/20 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => onVer(tarea)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {isOverdue && <AlertTriangle className="h-4 w-4 satin-red shrink-0" />}
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate max-w-[250px]">{tarea.titulo}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[250px]">{tarea.proyecto}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[120px]">{tarea.cliente || "—"}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-xs bg-primary/20">
                          {tarea.asignado.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate max-w-[100px]">{tarea.asignado}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={`rounded-full text-xs ${getEstadoColor(tarea.estado)}`}>
                      {tarea.estado}
                    </Badge>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge variant="outline" className={`rounded-full text-xs ${getPrioridadColor(tarea.prioridad)}`}>
                      {tarea.prioridad}
                    </Badge>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span className={isOverdue ? "satin-red" : ""}>
                        {tarea.fechaVencimiento
                          ? new Date(tarea.fechaVencimiento).toLocaleDateString("es-ES")
                          : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {tarea.evidencias.length > 0 ? (
                      <Badge variant="secondary" className="rounded-full text-xs gap-1">
                        <Paperclip className="h-3 w-3" />
                        {tarea.evidencias.length}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => onVer(tarea)}>Ver detalles</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditar(tarea)}>Editar</DropdownMenuItem>
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
                  </td>
                </tr>
              )
            })}
            {tareas.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No hay tareas que mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

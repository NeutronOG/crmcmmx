"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface TareasFiltersProps {
  busqueda: string
  onBusquedaChange: (value: string) => void
  filtroPrioridad: string
  onFiltroPrioridadChange: (value: string) => void
  filtroAsignado: string
  onFiltroAsignadoChange: (value: string) => void
  asignados: string[]
}

export function TareasFilters({
  busqueda,
  onBusquedaChange,
  filtroPrioridad,
  onFiltroPrioridadChange,
  filtroAsignado,
  onFiltroAsignadoChange,
  asignados,
}: TareasFiltersProps) {
  const hasFilters = busqueda || filtroPrioridad !== "todas" || filtroAsignado !== "todos"

  const clearFilters = () => {
    onBusquedaChange("")
    onFiltroPrioridadChange("todas")
    onFiltroAsignadoChange("todos")
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tareas..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="pl-9 bg-transparent"
        />
      </div>

      <Select value={filtroPrioridad} onValueChange={onFiltroPrioridadChange}>
        <SelectTrigger className="w-[140px] bg-transparent">
          <SelectValue placeholder="Prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="Alta">Alta</SelectItem>
          <SelectItem value="Media">Media</SelectItem>
          <SelectItem value="Baja">Baja</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filtroAsignado} onValueChange={onFiltroAsignadoChange}>
        <SelectTrigger className="w-[180px] bg-transparent">
          <SelectValue placeholder="Asignado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {asignados.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
          <X className="h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  )
}

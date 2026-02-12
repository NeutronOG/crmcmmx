"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface NuevoNegocioFiltersProps {
  busqueda: string
  onBusquedaChange: (value: string) => void
  filtroEstado: string
  onFiltroEstadoChange: (value: string) => void
}

export function NuevoNegocioFilters({
  busqueda,
  onBusquedaChange,
  filtroEstado,
  onFiltroEstadoChange,
}: NuevoNegocioFiltersProps) {
  const hasFilters = busqueda || filtroEstado !== "all"

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-1 gap-4 w-full sm:w-auto flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar oportunidades..."
            className="pl-10 glass border-white/10"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
          />
        </div>
        <Select value={filtroEstado} onValueChange={onFiltroEstadoChange}>
          <SelectTrigger className="w-[180px] glass border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Nuevo">Nuevo</SelectItem>
            <SelectItem value="Contactado">Contactado</SelectItem>
            <SelectItem value="Calificado">Calificado</SelectItem>
            <SelectItem value="Propuesta">Propuesta</SelectItem>
            <SelectItem value="Negociación">Negociación</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => { onBusquedaChange(""); onFiltroEstadoChange("all") }}>
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}

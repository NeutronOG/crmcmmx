"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Clock, CheckCircle2, AlertTriangle, Users, LayoutGrid } from "lucide-react"

export type ProjectQuickFilter = "todos" | "en_progreso" | "atrasados" | "completados" | "mis_proyectos"

interface ProjectsFiltersProps {
  busqueda: string
  onBusquedaChange: (value: string) => void
  quickFilter: ProjectQuickFilter
  onQuickFilterChange: (value: ProjectQuickFilter) => void
}

export function ProjectsFilters({
  busqueda,
  onBusquedaChange,
  quickFilter,
  onQuickFilterChange,
}: ProjectsFiltersProps) {
  const hasFilters = busqueda || quickFilter !== "todos"

  const filters: { id: ProjectQuickFilter; label: string; icon: React.ReactNode }[] = [
    { id: "todos", label: "Todos", icon: <LayoutGrid className="h-4 w-4 text-muted-foreground" /> },
    { id: "en_progreso", label: "En Progreso", icon: <Clock className="h-4 w-4 satin-blue" /> },
    { id: "atrasados", label: "Atrasados", icon: <AlertTriangle className="h-4 w-4 satin-yellow" /> },
    { id: "completados", label: "Completados", icon: <CheckCircle2 className="h-4 w-4 satin-green" /> },
    { id: "mis_proyectos", label: "Mis Proyectos", icon: <Users className="h-4 w-4 satin-blue" /> },
  ]

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyectos por nombre, cliente, tipo..."
              className="pl-10 bg-background/50 border-border/50"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
            />
          </div>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => { onBusquedaChange(""); onQuickFilterChange("todos") }}>
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {filters.map((f) => (
          <Button
            key={f.id}
            variant={quickFilter === f.id ? "default" : "ghost"}
            size="sm"
            className={`gap-2 ${quickFilter === f.id ? "liquid-gradient border-white/20" : ""}`}
            onClick={() => onQuickFilterChange(f.id)}
          >
            {f.icon}
            {f.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Star, Clock, TrendingUp, LayoutGrid } from "lucide-react"

export type LeadQuickFilter = "todos" | "alto_score" | "nuevos_24h" | "alta_prioridad"

interface LeadsFiltersProps {
  busqueda: string
  onBusquedaChange: (value: string) => void
  quickFilter: LeadQuickFilter
  onQuickFilterChange: (value: LeadQuickFilter) => void
}

export function LeadsFilters({
  busqueda,
  onBusquedaChange,
  quickFilter,
  onQuickFilterChange,
}: LeadsFiltersProps) {
  const hasFilters = busqueda || quickFilter !== "todos"

  const filters: { id: LeadQuickFilter; label: string; icon: React.ReactNode }[] = [
    { id: "todos", label: "Todos", icon: <LayoutGrid className="h-4 w-4 text-muted-foreground" /> },
    { id: "alto_score", label: "Alto Score (90+)", icon: <Star className="h-4 w-4 satin-yellow" /> },
    { id: "nuevos_24h", label: "Nuevos (24h)", icon: <Clock className="h-4 w-4 satin-blue" /> },
    { id: "alta_prioridad", label: "Alta Prioridad", icon: <TrendingUp className="h-4 w-4 satin-green" /> },
  ]

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar leads por nombre, email, empresa..."
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

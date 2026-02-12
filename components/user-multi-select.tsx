"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, Search, Users, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getUsuarios } from "@/lib/auth"
import type { Usuario } from "@/lib/auth"

interface UserMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
  single?: boolean
  excludeSelf?: string
}

export function UserMultiSelect({
  value,
  onChange,
  label,
  placeholder = "Buscar personal...",
  single = false,
  excludeSelf,
}: UserMultiSelectProps) {
  const [users, setUsers] = useState<Usuario[]>([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getUsuarios().then(setUsers)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // Small delay to avoid race conditions with click events inside the dropdown
        requestAnimationFrame(() => setOpen(false))
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = users.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) &&
    (excludeSelf ? u.nombre !== excludeSelf : true)
  )

  const toggle = useCallback((name: string) => {
    if (single) {
      onChange(value.includes(name) ? [] : [name])
      setOpen(false)
    } else {
      onChange(
        value.includes(name)
          ? value.filter(v => v !== name)
          : [...value, name]
      )
      // Keep dropdown open for multi-select
    }
  }, [single, value, onChange])

  const remove = (name: string) => {
    onChange(value.filter(v => v !== name))
  }

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div ref={ref} className="relative">
      {label && <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>}

      {/* Selected chips + trigger */}
      <div
        className="min-h-[36px] flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-transparent cursor-pointer hover:border-white/20 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {value.length === 0 && (
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Users className="size-3.5" />
            {single ? "Seleccionar persona" : "Seleccionar equipo"}
          </span>
        )}
        {value.map(name => (
          <span
            key={name}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
          >
            <span className="size-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold shrink-0">
              {getInitials(name)}
            </span>
            {name}
            <button
              onClick={(e) => { e.stopPropagation(); remove(name) }}
              className="hover:text-destructive transition-colors"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border border-border/60 rounded-xl shadow-xl shadow-black/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-border/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-white/10 text-xs h-8 pl-8"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">Sin resultados</p>
            )}
            {filtered.map(u => {
              const selected = value.includes(u.nombre)
              return (
                <button
                  key={u.id}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 text-left transition-all hover:bg-muted/50 ${
                    selected ? "bg-primary/5" : ""
                  }`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(u.nombre) }}
                  onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }}
                >
                  <span className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {selected ? <Check className="size-3" /> : getInitials(u.nombre)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${selected ? "text-primary" : ""}`}>{u.nombre}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{u.rol.replace(/_/g, " ")}</p>
                  </div>
                  {selected && <div className="size-1.5 rounded-full bg-primary shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

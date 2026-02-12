"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Download, Settings, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { NuevoProyectoDialog } from "./nuevo-proyecto-dialog"

interface ProjectsHeaderProps {
  onCreated?: () => void
  onExport?: () => void
}

export function ProjectsHeader({ onCreated, onExport }: ProjectsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="border-b border-border/40 backdrop-blur-xl bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className="text-sm font-medium text-foreground transition-colors relative after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
              >
                Proyectos
              </Link>
              <Link
                href="/leads"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Leads
              </Link>
              <Link
                href="/clients"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Clientes
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-background/50">
                <Button variant="ghost" size="sm" className="h-8">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onExport}>
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </div>
          </div>
        </div>
      </div>

      <NuevoProyectoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={() => onCreated?.()}
      />
    </>
  )
}

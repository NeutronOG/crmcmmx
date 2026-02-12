"use client"

import { Button } from "@/components/ui/button"
import { Download, Calendar, Filter, Share2 } from "lucide-react"
import Link from "next/link"

interface ReportsHeaderProps {
  onExport?: () => void
}

export function ReportsHeader({ onExport }: ReportsHeaderProps) {
  return (
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
              href="/reports"
              className="text-sm font-medium text-foreground transition-colors relative after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
            >
              Reportes
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Proyectos
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              Este Mes
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
            <Button size="sm" className="gap-2" onClick={onExport}>
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

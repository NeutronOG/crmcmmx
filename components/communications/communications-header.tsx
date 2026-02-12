"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download, Settings } from "lucide-react"
import Link from "next/link"

export function CommunicationsHeader() {
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
              href="/communications"
              className="text-sm font-medium text-foreground transition-colors relative after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-0.5 after:bg-primary"
            >
              Comunicaciones
            </Link>
            <Link
              href="/leads"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Leads
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Reportes
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Secuencia
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

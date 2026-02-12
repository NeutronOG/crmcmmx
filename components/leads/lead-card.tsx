"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Mail, DollarSign, Star, User, Calendar, MessageSquare, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Lead = {
  id: string
  name: string
  email: string
  company: string
  source: string
  score: number
  value: number
  assignedTo: string
  createdAt: string
  lastContact: string
  notes: string
}

export function LeadCard({ lead }: { lead: Lead }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "satin-green"
    if (score >= 70) return "satin-yellow"
    return "satin-yellow"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 70) return "secondary"
    return "outline"
  }

  return (
    <Card className="glass-card p-4 rounded-xl space-y-4 hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{lead.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{lead.company}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Asignar a...</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{lead.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Asignado: {lead.assignedTo}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">
            Último contacto: {new Date(lead.lastContact).toLocaleDateString("es-ES")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <Star className={`h-4 w-4 ${getScoreColor(lead.score)}`} fill="currentColor" />
          <Badge variant={getScoreBadgeVariant(lead.score)} className="rounded-full">
            Score: {lead.score}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold satin-green">
          <DollarSign className="h-4 w-4" />
          {lead.value.toLocaleString("es-MX")}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Badge variant="outline" className="rounded-full text-xs">
          {lead.source}
        </Badge>
      </div>

      {lead.notes && (
        <div className="pt-2 border-t border-border/40">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3 w-3 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground line-clamp-2">{lead.notes}</p>
          </div>
        </div>
      )}
    </Card>
  )
}

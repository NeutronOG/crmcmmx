"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Building2, Calendar, DollarSign, Users, CheckCircle2, MoreVertical, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Project = {
  id: string
  name: string
  client: string
  type: string
  status: string
  progress: number
  startDate: string
  deadline: string
  budget: number
  team: string[]
  tasks: { total: number; completed: number }
  priority: "high" | "medium" | "low"
  tags: string[]
}

export function ProjectCard({ project }: { project: Project }) {
  const isOverdue = new Date(project.deadline) < new Date() && project.progress < 100
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "satin-red"
      case "medium":
        return "satin-yellow"
      case "low":
        return "satin-green"
      default:
        return "text-white/40"
    }
  }

  return (
    <Card className="glass-card p-4 rounded-xl space-y-4 hover:scale-[1.02] transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={`rounded-full text-xs ${getPriorityColor(project.priority)}`}>
              {project.priority === "high" ? "Alta" : project.priority === "medium" ? "Media" : "Baja"}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="rounded-full text-xs gap-1">
                <AlertTriangle className="h-3 w-3" />
                Atrasado
              </Badge>
            )}
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{project.client}</p>
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
            <DropdownMenuItem>Editar proyecto</DropdownMenuItem>
            <DropdownMenuItem>Ver tareas</DropdownMenuItem>
            <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Archivar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-semibold">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">
            {project.tasks.completed} de {project.tasks.total} tareas completadas
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">
            Entrega: {new Date(project.deadline).toLocaleDateString("es-ES")}
            {!isOverdue && daysLeft > 0 && <span className="ml-1 satin-blue">({daysLeft} días)</span>}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">${project.budget.toLocaleString("es-MX")}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-muted-foreground" />
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="size-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-primary/20">
                  {member
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.team.length > 3 && (
              <Avatar className="size-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-muted">+{project.team.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        <Badge variant="secondary" className="rounded-full text-xs">
          {project.type}
        </Badge>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {project.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-full text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, FileText, Users, CheckCircle2, Lightbulb, Briefcase, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const iconMap: Record<string, any> = {
  idea_room: Lightbulb,
  tarea: CheckCircle2,
  proyecto: Briefcase,
  cliente: Users,
  mensaje: MessageSquare,
  info: Bell,
}

const gradientMap: Record<string, string> = {
  idea_room: "from-[oklch(0.78_0.10_85)] to-[oklch(0.78_0.10_85_/_0.3)]",
  tarea: "from-[oklch(0.72_0.10_155)] to-[oklch(0.72_0.10_155_/_0.3)]",
  proyecto: "from-[oklch(0.68_0.12_300)] to-[oklch(0.68_0.12_300_/_0.3)]",
  cliente: "from-[oklch(0.68_0.10_245)] to-[oklch(0.68_0.10_245_/_0.3)]",
  mensaje: "from-[oklch(0.72_0.08_200)] to-[oklch(0.72_0.08_200_/_0.3)]",
  info: "from-[oklch(0.70_0.10_350)] to-[oklch(0.70_0.10_350_/_0.3)]",
}

export function RecentActivity() {
  const [activities, setActivities] = useState<{ type: string; icon: any; user: string; action: string; target: string; time: string; gradient: string }[]>([])

  useEffect(() => {
    supabase
      .from("notificaciones")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (!data) return
        const now = Date.now()
        setActivities(data.map(n => {
          const diff = now - new Date(n.created_at).getTime()
          const mins = Math.floor(diff / 60000)
          let time = "Ahora"
          if (mins >= 1440) time = `Hace ${Math.floor(mins / 1440)}d`
          else if (mins >= 60) time = `Hace ${Math.floor(mins / 60)}h`
          else if (mins >= 1) time = `Hace ${mins} min`
          const Icon = iconMap[n.tipo] || Bell
          return {
            type: n.tipo,
            icon: Icon,
            user: n.usuario_destino,
            action: n.titulo,
            target: n.mensaje || "",
            time,
            gradient: gradientMap[n.tipo] || "from-primary/80 to-primary/40",
          }
        }))
      })
  }, [])

  return (
    <Card className="glass-intense border-white/10 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Actividad Reciente</CardTitle>
        <CardDescription className="text-muted-foreground/80">Últimas acciones del equipo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl glass-subtle hover:glass-intense transition-all duration-300 group border border-white/5 hover:border-white/20"
              >
                <div
                  className={`size-12 rounded-2xl bg-gradient-to-br ${activity.gradient} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/10`}
                >
                  <Icon className="size-6 text-white dark:text-white drop-shadow-lg" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors duration-300">
                      {activity.user}
                    </span>{" "}
                    <span className="text-muted-foreground/80">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/60">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

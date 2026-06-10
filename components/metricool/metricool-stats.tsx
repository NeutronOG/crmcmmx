"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Loader2 } from "lucide-react"

interface MetricoolStat {
  label: string
  value: string | number
  subvalue?: string
  trend?: "up" | "down" | "neutral"
  change?: string
}

interface MetricoolStatsProps {
  data: Record<string, unknown> | null
  loading: boolean
  error: string | null
}

function extractStats(data: Record<string, unknown> | null): MetricoolStat[] {
  if (!data) return []

  // Intentar extraer stats genéricas de la respuesta de Metricool
  const stats: MetricoolStat[] = []

  // Followers / Seguidores
  const followers = data.followers ?? data.totalFollowers ?? (data as Record<string, unknown>)?.summary?.followers
  if (followers !== undefined) {
    stats.push({ label: "Seguidores Totales", value: Number(followers).toLocaleString(), trend: "up" })
  }

  // Reach / Alcance
  const reach = data.reach ?? data.totalReach ?? (data as Record<string, unknown>)?.summary?.reach
  if (reach !== undefined) {
    stats.push({ label: "Alcance Total", value: Number(reach).toLocaleString(), trend: "up" })
  }

  // Impressions
  const impressions = data.impressions ?? data.totalImpressions ?? (data as Record<string, unknown>)?.summary?.impressions
  if (impressions !== undefined) {
    stats.push({ label: "Impresiones", value: Number(impressions).toLocaleString() })
  }

  // Engagement
  const engagement = data.engagement ?? data.engagementRate ?? (data as Record<string, unknown>)?.summary?.engagement
  if (engagement !== undefined) {
    const val = typeof engagement === "number" && engagement < 1
      ? `${(engagement * 100).toFixed(2)}%`
      : String(engagement)
    stats.push({ label: "Engagement", value: val, trend: Number(engagement) > 0.02 ? "up" : "neutral" })
  }

  // Posts
  const posts = data.posts ?? data.totalPosts ?? (data as Record<string, unknown>)?.summary?.posts
  if (posts !== undefined) {
    stats.push({ label: "Publicaciones", value: Number(posts).toLocaleString() })
  }

  // Clicks
  const clicks = data.clicks ?? data.totalClicks ?? (data as Record<string, unknown>)?.summary?.clicks
  if (clicks !== undefined) {
    stats.push({ label: "Clics en Enlace", value: Number(clicks).toLocaleString() })
  }

  return stats
}

function TrendIcon({ trend }: { trend?: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-500" />
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />
  return <Minus className="w-4 h-4 text-muted-foreground" />
}

export function MetricoolStats({ data, loading, error }: MetricoolStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/40 p-5 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded mb-3" />
            <div className="h-8 w-16 bg-muted rounded" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Loader2 className="w-5 h-5 text-muted-foreground" />
          <p className="text-muted-foreground text-sm font-medium">No se pudo cargar Metricool</p>
        </div>
        <p className="text-xs text-muted-foreground/70 max-w-md mx-auto">
          Verifica que tu API key sea válida y que el endpoint de Metricool esté disponible.
          <span className="block mt-1 font-mono bg-muted/50 rounded px-2 py-1">{error}</span>
        </p>
      </Card>
    )
  }

  const stats = extractStats(data)

  if (!stats.length) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-8 text-center">
        <p className="text-muted-foreground text-sm">
          Sin datos disponibles para el rango seleccionado.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-card/60 backdrop-blur-sm border-border/40 p-5 space-y-2 hover:border-border/60 transition-colors"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            <TrendIcon trend={stat.trend} />
          </div>
          <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
          {stat.subvalue && (
            <p className="text-xs text-muted-foreground">{stat.subvalue}</p>
          )}
        </Card>
      ))}
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, Eye, TrendingUp, BarChart2 } from "lucide-react"

interface NetworkData {
  followers?: number
  followersGained?: number
  reach?: number
  impressions?: number
  engagement?: number
  engagementRate?: number
  likes?: number
  comments?: number
  shares?: number
  posts?: number
  views?: number
  [key: string]: unknown
}

interface MetricoolNetworksProps {
  instagram: Record<string, unknown> | null
  facebook: Record<string, unknown> | null
  tiktok: Record<string, unknown> | null
  linkedin: Record<string, unknown> | null
  loading: boolean
}

function parseNum(v: unknown): number {
  if (v === undefined || v === null) return 0
  return Number(v) || 0
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function fmtPct(n: number): string {
  if (n < 1) return `${(n * 100).toFixed(2)}%`
  return `${n.toFixed(2)}%`
}

function NetworkCard({
  name,
  color,
  icon,
  data,
}: {
  name: string
  color: string
  icon: React.ReactNode
  data: Record<string, unknown> | null
}) {
  if (!data) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-6 space-y-4 opacity-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-semibold">{name}</span>
          </div>
          <Badge variant="outline" className="text-xs text-muted-foreground">Sin datos</Badge>
        </div>
        <p className="text-xs text-muted-foreground">No hay datos disponibles para esta red.</p>
      </Card>
    )
  }

  const d = data as NetworkData
  const followers = parseNum(d.followers ?? d.followersGained)
  const reach = parseNum(d.reach)
  const impressions = parseNum(d.impressions)
  const engagement = parseNum(d.engagement ?? d.engagementRate)
  const likes = parseNum(d.likes)
  const comments = parseNum(d.comments)
  const posts = parseNum(d.posts)
  const views = parseNum(d.views)

  const metrics = [
    { label: "Seguidores", value: fmt(followers), icon: <Users className="w-3.5 h-3.5" /> },
    { label: "Alcance", value: fmt(reach), icon: <Eye className="w-3.5 h-3.5" /> },
    { label: "Impresiones", value: fmt(impressions), icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { label: "Engagement", value: fmtPct(engagement), icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { label: "Likes", value: fmt(likes), icon: <Heart className="w-3.5 h-3.5" /> },
    { label: "Posts", value: fmt(posts), icon: <BarChart2 className="w-3.5 h-3.5" /> },
    ...(views > 0 ? [{ label: "Views", value: fmt(views), icon: <Eye className="w-3.5 h-3.5" /> }] : []),
    ...(comments > 0 ? [{ label: "Comentarios", value: fmt(comments), icon: <Heart className="w-3.5 h-3.5" /> }] : []),
  ].filter(m => m.value !== "0")

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-6 space-y-4 hover:border-border/60 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{name}</span>
        </div>
        <Badge variant="outline" className={`text-xs ${color}`}>Conectado</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {metrics.slice(0, 6).map(m => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {m.icon}
              {m.label}
            </div>
            <p className="text-xl font-bold">{m.value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function MetricoolNetworks({ instagram, facebook, tiktok, linkedin, loading }: MetricoolNetworksProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/40 p-6 space-y-4 animate-pulse">
            <div className="h-5 w-28 bg-muted rounded" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-7 w-12 bg-muted rounded" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <NetworkCard
        name="Instagram"
        color="text-pink-400 border-pink-500/30 bg-pink-500/10"
        icon={<div className="w-5 h-5 rounded bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center"><span className="text-white text-xs font-bold">IG</span></div>}
        data={instagram}
      />
      <NetworkCard
        name="Facebook"
        color="text-blue-400 border-blue-500/30 bg-blue-500/10"
        icon={<div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center"><span className="text-white text-xs font-bold">f</span></div>}
        data={facebook}
      />
      <NetworkCard
        name="TikTok"
        color="text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10"
        icon={<div className="w-5 h-5 rounded bg-black flex items-center justify-center"><span className="text-white text-xs font-bold">TK</span></div>}
        data={tiktok}
      />
      <NetworkCard
        name="LinkedIn"
        color="text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
        icon={<div className="w-5 h-5 rounded bg-indigo-700 flex items-center justify-center"><span className="text-white text-xs font-bold">in</span></div>}
        data={linkedin}
      />
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Eye, MousePointer, DollarSign } from "lucide-react"

interface Campaign {
  id?: string | number
  name?: string
  title?: string
  status?: string
  network?: string
  platform?: string
  impressions?: number
  clicks?: number
  reach?: number
  spend?: number
  budget?: number
  ctr?: number
  engagement?: number
  startDate?: string
  endDate?: string
  [key: string]: unknown
}

interface MetricoolCampaignsProps {
  data: Record<string, unknown> | null
  loading: boolean
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  paused: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  completed: "bg-muted/50 text-muted-foreground border-border/40",
  draft: "bg-blue-500/15 text-blue-400 border-blue-500/30",
}

const statusLabels: Record<string, string> = {
  active: "Activa",
  paused: "Pausada",
  completed: "Completada",
  draft: "Borrador",
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const status = (campaign.status ?? "").toLowerCase()
  const name = String(campaign.name ?? campaign.title ?? "Sin nombre")
  const impressions = Number(campaign.impressions ?? 0)
  const clicks = Number(campaign.clicks ?? 0)
  const reach = Number(campaign.reach ?? 0)
  const spend = Number(campaign.spend ?? 0)
  const ctr = Number(campaign.ctr ?? (impressions > 0 ? (clicks / impressions) * 100 : 0))

  return (
    <tr className="border-b border-border/30 hover:bg-muted/20 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium truncate max-w-[200px]">{name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge
          variant="outline"
          className={`text-xs capitalize ${statusColors[status] ?? "bg-muted/50 text-muted-foreground border-border/40"}`}
        >
          {statusLabels[status] ?? campaign.status ?? "—"}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-right">{fmt(impressions)}</td>
      <td className="py-3 px-4 text-sm text-right">{fmt(clicks)}</td>
      <td className="py-3 px-4 text-sm text-right">{fmt(reach)}</td>
      <td className="py-3 px-4 text-sm text-right">
        {ctr > 0 ? `${ctr.toFixed(2)}%` : "—"}
      </td>
      <td className="py-3 px-4 text-sm text-right">
        {spend > 0 ? `$${spend.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` : "—"}
      </td>
    </tr>
  )
}

export function MetricoolCampaigns({ data, loading }: MetricoolCampaignsProps) {
  if (loading) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-6 animate-pulse space-y-4">
        <div className="h-5 w-32 bg-muted rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded" />
        ))}
      </Card>
    )
  }

  const campaigns: Campaign[] = Array.isArray(data)
    ? (data as Campaign[])
    : Array.isArray((data as Record<string, unknown>)?.campaigns)
    ? ((data as Record<string, unknown>).campaigns as Campaign[])
    : Array.isArray((data as Record<string, unknown>)?.data)
    ? ((data as Record<string, unknown>).data as Campaign[])
    : []

  if (!campaigns.length) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <Target className="w-8 h-8 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">
            No hay campañas disponibles para este período.
          </p>
        </div>
      </Card>
    )
  }

  const totalImpressions = campaigns.reduce((s, c) => s + Number(c.impressions ?? 0), 0)
  const totalClicks = campaigns.reduce((s, c) => s + Number(c.clicks ?? 0), 0)
  const totalSpend = campaigns.reduce((s, c) => s + Number(c.spend ?? 0), 0)
  const activeCampaigns = campaigns.filter(c => (c.status ?? "").toLowerCase() === "active").length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Target className="w-3 h-3" /> Campañas activas</p>
          <p className="text-2xl font-bold">{activeCampaigns}</p>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" /> Impresiones totales</p>
          <p className="text-2xl font-bold">{fmt(totalImpressions)}</p>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><MousePointer className="w-3 h-3" /> Clics totales</p>
          <p className="text-2xl font-bold">{fmt(totalClicks)}</p>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3" /> Inversión total</p>
          <p className="text-2xl font-bold">{totalSpend > 0 ? `$${fmt(totalSpend)}` : "—"}</p>
        </Card>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/40 overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            Todas las campañas
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 text-xs text-muted-foreground">
                <th className="text-left py-2.5 px-4 font-medium">Campaña</th>
                <th className="text-left py-2.5 px-4 font-medium">Estado</th>
                <th className="text-right py-2.5 px-4 font-medium">Impresiones</th>
                <th className="text-right py-2.5 px-4 font-medium">Clics</th>
                <th className="text-right py-2.5 px-4 font-medium">Alcance</th>
                <th className="text-right py-2.5 px-4 font-medium">CTR</th>
                <th className="text-right py-2.5 px-4 font-medium">Gasto</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, i) => (
                <CampaignRow key={String(c.id ?? i)} campaign={c} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

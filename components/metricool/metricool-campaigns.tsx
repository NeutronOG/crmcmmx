"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Eye, MousePointer, DollarSign, Zap, BarChart2, ArrowUpRight } from "lucide-react"

interface Campaign {
  id?: string | number
  name?: string
  status?: string
  provider?: string
  network?: string
  impressions?: number
  clicks?: number
  reach?: number
  spend?: number
  budget?: number
  budgetAmount?: number
  dailyBudget?: number
  cpc?: number
  cpm?: number
  ctr?: number
  conversions?: number
  startDate?: string
  endDate?: string
  currency?: string
  [key: string]: unknown
}

interface MetricoolCampaignsProps {
  data: Record<string, unknown> | null
  loading: boolean
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString("es-MX")
}

function fmtMoney(n: number, currency = "USD"): string {
  if (n === 0) return "—"
  return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 2 }).format(n)
}

function pct(n: number): string {
  return `${n.toFixed(2)}%`
}

const statusColors: Record<string, string> = {
  active:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  enabled:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  paused:    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  completed: "bg-muted/50 text-muted-foreground border-border/40",
  ended:     "bg-muted/50 text-muted-foreground border-border/40",
  draft:     "bg-blue-500/15 text-blue-400 border-blue-500/30",
  archived:  "bg-muted/50 text-muted-foreground border-border/40",
}

const statusLabels: Record<string, string> = {
  active: "Activa", enabled: "Activa", paused: "Pausada",
  completed: "Completada", ended: "Terminada", draft: "Borrador", archived: "Archivada",
}

const providerColors: Record<string, string> = {
  facebook: "text-blue-400",
  instagram: "text-pink-400",
  google: "text-yellow-400",
  tiktok: "text-fuchsia-400",
  twitter: "text-sky-400",
  linkedin: "text-indigo-400",
}

function ProgressBar({ spend, budget }: { spend: number; budget: number }) {
  if (!budget) return null
  const pct = Math.min((spend / budget) * 100, 100)
  const color = pct > 90 ? "bg-red-400" : pct > 70 ? "bg-yellow-400" : "bg-emerald-400"
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Gasto vs Presupuesto</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Gastado: <span className="text-foreground font-medium">{fmtMoney(spend)}</span></span>
        <span className="text-muted-foreground">Presup: <span className="text-foreground font-medium">{fmtMoney(budget)}</span></span>
      </div>
    </div>
  )
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const status = (campaign.status ?? "").toLowerCase()
  const name = String(campaign.name ?? "Sin nombre")
  const impressions = Number(campaign.impressions ?? 0)
  const clicks = Number(campaign.clicks ?? 0)
  const spend = Number(campaign.spend ?? 0)
  const budget = Number(campaign.budget ?? campaign.budgetAmount ?? campaign.dailyBudget ?? 0)
  const cpc = Number(campaign.cpc ?? (clicks > 0 ? spend / clicks : 0))
  const cpm = Number(campaign.cpm ?? (impressions > 0 ? (spend / impressions) * 1000 : 0))
  const ctr = Number(campaign.ctr ?? (impressions > 0 ? (clicks / impressions) * 100 : 0))
  const provider = String(campaign.provider ?? campaign.network ?? "").toLowerCase()
  const currency = String(campaign.currency ?? "USD")

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-5 space-y-4 hover:border-border/60 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{name}</p>
          {provider && (
            <p className={`text-xs capitalize mt-0.5 ${providerColors[provider] ?? "text-muted-foreground"}`}>
              {provider}
            </p>
          )}
        </div>
        <Badge variant="outline" className={`text-xs shrink-0 ${statusColors[status] ?? "bg-muted/50 text-muted-foreground border-border/40"}`}>
          {statusLabels[status] ?? campaign.status ?? "—"}
        </Badge>
      </div>

      {budget > 0 && <ProgressBar spend={spend} budget={budget} />}

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />Impresiones</p>
          <p className="text-lg font-bold">{fmtNum(impressions)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><MousePointer className="w-3 h-3" />Clics</p>
          <p className="text-lg font-bold">{fmtNum(clicks)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />CTR</p>
          <p className="text-lg font-bold">{ctr > 0 ? pct(ctr) : "—"}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3" />CPC</p>
          <p className="text-lg font-bold">{cpc > 0 ? fmtMoney(cpc, currency) : "—"}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><BarChart2 className="w-3 h-3" />CPM</p>
          <p className="text-lg font-bold">{cpm > 0 ? fmtMoney(cpm, currency) : "—"}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" />Gasto</p>
          <p className="text-lg font-bold">{fmtMoney(spend, currency)}</p>
        </div>
      </div>
    </Card>
  )
}

function extractCampaigns(data: Record<string, unknown> | null): Campaign[] {
  if (!data) return []
  if (Array.isArray(data)) return data as Campaign[]
  const d = data as Record<string, unknown>
  if (Array.isArray(d.data)) return d.data as Campaign[]
  if (Array.isArray(d.campaigns)) return d.campaigns as Campaign[]
  if (Array.isArray(d.items)) return d.items as Campaign[]
  return []
}

export function MetricoolCampaigns({ data, loading }: MetricoolCampaignsProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/40 p-5 animate-pulse space-y-4">
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="h-3 bg-muted rounded" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, j) => <div key={j} className="h-8 bg-muted rounded" />)}
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const campaigns = extractCampaigns(data)

  if (!campaigns.length) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-8">
        <div className="flex flex-col items-center gap-4 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
            <Target className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Sin campañas de advertising</p>
            <p className="text-sm text-muted-foreground">
              No hay cuentas de anuncios conectadas en Metricool para este perfil.
            </p>
          </div>
          <div className="w-full text-left space-y-2 bg-muted/30 rounded-lg p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Para conectar ads:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Entra a <span className="text-foreground font-medium">app.metricool.com</span></li>
              <li>Selecciona la marca del cliente</li>
              <li>Ve a <span className="text-foreground font-medium">Advertising → Conectar cuenta</span></li>
              <li>Conecta <span className="text-foreground font-medium">Meta Ads</span>, <span className="text-foreground font-medium">Google Ads</span> o <span className="text-foreground font-medium">TikTok Ads</span></li>
            </ol>
          </div>
        </div>
      </Card>
    )
  }

  const totalImpressions = campaigns.reduce((s, c) => s + Number(c.impressions ?? 0), 0)
  const totalClicks      = campaigns.reduce((s, c) => s + Number(c.clicks ?? 0), 0)
  const totalSpend       = campaigns.reduce((s, c) => s + Number(c.spend ?? 0), 0)
  const totalBudget      = campaigns.reduce((s, c) => s + Number(c.budget ?? c.budgetAmount ?? 0), 0)
  const activeCampaigns  = campaigns.filter(c => ["active","enabled"].includes((c.status ?? "").toLowerCase())).length
  const avgCpc           = totalClicks > 0 ? totalSpend / totalClicks : 0
  const avgCtr           = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Target className="w-3 h-3" />Campañas activas</p>
          <p className="text-2xl font-bold">{activeCampaigns} <span className="text-sm text-muted-foreground font-normal">/ {campaigns.length}</span></p>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><DollarSign className="w-3 h-3" />Gasto total</p>
          <p className="text-2xl font-bold">{fmtMoney(totalSpend)}</p>
          {totalBudget > 0 && <p className="text-xs text-muted-foreground">de {fmtMoney(totalBudget)}</p>}
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><MousePointer className="w-3 h-3" />CPC promedio</p>
          <p className="text-2xl font-bold">{avgCpc > 0 ? fmtMoney(avgCpc) : "—"}</p>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3" />CTR promedio</p>
          <p className="text-2xl font-bold">{avgCtr > 0 ? pct(avgCtr) : "—"}</p>
          <p className="text-xs text-muted-foreground">{fmtNum(totalClicks)} clics / {fmtNum(totalImpressions)} imp.</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {campaigns.map((c, i) => (
          <CampaignCard key={String(c.id ?? i)} campaign={c} />
        ))}
      </div>
    </div>
  )
}

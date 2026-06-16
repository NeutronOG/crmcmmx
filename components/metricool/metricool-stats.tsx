"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Megaphone, Globe } from "lucide-react"

interface Profile {
  id?: number | string
  label?: string
  picture?: string
  twitter?: string | null
  facebook?: string | null
  instagram?: string | null
  linkedinCompany?: string | null
  tiktok?: string | null
  youtube?: string | null
  pinterest?: string | null
  threads?: string | null
  bluesky?: string | null
  facebookAds?: string | null
  facebookAdsName?: string | null
  tiktokads?: string | null
  tiktokadsDisplayName?: string | null
  adwords?: string | null
  adwordsAccountName?: string | null
  timezone?: string | null
  [key: string]: unknown
}

interface MetricoolStatsProps {
  data: Record<string, unknown> | null
  loading: boolean
  error: string | null
  onSelectProfile?: (blogId: string) => void
  selectedBlogId?: string
}

const NETWORKS: { key: string; label: string; color: string; bg: string }[] = [
  { key: "instagram",       label: "Instagram",  color: "text-pink-400",    bg: "bg-pink-400/10" },
  { key: "facebook",        label: "Facebook",   color: "text-blue-400",    bg: "bg-blue-400/10" },
  { key: "twitter",         label: "Twitter/X",  color: "text-sky-400",     bg: "bg-sky-400/10" },
  { key: "linkedinCompany", label: "LinkedIn",   color: "text-indigo-400",  bg: "bg-indigo-400/10" },
  { key: "tiktok",          label: "TikTok",     color: "text-fuchsia-400", bg: "bg-fuchsia-400/10" },
  { key: "youtube",         label: "YouTube",    color: "text-red-400",     bg: "bg-red-400/10" },
  { key: "pinterest",       label: "Pinterest",  color: "text-rose-400",    bg: "bg-rose-400/10" },
  { key: "threads",         label: "Threads",    color: "text-zinc-400",    bg: "bg-zinc-400/10" },
  { key: "bluesky",         label: "Bluesky",    color: "text-cyan-400",    bg: "bg-cyan-400/10" },
]

function ProfileCard({
  profile,
  isSelected,
  onSelect,
}: {
  profile: Profile
  isSelected: boolean
  onSelect: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const name = String(profile.label ?? `Perfil ${profile.id}`)
  const connectedNets = NETWORKS.filter(n => profile[n.key] != null && profile[n.key] !== "")
  const hasAds = !!(profile.facebookAds || profile.tiktokads || profile.adwords)

  return (
    <Card
      className={`backdrop-blur-sm border transition-all cursor-pointer ${
        isSelected
          ? "bg-card/80 border-emerald-500/50 ring-1 ring-emerald-500/30"
          : "bg-card/60 border-border/40 hover:border-border/70"
      }`}
    >
      {/* Header — siempre visible, click selecciona el perfil */}
      <div
        className="p-4 flex items-center gap-3"
        onClick={onSelect}
      >
        {profile.picture ? (
          <img src={profile.picture} alt={name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm truncate">{name}</p>
            {isSelected && (
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/30 bg-emerald-400/10 py-0">
                Activo
              </Badge>
            )}
            {hasAds && (
              <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30 bg-amber-400/10 py-0">
                <Megaphone className="w-2.5 h-2.5 mr-1" />ads
              </Badge>
            )}
          </div>
          <div className="flex gap-1 mt-1 flex-wrap">
            {connectedNets.slice(0, 4).map(n => (
              <span key={n.key} className={`text-xs px-1.5 py-0.5 rounded ${n.color} ${n.bg}`}>
                {n.label}
              </span>
            ))}
            {connectedNets.length > 4 && (
              <span className="text-xs px-1.5 py-0.5 rounded text-muted-foreground bg-muted/40">
                +{connectedNets.length - 4}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 shrink-0"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Detalle expandible */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
          {/* Redes sociales */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Redes sociales
            </p>
            <div className="flex flex-wrap gap-1.5">
              {connectedNets.length > 0 ? connectedNets.map(n => (
                <span key={n.key} className={`text-xs px-2 py-1 rounded-full ${n.color} ${n.bg} flex items-center gap-1`}>
                  <CheckCircle2 className="w-3 h-3" />{n.label}
                </span>
              )) : (
                <p className="text-xs text-muted-foreground">Sin redes conectadas</p>
              )}
            </div>
          </div>

          {/* Cuentas de Ads */}
          {hasAds && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                <Megaphone className="w-3 h-3" /> Cuentas de Advertising
              </p>
              <div className="space-y-1">
                {profile.facebookAds && (
                  <div className="flex items-center justify-between text-xs bg-blue-400/5 border border-blue-400/20 rounded px-2 py-1.5">
                    <span className="text-blue-400 font-medium">Meta Ads</span>
                    <span className="text-muted-foreground font-mono">{String(profile.facebookAds)}</span>
                  </div>
                )}
                {profile.adwords && (
                  <div className="flex items-center justify-between text-xs bg-yellow-400/5 border border-yellow-400/20 rounded px-2 py-1.5">
                    <span className="text-yellow-400 font-medium">Google Ads</span>
                    <span className="text-muted-foreground font-mono">{String(profile.adwords)}</span>
                  </div>
                )}
                {profile.tiktokads && (
                  <div className="flex items-center justify-between text-xs bg-fuchsia-400/5 border border-fuchsia-400/20 rounded px-2 py-1.5">
                    <span className="text-fuchsia-400 font-medium">TikTok Ads</span>
                    <span className="text-muted-foreground font-mono">{String(profile.tiktokadsDisplayName ?? profile.tiktokads)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {profile.timezone && (
            <p className="text-xs text-muted-foreground">Zona horaria: {profile.timezone}</p>
          )}
        </div>
      )}
    </Card>
  )
}

export function MetricoolStats({ data, loading, error, onSelectProfile, selectedBlogId }: MetricoolStatsProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/40 p-4 animate-pulse space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, j) => <div key={j} className="h-5 w-16 bg-muted rounded-full" />)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-muted-foreground text-sm font-medium">No se pudo conectar con Metricool</p>
          <span className="font-mono text-xs bg-muted/50 rounded px-2 py-1">{error}</span>
        </div>
      </Card>
    )
  }

  const profiles: Profile[] = Array.isArray(data) ? (data as Profile[]) : data ? [data as Profile] : []

  if (!profiles.length) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-8 text-center">
        <p className="text-muted-foreground text-sm">No se encontraron perfiles en tu cuenta de Metricool.</p>
      </Card>
    )
  }

  const totalNets = profiles.reduce((s, p) => s + NETWORKS.filter(n => p[n.key] != null).length, 0)
  const withAds = profiles.filter(p => !!(p.facebookAds || p.tiktokads || p.adwords)).length

  return (
    <div className="space-y-6">
      {/* Totales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Clientes / Marcas</p>
          <p className="text-3xl font-bold">{profiles.length}</p>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Conexiones totales</p>
          <p className="text-3xl font-bold text-emerald-400">{totalNets}</p>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Clientes con Ads</p>
          <p className="text-3xl font-bold text-amber-400">{withAds}</p>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Estado API</p>
          <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-4 h-4" /> Conectado
          </p>
        </Card>
      </div>

      {onSelectProfile && (
        <p className="text-xs text-muted-foreground">
          Haz clic en una tarjeta para ver sus campañas y publicaciones. Expande con <ChevronDown className="w-3 h-3 inline" /> para ver el detalle.
        </p>
      )}

      {/* Tarjetas de clientes */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <ProfileCard
            key={String(profile.id ?? "")}
            profile={profile}
            isSelected={selectedBlogId === String(profile.id)}
            onSelect={() => onSelectProfile?.(String(profile.id ?? ""))}
          />
        ))}
      </div>
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface BestTime {
  hour?: number
  day?: number | string
  score?: number
  network?: string
  [key: string]: unknown
}

interface MetricoolBestTimesProps {
  data: Record<string, unknown> | null
  loading: boolean
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function fmt12(h: number) {
  const suffix = h >= 12 ? "pm" : "am"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}${suffix}`
}

function HeatmapGrid({ times }: { times: BestTime[] }) {
  const maxScore = Math.max(...times.map(t => Number(t.score ?? 1)), 1)

  const grid: Record<string, number> = {}
  for (const t of times) {
    const day = Number(t.day ?? 0)
    const hour = Number(t.hour ?? 0)
    const key = `${day}-${hour}`
    grid[key] = Math.max(grid[key] ?? 0, Number(t.score ?? 1))
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex gap-1 mb-1 ml-10">
          {HOURS.filter((_, i) => i % 3 === 0).map(h => (
            <div key={h} className="flex-1 text-center text-[10px] text-muted-foreground">{fmt12(h)}</div>
          ))}
        </div>
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center gap-1 mb-1">
            <span className="w-9 text-xs text-muted-foreground text-right pr-1 shrink-0">{day}</span>
            {HOURS.map(h => {
              const score = grid[`${dayIdx}-${h}`] ?? 0
              const intensity = score / maxScore
              return (
                <div
                  key={h}
                  title={`${day} ${fmt12(h)} — score: ${score.toFixed(1)}`}
                  className="flex-1 h-5 rounded-sm transition-colors"
                  style={{
                    backgroundColor: intensity > 0
                      ? `rgba(16, 185, 129, ${0.1 + intensity * 0.85})`
                      : "rgba(255,255,255,0.04)",
                  }}
                />
              )
            })}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs text-muted-foreground">Bajo</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
            <div
              key={v}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: `rgba(16,185,129,${v})` }}
            />
          ))}
          <span className="text-xs text-muted-foreground">Alto</span>
        </div>
      </div>
    </div>
  )
}

function TopTimesList({ times }: { times: BestTime[] }) {
  const sorted = [...times].sort((a, b) => Number(b.score ?? 0) - Number(a.score ?? 0)).slice(0, 8)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {sorted.map((t, i) => {
        const day = DAYS[Number(t.day ?? 0)] ?? "—"
        const hour = Number(t.hour ?? 0)
        return (
          <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/40 p-3 space-y-1 text-center">
            <p className="text-xs text-muted-foreground">{i === 0 ? "🏆 Mejor" : `#${i + 1}`}</p>
            <p className="font-bold">{day}</p>
            <p className="text-lg font-bold text-emerald-400">{fmt12(hour)}</p>
            {t.network && (
              <p className="text-xs text-muted-foreground capitalize">{String(t.network)}</p>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export function MetricoolBestTimes({ data, loading }: MetricoolBestTimesProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-6 animate-pulse space-y-3">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
        </Card>
      </div>
    )
  }

  const times: BestTime[] = Array.isArray(data)
    ? (data as BestTime[])
    : Array.isArray((data as Record<string, unknown>)?.bestTimes)
    ? ((data as Record<string, unknown>).bestTimes as BestTime[])
    : Array.isArray((data as Record<string, unknown>)?.data)
    ? ((data as Record<string, unknown>).data as BestTime[])
    : []

  if (!times.length) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <Clock className="w-8 h-8 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">
            No hay datos de mejores horarios disponibles.
          </p>
          <p className="text-xs text-muted-foreground/70 max-w-sm">
            Metricool necesita suficiente historial de publicaciones para calcular los mejores horarios.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Mapa de calor — Mejores momentos para publicar
        </h3>
        <HeatmapGrid times={times} />
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Top horarios recomendados</h3>
        <TopTimesList times={times} />
      </div>
    </div>
  )
}

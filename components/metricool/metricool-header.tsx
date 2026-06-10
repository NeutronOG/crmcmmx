"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, RefreshCw } from "lucide-react"

interface MetricoolHeaderProps {
  onRefresh: () => void
  loading: boolean
  dateRange: { from: string; to: string }
  onDateRangeChange: (range: { from: string; to: string }) => void
}

export function MetricoolHeader({ onRefresh, loading, dateRange, onDateRangeChange }: MetricoolHeaderProps) {
  const presets = [
    { label: "7 días", days: 7 },
    { label: "30 días", days: 30 },
    { label: "90 días", days: 90 },
  ]

  const setPreset = (days: number) => {
    const to = new Date().toISOString().split("T")[0]
    const from = new Date(Date.now() - days * 864e5).toISOString().split("T")[0]
    onDateRangeChange({ from, to })
  }

  const activeDays = Math.round(
    (new Date(dateRange.to).getTime() - new Date(dateRange.from).getTime()) / 864e5
  )

  return (
    <div className="border-b border-border/40 backdrop-blur-xl bg-background/60 sticky top-[72px] z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Metricool Analytics</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Conectado
            </span>
          </div>
          <div className="flex items-center gap-2">
            {presets.map(p => (
              <Button
                key={p.days}
                variant={activeDays === p.days ? "default" : "outline"}
                size="sm"
                className={activeDays !== p.days ? "bg-transparent" : ""}
                onClick={() => setPreset(p.days)}
              >
                {p.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="gap-1"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

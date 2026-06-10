"use client"

import { useCallback, useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { MetricoolHeader } from "@/components/metricool/metricool-header"
import { MetricoolStats } from "@/components/metricool/metricool-stats"
import { MetricoolPosts } from "@/components/metricool/metricool-posts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function getDateRange(days: number) {
  const to = new Date().toISOString().split("T")[0]
  const from = new Date(Date.now() - days * 864e5).toISOString().split("T")[0]
  return { from, to }
}

export default function MetricoolPage() {
  const [dateRange, setDateRange] = useState(getDateRange(30))
  const [analyticsData, setAnalyticsData] = useState<Record<string, unknown> | null>(null)
  const [publishedData, setPublishedData] = useState<Record<string, unknown> | null>(null)
  const [scheduledData, setScheduledData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ from: dateRange.from, to: dateRange.to })

      const [analyticsRes, publishedRes, scheduledRes] = await Promise.all([
        fetch(`/api/metricool/stats?endpoint=analytics&${params}`),
        fetch(`/api/metricool/stats?endpoint=posts/published&${params}`),
        fetch(`/api/metricool/stats?endpoint=posts/scheduled&${params}`),
      ])

      if (!analyticsRes.ok) {
        const err = await analyticsRes.json()
        setError(err.error ?? `Error ${analyticsRes.status}`)
      } else {
        setAnalyticsData(await analyticsRes.json())
      }

      if (publishedRes.ok) setPublishedData(await publishedRes.json())
      if (scheduledRes.ok) setScheduledData(await scheduledRes.json())
    } catch (e) {
      setError("Error de conexión con Metricool")
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <MetricoolHeader
          onRefresh={fetchAll}
          loading={loading}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <main className="container mx-auto p-6 pb-20 space-y-8">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Metricool
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Analítica de redes sociales y rendimiento de contenido
            </p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="posts">Publicaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <MetricoolStats data={analyticsData} loading={loading} error={error} />
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <MetricoolPosts
                data={publishedData}
                scheduledData={scheduledData}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

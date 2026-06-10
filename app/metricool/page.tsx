"use client"

import { useCallback, useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { MetricoolHeader } from "@/components/metricool/metricool-header"
import { MetricoolStats } from "@/components/metricool/metricool-stats"
import { MetricoolPosts } from "@/components/metricool/metricool-posts"
import { MetricoolCampaigns } from "@/components/metricool/metricool-campaigns"
import { MetricoolNetworks } from "@/components/metricool/metricool-networks"
import { MetricoolBestTimes } from "@/components/metricool/metricool-best-times"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function getDateRange(days: number) {
  const to = new Date().toISOString().split("T")[0]
  const from = new Date(Date.now() - days * 864e5).toISOString().split("T")[0]
  return { from, to }
}

async function safeFetch(url: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default function MetricoolPage() {
  const [dateRange, setDateRange] = useState(getDateRange(30))
  const [analyticsData, setAnalyticsData] = useState<Record<string, unknown> | null>(null)
  const [postsData, setPostsData] = useState<Record<string, unknown> | null>(null)
  const [campaignsData, setCampaignsData] = useState<Record<string, unknown> | null>(null)
  const [instagramData, setInstagramData] = useState<Record<string, unknown> | null>(null)
  const [facebookData, setFacebookData] = useState<Record<string, unknown> | null>(null)
  const [tiktokData, setTiktokData] = useState<Record<string, unknown> | null>(null)
  const [linkedinData, setLinkedinData] = useState<Record<string, unknown> | null>(null)
  const [bestTimesData, setBestTimesData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const p = new URLSearchParams({ from: dateRange.from, to: dateRange.to })

      const [
        analyticsRes,
        postsRes,
        campaignsRes,
        instagramRes,
        facebookRes,
        tiktokRes,
        linkedinRes,
        bestTimesRes,
      ] = await Promise.all([
        fetch(`/api/metricool/stats?endpoint=analytics&${p}`),
        safeFetch(`/api/metricool/stats?endpoint=posts&${p}`),
        safeFetch(`/api/metricool/stats?endpoint=campaigns&${p}`),
        safeFetch(`/api/metricool/stats?endpoint=instagram&${p}`),
        safeFetch(`/api/metricool/stats?endpoint=facebook&${p}`),
        safeFetch(`/api/metricool/stats?endpoint=tiktok&${p}`),
        safeFetch(`/api/metricool/stats?endpoint=linkedin&${p}`),
        safeFetch(`/api/metricool/stats?endpoint=besttimes&${p}`),
      ])

      if (!analyticsRes.ok) {
        const err = await analyticsRes.json()
        setError(err.error ?? `Error ${analyticsRes.status}`)
      } else {
        setAnalyticsData(await analyticsRes.json())
      }

      setPostsData(postsRes)
      setCampaignsData(campaignsRes)
      setInstagramData(instagramRes)
      setFacebookData(facebookRes)
      setTiktokData(tiktokRes)
      setLinkedinData(linkedinRes)
      setBestTimesData(bestTimesRes)
    } catch {
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
              <TabsTrigger value="networks">Redes Sociales</TabsTrigger>
              <TabsTrigger value="campaigns">Campañas</TabsTrigger>
              <TabsTrigger value="posts">Publicaciones</TabsTrigger>
              <TabsTrigger value="besttimes">Mejores Horarios</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <MetricoolStats data={analyticsData} loading={loading} error={error} />
            </TabsContent>

            <TabsContent value="networks" className="mt-6">
              <MetricoolNetworks
                instagram={instagramData}
                facebook={facebookData}
                tiktok={tiktokData}
                linkedin={linkedinData}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="campaigns" className="mt-6">
              <MetricoolCampaigns data={campaignsData} loading={loading} />
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <MetricoolPosts
                data={postsData}
                scheduledData={null}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="besttimes" className="mt-6">
              <MetricoolBestTimes data={bestTimesData} loading={loading} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

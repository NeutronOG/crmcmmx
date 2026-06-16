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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2 } from "lucide-react"

interface Profile {
  id?: number | string
  blogId?: number | string
  name?: string
  label?: string
  image?: string
  picture?: string
  facebookAds?: string | null
  tiktokads?: string | null
  adwords?: string | null
  [key: string]: unknown
}

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
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedBlogId, setSelectedBlogId] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")
  const [analyticsData, setAnalyticsData] = useState<Record<string, unknown> | null>(null)
  const [postsData, setPostsData] = useState<Record<string, unknown> | null>(null)
  const [campaignsData, setCampaignsData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/metricool/stats?endpoint=profiles`)
      if (!res.ok) {
        const err = await res.json()
        setError(err.error ?? `Error ${res.status}`)
        return
      }
      const data = await res.json()
      const list: Profile[] = Array.isArray(data) ? data : []
      setProfiles(list)
      setAnalyticsData(data)
      if (list.length > 0 && !selectedBlogId) {
        const first = String(list[0].blogId ?? list[0].id ?? "")
        setSelectedBlogId(first)
      }
    } catch {
      setError("Error de conexión con Metricool")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCampaigns = useCallback(async (blogId: string, profile?: Profile) => {
    if (!blogId) return
    setLoadingCampaigns(true)
    try {
      const p = new URLSearchParams({ from: dateRange.from, to: dateRange.to, blogId })

      const fetchList: Promise<unknown>[] = [
        safeFetch(`/api/metricool/stats?endpoint=posts&${p}`),
      ]

      // Meta Ads — usar el facebookAdsId real del perfil
      const fbAdsId = profile?.facebookAds
      if (fbAdsId) {
        const pFb = new URLSearchParams({ from: dateRange.from, to: dateRange.to, facebookAdsId: fbAdsId })
        fetchList.push(safeFetch(`/api/metricool/stats?endpoint=fbcampaigns&${pFb}`))
      } else {
        fetchList.push(Promise.resolve(null))
      }

      // TikTok Ads
      const tikAdsId = profile?.tiktokads
      if (tikAdsId) {
        fetchList.push(safeFetch(`/api/metricool/stats?endpoint=campaigns&${p}`))
      } else {
        fetchList.push(Promise.resolve(null))
      }

      const [postsRes, fbCampaigns, tiktokCampaigns] = await Promise.all(fetchList)

      setPostsData(postsRes as Record<string, unknown> | null)

      const allCampaigns = [
        ...(Array.isArray(tiktokCampaigns) ? tiktokCampaigns : []),
        ...(Array.isArray(fbCampaigns) ? fbCampaigns : []),
      ]
      setCampaignsData(allCampaigns.length > 0 ? (allCampaigns as unknown as Record<string, unknown>) : null)
    } finally {
      setLoadingCampaigns(false)
    }
  }, [dateRange])

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  useEffect(() => {
    if (selectedBlogId) {
      const profile = profiles.find(p => String(p.id) === selectedBlogId)
      fetchCampaigns(selectedBlogId, profile)
    }
  }, [selectedBlogId, fetchCampaigns, profiles])

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <MetricoolHeader
          onRefresh={() => { fetchProfiles(); if (selectedBlogId) fetchCampaigns(selectedBlogId) }}
          loading={loading}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        <main className="container mx-auto p-6 pb-20 space-y-8">
          <div className="flex items-end justify-between gap-4 pt-6 flex-wrap">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
                Metricool
              </h1>
              <p className="text-lg text-muted-foreground/90">
                Analítica de redes sociales y rendimiento de contenido
              </p>
            </div>

            {profiles.length > 0 && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select value={selectedBlogId} onValueChange={setSelectedBlogId}>
                  <SelectTrigger className="w-[220px] bg-card/60 border-border/40">
                    <SelectValue placeholder="Selecciona perfil..." />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((p) => {
                      const id = String(p.id ?? "")
                      const name = String(p.label ?? p.name ?? `Perfil ${id}`)
                      const hasAds = !!(p.facebookAds || p.tiktokads || p.adwords)
                      return (
                        <SelectItem key={id} value={id}>
                          <span className="flex items-center gap-2">
                            {name}
                            {hasAds && <span className="text-xs text-emerald-400 font-medium">● ads</span>}
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="campaigns">Campañas</TabsTrigger>
              <TabsTrigger value="posts">Publicaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <MetricoolStats
                data={analyticsData}
                loading={loading}
                error={error}
                selectedBlogId={selectedBlogId}
                onSelectProfile={(id) => {
                  setSelectedBlogId(id)
                  setActiveTab("campaigns")
                }}
              />
            </TabsContent>

            <TabsContent value="campaigns" className="mt-6">
              <MetricoolCampaigns data={campaignsData} loading={loadingCampaigns} />
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <MetricoolPosts
                data={postsData}
                scheduledData={null}
                loading={loadingCampaigns}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

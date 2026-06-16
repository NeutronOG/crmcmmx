import { NextRequest, NextResponse } from "next/server"

const METRICOOL_API = "https://app.metricool.com/api"
const TOKEN = process.env.METRICOOL_API_KEY
const USER_ID = process.env.METRICOOL_USER_ID
const BLOG_ID = process.env.METRICOOL_BLOG_ID

const VALID_ENDPOINTS: Record<string, string> = {
  // Perfiles / marcas conectadas
  profiles: "admin/simpleProfiles",
  // Posts del planner
  posts: "stats/posts",
  // Campañas TikTok Ads — confirmado funciona
  campaigns: "stats/tiktokads/campaigns",
  // Campañas Facebook/Meta Ads por cuenta
  fbcampaigns: "datastudio/fbads/ads",
  // Campañas TikTok Ads (datastudio)
  tiktokads: "datastudio/tiktokads/ads",
  // Redes sociales — solo si están conectadas
  instagram: "stats/instagram/posts",
  reels: "stats/instagram/reels",
  facebook: "stats/facebook/posts",
  twitter: "stats/twitter/posts",
  linkedin: "stats/linkedin/posts",
  youtube: "stats/youtube/videos",
  tiktok: "stats/tiktok/posts",
}

// Estos endpoints NO usan userId/blogId — usan start/end en vez de from/to
const DATASTUDIO_ENDPOINTS = new Set(["fbcampaigns", "tiktokads"])

export async function GET(request: NextRequest) {
  if (!TOKEN || !USER_ID || !BLOG_ID) {
    return NextResponse.json(
      { error: "Variables de entorno de Metricool no configuradas (METRICOOL_API_KEY, METRICOOL_USER_ID, METRICOOL_BLOG_ID)" },
      { status: 500 }
    )
  }

  const { searchParams } = request.nextUrl
  const endpoint = searchParams.get("endpoint") ?? "profiles"
  const from = searchParams.get("from") ?? getDefaultFrom()
  const to = searchParams.get("to") ?? getTodayISO()
  const blogIdOverride = searchParams.get("blogId")

  // Endpoint de diagnóstico: muestra qué perfiles tienen cuentas de ads conectadas
  if (endpoint === "debug-profiles") {
    const r = await fetch(`${METRICOOL_API}/admin/simpleProfiles?userId=${USER_ID}&blogId=${BLOG_ID}&from=${from}&to=${to}`, {
      headers: { "X-Mc-Auth": TOKEN! }, cache: "no-store"
    })
    const body = await r.json()
    const list = Array.isArray(body) ? body : []
    const adsProfiles = list.map((p: Record<string, unknown>) => ({
      id: p.id,
      label: p.label,
      facebookAds: p.facebookAds,
      facebookAdsName: p.facebookAdsName,
      tiktokads: p.tiktokads,
      tiktokadsDisplayName: p.tiktokadsDisplayName,
      adwords: p.adwords,
      adwordsAccountName: p.adwordsAccountName,
      hasAds: !!(p.facebookAds || p.tiktokads || p.adwords),
    }))
    return NextResponse.json({
      total: list.length,
      withAds: adsProfiles.filter((p: Record<string, unknown>) => p.hasAds),
      withoutAds: adsProfiles.filter((p: Record<string, unknown>) => !p.hasAds).map((p: Record<string, unknown>) => p.label),
    })
  }

  // Endpoint de diagnóstico: prueba todas las fuentes de campañas con el facebookAdsId real
  if (endpoint === "debug-campaigns") {
    const fbAdsId = searchParams.get("facebookAdsId") ?? ""
    const sources = [
      { key: "tiktokads_campaigns", url: `${METRICOOL_API}/stats/tiktokads/campaigns?userId=${USER_ID}&blogId=${blogIdOverride ?? BLOG_ID}&from=${from}&to=${to}` },
      { key: "fbads_datastudio",    url: `${METRICOOL_API}/datastudio/fbads/ads?start=${from}&end=${to}` },
      { key: "fbads_with_actid",    url: fbAdsId ? `${METRICOOL_API}/datastudio/fbads/campaigns?facebookAdsId=${fbAdsId}&start=${from}&end=${to}` : "(no facebookAdsId provided)" },
    ]
    const results: Record<string, unknown> = {}
    for (const s of sources) {
      try {
        const r = await fetch(s.url, { headers: { "X-Mc-Auth": TOKEN! }, cache: "no-store" })
        const body = await r.text()
        results[s.key] = { status: r.status, body: body.slice(0, 500) }
      } catch (e) {
        results[s.key] = { error: String(e) }
      }
    }
    return NextResponse.json(results)
  }

  const path = VALID_ENDPOINTS[endpoint]
  if (!path) {
    return NextResponse.json({ error: `Endpoint '${endpoint}' no permitido` }, { status: 400 })
  }

  const isDatastudio = DATASTUDIO_ENDPOINTS.has(endpoint)
  const effectiveBlogId = blogIdOverride ?? BLOG_ID
  const facebookAdsId = searchParams.get("facebookAdsId")
  const params = new URLSearchParams(
    isDatastudio
      ? (facebookAdsId ? { facebookAdsId, start: from, end: to } : { start: from, end: to })
      : { userId: USER_ID, blogId: effectiveBlogId, from, to }
  )

  const fullUrl = `${METRICOOL_API}/${path}?${params}`
  console.log("[Metricool] →", fullUrl)
  console.log("[Metricool] token:", TOKEN ? `${TOKEN.slice(0, 8)}...` : "MISSING")
  console.log("[Metricool] userId:", USER_ID ?? "MISSING")
  console.log("[Metricool] blogId:", BLOG_ID ?? "MISSING")

  try {
    const res = await fetch(fullUrl, {
      headers: {
        "X-Mc-Auth": TOKEN,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[Metricool] ✗ ${res.status} ${endpoint}:`, err)
      return NextResponse.json(
        { error: `Metricool API error: ${res.status}`, detail: err },
        { status: res.status }
      )
    }

    const data = await res.json()
    console.log(`[Metricool] ✓ ${endpoint} response:`, JSON.stringify(data).slice(0, 300))
    return NextResponse.json(data)
  } catch (err) {
    console.error(`[Metricool] ✗ fetch exception ${endpoint}:`, err)
    return NextResponse.json(
      { error: "Error de conexión con Metricool", detail: String(err) },
      { status: 500 }
    )
  }
}

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0]
}

function getDefaultFrom(): string {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().split("T")[0]
}

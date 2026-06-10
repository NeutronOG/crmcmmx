import { NextRequest, NextResponse } from "next/server"

const METRICOOL_API = "https://app.metricool.com/api"
const TOKEN = process.env.METRICOOL_API_KEY
const USER_ID = process.env.METRICOOL_USER_ID
const BLOG_ID = process.env.METRICOOL_BLOG_ID

const VALID_ENDPOINTS: Record<string, string> = {
  // Perfiles / marcas
  profiles: "admin/simpleProfiles",
  // Posts programados y publicados
  posts: "v1/posts",
  // Analytics generales por red social
  analytics: "v1/stats/analytics",
  // Campañas
  campaigns: "v1/campaigns",
  // Analytics Instagram
  instagram: "v1/stats/instagram",
  // Analytics Facebook
  facebook: "v1/stats/facebook",
  // Analytics Twitter/X
  twitter: "v1/stats/twitter",
  // Analytics LinkedIn
  linkedin: "v1/stats/linkedin",
  // Analytics TikTok
  tiktok: "v1/stats/tiktok",
  // Analytics YouTube
  youtube: "v1/stats/youtube",
  // Mejores horas para publicar
  besttimes: "v1/bestTimes",
}

export async function GET(request: NextRequest) {
  if (!TOKEN || !USER_ID || !BLOG_ID) {
    return NextResponse.json(
      { error: "Variables de entorno de Metricool no configuradas (METRICOOL_API_KEY, METRICOOL_USER_ID, METRICOOL_BLOG_ID)" },
      { status: 500 }
    )
  }

  const { searchParams } = request.nextUrl
  const endpoint = searchParams.get("endpoint") ?? "analytics"
  const from = searchParams.get("from") ?? getDefaultFrom()
  const to = searchParams.get("to") ?? getTodayISO()

  const path = VALID_ENDPOINTS[endpoint]
  if (!path) {
    return NextResponse.json({ error: `Endpoint '${endpoint}' no permitido` }, { status: 400 })
  }

  const params = new URLSearchParams({
    userId: USER_ID,
    blogId: BLOG_ID,
    from,
    to,
  })

  try {
    const res = await fetch(`${METRICOOL_API}/${path}?${params}`, {
      headers: {
        "X-Mc-Auth": TOKEN,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json(
        { error: `Metricool API error: ${res.status}`, detail: err },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
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

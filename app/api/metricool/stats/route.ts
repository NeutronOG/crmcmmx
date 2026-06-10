import { NextRequest, NextResponse } from "next/server"

const METRICOOL_API = "https://app.metricool.com/api/v2"
const TOKEN = process.env.METRICOOL_API_KEY

export async function GET(request: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({ error: "METRICOOL_API_KEY no configurada" }, { status: 500 })
  }

  const { searchParams } = request.nextUrl
  const endpoint = searchParams.get("endpoint") ?? "analytics"
  const from = searchParams.get("from") ?? getDefaultFrom()
  const to = searchParams.get("to") ?? getTodayISO()
  const blog = searchParams.get("blog") ?? ""

  const validEndpoints = ["analytics", "posts/scheduled", "posts/published", "accounts"]
  if (!validEndpoints.includes(endpoint)) {
    return NextResponse.json({ error: "Endpoint no permitido" }, { status: 400 })
  }

  const params = new URLSearchParams({ from, to })
  if (blog) params.set("blog", blog)

  try {
    const res = await fetch(`${METRICOOL_API}/${endpoint}?${params}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // caché 5 min
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

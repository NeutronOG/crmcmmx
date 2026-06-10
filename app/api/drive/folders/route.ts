import { NextRequest, NextResponse } from "next/server"

const DRIVE_API = "https://www.googleapis.com/drive/v3"

async function getValidAccessToken(request: NextRequest): Promise<string | null> {
  const accessToken = request.cookies.get("google_access_token")?.value
  if (accessToken) return accessToken

  const refreshToken = request.cookies.get("google_refresh_token")?.value
  if (!refreshToken) return null

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.access_token ?? null
}

// POST - Crear carpeta
export async function POST(request: NextRequest) {
  const accessToken = await getValidAccessToken(request)
  if (!accessToken) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  try {
    const { name, parentId } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Folder name required" }, { status: 400 })
    }

    const metadata = {
      name: name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId && parentId !== "root" ? [parentId] : undefined,
    }

    const res = await fetch(`${DRIVE_API}/files?fields=id,name,mimeType,modifiedTime,webViewLink`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.error?.message ?? "Create folder failed" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Create folder error" }, { status: 500 })
  }
}

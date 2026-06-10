import { NextRequest, NextResponse } from "next/server"

const DRIVE_API = "https://www.googleapis.com/drive/v3"

async function getValidAccessToken(request: NextRequest): Promise<string | null> {
  const accessToken = request.cookies.get("google_access_token")?.value
  if (accessToken) return accessToken

  const refreshToken = request.cookies.get("google_refresh_token")?.value
  if (!refreshToken) return null

  // Intentar refrescar el token
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const folderId = searchParams.get("folderId") ?? "root"
  const pageToken = searchParams.get("pageToken") ?? ""
  const query = searchParams.get("q") ?? ""

  const accessToken = await getValidAccessToken(request)
  if (!accessToken) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  const params = new URLSearchParams({
    fields: "nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink,parents,thumbnailLink,shared)",
    orderBy: "folder,name",
    pageSize: "50",
    q: query || `'${folderId}' in parents and trashed=false`,
  })
  if (pageToken) params.set("pageToken", pageToken)

  const res = await fetch(`${DRIVE_API}/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const err = await res.json()
    return NextResponse.json({ error: err.error?.message ?? "Drive API error" }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}

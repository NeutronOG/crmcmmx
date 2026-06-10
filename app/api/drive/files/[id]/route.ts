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

// DELETE - Eliminar archivo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = await getValidAccessToken(request)
  if (!accessToken) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  const { id } = await params

  try {
    const res = await fetch(`${DRIVE_API}/files/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.error?.message ?? "Delete failed" }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Delete error" }, { status: 500 })
  }
}

// PATCH - Actualizar archivo (renombrar, mover)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = await getValidAccessToken(request)
  if (!accessToken) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { name, addParents, removeParents } = body

    const updates: Record<string, unknown> = {}
    if (name) updates.name = name

    const searchParams = new URLSearchParams()
    if (addParents) searchParams.set("addParents", addParents)
    if (removeParents) searchParams.set("removeParents", removeParents)

    const url = `${DRIVE_API}/files/${id}${searchParams.toString() ? `?${searchParams}` : ""}`

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: Object.keys(updates).length > 0 ? JSON.stringify(updates) : undefined,
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.error?.message ?? "Update failed" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Update error" }, { status: 500 })
  }
}

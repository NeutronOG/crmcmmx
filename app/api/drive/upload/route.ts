import { NextRequest, NextResponse } from "next/server"

const DRIVE_API = "https://www.googleapis.com/upload/drive/v3"

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

export async function POST(request: NextRequest) {
  const accessToken = await getValidAccessToken(request)
  if (!accessToken) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folderId = formData.get("folderId") as string || "root"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Crear metadata del archivo
    const metadata = {
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      parents: folderId !== "root" ? [folderId] : undefined,
    }

    // Crear boundary para multipart
    const boundary = "-------314159265358979323846"
    const delimiter = "\r\n--" + boundary + "\r\n"
    const close_delim = "\r\n--" + boundary + "--"

    const metadataPart = `Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`
    
    const fileBuffer = await file.arrayBuffer()
    const filePart = `Content-Type: ${file.type || "application/octet-stream"}\r\n\r\n`

    const multipartBody = 
      delimiter + metadataPart + 
      delimiter + filePart

    const body = new Uint8Array(
      multipartBody.length + fileBuffer.byteLength + close_delim.length
    )
    
    let offset = 0
    for (let i = 0; i < multipartBody.length; i++) {
      body[offset++] = multipartBody.charCodeAt(i)
    }
    
    const fileArray = new Uint8Array(fileBuffer)
    body.set(fileArray, offset)
    offset += fileArray.length
    
    for (let i = 0; i < close_delim.length; i++) {
      body[offset++] = close_delim.charCodeAt(i)
    }

    const res = await fetch(`${DRIVE_API}/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary="${boundary}"`,
      },
      body,
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.error?.message ?? "Upload failed" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Upload error" }, { status: 500 })
  }
}

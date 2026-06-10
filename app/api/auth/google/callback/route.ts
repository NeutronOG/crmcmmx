import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/drive?error=${error ?? "no_code"}`, request.url)
    )
  }

  // Verificar que las variables de entorno existan
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    console.error("Missing env vars:", { clientId: !!clientId, clientSecret: !!clientSecret, redirectUri: !!redirectUri })
    return NextResponse.redirect(
      new URL("/drive?error=missing_env_vars", request.url)
    )
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenRes.ok) {
      const errorData = await tokenRes.json()
      console.error("Token exchange error:", errorData)
      throw new Error(errorData.error_description || errorData.error || "Token exchange failed")
    }

    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      throw new Error("No access token received")
    }

    // Redirect with tokens encoded in fragment (never in URL query for security)
    const redirectUrl = new URL("/drive", request.url)
    redirectUrl.searchParams.set("connected", "1")

    const response = NextResponse.redirect(redirectUrl)

    // Store tokens in secure HttpOnly cookies
    response.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: tokens.expires_in ?? 3600,
      path: "/",
    })

    if (tokens.refresh_token) {
      response.cookies.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      })
    }

    return response
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "token_exchange_failed"
    console.error("Callback error:", errorMsg)
    return NextResponse.redirect(
      new URL(`/drive?error=${encodeURIComponent(errorMsg)}`, request.url)
    )
  }
}

"use client"

import { Button } from "@/components/ui/button"
import { HardDrive } from "lucide-react"

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export function DriveConnect() {
  const handleConnect = () => {
    if (!CLIENT_ID) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID no configurado")
      return
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: `${window.location.origin}/api/auth/google/callback`,
      response_type: "code",
      scope: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata",
      ].join(" "),
      access_type: "offline",
      prompt: "consent",
    })

    window.location.href = `https://accounts.google.com/o/oauth2/auth?${params}`
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
        <HardDrive className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Conecta tu Google Drive</h2>
        <p className="text-muted-foreground max-w-sm">
          Vincula tu cuenta de Google para explorar y gestionar archivos directamente desde el CRM.
        </p>
      </div>
      <Button size="lg" className="gap-2" onClick={handleConnect}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.28 3l5.72 9.9L6.28 3zm11.44 0L12 12.9 17.72 3zM2 17l4.28-7.42L2 17zm19.72 0L18 9.58 13.72 17H21.72zM8.14 17L12 10.3 15.86 17H8.14z"
          />
        </svg>
        Conectar con Google Drive
      </Button>
    </div>
  )
}

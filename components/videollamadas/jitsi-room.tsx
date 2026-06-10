"use client"

import { useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JitsiMeetExternalAPI: any
  }
}

interface JitsiRoomProps {
  roomId: string
  roomName: string
  displayName: string
  onClose: () => void
}

export function JitsiRoom({ roomId, roomName, displayName, onClose }: JitsiRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)

  const initJitsi = useCallback(() => {
    if (!containerRef.current) return
    if (apiRef.current) return // ya inicializado

    try {
      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName: roomId,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: {
          displayName,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          enableInsecureRoomNameWarning: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "desktop", "fullscreen",
            "fodeviceselection", "hangup", "chat",
            "tileview", "videoquality", "filmstrip",
          ],
        },
      })

      apiRef.current.addEventListener("videoConferenceJoined", () => {
        // joined successfully
      })
      apiRef.current.addEventListener("readyToClose", () => {
        onClose()
      })
    } catch (err) {
      setError("No se pudo iniciar la videollamada. Por favor recarga la página.")
    }
  }, [roomId, displayName, onClose])

  useEffect(() => {
    const loadScript = () => {
      if (window.JitsiMeetExternalAPI) {
        initJitsi()
        return
      }

      // Evitar cargar el script dos veces
      if (document.querySelector('script[data-jitsi]')) {
        // Esperar a que cargue
        const interval = setInterval(() => {
          if (window.JitsiMeetExternalAPI) {
            clearInterval(interval)
            initJitsi()
          }
        }, 200)
        return
      }

      const script = document.createElement("script")
      script.src = "https://meet.jit.si/external_api.js"
      script.async = true
      script.setAttribute("data-jitsi", "true")
      script.onload = () => initJitsi()
      script.onerror = () => {
        setError("No se pudo cargar el servicio de videollamadas. Verifica tu conexión a internet.")
      }
      document.head.appendChild(script)
    }

    loadScript()

    return () => {
      if (apiRef.current) {
        try { apiRef.current.dispose() } catch { /* ignore */ }
        apiRef.current = null
      }
    }
  }, [initJitsi])

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-satin-red animate-pulse" />
          <span className="font-semibold text-sm text-foreground">{roomName}</span>
          <span className="text-xs text-muted-foreground">· Videollamada en curso</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground gap-1.5"
        >
          <X className="size-4" />
          Salir de la sala
        </Button>
      </div>

      {/* Jitsi container */}
      <div className="flex-1 relative overflow-hidden">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={onClose}>Cerrar</Button>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { HardDrive, LogOut } from "lucide-react"

interface DriveHeaderProps {
  isConnected: boolean
  onDisconnect: () => void
}

export function DriveHeader({ isConnected, onDisconnect }: DriveHeaderProps) {
  return (
    <div className="border-b border-border/40 backdrop-blur-xl bg-background/60 sticky top-[72px] z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Google Drive</span>
            {isConnected && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Conectado
              </span>
            )}
          </div>
          {isConnected && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={onDisconnect}
            >
              <LogOut className="w-4 h-4" />
              Desconectar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

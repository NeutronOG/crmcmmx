"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { LiquidBackground } from "@/components/liquid-background"
import { IdeaRoomList } from "@/components/idea-room/idea-room-list"
import { IdeaRoomChat } from "@/components/idea-room/idea-room-chat"
import type { IdeaRoom } from "@/lib/store"

export default function IdeaRoomPage() {
  const [selectedRoom, setSelectedRoom] = useState<IdeaRoom | null>(null)

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />

      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto p-6 space-y-6 pb-20">
          <div className="space-y-3 pt-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance text-foreground">
              Idea Room
            </h1>
            <p className="text-lg text-muted-foreground/90">
              Espacios colaborativos para brainstorming y creatividad
            </p>
          </div>

          <div className="max-w-4xl">
            {selectedRoom ? (
              <IdeaRoomChat room={selectedRoom} onBack={() => setSelectedRoom(null)} />
            ) : (
              <IdeaRoomList onSelectRoom={setSelectedRoom} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

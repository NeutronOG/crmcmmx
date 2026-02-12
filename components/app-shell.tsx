"use client"

import { AuthProvider } from "@/components/auth-provider"
import { AuthGuard } from "@/components/auth-guard"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  )
}

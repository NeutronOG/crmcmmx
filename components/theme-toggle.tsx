"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-9 hover:bg-white/10">
        <Sun className="size-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-300"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="size-4 text-yellow-400 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="size-4 text-slate-700 transition-transform duration-300 rotate-0 scale-100" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}

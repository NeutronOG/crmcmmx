"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Users, Briefcase, Target, DollarSign, Sparkles, FileText, Palette, Video, Percent, UserCheck, ChevronDown, ChevronRight, ClipboardCheck, LogOut, Lightbulb, Calendar, Menu, X, LayoutDashboard, BarChart3 } from "lucide-react"
import { NotificacionesBell } from "@/components/notificaciones/notificaciones-bell"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { rolesLabels } from "@/lib/auth"
import type { Seccion } from "@/lib/auth"

type NavItem = {
  label: string
  href?: string
  icon: React.ReactNode
  seccion?: Seccion
  children?: { label: string; href: string; icon: React.ReactNode; seccion: Seccion }[]
}

export function DashboardHeader() {
  const { usuario, logout, tieneAcceso } = useAuth()
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const can = (seccion: Seccion) => tieneAcceso(seccion)

  const initials = usuario
    ? usuario.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "?"

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setExpandedGroup(null) }, [pathname])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setExpandedGroup(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/", icon: <LayoutDashboard className="size-4" /> },
    {
      label: "Negocio",
      icon: <Sparkles className="size-4" />,
      children: [
        { label: "Oportunidades", href: "/nuevo-negocio", icon: <Sparkles className="size-4" />, seccion: "nuevo_negocio" },
        { label: "Cotizaciones", href: "/cotizaciones", icon: <FileText className="size-4" />, seccion: "cotizaciones" },
        { label: "Leads", href: "/leads", icon: <Target className="size-4" />, seccion: "leads" },
        { label: "Clientes", href: "/clients", icon: <Users className="size-4" />, seccion: "clientes" },
      ],
    },
    {
      label: "Producción",
      icon: <Palette className="size-4" />,
      children: [
        { label: "Proyectos", href: "/projects", icon: <Briefcase className="size-4" />, seccion: "proyectos" },
        { label: "Creadores", href: "/creadores", icon: <Video className="size-4" />, seccion: "creadores" },
        { label: "Responsables", href: "/responsables", icon: <UserCheck className="size-4" />, seccion: "responsables" },
        { label: "Tareas", href: "/tareas", icon: <ClipboardCheck className="size-4" />, seccion: "tareas" },
      ],
    },
    { label: "Idea Room", href: "/idea-room", icon: <Lightbulb className="size-4" />, seccion: "idea_room" },
    { label: "Calendario", href: "/calendario", icon: <Calendar className="size-4" />, seccion: "calendario" },
    {
      label: "Finanzas",
      icon: <DollarSign className="size-4" />,
      children: [
        { label: "Facturación", href: "/invoices", icon: <DollarSign className="size-4" />, seccion: "facturacion" },
        { label: "Nómina", href: "/nomina", icon: <Percent className="size-4" />, seccion: "nomina" },
      ],
    },
    { label: "Reportes", href: "/reports", icon: <BarChart3 className="size-4" />, seccion: "reportes" },
  ]

  // Filter items by permission
  const visibleItems = navItems.filter(item => {
    if (item.seccion && !can(item.seccion)) return false
    if (item.children) {
      const visibleChildren = item.children.filter(c => can(c.seccion))
      return visibleChildren.length > 0
    }
    return true
  })

  const isActive = (href?: string) => href === pathname

  const toggleGroup = (label: string) => {
    setExpandedGroup(prev => prev === label ? null : label)
  }

  return (
    <div className="sticky top-0 z-50 w-full px-3 sm:px-4 pt-3" ref={navRef}>
      {/* ===== DYNAMIC ISLAND ===== */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-background/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg shadow-black/20 transition-all duration-500">
          {/* Main bar */}
          <div className="flex items-center justify-between h-14 px-4">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image 
                src={theme === "light" ? "/LOGOTIPO_CMMX_DARK.png" : "/Diseño sin título (20).png"} 
                alt="Central Marketing" 
                width={180} 
                height={40} 
                className="h-8 w-auto hidden sm:block" 
                priority 
              />
              <span className="sm:hidden font-bold text-sm text-foreground">CM</span>
            </Link>

            {/* Center: Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 mx-4">
              {visibleItems.map((item) => {
                if (item.href && !item.children) {
                  return (
                    <Link key={item.label} href={item.href}>
                      <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                        isActive(item.href)
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                      }`}>
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    </Link>
                  )
                }

                if (item.children) {
                  const visibleChildren = item.children.filter(c => can(c.seccion))
                  const isGroupActive = visibleChildren.some(c => pathname === c.href)
                  const isExpanded = expandedGroup === item.label

                  return (
                    <div key={item.label} className="relative">
                      <button
                        onClick={() => toggleGroup(item.label)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                          isGroupActive
                            ? "bg-primary/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        <ChevronDown className={`size-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {/* Dropdown */}
                      {isExpanded && (
                        <div className="absolute top-full left-0 mt-2 py-1.5 min-w-[180px] bg-popover border border-border rounded-xl shadow-xl shadow-black/30 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                          {visibleChildren.map((child) => (
                            <Link key={child.href} href={child.href} onClick={() => setExpandedGroup(null)}>
                              <div className={`flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                pathname === child.href
                                  ? "bg-primary/10 text-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                              }`}>
                                {child.icon}
                                {child.label}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <ThemeToggle />
              <NotificacionesBell />

              {/* Avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleGroup("__user__")}
                  className="relative size-8 rounded-full hover:ring-2 hover:ring-white/30 transition-all duration-300"
                >
                  <Avatar className="size-8 ring-2 ring-white/20">
                    <AvatarFallback className="bg-white text-black font-bold text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </button>

                {expandedGroup === "__user__" && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl shadow-black/30 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                    <div className="px-3 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{usuario?.nombre}</p>
                      <p className="text-xs text-white/50">{usuario?.email}</p>
                      {usuario && (
                        <Badge variant="outline" className="mt-1.5 rounded-full text-[10px] border-white/20 text-white/70">
                          {rolesLabels[usuario.rol]}
                        </Badge>
                      )}
                    </div>
                    <div className="py-1.5">
                      <button
                        onClick={() => { logout(); setExpandedGroup(null) }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium satin-red hover:satin-red-bg transition-colors"
                      >
                        <LogOut className="size-3.5" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => { setMobileOpen(!mobileOpen); setExpandedGroup(null) }}
                className="lg:hidden flex items-center justify-center size-8 rounded-xl hover:bg-muted/50 transition-all duration-300"
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

          {/* ===== MOBILE EXPANDED MENU ===== */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-border/40 animate-in slide-in-from-top-1 duration-300">
              <nav className="p-3 space-y-1 max-h-[70vh] overflow-y-auto">
                {visibleItems.map((item) => {
                  if (item.href && !item.children) {
                    return (
                      <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}>
                        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}>
                          {item.icon}
                          {item.label}
                        </div>
                      </Link>
                    )
                  }

                  if (item.children) {
                    const visibleChildren = item.children.filter(c => can(c.seccion))
                    const isGroupActive = visibleChildren.some(c => pathname === c.href)
                    const isExpanded = expandedGroup === item.label

                    return (
                      <div key={item.label}>
                        <button
                          onClick={() => toggleGroup(item.label)}
                          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isGroupActive
                              ? "bg-white/10 text-white"
                              : "text-white/50 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            {item.label}
                          </div>
                          <ChevronRight className={`size-3.5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                        </button>

                        {isExpanded && (
                          <div className="ml-4 mt-1 space-y-0.5 pl-4 border-l-2 border-white/10 animate-in slide-in-from-top-1 duration-200">
                            {visibleChildren.map((child) => (
                              <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)}>
                                <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                  pathname === child.href
                                    ? "bg-white/10 text-white"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                }`}>
                                  {child.icon}
                                  {child.label}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return null
                })}

                {/* Mobile user section */}
                <div className="pt-2 mt-2 border-t border-white/10">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="size-8 ring-2 ring-white/20">
                      <AvatarFallback className="bg-white text-black font-bold text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">{usuario?.nombre}</p>
                      <p className="text-[10px] text-white/50">{usuario?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false) }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium satin-red hover:satin-red-bg transition-colors"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

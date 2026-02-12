// Sistema de autenticación y roles para Central Marketing
// Conectado a Supabase

import { supabase } from './supabase'

export type Rol =
  | "admin"
  | "dueno"
  | "diseñador_grafico"
  | "diseñador_industrial"
  | "produccion_audiovisual"
  | "produccion_activaciones"
  | "marketing_digital"
  | "auxiliar_marketing"
  | "creador_contenido"
  | "creador_parrilla"
  | "administracion"
  | "influencer"
  | "freelancer"

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
  avatar?: string
}

export const rolesLabels: Record<Rol, string> = {
  admin: "Administrador",
  dueno: "Dueño",
  diseñador_grafico: "Diseñador Gráfico",
  diseñador_industrial: "Diseñador Industrial",
  produccion_audiovisual: "Producción Audiovisual",
  produccion_activaciones: "Producción de Activaciones",
  marketing_digital: "Marketing Digital",
  auxiliar_marketing: "Auxiliar de Marketing",
  creador_contenido: "Creador de Contenido",
  creador_parrilla: "Creador de Parrilla",
  administracion: "Administración",
  influencer: "Influencer",
  freelancer: "Freelancer",
}

// Secciones del CRM
export type Seccion =
  | "dashboard"
  | "nuevo_negocio"
  | "cotizaciones"
  | "leads"
  | "clientes"
  | "proyectos"
  | "creadores"
  | "responsables"
  | "tareas"
  | "facturacion"
  | "nomina"
  | "reportes"
  | "comunicaciones"
  | "mi_panel"
  | "mi_empresa"
  | "idea_room"
  | "calendario"

export const seccionesLabels: Record<Seccion, string> = {
  dashboard: "Dashboard",
  nuevo_negocio: "Nuevo Negocio",
  cotizaciones: "Cotizaciones",
  leads: "Leads",
  clientes: "Clientes",
  proyectos: "Proyectos",
  creadores: "Creadores de Contenido",
  responsables: "Responsables",
  tareas: "Tareas y Evidencias",
  facturacion: "Facturación",
  nomina: "Nómina y Porcentajes",
  reportes: "Reportes",
  comunicaciones: "Comunicaciones",
  mi_panel: "Mi Panel",
  mi_empresa: "Mi Empresa",
  idea_room: "Idea Room",
  calendario: "Calendario",
}

// Mapa de permisos: qué secciones puede ver cada rol
export const permisosPorRol: Record<Rol, Seccion[]> = {
  admin: [
    "dashboard", "nuevo_negocio", "cotizaciones", "leads", "clientes",
    "proyectos", "creadores", "responsables", "tareas",
    "facturacion", "nomina", "reportes", "comunicaciones",
    "idea_room", "calendario",
  ],
  dueno: [
    "mi_empresa",
    "creadores",
  ],
  diseñador_grafico: [
    "mi_panel",
  ],
  diseñador_industrial: [
    "mi_panel",
  ],
  produccion_audiovisual: [
    "mi_panel",
  ],
  produccion_activaciones: [
    "mi_panel",
  ],
  marketing_digital: [
    "mi_panel",
  ],
  auxiliar_marketing: [
    "mi_panel",
  ],
  creador_contenido: [
    "mi_panel",
  ],
  creador_parrilla: [
    "mi_panel",
  ],
  administracion: [
    "mi_panel",
  ],
  influencer: [
    "mi_panel",
  ],
  freelancer: [
    "mi_panel",
  ],
}

// Mapa de sección a ruta
export const seccionRutas: Record<Seccion, string> = {
  dashboard: "/",
  nuevo_negocio: "/nuevo-negocio",
  cotizaciones: "/cotizaciones",
  leads: "/leads",
  clientes: "/clients",
  proyectos: "/projects",
  creadores: "/creadores",
  responsables: "/responsables",
  tareas: "/tareas",
  facturacion: "/invoices",
  nomina: "/nomina",
  reportes: "/reports",
  comunicaciones: "/communications",
  mi_panel: "/mi-panel",
  mi_empresa: "/mi-empresa",
  idea_room: "/idea-room",
  calendario: "/calendario",
}

// Mapa inverso: ruta a sección
export const rutaSeccion: Record<string, Seccion> = Object.entries(seccionRutas).reduce(
  (acc, [seccion, ruta]) => {
    acc[ruta] = seccion as Seccion
    return acc
  },
  {} as Record<string, Seccion>
)

// =============================================
// Obtener usuarios desde Supabase
// =============================================

export async function getUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('nombre')
  if (error) {
    console.error('Error fetching usuarios:', error)
    return []
  }
  return (data || []).map(row => ({
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    rol: row.rol as Rol,
    avatar: row.avatar || undefined,
  }))
}

// Funciones de autenticación con localStorage (sesión local)
const AUTH_KEY = "crm_auth_user"

export function getUsuarioActual(): Usuario | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function login(usuario: Usuario): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_KEY, JSON.stringify(usuario))
  window.dispatchEvent(new CustomEvent("crm-auth-changed"))
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_KEY)
  window.dispatchEvent(new CustomEvent("crm-auth-changed"))
}

export function tienePermiso(rol: Rol, seccion: Seccion): boolean {
  return permisosPorRol[rol]?.includes(seccion) ?? false
}

export function getSeccionesPermitidas(rol: Rol): Seccion[] {
  return permisosPorRol[rol] ?? []
}

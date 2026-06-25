// Sistema de autenticación y roles para Central Marketing
// Conectado a Supabase

import { supabase } from './supabase'

export type Rol =
  | "admin"
  | "dueno"
  // --- Dirección / Cuentas ---
  | "director_cuentas"
  | "coord_cuentas"
  | "admon_finanzas"
  | "legal"
  // --- Marketing ---
  | "coord_mkt"
  | "aux_mkt"
  | "practicante_mkt"
  | "ejecutivo_cuenta"
  // --- Producción Audiovisual ---
  | "dir_produccion"
  | "produccion_audiovisual"
  | "produccion_activaciones"
  // --- Creativa Cédula 1 ---
  | "dir_creativa_1"
  | "disenador"
  | "diseñador_grafico"
  | "diseñador_industrial"
  // --- Creativa Cédula 2 ---
  | "dir_creativa_2"
  // --- Otros ---
  | "coord_diseno"
  | "contabilidad"
  | "ia"
  | "marketing_digital"
  | "auxiliar_marketing"
  | "creador_contenido"
  | "creador_parrilla"
  | "administracion"
  | "tareas"
  | "influencer"
  | "freelancer"

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
  avatar?: string
  password?: string
}

export const rolesLabels: Record<Rol, string> = {
  admin: "Administrador",
  dueno: "Director General",
  director_cuentas: "Director de Cuentas",
  coord_cuentas: "Coordinadora de Cuentas",
  admon_finanzas: "Admon y Finanzas",
  legal: "Legal",
  coord_mkt: "Coordinadora de Marketing",
  aux_mkt: "Auxiliar de Marketing",
  practicante_mkt: "Practicante de Marketing",
  ejecutivo_cuenta: "Ejecutivo de Cuenta",
  dir_produccion: "Directora de Producción Audiovisual",
  produccion_audiovisual: "Producción Audiovisual",
  produccion_activaciones: "Producción de Activaciones",
  dir_creativa_1: "Directora Creativa Cédula 1",
  disenador: "Diseñador",
  diseñador_grafico: "Diseñador Gráfico",
  diseñador_industrial: "Diseñador Industrial",
  dir_creativa_2: "Directora Creativa Cédula 2",
  coord_diseno: "Coordinador de Diseño",
  contabilidad: "Contabilidad",
  ia: "IA",
  marketing_digital: "Marketing Digital",
  auxiliar_marketing: "Auxiliar de Marketing",
  creador_contenido: "Creador de Contenido",
  creador_parrilla: "Creador de Parrilla",
  administracion: "Administración",
  tareas: "Tareas",
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
  | "videollamadas"
  | "drive"
  | "metricool"

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
  videollamadas: "Videollamadas",
  drive: "Google Drive",
  metricool: "Metricool",
}

// Mapa de permisos: qué secciones puede ver cada rol
export const permisosPorRol: Record<Rol, Seccion[]> = {
  admin: [
    "dashboard", "nuevo_negocio", "cotizaciones", "leads", "clientes",
    "proyectos", "creadores", "responsables", "tareas",
    "facturacion", "nomina", "reportes", "comunicaciones",
    "idea_room", "calendario", "mi_empresa", "videollamadas",
    "drive", "metricool",
  ],
  // Guillermo — ve todo incluyendo carga global
  dueno: [
    "dashboard", "reportes", "facturacion", "nomina",
    "clientes", "proyectos", "cotizaciones", "leads",
    "responsables", "tareas",
    "mi_empresa", "calendario", "idea_room", "videollamadas",
    "drive", "metricool",
  ],
  // Felipe — Director de Cuentas — ve carga global
  director_cuentas: [
    "dashboard", "leads", "clientes", "proyectos", "cotizaciones",
    "nuevo_negocio", "tareas", "responsables",
    "calendario", "comunicaciones", "idea_room", "videollamadas",
    "drive", "metricool",
  ],
  // Móni — Coordinadora de Cuentas — ve carga global
  coord_cuentas: [
    "dashboard", "leads", "clientes", "proyectos", "cotizaciones",
    "nuevo_negocio", "tareas", "responsables",
    "calendario", "comunicaciones", "idea_room", "videollamadas",
    "drive", "metricool",
  ],
  // Ian — Admon y Finanzas — solo ve su panel
  admon_finanzas: [
    "dashboard", "facturacion", "nomina", "reportes", "clientes", "calendario", "videollamadas",
  ],
  // Alexis — Legal — solo ve su panel
  legal: [
    "dashboard", "clientes", "proyectos", "calendario", "videollamadas",
  ],
  // Paloma Rivera — Coord Marketing — ve solo su equipo de marketing
  coord_mkt: [
    "dashboard", "leads", "clientes", "proyectos", "tareas",
    "cotizaciones", "nuevo_negocio", "responsables",
    "calendario", "comunicaciones", "idea_room", "creadores", "videollamadas",
    "drive", "metricool",
  ],
  // Lesly — Auxiliar de Marketing
  aux_mkt: [
    "dashboard", "tareas", "proyectos", "calendario", "comunicaciones", "idea_room", "videollamadas",
    "drive", "metricool",
  ],
  // Emiliano, Jorge, Allison — Practicantes de Marketing
  practicante_mkt: [
    "mi_panel", "tareas", "calendario",
  ],
  // Estefanía — Directora Producción Audiovisual — ve su equipo
  dir_produccion: [
    "dashboard", "proyectos", "tareas", "clientes",
    "responsables", "calendario", "idea_room", "comunicaciones", "videollamadas",
    "drive",
  ],
  // Paloma Pliego — Directora Creativa Cédula 1 — ve su equipo (Vicente, Clarissa)
  dir_creativa_1: [
    "dashboard", "proyectos", "tareas", "clientes",
    "responsables", "calendario", "idea_room", "comunicaciones", "videollamadas",
    "drive",
  ],
  // Dalet — Directora Creativa Cédula 2 — ve su equipo (Ana Paola, Ana Luisa, Daniel)
  dir_creativa_2: [
    "dashboard", "proyectos", "tareas", "clientes",
    "responsables", "calendario", "idea_room", "comunicaciones", "videollamadas",
    "drive",
  ],
  ejecutivo_cuenta: [
    "dashboard", "leads", "clientes", "proyectos", "cotizaciones",
    "nuevo_negocio", "tareas", "calendario", "comunicaciones", "idea_room", "videollamadas",
    "drive", "metricool",
  ],
  coord_diseno: [
    "dashboard", "proyectos", "tareas", "clientes",
    "calendario", "idea_room", "comunicaciones", "videollamadas",
    "drive", "metricool",
  ],
  contabilidad: [
    "dashboard", "facturacion", "nomina", "reportes", "clientes", "calendario", "videollamadas",
  ],
  ia: [
    "dashboard", "tareas", "proyectos", "idea_room", "calendario", "videollamadas",
  ],
  produccion_audiovisual: ["mi_panel", "tareas", "calendario"],
  produccion_activaciones: ["mi_panel", "tareas", "calendario"],
  disenador: ["mi_panel", "tareas", "calendario"],
  diseñador_grafico: ["mi_panel", "tareas", "calendario"],
  diseñador_industrial: ["mi_panel", "tareas", "calendario"],
  marketing_digital: ["mi_panel"],
  auxiliar_marketing: ["mi_panel"],
  creador_contenido: ["mi_panel"],
  creador_parrilla: ["mi_panel"],
  administracion: [
    "dashboard", "clientes", "proyectos", "responsables",
    "calendario", "idea_room", "reportes", "leads", "mi_empresa", "videollamadas",
  ],
  tareas: ["mi_panel"],
  influencer: ["mi_panel"],
  freelancer: ["mi_panel"],
}

// =============================================
// VISIBILIDAD DE CARGA LABORAL POR ROL
// =============================================

// Roles que pueden ver la carga de TODO el equipo (Guillermo, Felipe, Móni + admin)
export const ROLES_CARGA_GLOBAL: Rol[] = ["admin", "dueno", "director_cuentas", "coord_cuentas"]

// Equipos por director — mapea rol → nombres exactos en Supabase de su área
export const equipoPorRol: Partial<Record<Rol, string[]>> = {
  // Paloma Rivera — Coordinadora de Marketing: Lesly, Emiliano, Jorge, Allison + Fani Ramos (Producción)
  coord_mkt: ["Lesly", "Emiliano", "Jorge", "Allison", "Fani Ramos"],
  // Fani Ramos — Dir. Producción Audiovisual: ve su propio equipo si tuviera subordinados
  dir_produccion: [],  // Si Fani Ramos tuviera gente a su cargo, agregar aquí
  // Paloma Pliego — Dir. Creativa Cédula 1: Vicente, Clarissa
  dir_creativa_1: ["Vicente", "Clarissa"],
  // Dalet — Dir. Creativa Cédula 2: Ana Paola, Ana Luisa, Daniel
  dir_creativa_2: ["Ana Paola", "Ana Luisa", "Daniel"],
}

/**
 * Devuelve true si el rol puede ver la carga laboral completa de todo el equipo.
 */
export function puedeVerCargaGlobal(rol: Rol): boolean {
  return ROLES_CARGA_GLOBAL.includes(rol)
}

/**
 * Devuelve los nombres de los miembros del equipo que un rol puede ver en carga laboral.
 * Si el rol tiene acceso global, devuelve null (significa: mostrar todos).
 * Si el rol tiene equipo propio definido, devuelve esos nombres.
 * Si no tiene equipo, devuelve array vacío (solo se ve a sí mismo).
 */
export function getEquipoVisible(rol: Rol, nombrePropio: string): string[] | null {
  if (puedeVerCargaGlobal(rol)) return null // null = todos
  const equipo = equipoPorRol[rol]
  if (equipo !== undefined) {
    // Directores de área ven su equipo (sin incluirse a sí mismos en la lista de subordinados)
    return equipo
  }
  // Cualquier otro rol solo se ve a sí mismo
  return [nombrePropio]
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
  videollamadas: "/videollamadas",
  drive: "/drive",
  metricool: "/metricool",
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
    .abortSignal(new AbortController().signal)
  
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
    password: row.password || undefined,
  }))
}

export async function updateUsuarioPerfil(id: string, updates: { password?: string; avatar?: string }): Promise<void> {
  const payload: Record<string, string> = {}
  if (updates.password !== undefined) payload.password = updates.password
  if (updates.avatar !== undefined) payload.avatar = updates.avatar
  const { error } = await supabase.from('usuarios').update(payload).eq('id', id)
  if (error) throw error
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

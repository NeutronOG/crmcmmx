// Store centralizado para datos del CRM
// Conectado a Supabase — todas las funciones son async

import { supabase } from './supabase'

// =============================================
// INTERFACES (compatibles con la UI existente)
// =============================================

export interface Cliente {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  estado: "Activo" | "Inactivo" | "Prospecto" | "En Onboarding"
  etapaOnboarding: "Bienvenida" | "Documentación" | "Configuración" | "Capacitación" | "Completado"
  valorMensual: number
  fechaInicio: string
  ultimoContacto: string
  responsable: string
  notas: string
}

export interface Lead {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  origen: string
  estado: "Nuevo" | "Contactado" | "Calificado" | "Propuesta" | "Negociación" | "Ganado" | "Perdido"
  valorEstimado: number
  probabilidad: number
  fechaCreacion: string
  ultimoContacto: string
  responsable: string
  notas: string
}

export interface Proyecto {
  id: string
  nombre: string
  cliente: string
  tipo: string
  estado: "Planificación" | "En Progreso" | "En Revisión" | "Completado" | "Pausado"
  fechaInicio: string
  fechaEntrega: string
  presupuesto: number
  responsable: string
  progreso: number
  descripcion: string
}

export interface Empleado {
  id: string
  nombre: string
  email: string
  rol: string
  salarioBase: number
  porcentajeComision: number
  estado: "Activo" | "Inactivo"
  fechaIngreso: string
  proyectosActivos: number
}

export interface Cotizacion {
  id: string
  cliente: string
  proyecto: string
  valor: number
  estado: "Borrador" | "Enviada" | "En Negociación" | "Aprobada" | "Rechazada"
  fechaCreacion: string
  fechaVencimiento: string
  seguimientos: number
  responsable: string
}

export interface OnboardingClient {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  etapa: "Bienvenida" | "Documentación" | "Kickoff" | "Activo"
  progreso: number
  fechaInicio: string
  responsable: string
  siguientePaso: string
  briefCompletado: boolean
  kickoffAgendado: boolean
  documentosRecibidos: boolean
  proyectoCreado: boolean
}

export interface Evidencia {
  id: string
  tareaId?: string
  nombre: string
  tipo: "imagen" | "archivo"
  url: string
  fechaSubida: string
  tamaño: number
}

export interface Tarea {
  id: string
  titulo: string
  descripcion: string
  proyecto: string
  cliente: string
  asignado: string
  estado: "Pendiente" | "En Progreso" | "En Revisión" | "Completada"
  prioridad: "Alta" | "Media" | "Baja"
  fechaCreacion: string
  fechaVencimiento: string
  fechaCompletada: string
  evidencias: Evidencia[]
  etiquetas: string[]
}

// =============================================
// MAPPERS: DB row <-> App interface
// =============================================

function mapCliente(row: any): Cliente {
  return {
    id: row.id,
    nombre: row.nombre,
    empresa: row.empresa,
    email: row.email,
    telefono: row.telefono || '',
    estado: row.estado,
    etapaOnboarding: row.etapa_onboarding || 'Bienvenida',
    valorMensual: Number(row.valor_mensual) || 0,
    fechaInicio: row.fecha_inicio || '',
    ultimoContacto: row.ultimo_contacto || '',
    responsable: row.responsable || '',
    notas: row.notas || '',
  }
}

function mapLead(row: any): Lead {
  return {
    id: row.id,
    nombre: row.nombre,
    empresa: row.empresa,
    email: row.email,
    telefono: row.telefono || '',
    origen: row.origen || '',
    estado: row.estado,
    valorEstimado: Number(row.valor_estimado) || 0,
    probabilidad: Number(row.probabilidad) || 0,
    fechaCreacion: row.fecha_creacion || '',
    ultimoContacto: row.ultimo_contacto || '',
    responsable: row.responsable || '',
    notas: row.notas || '',
  }
}

function mapProyecto(row: any): Proyecto {
  return {
    id: row.id,
    nombre: row.nombre,
    cliente: row.cliente || '',
    tipo: row.tipo || '',
    estado: row.estado,
    fechaInicio: row.fecha_inicio || '',
    fechaEntrega: row.fecha_entrega || '',
    presupuesto: Number(row.presupuesto) || 0,
    responsable: row.responsable || '',
    progreso: Number(row.progreso) || 0,
    descripcion: row.descripcion || '',
  }
}

function mapEmpleado(row: any): Empleado {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    rol: row.rol || '',
    salarioBase: Number(row.salario_base) || 0,
    porcentajeComision: Number(row.porcentaje_comision) || 0,
    estado: row.estado,
    fechaIngreso: row.fecha_ingreso || '',
    proyectosActivos: Number(row.proyectos_activos) || 0,
  }
}

function mapCotizacion(row: any): Cotizacion {
  return {
    id: row.id,
    cliente: row.cliente || '',
    proyecto: row.proyecto || '',
    valor: Number(row.valor) || 0,
    estado: row.estado,
    fechaCreacion: row.fecha_creacion || '',
    fechaVencimiento: row.fecha_vencimiento || '',
    seguimientos: Number(row.seguimientos) || 0,
    responsable: row.responsable || '',
  }
}

function mapOnboarding(row: any): OnboardingClient {
  return {
    id: row.id,
    nombre: row.nombre,
    empresa: row.empresa,
    email: row.email,
    telefono: row.telefono || '',
    etapa: row.etapa,
    progreso: Number(row.progreso) || 0,
    fechaInicio: row.fecha_inicio || '',
    responsable: row.responsable || '',
    siguientePaso: row.siguiente_paso || '',
    briefCompletado: row.brief_completado || false,
    kickoffAgendado: row.kickoff_agendado || false,
    documentosRecibidos: row.documentos_recibidos || false,
    proyectoCreado: row.proyecto_creado || false,
  }
}

function mapEvidencia(row: any): Evidencia {
  return {
    id: row.id,
    tareaId: row.tarea_id,
    nombre: row.nombre,
    tipo: row.tipo as "imagen" | "archivo",
    url: row.url,
    fechaSubida: row.fecha_subida || '',
    tamaño: Number(row.tamaño) || 0,
  }
}

function mapTarea(row: any, evidencias: Evidencia[] = []): Tarea {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion || '',
    proyecto: row.proyecto || '',
    cliente: row.cliente || '',
    asignado: row.asignado || '',
    estado: row.estado,
    prioridad: row.prioridad,
    fechaCreacion: row.fecha_creacion || '',
    fechaVencimiento: row.fecha_vencimiento || '',
    fechaCompletada: row.fecha_completada || '',
    evidencias,
    etiquetas: row.etiquetas || [],
  }
}

// =============================================
// CLIENTES
// =============================================

export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase.from('clientes').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching clientes:', error); return [] }
  return (data || []).map(mapCliente)
}

export async function addCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
  const { data, error } = await supabase.from('clientes').insert({
    nombre: cliente.nombre,
    empresa: cliente.empresa,
    email: cliente.email,
    telefono: cliente.telefono,
    estado: cliente.estado,
    etapa_onboarding: cliente.etapaOnboarding,
    valor_mensual: cliente.valorMensual,
    fecha_inicio: cliente.fechaInicio || null,
    ultimo_contacto: cliente.ultimoContacto || null,
    responsable: cliente.responsable,
    notas: cliente.notas,
  }).select().single()
  if (error) throw error
  return mapCliente(data)
}

export async function updateCliente(id: string, updates: Partial<Cliente>): Promise<void> {
  const mapped: any = {}
  if (updates.nombre !== undefined) mapped.nombre = updates.nombre
  if (updates.empresa !== undefined) mapped.empresa = updates.empresa
  if (updates.email !== undefined) mapped.email = updates.email
  if (updates.telefono !== undefined) mapped.telefono = updates.telefono
  if (updates.estado !== undefined) mapped.estado = updates.estado
  if (updates.etapaOnboarding !== undefined) mapped.etapa_onboarding = updates.etapaOnboarding
  if (updates.valorMensual !== undefined) mapped.valor_mensual = updates.valorMensual
  if (updates.fechaInicio !== undefined) mapped.fecha_inicio = updates.fechaInicio || null
  if (updates.ultimoContacto !== undefined) mapped.ultimo_contacto = updates.ultimoContacto || null
  if (updates.responsable !== undefined) mapped.responsable = updates.responsable
  if (updates.notas !== undefined) mapped.notas = updates.notas
  const { error } = await supabase.from('clientes').update(mapped).eq('id', id)
  if (error) throw error
}

export async function deleteCliente(id: string): Promise<void> {
  const { error } = await supabase.from('clientes').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// LEADS
// =============================================

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching leads:', error); return [] }
  return (data || []).map(mapLead)
}

export async function addLead(lead: Omit<Lead, 'id'>): Promise<Lead> {
  const { data, error } = await supabase.from('leads').insert({
    nombre: lead.nombre,
    empresa: lead.empresa,
    email: lead.email,
    telefono: lead.telefono,
    origen: lead.origen,
    estado: lead.estado,
    valor_estimado: lead.valorEstimado,
    probabilidad: lead.probabilidad,
    fecha_creacion: lead.fechaCreacion || null,
    ultimo_contacto: lead.ultimoContacto || null,
    responsable: lead.responsable,
    notas: lead.notas,
  }).select().single()
  if (error) throw error
  return mapLead(data)
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<void> {
  const mapped: any = {}
  if (updates.nombre !== undefined) mapped.nombre = updates.nombre
  if (updates.empresa !== undefined) mapped.empresa = updates.empresa
  if (updates.email !== undefined) mapped.email = updates.email
  if (updates.telefono !== undefined) mapped.telefono = updates.telefono
  if (updates.origen !== undefined) mapped.origen = updates.origen
  if (updates.estado !== undefined) mapped.estado = updates.estado
  if (updates.valorEstimado !== undefined) mapped.valor_estimado = updates.valorEstimado
  if (updates.probabilidad !== undefined) mapped.probabilidad = updates.probabilidad
  if (updates.ultimoContacto !== undefined) mapped.ultimo_contacto = updates.ultimoContacto || null
  if (updates.responsable !== undefined) mapped.responsable = updates.responsable
  if (updates.notas !== undefined) mapped.notas = updates.notas
  const { error } = await supabase.from('leads').update(mapped).eq('id', id)
  if (error) throw error
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// PROYECTOS
// =============================================

export async function getProyectos(): Promise<Proyecto[]> {
  const { data, error } = await supabase.from('proyectos').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching proyectos:', error); return [] }
  return (data || []).map(mapProyecto)
}

export async function addProyecto(proyecto: Omit<Proyecto, 'id'>): Promise<Proyecto> {
  const { data, error } = await supabase.from('proyectos').insert({
    nombre: proyecto.nombre,
    cliente: proyecto.cliente,
    tipo: proyecto.tipo,
    estado: proyecto.estado,
    fecha_inicio: proyecto.fechaInicio || null,
    fecha_entrega: proyecto.fechaEntrega || null,
    presupuesto: proyecto.presupuesto,
    responsable: proyecto.responsable,
    progreso: proyecto.progreso,
    descripcion: proyecto.descripcion,
  }).select().single()
  if (error) throw error
  return mapProyecto(data)
}

export async function updateProyecto(id: string, updates: Partial<Proyecto>): Promise<void> {
  const mapped: any = {}
  if (updates.nombre !== undefined) mapped.nombre = updates.nombre
  if (updates.cliente !== undefined) mapped.cliente = updates.cliente
  if (updates.tipo !== undefined) mapped.tipo = updates.tipo
  if (updates.estado !== undefined) mapped.estado = updates.estado
  if (updates.fechaInicio !== undefined) mapped.fecha_inicio = updates.fechaInicio || null
  if (updates.fechaEntrega !== undefined) mapped.fecha_entrega = updates.fechaEntrega || null
  if (updates.presupuesto !== undefined) mapped.presupuesto = updates.presupuesto
  if (updates.responsable !== undefined) mapped.responsable = updates.responsable
  if (updates.progreso !== undefined) mapped.progreso = updates.progreso
  if (updates.descripcion !== undefined) mapped.descripcion = updates.descripcion
  const { error } = await supabase.from('proyectos').update(mapped).eq('id', id)
  if (error) throw error
}

export async function deleteProyecto(id: string): Promise<void> {
  const { error } = await supabase.from('proyectos').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// EMPLEADOS
// =============================================

export async function getEmpleados(): Promise<Empleado[]> {
  const { data, error } = await supabase.from('empleados').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching empleados:', error); return [] }
  return (data || []).map(mapEmpleado)
}

export async function addEmpleado(empleado: Omit<Empleado, 'id'>): Promise<Empleado> {
  const { data, error } = await supabase.from('empleados').insert({
    nombre: empleado.nombre,
    email: empleado.email,
    rol: empleado.rol,
    salario_base: empleado.salarioBase,
    porcentaje_comision: empleado.porcentajeComision,
    estado: empleado.estado,
    fecha_ingreso: empleado.fechaIngreso || null,
    proyectos_activos: empleado.proyectosActivos,
  }).select().single()
  if (error) throw error
  return mapEmpleado(data)
}

export async function updateEmpleado(id: string, updates: Partial<Empleado>): Promise<void> {
  const mapped: any = {}
  if (updates.nombre !== undefined) mapped.nombre = updates.nombre
  if (updates.email !== undefined) mapped.email = updates.email
  if (updates.rol !== undefined) mapped.rol = updates.rol
  if (updates.salarioBase !== undefined) mapped.salario_base = updates.salarioBase
  if (updates.porcentajeComision !== undefined) mapped.porcentaje_comision = updates.porcentajeComision
  if (updates.estado !== undefined) mapped.estado = updates.estado
  if (updates.fechaIngreso !== undefined) mapped.fecha_ingreso = updates.fechaIngreso || null
  if (updates.proyectosActivos !== undefined) mapped.proyectos_activos = updates.proyectosActivos
  const { error } = await supabase.from('empleados').update(mapped).eq('id', id)
  if (error) throw error
}

export async function deleteEmpleado(id: string): Promise<void> {
  const { error } = await supabase.from('empleados').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// COTIZACIONES
// =============================================

export async function getCotizaciones(): Promise<Cotizacion[]> {
  const { data, error } = await supabase.from('cotizaciones').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching cotizaciones:', error); return [] }
  return (data || []).map(mapCotizacion)
}

export async function addCotizacion(cotizacion: Omit<Cotizacion, 'id'>): Promise<Cotizacion> {
  const { data, error } = await supabase.from('cotizaciones').insert({
    cliente: cotizacion.cliente,
    proyecto: cotizacion.proyecto,
    valor: cotizacion.valor,
    estado: cotizacion.estado,
    fecha_creacion: cotizacion.fechaCreacion || null,
    fecha_vencimiento: cotizacion.fechaVencimiento || null,
    seguimientos: cotizacion.seguimientos,
    responsable: cotizacion.responsable,
  }).select().single()
  if (error) throw error
  return mapCotizacion(data)
}

export async function updateCotizacion(id: string, updates: Partial<Cotizacion>): Promise<void> {
  const mapped: any = {}
  if (updates.cliente !== undefined) mapped.cliente = updates.cliente
  if (updates.proyecto !== undefined) mapped.proyecto = updates.proyecto
  if (updates.valor !== undefined) mapped.valor = updates.valor
  if (updates.estado !== undefined) mapped.estado = updates.estado
  if (updates.fechaVencimiento !== undefined) mapped.fecha_vencimiento = updates.fechaVencimiento || null
  if (updates.seguimientos !== undefined) mapped.seguimientos = updates.seguimientos
  if (updates.responsable !== undefined) mapped.responsable = updates.responsable
  const { error } = await supabase.from('cotizaciones').update(mapped).eq('id', id)
  if (error) throw error
}

export async function deleteCotizacion(id: string): Promise<void> {
  const { error } = await supabase.from('cotizaciones').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// ONBOARDING
// =============================================

export async function getOnboarding(): Promise<OnboardingClient[]> {
  const { data, error } = await supabase.from('onboarding').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching onboarding:', error); return [] }
  return (data || []).map(mapOnboarding)
}

export async function addOnboarding(client: Omit<OnboardingClient, 'id'>): Promise<OnboardingClient> {
  const { data, error } = await supabase.from('onboarding').insert({
    nombre: client.nombre,
    empresa: client.empresa,
    email: client.email,
    telefono: client.telefono,
    etapa: client.etapa,
    progreso: client.progreso,
    fecha_inicio: client.fechaInicio || null,
    responsable: client.responsable,
    siguiente_paso: client.siguientePaso,
    brief_completado: client.briefCompletado,
    kickoff_agendado: client.kickoffAgendado,
    documentos_recibidos: client.documentosRecibidos,
    proyecto_creado: client.proyectoCreado,
  }).select().single()
  if (error) throw error
  return mapOnboarding(data)
}

export async function updateOnboarding(id: string, updates: Partial<OnboardingClient>): Promise<void> {
  const mapped: any = {}
  if (updates.nombre !== undefined) mapped.nombre = updates.nombre
  if (updates.empresa !== undefined) mapped.empresa = updates.empresa
  if (updates.email !== undefined) mapped.email = updates.email
  if (updates.telefono !== undefined) mapped.telefono = updates.telefono
  if (updates.etapa !== undefined) mapped.etapa = updates.etapa
  if (updates.progreso !== undefined) mapped.progreso = updates.progreso
  if (updates.fechaInicio !== undefined) mapped.fecha_inicio = updates.fechaInicio || null
  if (updates.responsable !== undefined) mapped.responsable = updates.responsable
  if (updates.siguientePaso !== undefined) mapped.siguiente_paso = updates.siguientePaso
  if (updates.briefCompletado !== undefined) mapped.brief_completado = updates.briefCompletado
  if (updates.kickoffAgendado !== undefined) mapped.kickoff_agendado = updates.kickoffAgendado
  if (updates.documentosRecibidos !== undefined) mapped.documentos_recibidos = updates.documentosRecibidos
  if (updates.proyectoCreado !== undefined) mapped.proyecto_creado = updates.proyectoCreado
  const { error } = await supabase.from('onboarding').update(mapped).eq('id', id)
  if (error) throw error
}

export async function deleteOnboarding(id: string): Promise<void> {
  const { error } = await supabase.from('onboarding').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// TAREAS (con evidencias incluidas)
// =============================================

export async function getTareas(): Promise<Tarea[]> {
  const { data: tareasData, error: tareasError } = await supabase
    .from('tareas').select('*').order('created_at', { ascending: false })
  if (tareasError) { console.error('Error fetching tareas:', tareasError); return [] }

  const tareaIds = (tareasData || []).map(t => t.id)
  let evidenciasMap: Record<string, Evidencia[]> = {}

  if (tareaIds.length > 0) {
    const { data: eviData } = await supabase
      .from('evidencias').select('*').in('tarea_id', tareaIds)
    if (eviData) {
      for (const row of eviData) {
        const evi = mapEvidencia(row)
        if (!evidenciasMap[row.tarea_id]) evidenciasMap[row.tarea_id] = []
        evidenciasMap[row.tarea_id].push(evi)
      }
    }
  }

  return (tareasData || []).map(row => mapTarea(row, evidenciasMap[row.id] || []))
}

export async function getTareaById(id: string): Promise<Tarea | null> {
  const { data, error } = await supabase.from('tareas').select('*').eq('id', id).single()
  if (error || !data) return null

  const { data: eviData } = await supabase.from('evidencias').select('*').eq('tarea_id', id)
  const evidencias = (eviData || []).map(mapEvidencia)

  return mapTarea(data, evidencias)
}

export async function addTarea(tarea: Omit<Tarea, 'id' | 'evidencias'>): Promise<Tarea> {
  const { data, error } = await supabase.from('tareas').insert({
    titulo: tarea.titulo,
    descripcion: tarea.descripcion,
    proyecto: tarea.proyecto,
    cliente: tarea.cliente,
    asignado: tarea.asignado,
    estado: tarea.estado,
    prioridad: tarea.prioridad,
    fecha_creacion: tarea.fechaCreacion || null,
    fecha_vencimiento: tarea.fechaVencimiento || null,
    fecha_completada: tarea.fechaCompletada || null,
    etiquetas: tarea.etiquetas,
  }).select().single()
  if (error) throw error
  return mapTarea(data, [])
}

export async function updateTarea(id: string, updates: Partial<Tarea>): Promise<void> {
  const mapped: any = {}
  if (updates.titulo !== undefined) mapped.titulo = updates.titulo
  if (updates.descripcion !== undefined) mapped.descripcion = updates.descripcion
  if (updates.proyecto !== undefined) mapped.proyecto = updates.proyecto
  if (updates.cliente !== undefined) mapped.cliente = updates.cliente
  if (updates.asignado !== undefined) mapped.asignado = updates.asignado
  if (updates.estado !== undefined) mapped.estado = updates.estado
  if (updates.prioridad !== undefined) mapped.prioridad = updates.prioridad
  if (updates.fechaVencimiento !== undefined) mapped.fecha_vencimiento = updates.fechaVencimiento || null
  if (updates.fechaCompletada !== undefined) mapped.fecha_completada = updates.fechaCompletada || null
  if (updates.etiquetas !== undefined) mapped.etiquetas = updates.etiquetas
  const { error } = await supabase.from('tareas').update(mapped).eq('id', id)
  if (error) throw error
}

export async function deleteTarea(id: string): Promise<void> {
  const { error } = await supabase.from('tareas').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// EVIDENCIAS (Supabase Storage + DB)
// =============================================

export async function addEvidencia(tareaId: string, file: File): Promise<Evidencia> {
  const isImage = file.type.startsWith('image/')
  const filePath = `tareas/${tareaId}/${Date.now()}_${file.name}`

  // Subir archivo a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('evidencias')
    .upload(filePath, file)
  if (uploadError) throw uploadError

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from('evidencias')
    .getPublicUrl(filePath)

  // Guardar registro en DB
  const { data, error } = await supabase.from('evidencias').insert({
    tarea_id: tareaId,
    nombre: file.name,
    tipo: isImage ? 'imagen' : 'archivo',
    url: urlData.publicUrl,
    fecha_subida: new Date().toISOString().split('T')[0],
    tamaño: file.size,
  }).select().single()
  if (error) throw error

  return mapEvidencia(data)
}

export async function removeEvidencia(tareaId: string, evidenciaId: string): Promise<void> {
  // Obtener la evidencia para saber el path del archivo
  const { data: evi } = await supabase.from('evidencias').select('url').eq('id', evidenciaId).single()

  if (evi?.url) {
    // Extraer path del URL público
    const urlParts = evi.url.split('/storage/v1/object/public/evidencias/')
    if (urlParts[1]) {
      await supabase.storage.from('evidencias').remove([urlParts[1]])
    }
  }

  // Eliminar registro de DB
  const { error } = await supabase.from('evidencias').delete().eq('id', evidenciaId)
  if (error) throw error
}

// =============================================
// FUNCIONES FILTRADAS PARA PANEL DE EMPLEADO
// =============================================

export async function getTareasByUsuario(nombreUsuario: string): Promise<Tarea[]> {
  const { data: tareasData, error: tareasError } = await supabase
    .from('tareas').select('*')
    .eq('asignado', nombreUsuario)
    .order('created_at', { ascending: false })
  if (tareasError) { console.error('Error fetching tareas by usuario:', tareasError); return [] }

  const tareaIds = (tareasData || []).map(t => t.id)
  let evidenciasMap: Record<string, Evidencia[]> = {}

  if (tareaIds.length > 0) {
    const { data: eviData } = await supabase
      .from('evidencias').select('*').in('tarea_id', tareaIds)
    if (eviData) {
      for (const row of eviData) {
        const evi = mapEvidencia(row)
        if (!evidenciasMap[row.tarea_id]) evidenciasMap[row.tarea_id] = []
        evidenciasMap[row.tarea_id].push(evi)
      }
    }
  }

  return (tareasData || []).map(row => mapTarea(row, evidenciasMap[row.id] || []))
}

export async function getProyectosByUsuario(nombreUsuario: string): Promise<Proyecto[]> {
  const { data, error } = await supabase
    .from('proyectos').select('*')
    .eq('responsable', nombreUsuario)
    .order('created_at', { ascending: false })
  if (error) { console.error('Error fetching proyectos by usuario:', error); return [] }
  return (data || []).map(mapProyecto)
}

export async function getClientesByUsuario(nombreUsuario: string): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from('clientes').select('*')
    .eq('responsable', nombreUsuario)
    .order('created_at', { ascending: false })
  if (error) { console.error('Error fetching clientes by usuario:', error); return [] }
  return (data || []).map(mapCliente)
}

export async function getProyectosPipeline(): Promise<Proyecto[]> {
  const { data, error } = await supabase
    .from('proyectos').select('*')
    .eq('estado', 'Planificación')
    .order('fecha_inicio', { ascending: true })
  if (error) { console.error('Error fetching pipeline:', error); return [] }
  return (data || []).map(mapProyecto)
}

// =============================================
// INGRESOS Y GASTOS
// =============================================

export interface Ingreso {
  id: string
  tipoDeGasto: string
  monto: number
  dia: number
  mes: number
  año: number
}

export interface Gasto {
  id: string
  tipoDeGasto: string
  importe: number
  dia: number
  mes: number
  año: number
}

export async function getIngresos(): Promise<Ingreso[]> {
  const { data, error } = await supabase.from('ingresos').select('*').order('año', { ascending: false }).order('mes', { ascending: false })
  if (error) { console.error('Error fetching ingresos:', error); return [] }
  return (data || []).map(row => ({
    id: row.id,
    tipoDeGasto: row.tipo_de_gasto,
    monto: Number(row.monto) || 0,
    dia: row.dia,
    mes: row.mes,
    año: row.año,
  }))
}

export async function getGastos(): Promise<Gasto[]> {
  const { data, error } = await supabase.from('gastos').select('*').order('año', { ascending: false }).order('mes', { ascending: false })
  if (error) { console.error('Error fetching gastos:', error); return [] }
  return (data || []).map(row => ({
    id: row.id,
    tipoDeGasto: row.tipo_de_gasto,
    importe: Number(row.importe) || 0,
    dia: row.dia,
    mes: row.mes,
    año: row.año,
  }))
}

export async function addIngreso(ingreso: Omit<Ingreso, 'id'>): Promise<void> {
  const { error } = await supabase.from('ingresos').insert({
    tipo_de_gasto: ingreso.tipoDeGasto,
    monto: ingreso.monto,
    dia: ingreso.dia,
    mes: ingreso.mes,
    año: ingreso.año,
  })
  if (error) throw error
}

export async function addGasto(gasto: Omit<Gasto, 'id'>): Promise<void> {
  const { error } = await supabase.from('gastos').insert({
    tipo_de_gasto: gasto.tipoDeGasto,
    importe: gasto.importe,
    dia: gasto.dia,
    mes: gasto.mes,
    año: gasto.año,
  })
  if (error) throw error
}

// =============================================
// AUTO-UPDATE PROJECT PROGRESS FROM TASKS
// =============================================

export async function recalcularProgresoProyecto(nombreProyecto: string): Promise<number> {
  const { data, error } = await supabase
    .from('tareas').select('estado')
    .eq('proyecto', nombreProyecto)
  if (error || !data || data.length === 0) return 0

  const total = data.length
  const completadas = data.filter(t => t.estado === 'Completada').length
  const enProgreso = data.filter(t => t.estado === 'En Progreso').length
  const enRevision = data.filter(t => t.estado === 'En Revisión').length

  const progreso = Math.round(
    ((completadas * 1.0 + enRevision * 0.75 + enProgreso * 0.35) / total) * 100
  )

  await supabase.from('proyectos').update({ progreso }).eq('nombre', nombreProyecto)
  return progreso
}

// =============================================
// IDEA ROOMS
// =============================================

export interface IdeaRoom {
  id: string
  nombre: string
  proyectoId?: string
  descripcion: string
  creadoPor: string
  activo: boolean
  createdAt: string
  participantes: string[]
}

export interface IdeaRoomMensaje {
  id: string
  ideaRoomId: string
  autor: string
  contenido: string
  tipo: string
  archivoUrl?: string
  archivoNombre?: string
  createdAt: string
}

export async function getIdeaRooms(): Promise<IdeaRoom[]> {
  const { data, error } = await supabase
    .from('idea_rooms').select('*').eq('activo', true).order('created_at', { ascending: false })
  if (error) { console.error('Error fetching idea rooms:', error); return [] }

  const roomIds = (data || []).map(r => r.id)
  let participantesMap: Record<string, string[]> = {}

  if (roomIds.length > 0) {
    const { data: pData } = await supabase
      .from('idea_room_participantes').select('*').in('idea_room_id', roomIds)
    if (pData) {
      for (const row of pData) {
        if (!participantesMap[row.idea_room_id]) participantesMap[row.idea_room_id] = []
        participantesMap[row.idea_room_id].push(row.usuario_nombre)
      }
    }
  }

  return (data || []).map(row => ({
    id: row.id,
    nombre: row.nombre,
    proyectoId: row.proyecto_id || undefined,
    descripcion: row.descripcion || '',
    creadoPor: row.creado_por,
    activo: row.activo,
    createdAt: row.created_at,
    participantes: participantesMap[row.id] || [],
  }))
}

export async function getIdeaRoomsByUsuario(nombreUsuario: string): Promise<IdeaRoom[]> {
  const { data: pData, error: pError } = await supabase
    .from('idea_room_participantes').select('idea_room_id')
    .eq('usuario_nombre', nombreUsuario)
  if (pError || !pData) return []

  const roomIds = pData.map(p => p.idea_room_id)
  if (roomIds.length === 0) return []

  const allRooms = await getIdeaRooms()
  return allRooms.filter(r => roomIds.includes(r.id))
}

export async function createIdeaRoom(room: { nombre: string; proyectoId?: string; descripcion: string; creadoPor: string; participantes: string[] }): Promise<IdeaRoom> {
  const { data, error } = await supabase.from('idea_rooms').insert({
    nombre: room.nombre,
    proyecto_id: room.proyectoId || null,
    descripcion: room.descripcion,
    creado_por: room.creadoPor,
  }).select().single()
  if (error) throw error

  if (room.participantes.length > 0) {
    const rows = room.participantes.map(p => ({
      idea_room_id: data.id,
      usuario_nombre: p,
    }))
    await supabase.from('idea_room_participantes').insert(rows)
  }

  return {
    id: data.id,
    nombre: data.nombre,
    proyectoId: data.proyecto_id || undefined,
    descripcion: data.descripcion || '',
    creadoPor: data.creado_por,
    activo: data.activo,
    createdAt: data.created_at,
    participantes: room.participantes,
  }
}

export async function updateIdeaRoomParticipantes(roomId: string, participantes: string[]): Promise<void> {
  await supabase.from('idea_room_participantes').delete().eq('idea_room_id', roomId)
  if (participantes.length > 0) {
    const rows = participantes.map(p => ({ idea_room_id: roomId, usuario_nombre: p }))
    await supabase.from('idea_room_participantes').insert(rows)
  }
}

export async function deleteIdeaRoom(id: string): Promise<void> {
  const { error } = await supabase.from('idea_rooms').update({ activo: false }).eq('id', id)
  if (error) throw error
}

export async function getIdeaRoomMensajes(roomId: string): Promise<IdeaRoomMensaje[]> {
  const { data, error } = await supabase
    .from('idea_room_mensajes').select('*')
    .eq('idea_room_id', roomId)
    .order('created_at', { ascending: true })
  if (error) { console.error('Error fetching mensajes:', error); return [] }
  return (data || []).map(row => ({
    id: row.id,
    ideaRoomId: row.idea_room_id,
    autor: row.autor,
    contenido: row.contenido,
    tipo: row.tipo || 'mensaje',
    archivoUrl: row.archivo_url || undefined,
    archivoNombre: row.archivo_nombre || undefined,
    createdAt: row.created_at,
  }))
}

export async function sendIdeaRoomMensaje(msg: { ideaRoomId: string; autor: string; contenido: string; tipo?: string; archivoUrl?: string; archivoNombre?: string }): Promise<IdeaRoomMensaje> {
  const { data, error } = await supabase.from('idea_room_mensajes').insert({
    idea_room_id: msg.ideaRoomId,
    autor: msg.autor,
    contenido: msg.contenido,
    tipo: msg.tipo || 'mensaje',
    archivo_url: msg.archivoUrl || null,
    archivo_nombre: msg.archivoNombre || null,
  }).select().single()
  if (error) throw error
  return {
    id: data.id,
    ideaRoomId: data.idea_room_id,
    autor: data.autor,
    contenido: data.contenido,
    tipo: data.tipo,
    archivoUrl: data.archivo_url || undefined,
    archivoNombre: data.archivo_nombre || undefined,
    createdAt: data.created_at,
  }
}

export async function uploadIdeaRoomFile(roomId: string, file: File): Promise<{ url: string; nombre: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `idea-room/${roomId}/${Date.now()}_${safeName}`
  const { error: uploadError } = await supabase.storage
    .from('evidencias')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'application/octet-stream',
    })
  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error(`Error al subir archivo: ${uploadError.message}`)
  }
  const { data: urlData } = supabase.storage
    .from('evidencias')
    .getPublicUrl(filePath)
  return { url: urlData.publicUrl, nombre: file.name }
}

// =============================================
// NOTIFICACIONES
// =============================================

export interface Notificacion {
  id: string
  usuarioDestino: string
  tipo: string
  titulo: string
  mensaje: string
  enlace: string
  leida: boolean
  createdAt: string
}

export async function getNotificaciones(usuario: string): Promise<Notificacion[]> {
  const { data, error } = await supabase
    .from('notificaciones').select('*')
    .eq('usuario_destino', usuario)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) { console.error('Error fetching notificaciones:', error); return [] }
  return (data || []).map(row => ({
    id: row.id,
    usuarioDestino: row.usuario_destino,
    tipo: row.tipo,
    titulo: row.titulo,
    mensaje: row.mensaje || '',
    enlace: row.enlace || '',
    leida: row.leida,
    createdAt: row.created_at,
  }))
}

export async function getNotificacionesNoLeidas(usuario: string): Promise<number> {
  const { count, error } = await supabase
    .from('notificaciones')
    .select('*', { count: 'exact', head: true })
    .eq('usuario_destino', usuario)
    .eq('leida', false)
  if (error) return 0
  return count || 0
}

export async function marcarNotificacionLeida(id: string): Promise<void> {
  await supabase.from('notificaciones').update({ leida: true }).eq('id', id)
}

export async function marcarTodasLeidas(usuario: string): Promise<void> {
  await supabase.from('notificaciones').update({ leida: true }).eq('usuario_destino', usuario).eq('leida', false)
}

export async function crearNotificacion(notif: { usuarioDestino: string; tipo: string; titulo: string; mensaje: string; enlace?: string }): Promise<void> {
  await supabase.from('notificaciones').insert({
    usuario_destino: notif.usuarioDestino,
    tipo: notif.tipo,
    titulo: notif.titulo,
    mensaje: notif.mensaje,
    enlace: notif.enlace || '',
  })
}

export async function notificarAdmins(notif: { tipo: string; titulo: string; mensaje: string; enlace?: string }): Promise<void> {
  // Notify both admins AND dueño users so Guillermo sees all platform activity
  const { data } = await supabase.from('usuarios').select('nombre').in('rol', ['admin', 'dueno'])
  if (!data || data.length === 0) return
  const rows = data.map(u => ({
    usuario_destino: u.nombre,
    tipo: notif.tipo,
    titulo: notif.titulo,
    mensaje: notif.mensaje,
    enlace: notif.enlace || '',
  }))
  await supabase.from('notificaciones').insert(rows)
}

// Notify only dueño users — used for financial items (presupuestos, cotizaciones, dinero)
export async function notificarDueno(notif: { tipo: string; titulo: string; mensaje: string; enlace?: string }): Promise<void> {
  const { data } = await supabase.from('usuarios').select('nombre').eq('rol', 'dueno')
  if (!data || data.length === 0) return
  const rows = data.map(u => ({
    usuario_destino: u.nombre,
    tipo: notif.tipo,
    titulo: notif.titulo,
    mensaje: notif.mensaje,
    enlace: notif.enlace || '',
  }))
  await supabase.from('notificaciones').insert(rows)
}

// =============================================
// CALENDARIO
// =============================================

export interface EventoCalendario {
  id: string
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaFin?: string
  todoElDia: boolean
  color: string
  tipo: string
  importancia: 'alta' | 'media' | 'baja'
  usuario: string
  participantes: string[]
  proyecto: string
  tareaId?: string
}

export async function getEventosCalendario(usuario: string): Promise<EventoCalendario[]> {
  const { data, error } = await supabase
    .from('eventos_calendario').select('*')
    .or(`usuario.eq.${usuario},participantes.cs.{${usuario}}`)
    .order('fecha_inicio', { ascending: true })
  if (error) { console.error('Error fetching eventos:', error); return [] }
  return (data || []).map(row => ({
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion || '',
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin || undefined,
    todoElDia: row.todo_el_dia,
    color: row.color || '#6366f1',
    tipo: row.tipo || 'evento',
    importancia: row.importancia || 'media',
    usuario: row.usuario,
    participantes: row.participantes || [],
    proyecto: row.proyecto || '',
    tareaId: row.tarea_id || undefined,
  }))
}

export async function addEventoCalendario(evento: Omit<EventoCalendario, 'id'>): Promise<EventoCalendario> {
  const { data, error } = await supabase.from('eventos_calendario').insert({
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    fecha_inicio: evento.fechaInicio,
    fecha_fin: evento.fechaFin || null,
    todo_el_dia: evento.todoElDia,
    color: evento.color,
    tipo: evento.tipo,
    importancia: evento.importancia || 'media',
    usuario: evento.usuario,
    participantes: evento.participantes || [],
    proyecto: evento.proyecto,
    tarea_id: evento.tareaId || null,
  }).select().single()
  if (error) throw error
  return {
    id: data.id,
    titulo: data.titulo,
    descripcion: data.descripcion || '',
    fechaInicio: data.fecha_inicio,
    fechaFin: data.fecha_fin || undefined,
    todoElDia: data.todo_el_dia,
    color: data.color,
    tipo: data.tipo,
    importancia: data.importancia || 'media',
    usuario: data.usuario,
    participantes: data.participantes || [],
    proyecto: data.proyecto || '',
    tareaId: data.tarea_id || undefined,
  }
}

export async function updateEventoCalendario(id: string, updates: Partial<EventoCalendario>): Promise<void> {
  const mapped: any = {}
  if (updates.titulo !== undefined) mapped.titulo = updates.titulo
  if (updates.descripcion !== undefined) mapped.descripcion = updates.descripcion
  if (updates.fechaInicio !== undefined) mapped.fecha_inicio = updates.fechaInicio
  if (updates.fechaFin !== undefined) mapped.fecha_fin = updates.fechaFin || null
  if (updates.todoElDia !== undefined) mapped.todo_el_dia = updates.todoElDia
  if (updates.color !== undefined) mapped.color = updates.color
  if (updates.tipo !== undefined) mapped.tipo = updates.tipo
  if (updates.proyecto !== undefined) mapped.proyecto = updates.proyecto
  const { error } = await supabase.from('eventos_calendario').update(mapped).eq('id', id)
  if (error) throw error
}

export async function deleteEventoCalendario(id: string): Promise<void> {
  const { error } = await supabase.from('eventos_calendario').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// CREADORES DE CONTENIDO
// =============================================

export interface Creador {
  id: string
  nombre: string
  email: string
  especialidad: string
  tarifa: string
  estado: string
  createdAt: string
}

export interface CreadorCalificacion {
  id: string
  creadorId: string
  evaluador: string
  calidadVisual: number
  puntualidad: number
  creatividad: number
  comunicacion: number
  seguimientoBrief: number
  comentario: string
  createdAt: string
}

export async function getCreadores(): Promise<Creador[]> {
  const { data, error } = await supabase.from('creadores').select('*').order('nombre')
  if (error) { console.error('Error fetching creadores:', error); return [] }
  return (data || []).map(r => ({
    id: r.id,
    nombre: r.nombre,
    email: r.email || '',
    especialidad: r.especialidad || '',
    tarifa: r.tarifa || '',
    estado: r.estado || 'Disponible',
    createdAt: r.created_at,
  }))
}

export async function addCreador(c: Omit<Creador, 'id' | 'createdAt'>): Promise<Creador> {
  const { data, error } = await supabase.from('creadores').insert({
    nombre: c.nombre,
    email: c.email,
    especialidad: c.especialidad,
    tarifa: c.tarifa,
    estado: c.estado,
  }).select().single()
  if (error) throw error
  return { id: data.id, nombre: data.nombre, email: data.email || '', especialidad: data.especialidad || '', tarifa: data.tarifa || '', estado: data.estado || 'Disponible', createdAt: data.created_at }
}

export async function deleteCreador(id: string): Promise<void> {
  const { error } = await supabase.from('creadores').delete().eq('id', id)
  if (error) throw error
}

export async function getCalificaciones(creadorId: string): Promise<CreadorCalificacion[]> {
  const { data, error } = await supabase.from('creador_calificaciones').select('*').eq('creador_id', creadorId).order('created_at', { ascending: false })
  if (error) { console.error('Error fetching calificaciones:', error); return [] }
  return (data || []).map(r => ({
    id: r.id,
    creadorId: r.creador_id,
    evaluador: r.evaluador,
    calidadVisual: r.calidad_visual,
    puntualidad: r.puntualidad,
    creatividad: r.creatividad,
    comunicacion: r.comunicacion,
    seguimientoBrief: r.seguimiento_brief,
    comentario: r.comentario || '',
    createdAt: r.created_at,
  }))
}

export async function getAllCalificaciones(): Promise<CreadorCalificacion[]> {
  const { data, error } = await supabase.from('creador_calificaciones').select('*').order('created_at', { ascending: false })
  if (error) { console.error('Error fetching all calificaciones:', error); return [] }
  return (data || []).map(r => ({
    id: r.id,
    creadorId: r.creador_id,
    evaluador: r.evaluador,
    calidadVisual: r.calidad_visual,
    puntualidad: r.puntualidad,
    creatividad: r.creatividad,
    comunicacion: r.comunicacion,
    seguimientoBrief: r.seguimiento_brief,
    comentario: r.comentario || '',
    createdAt: r.created_at,
  }))
}

export async function upsertCalificacion(cal: { creadorId: string; evaluador: string; calidadVisual: number; puntualidad: number; creatividad: number; comunicacion: number; seguimientoBrief: number; comentario: string }): Promise<void> {
  const { error } = await supabase.from('creador_calificaciones').upsert({
    creador_id: cal.creadorId,
    evaluador: cal.evaluador,
    calidad_visual: cal.calidadVisual,
    puntualidad: cal.puntualidad,
    creatividad: cal.creatividad,
    comunicacion: cal.comunicacion,
    seguimiento_brief: cal.seguimientoBrief,
    comentario: cal.comentario,
  }, { onConflict: 'creador_id,evaluador' })
  if (error) throw error
}

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { Cliente, OnboardingClient } from './store'

// Mapeo de columnas para Excel (español)
const CLIENTE_COLUMNS = {
  id: 'ID',
  nombre: 'Nombre',
  empresa: 'Empresa',
  email: 'Email',
  telefono: 'Teléfono',
  estado: 'Estado',
  etapaOnboarding: 'Etapa Onboarding',
  valorMensual: 'Valor Mensual ($)',
  fechaInicio: 'Fecha Inicio',
  ultimoContacto: 'Último Contacto',
  responsable: 'Responsable',
  notas: 'Notas'
}

// Exportar clientes a Excel
export function exportClientesToExcel(clientes: Cliente[], filename: string = 'clientes_crm') {
  // Transformar datos para Excel con nombres de columnas en español
  const dataForExcel = clientes.map(cliente => ({
    [CLIENTE_COLUMNS.id]: cliente.id,
    [CLIENTE_COLUMNS.nombre]: cliente.nombre,
    [CLIENTE_COLUMNS.empresa]: cliente.empresa,
    [CLIENTE_COLUMNS.email]: cliente.email,
    [CLIENTE_COLUMNS.telefono]: cliente.telefono,
    [CLIENTE_COLUMNS.estado]: cliente.estado,
    [CLIENTE_COLUMNS.etapaOnboarding]: cliente.etapaOnboarding,
    [CLIENTE_COLUMNS.valorMensual]: cliente.valorMensual,
    [CLIENTE_COLUMNS.fechaInicio]: cliente.fechaInicio,
    [CLIENTE_COLUMNS.ultimoContacto]: cliente.ultimoContacto,
    [CLIENTE_COLUMNS.responsable]: cliente.responsable,
    [CLIENTE_COLUMNS.notas]: cliente.notas
  }))

  // Crear workbook y worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataForExcel)
  const workbook = XLSX.utils.book_new()
  
  // Ajustar ancho de columnas
  const colWidths = [
    { wch: 10 },  // ID
    { wch: 20 },  // Nombre
    { wch: 25 },  // Empresa
    { wch: 30 },  // Email
    { wch: 18 },  // Teléfono
    { wch: 15 },  // Estado
    { wch: 18 },  // Etapa Onboarding
    { wch: 15 },  // Valor Mensual
    { wch: 12 },  // Fecha Inicio
    { wch: 15 },  // Último Contacto
    { wch: 18 },  // Responsable
    { wch: 40 },  // Notas
  ]
  worksheet['!cols'] = colWidths

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes')

  // Agregar hoja de instrucciones
  const instrucciones = [
    ['INSTRUCCIONES PARA EDITAR Y REIMPORTAR'],
    [''],
    ['1. Puedes modificar cualquier celda excepto la columna ID para registros existentes'],
    ['2. Para agregar nuevos clientes, deja el ID vacío y el sistema asignará uno automáticamente'],
    ['3. Para eliminar un cliente, borra toda la fila'],
    ['4. Estados válidos: Activo, Inactivo, Prospecto, En Onboarding'],
    ['5. Etapas de Onboarding: Bienvenida, Documentación, Configuración, Capacitación, Completado'],
    ['6. Guarda el archivo y usa el botón "Importar Excel" en el CRM para sincronizar los cambios'],
    [''],
    ['IMPORTANTE: No cambies el nombre de las columnas en la hoja "Clientes"']
  ]
  const instrSheet = XLSX.utils.aoa_to_sheet(instrucciones)
  instrSheet['!cols'] = [{ wch: 80 }]
  XLSX.utils.book_append_sheet(workbook, instrSheet, 'Instrucciones')

  // Generar archivo y descargar
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// Importar clientes desde Excel
export function importClientesFromExcel(file: File): Promise<Cliente[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Leer la hoja de Clientes
        const worksheet = workbook.Sheets['Clientes']
        if (!worksheet) {
          reject(new Error('No se encontró la hoja "Clientes" en el archivo'))
          return
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        // Transformar de vuelta a formato interno
        const clientes: Cliente[] = jsonData.map((row: any, index: number) => ({
          id: row[CLIENTE_COLUMNS.id] || `CLI-NEW-${index + 1}`,
          nombre: row[CLIENTE_COLUMNS.nombre] || '',
          empresa: row[CLIENTE_COLUMNS.empresa] || '',
          email: row[CLIENTE_COLUMNS.email] || '',
          telefono: row[CLIENTE_COLUMNS.telefono] || '',
          estado: validateEstado(row[CLIENTE_COLUMNS.estado]),
          etapaOnboarding: validateEtapa(row[CLIENTE_COLUMNS.etapaOnboarding]),
          valorMensual: Number(row[CLIENTE_COLUMNS.valorMensual]) || 0,
          fechaInicio: row[CLIENTE_COLUMNS.fechaInicio] || '',
          ultimoContacto: row[CLIENTE_COLUMNS.ultimoContacto] || '',
          responsable: row[CLIENTE_COLUMNS.responsable] || '',
          notas: row[CLIENTE_COLUMNS.notas] || ''
        }))

        resolve(clientes)
      } catch (error) {
        reject(new Error('Error al procesar el archivo Excel'))
      }
    }

    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

function validateEstado(estado: string): Cliente['estado'] {
  const validEstados = ['Activo', 'Inactivo', 'Prospecto', 'En Onboarding']
  return validEstados.includes(estado) ? estado as Cliente['estado'] : 'Prospecto'
}

function validateEtapa(etapa: string): Cliente['etapaOnboarding'] {
  const validEtapas = ['Bienvenida', 'Documentación', 'Configuración', 'Capacitación', 'Completado']
  return validEtapas.includes(etapa) ? etapa as Cliente['etapaOnboarding'] : 'Bienvenida'
}

// Exportar plantilla vacía
export function exportClientesTemplate() {
  const template = [{
    [CLIENTE_COLUMNS.id]: '',
    [CLIENTE_COLUMNS.nombre]: 'Ejemplo: Juan Pérez',
    [CLIENTE_COLUMNS.empresa]: 'Ejemplo: Mi Empresa SA',
    [CLIENTE_COLUMNS.email]: 'ejemplo@email.com',
    [CLIENTE_COLUMNS.telefono]: '+52 55 1234 5678',
    [CLIENTE_COLUMNS.estado]: 'Prospecto',
    [CLIENTE_COLUMNS.etapaOnboarding]: 'Bienvenida',
    [CLIENTE_COLUMNS.valorMensual]: 10000,
    [CLIENTE_COLUMNS.fechaInicio]: '2024-12-01',
    [CLIENTE_COLUMNS.ultimoContacto]: '2024-12-10',
    [CLIENTE_COLUMNS.responsable]: 'Nombre del Responsable',
    [CLIENTE_COLUMNS.notas]: 'Notas adicionales aquí'
  }]

  const worksheet = XLSX.utils.json_to_sheet(template)
  const workbook = XLSX.utils.book_new()
  
  worksheet['!cols'] = [
    { wch: 10 }, { wch: 20 }, { wch: 25 }, { wch: 30 },
    { wch: 18 }, { wch: 15 }, { wch: 18 }, { wch: 15 },
    { wch: 12 }, { wch: 15 }, { wch: 18 }, { wch: 40 }
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, 'plantilla_clientes_crm.xlsx')
}

// ==================== ONBOARDING EXCEL ====================

const ONBOARDING_COLUMNS = {
  id: 'ID',
  nombre: 'Nombre',
  empresa: 'Empresa',
  email: 'Email',
  telefono: 'Teléfono',
  etapa: 'Etapa',
  progreso: 'Progreso (%)',
  fechaInicio: 'Fecha Inicio',
  responsable: 'Responsable',
  siguientePaso: 'Siguiente Paso',
  briefCompletado: 'Brief Completado',
  kickoffAgendado: 'Kickoff Agendado',
  documentosRecibidos: 'Documentos Recibidos',
  proyectoCreado: 'Proyecto Creado'
}

// Exportar onboarding a Excel
export function exportOnboardingToExcel(onboarding: OnboardingClient[], filename: string = 'pipeline_onboarding') {
  const dataForExcel = onboarding.map(item => ({
    [ONBOARDING_COLUMNS.id]: item.id,
    [ONBOARDING_COLUMNS.nombre]: item.nombre,
    [ONBOARDING_COLUMNS.empresa]: item.empresa,
    [ONBOARDING_COLUMNS.email]: item.email,
    [ONBOARDING_COLUMNS.telefono]: item.telefono,
    [ONBOARDING_COLUMNS.etapa]: item.etapa,
    [ONBOARDING_COLUMNS.progreso]: item.progreso,
    [ONBOARDING_COLUMNS.fechaInicio]: item.fechaInicio,
    [ONBOARDING_COLUMNS.responsable]: item.responsable,
    [ONBOARDING_COLUMNS.siguientePaso]: item.siguientePaso,
    [ONBOARDING_COLUMNS.briefCompletado]: item.briefCompletado ? 'Sí' : 'No',
    [ONBOARDING_COLUMNS.kickoffAgendado]: item.kickoffAgendado ? 'Sí' : 'No',
    [ONBOARDING_COLUMNS.documentosRecibidos]: item.documentosRecibidos ? 'Sí' : 'No',
    [ONBOARDING_COLUMNS.proyectoCreado]: item.proyectoCreado ? 'Sí' : 'No'
  }))

  const worksheet = XLSX.utils.json_to_sheet(dataForExcel)
  const workbook = XLSX.utils.book_new()
  
  worksheet['!cols'] = [
    { wch: 10 }, { wch: 20 }, { wch: 25 }, { wch: 30 },
    { wch: 18 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
    { wch: 18 }, { wch: 40 }, { wch: 15 }, { wch: 15 },
    { wch: 18 }, { wch: 15 }
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pipeline')

  // Agregar hoja de instrucciones
  const instrucciones = [
    ['INSTRUCCIONES PARA PIPELINE DE ONBOARDING'],
    [''],
    ['1. Puedes modificar cualquier celda excepto la columna ID para registros existentes'],
    ['2. Para agregar nuevos clientes al pipeline, deja el ID vacío'],
    ['3. Etapas válidas: Bienvenida, Documentación, Kickoff, Activo'],
    ['4. Progreso: número de 0 a 100'],
    ['5. Campos Sí/No: Brief, Kickoff, Documentos, Proyecto - usar "Sí" o "No"'],
    ['6. Guarda el archivo y usa el botón "Importar Excel" para sincronizar'],
  ]
  const instrSheet = XLSX.utils.aoa_to_sheet(instrucciones)
  instrSheet['!cols'] = [{ wch: 80 }]
  XLSX.utils.book_append_sheet(workbook, instrSheet, 'Instrucciones')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// Importar onboarding desde Excel
export function importOnboardingFromExcel(file: File): Promise<OnboardingClient[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        const worksheet = workbook.Sheets['Pipeline']
        if (!worksheet) {
          reject(new Error('No se encontró la hoja "Pipeline" en el archivo'))
          return
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        const onboarding: OnboardingClient[] = jsonData.map((row: any, index: number) => ({
          id: row[ONBOARDING_COLUMNS.id] || `ONB-NEW-${index + 1}`,
          nombre: row[ONBOARDING_COLUMNS.nombre] || '',
          empresa: row[ONBOARDING_COLUMNS.empresa] || '',
          email: row[ONBOARDING_COLUMNS.email] || '',
          telefono: row[ONBOARDING_COLUMNS.telefono] || '',
          etapa: validateEtapaOnboarding(row[ONBOARDING_COLUMNS.etapa]),
          progreso: Number(row[ONBOARDING_COLUMNS.progreso]) || 0,
          fechaInicio: row[ONBOARDING_COLUMNS.fechaInicio] || '',
          responsable: row[ONBOARDING_COLUMNS.responsable] || '',
          siguientePaso: row[ONBOARDING_COLUMNS.siguientePaso] || '',
          briefCompletado: row[ONBOARDING_COLUMNS.briefCompletado] === 'Sí',
          kickoffAgendado: row[ONBOARDING_COLUMNS.kickoffAgendado] === 'Sí',
          documentosRecibidos: row[ONBOARDING_COLUMNS.documentosRecibidos] === 'Sí',
          proyectoCreado: row[ONBOARDING_COLUMNS.proyectoCreado] === 'Sí'
        }))

        resolve(onboarding)
      } catch (error) {
        reject(new Error('Error al procesar el archivo Excel'))
      }
    }

    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

function validateEtapaOnboarding(etapa: string): OnboardingClient['etapa'] {
  const validEtapas = ['Bienvenida', 'Documentación', 'Kickoff', 'Activo']
  return validEtapas.includes(etapa) ? etapa as OnboardingClient['etapa'] : 'Bienvenida'
}

// Exportar plantilla de onboarding
export function exportOnboardingTemplate() {
  const template = [{
    [ONBOARDING_COLUMNS.id]: '',
    [ONBOARDING_COLUMNS.nombre]: 'Ejemplo: Juan Pérez',
    [ONBOARDING_COLUMNS.empresa]: 'Ejemplo: Mi Empresa SA',
    [ONBOARDING_COLUMNS.email]: 'ejemplo@email.com',
    [ONBOARDING_COLUMNS.telefono]: '+52 55 1234 5678',
    [ONBOARDING_COLUMNS.etapa]: 'Bienvenida',
    [ONBOARDING_COLUMNS.progreso]: 0,
    [ONBOARDING_COLUMNS.fechaInicio]: '2024-12-01',
    [ONBOARDING_COLUMNS.responsable]: 'Nombre del Responsable',
    [ONBOARDING_COLUMNS.siguientePaso]: 'Enviar email de bienvenida',
    [ONBOARDING_COLUMNS.briefCompletado]: 'No',
    [ONBOARDING_COLUMNS.kickoffAgendado]: 'No',
    [ONBOARDING_COLUMNS.documentosRecibidos]: 'No',
    [ONBOARDING_COLUMNS.proyectoCreado]: 'No'
  }]

  const worksheet = XLSX.utils.json_to_sheet(template)
  const workbook = XLSX.utils.book_new()
  
  worksheet['!cols'] = [
    { wch: 10 }, { wch: 20 }, { wch: 25 }, { wch: 30 },
    { wch: 18 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
    { wch: 18 }, { wch: 40 }, { wch: 15 }, { wch: 15 },
    { wch: 18 }, { wch: 15 }
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pipeline')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, 'plantilla_pipeline_onboarding.xlsx')
}

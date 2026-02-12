// Integración con Google Sheets

// CLIENTES
const CLIENTES_SHEET_ID = '1lGRruFHba-3jxPXC1oLa9eRfLf45djEVcQ2DOG_fK0g'
const CLIENTES_SHEET_NAME = 'Clientes'
const CLIENTES_URL = `https://docs.google.com/spreadsheets/d/${CLIENTES_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${CLIENTES_SHEET_NAME}`

// ONBOARDING PIPELINE
const ONBOARDING_SHEET_ID = '1aSLCERi7zeI_QaRlI03X-uzMcClrl8wQ1EpRzL7pRNY'
const ONBOARDING_SHEET_NAME = 'Pipeline'
const ONBOARDING_URL = `https://docs.google.com/spreadsheets/d/${ONBOARDING_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${ONBOARDING_SHEET_NAME}`

// INGRESOS MENSUALES
const INGRESOS_SHEET_ID = '1x_fpgQ2IElPzu1ArHYb1x2F-zGN3KPhqMdG9ePjN8B8'
const INGRESOS_SHEET_NAME = 'Hoja 1'
const INGRESOS_URL = `https://docs.google.com/spreadsheets/d/${INGRESOS_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${INGRESOS_SHEET_NAME}`

// GASTOS MENSUALES
const GASTOS_SHEET_ID = '1Okkoehf_pIPqD0nw9cP0NFPoL2GiBd53P6fmvO8bWt8'
const GASTOS_SHEET_NAME = 'Hoja 1'
const GASTOS_URL = `https://docs.google.com/spreadsheets/d/${GASTOS_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${GASTOS_SHEET_NAME}`

export interface ClienteGoogleSheet {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  estado: string
  etapaOnboarding: string
  valorMensual: number
  fechaInicio: string
  ultimoContacto: string
  responsable: string
  notas: string
}

// Función auxiliar para parsear respuesta de Google Sheets
function parseGoogleSheetsResponse(text: string): any {
  // Google devuelve: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);?\s*$/)
  if (match) {
    return JSON.parse(match[1])
  }
  // Intentar parsear directamente
  return JSON.parse(text)
}

// Obtener CLIENTES del Google Sheet
export async function fetchClientesFromGoogleSheet(): Promise<ClienteGoogleSheet[]> {
  try {
    const response = await fetch(CLIENTES_URL)
    const text = await response.text()
    
    const data = parseGoogleSheetsResponse(text)
    
    if (!data.table || !data.table.rows) {
      return []
    }

    const clientes: ClienteGoogleSheet[] = data.table.rows.map((row: any) => {
      const cells = row.c || []
      return {
        id: cells[0]?.v || '',
        nombre: cells[1]?.v || '',
        empresa: cells[2]?.v || '',
        email: cells[3]?.v || '',
        telefono: cells[4]?.v || '',
        estado: cells[5]?.v || '',
        etapaOnboarding: cells[6]?.v || '',
        valorMensual: Number(cells[7]?.v) || 0,
        fechaInicio: cells[8]?.v || '',
        ultimoContacto: cells[9]?.v || '',
        responsable: cells[10]?.v || '',
        notas: cells[11]?.v || '',
      }
    }).filter((c: ClienteGoogleSheet) => c.id && c.id !== 'ID')

    return clientes
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    return []
  }
}

// ==================== ONBOARDING ====================

export interface OnboardingGoogleSheet {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  etapa: string
  progreso: number
  fechaInicio: string
  responsable: string
  siguientePaso: string
  briefCompletado: boolean
  kickoffAgendado: boolean
  documentosRecibidos: boolean
  proyectoCreado: boolean
}

// Obtener ONBOARDING del Google Sheet
export async function fetchOnboardingFromGoogleSheet(): Promise<OnboardingGoogleSheet[]> {
  try {
    const response = await fetch(ONBOARDING_URL)
    const text = await response.text()
    
    const data = parseGoogleSheetsResponse(text)
    
    if (!data.table || !data.table.rows) {
      return []
    }

    const onboarding: OnboardingGoogleSheet[] = data.table.rows.map((row: any) => {
      const cells = row.c || []
      return {
        id: cells[0]?.v || '',
        nombre: cells[1]?.v || '',
        empresa: cells[2]?.v || '',
        email: cells[3]?.v || '',
        telefono: cells[4]?.v || '',
        etapa: cells[5]?.v || 'Bienvenida',
        progreso: Number(cells[6]?.v) || 0,
        fechaInicio: cells[7]?.v || '',
        responsable: cells[8]?.v || '',
        siguientePaso: cells[9]?.v || '',
        briefCompletado: cells[10]?.v === 'Sí',
        kickoffAgendado: cells[11]?.v === 'Sí',
        documentosRecibidos: cells[12]?.v === 'Sí',
        proyectoCreado: cells[13]?.v === 'Sí',
      }
    }).filter((c: OnboardingGoogleSheet) => c.id && c.id !== 'ID')

    return onboarding
  } catch (error) {
    console.error('Error al obtener onboarding:', error)
    return []
  }
}

// ==================== INGRESOS MENSUALES ====================

export interface IngresoGoogleSheet {
  tipoDeGasto: string
  monto: number
  dia: number
  mes: number
  año: number
}

// Obtener INGRESOS del Google Sheet
export async function fetchIngresosFromGoogleSheet(): Promise<IngresoGoogleSheet[]> {
  try {
    const response = await fetch(INGRESOS_URL)
    const text = await response.text()
    
    const data = parseGoogleSheetsResponse(text)
    
    if (!data.table || !data.table.rows) {
      return []
    }

    const ingresos: IngresoGoogleSheet[] = data.table.rows.map((row: any) => {
      const cells = row.c || []
      return {
        tipoDeGasto: cells[0]?.v || '',
        monto: Number(cells[1]?.v) || 0,
        dia: Number(cells[2]?.v) || 0,
        mes: Number(cells[3]?.v) || 0,
        año: Number(cells[4]?.v) || 0,
      }
    }).filter((c: IngresoGoogleSheet) => c.tipoDeGasto && c.tipoDeGasto !== 'Tipo de gasto')

    return ingresos
  } catch (error) {
    console.error('Error al obtener ingresos:', error)
    return []
  }
}

// ==================== GASTOS MENSUALES ====================

export interface GastoGoogleSheet {
  tipoDeGasto: string
  importe: number
  dia: number
  mes: number
  año: number
}

// Obtener GASTOS del Google Sheet
export async function fetchGastosFromGoogleSheet(): Promise<GastoGoogleSheet[]> {
  try {
    const response = await fetch(GASTOS_URL)
    const text = await response.text()
    
    const data = parseGoogleSheetsResponse(text)
    
    if (!data.table || !data.table.rows) {
      return []
    }

    const gastos: GastoGoogleSheet[] = data.table.rows.map((row: any) => {
      const cells = row.c || []
      return {
        tipoDeGasto: cells[0]?.v || '',
        importe: Number(cells[1]?.v) || 0,
        dia: Number(cells[2]?.v) || 0,
        mes: Number(cells[3]?.v) || 0,
        año: Number(cells[4]?.v) || 0,
      }
    }).filter((c: GastoGoogleSheet) => c.tipoDeGasto && c.tipoDeGasto !== 'Tipo de gasto')

    return gastos
  } catch (error) {
    console.error('Error al obtener gastos:', error)
    return []
  }
}

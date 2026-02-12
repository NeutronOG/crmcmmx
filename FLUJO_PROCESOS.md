# Flujo de Procesos del CRM - Agencia de Marketing

## Diagrama de Flujo Principal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CRM - CENTRAL MKT                                   │
│                                 (Dashboard)                                      │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ÁREA NUEVO NEGOCIO / BRANDING                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│  1. LEADS (/leads)                                                               │
│     └── Captura de prospectos                                                    │
│     └── Calificación                                                             │
│     └── Seguimiento inicial                                                      │
│                    │                                                             │
│                    ▼                                                             │
│  2. OPORTUNIDADES (/nuevo-negocio)                                               │
│     └── Evaluación de necesidades                                                │
│     └── Propuesta de servicios                                                   │
│     └── Probabilidad de cierre                                                   │
│                    │                                                             │
│                    ▼                                                             │
│  3. COTIZACIONES (/cotizaciones)                                                 │
│     └── Creación de cotización                                                   │
│     └── Negociación                                                              │
│     └── Seguimiento                                                              │
│     └── Aprobación/Rechazo                                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ (Cotización Aprobada)
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              IMPLEMENTAR AL CRM                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  4. CLIENTES (/clients)                                                          │
│     └── Registro de cliente                                                      │
│     └── Datos de contacto                                                        │
│     └── Historial de proyectos                                                   │
│                    │                                                             │
│                    ▼                                                             │
│  5. PROYECTOS (/projects)                                                        │
│     └── Creación de proyecto                                                     │
│     └── Definición de alcance                                                    │
│     └── Asignación de equipo                                                     │
│     └── Timeline y milestones                                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                      ▼
┌───────────────────────────────────┐    ┌───────────────────────────────────────┐
│   PRODUCTOS / DISEÑO GRÁFICO      │    │     CREADORES DE CONTENIDO            │
│        (/productos)               │    │          (/creadores)                 │
├───────────────────────────────────┤    ├───────────────────────────────────────┤
│ • Diseño Gráfico                  │    │ • Asignación de creadores             │
│ • Pantallas UI/UX                 │    │ • Seguimiento de entregas             │
│ • Contenido Visual                │    │ • Control de calidad                  │
│ • Video & Motion                  │    │ • Evaluación de desempeño             │
│ • Ilustraciones                   │    │                                       │
│ • Templates                       │    │                                       │
└───────────────────────────────────┘    └───────────────────────────────────────┘
                    │                                      │
                    └──────────────────┬───────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SEGUIMIENTO Y CALIDAD                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  6. RESPONSABLES (/responsables)                                                 │
│     └── Asignación de tareas                                                     │
│     └── Carga de trabajo                                                         │
│     └── Progreso de proyectos                                                    │
│     └── Métricas de rendimiento                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ (Proyecto Completado)
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           NÓMINA Y PORCENTAJES                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  7. FACTURACIÓN (/invoices)                                                      │
│     └── Generación de facturas                                                   │
│     └── Seguimiento de pagos                                                     │
│     └── Cobros pendientes                                                        │
│                    │                                                             │
│                    ▼                                                             │
│  8. NÓMINA (/nomina)                                                             │
│     └── Cálculo de comisiones                                                    │
│     └── Porcentajes por rol                                                      │
│     └── Pagos al equipo                                                          │
│     └── Historial de pagos                                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    OBJETIVO: FLUJO CONSTANTE Y AUTOMATIZADO                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  9. REPORTES (/reports)                                                          │
│     └── Métricas de ventas                                                       │
│     └── Rendimiento del equipo                                                   │
│     └── Análisis financiero                                                      │
│     └── Proyecciones                                                             │
│                                                                                  │
│  10. COMUNICACIONES (/communications)                                            │
│     └── Historial de interacciones                                               │
│     └── Seguimiento de clientes                                                  │
│     └── Notificaciones                                                           │
└─────────────────────────────────────────────────────────────────────────────────┘

## Relación entre Módulos

| Origen | Acción | Destino |
|--------|--------|---------|
| Lead | Calificar | Oportunidad |
| Oportunidad | Cotizar | Cotización |
| Cotización | Aprobar | Proyecto + Cliente |
| Proyecto | Asignar | Responsables + Creadores |
| Proyecto | Producir | Productos |
| Productos | Entregar | Facturación |
| Facturación | Cobrar | Nómina (Comisiones) |
| Todo | Analizar | Reportes |

## Estados del Flujo

### Leads
- Nuevo → Contactado → Calificado → Convertido/Descartado

### Cotizaciones
- Borrador → Enviada → En Negociación → Aprobada/Rechazada

### Proyectos
- Planificación → En Progreso → En Revisión → Completado

### Productos
- Pendiente → En Progreso → En Revisión → Completado

### Pagos
- Pendiente → Procesando → Pagado

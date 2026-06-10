# 🚀 Central Marketing CRM - Sistema Integral de Gestión

**Versión:** 1.0 | **Última actualización:** 13 de mayo de 2026

---

## 📋 Descripción General

**Central Marketing CRM** es una plataforma empresarial moderna y escalable diseñada para agencias de marketing y publicidad. Integra herramientas avanzadas de gestión comercial, producción y colaboración, potenciadas con **inteligencia artificial** para optimizar procesos y mejorar la toma de decisiones.

---

## 🏗️ Arquitectura de Módulos

### **MÓDULOS PRINCIPALES (8 Módulos)**

```
1️⃣  📊 DASHBOARD
    └─ Panel de control principal
    
2️⃣  🎯 NEGOCIO
    ├─ 📝 Cotizaciones
    ├─ 🎯 Leads (Prospección)
    └─ 👥 Clientes
    
3️⃣  🎨 PRODUCCIÓN
    ├─ 💼 Proyectos
    ├─ 🎬 Creadores
    ├─ 👨‍💼 Responsables
    └─ ✅ Tareas
    
4️⃣  💡 IDEA ROOM
    └─ Brainstorming colaborativo
    
5️⃣  📅 CALENDARIO
    └─ Gestión de eventos y deadlines
    
6️⃣  📞 VIDEOLLAMADAS
    └─ Comunicación en tiempo real
    
7️⃣  💰 FINANZAS
    ├─ 📄 Facturación
    └─ 💵 Nómina y Porcentajes
    
8️⃣  📊 REPORTES
    └─ Análisis e inteligencia de negocios
```

---

## 🧠 Inteligencia Artificial Integrada

El CRM incorpora capacidades IA en múltiples capas:

### **🤖 Aplicaciones de IA Actuales y Futuras**

| Módulo | Aplicación IA | Beneficio |
|--------|---------------|----------|
| **Leads** | Scoring automático de prospectos | Priorización inteligente de clientes potenciales |
| **Tareas** | Asignación inteligente de recursos | Optimización de carga de trabajo por capacidad |
| **Reportes** | Análisis predictivo | Forecasting de ventas y tendencias |
| **Cotizaciones** | Sugerencias de precios dinámicos | Maximización de margen con análisis de mercado |
| **Idea Room** | Generación de ideas asistida | Inspiración y síntesis automática de conceptos |
| **Proyectos** | Estimación de tiempos y costos | Predicción automática de duraciones y presupuestos |

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 16** - Framework React moderno con SSR/SSG
- **React 19** - Interfaz de usuario reactiva
- **TypeScript** - Tipado estático para mayor seguridad
- **Tailwind CSS 4** - Diseño responsive y utility-first
- **Radix UI** - Componentes accesibles (30+ librerías)
- **Recharts** - Visualización de datos
- **Lucide React** - Iconografía moderna

### **Backend & Datos**
- **Supabase** - Base de datos PostgreSQL + autenticación
- **XLSX/File-Saver** - Generación de reportes en Excel
- **LocalStorage + Auth** - Sistema de sesiones local

### **Características Especiales**
- **Biometric Authentication** - Autenticación por huella dactilar/facial
- **Dark Mode** - Tema adaptable con next-themes
- **Liquid Background** - Efectos visuales modernos
- **Toast Notifications** - Sistema de notificaciones (sonner)
- **Drag & Drop** - Interfaces intuitivas con arrastrable

---

## 👥 Sistema de Roles y Permisos

El CRM implementa un **sistema granular de control de acceso (RBAC)** con 21 roles especializados:

### **Roles Administrativos**
- **Admin** - Acceso total al sistema
- **Dueño** - Acceso ejecutivo y reportes
- **Administración** - Gestión operativa

### **Roles Comerciales**
- **Ejecutivo de Cuenta** - Gestión de relaciones cliente
- **Coordinador de Marketing** - Supervisión de campañas
- **Auxiliar de Marketing** - Tareas operativas

### **Roles de Producción**
- **Coordinador de Diseño** - Supervisión creativa
- **Diseñador Gráfico** - Diseño visual
- **Diseñador Industrial** - Diseño de productos
- **Producción Audiovisual** - Contenido multimedia
- **Producción de Activaciones** - Eventos y experiencias

### **Roles de Contenido**
- **Creador de Contenido** - Producción de contenido
- **Creador de Parrilla** - Planificación editorial
- **Marketing Digital** - Marketing online

### **Otros Roles**
- **Contabilidad** - Gestión financiera
- **IA** - Especialista en automatización
- **Tareas** - Gestor de actividades
- **Influencer** - Gestión de influencers
- **Freelancer** - Colaboradores externos

---

## 📊 Estructura de Datos

### **Entidades Principales**

```
🗄️ USUARIOS
├─ ID, Nombre, Email
├─ Rol (con permisos específicos)
├─ Avatar, Contraseña
└─ Autenticación Biométrica

📋 LEADS
├─ Prospecto, Contacto
├─ Estado (Nuevo → Propuesta → Negociación)
├─ Valor, Fuente
└─ Historial de interacciones

👥 CLIENTES
├─ Empresa, Contacto
├─ Historial de proyectos
├─ Comunicaciones
└─ Información comercial

💼 PROYECTOS
├─ Nombre, Descripción
├─ Equipo asignado
├─ Fases y hitos
├─ Presupuesto
└─ Archivos adjuntos

✅ TAREAS
├─ Descripción, Asignado a
├─ Prioridad, Estado
├─ Evidencias y comentarios
└─ Notificaciones

💡 IDEAS (Idea Room)
├─ Concepto, Descripción
├─ Colaboradores
├─ Reacciones y comentarios
└─ Evolución a proyecto

📅 EVENTOS (Calendario)
├─ Tipo (Reunión, Deadline)
├─ Participantes
└─ Recordatorios

💰 FACTURAS
├─ Concepto, Monto
├─ Cliente, Período
├─ Estado de pago
└─ Impuestos

💵 NÓMINA
├─ Empleado, Período
├─ Salario, Porcentajes
└─ Beneficios
```

---

## 🔐 Seguridad

✅ **Autenticación Biométrica** - Soporte para huella dactilar y reconocimiento facial  
✅ **Control de Acceso Basado en Roles (RBAC)** - Permisos granulares por sección  
✅ **Variables de Entorno** - Credenciales seguras  
✅ **Sesiones Locales** - Gestión de autenticación con localStorage  
✅ **Auditoría de Acceso** - Registro de cambios (en Supabase)  

---

## 📱 Características UX/UI

- **Interfaz Dinámica** - Navegación en "isla dinámica" tipo iPhone
- **Responsive Design** - Funciona en desktop, tablet y móvil
- **Dark/Light Mode** - Temas visuales adaptables
- **Drag & Drop** - Interfaces intuitivas (Kanban, Pipeline)
- **Notificaciones Real-time** - Sistema de alertas
- **Búsqueda Global** - Filtrado de usuarios y datos
- **Exportación de Datos** - Generación de reportes en Excel
- **Filtros Avanzados** - Búsqueda por múltiples criterios

---

## 🚀 Capacidades Futuras (Roadmap IA)

🔮 **Predicción de Churn** - Identificar clientes en riesgo  
🔮 **Análisis de Sentimiento** - Evaluar comunicaciones  
🔮 **Automatización de Procesos** - RPA para tareas repetitivas  
🔮 **Recomendaciones Personalizadas** - Sugerencias basadas en comportamiento  
🔮 **Chatbot Inteligente** - Asistente IA 24/7  
🔮 **Análisis de Texto** - Extracción automática de información  

---

## � Plan de Precios y Pagos

### **Inversión Total: 225% en 3 Entregas**

| Fase | Porcentaje | Descripción | Condición |
|------|-----------|------------|-----------|
| **1️⃣ Anticipo** | **50%** | Inicio de desarrollo e implementación | Al firmar contrato |
| **2️⃣ Segunda Entrega** | **30%** | Fase media - 50% funcionalidades completadas | Dependiendo avance y entregas |
| **3️⃣ Entrega Final** | **20%** | Implementación completa y capacitación | Al finalizar todas las entregas |

**📅 Cronograma Flexible:**
- Las fechas se ajustan según el progreso del trabajo entregado
- Validación de hitos con el cliente
- Ajustes y cambios de scope durante el desarrollo

---

## 📈 Métricas Clave

- **8 Módulos Principales** en la barra de navegación dinámica
- **21 Roles** con permisos configurables
- **30+ Componentes UI** de Radix UI
- **8 Módulos Arquitectónicos** (app, components, lib, hooks, etc.)
- **100% TypeScript** - Tipado completo del proyecto
- **Responsive** - Mobile-first design
- **Realtime Updates** - Integración Supabase con WebSockets

---

## 🎯 Casos de Uso

✨ **Agencias de Marketing** - Gestión completa de proyectos y clientes  
✨ **Equipos Creativos** - Colaboración en tiempo real  
✨ **Empresas de Servicios** - Facturación y seguimiento  
✨ **Startups** - CRM escalable sin infraestructura compleja  
✨ **Equipos Distribuidos** - Comunicación y sincronización  

---

## 📞 Contacto & Soporte

**Plataforma:** Central Marketing CRM  
**Versión:** 1.0  
**Estado:** En Producción  
**Última actualización:** 13/05/2026

---

<div align="center">

### Powered by Next.js, React, TypeScript & AI 🧠

**Central Marketing - Transformando la gestión comercial con tecnología**

</div>

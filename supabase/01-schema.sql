-- =============================================
-- Central Marketing CRM - Schema
-- Ejecutar en Supabase SQL Editor (en orden)
-- =============================================

-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  rol TEXT NOT NULL DEFAULT 'freelancer',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios visibles para autenticados" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Admin puede modificar usuarios" ON usuarios FOR ALL USING (true);

-- 2. CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  nombre TEXT NOT NULL,
  empresa TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telefono TEXT DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'Prospecto',
  etapa_onboarding TEXT DEFAULT 'Bienvenida',
  valor_mensual NUMERIC DEFAULT 0,
  fecha_inicio DATE,
  ultimo_contacto DATE,
  responsable TEXT DEFAULT '',
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clientes visibles" ON clientes FOR SELECT USING (true);
CREATE POLICY "Clientes modificables" ON clientes FOR ALL USING (true);

-- 3. LEADS
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  nombre TEXT NOT NULL,
  empresa TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telefono TEXT DEFAULT '',
  origen TEXT DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'Nuevo',
  valor_estimado NUMERIC DEFAULT 0,
  probabilidad INTEGER DEFAULT 0,
  fecha_creacion DATE DEFAULT CURRENT_DATE,
  ultimo_contacto DATE,
  responsable TEXT DEFAULT '',
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leads visibles" ON leads FOR SELECT USING (true);
CREATE POLICY "Leads modificables" ON leads FOR ALL USING (true);

-- 4. PROYECTOS
CREATE TABLE IF NOT EXISTS proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  nombre TEXT NOT NULL,
  cliente TEXT DEFAULT '',
  tipo TEXT DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'Planificación',
  fecha_inicio DATE,
  fecha_entrega DATE,
  presupuesto NUMERIC DEFAULT 0,
  responsable TEXT DEFAULT '',
  progreso INTEGER DEFAULT 0,
  descripcion TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Proyectos visibles" ON proyectos FOR SELECT USING (true);
CREATE POLICY "Proyectos modificables" ON proyectos FOR ALL USING (true);

-- 5. EMPLEADOS
CREATE TABLE IF NOT EXISTS empleados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  rol TEXT DEFAULT '',
  salario_base NUMERIC DEFAULT 0,
  porcentaje_comision NUMERIC DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'Activo',
  fecha_ingreso DATE,
  proyectos_activos INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Empleados visibles" ON empleados FOR SELECT USING (true);
CREATE POLICY "Empleados modificables" ON empleados FOR ALL USING (true);

-- 6. COTIZACIONES
CREATE TABLE IF NOT EXISTS cotizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  cliente TEXT DEFAULT '',
  proyecto TEXT DEFAULT '',
  valor NUMERIC DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'Borrador',
  fecha_creacion DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  seguimientos INTEGER DEFAULT 0,
  responsable TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cotizaciones visibles" ON cotizaciones FOR SELECT USING (true);
CREATE POLICY "Cotizaciones modificables" ON cotizaciones FOR ALL USING (true);

-- 7. ONBOARDING
CREATE TABLE IF NOT EXISTS onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  nombre TEXT NOT NULL,
  empresa TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telefono TEXT DEFAULT '',
  etapa TEXT NOT NULL DEFAULT 'Bienvenida',
  progreso INTEGER DEFAULT 0,
  fecha_inicio DATE,
  responsable TEXT DEFAULT '',
  siguiente_paso TEXT DEFAULT '',
  brief_completado BOOLEAN DEFAULT FALSE,
  kickoff_agendado BOOLEAN DEFAULT FALSE,
  documentos_recibidos BOOLEAN DEFAULT FALSE,
  proyecto_creado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Onboarding visible" ON onboarding FOR SELECT USING (true);
CREATE POLICY "Onboarding modificable" ON onboarding FOR ALL USING (true);

-- 8. TAREAS
CREATE TABLE IF NOT EXISTS tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  proyecto TEXT DEFAULT '',
  cliente TEXT DEFAULT '',
  asignado TEXT DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  prioridad TEXT NOT NULL DEFAULT 'Media',
  fecha_creacion DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  fecha_completada DATE,
  etiquetas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tareas visibles" ON tareas FOR SELECT USING (true);
CREATE POLICY "Tareas modificables" ON tareas FOR ALL USING (true);

-- 9. EVIDENCIAS (relacionadas a tareas)
CREATE TABLE IF NOT EXISTS evidencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'archivo',
  url TEXT NOT NULL,
  fecha_subida DATE DEFAULT CURRENT_DATE,
  tamaño BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE evidencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Evidencias visibles" ON evidencias FOR SELECT USING (true);
CREATE POLICY "Evidencias modificables" ON evidencias FOR ALL USING (true);

-- 10. INGRESOS
CREATE TABLE IF NOT EXISTS ingresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_de_gasto TEXT NOT NULL DEFAULT '',
  monto NUMERIC DEFAULT 0,
  dia INTEGER DEFAULT 0,
  mes INTEGER DEFAULT 0,
  año INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ingresos visibles" ON ingresos FOR SELECT USING (true);
CREATE POLICY "Ingresos modificables" ON ingresos FOR ALL USING (true);

-- 11. GASTOS
CREATE TABLE IF NOT EXISTS gastos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_de_gasto TEXT NOT NULL DEFAULT '',
  importe NUMERIC DEFAULT 0,
  dia INTEGER DEFAULT 0,
  mes INTEGER DEFAULT 0,
  año INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gastos visibles" ON gastos FOR SELECT USING (true);
CREATE POLICY "Gastos modificables" ON gastos FOR ALL USING (true);

-- =============================================
-- FUNCIÓN para auto-actualizar updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER proyectos_updated_at BEFORE UPDATE ON proyectos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER empleados_updated_at BEFORE UPDATE ON empleados FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cotizaciones_updated_at BEFORE UPDATE ON cotizaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER onboarding_updated_at BEFORE UPDATE ON onboarding FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tareas_updated_at BEFORE UPDATE ON tareas FOR EACH ROW EXECUTE FUNCTION update_updated_at();

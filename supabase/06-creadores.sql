-- =============================================
-- Central Marketing CRM - Creadores de Contenido
-- Ejecutar DESPUÉS de 01-schema.sql
-- =============================================

-- 1. CREADORES
CREATE TABLE IF NOT EXISTS creadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT,
  especialidad TEXT NOT NULL DEFAULT '',
  tarifa TEXT DEFAULT '',
  estado TEXT DEFAULT 'Disponible',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE creadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creadores visibles" ON creadores FOR SELECT USING (true);
CREATE POLICY "Creadores modificables" ON creadores FOR ALL USING (true);

-- 2. CALIFICACIONES (cada admin/dueño puede calificar a cada creador)
CREATE TABLE IF NOT EXISTS creador_calificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creador_id UUID NOT NULL REFERENCES creadores(id) ON DELETE CASCADE,
  evaluador TEXT NOT NULL,
  calidad_visual INTEGER CHECK (calidad_visual BETWEEN 1 AND 5) DEFAULT 3,
  puntualidad INTEGER CHECK (puntualidad BETWEEN 1 AND 5) DEFAULT 3,
  creatividad INTEGER CHECK (creatividad BETWEEN 1 AND 5) DEFAULT 3,
  comunicacion INTEGER CHECK (comunicacion BETWEEN 1 AND 5) DEFAULT 3,
  seguimiento_brief INTEGER CHECK (seguimiento_brief BETWEEN 1 AND 5) DEFAULT 3,
  comentario TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creador_id, evaluador)
);

ALTER TABLE creador_calificaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Calificaciones visibles" ON creador_calificaciones FOR SELECT USING (true);
CREATE POLICY "Calificaciones modificables" ON creador_calificaciones FOR ALL USING (true);

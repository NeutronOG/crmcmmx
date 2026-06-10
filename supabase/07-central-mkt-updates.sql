-- =============================================
-- 07 - Central MKT Updates
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. Agregar columnas de Drive y Videollamada a proyectos
ALTER TABLE proyectos
  ADD COLUMN IF NOT EXISTS drive_url TEXT,
  ADD COLUMN IF NOT EXISTS videollamada_url TEXT;

-- 2. Actualizar CHECK constraint de estado en proyectos para incluir nuevas etapas
-- Primero eliminamos el constraint existente si existe
ALTER TABLE proyectos DROP CONSTRAINT IF EXISTS proyectos_estado_check;

-- Luego agregamos el nuevo con todas las etapas
ALTER TABLE proyectos
  ADD CONSTRAINT proyectos_estado_check
  CHECK (estado IN (
    'Brief',
    'Propuesta',
    'Planificación',
    'Revisión Interna',
    'Revisión Cliente',
    'En Progreso',
    'En Revisión',
    'Completado',
    'Pausado'
  ));

-- 3. Tabla creadores (crearla si no existe con tipo incluido, o agregar columna si ya existe)
CREATE TABLE IF NOT EXISTS creadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT,
  tipo TEXT DEFAULT 'Freelancer',
  especialidad TEXT NOT NULL DEFAULT '',
  tarifa TEXT DEFAULT '',
  estado TEXT DEFAULT 'Disponible',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la tabla ya existía sin la columna tipo, agregarla
ALTER TABLE creadores ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'Freelancer';

-- RLS para creadores (idempotente)
ALTER TABLE creadores ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creadores' AND policyname = 'Creadores visibles') THEN
    CREATE POLICY "Creadores visibles" ON creadores FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creadores' AND policyname = 'Creadores modificables') THEN
    CREATE POLICY "Creadores modificables" ON creadores FOR ALL USING (true);
  END IF;
END $$;

-- Tabla de calificaciones de creadores (si no existe)
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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creador_calificaciones' AND policyname = 'Calificaciones visibles') THEN
    CREATE POLICY "Calificaciones visibles" ON creador_calificaciones FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creador_calificaciones' AND policyname = 'Calificaciones modificables') THEN
    CREATE POLICY "Calificaciones modificables" ON creador_calificaciones FOR ALL USING (true);
  END IF;
END $$;

-- 4. Agregar columna titulo_subrayado a tareas
ALTER TABLE tareas
  ADD COLUMN IF NOT EXISTS titulo_subrayado BOOLEAN DEFAULT FALSE;

-- 5. Crear tabla de subtareas
CREATE TABLE IF NOT EXISTS subtareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  completada BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por tarea
CREATE INDEX IF NOT EXISTS idx_subtareas_tarea_id ON subtareas(tarea_id);

-- RLS para subtareas
ALTER TABLE subtareas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subtareas' AND policyname = 'Authenticated users can read subtareas') THEN
    CREATE POLICY "Authenticated users can read subtareas"
      ON subtareas FOR SELECT
      USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subtareas' AND policyname = 'Authenticated users can insert subtareas') THEN
    CREATE POLICY "Authenticated users can insert subtareas"
      ON subtareas FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subtareas' AND policyname = 'Authenticated users can update subtareas') THEN
    CREATE POLICY "Authenticated users can update subtareas"
      ON subtareas FOR UPDATE
      USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subtareas' AND policyname = 'Authenticated users can delete subtareas') THEN
    CREATE POLICY "Authenticated users can delete subtareas"
      ON subtareas FOR DELETE
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- =============================================
-- Verificación
-- =============================================
SELECT 'proyectos drive_url' AS campo, COUNT(*) AS filas FROM proyectos LIMIT 1;
SELECT 'subtareas tabla' AS tabla, COUNT(*) AS filas FROM subtareas;

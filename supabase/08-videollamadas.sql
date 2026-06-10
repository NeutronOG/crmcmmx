-- =============================================
-- 08 - Videollamadas
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. Tabla principal de videollamadas
CREATE TABLE IF NOT EXISTS videollamadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'Interna',
  room_id TEXT NOT NULL UNIQUE,
  descripcion TEXT DEFAULT '',
  proyecto_nombre TEXT,
  cliente_nombre TEXT,
  creado_por TEXT NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de participantes de videollamadas
CREATE TABLE IF NOT EXISTS videollamada_participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  videollamada_id UUID NOT NULL REFERENCES videollamadas(id) ON DELETE CASCADE,
  usuario_nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (videollamada_id, usuario_nombre)
);

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_videollamadas_activa ON videollamadas(activa);
CREATE INDEX IF NOT EXISTS idx_videollamada_participantes_vid ON videollamada_participantes(videollamada_id);

-- 4. RLS
ALTER TABLE videollamadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE videollamada_participantes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videollamadas' AND policyname = 'Videollamadas visibles') THEN
    CREATE POLICY "Videollamadas visibles"
      ON videollamadas FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videollamadas' AND policyname = 'Videollamadas modificables') THEN
    CREATE POLICY "Videollamadas modificables"
      ON videollamadas FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videollamada_participantes' AND policyname = 'VL participantes visibles') THEN
    CREATE POLICY "VL participantes visibles"
      ON videollamada_participantes FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videollamada_participantes' AND policyname = 'VL participantes modificables') THEN
    CREATE POLICY "VL participantes modificables"
      ON videollamada_participantes FOR ALL USING (true);
  END IF;
END $$;

-- =============================================
-- Verificación
-- =============================================
SELECT 'videollamadas tabla' AS tabla, COUNT(*) AS filas FROM videollamadas;
SELECT 'videollamada_participantes tabla' AS tabla, COUNT(*) AS filas FROM videollamada_participantes;

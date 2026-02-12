-- =============================================
-- Central Marketing CRM - Idea Room, Notificaciones, Calendario
-- Ejecutar en Supabase SQL Editor después de 01-03
-- =============================================

-- 1. IDEA ROOMS (por proyecto, admin selecciona participantes)
CREATE TABLE IF NOT EXISTS idea_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  descripcion TEXT DEFAULT '',
  creado_por TEXT NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE idea_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Idea rooms visibles" ON idea_rooms FOR SELECT USING (true);
CREATE POLICY "Idea rooms modificables" ON idea_rooms FOR ALL USING (true);

-- 2. PARTICIPANTES DE IDEA ROOM
CREATE TABLE IF NOT EXISTS idea_room_participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_room_id UUID NOT NULL REFERENCES idea_rooms(id) ON DELETE CASCADE,
  usuario_nombre TEXT NOT NULL,
  rol TEXT DEFAULT 'participante',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_room_id, usuario_nombre)
);

ALTER TABLE idea_room_participantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participantes visibles" ON idea_room_participantes FOR SELECT USING (true);
CREATE POLICY "Participantes modificables" ON idea_room_participantes FOR ALL USING (true);

-- 3. MENSAJES DE IDEA ROOM
CREATE TABLE IF NOT EXISTS idea_room_mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_room_id UUID NOT NULL REFERENCES idea_rooms(id) ON DELETE CASCADE,
  autor TEXT NOT NULL,
  contenido TEXT NOT NULL,
  tipo TEXT DEFAULT 'mensaje',
  archivo_url TEXT,
  archivo_nombre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE idea_room_mensajes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mensajes visibles" ON idea_room_mensajes FOR SELECT USING (true);
CREATE POLICY "Mensajes modificables" ON idea_room_mensajes FOR ALL USING (true);

-- 4. NOTIFICACIONES
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_destino TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'info',
  titulo TEXT NOT NULL,
  mensaje TEXT DEFAULT '',
  enlace TEXT DEFAULT '',
  leida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notificaciones visibles" ON notificaciones FOR SELECT USING (true);
CREATE POLICY "Notificaciones modificables" ON notificaciones FOR ALL USING (true);

-- 5. EVENTOS DE CALENDARIO
CREATE TABLE IF NOT EXISTS eventos_calendario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ,
  todo_el_dia BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT '#6366f1',
  tipo TEXT DEFAULT 'evento',
  importancia TEXT DEFAULT 'media',
  usuario TEXT NOT NULL,
  participantes TEXT[] DEFAULT '{}',
  proyecto TEXT DEFAULT '',
  tarea_id UUID REFERENCES tareas(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: add columns if table already exists
ALTER TABLE eventos_calendario ADD COLUMN IF NOT EXISTS importancia TEXT DEFAULT 'media';
ALTER TABLE eventos_calendario ADD COLUMN IF NOT EXISTS participantes TEXT[] DEFAULT '{}';

ALTER TABLE eventos_calendario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eventos visibles" ON eventos_calendario FOR SELECT USING (true);
CREATE POLICY "Eventos modificables" ON eventos_calendario FOR ALL USING (true);

-- Triggers
CREATE TRIGGER idea_rooms_updated_at BEFORE UPDATE ON idea_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER eventos_calendario_updated_at BEFORE UPDATE ON eventos_calendario FOR EACH ROW EXECUTE FUNCTION update_updated_at();

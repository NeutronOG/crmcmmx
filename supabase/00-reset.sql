-- =============================================
-- RESET: Borrar TODOS los datos de todas las tablas
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Orden correcto (respetando foreign keys)
TRUNCATE evidencias CASCADE;
TRUNCATE idea_room_mensajes CASCADE;
TRUNCATE idea_room_participantes CASCADE;
TRUNCATE idea_rooms CASCADE;
TRUNCATE notificaciones CASCADE;
TRUNCATE eventos_calendario CASCADE;
TRUNCATE tareas CASCADE;
TRUNCATE cotizaciones CASCADE;
TRUNCATE onboarding CASCADE;
TRUNCATE empleados CASCADE;
TRUNCATE proyectos CASCADE;
TRUNCATE leads CASCADE;
TRUNCATE clientes CASCADE;
TRUNCATE gastos CASCADE;
TRUNCATE ingresos CASCADE;
TRUNCATE usuarios CASCADE;

-- Re-insertar usuarios base
INSERT INTO usuarios (nombre, email, rol) VALUES
  ('Neyda', 'neyda@centralmarketing.mx', 'admin'),
  ('Guillermo', 'guillermo@centralmarketing.mx', 'dueno');

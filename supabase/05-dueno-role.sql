-- =============================================
-- 05: Rol Dueño + Usuario Guillermo + Renombrar Admin
-- =============================================
-- Ejecutar en Supabase SQL Editor

-- Renombrar admin a Neyda
UPDATE usuarios SET nombre = 'Neyda', email = 'neyda@centralmarketing.mx' WHERE email = 'admin@centralmarketing.com';

-- Insertar usuario Guillermo como dueño
INSERT INTO usuarios (nombre, email, rol) VALUES
  ('Guillermo', 'guillermo@centralmarketing.mx', 'dueno')
ON CONFLICT (email) DO UPDATE SET rol = 'dueno', nombre = 'Guillermo';

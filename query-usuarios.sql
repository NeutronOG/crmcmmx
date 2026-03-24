-- =============================================
-- Query para extraer Correo, Rol y Password de Usuarios
-- Ejecutar en Supabase SQL Editor
-- =============================================

SELECT 
  email,
  rol,
  password,
  nombre
FROM usuarios
ORDER BY nombre ASC;

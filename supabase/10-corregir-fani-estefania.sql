-- =============================================
-- 10 - Corregir: Fani Ramos = Estefanía (Directora de Producción Audiovisual)
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- =============================================
-- Fani Ramos = Directora de Producción Audiovisual
-- Mantener nombre y email, cambiar solo el rol
-- =============================================

UPDATE usuarios 
SET 
  rol = 'dir_produccion',
  password = 'FaniRamos2026!CMMX'
WHERE email = 'fani.ramos@cmmx.mx';

-- =============================================
-- VERIFICACIÓN
-- =============================================
SELECT nombre, email, rol, password FROM usuarios WHERE email = 'estefania@cmmx.mx';
SELECT nombre, email, rol, password FROM usuarios WHERE email = 'fani.ramos@cmmx.mx';

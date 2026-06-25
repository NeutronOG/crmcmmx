-- =============================================
-- Establecer contraseñas para Fani y Paloma
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Paloma Rivera - Coordinadora de Marketing
UPDATE usuarios 
SET password = 'PalomaRivera2026!CMMX' 
WHERE email = 'paloma.rivera@cmmx.mx';

-- Fani Ramos - Auxiliar de Marketing  
UPDATE usuarios 
SET password = 'FaniRamos2026!CMMX' 
WHERE email = 'fani.ramos@cmmx.mx';

-- Verificación
SELECT nombre, email, rol, password 
FROM usuarios 
WHERE email IN ('paloma.rivera@cmmx.mx', 'fani.ramos@cmmx.mx');

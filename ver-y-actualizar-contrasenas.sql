-- =============================================
-- Ver contraseñas actuales y establecer nuevas
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. VER CONTRASEÑAS ACTUALES DE TODOS LOS USUARIOS
-- =============================================
SELECT 
  nombre,
  email,
  rol,
  password
FROM usuarios
ORDER BY nombre ASC;

-- =============================================
-- 2. ACTUALIZAR CONTRASEÑAS A DOMINIO @cmmx.mx
-- (Solo si cambiaste los emails previamente)
-- =============================================

-- Actualizar contraseñas para emails cambiados a @cmmx.mx
UPDATE usuarios 
SET password = 'Guillermo#Admin$2026Secure!' 
WHERE nombre ILIKE '%Guillermo%';

UPDATE usuarios 
SET password = 'Ian@CentralMkt2026!Secure' 
WHERE nombre ILIKE '%Ian%';

UPDATE usuarios 
SET password = 'Felipe$Secure2026@Admin!' 
WHERE nombre ILIKE '%Felipe%';

-- =============================================
-- 3. ESTABLECER CONTRASEÑAS PARA NUEVOS USUARIOS
-- =============================================

-- Paloma Rivera (Coordinadora de Marketing)
UPDATE usuarios 
SET password = 'PalomaRivera2026!CMMX' 
WHERE email = 'paloma.rivera@cmmx.mx' 
OR nombre ILIKE '%Paloma Rivera%';

-- Fani Ramos (Auxiliar de Marketing)
UPDATE usuarios 
SET password = 'FaniRamos2026!CMMX' 
WHERE email = 'fani.ramos@cmmx.mx' 
OR nombre ILIKE '%Fani Ramos%';

-- Móni (Coordinadora de Cuentas)
UPDATE usuarios 
SET password = 'Moni2026!CMMXSecure' 
WHERE email = 'moni@cmmx.mx' 
OR nombre ILIKE '%moni%';

-- Alexis (Legal)
UPDATE usuarios 
SET password = 'Alexis2026!CMMXLegal' 
WHERE email = 'alexis@cmmx.mx' 
OR nombre ILIKE '%alexis%';

-- Lesly (Auxiliar de Marketing)
UPDATE usuarios 
SET password = 'Lesly2026!CMMX' 
WHERE email = 'lesly@cmmx.mx' 
OR nombre ILIKE '%lesly%';

-- Estefanía (Directora Producción)
UPDATE usuarios 
SET password = 'Estefania2026!CMMX' 
WHERE email = 'estefania@cmmx.mx' 
OR nombre ILIKE '%estefan%';

-- Emiliano (Practicante Marketing)
UPDATE usuarios 
SET password = 'Emiliano2026!CMMX' 
WHERE email = 'emiliano@cmmx.mx' 
OR nombre ILIKE '%emiliano%';

-- Jorge (Practicante Marketing)
UPDATE usuarios 
SET password = 'Jorge2026!CMMX' 
WHERE email = 'jorge@cmmx.mx' 
OR nombre ILIKE '%jorge%';

-- Allison (Practicante Marketing)
UPDATE usuarios 
SET password = 'Allison2026!CMMX' 
WHERE email = 'allison@cmmx.mx' 
OR nombre ILIKE '%allison%';

-- Paloma Pliego (Directora Creativa Cédula 1)
UPDATE usuarios 
SET password = 'PalomaPliego2026!CMMX' 
WHERE email = 'paloma.pliego@cmmx.mx' 
OR nombre ILIKE '%paloma pliego%';

-- Vicente (Diseñador)
UPDATE usuarios 
SET password = 'Vicente2026!CMMX' 
WHERE email = 'vicente@cmmx.mx' 
OR nombre ILIKE '%vicente%';

-- Clarissa (Diseñadora)
UPDATE usuarios 
SET password = 'Clarissa2026!CMMX' 
WHERE email = 'clarissa@cmmx.mx' 
OR nombre ILIKE '%clarissa%';

-- Dalet (Directora Creativa Cédula 2)
UPDATE usuarios 
SET password = 'Dalet2026!CMMX' 
WHERE email = 'dalet@cmmx.mx' 
OR nombre ILIKE '%dalet%';

-- Ana Paola (Diseñadora)
UPDATE usuarios 
SET password = 'AnaPaola2026!CMMX' 
WHERE email = 'ana.paola@cmmx.mx' 
OR nombre ILIKE '%ana paola%';

-- Ana Luisa (Diseñadora)
UPDATE usuarios 
SET password = 'AnaLuisa2026!CMMX' 
WHERE email = 'ana.luisa@cmmx.mx' 
OR nombre ILIKE '%ana luisa%';

-- Daniel (Diseñador)
UPDATE usuarios 
SET password = 'Daniel2026!CMMX' 
WHERE email = 'daniel@cmmx.mx' 
OR nombre ILIKE '%daniel%';

-- =============================================
-- 4. VERIFICACIÓN FINAL - TODAS LAS CONTRASEÑAS
-- =============================================
SELECT 
  nombre,
  email,
  rol,
  password
FROM usuarios
WHERE email LIKE '%@cmmx.mx'
   OR email LIKE '%@centralmarketing%'
ORDER BY rol, nombre ASC;

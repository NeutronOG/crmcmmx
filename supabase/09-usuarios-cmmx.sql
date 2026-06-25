-- =============================================
-- 09 - Usuarios CMMX con dominio @cmmx.mx
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. ACTUALIZAR EMAILS EXISTENTES A @cmmx.mx
-- =============================================

-- Actualizar usuarios existentes de centralmarketing.com a cmmx.mx
-- Solo actualizar si el email NO termina ya en @cmmx.mx (evitar duplicados)
UPDATE usuarios SET email = 'guillermo@cmmx.mx' 
WHERE (email = 'guillermo@centralmarketing.mx' OR nombre ILIKE '%Guillermo%') 
AND email NOT LIKE '%@cmmx.mx';

UPDATE usuarios SET email = 'ian@cmmx.mx' 
WHERE (email = 'ian@centralmarketing.mx' OR nombre ILIKE '%Ian%') 
AND email NOT LIKE '%@cmmx.mx';

UPDATE usuarios SET email = 'neyda@cmmx.mx' 
WHERE (email = 'neyda@centralmarketing.mx' OR nombre ILIKE '%Neyda%') 
AND email NOT LIKE '%@cmmx.mx';

UPDATE usuarios SET email = 'felipe@cmmx.mx' 
WHERE (email = 'felipe@centralmarketing.mx' OR nombre ILIKE '%Felipe%') 
AND email NOT LIKE '%@cmmx.mx';

-- =============================================
-- 2. AGREGAR NUEVOS USUARIOS CON DOMINIO @cmmx.mx
-- =============================================

-- Insertar Paloma Rivera (Coordinadora de Marketing) si no existe
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Paloma Rivera', 'paloma.rivera@cmmx.mx', 'coord_mkt'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'paloma.rivera@cmmx.mx');

-- Insertar Fani Ramos (si es un usuario nuevo) - ajustar rol según corresponda
-- Por defecto la pongo como auxiliar de marketing, cambiar si tiene otro rol
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Fani Ramos', 'fani.ramos@cmmx.mx', 'aux_mkt'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'fani.ramos@cmmx.mx');

-- =============================================
-- 3. AGREGAR/ACTUALIZAR RESTO DEL EQUIPO CMMX
-- =============================================

-- Móni (Coordinadora de Cuentas)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Móni', 'moni@cmmx.mx', 'coord_cuentas'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%moni%' OR email ILIKE '%moni%');

-- Alexis (Legal)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Alexis', 'alexis@cmmx.mx', 'legal'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%alexis%' OR email ILIKE '%alexis%');

-- Lesly (Auxiliar de Marketing)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Lesly', 'lesly@cmmx.mx', 'aux_mkt'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%lesly%' OR email ILIKE '%lesly%');

-- NOTA: Fani Ramos es la Directora de Producción Audiovisual
-- No se crea usuario separado "Estefanía"; se usa fani.ramos@cmmx.mx

-- Emiliano (Practicante de Marketing)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Emiliano', 'emiliano@cmmx.mx', 'practicante_mkt'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%emiliano%');

-- Jorge (Practicante de Marketing)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Jorge', 'jorge@cmmx.mx', 'practicante_mkt'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%jorge%');

-- Allison (Practicante de Marketing)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Allison', 'allison@cmmx.mx', 'practicante_mkt'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%allison%');

-- Paloma Pliego (Directora Creativa Cédula 1)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Paloma Pliego', 'paloma.pliego@cmmx.mx', 'dir_creativa_1'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%paloma pliego%');

-- Vicente (Diseñador)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Vicente', 'vicente@cmmx.mx', 'disenador'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%vicente%');

-- Clarissa (Diseñadora)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Clarissa', 'clarissa@cmmx.mx', 'disenador'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%clarissa%');

-- Dalet (Directora Creativa Cédula 2)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Dalet', 'dalet@cmmx.mx', 'dir_creativa_2'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%dalet%');

-- Ana Paola (Diseñadora)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Ana Paola', 'ana.paola@cmmx.mx', 'disenador'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%ana paola%');

-- Ana Luisa (Diseñadora)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Ana Luisa', 'ana.luisa@cmmx.mx', 'disenador'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%ana luisa%');

-- Daniel (Diseñador)
INSERT INTO usuarios (nombre, email, rol)
SELECT 'Daniel', 'daniel@cmmx.mx', 'disenador'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre ILIKE '%daniel%');

-- =============================================
-- 4. VERIFICACIÓN
-- =============================================
SELECT nombre, email, rol FROM usuarios ORDER BY rol, nombre;

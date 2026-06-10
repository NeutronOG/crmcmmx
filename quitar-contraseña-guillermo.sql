-- Quitar contraseña al usuario admin Guillermo
UPDATE usuarios 
SET password = NULL 
WHERE nombre = 'Guillermo' 
AND email = 'guillermo@centralmarketing.mx'
AND rol = 'admin';

-- Verificar cambios
SELECT 
  nombre,
  email,
  rol,
  password
FROM usuarios
WHERE nombre = 'Guillermo'
ORDER BY nombre ASC;

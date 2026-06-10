-- Crear nuevo perfil admin sin contraseña
INSERT INTO usuarios (nombre, email, rol, password) VALUES
  ('Admin CMMX', 'admin@centralmarketing.mx', 'admin', NULL)
ON CONFLICT (email) DO UPDATE SET 
  rol = 'admin',
  password = NULL;

-- Verificar creación
SELECT 
  nombre,
  email,
  rol,
  password,
  created_at
FROM usuarios
WHERE email = 'admin@centralmarketing.mx';

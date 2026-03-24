INSERT INTO usuarios (nombre, email, rol) VALUES
  ('Guillermo', 'guillermo@centralmarketing.mx', 'admin')
ON CONFLICT (email) DO UPDATE SET rol = 'admin';

UPDATE usuarios 
SET rol = 'admin' 
WHERE nombre = 'Felipe' 
AND email = 'felipe@centralmarketing.mx';

SELECT 
  nombre,
  email,
  rol,
  created_at
FROM usuarios
WHERE nombre IN ('Guillermo', 'Felipe')
ORDER BY nombre ASC;

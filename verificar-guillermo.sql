SELECT 
  nombre,
  email,
  rol,
  created_at
FROM usuarios
WHERE nombre = 'Guillermo'
ORDER BY created_at ASC;

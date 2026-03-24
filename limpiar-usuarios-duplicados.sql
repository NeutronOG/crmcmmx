DELETE FROM usuarios 
WHERE nombre = 'Guillermo' 
AND rol != 'dueno';

DELETE FROM usuarios 
WHERE nombre = 'Ian' 
AND email != 'ian@centralmarketing.mx';

DELETE FROM usuarios 
WHERE nombre = 'Felipe' 
AND email != 'felipe@centralmarketing.mx';

DELETE FROM usuarios 
WHERE nombre = 'Neyda';

SELECT 
  nombre,
  email,
  rol,
  created_at
FROM usuarios
WHERE nombre IN ('Guillermo', 'Ian', 'Felipe')
ORDER BY nombre ASC;

UPDATE usuarios 
SET password = 'Ian@CentralMkt2026!Secure' 
WHERE nombre = 'Ian' 
AND email = 'ian@centralmarketing.mx';

UPDATE usuarios 
SET password = 'Guillermo#Admin$2026Secure!' 
WHERE nombre = 'Guillermo' 
AND email = 'guillermo@centralmarketing.mx';

UPDATE usuarios 
SET password = 'Felipe$Secure2026@Admin!' 
WHERE nombre = 'Felipe' 
AND email = 'felipe@centralmarketing.mx';

SELECT 
  nombre,
  email,
  rol,
  password
FROM usuarios
WHERE nombre IN ('Ian', 'Guillermo', 'Felipe')
ORDER BY nombre ASC;

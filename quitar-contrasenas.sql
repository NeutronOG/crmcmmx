UPDATE usuarios SET password = NULL;

SELECT nombre, email, rol, password FROM usuarios ORDER BY nombre ASC;

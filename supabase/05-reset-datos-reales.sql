-- =============================================
-- Central Marketing CRM - RESET + DATOS REALES
-- Ejecutar en Supabase SQL Editor
-- ADVERTENCIA: Esto BORRA todos los datos existentes
-- Fechas actualizadas a FEBRERO 2026
-- =============================================

-- 1. LIMPIAR TODAS LAS TABLAS (orden por dependencias)
TRUNCATE evidencias CASCADE;
TRUNCATE tareas CASCADE;
TRUNCATE eventos_calendario CASCADE;
TRUNCATE idea_room_mensajes CASCADE;
TRUNCATE idea_room_participantes CASCADE;
TRUNCATE idea_rooms CASCADE;
TRUNCATE notificaciones CASCADE;
TRUNCATE cotizaciones CASCADE;
TRUNCATE onboarding CASCADE;
TRUNCATE proyectos CASCADE;
TRUNCATE leads CASCADE;
TRUNCATE clientes CASCADE;
TRUNCATE empleados CASCADE;
TRUNCATE ingresos CASCADE;
TRUNCATE gastos CASCADE;
TRUNCATE usuarios CASCADE;

-- =============================================
-- 2. USUARIOS
-- =============================================
INSERT INTO usuarios (nombre, email, rol) VALUES
  ('Admin Central', 'admin@centralmarketing.com', 'admin'),
  ('Valeria Mendoza', 'valeria@centralmarketing.com', 'diseñador_grafico'),
  ('Rodrigo Castillo', 'rodrigo@centralmarketing.com', 'diseñador_industrial'),
  ('Daniela Herrera', 'daniela@centralmarketing.com', 'produccion_audiovisual'),
  ('Sebastián Ríos', 'sebastian@centralmarketing.com', 'produccion_activaciones'),
  ('Camila Ortega', 'camila@centralmarketing.com', 'marketing_digital'),
  ('Andrés Navarro', 'andres@centralmarketing.com', 'auxiliar_marketing'),
  ('Fernanda Delgado', 'fernanda@centralmarketing.com', 'creador_contenido'),
  ('Emilio Vargas', 'emilio@centralmarketing.com', 'creador_parrilla'),
  ('Gabriela Moreno', 'gabriela@centralmarketing.com', 'administracion');

-- =============================================
-- 3. EMPLEADOS
-- =============================================
INSERT INTO empleados (codigo, nombre, email, rol, salario_base, porcentaje_comision, estado, fecha_ingreso, proyectos_activos) VALUES
  ('EMP-001', 'Camila Ortega', 'camila@centralmarketing.com', 'Marketing Digital', 28000, 5, 'Activo', '2024-02-01', 4),
  ('EMP-002', 'Valeria Mendoza', 'valeria@centralmarketing.com', 'Diseñador Gráfico', 24000, 3, 'Activo', '2024-04-15', 3),
  ('EMP-003', 'Rodrigo Castillo', 'rodrigo@centralmarketing.com', 'Diseñador Industrial', 24000, 3, 'Activo', '2024-07-01', 2),
  ('EMP-004', 'Daniela Herrera', 'daniela@centralmarketing.com', 'Producción Audiovisual', 22000, 4, 'Activo', '2024-09-15', 3),
  ('EMP-005', 'Sebastián Ríos', 'sebastian@centralmarketing.com', 'Producción Activaciones', 22000, 4, 'Activo', '2025-01-10', 2),
  ('EMP-006', 'Andrés Navarro', 'andres@centralmarketing.com', 'Auxiliar de Marketing', 16000, 2, 'Activo', '2025-03-01', 2),
  ('EMP-007', 'Fernanda Delgado', 'fernanda@centralmarketing.com', 'Creador de Contenido', 20000, 3, 'Activo', '2025-02-15', 2),
  ('EMP-008', 'Emilio Vargas', 'emilio@centralmarketing.com', 'Creador de Parrilla', 20000, 3, 'Activo', '2025-05-01', 2),
  ('EMP-009', 'Gabriela Moreno', 'gabriela@centralmarketing.com', 'Administración', 18000, 0, 'Activo', '2024-06-01', 0);

-- =============================================
-- 4. CLIENTES
-- =============================================
INSERT INTO clientes (codigo, nombre, empresa, email, telefono, estado, etapa_onboarding, valor_mensual, fecha_inicio, ultimo_contacto, responsable, notas) VALUES
  ('CLI-001', 'Ricardo Salinas', 'Grupo Elektra', 'rsalinas@grupoelektra.com', '+52 55 4120 8800', 'Activo', 'Completado', 85000, '2025-03-01', '2026-02-10', 'Camila Ortega', 'Cuenta corporativa. Manejo de redes sociales y campañas digitales para 3 marcas del grupo.'),
  ('CLI-002', 'Mariana Villarreal', 'Cervecería Artesanal Lupulosa', 'mariana@lupulosa.mx', '+52 81 2345 6789', 'Activo', 'Completado', 25000, '2025-06-15', '2026-02-09', 'Fernanda Delgado', 'Marca en crecimiento. Contenido para Instagram, TikTok y eventos de degustación.'),
  ('CLI-003', 'Jorge Hernández', 'Constructora Hernández & Asociados', 'jorge@constructorahya.com', '+52 33 9876 5432', 'Activo', 'Completado', 35000, '2025-08-01', '2026-02-08', 'Rodrigo Castillo', 'Branding corporativo + renders 3D para proyectos inmobiliarios. Contrato anual.'),
  ('CLI-004', 'Sofía Ramírez', 'Clínica Dental Sonríe', 'sofia@clinicasonrie.com', '+52 55 7654 3210', 'Activo', 'Completado', 15000, '2025-09-01', '2026-02-07', 'Andrés Navarro', 'Gestión de Google Ads y redes sociales. Enfoque en captación de pacientes nuevos.'),
  ('CLI-005', 'Alejandro Torres', 'Restaurante La Hacienda', 'alex@lahacienda.mx', '+52 55 1122 3344', 'Activo', 'Completado', 18000, '2025-10-15', '2026-02-06', 'Emilio Vargas', 'Fotografía gastronómica, parrilla de contenido semanal y manejo de reseñas.'),
  ('CLI-006', 'Patricia Guzmán', 'Boutique Eleganza', 'patricia@eleganza.mx', '+52 55 5566 7788', 'En Onboarding', 'Configuración', 22000, '2026-01-20', '2026-02-10', 'Valeria Mendoza', 'Marca de moda. Necesita identidad visual completa, eCommerce y contenido de moda.'),
  ('CLI-007', 'Fernando Aguilar', 'Despacho Aguilar Legal', 'fernando@aguilarlegal.com', '+52 55 9988 7766', 'En Onboarding', 'Documentación', 12000, '2026-02-01', '2026-02-10', 'Camila Ortega', 'Despacho de abogados. Necesita presencia digital profesional y generación de leads.'),
  ('CLI-008', 'Diana Castañeda', 'Fitness Revolution GYM', 'diana@fitnessrev.mx', '+52 55 3344 5566', 'Prospecto', 'Bienvenida', 30000, NULL, '2026-02-09', 'Sebastián Ríos', 'Cadena de gimnasios con 5 sucursales. Interesada en campañas de captación y eventos.'),
  ('CLI-009', 'Manuel Ochoa', 'Inmobiliaria Costa Azul', 'manuel@costaazul.mx', '+52 998 123 4567', 'Prospecto', 'Bienvenida', 45000, NULL, '2026-02-08', 'Rodrigo Castillo', 'Desarrollos turísticos en Cancún. Presupuesto alto para renders y campañas internacionales.'),
  ('CLI-010', 'Lucía Peña', 'Escuela de Idiomas GlobalSpeak', 'lucia@globalspeak.edu.mx', '+52 55 2233 4455', 'Inactivo', 'Completado', 10000, '2025-01-15', '2025-11-30', 'Andrés Navarro', 'Pausó servicios por reestructuración interna. Posible reactivación en marzo 2026.');

-- =============================================
-- 5. LEADS
-- =============================================
INSERT INTO leads (codigo, nombre, empresa, email, telefono, origen, estado, valor_estimado, probabilidad, fecha_creacion, ultimo_contacto, responsable, notas) VALUES
  ('LEAD-001', 'Carlos Medina', 'AutoZone México', 'cmedina@autozone.mx', '+52 81 5544 3322', 'LinkedIn', 'Negociación', 65000, 85, '2026-01-10', '2026-02-10', 'Camila Ortega', 'Interesado en campaña digital nacional. Reunión de cierre programada para el 15 de febrero.'),
  ('LEAD-002', 'Ana Belén Torres', 'Hotel Boutique Cielo', 'anabelen@hotelcielo.mx', '+52 322 987 6543', 'Referido', 'Propuesta', 40000, 70, '2026-01-15', '2026-02-09', 'Fernanda Delgado', 'Referida por Restaurante La Hacienda. Necesita branding y marketing turístico.'),
  ('LEAD-003', 'Roberto Fuentes', 'Laboratorio Farmacéutico Vida', 'rfuentes@labvida.com', '+52 55 6677 8899', 'Web', 'Calificado', 55000, 60, '2026-01-20', '2026-02-08', 'Andrés Navarro', 'Llegó por formulario web. Busca posicionamiento de marca y campañas de awareness.'),
  ('LEAD-004', 'Isabela Montoya', 'Joyería Montoya', 'isabela@joyeriamontoya.mx', '+52 33 1122 3344', 'Instagram', 'Contactado', 20000, 40, '2026-01-25', '2026-02-07', 'Valeria Mendoza', 'Contacto por DM de Instagram. Interesada en fotografía de producto y eCommerce.'),
  ('LEAD-005', 'Enrique Domínguez', 'Franquicia Tacos El Patrón', 'enrique@tacospatron.mx', '+52 55 9900 1122', 'Evento', 'Nuevo', 35000, 25, '2026-02-05', NULL, 'Sebastián Ríos', 'Conocido en expo franquicias. Cadena de 12 sucursales, necesita marketing integral.'),
  ('LEAD-006', 'Mónica Reyes', 'Spa Zen Harmony', 'monica@zenharmony.mx', '+52 55 3344 5566', 'Google Ads', 'Nuevo', 18000, 20, '2026-02-08', NULL, 'Camila Ortega', 'Click en anuncio de Google. Pidió información sobre manejo de redes y Google My Business.'),
  ('LEAD-007', 'Gustavo Peña', 'Distribuidora Alimentos del Norte', 'gustavo@distalnorte.com', '+52 81 7788 9900', 'Referido', 'Calificado', 50000, 55, '2026-01-28', '2026-02-06', 'Daniela Herrera', 'Referido por Grupo Elektra. Necesita video corporativo y catálogo digital.'),
  ('LEAD-008', 'Valentina Cruz', 'Academia de Danza Ritmo', 'valentina@ritmodanza.mx', '+52 55 1234 9876', 'Facebook', 'Contactado', 12000, 35, '2026-02-01', '2026-02-05', 'Emilio Vargas', 'Contacto por Facebook. Busca contenido de video para redes y captación de alumnos.');

-- =============================================
-- 6. PROYECTOS (todos al día, solo PRY-005 ligeramente atrasado como ejemplo)
-- =============================================
INSERT INTO proyectos (codigo, nombre, cliente, tipo, estado, fecha_inicio, fecha_entrega, presupuesto, responsable, progreso, descripcion) VALUES
  ('PRY-001', 'Campaña Digital Nacional Q1', 'Grupo Elektra', 'Marketing Digital', 'En Progreso', '2026-01-15', '2026-03-31', 120000, 'Camila Ortega', 35, 'Campaña integral de Google Ads + Meta Ads para 3 marcas del grupo.'),
  ('PRY-002', 'Contenido Redes Sociales Febrero', 'Cervecería Artesanal Lupulosa', 'Redes Sociales', 'En Progreso', '2026-02-01', '2026-02-28', 25000, 'Fernanda Delgado', 40, 'Parrilla mensual: 20 posts Instagram, 12 stories, 4 reels, 8 TikToks.'),
  ('PRY-003', 'Renders 3D Residencial Las Palmas', 'Constructora Hernández & Asociados', 'Diseño 3D', 'En Progreso', '2026-01-20', '2026-03-15', 45000, 'Rodrigo Castillo', 55, 'Renders fotorrealistas de 8 departamentos + áreas comunes + recorrido virtual 360°.'),
  ('PRY-004', 'Campaña Google Ads Captación', 'Clínica Dental Sonríe', 'Google Ads', 'En Progreso', '2026-02-01', '2026-04-30', 18000, 'Andrés Navarro', 20, 'Campaña de búsqueda y display para captación de pacientes.'),
  ('PRY-005', 'Fotografía Menú Primavera', 'Restaurante La Hacienda', 'Fotografía', 'En Revisión', '2026-01-25', '2026-02-08', 12000, 'Daniela Herrera', 80, 'Sesión fotográfica de 35 platillos. ATRASADO 3 días — pendiente aprobación del cliente.'),
  ('PRY-006', 'Identidad Visual Eleganza', 'Boutique Eleganza', 'Branding', 'Planificación', '2026-02-15', '2026-04-15', 38000, 'Valeria Mendoza', 5, 'Logotipo, paleta, tipografía, manual de marca, papelería y aplicaciones digitales.'),
  ('PRY-007', 'Video Corporativo Institucional', 'Constructora Hernández & Asociados', 'Producción Audiovisual', 'En Progreso', '2026-02-03', '2026-03-10', 28000, 'Daniela Herrera', 30, 'Video institucional de 3 min: historia, proyectos destacados, testimoniales.'),
  ('PRY-008', 'Parrilla Contenido Semanal', 'Restaurante La Hacienda', 'Redes Sociales', 'En Progreso', '2026-02-01', '2026-02-28', 18000, 'Emilio Vargas', 45, 'Contenido semanal: 5 posts, 3 stories diarias, 2 reels.'),
  ('PRY-009', 'Landing Page + SEO', 'Despacho Aguilar Legal', 'Desarrollo Web', 'Planificación', '2026-02-20', '2026-04-01', 22000, 'Camila Ortega', 0, 'Landing page profesional con SEO on-page y blog de artículos legales.'),
  ('PRY-010', 'Campaña Redes Sociales Q1', 'Grupo Elektra', 'Redes Sociales', 'En Progreso', '2026-01-15', '2026-03-31', 45000, 'Emilio Vargas', 30, 'Gestión de redes para marca principal: Instagram, Facebook, TikTok.');

-- =============================================
-- 7. COTIZACIONES
-- =============================================
INSERT INTO cotizaciones (codigo, cliente, proyecto, valor, estado, fecha_creacion, fecha_vencimiento, seguimientos, responsable) VALUES
  ('COT-001', 'Grupo Elektra', 'Campaña Digital Nacional Q1', 120000, 'Aprobada', '2026-01-05', '2026-01-20', 3, 'Camila Ortega'),
  ('COT-002', 'Cervecería Artesanal Lupulosa', 'Contenido Redes Febrero', 25000, 'Aprobada', '2026-01-20', '2026-01-31', 2, 'Fernanda Delgado'),
  ('COT-003', 'Constructora Hernández & Asociados', 'Renders 3D Las Palmas', 45000, 'Aprobada', '2026-01-10', '2026-01-25', 2, 'Rodrigo Castillo'),
  ('COT-004', 'Boutique Eleganza', 'Identidad Visual Eleganza', 38000, 'Aprobada', '2026-01-25', '2026-02-10', 4, 'Valeria Mendoza'),
  ('COT-005', 'AutoZone México', 'Campaña Digital Nacional', 65000, 'En Negociación', '2026-02-01', '2026-02-28', 2, 'Camila Ortega'),
  ('COT-006', 'Hotel Boutique Cielo', 'Branding + Marketing Turístico', 40000, 'Enviada', '2026-02-05', '2026-03-05', 1, 'Fernanda Delgado'),
  ('COT-007', 'Laboratorio Farmacéutico Vida', 'Posicionamiento de Marca', 55000, 'Enviada', '2026-02-08', '2026-03-08', 1, 'Andrés Navarro'),
  ('COT-008', 'Despacho Aguilar Legal', 'Landing Page + SEO', 22000, 'Aprobada', '2026-02-03', '2026-02-15', 2, 'Camila Ortega'),
  ('COT-009', 'Fitness Revolution GYM', 'Marketing Integral Gimnasios', 30000, 'Borrador', '2026-02-10', '2026-03-10', 0, 'Sebastián Ríos'),
  ('COT-010', 'Distribuidora Alimentos del Norte', 'Video Corporativo + Catálogo', 50000, 'Enviada', '2026-02-06', '2026-03-06', 1, 'Daniela Herrera');

-- =============================================
-- 8. ONBOARDING
-- =============================================
INSERT INTO onboarding (codigo, nombre, empresa, email, telefono, etapa, progreso, fecha_inicio, responsable, siguiente_paso, brief_completado, kickoff_agendado, documentos_recibidos, proyecto_creado) VALUES
  ('ONB-001', 'Patricia Guzmán', 'Boutique Eleganza', 'patricia@eleganza.mx', '+52 55 5566 7788', 'Configuración', 50, '2026-01-20', 'Valeria Mendoza', 'Completar brief de marca y definir moodboard', TRUE, TRUE, FALSE, FALSE),
  ('ONB-002', 'Fernando Aguilar', 'Despacho Aguilar Legal', 'fernando@aguilarlegal.com', '+52 55 9988 7766', 'Documentación', 25, '2026-02-01', 'Camila Ortega', 'Recibir documentos corporativos y contenido existente', FALSE, FALSE, FALSE, FALSE),
  ('ONB-003', 'Diana Castañeda', 'Fitness Revolution GYM', 'diana@fitnessrev.mx', '+52 55 3344 5566', 'Bienvenida', 10, '2026-02-09', 'Sebastián Ríos', 'Enviar email de bienvenida y agendar llamada inicial', FALSE, FALSE, FALSE, FALSE);

-- =============================================
-- 9. TAREAS
-- =============================================
INSERT INTO tareas (codigo, titulo, descripcion, proyecto, cliente, asignado, estado, prioridad, fecha_creacion, fecha_vencimiento, fecha_completada, etiquetas) VALUES
  ('TAR-001', 'Diseñar creativos Google Ads Q1', 'Crear 12 banners responsive para campaña de búsqueda y display de las 3 marcas', 'Campaña Digital Nacional Q1', 'Grupo Elektra', 'Valeria Mendoza', 'En Progreso', 'Alta', '2026-01-20', '2026-02-15', NULL, ARRAY['Diseño', 'Google Ads']),
  ('TAR-002', 'Configurar campañas Meta Ads', 'Estructurar campañas en Meta Business Suite: audiencias, presupuestos, creativos', 'Campaña Digital Nacional Q1', 'Grupo Elektra', 'Camila Ortega', 'En Progreso', 'Alta', '2026-01-20', '2026-02-13', NULL, ARRAY['Meta Ads', 'Configuración']),
  ('TAR-003', 'Reporte semanal de métricas', 'Compilar métricas de rendimiento de todas las campañas activas del grupo', 'Campaña Digital Nacional Q1', 'Grupo Elektra', 'Andrés Navarro', 'Pendiente', 'Media', '2026-02-03', '2026-02-14', NULL, ARRAY['Reportes', 'Métricas']),
  ('TAR-004', 'Sesión fotográfica cerveza temporada', 'Fotografía de producto de la edición especial con props temáticos', 'Contenido Redes Sociales Febrero', 'Cervecería Artesanal Lupulosa', 'Daniela Herrera', 'Completada', 'Alta', '2026-01-28', '2026-02-05', '2026-02-04', ARRAY['Fotografía', 'Producto']),
  ('TAR-005', 'Redactar copy posts semana 2', 'Textos para 5 posts de Instagram y 2 TikToks de la segunda semana', 'Contenido Redes Sociales Febrero', 'Cervecería Artesanal Lupulosa', 'Fernanda Delgado', 'En Progreso', 'Media', '2026-02-03', '2026-02-13', NULL, ARRAY['Copywriting', 'Social Media']),
  ('TAR-006', 'Editar reels promocionales', 'Edición de 4 reels: 2 de producto, 1 behind the scenes, 1 de degustación', 'Contenido Redes Sociales Febrero', 'Cervecería Artesanal Lupulosa', 'Daniela Herrera', 'Pendiente', 'Media', '2026-02-05', '2026-02-18', NULL, ARRAY['Video', 'Reels']),
  ('TAR-007', 'Modelado 3D departamento tipo A', 'Modelado completo del departamento tipo A (85m²) con acabados premium', 'Renders 3D Residencial Las Palmas', 'Constructora Hernández & Asociados', 'Rodrigo Castillo', 'Completada', 'Alta', '2026-01-22', '2026-02-05', '2026-02-03', ARRAY['3D', 'Modelado']),
  ('TAR-008', 'Renderizar áreas comunes', 'Renders fotorrealistas de lobby, alberca, gym y roof garden', 'Renders 3D Residencial Las Palmas', 'Constructora Hernández & Asociados', 'Rodrigo Castillo', 'En Progreso', 'Alta', '2026-02-04', '2026-02-20', NULL, ARRAY['3D', 'Renders']),
  ('TAR-009', 'Diseñar landing page captación', 'Diseño UI/UX de landing page para captación de pacientes nuevos', 'Campaña Google Ads Captación', 'Clínica Dental Sonríe', 'Valeria Mendoza', 'En Revisión', 'Alta', '2026-02-01', '2026-02-14', NULL, ARRAY['Diseño', 'Landing Page']),
  ('TAR-010', 'Configurar Google Ads búsqueda', 'Crear campañas de búsqueda: implantes, ortodoncia, blanqueamiento', 'Campaña Google Ads Captación', 'Clínica Dental Sonríe', 'Camila Ortega', 'Pendiente', 'Media', '2026-02-10', '2026-02-20', NULL, ARRAY['Google Ads', 'SEM']),
  ('TAR-011', 'Sesión fotográfica platillos', 'Fotografía profesional de 20 platillos principales del nuevo menú', 'Fotografía Menú Primavera', 'Restaurante La Hacienda', 'Daniela Herrera', 'Completada', 'Alta', '2026-01-27', '2026-02-05', '2026-02-04', ARRAY['Fotografía', 'Gastronomía']),
  ('TAR-012', 'Edición y retoque fotográfico', 'Edición de las 35 fotografías: color grading, retoque y formatos de entrega', 'Fotografía Menú Primavera', 'Restaurante La Hacienda', 'Daniela Herrera', 'En Progreso', 'Media', '2026-02-05', '2026-02-12', NULL, ARRAY['Edición', 'Retoque']),
  ('TAR-013', 'Escribir guión video institucional', 'Guión narrativo de 3 min: historia, valores, proyectos y testimoniales', 'Video Corporativo Institucional', 'Constructora Hernández & Asociados', 'Fernanda Delgado', 'Completada', 'Alta', '2026-02-03', '2026-02-10', '2026-02-09', ARRAY['Guión', 'Video']),
  ('TAR-014', 'Grabar entrevistas directivos', 'Grabación de entrevistas con CEO y director de proyectos', 'Video Corporativo Institucional', 'Constructora Hernández & Asociados', 'Daniela Herrera', 'Pendiente', 'Alta', '2026-02-10', '2026-02-20', NULL, ARRAY['Video', 'Grabación']),
  ('TAR-015', 'Diseñar plantillas stories', 'Crear 5 plantillas de stories con branding del restaurante', 'Parrilla Contenido Semanal', 'Restaurante La Hacienda', 'Valeria Mendoza', 'Completada', 'Baja', '2026-02-01', '2026-02-07', '2026-02-06', ARRAY['Diseño', 'Stories']),
  ('TAR-016', 'Crear contenido semana 2', 'Producir 5 posts + 3 stories + 2 reels para la segunda semana', 'Parrilla Contenido Semanal', 'Restaurante La Hacienda', 'Emilio Vargas', 'En Progreso', 'Media', '2026-02-07', '2026-02-14', NULL, ARRAY['Contenido', 'Social Media']),
  ('TAR-017', 'Planificar parrilla febrero', 'Calendario editorial de febrero para Instagram, Facebook y TikTok', 'Campaña Redes Sociales Q1', 'Grupo Elektra', 'Emilio Vargas', 'Completada', 'Alta', '2026-01-25', '2026-02-01', '2026-01-31', ARRAY['Parrilla', 'Planificación']),
  ('TAR-018', 'Grabar TikToks tendencia', 'Producir 4 TikToks siguiendo tendencias actuales adaptadas a la marca', 'Campaña Redes Sociales Q1', 'Grupo Elektra', 'Fernanda Delgado', 'En Progreso', 'Media', '2026-02-03', '2026-02-14', NULL, ARRAY['TikTok', 'Video']),
  ('TAR-019', 'Preparar presentación resultados enero', 'Presentación ejecutiva con resultados de campañas de enero', 'Campaña Digital Nacional Q1', 'Grupo Elektra', 'Andrés Navarro', 'Pendiente', 'Alta', '2026-02-08', '2026-02-15', NULL, ARRAY['Reportes', 'Presentación']),
  ('TAR-020', 'Investigar tendencias diseño 2026', 'Documento de tendencias de diseño y branding para referencia del equipo', 'Identidad Visual Eleganza', 'Boutique Eleganza', 'Valeria Mendoza', 'Pendiente', 'Baja', '2026-02-10', '2026-02-28', NULL, ARRAY['Investigación', 'Tendencias']);

-- =============================================
-- 10. INGRESOS (Dic 2025, Ene 2026, Feb 2026)
-- =============================================
INSERT INTO ingresos (tipo_de_gasto, monto, dia, mes, año) VALUES
  ('Mensualidad Grupo Elektra', 85000, 1, 12, 2025),
  ('Mensualidad Lupulosa', 25000, 1, 12, 2025),
  ('Mensualidad Constructora HyA', 35000, 1, 12, 2025),
  ('Mensualidad Clínica Sonríe', 15000, 1, 12, 2025),
  ('Mensualidad La Hacienda', 18000, 1, 12, 2025),
  ('Proyecto Renders Diciembre', 15000, 15, 12, 2025),
  ('Mensualidad Grupo Elektra', 85000, 1, 1, 2026),
  ('Mensualidad Lupulosa', 25000, 1, 1, 2026),
  ('Mensualidad Constructora HyA', 35000, 1, 1, 2026),
  ('Mensualidad Clínica Sonríe', 15000, 1, 1, 2026),
  ('Mensualidad La Hacienda', 18000, 1, 1, 2026),
  ('Anticipo Renders Las Palmas', 22500, 20, 1, 2026),
  ('Anticipo Campaña Digital Q1', 60000, 15, 1, 2026),
  ('Mensualidad Grupo Elektra', 85000, 1, 2, 2026),
  ('Mensualidad Lupulosa', 25000, 1, 2, 2026),
  ('Mensualidad Constructora HyA', 35000, 1, 2, 2026),
  ('Mensualidad Clínica Sonríe', 15000, 1, 2, 2026),
  ('Mensualidad La Hacienda', 18000, 1, 2, 2026),
  ('Anticipo Identidad Eleganza', 19000, 5, 2, 2026),
  ('Anticipo Landing Aguilar Legal', 11000, 10, 2, 2026);

-- =============================================
-- 11. GASTOS (Dic 2025, Ene 2026, Feb 2026)
-- =============================================
INSERT INTO gastos (tipo_de_gasto, importe, dia, mes, año) VALUES
  ('Nómina quincenal 1', 98000, 15, 12, 2025),
  ('Nómina quincenal 2', 98000, 30, 12, 2025),
  ('Adobe Creative Cloud', 12500, 1, 12, 2025),
  ('Hosting y dominios', 3500, 1, 12, 2025),
  ('Renta oficina', 18000, 1, 12, 2025),
  ('Presupuesto Meta Ads', 35000, 5, 12, 2025),
  ('Presupuesto Google Ads', 28000, 5, 12, 2025),
  ('Equipo fotográfico (renta)', 4500, 10, 12, 2025),
  ('Nómina quincenal 1', 98000, 15, 1, 2026),
  ('Nómina quincenal 2', 98000, 30, 1, 2026),
  ('Adobe Creative Cloud', 12500, 1, 1, 2026),
  ('Hosting y dominios', 3500, 1, 1, 2026),
  ('Renta oficina', 18000, 1, 1, 2026),
  ('Presupuesto Meta Ads', 42000, 5, 1, 2026),
  ('Presupuesto Google Ads', 35000, 5, 1, 2026),
  ('Licencia Cinema 4D', 8000, 10, 1, 2026),
  ('Freelancer video editor', 12000, 20, 1, 2026),
  ('Nómina quincenal 1', 98000, 15, 2, 2026),
  ('Adobe Creative Cloud', 12500, 1, 2, 2026),
  ('Hosting y dominios', 3500, 1, 2, 2026),
  ('Renta oficina', 18000, 1, 2, 2026),
  ('Presupuesto Meta Ads', 45000, 5, 2, 2026),
  ('Presupuesto Google Ads', 38000, 5, 2, 2026),
  ('Props sesión fotográfica', 2800, 3, 2, 2026);

-- =============================================
-- 12. EVENTOS DE CALENDARIO (Feb 2026)
-- =============================================
INSERT INTO eventos_calendario (titulo, descripcion, fecha_inicio, fecha_fin, todo_el_dia, color, tipo, importancia, usuario, participantes, proyecto) VALUES
  ('Reunión resultados enero - Grupo Elektra', 'Presentación de resultados del primer mes de campaña digital', '2026-02-14T10:00:00', '2026-02-14T11:30:00', FALSE, '#ef4444', 'reunion', 'alta', 'Admin Central', ARRAY['Camila Ortega', 'Andrés Navarro'], 'Campaña Digital Nacional Q1'),
  ('Sesión fotos Lupulosa - Nueva cerveza', 'Sesión de producto para la cerveza de temporada primavera', '2026-02-17T09:00:00', '2026-02-17T14:00:00', FALSE, '#eab308', 'evento', 'media', 'Admin Central', ARRAY['Daniela Herrera', 'Fernanda Delgado'], 'Contenido Redes Sociales Febrero'),
  ('Kickoff Boutique Eleganza', 'Reunión de arranque del proyecto de identidad visual', '2026-02-18T11:00:00', '2026-02-18T12:30:00', FALSE, '#ef4444', 'reunion', 'alta', 'Admin Central', ARRAY['Valeria Mendoza', 'Rodrigo Castillo'], 'Identidad Visual Eleganza'),
  ('Entrega renders depto tipo B', 'Fecha límite para entrega de renders del depto tipo B', '2026-02-20T00:00:00', NULL, TRUE, '#ef4444', 'entrega', 'alta', 'Admin Central', ARRAY['Rodrigo Castillo'], 'Renders 3D Residencial Las Palmas'),
  ('Grabación video corporativo', 'Día de grabación en oficinas de Constructora HyA', '2026-02-21T08:00:00', '2026-02-21T17:00:00', FALSE, '#eab308', 'evento', 'media', 'Admin Central', ARRAY['Daniela Herrera', 'Fernanda Delgado'], 'Video Corporativo Institucional'),
  ('Revisión semanal equipo', 'Junta semanal de seguimiento de todos los proyectos activos', '2026-02-12T09:00:00', '2026-02-12T10:00:00', FALSE, '#22c55e', 'reunion', 'baja', 'Admin Central', ARRAY['Camila Ortega', 'Valeria Mendoza', 'Rodrigo Castillo', 'Daniela Herrera'], ''),
  ('Entrega fotos menú La Hacienda', 'Entrega final de las 35 fotografías editadas', '2026-02-15T00:00:00', NULL, TRUE, '#eab308', 'entrega', 'media', 'Admin Central', ARRAY['Daniela Herrera'], 'Fotografía Menú Primavera'),
  ('Llamada prospecto AutoZone', 'Llamada de cierre con Carlos Medina de AutoZone', '2026-02-15T16:00:00', '2026-02-15T17:00:00', FALSE, '#ef4444', 'reunion', 'alta', 'Admin Central', ARRAY['Camila Ortega'], '');

-- =============================================
-- FIN - Todas las fechas son Feb 2026 (actual)
-- Solo PRY-005 tiene entrega 2026-02-08 (3 días atrasado) como ejemplo
-- =============================================

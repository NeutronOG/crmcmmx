-- =============================================
-- Central Marketing CRM - Seed Data
-- Ejecutar DESPUÉS de 01-schema.sql
-- =============================================

-- USUARIOS
INSERT INTO usuarios (nombre, email, rol) VALUES
  ('Neyda', 'neyda@centralmarketing.mx', 'admin'),
  ('María Torres', 'maria@centralmarketing.com', 'diseñador_grafico'),
  ('Pedro Ruiz', 'pedro@centralmarketing.com', 'diseñador_industrial'),
  ('Diego Martínez', 'diego@centralmarketing.com', 'produccion_audiovisual'),
  ('Laura Gómez', 'laura@centralmarketing.com', 'produccion_activaciones'),
  ('Ana García', 'ana@centralmarketing.com', 'marketing_digital'),
  ('Carlos López', 'carlos@centralmarketing.com', 'auxiliar_marketing'),
  ('Sofía Hernández', 'sofia@centralmarketing.com', 'creador_contenido'),
  ('Roberto Sánchez', 'roberto@centralmarketing.com', 'creador_parrilla'),
  ('Patricia Flores', 'patricia@centralmarketing.com', 'administracion'),
  ('Influencer Demo', 'influencer@centralmarketing.com', 'influencer'),
  ('Freelancer Demo', 'freelancer@centralmarketing.com', 'freelancer');

-- CLIENTES
INSERT INTO clientes (codigo, nombre, empresa, email, telefono, estado, etapa_onboarding, valor_mensual, fecha_inicio, ultimo_contacto, responsable, notas) VALUES
  ('CLI-001', 'María García', 'TechStart Inc.', 'maria@techstart.com', '+52 55 1234 5678', 'Activo', 'Completado', 15000, '2024-01-15', '2024-12-10', 'Carlos Ruiz', 'Cliente premium, muy satisfecho con el servicio'),
  ('CLI-002', 'Juan Pérez', 'Café Artesanal', 'juan@cafeartesanal.com', '+52 55 2345 6789', 'Activo', 'Completado', 8500, '2024-03-20', '2024-12-08', 'Ana López', 'Interesado en expandir servicios de redes sociales'),
  ('CLI-003', 'Ana López', 'Fitness Pro', 'ana@fitnesspro.com', '+52 55 3456 7890', 'En Onboarding', 'Configuración', 12000, '2024-11-01', '2024-12-09', 'María García', 'Nuevo cliente, en proceso de configuración inicial'),
  ('CLI-004', 'Carlos Ruiz', 'Restaurant Gourmet', 'carlos@restaurantgourmet.com', '+52 55 4567 8901', 'Activo', 'Completado', 10000, '2024-06-10', '2024-12-07', 'Juan Pérez', 'Requiere contenido para temporada navideña'),
  ('CLI-005', 'Laura Martínez', 'Inmobiliaria Plus', 'laura@inmobiliariaplus.com', '+52 55 5678 9012', 'Prospecto', 'Bienvenida', 25000, NULL, '2024-12-10', 'Carlos Ruiz', 'Alto potencial, interesado en branding completo');

-- LEADS
INSERT INTO leads (codigo, nombre, empresa, email, telefono, origen, estado, valor_estimado, probabilidad, fecha_creacion, ultimo_contacto, responsable, notas) VALUES
  ('LEAD-001', 'Roberto Díaz', 'Moda Express', 'roberto@modaexpress.com', '+52 55 6789 0123', 'Referido', 'Calificado', 18000, 70, '2024-11-15', '2024-12-09', 'Ana García', 'Interesado en campaña de temporada'),
  ('LEAD-002', 'Fernanda Ríos', 'EduTech MX', 'fernanda@edutech.mx', '+52 55 7890 1234', 'Web', 'Contactado', 22000, 40, '2024-12-01', '2024-12-08', 'Carlos López', 'Solicitud desde formulario web'),
  ('LEAD-003', 'Andrés Morales', 'GreenFood', 'andres@greenfood.com', '+52 55 8901 2345', 'LinkedIn', 'Nuevo', 15000, 20, '2024-12-10', NULL, 'María Torres', 'Contacto inicial por LinkedIn'),
  ('LEAD-004', 'Valeria Soto', 'PetCare Plus', 'valeria@petcare.com', '+52 55 9012 3456', 'Evento', 'Propuesta', 30000, 80, '2024-10-20', '2024-12-10', 'Ana García', 'Propuesta enviada, esperando respuesta'),
  ('LEAD-005', 'Héctor Luna', 'AutoParts MX', 'hector@autoparts.mx', '+52 55 0123 4567', 'Referido', 'Negociación', 45000, 90, '2024-09-15', '2024-12-10', 'Pedro Ruiz', 'En negociación de contrato anual');

-- PROYECTOS
INSERT INTO proyectos (codigo, nombre, cliente, tipo, estado, fecha_inicio, fecha_entrega, presupuesto, responsable, progreso, descripcion) VALUES
  ('PRY-001', 'Campaña Google Ads Q1', 'Tech Solutions SA', 'Marketing Digital', 'En Progreso', '2025-01-05', '2025-03-31', 45000, 'Ana García', 25, 'Campaña de Google Ads para el primer trimestre'),
  ('PRY-002', 'Social Media Management', 'RetailMart', 'Redes Sociales', 'En Progreso', '2025-01-01', '2025-06-30', 72000, 'Laura Gómez', 15, 'Gestión de redes sociales mensual'),
  ('PRY-003', 'Landing Page eCommerce', 'eShop México', 'Desarrollo Web', 'En Revisión', '2024-12-01', '2025-01-31', 35000, 'María Torres', 85, 'Diseño y desarrollo de landing page'),
  ('PRY-004', 'Rediseño de Marca', 'StartupXYZ', 'Branding', 'Completado', '2024-11-15', '2025-01-15', 28000, 'Pedro Ruiz', 100, 'Rediseño completo de identidad de marca'),
  ('PRY-005', 'Estrategia de Marketing Q4', 'FinTech Pro', 'Estrategia', 'Planificación', '2025-02-01', '2025-04-30', 55000, 'Carlos López', 5, 'Estrategia integral de marketing digital');

-- EMPLEADOS
INSERT INTO empleados (codigo, nombre, email, rol, salario_base, porcentaje_comision, estado, fecha_ingreso, proyectos_activos) VALUES
  ('EMP-001', 'Ana García', 'ana@centralmarketing.com', 'Marketing Digital', 25000, 5, 'Activo', '2023-03-15', 3),
  ('EMP-002', 'María Torres', 'maria@centralmarketing.com', 'Diseñador Gráfico', 22000, 3, 'Activo', '2023-06-01', 2),
  ('EMP-003', 'Pedro Ruiz', 'pedro@centralmarketing.com', 'Diseñador Industrial', 22000, 3, 'Activo', '2023-08-15', 1),
  ('EMP-004', 'Diego Martínez', 'diego@centralmarketing.com', 'Producción Audiovisual', 20000, 4, 'Activo', '2024-01-10', 2),
  ('EMP-005', 'Laura Gómez', 'laura@centralmarketing.com', 'Producción Activaciones', 20000, 4, 'Activo', '2024-02-01', 1),
  ('EMP-006', 'Carlos López', 'carlos@centralmarketing.com', 'Auxiliar de Marketing', 15000, 2, 'Activo', '2024-05-15', 2),
  ('EMP-007', 'Sofía Hernández', 'sofia@centralmarketing.com', 'Creador de Contenido', 18000, 3, 'Activo', '2024-03-01', 1),
  ('EMP-008', 'Roberto Sánchez', 'roberto@centralmarketing.com', 'Creador de Parrilla', 18000, 3, 'Activo', '2024-04-15', 1);

-- COTIZACIONES
INSERT INTO cotizaciones (codigo, cliente, proyecto, valor, estado, fecha_creacion, fecha_vencimiento, seguimientos, responsable) VALUES
  ('COT-001', 'Tech Solutions SA', 'Campaña Google Ads Q1', 45000, 'Aprobada', '2024-12-15', '2025-01-15', 3, 'Ana García'),
  ('COT-002', 'RetailMart', 'Social Media Management', 72000, 'Aprobada', '2024-12-10', '2025-01-10', 2, 'Laura Gómez'),
  ('COT-003', 'PetCare Plus', 'Campaña Integral', 30000, 'Enviada', '2024-12-20', '2025-01-20', 1, 'Ana García'),
  ('COT-004', 'AutoParts MX', 'Branding + Digital', 45000, 'En Negociación', '2024-12-18', '2025-01-18', 4, 'Pedro Ruiz'),
  ('COT-005', 'EduTech MX', 'Estrategia Digital', 22000, 'Borrador', '2025-01-10', '2025-02-10', 0, 'Carlos López');

-- ONBOARDING
INSERT INTO onboarding (codigo, nombre, empresa, email, telefono, etapa, progreso, fecha_inicio, responsable, siguiente_paso, brief_completado, kickoff_agendado, documentos_recibidos, proyecto_creado) VALUES
  ('ONB-001', 'Carlos Martínez', 'Tech Solutions SA', 'carlos@empresa.com', '+52 55 1234 5678', 'Bienvenida', 10, '2025-01-12', 'Ana García', 'Enviar email de bienvenida + documentos', FALSE, FALSE, FALSE, FALSE),
  ('ONB-002', 'Laura Fernández', 'StartupXYZ', 'laura@startup.io', '+52 55 9876 5432', 'Documentación', 35, '2025-01-10', 'Pedro Ruiz', 'Completar cuestionario de brief', FALSE, FALSE, TRUE, FALSE),
  ('ONB-003', 'Miguel Ángel Torres', 'RetailMart', 'miguel@retail.com', '+52 55 5555 1234', 'Kickoff', 65, '2025-01-08', 'Ana García', 'Reunión kickoff programada para 15/01', TRUE, TRUE, TRUE, FALSE),
  ('ONB-004', 'Isabel Romero', 'eShop México', 'isabel@ecommerce.mx', '+52 55 4444 9999', 'Activo', 100, '2025-01-05', 'Pedro Ruiz', 'Cliente activo - Proyecto en marcha', TRUE, TRUE, TRUE, TRUE);

-- TAREAS
INSERT INTO tareas (codigo, titulo, descripcion, proyecto, cliente, asignado, estado, prioridad, fecha_creacion, fecha_vencimiento, fecha_completada, etiquetas) VALUES
  ('TAR-001', 'Diseñar banner campaña Q1', 'Crear banner principal para la campaña de Google Ads del primer trimestre', 'Campaña Google Ads Q1', 'Tech Solutions SA', 'María Torres', 'En Progreso', 'Alta', '2025-01-10', '2025-01-25', NULL, ARRAY['Diseño', 'Google Ads']),
  ('TAR-002', 'Redactar copy para redes sociales', 'Escribir textos para las publicaciones de Instagram y Facebook de la semana', 'Social Media Management', 'RetailMart', 'Laura Gómez', 'Pendiente', 'Media', '2025-01-12', '2025-01-20', NULL, ARRAY['Contenido', 'Social Media']),
  ('TAR-003', 'Grabar video testimonial', 'Coordinar y grabar video testimonial del cliente para la landing page', 'Landing Page eCommerce', 'eShop México', 'Diego Martínez', 'En Revisión', 'Alta', '2025-01-05', '2025-01-18', NULL, ARRAY['Video', 'Producción']),
  ('TAR-004', 'Crear paleta de colores nueva marca', 'Definir la paleta de colores para el rediseño de marca del cliente', 'Rediseño de Marca', 'StartupXYZ', 'Pedro Ruiz', 'Completada', 'Alta', '2025-01-08', '2025-01-15', '2025-01-14', ARRAY['Branding', 'Diseño']),
  ('TAR-005', 'Configurar píxel de Facebook', 'Instalar y configurar el píxel de Facebook en el sitio web del cliente', 'Campaña Google Ads Q1', 'Tech Solutions SA', 'Ana García', 'Pendiente', 'Baja', '2025-01-14', '2025-01-30', NULL, ARRAY['Marketing Digital', 'Configuración']),
  ('TAR-006', 'Editar reel promocional', 'Editar el video reel para la campaña de Instagram del cliente', 'Social Media Management', 'RetailMart', 'Diego Martínez', 'En Progreso', 'Media', '2025-01-11', '2025-01-22', NULL, ARRAY['Video', 'Social Media']),
  ('TAR-007', 'Diseñar mockup landing page', 'Crear mockup de alta fidelidad para la landing page del eCommerce', 'Landing Page eCommerce', 'eShop México', 'María Torres', 'Completada', 'Alta', '2025-01-02', '2025-01-10', '2025-01-09', ARRAY['Diseño', 'Web']),
  ('TAR-008', 'Preparar reporte mensual', 'Compilar métricas y resultados del mes para presentar al cliente', 'Estrategia de Marketing Q4', 'FinTech Pro', 'Carlos López', 'En Progreso', 'Media', '2025-01-13', '2025-01-28', NULL, ARRAY['Reportes', 'Análisis']);

-- INGRESOS (ejemplo)
INSERT INTO ingresos (tipo_de_gasto, monto, dia, mes, año) VALUES
  ('Servicio mensual', 15000, 1, 1, 2025),
  ('Servicio mensual', 8500, 1, 1, 2025),
  ('Servicio mensual', 12000, 1, 1, 2025),
  ('Servicio mensual', 10000, 1, 1, 2025),
  ('Proyecto web', 35000, 15, 1, 2025),
  ('Campaña ads', 45000, 5, 1, 2025);

-- GASTOS (ejemplo)
INSERT INTO gastos (tipo_de_gasto, importe, dia, mes, año) VALUES
  ('Nómina', 160000, 15, 1, 2025),
  ('Software y herramientas', 8500, 1, 1, 2025),
  ('Publicidad pagada', 25000, 5, 1, 2025),
  ('Oficina', 12000, 1, 1, 2025),
  ('Freelancers', 15000, 20, 1, 2025);

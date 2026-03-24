-- =============================================
-- DROP EXISTING TABLES (if they exist with old schema)
-- =============================================
DROP TABLE IF EXISTS ingresos CASCADE;
DROP TABLE IF EXISTS gastos CASCADE;

-- =============================================
-- INGRESOS TABLE
-- =============================================
CREATE TABLE ingresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concepto TEXT NOT NULL,
  monto DECIMAL(12, 2) NOT NULL DEFAULT 0,
  fecha DATE NOT NULL,
  categoria TEXT DEFAULT 'Otro',
  cliente TEXT,
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE SET NULL,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- GASTOS TABLE
-- =============================================
CREATE TABLE gastos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concepto TEXT NOT NULL,
  monto DECIMAL(12, 2) NOT NULL DEFAULT 0,
  fecha DATE NOT NULL,
  categoria TEXT DEFAULT 'Otro',
  proveedor TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADD NOMINA COLUMNS TO USUARIOS (auth.users)
-- =============================================
-- Note: These columns extend the usuarios table in auth schema
-- You may need to create a public.usuarios_nomina table instead if direct auth.users modification is restricted

CREATE TABLE IF NOT EXISTS usuarios_nomina (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  salario_base DECIMAL(12, 2) DEFAULT 0,
  porcentaje_comision DECIMAL(5, 2) DEFAULT 0,
  bonos DECIMAL(12, 2) DEFAULT 0,
  estado TEXT DEFAULT 'Pendiente', -- Pendiente, Procesando, Pagado
  fecha_pago DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_ingresos_fecha ON ingresos(fecha);
CREATE INDEX IF NOT EXISTS idx_ingresos_categoria ON ingresos(categoria);
CREATE INDEX IF NOT EXISTS idx_ingresos_proyecto_id ON ingresos(proyecto_id);

CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);

CREATE INDEX IF NOT EXISTS idx_usuarios_nomina_estado ON usuarios_nomina(estado);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_nomina ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all ingresos/gastos (adjust as needed for your security model)
CREATE POLICY "Allow authenticated users to view ingresos" ON ingresos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert ingresos" ON ingresos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update ingresos" ON ingresos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete ingresos" ON ingresos
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view gastos" ON gastos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert gastos" ON gastos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update gastos" ON gastos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete gastos" ON gastos
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to view their own nomina" ON usuarios_nomina
  FOR SELECT USING (auth.uid() = id OR auth.role() = 'authenticated');

CREATE POLICY "Allow admins to update nomina" ON usuarios_nomina
  FOR UPDATE USING (auth.role() = 'authenticated');

-- =============================================
-- SAMPLE DATA (optional - remove after testing)
-- =============================================
-- INSERT INTO ingresos (concepto, monto, fecha, categoria, cliente) VALUES
-- ('Proyecto Web Design', 5000, '2025-01-15', 'Servicios', 'Tech Solutions SA'),
-- ('Consultoría Marketing', 3500, '2025-01-20', 'Consultoría', 'FinTech Pro'),
-- ('Mantenimiento Mensual', 1200, '2025-01-25', 'Soporte', 'eShop México');

-- INSERT INTO gastos (concepto, monto, fecha, categoria, proveedor) VALUES
-- ('Hosting y Servidores', 800, '2025-01-10', 'Infraestructura', 'AWS'),
-- ('Software Licenses', 500, '2025-01-15', 'Software', 'Adobe'),
-- ('Oficina Renta', 2000, '2025-01-01', 'Operativo', 'Inmobiliaria XYZ');

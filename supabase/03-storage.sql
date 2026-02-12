-- =============================================
-- Central Marketing CRM - Storage Bucket
-- Ejecutar DESPUÉS de 01-schema.sql
-- =============================================

-- Crear bucket para evidencias
INSERT INTO storage.buckets (id, name, public) VALUES ('evidencias', 'evidencias', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso al bucket
CREATE POLICY "Evidencias públicas de lectura" ON storage.objects FOR SELECT USING (bucket_id = 'evidencias');
CREATE POLICY "Cualquiera puede subir evidencias" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'evidencias');
CREATE POLICY "Cualquiera puede actualizar evidencias" ON storage.objects FOR UPDATE USING (bucket_id = 'evidencias');
CREATE POLICY "Cualquiera puede eliminar evidencias" ON storage.objects FOR DELETE USING (bucket_id = 'evidencias');

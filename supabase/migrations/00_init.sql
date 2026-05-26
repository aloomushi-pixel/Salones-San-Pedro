-- Crear la tabla de leads
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    guests_count INTEGER NOT NULL,
    event_date DATE NOT NULL,
    phone_number TEXT NOT NULL,
    status TEXT DEFAULT 'Nuevo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar seguridad (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Permitir inserciones anónimas o autenticadas a través de server actions
CREATE POLICY "Permitir inserciones desde Server Actions" 
ON public.leads FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Permitir a usuarios autenticados ver y actualizar los leads (Dashboard Admin)
CREATE POLICY "Admins pueden ver leads"
ON public.leads FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins pueden actualizar leads"
ON public.leads FOR UPDATE
TO authenticated
USING (true);

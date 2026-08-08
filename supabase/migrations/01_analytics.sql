-- Crear la tabla de eventos de analíticas
CREATE TABLE public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    source TEXT NOT NULL,
    path TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar seguridad (RLS)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Permitir inserciones anónimas o autenticadas a través de server actions (service_role) o anónimos
CREATE POLICY "Permitir inserciones desde web" 
ON public.analytics_events FOR INSERT 
TO public, anon, authenticated, service_role
WITH CHECK (true);

-- Permitir a usuarios autenticados ver los eventos (Dashboard Admin)
CREATE POLICY "Admins pueden ver analíticas"
ON public.analytics_events FOR SELECT
TO authenticated
USING (true);

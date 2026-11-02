-- Migración Estándar Maestro v2.0: Tabla Controladora de Versiones IA
CREATE TABLE IF NOT EXISTS public.autonomous_evolution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL DEFAULT 'Salones San Pedro Plus (Salones Classics)',
  version_tag text NOT NULL,
  cycle_number integer NOT NULL DEFAULT 1,
  status text NOT NULL CHECK (status IN ('IMPLEMENTED', 'POSTPONED', 'ACTION_REQUIRED', 'TEST_SYNC')),
  short_summary text NOT NULL,
  telemetry_findings text,
  changes_applied jsonb DEFAULT '[]'::jsonb,
  postponed_reason text,
  human_action_required text,
  commit_hash text,
  deployment_uuid text,
  next_timer_seconds integer DEFAULT 21600,
  email_sent boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.autonomous_evolution_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'autonomous_evolution_logs' AND policyname = 'Allow select autonomous_evolution_logs'
  ) THEN
    CREATE POLICY "Allow select autonomous_evolution_logs"
      ON public.autonomous_evolution_logs
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'autonomous_evolution_logs' AND policyname = 'Allow insert autonomous_evolution_logs'
  ) THEN
    CREATE POLICY "Allow insert autonomous_evolution_logs"
      ON public.autonomous_evolution_logs
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

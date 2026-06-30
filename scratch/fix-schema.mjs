import pg from 'pg';

const password = 'E4ae5d6c0c.';
const host = 'db.zogvdrfswyyfnwxeyrtn.supabase.co';
const database = 'postgres';
const user = 'postgres';
const port = 5432;

async function fix() {
  const client = new pg.Client({
    host,
    database,
    user,
    password,
    port,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database successfully!');

    // 1. Alter leads table
    await client.query(`
      ALTER TABLE public.leads 
      ADD COLUMN IF NOT EXISTS email TEXT, 
      ADD COLUMN IF NOT EXISTS location TEXT;
    `);
    console.log('Altered leads table.');

    // 2. Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.messages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
          subject TEXT,
          body TEXT,
          sender TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Created messages table.');

    // 3. Set up RLS for messages
    await client.query(`ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;`);
    
    // Create policies
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Permitir inserciones desde Server Actions para messages'
        ) THEN
            CREATE POLICY "Permitir inserciones desde Server Actions para messages" 
            ON public.messages FOR INSERT TO service_role WITH CHECK (true);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Admins pueden ver messages'
        ) THEN
            CREATE POLICY "Admins pueden ver messages"
            ON public.messages FOR SELECT TO authenticated USING (true);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Admins pueden actualizar messages'
        ) THEN
            CREATE POLICY "Admins pueden actualizar messages"
            ON public.messages FOR UPDATE TO authenticated USING (true);
        END IF;
      END
      $$;
    `);
    console.log('Configured RLS for messages.');

    // 4. Reload schema cache
    await client.query(`NOTIFY pgrst, 'reload schema';`);
    console.log('Reloaded PostgREST schema cache.');

    await client.end();
    console.log('All done!');
  } catch (err) {
    console.error('Database error:', err.message);
    try { await client.end(); } catch (e) {}
  }
}

fix();

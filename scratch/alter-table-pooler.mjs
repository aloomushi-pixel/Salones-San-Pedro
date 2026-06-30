import pg from 'pg';

const passwords = [
  'E4ae5d6c0c..',
  'E4ae5d6c0c.',
  'E4ae5d6c0c',
];

async function run() {
  const host = 'aws-0-us-east-1.pooler.supabase.com';
  const database = 'postgres';
  const user = 'postgres.zogvdrfswyyfnwxeyrtn';
  const port = 6543;

  for (const password of passwords) {
    console.log(`Connecting with password: ${password.substring(0, 4)}...`);
    const client = new pg.Client({
      host,
      database,
      user,
      password,
      port,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      console.log('Connected!');
      const res = await client.query(`
        ALTER TABLE public.messages 
        ADD COLUMN IF NOT EXISTS to_email TEXT,
        ADD COLUMN IF NOT EXISTS cc TEXT,
        ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
      `);
      console.log('Migration successful:', res);
      await client.end();
      return;
    } catch (err) {
      console.error('Error:', err.message);
      try { await client.end(); } catch(e) {}
    }
  }
}

run();

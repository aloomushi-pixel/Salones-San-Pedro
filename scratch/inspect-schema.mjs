import pg from 'pg';

const passwords = [
  'E4ae5d6c0c..',
  'E4ae5d6c0c.',
  'E4ae5d6c0c',
];

async function run() {
  const host = 'db.jxhrbihietcnlqwobwrx.supabase.co';
  const database = 'postgres';
  const user = 'postgres';
  const port = 5432;

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
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'messages';
      `);
      console.log('Columns in messages:', res.rows);
      await client.end();
      return;
    } catch (err) {
      console.error('Error:', err.message);
      try { await client.end(); } catch(e) {}
    }
  }
}

run();

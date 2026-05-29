import pg from 'pg';

const passwords = [
  'E4ae5d6c0c',
  'E4ae5d6c0c.',
  'E4ae5d6c0c..',
  'E4ae5d6c0c...',
  'juangarcia',
  'juangarcia@ccurity.com.mx',
  'E4ae5d6c0c.!',
  'E4ae5d6c0c@',
  'E4ae5d6c0c..'
];

const host = 'db.jxhrbihietcnlqwobwrx.supabase.co';
const port = 6543;
const user = 'postgres';

async function run() {
  for (const password of passwords) {
    console.log(`Trying password: ${password}`);
    const client = new pg.Client({
      host,
      database: 'postgres',
      user,
      password,
      port,
      connectionTimeoutMillis: 5000,
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      await client.connect();
      console.log(`SUCCESS! Password is: ${password}`);
      const res = await client.query('SELECT NOW()');
      console.log('Result:', res.rows);
      await client.end();
      return;
    } catch (err) {
      console.error(`Failed: ${err.message}`);
      try { await client.end(); } catch(e) {}
    }
  }
}

run();

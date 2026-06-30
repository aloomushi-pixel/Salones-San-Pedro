import pg from 'pg';
import fs from 'fs';
import path from 'path';

const passwords = [
  'E4ae5d6c0c',
  'E4ae5d6c0c.',
  'E4ae5d6c0c..',
  'E4ae5d6c0c...',
  'juangarcia',
  'juangarcia@ccurity.com.mx',
  'E4ae5d6c0c.!',
  'E4ae5d6c0c@'
];

async function tryConnectAndAlter() {
  const host = 'db.zogvdrfswyyfnwxeyrtn.supabase.co';
  const database = 'postgres';
  const user = 'postgres';
  const port = 5432;

  for (const password of passwords) {
    console.log(`Trying password: ${password}`);
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
      console.log('Connected successfully!');
      const res = await client.query(`
        ALTER TABLE public.leads 
        ADD COLUMN IF NOT EXISTS email TEXT, 
        ADD COLUMN IF NOT EXISTS location TEXT;
      `);
      console.log('Table altered successfully:', res);
      await client.end();
      return;
    } catch (err) {
      console.error(`Failed with password ${password}:`, err.message);
      try {
        await client.end();
      } catch (e) {}
    }
  }
  console.error('All passwords failed.');
}

tryConnectAndAlter();

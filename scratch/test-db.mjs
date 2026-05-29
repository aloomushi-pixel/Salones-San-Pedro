import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

async function test() {
  const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`;
  console.log('Fetching OpenAPI schema from:', url);
  try {
    const res = await fetch(url);
    const schema = await res.json();
    console.log('RPC Paths in schema:');
    for (const pathKey of Object.keys(schema.paths)) {
      if (pathKey.startsWith('/rpc/')) {
        console.log(`- ${pathKey}`);
      }
    }
  } catch (err) {
    console.error('Error fetching schema:', err);
  }
}

test();

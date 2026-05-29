import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse env variables
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    envVars[key] = val;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('messages').select('*').limit(1);
  if (error) {
    console.error('Error fetching messages:', error);
  } else {
    console.log('Columns in messages table:', data.length > 0 ? Object.keys(data[0]) : 'No records found. Checking table description via API if possible.');
    
    // If no records, let's try inserting a dummy message to see schema errors or successfully insert it
    if (data.length === 0) {
      console.log('Table is empty. Let\'s try to insert a test record with standard columns to see if it succeeds.');
      const testMsg = {
        subject: 'Test Subject',
        body: 'Test Body',
        sender: 'Test Sender'
      };
      const { data: inserted, error: insertError } = await supabase.from('messages').insert([testMsg]).select();
      if (insertError) {
        console.error('Insert error (this helps reveal columns):', insertError);
      } else {
        console.log('Insert succeeded! Created record keys:', Object.keys(inserted[0]));
        // Clean up
        await supabase.from('messages').delete().eq('id', inserted[0].id);
      }
    }
  }
}

run();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('leads').select('id, email').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success. Data:', data);
  }
}
test();

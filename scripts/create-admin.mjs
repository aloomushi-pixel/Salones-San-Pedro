import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'juangarcia@ccurity.com.mx',
    password: 'E4ae5d6c0c.',
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });
  
  if (error) {
    if (error.message.includes('already been registered')) {
      console.log('El usuario administrador ya existe.');
    } else {
      console.error('Error al crear usuario administrador:', error.message);
    }
  } else {
    console.log('Usuario administrador creado exitosamente:', data.user.email);
  }
}

createAdmin();

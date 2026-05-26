import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const usersToCreate = [
  {
    email: 'juangarcia@ccurity.com.mx',
    password: 'E4ae5d6c0c.',
    user_metadata: { role: 'admin', name: 'Juan García' }
  },
  {
    email: 'ventas@sanpedro.com.mx',
    password: 'E4ae5d6c0c.',
    user_metadata: { role: 'admin', name: 'Samantha' }
  },
  {
    email: 'admin@sanpedro.com.mx',
    password: 'E4ae5d6c0c.',
    user_metadata: { role: 'admin', name: 'José' }
  }
];

async function setupUsers() {
  for (const user of usersToCreate) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: user.user_metadata
    });
    
    if (error) {
      if (error.message.includes('already been registered')) {
        console.log(`El usuario ${user.email} ya existe.`);
      } else {
        console.error(`Error al crear usuario ${user.email}:`, error.message);
      }
    } else {
      console.log(`Usuario creado exitosamente: ${data.user.email}`);
    }
  }
}

setupUsers();

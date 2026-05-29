import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno desde .env.local manualmente
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const usersToSetup = [
  {
    email: 'ventas@sanpedro.aionia.com.mx',
    password: 'Sanpedro2026',
    user_metadata: { role: 'admin', name: 'Samantha Flores' }
  },
  {
    email: 'admin@sanpedro.aionia.com.mx',
    password: 'Sanpedro2026',
    user_metadata: { role: 'admin', name: 'José Martinez' }
  }
];

async function run() {
  console.log('--- Iniciando Configuración de Usuarios de Acceso ---');
  
  for (const userConfig of usersToSetup) {
    console.log(`\nProcesando: ${userConfig.email}...`);
    
    // 1. Intentar buscar si el usuario ya existe en Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error al listar usuarios:', listError.message);
      continue;
    }
    
    const existingUser = users.find(u => u.email?.toLowerCase() === userConfig.email.toLowerCase());
    
    if (existingUser) {
      console.log(`El usuario ya existe con ID: ${existingUser.id}. Actualizando contraseña y metadatos...`);
      const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password: userConfig.password,
        user_metadata: userConfig.user_metadata,
        email_confirm: true
      });
      if (error) {
        console.error(`Error al actualizar usuario: ${error.message}`);
      } else {
        console.log(`Usuario actualizado correctamente: ${data.user.email}`);
      }
    } else {
      console.log(`El usuario no existe. Creándolo nuevo...`);
      const { data, error } = await supabase.auth.admin.createUser({
        email: userConfig.email,
        password: userConfig.password,
        user_metadata: userConfig.user_metadata,
        email_confirm: true
      });
      if (error) {
        console.error(`Error al crear usuario: ${error.message}`);
      } else {
        console.log(`Usuario creado correctamente: ${data.user.email}`);
      }
    }
  }
  
  console.log('\n--- Configuración Completada ---');
}

run();

import { createClient } from '@/utils/supabase/server';
import MailboxClient from './MailboxClient';
import { getAllMessages } from '../emailActions';

export const dynamic = 'force-dynamic';

export default async function AdminCorreoPage() {
  const supabase = await createClient();

  // Fetch authenticated user to customize signatures dynamically
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || '';
  
  let adminName = 'Juan García';
  let adminRole = 'Coordinador de Eventos';

  if (userEmail === 'ventas@sanpedro.com.mx') {
    adminName = 'Samantha Flores';
    adminRole = 'Coordinadora de Ventas';
  } else if (userEmail === 'admin@sanpedro.com.mx') {
    adminName = 'José Martinez';
    adminRole = 'Administrador de Eventos';
  }

  // Fetch all leads that have an email registered
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .not('email', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads for mailbox:', error);
    return (
      <div className="max-w-7xl mx-auto mt-8 p-4 bg-error/10 text-error font-body-md rounded-xl">
        Error al cargar la bandeja de correo: {error.message}
      </div>
    );
  }

  // Fetch all messages parsed
  const messages = await getAllMessages();

  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-display-lg text-primary font-bold">Bandeja de Correo</h1>
        <p className="text-secondary font-body-sm text-sm mt-1">
          Visualiza, recibe y responde correos de prospectos en tiempo real.
        </p>
      </div>

      <MailboxClient 
        initialLeads={leads || []} 
        initialMessages={messages} 
        currentUser={{ name: adminName, role: adminRole, email: userEmail }}
      />
    </div>
  );
}

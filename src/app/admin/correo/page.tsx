import { createClient } from '@/utils/supabase/server';
import MailboxClient from './MailboxClient';
import { getAllMessages } from '../emailActions';

export const dynamic = 'force-dynamic';

export default async function AdminCorreoPage() {
  const supabase = await createClient();

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
          Visualiza, recibe y responde correos de prospectos en tiempo real desde ventas@sanpedro.com.mx.
        </p>
      </div>

      <MailboxClient initialLeads={leads || []} initialMessages={messages} />
    </div>
  );
}

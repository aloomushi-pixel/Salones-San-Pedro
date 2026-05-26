import { createClient } from '@/utils/supabase/server';
import { updateLeadStatus } from './actions';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-error p-4">Error cargando registros: {error.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-3xl font-display-lg text-primary mb-8">Registros de Disponibilidad</h1>
      
      <div className="bg-surface rounded-xl shadow-lg border border-outline-variant overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high text-on-surface border-b border-outline-variant">
              <th className="p-4 font-label-lg">Fecha de Solicitud</th>
              <th className="p-4 font-label-lg">Evento</th>
              <th className="p-4 font-label-lg">Invitados</th>
              <th className="p-4 font-label-lg">Fecha del Evento</th>
              <th className="p-4 font-label-lg">Teléfono (WhatsApp)</th>
              <th className="p-4 font-label-lg">Estado</th>
              <th className="p-4 font-label-lg">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {leads?.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-secondary">
                  Aún no hay registros de disponibilidad.
                </td>
              </tr>
            ) : (
              leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-body-sm text-secondary">
                    {new Date(lead.created_at).toLocaleString('es-MX')}
                  </td>
                  <td className="p-4 font-body-md text-on-surface capitalize">
                    {lead.event_type}
                  </td>
                  <td className="p-4 font-body-md text-on-surface">
                    {lead.guests_count}
                  </td>
                  <td className="p-4 font-body-md text-on-surface">
                    {new Date(lead.event_date).toLocaleDateString('es-MX')}
                  </td>
                  <td className="p-4 font-body-md font-bold text-primary">
                    <a href={`https://wa.me/${lead.phone_number.replace(/\D/g, '')}`} target="_blank" className="hover:underline flex items-center gap-1">
                      {lead.phone_number}
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      lead.status === 'Nuevo' ? 'bg-error/10 text-error' : 'bg-[#25D366]/10 text-[#25D366]'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <form action={updateLeadStatus.bind(null, lead.id, lead.status)}>
                      <button className="text-sm border border-outline-variant px-3 py-1 rounded hover:bg-surface-container-highest transition-colors">
                        {lead.status === 'Nuevo' ? 'Marcar Contactado' : 'Marcar Nuevo'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

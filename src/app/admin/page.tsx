import { createClient } from '@/utils/supabase/server';
import { updateLeadStatus } from './actions';
import LeadActionsClient from '@/components/LeadActionsClient';

// Helper to parse created_at (UTC) and convert to Mexico City local date object
function getMXDate(dateVal: Date | string) {
  const d = new Date(dateVal);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  const parts = formatter.formatToParts(d);
  const partValues: Record<string, number> = {};
  parts.forEach(p => {
    if (p.type !== 'literal') {
      partValues[p.type] = parseInt(p.value, 10);
    }
  });
  return new Date(
    partValues.year,
    partValues.month - 1,
    partValues.day,
    partValues.hour,
    partValues.minute,
    partValues.second
  );
}

// Helper to format event date string (YYYY-MM-DD) safely without timezone offset shifts
function formatEventDate(dateStr: string) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return d.toLocaleDateString('es-MX', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  return dateStr;
}

// Helper to format creation timestamp in Mexico City timezone with 12h format
function formatMXTimestamp(dateVal: string) {
  return new Date(dateVal).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Fetch user to customize dynamic signatures
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || '';
  let adminName = 'Juan García';
  if (userEmail === 'ventas@sanpedro.com.mx' || userEmail === 'ventas@sanpedro.aionia.com.mx') {
    adminName = 'Samantha Flores';
  } else if (userEmail === 'admin@sanpedro.com.mx' || userEmail === 'admin@sanpedro.aionia.com.mx') {
    adminName = 'José Martinez';
  }

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="text-error p-4 font-body-md">Error cargando registros: {error.message}</div>;
  }

  // 1. Process data for statistics
  const totalLeads = leads?.length || 0;
  const now = new Date();
  const nowMX = getMXDate(now);
  
  // Start of current calendar month in MX timezone
  const startOfMonth = new Date(nowMX.getFullYear(), nowMX.getMonth(), 1);
  const leadsThisMonth = leads?.filter(l => getMXDate(l.created_at) >= startOfMonth).length || 0;
  
  // Start of current week (Monday) in MX timezone
  const startOfWeek = new Date(nowMX);
  const day = nowMX.getDay();
  const diff = nowMX.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  const leadsThisWeek = leads?.filter(l => getMXDate(l.created_at) >= startOfWeek).length || 0;
  
  // Pending leads
  const pendingLeads = leads?.filter(l => l.status === 'Nuevo').length || 0;
  const contactedLeads = leads?.filter(l => l.status === 'Contactado').length || 0;

  // Monthly breakdown using MX local time
  const monthlyData: { [key: string]: number } = {};
  leads?.forEach(l => {
    const d = getMXDate(l.created_at);
    const key = d.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
    monthlyData[key] = (monthlyData[key] || 0) + 1;
  });

  // Weekly breakdown using MX local time
  const getWeekRangeString = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    const start = new Date(d);
    const end = new Date(d);
    end.setDate(end.getDate() + 6);
    return `${start.getDate()} ${start.toLocaleString('es-MX', { month: 'short' })} - ${end.getDate()} ${end.toLocaleString('es-MX', { month: 'short' })}`;
  };

  const weeklyData: { [key: string]: number } = {};
  leads?.forEach(l => {
    const d = getMXDate(l.created_at);
    const key = `Semana ${getWeekRangeString(d)}`;
    weeklyData[key] = (weeklyData[key] || 0) + 1;
  });

  // Generate last 6 months list
  const last6Months: { label: string; count: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(nowMX.getFullYear(), nowMX.getMonth() - i, 1);
    const key = d.toLocaleString('es-MX', { month: 'long', year: 'numeric' });
    last6Months.push({
      label: key,
      count: monthlyData[key] || 0
    });
  }

  // Generate last 6 weeks list
  const last6Weeks: { label: string; count: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(nowMX);
    d.setDate(d.getDate() - (i * 7));
    const key = `Semana ${getWeekRangeString(d)}`;
    last6Weeks.push({
      label: key,
      count: weeklyData[key] || 0
    });
  }

  const maxMonthCount = Math.max(...last6Months.map(m => m.count), 1);
  const maxWeekCount = Math.max(...last6Weeks.map(w => w.count), 1);

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 md:px-0 pb-16 space-y-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="text-3xl font-display-lg text-primary font-bold">Panel de Administración</h1>
          <p className="text-secondary font-body-sm text-sm mt-1">
            Visualización en tiempo real de registros y métricas de adquisición (Zona Horaria: Ciudad de México).
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 px-4 py-2 rounded-lg text-xs font-semibold text-secondary">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          Conectado con Supabase
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Leads */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-secondary font-label-sm text-xs uppercase tracking-wider font-bold">Total Prospectos</p>
            <h3 className="text-4xl font-display-lg font-bold text-on-surface">{totalLeads}</h3>
            <p className="text-secondary font-body-sm text-xs">Registros históricos</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
        </div>

        {/* Card 2: This Month */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-secondary font-label-sm text-xs uppercase tracking-wider font-bold">Este Mes</p>
            <h3 className="text-4xl font-display-lg font-bold text-primary">{leadsThisMonth}</h3>
            <p className="text-secondary font-body-sm text-xs">En el mes actual</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-3xl font-bold">calendar_month</span>
          </div>
        </div>

        {/* Card 3: This Week */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-secondary font-label-sm text-xs uppercase tracking-wider font-bold">Esta Semana</p>
            <h3 className="text-4xl font-display-lg font-bold text-[#25D366]">{leadsThisWeek}</h3>
            <p className="text-secondary font-body-sm text-xs">Lunes a Domingo local</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-[#25D366]">
            <span className="material-symbols-outlined text-3xl">date_range</span>
          </div>
        </div>

        {/* Card 4: Pendings */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-secondary font-label-sm text-xs uppercase tracking-wider font-bold">Por Contactar</p>
            <h3 className="text-4xl font-display-lg font-bold text-error">{pendingLeads}</h3>
            <p className="text-secondary font-body-sm text-xs">{contactedLeads} ya contactados</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-3xl">chat_bubble</span>
          </div>
        </div>
      </div>

      {/* Graphs / Historical Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Month by Month */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl font-bold">bar_chart</span>
            <h3 className="font-display-lg text-xl font-bold text-on-surface">Prospectos por Mes (Últimos 6 meses)</h3>
          </div>
          <div className="space-y-5">
            {last6Months.map((item) => {
              const pct = (item.count / maxMonthCount) * 100;
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-body-md">
                    <span className="capitalize font-medium text-on-surface">{item.label}</span>
                    <span className="font-bold text-primary">{item.count} {item.count === 1 ? 'prospecto' : 'prospectos'}</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-container h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Week by Week */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-md">
          <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl font-bold">stacked_line_chart</span>
            <h3 className="font-display-lg text-xl font-bold text-on-surface">Prospectos por Semana (Últimas 6 semanas)</h3>
          </div>
          <div className="space-y-5">
            {last6Weeks.map((item) => {
              const pct = (item.count / maxWeekCount) * 100;
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-body-md">
                    <span className="font-medium text-on-surface">{item.label}</span>
                    <span className="font-bold text-[#25D366]">{item.count} {item.count === 1 ? 'prospecto' : 'prospectos'}</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
          <span className="material-symbols-outlined text-primary text-2xl font-bold">list_alt</span>
          <h2 className="font-display-lg text-2xl font-bold text-on-surface">Listado Detallado de Prospectos</h2>
        </div>
        
        <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface border-b border-outline-variant/35">
                  <th className="p-4 font-label-sm text-xs uppercase tracking-wider font-bold">Registro</th>
                  <th className="p-4 font-label-sm text-xs uppercase tracking-wider font-bold">Prospecto</th>
                  <th className="p-4 font-label-sm text-xs uppercase tracking-wider font-bold">Evento</th>
                  <th className="p-4 font-label-sm text-xs uppercase tracking-wider font-bold text-center">Invitados</th>
                  <th className="p-4 font-label-sm text-xs uppercase tracking-wider font-bold">Fecha Evento</th>
                  <th className="p-4 font-label-sm text-xs uppercase tracking-wider font-bold">Estimado / Extras</th>
                  <th className="p-4 font-label-sm text-xs uppercase tracking-wider font-bold text-center">Estado</th>
                  <th className="p-4 font-label-sm text-xs uppercase tracking-wider font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/25">
                {leads?.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-secondary font-body-md">
                      Aún no hay registros de disponibilidad.
                    </td>
                  </tr>
                ) : (
                  leads?.map((lead) => (
                    <tr key={lead.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="p-4 font-body-sm text-on-surface font-semibold text-sm">
                        {formatMXTimestamp(lead.created_at)}
                      </td>
                      <td className="p-4 font-body-md text-on-surface">
                        <div className="font-bold">{lead.name || <span className="text-secondary/60 italic text-xs">Sin nombre</span>}</div>
                        {lead.email && <div className="text-xs text-secondary mt-1"><a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">{lead.email}</a></div>}
                        <div className="text-xs text-secondary mt-0.5">
                          <a href={`https://wa.me/${lead.phone_number?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">call</span> {lead.phone_number}
                          </a>
                        </div>
                      </td>
                      <td className="p-4 font-body-md text-on-surface">
                        <div className="font-bold capitalize">{lead.event_type}</div>
                        {lead.salon && <div className="text-xs text-secondary mt-1">Salón: <span className="font-semibold">{lead.salon}</span></div>}
                        {lead.package_type && <div className="text-xs text-secondary">Pqte: <span className="font-semibold">{lead.package_type}</span></div>}
                      </td>
                      <td className="p-4 font-body-md text-on-surface text-center font-bold">
                        {lead.guests_count}
                      </td>
                      <td className="p-4 font-body-md text-secondary text-sm">
                        {formatEventDate(lead.event_date)}
                      </td>
                      <td className="p-4 font-body-md text-on-surface">
                        {lead.estimated_total ? (
                          <div className="font-bold text-primary">${lead.estimated_total.toLocaleString('es-MX')}</div>
                        ) : (
                          <div className="text-xs text-secondary/60 italic truncate max-w-[120px]" title={lead.location}>Antiguo: {lead.location}</div>
                        )}
                        {lead.extra_service && <div className="text-xs text-secondary mt-1 text-primary-container-dark">Extra: {lead.extra_service}</div>}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                          lead.status === 'Nuevo' ? 'bg-error/10 text-error' : 'bg-green-500/10 text-green-500'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <LeadActionsClient
                          leadId={lead.id}
                          eventType={lead.event_type}
                          guestsCount={lead.guests_count}
                          eventDate={formatEventDate(lead.event_date)}
                          email={lead.email}
                          phoneNumber={lead.phone_number}
                          status={lead.status}
                          adminName={adminName}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

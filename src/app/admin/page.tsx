import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

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

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  const userEmail = user?.email || '';
  let adminName = 'Juan García';
  if (userEmail === 'ventas@sanpedro.com.mx' || userEmail === 'ventas@sanpedro.aionia.com.mx') {
    adminName = 'Samantha Flores';
  } else if (userEmail === 'admin@sanpedro.com.mx' || userEmail === 'admin@sanpedro.aionia.com.mx') {
    adminName = 'José Martinez';
  }

  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false });

  // If table doesn't exist yet, gracefully handle it
  if (error) {
    return (
      <div className="min-h-screen bg-surface p-8 text-on-surface">
        <h1 className="text-3xl font-bold mb-4">Error cargando analíticas</h1>
        <p className="text-error">{error.message}</p>
        <p className="mt-4 text-secondary">Asegúrate de haber ejecutado la migración de Supabase (01_analytics.sql).</p>
      </div>
    );
  }

  // 1. Process data for statistics
  const totalClicks = events?.length || 0;
  const now = new Date();
  const nowMX = getMXDate(now);
  
  const startOfMonth = new Date(nowMX.getFullYear(), nowMX.getMonth(), 1);
  const clicksThisMonth = events?.filter(e => getMXDate(e.created_at) >= startOfMonth).length || 0;
  
  const startOfWeek = new Date(nowMX);
  startOfWeek.setDate(nowMX.getDate() - (nowMX.getDay() === 0 ? 6 : nowMX.getDay() - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  const clicksThisWeek = events?.filter(e => getMXDate(e.created_at) >= startOfWeek).length || 0;
  
  const startOfDay = new Date(nowMX);
  startOfDay.setHours(0, 0, 0, 0);
  const clicksToday = events?.filter(e => getMXDate(e.created_at) >= startOfDay).length || 0;

  // 2. Source distribution
  const sourceCount: Record<string, number> = {};
  events?.forEach(e => {
    sourceCount[e.source] = (sourceCount[e.source] || 0) + 1;
  });

  // Sort sources by count
  const sortedSources = Object.entries(sourceCount).sort((a, b) => b[1] - a[1]);

  // 3. Heatmap Data (Day of Week vs Hour)
  // Rows: Mon(1) to Sun(0)
  // Cols: 0 to 23
  const heatmapData = Array.from({ length: 7 }, () => Array(24).fill(0));
  
  let maxHeat = 0;
  events?.forEach(e => {
    const mxDate = getMXDate(e.created_at);
    // getDay() 0=Sun, 1=Mon... we want Mon=0, Sun=6
    let day = mxDate.getDay() - 1;
    if (day === -1) day = 6;
    const hour = mxDate.getHours();
    heatmapData[day][hour]++;
    if (heatmapData[day][hour] > maxHeat) {
      maxHeat = heatmapData[day][hour];
    }
  });

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-on-surface">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display-lg text-primary font-bold">Monitor de Interacciones</h1>
            <p className="text-secondary font-body-md mt-2">
              ¡Hola, <span className="font-bold text-on-surface">{adminName}</span>! Aquí tienes el resumen de clics e interacciones de tus clientes.
            </p>
          </div>
          <div className="bg-surface-container shadow-sm px-6 py-3 rounded-xl border border-outline-variant/30 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-on-surface">Sistema Activo</span>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-surface rounded-2xl p-6 shadow-xl border border-outline-variant/30 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">today</span>
            </div>
            <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Clics Hoy</p>
            <p className="text-5xl font-display-lg text-primary font-bold">{clicksToday}</p>
          </div>
          <div className="bg-surface rounded-2xl p-6 shadow-xl border border-outline-variant/30 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">date_range</span>
            </div>
            <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Esta Semana</p>
            <p className="text-5xl font-display-lg text-primary font-bold">{clicksThisWeek}</p>
          </div>
          <div className="bg-surface rounded-2xl p-6 shadow-xl border border-outline-variant/30 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">calendar_month</span>
            </div>
            <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Este Mes</p>
            <p className="text-5xl font-display-lg text-primary font-bold">{clicksThisMonth}</p>
          </div>
          <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl">monitoring</span>
            </div>
            <p className="text-sm font-bold uppercase tracking-wider mb-2">Total Histórico</p>
            <p className="text-5xl font-display-lg font-bold">{totalClicks}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Gráfico de Barras de Origen */}
          <div className="lg:col-span-1 bg-surface rounded-3xl p-8 shadow-xl border border-outline-variant/30">
            <h2 className="text-xl font-display-lg text-on-surface font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">pie_chart</span>
              Fuentes de Clics
            </h2>
            <div className="space-y-6">
              {sortedSources.length > 0 ? sortedSources.map(([source, count]) => {
                const percentage = Math.round((count / totalClicks) * 100);
                return (
                  <div key={source}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-on-surface">{source}</span>
                      <span className="text-secondary">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-secondary text-sm">Aún no hay datos suficientes.</p>
              )}
            </div>
          </div>

          {/* Heatmap de Actividad */}
          <div className="lg:col-span-2 bg-surface rounded-3xl p-8 shadow-xl border border-outline-variant/30 overflow-x-auto">
            <h2 className="text-xl font-display-lg text-on-surface font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">grid_on</span>
              Mapa de Calor (Interacciones por Hora)
            </h2>
            
            <div className="min-w-[700px]">
              <div className="flex mb-2">
                <div className="w-20"></div>
                {Array.from({length: 24}).map((_, i) => (
                  <div key={i} className="flex-1 text-center text-xs text-secondary">{i}h</div>
                ))}
              </div>
              
              <div className="space-y-2">
                {heatmapData.map((dayData, dayIdx) => (
                  <div key={dayIdx} className="flex items-center gap-2">
                    <div className="w-20 text-xs font-bold text-on-surface text-right pr-2">
                      {daysOfWeek[dayIdx]}
                    </div>
                    {dayData.map((count, hourIdx) => {
                      // Calcular intensidad del 0 al 1
                      const intensity = maxHeat > 0 ? count / maxHeat : 0;
                      // Seleccionar color basado en intensidad
                      let bgClass = "bg-surface-container-high"; // 0
                      if (intensity > 0) bgClass = "bg-[#d4af37]/20"; // low
                      if (intensity > 0.3) bgClass = "bg-[#d4af37]/50"; // med
                      if (intensity > 0.6) bgClass = "bg-[#d4af37]/80"; // high
                      if (intensity > 0.8) bgClass = "bg-[#d4af37]"; // max
                      
                      return (
                        <div 
                          key={hourIdx} 
                          className={`flex-1 h-8 rounded-sm ${bgClass} transition-colors hover:ring-2 hover:ring-primary cursor-pointer relative group`}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-on-surface text-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                            {count} clics
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 text-xs text-secondary">
                <span>Menos</span>
                <div className="w-4 h-4 bg-surface-container-high rounded-sm"></div>
                <div className="w-4 h-4 bg-[#d4af37]/20 rounded-sm"></div>
                <div className="w-4 h-4 bg-[#d4af37]/50 rounded-sm"></div>
                <div className="w-4 h-4 bg-[#d4af37]/80 rounded-sm"></div>
                <div className="w-4 h-4 bg-[#d4af37] rounded-sm"></div>
                <span>Más clics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Últimos eventos (Lista) */}
        <div className="bg-surface rounded-3xl p-8 shadow-xl border border-outline-variant/30">
          <h2 className="text-xl font-display-lg text-on-surface font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Últimas Interacciones
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-secondary uppercase bg-surface-container-lowest border-b border-outline-variant/30">
                <tr>
                  <th className="px-6 py-4 font-bold rounded-tl-xl">Fecha y Hora</th>
                  <th className="px-6 py-4 font-bold">Tipo de Evento</th>
                  <th className="px-6 py-4 font-bold">Origen (Fuente)</th>
                  <th className="px-6 py-4 font-bold rounded-tr-xl">Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {events?.slice(0, 15).map(e => (
                  <tr key={e.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 text-on-surface font-medium whitespace-nowrap">
                      {new Date(e.created_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City', dateStyle: 'short', timeStyle: 'short'})}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {e.event_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{e.source}</td>
                    <td className="px-6 py-4 text-secondary text-xs max-w-[200px] truncate" title={e.user_agent}>{e.user_agent || 'N/A'}</td>
                  </tr>
                ))}
                {(!events || events.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-secondary">
                      No hay registros de interacciones todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

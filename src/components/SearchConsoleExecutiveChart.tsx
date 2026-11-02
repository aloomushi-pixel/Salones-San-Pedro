'use client';

import React, { useMemo, useState } from 'react';
import { ParsedAnalyticsEvent } from '@/utils/telemetryParser';

export type ExecutivePeriodPreset =
  | 'post_deploy'
  | 'all'
  | '6m'
  | '3m'
  | '1m'
  | 'custom'
  | 'today'
  | '7d'
  | '15d';

export type ChartMetricKey =
  | 'total_clients'
  | 'returning_clients'
  | 'organic_seo'
  | 'other_channels'
  | 'whatsapp_leads'
  | 'precotizador_users'
  | 'package_explorers';

interface MetricConfig {
  key: ChartMetricKey;
  label: string;
  shortLabel: string;
  clientExplanation: string;
  color: string;
  bgLight: string;
  borderLight: string;
  textDark: string;
  defaultChecked: boolean;
}

const METRICS_CONFIG: MetricConfig[] = [
  {
    key: 'total_clients',
    label: 'Clientes que entraron a la página (Sesiones Totales)',
    shortLabel: 'Clientes que entraron',
    clientExplanation:
      'Total de visitas de clientes reales que entraron al sitio web para conocer los salones y paquetes.',
    color: '#2563EB', // Azul Google Search Console
    bgLight: 'bg-blue-50/80',
    borderLight: 'border-blue-300',
    textDark: 'text-blue-900',
    defaultChecked: true,
  },
  {
    key: 'returning_clients',
    label: 'Clientes que repitieron su sesión (Regresaron)',
    shortLabel: 'Repitieron sesión',
    clientExplanation:
      'Clientes con alto interés que volvieron a entrar a la página en más de una ocasión para revisar precios o detalles.',
    color: '#7C3AED', // Morado Search Console
    bgLight: 'bg-purple-50/80',
    borderLight: 'border-purple-300',
    textDark: 'text-purple-900',
    defaultChecked: true,
  },
  {
    key: 'organic_seo',
    label: 'Llegaron por Búsqueda Orgánica / SEO (Google, Bing, IA y Blog)',
    shortLabel: 'Búsqueda Orgánica / SEO',
    clientExplanation:
      'Clientes que nos encontraron en buscadores (Google, Bing, ChatGPT) o mediante nuestros artículos SEO sin pagar publicidad.',
    color: '#059669', // Esmeralda SEO
    bgLight: 'bg-emerald-50/80',
    borderLight: 'border-emerald-300',
    textDark: 'text-emerald-900',
    defaultChecked: true,
  },
  {
    key: 'other_channels',
    label: 'Llegaron por Otros Medios (Directo, Redes Sociales, Enlaces)',
    shortLabel: 'Otros Medios (Directo / Redes)',
    clientExplanation:
      'Clientes que entraron escribiendo la dirección web directamente, desde Instagram, Facebook, TikTok o un link compartido.',
    color: '#D97706', // Ámbar
    bgLight: 'bg-amber-50/80',
    borderLight: 'border-amber-300',
    textDark: 'text-amber-900',
    defaultChecked: true,
  },
  {
    key: 'whatsapp_leads',
    label: 'Clientes que contactaron por WhatsApp (Cotizaciones)',
    shortLabel: 'Contactos a WhatsApp',
    clientExplanation:
      'Clientes que dieron el paso final de abrir WhatsApp para enviar su cotización o agendar cita en el salón.',
    color: '#16A34A', // Verde WhatsApp
    bgLight: 'bg-green-50/80',
    borderLight: 'border-green-300',
    textDark: 'text-green-900',
    defaultChecked: true,
  },
  {
    key: 'precotizador_users',
    label: 'Clientes que calcularon su evento en el Precotizador',
    shortLabel: 'Usaron el Precotizador',
    clientExplanation:
      'Personas que interactuaron con la calculadora de eventos eligiendo número de invitados, paquete o servicios extra.',
    color: '#E11D48', // Rosa Ejecutivo
    bgLight: 'bg-rose-50/80',
    borderLight: 'border-rose-300',
    textDark: 'text-rose-900',
    defaultChecked: false,
  },
  {
    key: 'package_explorers',
    label: 'Clientes que exploraron Paquetes y Precios ($530 / $710 / $1,010)',
    shortLabel: 'Vieron Paquetes y Precios',
    clientExplanation:
      'Clientes que revisaron la tabla comparativa de paquetes o abrieron el detalle de lo que incluye cada paquete.',
    color: '#0284C7', // Azul Cielo
    bgLight: 'bg-sky-50/80',
    borderLight: 'border-sky-300',
    textDark: 'text-sky-900',
    defaultChecked: false,
  },
];

interface DailyBucket {
  date: string; // YYYY-MM-DD
  labelShort: string; // ej. "21 oct"
  labelFull: string; // ej. "Miércoles, 21 de octubre de 2026"
  total_clients: number;
  returning_clients: number;
  organic_seo: number;
  other_channels: number;
  whatsapp_leads: number;
  precotizador_users: number;
  package_explorers: number;
}

interface Props {
  events: ParsedAnalyticsEvent[];
  period: ExecutivePeriodPreset;
  onPeriodChange: (p: ExecutivePeriodPreset) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (val: string) => void;
  onCustomToChange: (val: string) => void;
}

const MONTHS_SHORT_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const MONTHS_LONG_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const DAYS_LONG_ES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

function formatDateLabels(ymd: string): { short: string; full: string } {
  const parts = ymd.split('-');
  if (parts.length !== 3) return { short: ymd, full: ymd };
  const year = parseInt(parts[0], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const dObj = new Date(year, monthIdx, day);
  const dayName = DAYS_LONG_ES[dObj.getDay()] || '';
  const monthShort = MONTHS_SHORT_ES[monthIdx] || '';
  const monthLong = MONTHS_LONG_ES[monthIdx] || '';
  return {
    short: `${day} ${monthShort}`,
    full: `${dayName}, ${day} de ${monthLong} de ${year}`,
  };
}

/**
 * Determina si una sesión llegó por Búsqueda Orgánica / SEO (Google, Bing, Yahoo, ChatGPT/IA o aterrizaje en artículos SEO del blog)
 */
function isOrganicSEOSession(sessionEvents: ParsedAnalyticsEvent[]): boolean {
  for (const ev of sessionEvents) {
    const ch = (ev.meta.acquisition?.traffic_channel || '').toLowerCase();
    const ref = (
      ev.meta.acquisition?.referrer ||
      ev.meta.acquisition?.referrer_domain ||
      ''
    ).toLowerCase();
    const utmMedium = (ev.meta.acquisition?.utm_medium || '').toLowerCase();
    const utmSource = (ev.meta.acquisition?.utm_source || '').toLowerCase();
    const path = (ev.path || ev.meta.acquisition?.landing_path || '').toLowerCase();

    // Si es campaña pagada explícita (CPC / Ads), pertenece a otros medios
    if (
      ch.includes('ads') ||
      utmMedium === 'cpc' ||
      utmMedium === 'ppc' ||
      utmMedium === 'paid' ||
      Boolean(ev.meta.acquisition?.ad_click_id)
    ) {
      continue;
    }

    // Búsqueda orgánica en Google, Bing, Yahoo, DuckDuckGo, Google Search App o IA Generativa (GEO)
    if (
      ch.includes('orgánico') ||
      ch.includes('organico') ||
      ch.includes('google search') ||
      ch.includes('seo') ||
      ch.includes('ia generativa') ||
      ch.includes('chatgpt') ||
      ch.includes('bing') ||
      /google\.|bing\.|yahoo\.|duckduckgo\.|chatgpt\.|openai\.|perplexity\.|gemini\.google/i.test(
        ref
      ) ||
      /google|bing|yahoo|duckduckgo|chatgpt|perplexity/i.test(utmSource)
    ) {
      return true;
    }

    // Si el cliente entró o consultó directamente un artículo de posicionamiento SEO del Blog
    if (path.startsWith('/blog')) {
      return true;
    }
  }
  return false;
}

export default function SearchConsoleExecutiveChart({
  events,
  period,
  onPeriodChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
}: Props) {
  const [checkedMetrics, setCheckedMetrics] = useState<Record<ChartMetricKey, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    METRICS_CONFIG.forEach((m) => {
      initial[m.key] = m.defaultChecked;
    });
    return initial as Record<ChartMetricKey, boolean>;
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [timelineScaleMode, setTimelineScaleMode] = useState<'active_days' | 'full_calendar'>(
    'active_days'
  );

  const toggleMetric = (key: ChartMetricKey) => {
    setCheckedMetrics((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Garantizar al menos 1 métrica activa para que la gráfica nunca quede vacía
      const activeCount = Object.values(next).filter(Boolean).length;
      if (activeCount === 0) return prev;
      return next;
    });
  };

  const selectAllMetrics = () => {
    const next: Record<string, boolean> = {};
    METRICS_CONFIG.forEach((m) => {
      next[m.key] = true;
    });
    setCheckedMetrics(next as Record<ChartMetricKey, boolean>);
  };

  const selectDefaultMetrics = () => {
    const next: Record<string, boolean> = {};
    METRICS_CONFIG.forEach((m) => {
      next[m.key] = m.defaultChecked;
    });
    setCheckedMetrics(next as Record<ChartMetricKey, boolean>);
  };

  // Identificar visitantes que tienen múltiples sesiones en todo el historial para enriquecer la detección de "repitieron sesión"
  const globalReturningSessionIds = useMemo(() => {
    const visitorSessionsMap = new Map<string, Array<{ sid: string; firstTs: number }>>();

    events.forEach((ev) => {
      const vid = ev.visitor_id || ev.session_id;
      const sid = ev.session_id;
      const ts = new Date(ev.created_at).getTime() || 0;
      if (!visitorSessionsMap.has(vid)) {
        visitorSessionsMap.set(vid, [{ sid, firstTs: ts }]);
      } else {
        const list = visitorSessionsMap.get(vid)!;
        const existing = list.find((item) => item.sid === sid);
        if (existing) {
          if (ts < existing.firstTs) existing.firstTs = ts;
        } else {
          list.push({ sid, firstTs: ts });
        }
      }
    });

    const returningSet = new Set<string>();
    visitorSessionsMap.forEach((list) => {
      if (list.length > 1) {
        list.sort((a, b) => a.firstTs - b.firstTs);
        // Todas las sesiones posteriores a la primera del mismo visitante son sesiones repetidas
        for (let i = 1; i < list.length; i++) {
          returningSet.add(list[i].sid);
        }
      }
    });

    // Además incluir cualquier sesión que explícitamente tenga meta.is_returning === true o visit_number > 1
    events.forEach((ev) => {
      if (ev.meta.is_returning || (ev.meta.visit_number && ev.meta.visit_number > 1)) {
        returningSet.add(ev.session_id);
      }
    });

    return returningSet;
  }, [events]);

  // Agrupar por fecha (YYYY-MM-DD) y calcular totales ejecutivos del periodo
  const chartData = useMemo(() => {
    // Agrupar eventos por sesión y por fecha principal de la sesión
    const sessionsById = new Map<string, ParsedAnalyticsEvent[]>();
    events.forEach((ev) => {
      const list = sessionsById.get(ev.session_id) || [];
      list.push(ev);
      sessionsById.set(ev.session_id, list);
    });

    const bucketsMap = new Map<
      string,
      {
        sessions: Set<string>;
        returningSessions: Set<string>;
        organicSessions: Set<string>;
        otherChannelSessions: Set<string>;
        whatsappSessions: Set<string>;
        precotizadorSessions: Set<string>;
        packageSessions: Set<string>;
      }
    >();

    const ensureBucket = (ymd: string) => {
      if (!bucketsMap.has(ymd)) {
        bucketsMap.set(ymd, {
          sessions: new Set(),
          returningSessions: new Set(),
          organicSessions: new Set(),
          otherChannelSessions: new Set(),
          whatsappSessions: new Set(),
          precotizadorSessions: new Set(),
          packageSessions: new Set(),
        });
      }
      return bucketsMap.get(ymd)!;
    };

    // Totales únicos en el periodo seleccionado
    const totalSessionsSet = new Set<string>();
    const returningSessionsSet = new Set<string>();
    const organicSessionsSet = new Set<string>();
    const otherChannelSessionsSet = new Set<string>();
    const whatsappSessionsSet = new Set<string>();
    const precotizadorSessionsSet = new Set<string>();
    const packageSessionsSet = new Set<string>();

    // Desglose adicional de "Otros Medios" para explicarle al cliente con claridad
    let directCount = 0;
    let socialCount = 0;
    let referralOrAdsCount = 0;

    // Desglose interno de SEO para explicar al cliente
    let googleBingCount = 0;
    let aiGeoCount = 0;
    let blogSeoCount = 0;

    sessionsById.forEach((sessionEvents, sid) => {
      // Tomar la fecha más temprana de la sesión en CDMX
      const sorted = [...sessionEvents].sort((a, b) =>
        a.date_cdmx.localeCompare(b.date_cdmx)
      );
      const primaryDate = sorted[0]?.date_cdmx || '2026-10-21';
      const bucket = ensureBucket(primaryDate);

      totalSessionsSet.add(sid);
      bucket.sessions.add(sid);

      // 1. ¿Repitió sesión?
      const isReturning = globalReturningSessionIds.has(sid);
      if (isReturning) {
        returningSessionsSet.add(sid);
        bucket.returningSessions.add(sid);
      }

      // 2. ¿Llegó por Búsqueda Orgánica / SEO o por Otros Medios?
      const isOrganic = isOrganicSEOSession(sessionEvents);
      if (isOrganic) {
        organicSessionsSet.add(sid);
        bucket.organicSessions.add(sid);

        const hasAi = sessionEvents.some((e) =>
          (e.meta.acquisition?.traffic_channel || '').toLowerCase().includes('ia generativa')
        );
        const hasBlog = sessionEvents.some((e) => (e.path || '').startsWith('/blog'));
        if (hasAi) aiGeoCount += 1;
        else if (hasBlog) blogSeoCount += 1;
        else googleBingCount += 1;
      } else {
        otherChannelSessionsSet.add(sid);
        bucket.otherChannelSessions.add(sid);

        const ch = (sorted[0]?.meta.acquisition?.traffic_channel || '').toLowerCase();
        if (
          ch.includes('instagram') ||
          ch.includes('facebook') ||
          ch.includes('tiktok') ||
          ch.includes('whatsapp') ||
          ch.includes('social')
        ) {
          socialCount += 1;
        } else if (ch.includes('referido') || ch.includes('ads')) {
          referralOrAdsCount += 1;
        } else {
          directCount += 1;
        }
      }

      // 3. ¿Contactó por WhatsApp?
      const hasWA = sessionEvents.some((e) => e.event_type === 'whatsapp_click');
      if (hasWA) {
        whatsappSessionsSet.add(sid);
        bucket.whatsappSessions.add(sid);
      }

      // 4. ¿Usó el Precotizador?
      const hasPrecotizador = sessionEvents.some(
        (e) =>
          e.event_type === 'precotizador_step' ||
          e.meta.section === 'precotizador' ||
          (e.source || '').includes('precotizador')
      );
      if (hasPrecotizador) {
        precotizadorSessionsSet.add(sid);
        bucket.precotizadorSessions.add(sid);
      }

      // 5. ¿Exploró Paquetes y Precios?
      const hasPackages = sessionEvents.some(
        (e) =>
          e.event_type === 'cotizar_click' ||
          e.event_type === 'locked_package_click' ||
          e.meta.section === 'paquetes' ||
          Boolean(e.meta.package_name) ||
          (e.source || '').includes('paquete')
      );
      if (hasPackages) {
        packageSessionsSet.add(sid);
        bucket.packageSessions.add(sid);
      }
    });

    // Construir el eje X de fechas continuas
    const existingDates = Array.from(bucketsMap.keys()).sort();
    let startYmd = existingDates[0] || '2026-10-14';
    let endYmd = existingDates[existingDates.length - 1] || '2026-10-31';

    if (timelineScaleMode === 'full_calendar') {
      const now = new Date();
      const todayYmd = now.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
      if (period === '1m') {
        const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        startYmd = d.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
        endYmd = todayYmd;
      } else if (period === '3m') {
        const d = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        startYmd = d.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
        endYmd = todayYmd;
      } else if (period === '6m') {
        const d = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        startYmd = d.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
        endYmd = todayYmd;
      } else if (period === 'custom') {
        startYmd = customFrom;
        endYmd = customTo;
      }
    } else if (existingDates.length > 0 && existingDates.length < 7) {
      // Si hay pocos días activos, agregar 2 días antes para que la curva luzca amplia estilo Search Console
      const [y, m, d] = startYmd.split('-').map(Number);
      const padStart = new Date(y, m - 1, d - 2);
      startYmd = `${padStart.getFullYear()}-${String(padStart.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(padStart.getDate()).padStart(2, '0')}`;
    }

    const dailySeries: DailyBucket[] = [];
    const [sy, sm, sd] = startYmd.split('-').map(Number);
    const [ey, em, ed] = endYmd.split('-').map(Number);
    const cursor = new Date(sy, (sm || 1) - 1, sd || 1);
    const endDate = new Date(ey, (em || 1) - 1, ed || 1);

    let safety = 0;
    while (cursor <= endDate && safety < 400) {
      safety += 1;
      const ymd = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(cursor.getDate()).padStart(2, '0')}`;
      const b = bucketsMap.get(ymd);
      const labels = formatDateLabels(ymd);

      dailySeries.push({
        date: ymd,
        labelShort: labels.short,
        labelFull: labels.full,
        total_clients: b ? b.sessions.size : 0,
        returning_clients: b ? b.returningSessions.size : 0,
        organic_seo: b ? b.organicSessions.size : 0,
        other_channels: b ? b.otherChannelSessions.size : 0,
        whatsapp_leads: b ? b.whatsappSessions.size : 0,
        precotizador_users: b ? b.precotizadorSessions.size : 0,
        package_explorers: b ? b.packageSessions.size : 0,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    const totals: Record<ChartMetricKey, number> = {
      total_clients: totalSessionsSet.size,
      returning_clients: returningSessionsSet.size,
      organic_seo: organicSessionsSet.size,
      other_channels: otherChannelSessionsSet.size,
      whatsapp_leads: whatsappSessionsSet.size,
      precotizador_users: precotizadorSessionsSet.size,
      package_explorers: packageSessionsSet.size,
    };

    const peaks: Record<ChartMetricKey, number> = {
      total_clients: Math.max(0, ...dailySeries.map((d) => d.total_clients)),
      returning_clients: Math.max(0, ...dailySeries.map((d) => d.returning_clients)),
      organic_seo: Math.max(0, ...dailySeries.map((d) => d.organic_seo)),
      other_channels: Math.max(0, ...dailySeries.map((d) => d.other_channels)),
      whatsapp_leads: Math.max(0, ...dailySeries.map((d) => d.whatsapp_leads)),
      precotizador_users: Math.max(0, ...dailySeries.map((d) => d.precotizador_users)),
      package_explorers: Math.max(0, ...dailySeries.map((d) => d.package_explorers)),
    };

    return {
      dailySeries,
      totals,
      peaks,
      seoBreakdown: {
        googleBingCount,
        aiGeoCount,
        blogSeoCount,
      },
      otherBreakdown: {
        directCount,
        socialCount,
        referralOrAdsCount,
      },
    };
  }, [events, globalReturningSessionIds, timelineScaleMode, period, customFrom, customTo]);

  // Dimensiones del gráfico SVG tipo Google Search Console
  const svgWidth = 1000;
  const svgHeight = 320;
  const padLeft = 48;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 42;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const activeMetricConfigs = METRICS_CONFIG.filter((m) => checkedMetrics[m.key]);

  const maxY = useMemo(() => {
    let maxVal = 4;
    chartData.dailySeries.forEach((day) => {
      activeMetricConfigs.forEach((m) => {
        if (day[m.key] > maxVal) maxVal = day[m.key];
      });
    });
    // Redondear hacia arriba a un múltiplo limpio para las líneas guía del eje Y
    return Math.ceil(maxVal * 1.15);
  }, [chartData.dailySeries, activeMetricConfigs]);

  const yTicks = useMemo(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => Math.round((maxY / steps) * i));
  }, [maxY]);

  const getX = (index: number, totalPoints: number) => {
    if (totalPoints <= 1) return padLeft + plotWidth / 2;
    return padLeft + (index / (totalPoints - 1)) * plotWidth;
  };

  const getY = (val: number) => {
    if (maxY <= 0) return padTop + plotHeight;
    return padTop + plotHeight - (val / maxY) * plotHeight;
  };

  const totalPoints = chartData.dailySeries.length;
  const hoveredBucket =
    hoveredIndex !== null && chartData.dailySeries[hoveredIndex]
      ? chartData.dailySeries[hoveredIndex]
      : null;

  const totalClientsBase = Math.max(1, chartData.totals.total_clients);
  const organicPct = Math.round((chartData.totals.organic_seo / totalClientsBase) * 100);
  const otherPct = Math.round((chartData.totals.other_channels / totalClientsBase) * 100);
  const returningPct = Math.round((chartData.totals.returning_clients / totalClientsBase) * 100);

  return (
    <section className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-7">
      {/* ENCABEZADO EJECUTIVO Y SELECTOR DE PERIODO ESTILO GOOGLE SEARCH CONSOLE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-extrabold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Vista Ejecutiva para Cliente • Estilo Google Search Console
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Rendimiento de Clientes, Sesiones Repetidas y Búsqueda Orgánica (SEO)
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Resumen visual claro y directo para mostrar resultados comerciales: cuántos clientes entraron, cuántos regresaron a ver la página, cuántos llegaron por posicionamiento SEO en Google y cuántos por otros medios.
          </p>
        </div>

        {/* BOTONES DE PERIODO SOLICITADOS POR EL USUARIO */}
        <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Periodo de la Gráfica y Tabla:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            {[
              { id: 'post_deploy', label: '🚀 Desde último commit' },
              { id: 'all', label: 'Todo el histórico' },
              { id: '6m', label: 'Hace 6 meses' },
              { id: '3m', label: 'Hace 3 meses' },
              { id: '1m', label: 'Hace 1 mes' },
              { id: 'custom', label: 'Periodo personalizado' },
            ].map((p) => {
              const isActive = period === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPeriodChange(p.id as ExecutivePeriodPreset)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {period === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 mt-1 bg-blue-50/70 border border-blue-200 px-3.5 py-2 rounded-xl">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                Desde:
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => onCustomFromChange(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900"
                />
              </label>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                Hasta:
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => onCustomToChange(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* TARJETAS SUPERIORES ESTILO GOOGLE SEARCH CONSOLE (5 INDICADORES PRINCIPALES CON CHECKBOX) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {METRICS_CONFIG.slice(0, 5).map((metric) => {
          const isChecked = checkedMetrics[metric.key];
          const val = chartData.totals[metric.key];
          const pct =
            metric.key === 'total_clients'
              ? 100
              : Math.round((val / totalClientsBase) * 100);

          return (
            <button
              key={metric.key}
              type="button"
              onClick={() => toggleMetric(metric.key)}
              className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                isChecked
                  ? `${metric.bgLight} ${metric.borderLight} shadow-xs`
                  : 'bg-white border-slate-200 opacity-65 hover:opacity-100'
              }`}
            >
              {/* Barra superior de color idéntica a Search Console */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-opacity"
                style={{
                  backgroundColor: metric.color,
                  opacity: isChecked ? 1 : 0.2,
                }}
              />
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-800">
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center text-white text-[10px] font-black shrink-0 border"
                    style={{
                      backgroundColor: isChecked ? metric.color : '#FFFFFF',
                      borderColor: metric.color,
                    }}
                  >
                    {isChecked ? '✓' : ''}
                  </span>
                  {metric.shortLabel}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="text-3xl font-black text-slate-900">{val}</span>
                <span
                  className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-700"
                >
                  {metric.key === 'total_clients' ? '100% total' : `${pct}% de clientes`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ÁREA DE LA GRÁFICA INTERACTIVA ESTILO SEARCH CONSOLE */}
      <div className="bg-slate-50/60 border border-slate-200 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Líneas activas en la gráfica:
            </span>
            {activeMetricConfigs.map((m) => (
              <span
                key={m.key}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800"
              >
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: m.color }}
                />
                {m.shortLabel} ({chartData.totals[m.key]})
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() =>
                setTimelineScaleMode((prev) =>
                  prev === 'active_days' ? 'full_calendar' : 'active_days'
                )
              }
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer transition-all"
            >
              {timelineScaleMode === 'active_days'
                ? '🔎 Vista enfocada en días con tráfico'
                : '📅 Vista calendario completo'}
            </button>
          </div>
        </div>

        {/* SVG MULTI-LÍNEA CON TOOLTIP FLOTANTE */}
        <div className="relative w-full">
          {hoveredBucket && hoveredIndex !== null && (
            <div className="mb-3 p-3.5 rounded-xl bg-slate-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="font-bold text-amber-300">
                📅 {hoveredBucket.labelFull}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {activeMetricConfigs.map((m) => (
                  <div key={m.key} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: m.color }}
                    />
                    <span className="text-slate-300">{m.shortLabel}:</span>
                    <strong className="text-white text-sm">{hoveredBucket[m.key]}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-[270px] sm:h-[320px] select-none overflow-visible"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Líneas horizontales de cuadrícula (Eje Y) */}
              {yTicks.map((tickVal, idx) => {
                const y = getY(tickVal);
                return (
                  <g key={idx}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={svgWidth - padRight}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray={idx === 0 ? undefined : '4 4'}
                      strokeWidth={1}
                    />
                    <text
                      x={padLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-slate-400 text-[11px] font-semibold"
                    >
                      {tickVal}
                    </text>
                  </g>
                );
              })}

              {/* Línea guía vertical al pasar el mouse */}
              {hoveredIndex !== null && totalPoints > 0 && (
                <line
                  x1={getX(hoveredIndex, totalPoints)}
                  y1={padTop}
                  x2={getX(hoveredIndex, totalPoints)}
                  y2={padTop + plotHeight}
                  stroke="#94A3B8"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
              )}

              {/* Polilíneas y áreas suaves para cada métrica marcada con checkbox */}
              {activeMetricConfigs.map((metric) => {
                if (totalPoints === 0) return null;

                const points = chartData.dailySeries.map((d, i) => ({
                  x: getX(i, totalPoints),
                  y: getY(d[metric.key]),
                  val: d[metric.key],
                }));

                const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');
                const areaStr = `${points[0].x},${padTop + plotHeight} ${polylineStr} ${
                  points[points.length - 1].x
                },${padTop + plotHeight}`;

                return (
                  <g key={metric.key}>
                    <polygon
                      points={areaStr}
                      fill={metric.color}
                      fillOpacity={0.07}
                    />
                    <polyline
                      fill="none"
                      stroke={metric.color}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylineStr}
                    />
                    {points.map((p, i) => {
                      const isHovered = hoveredIndex === i;
                      // Si hay más de 40 días en el eje X, mostrar puntos solo donde hay valor > 0 o en hover
                      if (totalPoints > 45 && p.val === 0 && !isHovered) return null;
                      return (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? 6 : 3.5}
                          fill="#FFFFFF"
                          stroke={metric.color}
                          strokeWidth={isHovered ? 3.5 : 2.5}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Etiquetas de fecha en el Eje X */}
              {chartData.dailySeries.map((d, i) => {
                const maxLabels = 10;
                const step = Math.max(1, Math.ceil(totalPoints / maxLabels));
                const showLabel = i % step === 0 || i === totalPoints - 1;
                if (!showLabel) return null;
                const x = getX(i, totalPoints);
                return (
                  <text
                    key={d.date}
                    x={x}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    className="fill-slate-500 text-[11px] font-semibold"
                  >
                    {d.labelShort}
                  </text>
                );
              })}

              {/* Franjas invisibles para interacción precisa con mouse/touch por cada día */}
              {chartData.dailySeries.map((d, i) => {
                const x = getX(i, totalPoints);
                const sliceWidth = totalPoints > 1 ? plotWidth / (totalPoints - 1) : plotWidth;
                return (
                  <rect
                    key={d.date}
                    x={x - sliceWidth / 2}
                    y={padTop}
                    width={sliceWidth}
                    height={plotHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(i)}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* TABLA EJECUTIVA CON CHECKBOXES DE MÉTRICAS (PARA MOSTRAR AL CLIENTE) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Tabla de Métricas con Checkboxes (Selecciona qué mostrar en la gráfica)
            </h3>
            <p className="text-xs text-slate-600">
              Haz clic en cualquier fila o casilla para activar o desactivar su línea en la gráfica superior. Explicación en lenguaje claro para tu cliente.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectDefaultMetrics}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all"
            >
              Principales (5)
            </button>
            <button
              type="button"
              onClick={selectAllMetrics}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 cursor-pointer transition-all"
            >
              Marcar Todas (7)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3.5 px-4 w-16 text-center">Gráfica</th>
                <th className="py-3.5 px-4">Indicador para el Cliente</th>
                <th className="py-3.5 px-4">¿Qué significa para el negocio?</th>
                <th className="py-3.5 px-4 text-center">Total en el Periodo</th>
                <th className="py-3.5 px-4 text-center">% sobre Clientes</th>
                <th className="py-3.5 px-4 text-center">Pico en 1 Día</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {METRICS_CONFIG.map((metric) => {
                const isChecked = checkedMetrics[metric.key];
                const totalVal = chartData.totals[metric.key];
                const peakVal = chartData.peaks[metric.key];
                const pct =
                  metric.key === 'total_clients'
                    ? 100
                    : Math.round((totalVal / totalClientsBase) * 100);

                return (
                  <tr
                    key={metric.key}
                    onClick={() => toggleMetric(metric.key)}
                    className={`transition-colors cursor-pointer ${
                      isChecked ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded cursor-pointer accent-blue-600"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: metric.color }}
                        />
                        <span className="font-bold text-slate-900">{metric.label}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-md">
                      {metric.clientExplanation}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className="text-lg font-black px-3 py-1 rounded-lg inline-block"
                        style={{
                          color: metric.color,
                          backgroundColor: `${metric.color}12`,
                        }}
                      >
                        {totalVal}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700 text-xs">
                      {metric.key === 'total_clients' ? '100% (Base)' : `${pct}%`}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-slate-600">
                      {peakVal} en un día
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESUMEN EJECUTIVO DE ORIGEN Y RECURRENCIA EN 3 BLOQUES SIMPLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        {/* Bloque 1: Búsqueda Orgánica / SEO */}
        <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              🔍 1. Llegaron por Búsqueda Orgánica / SEO
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-200/70 text-emerald-950">
              {organicPct}% del total
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-900">
            {chartData.totals.organic_seo} clientes por SEO
          </p>
          <p className="text-xs text-emerald-900/90 leading-relaxed">
            Buscadores Google/Bing: <strong>{chartData.seoBreakdown.googleBingCount}</strong> • Artículos del Blog SEO:{' '}
            <strong>{chartData.seoBreakdown.blogSeoCount}</strong> • Buscadores IA (ChatGPT):{' '}
            <strong>{chartData.seoBreakdown.aiGeoCount}</strong>.
          </p>
        </div>

        {/* Bloque 2: Otros Medios */}
        <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              📱 2. Llegaron por Otros Medios
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-950">
              {otherPct}% del total
            </span>
          </div>
          <p className="text-2xl font-black text-amber-900">
            {chartData.totals.other_channels} clientes directos / redes
          </p>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            Acceso directo / Link compartido: <strong>{chartData.otherBreakdown.directCount}</strong> • Redes Sociales (IG/FB/TikTok):{' '}
            <strong>{chartData.otherBreakdown.socialCount}</strong> • Referidos externos:{' '}
            <strong>{chartData.otherBreakdown.referralOrAdsCount}</strong>.
          </p>
        </div>

        {/* Bloque 3: Clientes que repitieron sesión */}
        <div className="p-5 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-900">
              🔄 3. Clientes que Repitieron Sesión
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-200/70 text-purple-950">
              {returningPct}% de recurrencia
            </span>
          </div>
          <p className="text-2xl font-black text-purple-900">
            {chartData.totals.returning_clients} sesiones repetidas
          </p>
          <p className="text-xs text-purple-900/90 leading-relaxed">
            Clientes que entraron más de una vez para comparar paquetes o mostrarle los salones a su familia antes de cotizar por WhatsApp (<strong>{chartData.totals.whatsapp_leads}</strong> contactos a WhatsApp).
          </p>
        </div>
      </div>
    </section>
  );
}

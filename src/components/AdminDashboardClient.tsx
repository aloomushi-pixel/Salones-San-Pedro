'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ParsedAnalyticsEvent } from '@/utils/telemetryParser';

export interface LeadRecord {
  id: string;
  event_type: string | null;
  guests_count: number | null;
  event_date: string | null;
  phone_number: string | null;
  status: string | null;
  created_at: string;
  email: string | null;
  location: string | null;
}

interface Props {
  events: ParsedAnalyticsEvent[];
  leads: LeadRecord[];
  errorMessage?: string | null;
}

type PeriodPreset = 'today' | '7d' | '15d' | '30d' | '90d' | 'all' | 'custom';
type ActiveTab = 'overview' | 'schedule' | 'sections' | 'funnel' | 'seo_geo' | 'sessions_leads';

function countBy(items: string[]): Array<{ label: string; count: number; pct: number }> {
  const map: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (!item) continue;
    map[item] = (map[item] || 0) + 1;
    total += 1;
  }
  return Object.entries(map)
    .map(([label, count]) => ({
      label,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export default function AdminDashboardClient({ events, leads, errorMessage }: Props) {
  const [period, setPeriod] = useState<PeriodPreset>('all');
  const [customFrom, setCustomFrom] = useState<string>('2026-09-01');
  const [customTo, setCustomTo] = useState<string>('2026-12-31');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Filtrar eventos según el periodo seleccionado
  const filteredEvents = useMemo(() => {
    if (period === 'all') return events;
    const now = new Date();

    if (period === 'custom') {
      return events.filter((ev) => {
        return ev.date_cdmx >= customFrom && ev.date_cdmx <= customTo;
      });
    }

    const daysMap: Record<Exclude<PeriodPreset, 'all' | 'custom'>, number> = {
      today: 1,
      '7d': 7,
      '15d': 15,
      '30d': 30,
      '90d': 90,
    };
    const days = daysMap[period];
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return events.filter((ev) => new Date(ev.created_at) >= cutoff);
  }, [events, period, customFrom, customTo]);

  // Cálculo integral de todos los indicadores y agregaciones
  const stats = useMemo(() => {
    const totalEvents = filteredEvents.length;
    const uniqueSessions = new Set(filteredEvents.map((e) => e.session_id)).size;
    const uniqueVisitors = new Set(filteredEvents.map((e) => e.visitor_id)).size;

    const whatsappEvents = filteredEvents.filter((e) => e.event_type === 'whatsapp_click');
    const cotizarEvents = filteredEvents.filter((e) => e.event_type === 'cotizar_click');
    const pageViews = filteredEvents.filter((e) => e.event_type === 'page_view');
    const precotizadorSteps = filteredEvents.filter((e) => e.event_type === 'precotizador_step');
    const lockedClicks = filteredEvents.filter((e) => e.event_type === 'locked_package_click');
    const deadClicks = filteredEvents.filter((e) => e.event_type === 'dead_click');
    const rageClicks = filteredEvents.filter((e) => e.event_type === 'rage_click');
    const textCopies = filteredEvents.filter((e) => e.event_type === 'text_copy');

    // Tiempos activos por sesión
    const sessionMaxActiveMs: Record<string, number> = {};
    const sessionMaxScroll: Record<string, number> = {};
    const sessionChannel: Record<string, string> = {};
    const sessionDevice: Record<string, string> = {};
    const sessionOS: Record<string, string> = {};
    const sessionGeo: Record<string, string> = {};
    const sessionConvertedWA = new Set<string>();

    filteredEvents.forEach((e) => {
      const sid = e.session_id;
      const act = e.meta.timers?.active_time_ms || 0;
      if (act > (sessionMaxActiveMs[sid] || 0)) {
        sessionMaxActiveMs[sid] = act;
      }
      const scr = e.meta.max_scroll_pct || e.meta.scroll_pct || 0;
      if (scr > (sessionMaxScroll[sid] || 0)) {
        sessionMaxScroll[sid] = scr;
      }
      if (!sessionChannel[sid] && e.meta.acquisition?.traffic_channel) {
        sessionChannel[sid] = e.meta.acquisition.traffic_channel;
      }
      if (!sessionDevice[sid] && e.meta.device?.device_type) {
        sessionDevice[sid] = e.meta.device.device_type;
      }
      if (!sessionOS[sid] && e.meta.device?.os) {
        sessionOS[sid] = e.meta.device.os;
      }
      if (!sessionGeo[sid] && (e.meta.geo?.city || e.meta.geo?.region)) {
        sessionGeo[sid] = `${e.meta.geo?.city || 'CDMX'}, ${e.meta.geo?.region || 'México'}`;
      }
      if (e.event_type === 'whatsapp_click') {
        sessionConvertedWA.add(sid);
      }
    });

    const activeTimes = Object.values(sessionMaxActiveMs).filter((ms) => ms > 0);
    const avgActiveTimeSec =
      activeTimes.length > 0
        ? Math.round(activeTimes.reduce((a, b) => a + b, 0) / activeTimes.length / 1000)
        : 0;

    const scrollVals = Object.values(sessionMaxScroll).filter((s) => s > 0);
    const avgScrollPct =
      scrollVals.length > 0
        ? Math.round(scrollVals.reduce((a, b) => a + b, 0) / scrollVals.length)
        : 0;

    const conversionRateWA =
      uniqueSessions > 0 ? Number(((sessionConvertedWA.size / uniqueSessions) * 100).toFixed(1)) : 0;

    // Horarios (00 a 23h CDMX)
    const hoursCount = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: `${String(h).padStart(2, '0')}:00`,
      total: 0,
      conversions: 0,
    }));

    // Días de la semana de visita
    const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dayStats: Record<string, { total: number; conversions: number; isWeekend: boolean }> = {};
    daysOrder.forEach((d) => {
      dayStats[d] = {
        total: 0,
        conversions: 0,
        isWeekend: d === 'Viernes' || d === 'Sábado' || d === 'Domingo',
      };
    });

    let weekendEvents = 0;
    let weekdayEvents = 0;
    let weekendConversions = 0;
    let weekdayConversions = 0;

    filteredEvents.forEach((e) => {
      const h = e.hour_cdmx;
      if (hoursCount[h]) {
        hoursCount[h].total += 1;
        if (e.event_type === 'whatsapp_click' || e.event_type === 'cotizar_click') {
          hoursCount[h].conversions += 1;
        }
      }
      if (dayStats[e.day_of_week]) {
        dayStats[e.day_of_week].total += 1;
        if (e.event_type === 'whatsapp_click' || e.event_type === 'cotizar_click') {
          dayStats[e.day_of_week].conversions += 1;
        }
      }
      if (e.is_weekend) {
        weekendEvents += 1;
        if (e.event_type === 'whatsapp_click' || e.event_type === 'cotizar_click') {
          weekendConversions += 1;
        }
      } else {
        weekdayEvents += 1;
        if (e.event_type === 'whatsapp_click' || e.event_type === 'cotizar_click') {
          weekdayConversions += 1;
        }
      }
    });

    const timeSlots = countBy(filteredEvents.map((e) => e.time_slot));

    // Demanda por día de evento buscado y temporada buscada (Precotizador + Leads)
    const preferredDaysDemand = countBy(
      filteredEvents.map((e) => e.meta.preferred_day || '').filter(Boolean)
    );
    const preferredSeasonsDemand = countBy(
      filteredEvents.map((e) => e.meta.preferred_season || '').filter(Boolean)
    );
    const guestsRangeDemand = countBy(
      filteredEvents.map((e) => e.meta.guests_range || '').filter(Boolean)
    );
    const eventKindsDemand = countBy(
      filteredEvents.map((e) => e.meta.event_kind || '').filter(Boolean)
    );

    // Interés por Paquete (combinando clics en tarjetas de paquetes + selección en precotizador)
    const packageSignals: string[] = [];
    filteredEvents.forEach((e) => {
      if (e.meta.package_name) {
        packageSignals.push(`Paquete ${e.meta.package_name}`);
      } else if (e.source === 'paquete_plus') {
        packageSignals.push('Paquete Plus (Tarjeta Home)');
      } else if (e.source === 'paquete_premier') {
        packageSignals.push('Paquete Premier (Tarjeta Home)');
      } else if (e.source === 'paquete_all_inclusive') {
        packageSignals.push('Paquete All Inclusive (Tarjeta Home)');
      } else if (e.source === 'paquete_CTA') {
        packageSignals.push('Paquete Premier / All Inclusive (Histórico CTA)');
      }
    });
    const packageDemand = countBy(packageSignals);

    // Atención y permanencia por sección
    const sectionOrder = [
      { id: 'inicio', label: 'Hero Principal & Propuesta (#inicio)' },
      { id: 'precotizador', label: 'Precotizador Interactivo' },
      { id: 'paquetes', label: 'Tabla de Paquetes y Precios (#paquetes)' },
      { id: 'galeria', label: 'Galería Salón Diamante y Platino (#galeria)' },
      { id: 'tiktok-videos', label: 'Videos de TikTok (#tiktok-videos)' },
      { id: 'banquetes', label: 'Experiencia Gastronómica / Menú 3 Tiempos (#banquetes)' },
      { id: 'animacion', label: 'Experiencias Multi-sensoriales (#animacion)' },
      { id: 'testimonios', label: 'Testimonios de Google (#testimonios)' },
      { id: 'ubicacion', label: 'Footer, Mapa y Contacto (#ubicacion)' },
      { id: 'blog', label: 'Artículos del Blog (/blog)' },
    ];

    const sectionMetrics: Record<
      string,
      { views: number; interactions: number; dwellMsTotal: number; dwellCount: number; friction: number }
    > = {};
    sectionOrder.forEach((s) => {
      sectionMetrics[s.id] = { views: 0, interactions: 0, dwellMsTotal: 0, dwellCount: 0, friction: 0 };
    });

    filteredEvents.forEach((e) => {
      let sec = e.meta.section || 'inicio';
      if (sec.startsWith('blog')) sec = 'blog';
      if (!sectionMetrics[sec]) {
        sectionMetrics[sec] = { views: 0, interactions: 0, dwellMsTotal: 0, dwellCount: 0, friction: 0 };
      }

      if (e.event_type === 'section_view' || e.event_type === 'page_view') {
        sectionMetrics[sec].views += 1;
      } else if (e.event_type === 'dead_click' || e.event_type === 'rage_click' || e.event_type === 'locked_package_click') {
        sectionMetrics[sec].friction += 1;
      } else if (
        e.event_type !== 'scroll_depth' &&
        e.event_type !== 'web_vitals' &&
        e.event_type !== 'session_exit' &&
        e.event_type !== 'tab_visibility'
      ) {
        sectionMetrics[sec].interactions += 1;
      }

      // Extraer mapa de permanencia si viene en session_exit / tab_visibility
      const dwellMap = e.meta.extra?.section_dwell_map_ms as Record<string, number> | undefined;
      if (dwellMap && typeof dwellMap === 'object') {
        Object.entries(dwellMap).forEach(([k, ms]) => {
          const normKey = k.startsWith('blog') ? 'blog' : k;
          if (!sectionMetrics[normKey]) {
            sectionMetrics[normKey] = { views: 0, interactions: 0, dwellMsTotal: 0, dwellCount: 0, friction: 0 };
          }
          if (typeof ms === 'number' && ms > 0) {
            sectionMetrics[normKey].dwellMsTotal += ms;
            sectionMetrics[normKey].dwellCount += 1;
          }
        });
      } else if (e.meta.timers?.section_dwell_ms && e.meta.timers.section_dwell_ms > 0) {
        sectionMetrics[sec].dwellMsTotal += e.meta.timers.section_dwell_ms;
        sectionMetrics[sec].dwellCount += 1;
      }
    });

    const sectionTable = sectionOrder.map((s) => {
      const m = sectionMetrics[s.id];
      const avgDwellSec = m.dwellCount > 0 ? Math.round(m.dwellMsTotal / m.dwellCount / 1000) : 0;
      return {
        ...s,
        views: m.views,
        interactions: m.interactions,
        avgDwellSec,
        friction: m.friction,
      };
    });

    // Embudo del Precotizador
    const step1Events = precotizadorSteps.filter((e) => e.meta.step_number === 1);
    const step2Events = precotizadorSteps.filter((e) => e.meta.step_number === 2);
    const step3Events = precotizadorSteps.filter((e) => e.meta.step_number === 3);
    const step4WA = whatsappEvents.filter((e) => e.source === 'precotizador');

    const avgStepMs = (arr: ParsedAnalyticsEvent[]) => {
      const vals = arr.map((e) => e.meta.timers?.step_duration_ms || 0).filter((v) => v > 0);
      return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length / 1000) : 0;
    };

    const funnel = {
      step1Count: step1Events.length,
      step1AvgSec: avgStepMs(step1Events),
      step2Count: step2Events.length,
      step2AvgSec: avgStepMs(step2Events),
      step3Count: step3Events.length,
      step3AvgSec: avgStepMs(step3Events),
      step4WACount: step4WA.length,
      totalWizardAvgSec: avgStepMs(step4WA),
    };

    // SEO, Canales, Dispositivos, SO, Geografía
    const channels = countBy(filteredEvents.map((e) => e.meta.acquisition?.traffic_channel || 'Directo'));
    const devices = countBy(filteredEvents.map((e) => e.meta.device?.device_type || 'Desktop'));
    const osList = countBy(filteredEvents.map((e) => e.meta.device?.os || 'Otro'));
    const browsers = countBy(filteredEvents.map((e) => e.meta.device?.browser || 'Otro'));
    const locations = countBy(
      filteredEvents.map((e) => {
        if (e.meta.geo?.city || e.meta.geo?.region) {
          return `${e.meta.geo.city || 'CDMX'}, ${e.meta.geo.region || 'México'}`;
        }
        return 'Ciudad de México / Zona Metropolitana (Inferido)';
      })
    );
    const isps = countBy(
      filteredEvents.map((e) => e.meta.geo?.isp || '').filter(Boolean)
    );
    const topPaths = countBy(filteredEvents.map((e) => e.path || '/'));

    // Web Vitals
    const fcpVals = filteredEvents.map((e) => e.meta.timers?.fcp_ms || 0).filter((v) => v > 0);
    const ttfbVals = filteredEvents.map((e) => e.meta.timers?.ttfb_ms || 0).filter((v) => v > 0);
    const domVals = filteredEvents.map((e) => e.meta.timers?.dom_load_ms || 0).filter((v) => v > 0);
    const ttfiVals = filteredEvents.map((e) => e.meta.timers?.ttfi_ms || 0).filter((v) => v > 0);

    const avgMs = (arr: number[]) =>
      arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    return {
      totalEvents,
      uniqueSessions,
      uniqueVisitors,
      whatsappCount: whatsappEvents.length,
      whatsappPrecotizador: whatsappEvents.filter((e) => e.source === 'precotizador').length,
      whatsappFloating: whatsappEvents.filter((e) => e.source === 'floating_button').length,
      cotizarCount: cotizarEvents.length,
      pageViewsCount: pageViews.length,
      lockedClicksCount: lockedClicks.length,
      deadClicksCount: deadClicks.length,
      rageClicksCount: rageClicks.length,
      textCopiesCount: textCopies.length,
      avgActiveTimeSec,
      avgScrollPct,
      conversionRateWA,
      hoursCount,
      dayStats,
      daysOrder,
      weekendEvents,
      weekdayEvents,
      weekendConversions,
      weekdayConversions,
      timeSlots,
      preferredDaysDemand,
      preferredSeasonsDemand,
      guestsRangeDemand,
      eventKindsDemand,
      packageDemand,
      sectionTable,
      funnel,
      channels,
      devices,
      osList,
      browsers,
      locations,
      isps,
      topPaths,
      webVitals: {
        avgFcpMs: avgMs(fcpVals),
        avgTtfbMs: avgMs(ttfbVals),
        avgDomMs: avgMs(domVals),
        avgTtfiMs: avgMs(ttfiVals),
      },
      deadClicks,
      rageClicks,
      textCopies,
      lockedClicks,
    };
  }, [filteredEvents]);

  // Generador de Diagnóstico Markdown / Texto para IA (Antigravity)
  const buildAIDiagnosticMarkdown = () => {
    const nowStr = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    const lines: string[] = [
      `# REPORTE DE INTELIGENCIA UX, HORARIOS, TEMPORADAS Y SEO — SALONES SAN PEDRO PLUS`,
      `- **Fecha de generación (CDMX):** ${nowStr}`,
      `- **Periodo analizado:** ${period.toUpperCase()} (${stats.totalEvents} eventos registrados en ${stats.uniqueSessions} sesiones)`,
      ``,
      `## 1. KPIs Ejecutivos de Experiencia y Conversión`,
      `- **Sesiones Únicas Estimadas:** ${stats.uniqueSessions} (${stats.uniqueVisitors} visitantes únicos)`,
      `- **Total de Interacciones / Eventos:** ${stats.totalEvents}`,
      `- **Clics Directos a WhatsApp:** ${stats.whatsappCount} (${stats.whatsappPrecotizador} desde Precotizador, ${stats.whatsappFloating} desde Botón Flotante)`,
      `- **Clics de Intención en Paquetes / Cotizar:** ${stats.cotizarCount}`,
      `- **Tasa de Conversión a WhatsApp por Sesión:** ${stats.conversionRateWA}%`,
      `- **Tiempo Activo Promedio en Página:** ${stats.avgActiveTimeSec} segundos`,
      `- **Profundidad de Scroll Promedio:** ${stats.avgScrollPct}%`,
      `- **Prospectos en Tabla Leads (CRM):** ${leads.length}`,
      ``,
      `## 2. Inteligencia Temporal: Horarios y Días de la Semana (Zona Horaria CDMX)`,
      `- **Actividad en Fin de Semana (Viernes, Sábado, Domingo):** ${stats.weekendEvents} eventos (${stats.weekendConversions} conversiones)`,
      `- **Actividad Entre Semana (Lunes a Jueves):** ${stats.weekdayEvents} eventos (${stats.weekdayConversions} conversiones)`,
      `### Franjas Horarias de Mayor Actividad:`,
      ...stats.timeSlots.map((t) => `- **${t.label}:** ${t.count} eventos (${t.pct}%)`),
      `### Actividad por Día de la Semana:`,
      ...stats.daysOrder.map(
        (d) =>
          `- **${d} (${stats.dayStats[d].isWeekend ? 'Fin de Semana' : 'Entre Semana'}):** ${stats.dayStats[d].total} eventos | ${stats.dayStats[d].conversions} clics de conversión`
      ),
      `### Horas Pico del Día (Top 5 horas CDMX):`,
      ...[...stats.hoursCount]
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
        .map((h) => `- **${h.label} hrs:** ${h.total} eventos (${h.conversions} conversiones)`),
      ``,
      `## 3. Demanda Comercial, Temporadas, Regla de 50 Personas y Paquetes`,
      `### Interés por Paquete:`,
      ...(stats.packageDemand.length > 0
        ? stats.packageDemand.map((p) => `- **${p.label}:** ${p.count} (${p.pct}%)`)
        : [`- Sin datos suficientes en este periodo`]),
      `### Aforo Buscado (Regla 50–99 vs 100+ personas):`,
      ...(stats.guestsRangeDemand.length > 0
        ? stats.guestsRangeDemand.map((g) => `- **${g.label}:** ${g.count} (${g.pct}%)`)
        : [`- En recolección para nuevas sesiones del precotizador`]),
      `- **Intentos de Clic en Paquetes Bloqueados (<100 personas intentando elegir Plus/All Inclusive):** ${stats.lockedClicksCount}`,
      `### Día de la Semana Buscado para el Evento:`,
      ...(stats.preferredDaysDemand.length > 0
        ? stats.preferredDaysDemand.map((d) => `- **${d.label}:** ${d.count} (${d.pct}%)`)
        : [`- En recolección`]),
      `### Temporada / Mes Tentativo Buscado:`,
      ...(stats.preferredSeasonsDemand.length > 0
        ? stats.preferredSeasonsDemand.map((s) => `- **${s.label}:** ${s.count} (${s.pct}%)`)
        : [`- En recolección`]),
      `### Giro del Evento:`,
      ...(stats.eventKindsDemand.length > 0
        ? stats.eventKindsDemand.map((k) => `- **${k.label}:** ${k.count} (${k.pct}%)`)
        : [`- En recolección`]),
      ``,
      `## 4. Embudo del Precotizador y Tiempos de Decisión`,
      `- **Paso 1 Completado (Aforo, Día y Temporada):** ${stats.funnel.step1Count} (Tiempo prom: ${stats.funnel.step1AvgSec}s)`,
      `- **Paso 2 Completado (Selección de Paquete):** ${stats.funnel.step2Count} (Tiempo prom: ${stats.funnel.step2AvgSec}s)`,
      `- **Paso 3 Completado (Giro y Extras):** ${stats.funnel.step3Count} (Tiempo prom: ${stats.funnel.step3AvgSec}s)`,
      `- **Paso 4 Conversión a WhatsApp:** ${stats.funnel.step4WACount} (Tiempo total prom: ${stats.funnel.totalWizardAvgSec}s)`,
      ``,
      `## 5. Mapa de Atención por Sección y Claridad de Contenidos`,
      `| Sección | Vistas | Interacciones | Tiempo Promedio (s) | Fricción / Clics Muertos |`,
      `| :--- | :---: | :---: | :---: | :---: |`,
      ...stats.sectionTable.map(
        (s) => `| ${s.label} | ${s.views} | ${s.interactions} | ${s.avgDwellSec}s | ${s.friction} |`
      ),
      ``,
      `## 6. Posicionamiento SEO, Canales de Tráfico, Geografía y Dispositivos`,
      `### Canales de Adquisición:`,
      ...stats.channels.map((c) => `- **${c.label}:** ${c.count} eventos (${c.pct}%)`),
      `### Ubicación Geográfica de los Usuarios:`,
      ...stats.locations.map((l) => `- **${l.label}:** ${l.count} (${l.pct}%)`),
      `### Dispositivos y Sistemas Operativos:`,
      ...stats.devices.map((d) => `- **Dispositivo ${d.label}:** ${d.count} (${d.pct}%)`),
      ...stats.osList.map((o) => `- **SO ${o.label}:** ${o.count} (${o.pct}%)`),
      `### Páginas más visitadas / activas:`,
      ...stats.topPaths.map((p) => `- \`${p.label}\`: ${p.count} eventos (${p.pct}%)`),
      `### Core Web Vitals Promedio:`,
      `- **TTFB:** ${stats.webVitals.avgTtfbMs} ms | **FCP:** ${stats.webVitals.avgFcpMs} ms | **DOM Load:** ${stats.webVitals.avgDomMs} ms | **TTFI (1ra interacción):** ${stats.webVitals.avgTtfiMs} ms`,
      ``,
      `## 7. Indicadores de Fricción, Duda y Confianza`,
      `- **Clics Muertos (elementos no clicables donde el usuario buscó más detalle):** ${stats.deadClicksCount}`,
      ...stats.deadClicks.slice(0, 8).map((d) => `  - Sección \`${d.meta.section}\`: clic en \`<${d.meta.element_tag}>\` "${d.meta.element_text}"`),
      `- **Clics de Frustración (Rage Clicks):** ${stats.rageClicksCount}`,
      `- **Textos Copiados por los Usuarios:** ${stats.textCopiesCount}`,
      ...stats.textCopies.slice(0, 8).map((c) => `  - Sección \`${c.meta.section}\`: "${c.meta.copied_text}"`),
      ``,
      `## 8. Instrucción para la IA (Antigravity)`,
      `Con base en esta telemetría real de Salones San Pedro Plus, analiza y propón mejoras concretas en:`,
      `1. **Estrategia SEO y Posicionamiento Orgánico** (palabras clave, títulos, artículos de blog, velocidad móvil).`,
      `2. **Experiencia de Usuario (UX) y Conversión** (optimización del Precotizador, regla de 50 personas en viernes/sábado, reducción de fricción).`,
      `3. **Claridad del Mensaje, Organización de Contenidos y Confianza** (qué secciones reordenar, qué dudas aclarar en paquetes y cómo elevar la conversión a WhatsApp).`,
    ];

    return lines.join('\n');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAIPrompt = async () => {
    const md = buildAIDiagnosticMarkdown();
    await navigator.clipboard.writeText(md);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3500);
  };

  const handleDownloadMarkdown = () => {
    const md = buildAIDiagnosticMarkdown();
    downloadFile(md, `diagnostico-ia-salones-san-pedro-${period}.md`, 'text/markdown;charset=utf-8');
  };

  const handleDownloadTxt = () => {
    const txt = buildAIDiagnosticMarkdown();
    downloadFile(txt, `reporte-ux-seo-salones-san-pedro-${period}.txt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadJSON = () => {
    const payload = {
      generated_at: new Date().toISOString(),
      period,
      summary: {
        totalEvents: stats.totalEvents,
        uniqueSessions: stats.uniqueSessions,
        uniqueVisitors: stats.uniqueVisitors,
        whatsappCount: stats.whatsappCount,
        cotizarCount: stats.cotizarCount,
        conversionRateWA: stats.conversionRateWA,
        avgActiveTimeSec: stats.avgActiveTimeSec,
        avgScrollPct: stats.avgScrollPct,
      },
      schedule: {
        weekendEvents: stats.weekendEvents,
        weekdayEvents: stats.weekdayEvents,
        timeSlots: stats.timeSlots,
        dayStats: stats.dayStats,
        hoursCount: stats.hoursCount,
      },
      commercialDemand: {
        packageDemand: stats.packageDemand,
        guestsRangeDemand: stats.guestsRangeDemand,
        preferredDaysDemand: stats.preferredDaysDemand,
        preferredSeasonsDemand: stats.preferredSeasonsDemand,
        eventKindsDemand: stats.eventKindsDemand,
        lockedClicksCount: stats.lockedClicksCount,
      },
      funnel: stats.funnel,
      sections: stats.sectionTable,
      seoAndGeo: {
        channels: stats.channels,
        locations: stats.locations,
        devices: stats.devices,
        osList: stats.osList,
        browsers: stats.browsers,
        topPaths: stats.topPaths,
        webVitals: stats.webVitals,
      },
      leads,
      rawEvents: filteredEvents,
    };
    downloadFile(
      JSON.stringify(payload, null, 2),
      `telemetria-completa-salones-san-pedro-${period}.json`,
      'application/json;charset=utf-8'
    );
  };

  const handleDownloadExcelCSV = () => {
    const headers = [
      'Fecha_CDMX',
      'Hora_CDMX',
      'Dia_Semana',
      'Tipo_Dia',
      'Franja_Horaria',
      'Mes',
      'ID_Sesion',
      'Tipo_Evento',
      'Fuente_Origen',
      'Pagina_Ruta',
      'Seccion',
      'Tiempo_Activo_Seg',
      'Scroll_Max_Pct',
      'Canal_Trafico_SEO',
      'Dispositivo',
      'Sistema_Operativo',
      'Navegador',
      'Ciudad_Alcaldia',
      'Estado_Region',
      'Pais',
      'ISP_Red',
      'Invitados_Rango',
      'Paquete_Interes',
      'Giro_Evento',
      'Dia_Evento_Buscado',
      'Temporada_Buscada',
      'Paquete_Bloqueado_Intentado',
      'Elemento_Friccion',
      'Texto_Copiado',
    ];

    const escapeCSV = (val: unknown) => {
      const str = val === null || val === undefined ? '' : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredEvents.map((e) => [
      e.date_cdmx,
      e.time_cdmx,
      e.day_of_week,
      e.is_weekend ? 'Fin de Semana (Vie-Dom)' : 'Entre Semana (Lun-Jue)',
      e.time_slot,
      e.month_name,
      e.session_id,
      e.event_type,
      e.source,
      e.path,
      e.meta.section || '',
      e.meta.timers?.active_time_ms ? Math.round(e.meta.timers.active_time_ms / 1000) : 0,
      e.meta.max_scroll_pct || e.meta.scroll_pct || 0,
      e.meta.acquisition?.traffic_channel || '',
      e.meta.device?.device_type || '',
      e.meta.device?.os || '',
      e.meta.device?.browser || '',
      e.meta.geo?.city || 'CDMX',
      e.meta.geo?.region || 'Ciudad de México',
      e.meta.geo?.country || 'México',
      e.meta.geo?.isp || '',
      e.meta.guests_range || '',
      e.meta.package_name || '',
      e.meta.event_kind || '',
      e.meta.preferred_day || '',
      e.meta.preferred_season || '',
      e.meta.locked_package_attempted || '',
      e.meta.element_text || '',
      e.meta.copied_text || '',
    ]);

    // Incluir BOM UTF-8 (\uFEFF) para que Microsoft Excel abra acentos y eñes perfectamente
    const csvContent =
      '\uFEFF' +
      [headers.map(escapeCSV).join(','), ...rows.map((r) => r.map(escapeCSV).join(','))].join('\r\n');

    downloadFile(
      csvContent,
      `excel-monitor-ux-seo-salones-san-pedro-${period}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  const maxHourTotal = Math.max(1, ...stats.hoursCount.map((h) => h.total));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado Principal */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Monitor Activo 24/7 • Supabase Conectado
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Centro de Inteligencia UX, Horarios, Temporadas y SEO
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Salones San Pedro Plus — Telemetría de interacción, tiempos, ubicación geográfica, embudo de paquetes y exportación para IA.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs sm:text-sm font-semibold transition-colors border border-neutral-700"
            >
              ← Ver Sitio Público
            </Link>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-950/60 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm">
            <p className="font-bold">Aviso de conexión con Supabase:</p>
            <p className="mt-1 font-mono text-xs">{errorMessage}</p>
          </div>
        )}

        {/* Barra de Filtro de Periodo + Centro de Exportación Multiformato */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* Selector de Periodo */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                1. Filtrar por Periodo de Tiempo:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'today', label: 'Hoy' },
                  { id: '7d', label: 'Últimos 7 días' },
                  { id: '15d', label: '15 días' },
                  { id: '30d', label: '30 días' },
                  { id: '90d', label: '90 días' },
                  { id: 'all', label: `Todo el Historial (${events.length})` },
                  { id: 'custom', label: 'Rango Personalizado' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPeriod(p.id as PeriodPreset)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      period === p.id
                        ? 'bg-amber-500 text-neutral-950 shadow-md'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {period === 'custom' && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <label className="text-xs text-neutral-400 flex items-center gap-2">
                    Desde:
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </label>
                  <label className="text-xs text-neutral-400 flex items-center gap-2">
                    Hasta:
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Botones de Exportación */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                2. Exportar Información del Periodo para IA / Excel:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyAIPrompt}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-extrabold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg cursor-pointer"
                >
                  {copiedPrompt ? '✓ ¡Copiado para Antigravity!' : '📋 Copiar Diagnóstico IA'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 font-bold text-xs transition-all cursor-pointer"
                >
                  ⬇ Reporte IA (.md)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs transition-all cursor-pointer"
                >
                  ⬇ Texto (.txt)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadExcelCSV}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all cursor-pointer"
                >
                  📊 Excel / Hoja Cálculo (.csv)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="px-3.5 py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/40 font-bold text-xs transition-all cursor-pointer"
                >
                  {`{ } JSON Completo (.json)`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del Monitor */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
          {[
            { id: 'overview', label: '1. Resumen y KPIs' },
            { id: 'schedule', label: '2. Horarios, Días y Temporadas' },
            { id: 'sections', label: '3. Secciones, Tiempos y Contenido' },
            { id: 'funnel', label: '4. Embudo, 50 Personas y Paquetes' },
            { id: 'seo_geo', label: '5. SEO, Geografía y Dispositivos' },
            { id: 'sessions_leads', label: `6. Fricción, Bitácora y Leads (${leads.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-neutral-100 text-neutral-950 shadow'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: RESUMEN EJECUTIVO Y KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
                <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  Sesiones / Visitantes
                </p>
                <p className="text-4xl font-black text-white mt-2">{stats.uniqueSessions}</p>
                <p className="text-xs text-neutral-500 mt-2">
                  {stats.totalEvents} eventos registrados en el periodo
                </p>
              </div>

              <div className="bg-neutral-900/60 border border-emerald-500/30 p-5 rounded-2xl">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Conversiones a WhatsApp
                </p>
                <p className="text-4xl font-black text-emerald-400 mt-2">{stats.whatsappCount}</p>
                <p className="text-xs text-neutral-400 mt-2">
                  Precotizador: <strong>{stats.whatsappPrecotizador}</strong> | Botón flotante:{' '}
                  <strong>{stats.whatsappFloating}</strong>
                </p>
              </div>

              <div className="bg-neutral-900/60 border border-amber-500/30 p-5 rounded-2xl">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Intención en Paquetes (Cotizar)
                </p>
                <p className="text-4xl font-black text-amber-400 mt-2">{stats.cotizarCount}</p>
                <p className="text-xs text-neutral-400 mt-2">
                  Tasa de conversión a WhatsApp: <strong>{stats.conversionRateWA}%</strong>
                </p>
              </div>

              <div className="bg-neutral-900/60 border border-sky-500/30 p-5 rounded-2xl">
                <p className="text-sky-400 text-xs font-bold uppercase tracking-wider">
                  Tiempo Activo & Scroll
                </p>
                <p className="text-4xl font-black text-sky-400 mt-2">
                  {stats.avgActiveTimeSec}s{' '}
                  <span className="text-lg font-semibold text-neutral-400">
                    / {stats.avgScrollPct}%
                  </span>
                </p>
                <p className="text-xs text-neutral-400 mt-2">
                  Permanencia activa real y lectura de página
                </p>
              </div>
            </div>

            {/* Comparativa Fin de Semana vs Entre Semana + Top Paquetes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-white">
                  Comportamiento Fin de Semana (Vie–Dom) vs. Entre Semana (Lun–Jue)
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-300 font-bold uppercase">
                      Fin de Semana (Vie, Sáb, Dom)
                    </p>
                    <p className="text-3xl font-black text-white mt-1">{stats.weekendEvents}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      <strong>{stats.weekendConversions}</strong> clics de conversión
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30">
                    <p className="text-xs text-sky-300 font-bold uppercase">
                      Entre Semana (Lun a Jue)
                    </p>
                    <p className="text-3xl font-black text-white mt-1">{stats.weekdayEvents}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      <strong>{stats.weekdayConversions}</strong> clics de conversión
                    </p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Este indicador permite identificar si tus usuarios investigan opciones durante la semana laboral y concretan la cotización por WhatsApp durante el fin de semana en familia.
                </p>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-white">
                  Demanda e Interés por Paquete
                </h2>
                <div className="space-y-3">
                  {stats.packageDemand.length === 0 ? (
                    <p className="text-sm text-neutral-500">Sin eventos en este periodo.</p>
                  ) : (
                    stats.packageDemand.map((pkg) => (
                      <div key={pkg.label}>
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span className="text-neutral-200 font-medium">{pkg.label}</span>
                          <span className="text-amber-400 font-bold">
                            {pkg.count} ({pkg.pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-950 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${Math.max(5, pkg.pct)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HORARIOS, DÍAS Y TEMPORADAS */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            {/* Reloj de 24 horas CDMX */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Mapa de Calor por Hora del Día (00:00 a 23:00 hrs — Hora CDMX)
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Detecta las horas exactas de mayor tráfico y mayor intención de compra.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-12 lg:grid-cols-24 gap-2 items-end h-44 pt-6 border-b border-neutral-800 pb-3">
                {stats.hoursCount.map((h) => {
                  const heightPct = Math.round((h.total / maxHourTotal) * 100);
                  return (
                    <div key={h.hour} className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] text-amber-400 font-bold">
                        {h.total > 0 ? h.total : ''}
                      </span>
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          h.conversions > 0 ? 'bg-emerald-500' : 'bg-amber-500/60'
                        }`}
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                        title={`${h.label} hrs: ${h.total} eventos (${h.conversions} conversiones)`}
                      />
                      <span className="text-[10px] text-neutral-500 font-mono">{h.hour}h</span>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                {stats.timeSlots.map((slot) => (
                  <div
                    key={slot.label}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-neutral-300">{slot.label}</span>
                    <span className="text-sm font-black text-amber-400">
                      {slot.count} ({slot.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actividad por Día de la Semana vs Día de Evento Buscado y Temporada */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">
                  Día de la Semana en que Visitan la Web
                </h3>
                {stats.daysOrder.map((d) => {
                  const row = stats.dayStats[d];
                  return (
                    <div
                      key={d}
                      className="flex items-center justify-between py-2 border-b border-neutral-800/60 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-200">{d}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            row.isWeekend
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {row.isWeekend ? 'Fin de Semana' : 'Semana'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">{row.total} ev.</span>{' '}
                        <span className="text-emerald-400 text-xs">
                          ({row.conversions} conv.)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">
                  Día Preferido para Realizar su Evento
                </h3>
                <p className="text-xs text-neutral-400">
                  Diferenciador Sábado vs. Viernes vs. Domingo seleccionado en el Precotizador.
                </p>
                {stats.preferredDaysDemand.length === 0 ? (
                  <p className="text-xs text-neutral-500 pt-2">
                    Los nuevos usuarios que usen el Precotizador registrarán aquí si buscan Viernes, Sábado, Domingo o Entre Semana.
                  </p>
                ) : (
                  stats.preferredDaysDemand.map((d) => (
                    <div key={d.label} className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-neutral-200">{d.label}</span>
                        <span className="font-bold text-amber-400">
                          {d.count} ({d.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${Math.max(6, d.pct)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">
                  Temporada / Mes Tentativo Buscado
                </h3>
                <p className="text-xs text-neutral-400">
                  Estacionalidad de los eventos que están cotizando los clientes.
                </p>
                {stats.preferredSeasonsDemand.length === 0 ? (
                  <p className="text-xs text-neutral-500 pt-2">
                    Conforme los visitantes coticen, verás aquí qué temporada (Primavera/Graduaciones, Verano, Fin de Año o 2027) tiene mayor demanda.
                  </p>
                ) : (
                  stats.preferredSeasonsDemand.map((s) => (
                    <div key={s.label} className="space-y-1 pt-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-neutral-200">{s.label}</span>
                        <span className="font-bold text-emerald-400">
                          {s.count} ({s.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.max(6, s.pct)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATENCIÓN POR SECCIÓN Y CONTENIDOS */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 overflow-x-auto">
              <h2 className="text-lg font-bold text-white mb-2">
                Mapa de Atención, Cronómetros de Permanencia y Claridad por Sección
              </h2>
              <p className="text-xs text-neutral-400 mb-6">
                Mide cuánto tiempo real pasan leyendo cada bloque de la Home y del Blog, cuántos clics de interés hacen y dónde hay dudas (clics muertos).
              </p>
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-xs">
                    <th className="py-3 px-4">Sección de la Página</th>
                    <th className="py-3 px-4 text-center">Vistas</th>
                    <th className="py-3 px-4 text-center">Tiempo Activo Promedio</th>
                    <th className="py-3 px-4 text-center">Clics Interactivos</th>
                    <th className="py-3 px-4 text-center">Fricción / Clics Muertos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {stats.sectionTable.map((sec) => (
                    <tr key={sec.id} className="hover:bg-neutral-800/30">
                      <td className="py-3.5 px-4 font-semibold text-neutral-200">{sec.label}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-neutral-300">
                        {sec.views}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-sky-400 font-bold">
                        {sec.avgDwellSec}s
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-400 font-bold">
                        {sec.interactions}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            sec.friction > 0
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {sec.friction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: EMBUDO PRECOTIZADOR, REGLA 50 PERSONAS Y PAQUETES */}
        {activeTab === 'funnel' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  Paso 1: Aforo, Día y Temporada
                </span>
                <p className="text-3xl font-black text-white mt-2">{stats.funnel.step1Count}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Tiempo promedio de decisión: <strong>{stats.funnel.step1AvgSec}s</strong>
                </p>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  Paso 2: Nivel de Paquete
                </span>
                <p className="text-3xl font-black text-white mt-2">{stats.funnel.step2Count}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Tiempo promedio de decisión: <strong>{stats.funnel.step2AvgSec}s</strong>
                </p>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  Paso 3: Giro del Evento y Extras
                </span>
                <p className="text-3xl font-black text-white mt-2">{stats.funnel.step3Count}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Tiempo promedio de decisión: <strong>{stats.funnel.step3AvgSec}s</strong>
                </p>
              </div>
              <div className="bg-neutral-900/60 border border-emerald-500/40 p-5 rounded-2xl">
                <span className="text-xs font-bold text-emerald-400 uppercase">
                  Paso 4: Solicitud WhatsApp
                </span>
                <p className="text-3xl font-black text-emerald-400 mt-2">
                  {stats.funnel.step4WACount}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Tiempo total de llenado: <strong>{stats.funnel.totalWizardAvgSec}s</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">
                  Aforo Solicitado (50–99 vs 100+ Personas)
                </h3>
                {stats.guestsRangeDemand.length === 0 ? (
                  <p className="text-xs text-neutral-500">
                    Aquí se mostrará la proporción exacta de eventos de 50 a 99 personas frente a eventos de 100+ personas.
                  </p>
                ) : (
                  stats.guestsRangeDemand.map((g) => (
                    <div key={g.label} className="flex justify-between text-xs py-1.5 border-b border-neutral-800">
                      <span className="text-neutral-200 font-medium">{g.label}</span>
                      <span className="text-amber-400 font-bold">
                        {g.count} ({g.pct}%)
                      </span>
                    </div>
                  ))
                )}
                <div className="pt-3 mt-3 border-t border-neutral-800">
                  <p className="text-xs text-amber-300 font-semibold">
                    Clics en paquetes bloqueados (&lt;100 personas):{' '}
                    <span className="text-white font-black">{stats.lockedClicksCount}</span>
                  </p>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">Giro del Evento Cotizado</h3>
                {stats.eventKindsDemand.length === 0 ? (
                  <p className="text-xs text-neutral-500">
                    Mide proporción de XV Años, Bodas, Graduaciones y Empresariales.
                  </p>
                ) : (
                  stats.eventKindsDemand.map((k) => (
                    <div key={k.label} className="flex justify-between text-xs py-1.5 border-b border-neutral-800">
                      <span className="text-neutral-200 font-medium">{k.label}</span>
                      <span className="text-emerald-400 font-bold">
                        {k.count} ({k.pct}%)
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">Paquetes Más Solicitados</h3>
                {stats.packageDemand.map((p) => (
                  <div key={p.label} className="flex justify-between text-xs py-1.5 border-b border-neutral-800">
                    <span className="text-neutral-200 font-medium">{p.label}</span>
                    <span className="text-amber-400 font-bold">
                      {p.count} ({p.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SEO, GEOGRAFÍA Y DISPOSITIVOS */}
        {activeTab === 'seo_geo' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Canales de Adquisición y SEO */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">
                  Canales de Tráfico y Posicionamiento
                </h3>
                <p className="text-xs text-neutral-400">
                  Incluye detección retroactiva de Facebook Ads (`FB_IAB`) y Google Search App (`GSA`).
                </p>
                {stats.channels.map((c) => (
                  <div key={c.label} className="flex justify-between text-xs py-2 border-b border-neutral-800">
                    <span className="text-neutral-200 font-medium">{c.label}</span>
                    <span className="text-amber-400 font-bold">
                      {c.count} ({c.pct}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* Ubicación Geográfica */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white">
                  Ubicación Geográfica de Visitantes
                </h3>
                <p className="text-xs text-neutral-400">
                  Ciudad, Alcaldía / Estado e ISP detectados por IP anónima.
                </p>
                {stats.locations.map((loc) => (
                  <div key={loc.label} className="flex justify-between text-xs py-2 border-b border-neutral-800">
                    <span className="text-neutral-200 font-medium">{loc.label}</span>
                    <span className="text-emerald-400 font-bold">
                      {loc.count} ({loc.pct}%)
                    </span>
                  </div>
                ))}
                {stats.isps.length > 0 && (
                  <div className="pt-3">
                    <p className="text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Proveedores de Red (ISP):
                    </p>
                    {stats.isps.slice(0, 5).map((isp) => (
                      <div key={isp.label} className="flex justify-between text-xs text-neutral-400">
                        <span>{isp.label}</span>
                        <span>{isp.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dispositivos, Sistemas Operativos y Navegadores */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">
                  Dispositivos, SO y Velocidad Web Vitals
                </h3>
                <div className="space-y-1.5">
                  {stats.osList.map((o) => (
                    <div key={o.label} className="flex justify-between text-xs">
                      <span className="text-neutral-300">{o.label}</span>
                      <span className="text-sky-400 font-bold">
                        {o.count} ({o.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-neutral-800 space-y-1.5">
                  <p className="text-xs font-bold text-neutral-400 uppercase">Navegadores:</p>
                  {stats.browsers.map((b) => (
                    <div key={b.label} className="flex justify-between text-xs">
                      <span className="text-neutral-300">{b.label}</span>
                      <span className="text-amber-300 font-bold">
                        {b.count} ({b.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-500 block">FCP Promedio</span>
                    <span className="font-mono font-bold text-white">
                      {stats.webVitals.avgFcpMs || '—'} ms
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                    <span className="text-neutral-500 block">TTFB Servidor</span>
                    <span className="font-mono font-bold text-white">
                      {stats.webVitals.avgTtfbMs || '—'} ms
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rutas y Artículos del Blog */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">
                Rendimiento de Páginas y Artículos del Blog (SEO)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats.topPaths.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs"
                  >
                    <span className="font-mono text-neutral-200 truncate pr-3">{p.label}</span>
                    <span className="font-bold text-amber-400 shrink-0">
                      {p.count} eventos ({p.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FRICCIÓN, BITÁCORA EN VIVO Y LEADS */}
        {activeTab === 'sessions_leads' && (
          <div className="space-y-8">
            {/* Prospectos históricos de la tabla leads en Supabase */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 overflow-x-auto">
              <h2 className="text-lg font-bold text-white mb-2">
                Prospectos Registrados en Tabla `leads` de Supabase ({leads.length})
              </h2>
              <p className="text-xs text-neutral-400 mb-4">
                Cotejo directo con los prospectos almacenados en la base de datos del proyecto.
              </p>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase">
                    <th className="py-2.5 px-3">Fecha Registro</th>
                    <th className="py-2.5 px-3">Giro Evento</th>
                    <th className="py-2.5 px-3">Invitados</th>
                    <th className="py-2.5 px-3">Fecha Evento</th>
                    <th className="py-2.5 px-3">Teléfono / Email</th>
                    <th className="py-2.5 px-3">Ubicación / Detalles</th>
                    <th className="py-2.5 px-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-neutral-800/30">
                      <td className="py-2.5 px-3 text-neutral-400 whitespace-nowrap">
                        {new Date(l.created_at).toLocaleDateString('es-MX')}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-amber-400">{l.event_type || '—'}</td>
                      <td className="py-2.5 px-3 text-white font-mono">{l.guests_count || '—'}</td>
                      <td className="py-2.5 px-3 text-neutral-300">{l.event_date || '—'}</td>
                      <td className="py-2.5 px-3 text-neutral-300">
                        {l.phone_number} {l.email ? `• ${l.email}` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-400 max-w-xs truncate">
                        {l.location || '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold">
                          {l.status || 'Nuevo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bitácora detallada de eventos de telemetría */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 overflow-x-auto">
              <h2 className="text-lg font-bold text-white mb-4">
                Bitácora Cronológica de Interacciones (Últimos 100 eventos del periodo)
              </h2>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase">
                    <th className="py-3 px-3">Fecha / Hora CDMX</th>
                    <th className="py-3 px-3">Día / Franja</th>
                    <th className="py-3 px-3">Evento</th>
                    <th className="py-3 px-3">Fuente / Sección</th>
                    <th className="py-3 px-3">Canal / Ubicación</th>
                    <th className="py-3 px-3">Dispositivo</th>
                    <th className="py-3 px-3">Detalles (Invitados, Temporada, Tiempo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredEvents.slice(0, 100).map((ev) => (
                    <tr key={ev.id} className="hover:bg-neutral-800/30">
                      <td className="py-3 px-3 text-neutral-300 font-mono whitespace-nowrap">
                        {ev.date_cdmx} {ev.time_cdmx}
                      </td>
                      <td className="py-3 px-3 text-neutral-400 whitespace-nowrap">
                        <span className="font-semibold text-white">{ev.day_of_week}</span> •{' '}
                        {ev.time_slot}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            ev.event_type === 'whatsapp_click'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : ev.event_type === 'cotizar_click'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {ev.event_type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-300 font-mono">
                        {ev.source}{' '}
                        {ev.meta.section ? (
                          <span className="text-neutral-500">({ev.meta.section})</span>
                        ) : null}
                      </td>
                      <td className="py-3 px-3 text-neutral-300">
                        <div>{ev.meta.acquisition?.traffic_channel || 'Directo'}</div>
                        <div className="text-[11px] text-neutral-500">
                          {ev.meta.geo?.city || 'CDMX'}, {ev.meta.geo?.region || 'MX'}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {ev.meta.device?.os} • {ev.meta.device?.browser}
                      </td>
                      <td className="py-3 px-3 text-neutral-300 max-w-xs">
                        {[
                          ev.meta.guests_range && `Aforo: ${ev.meta.guests_range}`,
                          ev.meta.package_name && `Paq: ${ev.meta.package_name}`,
                          ev.meta.preferred_day && `Día: ${ev.meta.preferred_day}`,
                          ev.meta.preferred_season && `Temp: ${ev.meta.preferred_season}`,
                          ev.meta.event_kind && `Giro: ${ev.meta.event_kind}`,
                          ev.meta.element_text && `Elem: "${ev.meta.element_text}"`,
                          ev.meta.copied_text && `Copió: "${ev.meta.copied_text}"`,
                          ev.meta.timers?.active_time_ms &&
                            `Activo: ${Math.round(ev.meta.timers.active_time_ms / 1000)}s`,
                        ]
                          .filter(Boolean)
                          .join(' | ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

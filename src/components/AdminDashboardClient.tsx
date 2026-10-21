'use client';

import React, { useMemo, useState } from 'react';
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
type SectionFilter =
  | 'all'
  | 'sec1_kpis'
  | 'sec2_timers'
  | 'sec3_schedule'
  | 'sec4_seasons'
  | 'sec5_funnel'
  | 'sec6_sections'
  | 'sec7_seo'
  | 'sec8_geo'
  | 'sec9_friction'
  | 'sec10_logs';

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
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>('all');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Filtrar eventos según el periodo seleccionado
  const filteredEvents = useMemo(() => {
    if (period === 'all') return events;
    const now = new Date();

    if (period === 'custom') {
      return events.filter((ev) => ev.date_cdmx >= customFrom && ev.date_cdmx <= customTo);
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

  // Cálculo integral de todos los monitores
  const stats = useMemo(() => {
    const totalEvents = filteredEvents.length;
    const uniqueSessions = new Set(filteredEvents.map((e) => e.session_id)).size;
    const uniqueVisitors = new Set(filteredEvents.map((e) => e.visitor_id)).size;
    const returningSessions = new Set(
      filteredEvents.filter((e) => e.meta.is_returning).map((e) => e.session_id)
    ).size;

    const whatsappEvents = filteredEvents.filter((e) => e.event_type === 'whatsapp_click');
    const cotizarEvents = filteredEvents.filter((e) => e.event_type === 'cotizar_click');
    const pageViews = filteredEvents.filter((e) => e.event_type === 'page_view');
    const precotizadorSteps = filteredEvents.filter((e) => e.event_type === 'precotizador_step');
    const precotizadorBacktracks = filteredEvents.filter(
      (e) => e.event_type === 'precotizador_backtrack'
    );
    const precotizadorAbandons = filteredEvents.filter(
      (e) => e.event_type === 'precotizador_abandon'
    );
    const lockedClicks = filteredEvents.filter((e) => e.event_type === 'locked_package_click');
    const deadClicks = filteredEvents.filter((e) => e.event_type === 'dead_click');
    const rageClicks = filteredEvents.filter((e) => e.event_type === 'rage_click');
    const textCopies = filteredEvents.filter((e) => e.event_type === 'text_copy');
    const exitIntents = filteredEvents.filter((e) => e.event_type === 'exit_intent');
    const returnToPrices = filteredEvents.filter((e) => e.event_type === 'scroll_return_prices');
    const galleryEvents = filteredEvents.filter((e) => e.event_type === 'gallery_interaction');
    const menuSwipes = filteredEvents.filter((e) => e.event_type === 'menu_card_swipe');
    const expEvents = filteredEvents.filter(
      (e) => e.event_type === 'experience_interaction' || e.event_type === 'tiktok_interaction'
    );
    const testimonialEvents = filteredEvents.filter((e) => e.event_type === 'testimonial_pause');
    const footerClicks = filteredEvents.filter((e) => e.event_type === 'footer_click');
    const headerNavs = filteredEvents.filter((e) => e.event_type === 'header_nav');
    const extraServiceEvents = filteredEvents.filter(
      (e) => e.event_type === 'extra_service_interest'
    );

    // Tiempos por sesión
    const sessionMaxActiveMs: Record<string, number> = {};
    const sessionMaxHiddenMs: Record<string, number> = {};
    const sessionMaxScroll: Record<string, number> = {};
    const sessionTabSwitches: Record<string, number> = {};
    const sessionConvertedWA = new Set<string>();
    const readingModes: string[] = [];

    filteredEvents.forEach((e) => {
      const sid = e.session_id;
      const act = e.meta.timers?.active_time_ms || 0;
      if (act > (sessionMaxActiveMs[sid] || 0)) sessionMaxActiveMs[sid] = act;

      const hid = e.meta.timers?.hidden_time_ms || 0;
      if (hid > (sessionMaxHiddenMs[sid] || 0)) sessionMaxHiddenMs[sid] = hid;

      const scr = e.meta.max_scroll_pct || e.meta.scroll_pct || 0;
      if (scr > (sessionMaxScroll[sid] || 0)) sessionMaxScroll[sid] = scr;

      const tabs = e.meta.tab_switches || 0;
      if (tabs > (sessionTabSwitches[sid] || 0)) sessionTabSwitches[sid] = tabs;

      if (e.event_type === 'whatsapp_click') {
        sessionConvertedWA.add(sid);
      }

      const rMode = (e.meta.extra?.reading_mode as string) || '';
      if (rMode) readingModes.push(rMode);
    });

    const activeTimes = Object.values(sessionMaxActiveMs).filter((ms) => ms > 0);
    const avgActiveTimeSec =
      activeTimes.length > 0
        ? Math.round(activeTimes.reduce((a, b) => a + b, 0) / activeTimes.length / 1000)
        : 0;

    const hiddenTimes = Object.values(sessionMaxHiddenMs).filter((ms) => ms > 0);
    const avgHiddenTimeSec =
      hiddenTimes.length > 0
        ? Math.round(hiddenTimes.reduce((a, b) => a + b, 0) / hiddenTimes.length / 1000)
        : 0;

    const scrollVals = Object.values(sessionMaxScroll).filter((s) => s > 0);
    const avgScrollPct =
      scrollVals.length > 0
        ? Math.round(scrollVals.reduce((a, b) => a + b, 0) / scrollVals.length)
        : 0;

    const totalTabSwitches = Object.values(sessionTabSwitches).reduce((a, b) => a + b, 0);

    const conversionRateWA =
      uniqueSessions > 0 ? Number(((sessionConvertedWA.size / uniqueSessions) * 100).toFixed(1)) : 0;

    // Tiempos de primera interacción y primer CTA
    const ttfiVals = filteredEvents.map((e) => e.meta.timers?.ttfi_ms || 0).filter((v) => v > 0);
    const ctaTimeVals = filteredEvents
      .map((e) => e.meta.timers?.time_to_cta_ms || 0)
      .filter((v) => v > 0);

    const avgMs = (arr: number[]) =>
      arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    const avgTtfiMs = avgMs(ttfiVals);
    const avgTimeToCtaSec = Math.round(avgMs(ctaTimeVals) / 1000);

    // Horarios (00 a 23h CDMX)
    const hoursCount = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: `${String(h).padStart(2, '0')}:00`,
      total: 0,
      conversions: 0,
    }));

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

    // Demanda Comercial, Temporadas, Días y Regla 50 personas
    const preferredDaysDemand = countBy(
      filteredEvents.map((e) => e.meta.preferred_day || '').filter(Boolean)
    );
    const preferredSeasonsDemand = countBy(
      filteredEvents.map((e) => e.meta.preferred_season || '').filter(Boolean)
    );
    const guestsRangeDemand = countBy(
      filteredEvents.map((e) => e.meta.guests_range || '').filter(Boolean)
    );
    const exactGuestsList: string[] = [];
    filteredEvents.forEach((e) => {
      const eg = e.meta.extra?.exact_guests;
      if (typeof eg === 'number') exactGuestsList.push(`${eg} personas`);
    });
    const exactGuestsDemand = countBy(exactGuestsList);

    const eventKindsDemand = countBy([
      ...filteredEvents.map((e) => e.meta.event_kind || '').filter(Boolean),
      ...leads.map((l) => l.event_type || '').filter(Boolean),
    ]);

    // Extras más solicitados
    const extrasList: string[] = [];
    extraServiceEvents.forEach((e) => {
      if (e.meta.element_text) extrasList.push(e.meta.element_text);
    });
    filteredEvents.forEach((e) => {
      const arr = e.meta.extra?.extras;
      if (Array.isArray(arr)) {
        arr.forEach((item) => extrasList.push(String(item)));
      }
    });
    const extrasDemand = countBy(extrasList);

    // Paquetes
    const packageSignals: string[] = [];
    filteredEvents.forEach((e) => {
      if (e.meta.package_name) {
        packageSignals.push(`Paquete ${e.meta.package_name}`);
      } else if (e.source === 'paquete_plus') {
        packageSignals.push('Paquete Plus ($710 p/p)');
      } else if (e.source === 'paquete_premier') {
        packageSignals.push('Paquete Premier ($530 p/p)');
      } else if (e.source === 'paquete_all_inclusive') {
        packageSignals.push('Paquete All Inclusive ($1,010 p/p)');
      } else if (e.source === 'paquete_CTA') {
        packageSignals.push('Paquete Premier / All Inclusive (CTA Home)');
      }
    });
    const packageDemand = countBy(packageSignals);

    // Secciones
    const sectionOrder = [
      { id: 'inicio', label: 'Hero Principal & Propuesta (#inicio)' },
      { id: 'precotizador', label: 'Precotizador Interactivo (Wizard 4 Pasos)' },
      { id: 'paquetes', label: 'Comparativa de Paquetes y Precios (#paquetes)' },
      { id: 'galeria', label: 'Galería Salón Diamante y Platino (#galeria)' },
      { id: 'tiktok-videos', label: 'Reproductor de Videos TikTok (#tiktok-videos)' },
      { id: 'banquetes', label: 'Experiencia Gastronómica / Menú 3 Tiempos (#banquetes)' },
      { id: 'animacion', label: 'Experiencias Multi-sensoriales (#animacion)' },
      { id: 'testimonios', label: 'Carrusel de Testimonios Google (#testimonios)' },
      { id: 'ubicacion', label: 'Footer, Mapa y Contacto Directo (#ubicacion)' },
      { id: 'blog', label: 'Artículos del Blog SEO (/blog)' },
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
      } else if (
        e.event_type === 'dead_click' ||
        e.event_type === 'rage_click' ||
        e.event_type === 'locked_package_click'
      ) {
        sectionMetrics[sec].friction += 1;
      } else if (
        e.event_type !== 'scroll_depth' &&
        e.event_type !== 'web_vitals' &&
        e.event_type !== 'session_exit' &&
        e.event_type !== 'tab_visibility'
      ) {
        sectionMetrics[sec].interactions += 1;
      }

      const dwellMap = e.meta.extra?.section_dwell_map_ms as Record<string, number> | undefined;
      if (dwellMap && typeof dwellMap === 'object') {
        Object.entries(dwellMap).forEach(([k, ms]) => {
          const normKey = k.startsWith('blog') ? 'blog' : k;
          if (!sectionMetrics[normKey]) {
            sectionMetrics[normKey] = {
              views: 0,
              interactions: 0,
              dwellMsTotal: 0,
              dwellCount: 0,
              friction: 0,
            };
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
    const upsell100Events = precotizadorSteps.filter((e) => e.source === 'upsell_a_100_invitados');

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
      backtracksCount: precotizadorBacktracks.length,
      abandonsCount: precotizadorAbandons.length,
      upsell100Count: upsell100Events.length,
    };

    // SEO, Canales, Dispositivos, SO, Geografía
    const channels = countBy(
      filteredEvents.map((e) => e.meta.acquisition?.traffic_channel || 'Directo')
    );
    const devices = countBy(filteredEvents.map((e) => e.meta.device?.device_type || 'Desktop'));
    const osList = countBy(filteredEvents.map((e) => e.meta.device?.os || 'Otro'));
    const browsers = countBy(filteredEvents.map((e) => e.meta.device?.browser || 'Otro'));
    const locations = countBy(
      filteredEvents.map((e) => {
        if (e.meta.geo?.city || e.meta.geo?.region) {
          return `${e.meta.geo.city || 'CDMX'}, ${e.meta.geo.region || 'México'}`;
        }
        return 'Ciudad de México / Zona Metropolitana';
      })
    );
    const isps = countBy(filteredEvents.map((e) => e.meta.geo?.isp || '').filter(Boolean));
    const topPaths = countBy(filteredEvents.map((e) => e.path || '/'));
    const readingModeBreakdown = countBy(readingModes);

    // Micro-interacciones de contenido
    const galleryBreakdown = countBy(
      galleryEvents.map((e) => e.meta.gallery_category || e.source)
    );
    const menuBreakdown = countBy(menuSwipes.map((e) => e.meta.dish_title || e.source));
    const expBreakdown = countBy(expEvents.map((e) => e.meta.experience_title || e.source));
    const footerBreakdown = countBy(footerClicks.map((e) => e.source));

    // Web Vitals y Auditoría SEO On-Page
    const fcpVals = filteredEvents.map((e) => e.meta.timers?.fcp_ms || 0).filter((v) => v > 0);
    const ttfbVals = filteredEvents.map((e) => e.meta.timers?.ttfb_ms || 0).filter((v) => v > 0);
    const domVals = filteredEvents.map((e) => e.meta.timers?.dom_load_ms || 0).filter((v) => v > 0);

    interface SeoAuditInfo {
      title_len?: number;
      meta_desc_len?: number;
      h1_count?: number;
      h1_text?: string;
      h2_count?: number;
      img_total?: number;
      img_missing_alt?: number;
    }

    let latestSeoAudit = null as SeoAuditInfo | null;

    for (const ev of filteredEvents) {
      const audit = ev.meta.extra?.seo_audit as SeoAuditInfo | undefined;
      if (audit && typeof audit === 'object') {
        latestSeoAudit = audit;
        break;
      }
    }

    return {
      totalEvents,
      uniqueSessions,
      uniqueVisitors,
      returningSessions,
      whatsappCount: whatsappEvents.length,
      whatsappPrecotizador: whatsappEvents.filter((e) => e.source === 'precotizador').length,
      whatsappFloating: whatsappEvents.filter((e) => e.source === 'floating_button').length,
      cotizarCount: cotizarEvents.length,
      pageViewsCount: pageViews.length,
      lockedClicksCount: lockedClicks.length,
      deadClicksCount: deadClicks.length,
      rageClicksCount: rageClicks.length,
      textCopiesCount: textCopies.length,
      exitIntentsCount: exitIntents.length,
      returnToPricesCount: returnToPrices.length,
      headerNavsCount: headerNavs.length,
      testimonialCount: testimonialEvents.length,
      avgActiveTimeSec,
      avgHiddenTimeSec,
      avgScrollPct,
      totalTabSwitches,
      avgTtfiMs,
      avgTimeToCtaSec,
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
      exactGuestsDemand,
      eventKindsDemand,
      extrasDemand,
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
      readingModeBreakdown,
      galleryBreakdown,
      menuBreakdown,
      expBreakdown,
      footerBreakdown,
      webVitals: {
        avgFcpMs: avgMs(fcpVals),
        avgTtfbMs: avgMs(ttfbVals),
        avgDomMs: avgMs(domVals),
        avgTtfiMs,
      },
      latestSeoAudit,
      deadClicks,
      rageClicks,
      textCopies,
      lockedClicks,
    };
  }, [filteredEvents, leads]);

  // Generador de Diagnóstico Markdown / Texto para IA
  const buildAIDiagnosticMarkdown = () => {
    const nowStr = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    const lines: string[] = [
      `# REPORTE MAESTRO DE INTELIGENCIA UX, HORARIOS, TEMPORADAS, GEOGRAFÍA Y SEO — SALONES SAN PEDRO PLUS`,
      `- **Fecha de corte (CDMX):** ${nowStr}`,
      `- **Periodo seleccionado:** ${period.toUpperCase()} (${stats.totalEvents} eventos en ${stats.uniqueSessions} sesiones)`,
      ``,
      `## SECCIÓN 01: KPIs Principales de Conversión`,
      `- **Sesiones Únicas:** ${stats.uniqueSessions} (${stats.uniqueVisitors} visitantes únicos | ${stats.returningSessions} recurrentes)`,
      `- **Eventos Totales:** ${stats.totalEvents}`,
      `- **Clics a WhatsApp (Conversión Final):** ${stats.whatsappCount} (Precotizador: ${stats.whatsappPrecotizador} | Botón Flotante: ${stats.whatsappFloating})`,
      `- **Clics de Intención en Paquetes / Cotizar:** ${stats.cotizarCount}`,
      `- **Tasa de Conversión a WhatsApp:** ${stats.conversionRateWA}%`,
      `- **Prospectos en Tabla Leads (CRM):** ${leads.length}`,
      ``,
      `## SECCIÓN 02: Contadores de Tiempo y Comportamiento de Lectura`,
      `- **Tiempo Activo Promedio en Página:** ${stats.avgActiveTimeSec}s`,
      `- **Tiempo Promedio en Pestaña Oculta (Comparación):** ${stats.avgHiddenTimeSec}s`,
      `- **Tiempo hasta Primera Interacción (TTFI):** ${stats.avgTtfiMs} ms`,
      `- **Tiempo Promedio hasta Clic en Cotizar/WhatsApp:** ${stats.avgTimeToCtaSec}s`,
      `- **Profundidad de Scroll Promedio:** ${stats.avgScrollPct}%`,
      `- **Re-lectura de Precios (Usuarios que regresan arriba a Paquetes):** ${stats.returnToPricesCount}`,
      `- **Intención de Salida (Exit Intent):** ${stats.exitIntentsCount}`,
      `- **Cambios de Pestaña (Tab Switches):** ${stats.totalTabSwitches}`,
      ``,
      `## SECCIÓN 03: Horarios y Días de Visita (Hora CDMX)`,
      `- **Fin de Semana (Vie-Sáb-Dom):** ${stats.weekendEvents} eventos (${stats.weekendConversions} conversiones)`,
      `- **Entre Semana (Lun-Jue):** ${stats.weekdayEvents} eventos (${stats.weekdayConversions} conversiones)`,
      `### Franjas Horarias:`,
      ...stats.timeSlots.map((t) => `- **${t.label}:** ${t.count} (${t.pct}%)`),
      `### Días de la Semana de Visita:`,
      ...stats.daysOrder.map(
        (d) =>
          `- **${d}:** ${stats.dayStats[d].total} eventos (${stats.dayStats[d].conversions} conversiones)`
      ),
      ``,
      `## SECCIÓN 04: Temporadas, Días Buscados (Viernes/Sábado/Domingo) y Regla 50 Personas`,
      `### Día de la Semana Buscado para el Evento:`,
      ...(stats.preferredDaysDemand.length > 0
        ? stats.preferredDaysDemand.map((d) => `- **${d.label}:** ${d.count} (${d.pct}%)`)
        : [`- En recolección`]),
      `### Temporada / Mes Tentativo Buscado:`,
      ...(stats.preferredSeasonsDemand.length > 0
        ? stats.preferredSeasonsDemand.map((s) => `- **${s.label}:** ${s.count} (${s.pct}%)`)
        : [`- En recolección`]),
      `### Rango de Invitados (50-99 vs 100+):`,
      ...(stats.guestsRangeDemand.length > 0
        ? stats.guestsRangeDemand.map((g) => `- **${g.label}:** ${g.count} (${g.pct}%)`)
        : [`- En recolección`]),
      `- **Clics en Paquetes Bloqueados (<100 personas intentando elegir Plus/All Inclusive):** ${stats.lockedClicksCount}`,
      `- **Conversiones de Upsell a 100 personas:** ${stats.funnel.upsell100Count}`,
      `### Giro de Evento:`,
      ...stats.eventKindsDemand.map((k) => `- **${k.label}:** ${k.count} (${k.pct}%)`),
      `### Servicios Extra Más Solicitados:`,
      ...(stats.extrasDemand.length > 0
        ? stats.extrasDemand.map((x) => `- **${x.label}:** ${x.count} (${x.pct}%)`)
        : [`- En recolección`]),
      ``,
      `## SECCIÓN 05: Embudo del Precotizador y Paquetes`,
      `- **Paso 1 (Aforo, Día y Temporada):** ${stats.funnel.step1Count} (${stats.funnel.step1AvgSec}s prom)`,
      `- **Paso 2 (Paquete):** ${stats.funnel.step2Count} (${stats.funnel.step2AvgSec}s prom)`,
      `- **Paso 3 (Giro y Extras):** ${stats.funnel.step3Count} (${stats.funnel.step3AvgSec}s prom)`,
      `- **Paso 4 (Clic a WhatsApp):** ${stats.funnel.step4WACount} (${stats.funnel.totalWizardAvgSec}s total)`,
      `- **Retrocesos en el Precotizador:** ${stats.funnel.backtracksCount} | **Abandonos de Modal:** ${stats.funnel.abandonsCount}`,
      `### Demanda por Paquete:`,
      ...stats.packageDemand.map((p) => `- **${p.label}:** ${p.count} (${p.pct}%)`),
      ``,
      `## SECCIÓN 06: Atención y Permanencia por Sección`,
      `| Sección | Vistas | Interacciones | Tiempo Promedio (s) | Fricción |`,
      `| :--- | :---: | :---: | :---: | :---: |`,
      ...stats.sectionTable.map(
        (s) => `| ${s.label} | ${s.views} | ${s.interactions} | ${s.avgDwellSec}s | ${s.friction} |`
      ),
      ``,
      `## SECCIÓN 07 & 08: Posicionamiento SEO, Geografía y Dispositivos`,
      `### Canales de Adquisición:`,
      ...stats.channels.map((c) => `- **${c.label}:** ${c.count} (${c.pct}%)`),
      `### Ubicación Geográfica:`,
      ...stats.locations.map((l) => `- **${l.label}:** ${l.count} (${l.pct}%)`),
      `### Sistemas Operativos y Navegadores:`,
      ...stats.osList.map((o) => `- **SO ${o.label}:** ${o.count} (${o.pct}%)`),
      ...stats.browsers.map((b) => `- **Navegador ${b.label}:** ${b.count} (${b.pct}%)`),
      `### Core Web Vitals:`,
      `- **TTFB:** ${stats.webVitals.avgTtfbMs} ms | **FCP:** ${stats.webVitals.avgFcpMs} ms | **DOM Load:** ${stats.webVitals.avgDomMs} ms`,
      ``,
      `## SECCIÓN 09: Fricción, Clics Muertos y Textos Copiados`,
      `- **Dead Clicks:** ${stats.deadClicksCount} | **Rage Clicks:** ${stats.rageClicksCount} | **Textos Copiados:** ${stats.textCopiesCount}`,
      ...stats.deadClicks.slice(0, 8).map((d) => `  - Dead Click en \`${d.meta.section}\`: "${d.meta.element_text}"`),
      ...stats.textCopies.slice(0, 8).map((c) => `  - Copió en \`${c.meta.section}\`: "${c.meta.copied_text}"`),
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
    downloadFile(
      buildAIDiagnosticMarkdown(),
      `diagnostico-ia-salones-san-pedro-${period}.md`,
      'text/markdown;charset=utf-8'
    );
  };

  const handleDownloadTxt = () => {
    downloadFile(
      buildAIDiagnosticMarkdown(),
      `reporte-ux-seo-salones-san-pedro-${period}.txt`,
      'text/plain;charset=utf-8'
    );
  };

  const handleDownloadJSON = () => {
    const payload = {
      generated_at: new Date().toISOString(),
      period,
      stats,
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
      'Tiempo_Oculto_Seg',
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
      e.meta.timers?.hidden_time_ms ? Math.round(e.meta.timers.hidden_time_ms / 1000) : 0,
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

    const csvContent =
      '\uFEFF' +
      [headers.map(escapeCSV).join(','), ...rows.map((r) => r.map(escapeCSV).join(','))].join(
        '\r\n'
      );

    downloadFile(
      csvContent,
      `excel-monitor-ux-seo-salones-san-pedro-${period}.csv`,
      'text/csv;charset=utf-8'
    );
  };

  const maxHourTotal = Math.max(1, ...stats.hoursCount.map((h) => h.total));
  const showSec = (sec: SectionFilter) => sectionFilter === 'all' || sectionFilter === sec;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-8 px-4 sm:px-6 lg:px-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ENCABEZADO EN TARJETA BLANCA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sistema de Monitoreo UX &amp; SEO en Tiempo Real • Supabase Activo
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Monitor Maestro de Experiencia de Usuario, Horarios, Temporadas y Posicionamiento SEO
              </h1>
              <p className="text-slate-600 text-sm mt-1.5 max-w-3xl leading-relaxed">
                Cada sección presenta de forma independiente y estructurada los indicadores recolectados en la web para analizar el comportamiento del cliente, exportar reportes y optimizar nuestra estrategia SEO y comercial.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-right">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">
                  Registros en Periodo
                </span>
                <span className="text-xl font-black text-slate-900">
                  {stats.totalEvents} eventos
                </span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm">
              <p className="font-bold">Aviso de conexión con Supabase:</p>
              <p className="mt-1 font-mono text-xs">{errorMessage}</p>
            </div>
          )}

          {/* BARRA DE PERIODO Y BOTONES DE EXPORTACIÓN */}
          <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* 1. Filtro de Periodo */}
            <div className="xl:col-span-6 space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                1. Seleccionar Periodo de Análisis:
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'today', label: 'Hoy' },
                  { id: '7d', label: '7 días' },
                  { id: '15d', label: '15 días' },
                  { id: '30d', label: '30 días' },
                  { id: '90d', label: '90 días' },
                  { id: 'all', label: `Todo el Historial (${events.length})` },
                  { id: 'custom', label: 'Por Fechas' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPeriod(p.id as PeriodPreset)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      period === p.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {period === 'custom' && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    Desde:
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                    Hasta:
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* 2. Exportación Multiformato */}
            <div className="xl:col-span-6 space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-amber-700 block">
                2. Exportar Datos del Periodo (Para Antigravity IA / Excel / JSON):
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAIPrompt}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                >
                  {copiedPrompt ? '✓ ¡Copiado al Portapapeles!' : '📋 Copiar Diagnóstico IA'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  ⬇ Markdown (.md)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  ⬇ Texto (.txt)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadExcelCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-all cursor-pointer"
                >
                  📊 Excel / CSV (.csv)
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-bold text-xs transition-all cursor-pointer"
                >
                  {`{ } JSON (.json)`}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Filtro Rápido de Secciones (Por defecto muestra TODAS las 10 secciones) */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-2">Vista de Secciones:</span>
              {[
                { id: 'all', label: 'Ver Todas las 10 Secciones (Completo)' },
                { id: 'sec1_kpis', label: '01. KPIs' },
                { id: 'sec2_timers', label: '02. Tiempos y Lectura' },
                { id: 'sec3_schedule', label: '03. Horarios y Días' },
                { id: 'sec4_seasons', label: '04. Temporadas y 50 Personas' },
                { id: 'sec5_funnel', label: '05. Embudo y Paquetes' },
                { id: 'sec6_sections', label: '06. Atención por Sección' },
                { id: 'sec7_seo', label: '07. Posicionamiento SEO' },
                { id: 'sec8_geo', label: '08. Geografía y Dispositivos' },
                { id: 'sec9_friction', label: '09. Fricción y Copiado' },
                { id: 'sec10_logs', label: '10. Prospectos y Bitácora' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSectionFilter(s.id as SectionFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sectionFilter === s.id
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================================
            SECCIÓN 01: KPIS PRINCIPALES DE TRÁFICO Y CONVERSIÓN
        ===================================================================== */}
        {showSec('sec1_kpis') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                  Sección 01 • Indicadores Ejecutivos
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Volumen de Visitas, Interacciones y Conversiones Reales
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Cada indicador tiene su propio valor independiente
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  1.1 Sesiones Únicas
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.uniqueSessions}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Visitantes únicos: <strong>{stats.uniqueVisitors}</strong> | Recurrentes:{' '}
                  <strong>{stats.returningSessions}</strong>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  1.2 Total de Eventos Capturados
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.totalEvents}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Vistas de página registradas: <strong>{stats.pageViewsCount}</strong>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-xs font-bold uppercase text-emerald-800 block">
                  1.3 Clics Directos a WhatsApp
                </span>
                <p className="text-3xl font-black text-emerald-700 mt-2">{stats.whatsappCount}</p>
                <p className="text-xs text-emerald-900 mt-2">
                  Precotizador: <strong>{stats.whatsappPrecotizador}</strong> | Botón flotante:{' '}
                  <strong>{stats.whatsappFloating}</strong>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-xs font-bold uppercase text-amber-900 block">
                  1.4 Intención en Paquetes / Cotizar
                </span>
                <p className="text-3xl font-black text-amber-700 mt-2">{stats.cotizarCount}</p>
                <p className="text-xs text-amber-900 mt-2">
                  Clics en tarjetas de paquetes y botón Cotizar del Header
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  1.5 Tasa de Conversión a WhatsApp
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.conversionRateWA}%</p>
                <p className="text-xs text-slate-600 mt-2">
                  Porcentaje de sesiones que culminan en mensaje de WhatsApp
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  1.6 Prospectos en CRM (Tabla Leads)
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{leads.length}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Registros directos almacenados en la tabla <code>leads</code>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  1.7 Lecturas de Testimonios
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.testimonialCount}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Usuarios que pausaron reseñas para validar confianza
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  1.8 Navegación en Menú Header
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.headerNavsCount}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Aperturas del menú de Blog y navegación superior
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 02: MONITORES DE TIEMPO, CRONÓMETROS Y COMPORTAMIENTO DE LECTURA
        ===================================================================== */}
        {showSec('sec2_timers') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                Sección 02 • Contadores de Tiempo y Cronómetros de Atención
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Permanencia Activa, Velocidad de Interacción, Scroll y Patrones de Lectura
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-sky-50/60 border border-sky-200">
                <span className="text-xs font-bold uppercase text-sky-900 block">
                  2.1 Tiempo Activo Promedio
                </span>
                <p className="text-3xl font-black text-sky-800 mt-2">{stats.avgActiveTimeSec} seg</p>
                <p className="text-xs text-slate-600 mt-2">
                  Tiempo real con la pestaña visible en pantalla
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  2.2 Tiempo en Pestaña Oculta
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {stats.avgHiddenTimeSec} seg
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Tiempo que dejan abierta la web mientras comparan opciones
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  2.3 Tiempo a 1ra Interacción (TTFI)
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {stats.avgTtfiMs ? `${stats.avgTtfiMs} ms` : '—'}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Rapidez desde que carga la página hasta el primer scroll/clic
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  2.4 Tiempo hasta Clic en Cotizar
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {stats.avgTimeToCtaSec ? `${stats.avgTimeToCtaSec} seg` : '—'}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Segundos de lectura antes de tomar acción comercial
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  2.5 Profundidad de Scroll Promedio
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.avgScrollPct}%</p>
                <p className="text-xs text-slate-600 mt-2">
                  Porcentaje vertical de la página recorrido por sesión
                </p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-xs font-bold uppercase text-emerald-900 block">
                  2.6 Re-lectura de Precios (Regreso)
                </span>
                <p className="text-3xl font-black text-emerald-800 mt-2">
                  {stats.returnToPricesCount}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Usuarios que bajaron a ver galería/menú y subieron de nuevo a Paquetes
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  2.7 Cambios de Pestaña (Comparación)
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.totalTabSwitches}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Veces que el visitante cambió de ventana y regresó a nuestra web
                </p>
              </div>

              <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="text-xs font-bold uppercase text-amber-900 block">
                  2.8 Intención de Salida (Exit Intent)
                </span>
                <p className="text-3xl font-black text-amber-800 mt-2">{stats.exitIntentsCount}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Movimientos hacia cerrar pestaña detectados por sección
                </p>
              </div>
            </div>

            {stats.readingModeBreakdown.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 mb-3">
                  2.9 Clasificación de Velocidad de Lectura (Comportamiento de Scroll)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {stats.readingModeBreakdown.map((rm) => (
                    <div
                      key={rm.label}
                      className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-700">{rm.label}</span>
                      <span className="text-sm font-black text-slate-900">
                        {rm.count} ({rm.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 03: MONITORES DE HORARIOS Y DÍAS DE LA SEMANA (ZONA HORARIA CDMX)
        ===================================================================== */}
        {showSec('sec3_schedule') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                Sección 03 • Inteligencia Horaria y Semanal (Hora CDMX)
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Horarios Exactos de Navegación, Franjas Comerciales y Días de Visita
              </h2>
            </div>

            {/* 3.1 Comparativa Fin de Semana vs Entre Semana */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-amber-900 block">
                    3.1 Tráfico en Fin de Semana (Viernes, Sábado y Domingo)
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Consultas realizadas durante el bloque de fin de semana
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-slate-900">{stats.weekendEvents}</p>
                  <p className="text-xs font-bold text-emerald-700">
                    {stats.weekendConversions} conversiones
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-sky-50/60 border border-sky-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase text-sky-900 block">
                    3.2 Tráfico Entre Semana (Lunes a Jueves)
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Consultas realizadas en días laborales de lunes a jueves
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-slate-900">{stats.weekdayEvents}</p>
                  <p className="text-xs font-bold text-emerald-700">
                    {stats.weekdayConversions} conversiones
                  </p>
                </div>
              </div>
            </div>

            {/* 3.3 Franjas Horarias */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">
                3.3 Actividad por Franja Horaria del Día (CDMX)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.timeSlots.map((slot) => (
                  <div
                    key={slot.label}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-slate-600">{slot.label}</span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="text-2xl font-black text-slate-900">{slot.count}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {slot.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3.4 Reloj de 24 Horas */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  3.4 Mapa Horario de 24 Horas (00:00 a 23:00 hrs CDMX)
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block"></span>
                    Hora con Conversiones
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="w-3 h-3 rounded-xs bg-slate-400 inline-block"></span>
                    Hora de Exploración
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-12 lg:grid-cols-24 gap-2 items-end h-44 pt-6 border-b border-slate-200 pb-2 bg-white px-3 rounded-lg">
                {stats.hoursCount.map((h) => {
                  const heightPct = Math.round((h.total / maxHourTotal) * 100);
                  return (
                    <div
                      key={h.hour}
                      className="flex flex-col items-center gap-1 h-full justify-end"
                    >
                      <span className="text-[10px] text-slate-700 font-bold">
                        {h.total > 0 ? h.total : ''}
                      </span>
                      <div
                        className={`w-full rounded-t-sm transition-all ${
                          h.conversions > 0
                            ? 'bg-emerald-600'
                            : h.total > 0
                            ? 'bg-slate-500'
                            : 'bg-slate-200'
                        }`}
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                        title={`${h.label} hrs: ${h.total} eventos (${h.conversions} conversiones)`}
                      />
                      <span className="text-[10px] text-slate-500 font-mono">{h.hour}h</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3.5 Desglose por Día de la Semana de Visita */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3">
                3.5 Actividad por Día de la Semana en que el Usuario Visita la Página
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {stats.daysOrder.map((d) => {
                  const row = stats.dayStats[d];
                  return (
                    <div
                      key={d}
                      className={`p-4 rounded-xl border ${
                        row.isWeekend
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">{d}</span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {row.isWeekend ? 'Fin Sem' : 'Semana'}
                        </span>
                      </div>
                      <p className="text-2xl font-black text-slate-900 mt-1">{row.total}</p>
                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                        {row.conversions} conv.
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 04: TEMPORADAS, DÍAS DE EVENTO BUSCADOS Y REGLA DE 50 PERSONAS
        ===================================================================== */}
        {showSec('sec4_seasons') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                Sección 04 • Indicadores de Temporadas, Días Buscados y Regla de 50 Personas
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Qué Día (Viernes, Sábado, Domingo), Qué Temporada y Qué Aforo Buscan los Clientes
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 4.1 Día Preferido para el Evento */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  4.1 Día de la Semana Buscado para el Evento
                </h3>
                <p className="text-xs text-slate-600">
                  Mide cuántos clientes quieren su evento en Sábado vs. Viernes (Tarifa Preferencial) vs. Domingo.
                </p>
                {stats.preferredDaysDemand.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                    Indicador activo: se poblará automáticamente con cada selección del Paso 1 del Precotizador.
                  </p>
                ) : (
                  stats.preferredDaysDemand.map((d) => (
                    <div key={d.label} className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                        <span>{d.label}</span>
                        <span className="text-amber-700">
                          {d.count} ({d.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full"
                          style={{ width: `${Math.max(6, d.pct)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 4.2 Temporada / Mes Tentativo Buscado */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  4.2 Temporada / Mes Tentativo del Evento
                </h3>
                <p className="text-xs text-slate-600">
                  Identifica la demanda por temporada (Primavera/Graduaciones, Verano, Fin de Año o 2027).
                </p>
                {stats.preferredSeasonsDemand.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                    Indicador activo: registra la temporada seleccionada por el visitante en el Precotizador.
                  </p>
                ) : (
                  stats.preferredSeasonsDemand.map((s) => (
                    <div key={s.label} className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                        <span>{s.label}</span>
                        <span className="text-emerald-700">
                          {s.count} ({s.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${Math.max(6, s.pct)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 4.3 Regla de 50 Personas vs 100+ Personas */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  4.3 Monitor Regla 50–99 Personas vs. 100+ Personas
                </h3>
                <p className="text-xs text-slate-600">
                  Mide demanda de eventos pequeños (50–99, solo Premier) vs. eventos estándar (100+, todos los paquetes).
                </p>
                {stats.guestsRangeDemand.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                    Indicador activo: segmenta aforos de 50–99 vs 100–149, 150–199 y 200+ invitados.
                  </p>
                ) : (
                  stats.guestsRangeDemand.map((g) => (
                    <div key={g.label} className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                        <span>{g.label}</span>
                        <span className="text-sky-700">
                          {g.count} ({g.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-sky-600 h-full rounded-full"
                          style={{ width: `${Math.max(6, g.pct)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <span className="text-[11px] font-bold text-amber-800 block">
                      Clics en Paquete Bloqueado (&lt;100p)
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {stats.lockedClicksCount}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 block">
                      Subieron a 100 Personas (Upsell)
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {stats.funnel.upsell100Count}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4.4 Giro de Evento y 4.5 Servicios Extra Más Deseados */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  4.4 Demanda por Giro de Evento (XV Años, Bodas, Graduaciones, Empresarial)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {stats.eventKindsDemand.map((k) => (
                    <div
                      key={k.label}
                      className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-800">{k.label}</span>
                      <span className="text-xs font-black text-amber-700">
                        {k.count} ({k.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  4.5 Ranking de Servicios Extra Más Deseados (Mariachi, Robot LED, Cabina 360, Limusina)
                </h3>
                {stats.extrasDemand.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                    Cada vez que un usuario marque un servicio extra en el Paso 3 del Precotizador, se contabilizará aquí su popularidad.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {stats.extrasDemand.map((x) => (
                      <div
                        key={x.label}
                        className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold text-slate-800">{x.label}</span>
                        <span className="text-xs font-black text-emerald-700">
                          {x.count} ({x.pct}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 05: EMBUDO DEL PRECOTIZADOR Y DEMANDA POR PAQUETE
        ===================================================================== */}
        {showSec('sec5_funnel') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                Sección 05 • Embudo de Conversión y Nivel de Paquetes
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Avance Paso a Paso en el Precotizador, Tiempos de Decisión y Preferencia de Paquetes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  Paso 1: Aforo, Día y Temporada
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.funnel.step1Count}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Tiempo promedio en paso: <strong>{stats.funnel.step1AvgSec} seg</strong>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  Paso 2: Nivel de Servicio (Paquete)
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.funnel.step2Count}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Tiempo promedio en paso: <strong>{stats.funnel.step2AvgSec} seg</strong>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500 block">
                  Paso 3: Giro de Evento y Extras
                </span>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.funnel.step3Count}</p>
                <p className="text-xs text-slate-600 mt-2">
                  Tiempo promedio en paso: <strong>{stats.funnel.step3AvgSec} seg</strong>
                </p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold uppercase text-emerald-800 block">
                  Paso 4: Solicitud por WhatsApp
                </span>
                <p className="text-3xl font-black text-emerald-700 mt-2">
                  {stats.funnel.step4WACount}
                </p>
                <p className="text-xs text-emerald-900 mt-2">
                  Tiempo total de llenado: <strong>{stats.funnel.totalWizardAvgSec} seg</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  5.1 Comparativa de Interés por Paquete (Premier vs. Plus vs. All Inclusive)
                </h3>
                <div className="space-y-3">
                  {stats.packageDemand.map((pkg) => (
                    <div key={pkg.label} className="bg-white p-3.5 rounded-lg border border-slate-200">
                      <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                        <span>{pkg.label}</span>
                        <span className="text-amber-700">
                          {pkg.count} interacciones ({pkg.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${Math.max(5, pkg.pct)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  5.2 Indecisión y Abandono en Precotizador
                </h3>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    Retrocesos de Paso (Cambio de Opinión)
                  </span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {stats.funnel.backtracksCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Usuarios que regresaron al paso anterior para ajustar invitados o paquete
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    Cierres del Modal Precotizador
                  </span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {stats.funnel.abandonsCount}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Veces que abrieron el modal desde el Header y lo cerraron sin enviar
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 06: MAPA DE ATENCIÓN POR SECCIÓN Y CONTENIDOS
        ===================================================================== */}
        {showSec('sec6_sections') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                Sección 06 • Mapa de Atención por Sección e Interacción con Contenidos
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Rendimiento de Cada Bloque de la Home, Galería, Menú 3 Tiempos, TikTok y Footer
              </h2>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-xs font-bold">
                    <th className="py-3.5 px-4">Bloque / Sección del Sitio</th>
                    <th className="py-3.5 px-4 text-center">Vistas Registradas</th>
                    <th className="py-3.5 px-4 text-center">Tiempo Activo Promedio</th>
                    <th className="py-3.5 px-4 text-center">Clics / Interacciones</th>
                    <th className="py-3.5 px-4 text-center">Clics de Duda / Fricción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {stats.sectionTable.map((sec) => (
                    <tr key={sec.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{sec.label}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                        {sec.views}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-sky-700">
                        {sec.avgDwellSec} seg
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                        {sec.interactions}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            sec.friction > 0
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-500'
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-xs font-extrabold uppercase text-slate-700">
                  6.1 Galería (Diamante vs Platino)
                </h3>
                {stats.galleryBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-500">En espera de clics en pestañas o miniaturas.</p>
                ) : (
                  stats.galleryBreakdown.slice(0, 5).map((g) => (
                    <div key={g.label} className="flex justify-between text-xs bg-white p-2 rounded border border-slate-200">
                      <span className="truncate pr-2 text-slate-700">{g.label}</span>
                      <span className="font-bold text-slate-900">{g.count}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-xs font-extrabold uppercase text-slate-700">
                  6.2 Menú 3 Tiempos (Tinder Cards)
                </h3>
                {stats.menuBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-500">En espera de deslizamientos de platillos.</p>
                ) : (
                  stats.menuBreakdown.slice(0, 5).map((m) => (
                    <div key={m.label} className="flex justify-between text-xs bg-white p-2 rounded border border-slate-200">
                      <span className="truncate pr-2 text-slate-700">{m.label}</span>
                      <span className="font-bold text-slate-900">{m.count}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-xs font-extrabold uppercase text-slate-700">
                  6.3 Experiencias y Videos TikTok
                </h3>
                {stats.expBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-500">En espera de clics en playlist TikTok o shows.</p>
                ) : (
                  stats.expBreakdown.slice(0, 5).map((ex) => (
                    <div key={ex.label} className="flex justify-between text-xs bg-white p-2 rounded border border-slate-200">
                      <span className="truncate pr-2 text-slate-700">{ex.label}</span>
                      <span className="font-bold text-slate-900">{ex.count}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-xs font-extrabold uppercase text-slate-700">
                  6.4 Clics en Mapa, Teléfono y Redes
                </h3>
                {stats.footerBreakdown.length === 0 ? (
                  <p className="text-xs text-slate-500">En espera de clics en Google Maps o teléfono.</p>
                ) : (
                  stats.footerBreakdown.slice(0, 5).map((f) => (
                    <div key={f.label} className="flex justify-between text-xs bg-white p-2 rounded border border-slate-200">
                      <span className="truncate pr-2 text-slate-700">{f.label}</span>
                      <span className="font-bold text-slate-900">{f.count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 07: POSICIONAMIENTO SEO, CANALES DE ADQUISICIÓN Y WEB VITALS
        ===================================================================== */}
        {showSec('sec7_seo') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                Sección 07 • Indicadores de Posicionamiento SEO, Tráfico y Velocidad Técnica
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Canales de Adquisición, Rendimiento de URLs / Blog, Core Web Vitals y Salud SEO On-Page
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 7.1 Canales de Adquisición */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  7.1 Canales de Origen de Tráfico (SEO vs Redes vs Directo)
                </h3>
                {stats.channels.map((c) => (
                  <div
                    key={c.label}
                    className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800">{c.label}</span>
                    <span className="font-black text-emerald-700">
                      {c.count} ({c.pct}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* 7.2 Core Web Vitals y Velocidad SEO */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  7.2 Velocidad Técnica Core Web Vitals (Factor de Ranking Google)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">
                      Respuesta Servidor (TTFB)
                    </span>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {stats.webVitals.avgTtfbMs ? `${stats.webVitals.avgTtfbMs} ms` : '—'}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Meta SEO: &lt; 600 ms
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">
                      Primer Pintado (FCP)
                    </span>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {stats.webVitals.avgFcpMs ? `${stats.webVitals.avgFcpMs} ms` : '—'}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      Meta SEO: &lt; 1,800 ms
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">
                      Carga DOM Completa
                    </span>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {stats.webVitals.avgDomMs ? `${stats.webVitals.avgDomMs} ms` : '—'}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">
                      1ra Interacción (TTFI)
                    </span>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {stats.webVitals.avgTtfiMs ? `${stats.webVitals.avgTtfiMs} ms` : '—'}
                    </p>
                  </div>
                </div>

                {/* Auditoría SEO On-Page automática */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 block">
                    7.3 Auditoría Técnica On-Page Automática:
                  </span>
                  {stats.latestSeoAudit ? (
                    <>
                      <p className="text-slate-600">
                        • Etiquetas <code>&lt;h1&gt;</code>: <strong>{stats.latestSeoAudit.h1_count}</strong> ({stats.latestSeoAudit.h1_text})
                      </p>
                      <p className="text-slate-600">
                        • Subtítulos <code>&lt;h2&gt;</code>: <strong>{stats.latestSeoAudit.h2_count}</strong> | Imágenes sin <code>alt</code>: <strong>{stats.latestSeoAudit.img_missing_alt}</strong>
                      </p>
                      <p className="text-slate-600">
                        • Longitud <code>&lt;title&gt;</code>: <strong>{stats.latestSeoAudit.title_len} car.</strong> | <code>meta description</code>: <strong>{stats.latestSeoAudit.meta_desc_len} car.</strong>
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500">
                      Se actualiza automáticamente en cada carga de página pública.
                    </p>
                  )}
                </div>
              </div>

              {/* 7.4 Páginas y Artículos del Blog Más Visitados */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  7.4 Páginas y Artículos del Blog con Mayor Actividad Orgánica
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {stats.topPaths.map((p) => (
                    <div
                      key={p.label}
                      className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-slate-800 truncate pr-2">{p.label}</span>
                      <span className="font-bold text-amber-700 shrink-0">
                        {p.count} ({p.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 08: GEOGRAFÍA DE USUARIOS Y DISPOSITIVOS / SISTEMAS OPERATIVOS
        ===================================================================== */}
        {showSec('sec8_geo') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                Sección 08 • Geografía de Visitantes y Contexto Tecnológico
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Ubicación Geográfica (Ciudad/Alcaldía/Estado), Proveedor ISP, Dispositivos y Navegadores
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 8.1 Ubicación Geográfica */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase text-slate-700 border-b border-slate-200 pb-2">
                  8.1 Ciudad / Región Geográfica
                </h3>
                {stats.locations.map((loc) => (
                  <div
                    key={loc.label}
                    className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">{loc.label}</span>
                    <span className="font-bold text-emerald-700">
                      {loc.count} ({loc.pct}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* 8.2 Tipo de Dispositivo */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase text-slate-700 border-b border-slate-200 pb-2">
                  8.2 Tipo de Dispositivo
                </h3>
                {stats.devices.map((d) => (
                  <div
                    key={d.label}
                    className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">{d.label}</span>
                    <span className="font-bold text-sky-700">
                      {d.count} ({d.pct}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* 8.3 Sistema Operativo */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase text-slate-700 border-b border-slate-200 pb-2">
                  8.3 Sistema Operativo (iOS / Android / Windows)
                </h3>
                {stats.osList.map((o) => (
                  <div
                    key={o.label}
                    className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">{o.label}</span>
                    <span className="font-bold text-amber-700">
                      {o.count} ({o.pct}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* 8.4 Navegadores y Entornos In-App */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase text-slate-700 border-b border-slate-200 pb-2">
                  8.4 Navegadores y Apps (FB_IAB / GSA / Safari / Chrome)
                </h3>
                {stats.browsers.map((b) => (
                  <div
                    key={b.label}
                    className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800">{b.label}</span>
                    <span className="font-bold text-slate-900">
                      {b.count} ({b.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 09: MONITORES DE FRICCIÓN, DUDAS Y TEXTOS COPIADOS
        ===================================================================== */}
        {showSec('sec9_friction') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                Sección 09 • Diagnóstico de Fricción, Claridad de Mensajes y Textos Copiados
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Dónde Tienen Dudas los Usuarios (Dead Clicks), Frustración (Rage Clicks) y Qué Información Copian
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 9.1 Dead Clicks */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    9.1 Clics en Elementos No Interactivos (Dead Clicks)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                    {stats.deadClicksCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Muestra qué textos, precios o imágenes tocan los usuarios creyendo que abrirán más información.
                </p>
                {stats.deadClicks.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                    Sin clics muertos registrados en este periodo.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {stats.deadClicks.slice(0, 12).map((d) => (
                      <div key={d.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                        <span className="font-bold text-amber-800 uppercase">
                          [{d.meta.section}]
                        </span>{' '}
                        <span className="text-slate-700">
                          &ldquo;{d.meta.element_text}&rdquo;
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 9.2 Rage Clicks */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    9.2 Clics de Frustración (Rage Clicks)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 font-black text-xs">
                    {stats.rageClicksCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Detecta si un usuario hace 3 o más clics rápidos seguidos en una misma zona.
                </p>
                {stats.rageClicks.length === 0 ? (
                  <p className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200 font-medium">
                    ✓ Excelente: 0 eventos de frustración detectados en este periodo.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {stats.rageClicks.slice(0, 12).map((r) => (
                      <div key={r.id} className="bg-white p-2.5 rounded-lg border border-red-200 text-xs">
                        <span className="font-bold text-red-700 uppercase">
                          [{r.meta.section}]
                        </span>{' '}
                        <span className="text-slate-700">
                          &ldquo;{r.meta.element_text}&rdquo;
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 9.3 Textos Copiados */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    9.3 Textos Copiados por el Usuario
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs">
                    {stats.textCopiesCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Revela qué datos (dirección, precios, paquetes, teléfono) copian para compartir con su familia.
                </p>
                {stats.textCopies.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                    Sin textos copiados registrados aún en este periodo.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {stats.textCopies.slice(0, 12).map((c) => (
                      <div key={c.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                        <span className="font-bold text-emerald-800 uppercase">
                          [{c.meta.section}]
                        </span>{' '}
                        <span className="text-slate-700">
                          &ldquo;{c.meta.copied_text}&rdquo;
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECCIÓN 10: PROSPECTOS (TABLA LEADS) Y BITÁCORA CRONOLÓGICA DETALLADA
        ===================================================================== */}
        {showSec('sec10_logs') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
                Sección 10 • Registros Nominales y Bitácora de Eventos en Supabase
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Prospectos Almacenados en `leads` y Flujo Cronológico Detallado (`analytics_events`)
              </h2>
            </div>

            {/* 10.1 Tabla de Prospectos (Leads) */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                10.1 Prospectos Registrados en Tabla <code>leads</code> ({leads.length})
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-xs font-bold">
                      <th className="py-3 px-4">Fecha Registro</th>
                      <th className="py-3 px-4">Giro Evento</th>
                      <th className="py-3 px-4">Invitados</th>
                      <th className="py-3 px-4">Fecha Evento</th>
                      <th className="py-3 px-4">Contacto (Tel / Email)</th>
                      <th className="py-3 px-4">Ubicación / Cotización</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-mono text-xs">
                          {new Date(l.created_at).toLocaleDateString('es-MX')}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {l.event_type || '—'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-700">
                          {l.guests_count || '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                          {l.event_date || '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <span className="font-semibold">{l.phone_number}</span>
                          {l.email ? <span className="text-slate-500 block text-xs">{l.email}</span> : null}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs max-w-md">
                          {l.location || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            {l.status || 'Nuevo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 10.2 Bitácora Cronológica */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                10.2 Bitácora Cronológica de Interacciones (Últimos 100 Eventos del Periodo)
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-bold">
                      <th className="py-3 px-3">Fecha y Hora (CDMX)</th>
                      <th className="py-3 px-3">Día / Franja</th>
                      <th className="py-3 px-3">Tipo de Evento</th>
                      <th className="py-3 px-3">Origen / Sección</th>
                      <th className="py-3 px-3">Canal y Geografía</th>
                      <th className="py-3 px-3">Dispositivo / SO</th>
                      <th className="py-3 px-3">Parámetros Capturados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredEvents.slice(0, 100).map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-slate-700 font-mono whitespace-nowrap">
                          {ev.date_cdmx} {ev.time_cdmx}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          <strong className="text-slate-900">{ev.day_of_week}</strong> •{' '}
                          {ev.time_slot}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              ev.event_type === 'whatsapp_click'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : ev.event_type === 'cotizar_click'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {ev.event_type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-800">
                          {ev.source}{' '}
                          {ev.meta.section ? (
                            <span className="text-slate-500">({ev.meta.section})</span>
                          ) : null}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          <div className="font-semibold">
                            {ev.meta.acquisition?.traffic_channel || 'Directo'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {ev.meta.geo?.city || 'CDMX'}, {ev.meta.geo?.region || 'MX'}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {ev.meta.device?.os} • {ev.meta.device?.browser}
                        </td>
                        <td className="py-3 px-3 text-slate-700 max-w-xs">
                          {[
                            ev.meta.guests_range && `Aforo: ${ev.meta.guests_range}`,
                            ev.meta.package_name && `Paquete: ${ev.meta.package_name}`,
                            ev.meta.preferred_day && `Día: ${ev.meta.preferred_day}`,
                            ev.meta.preferred_season && `Temp: ${ev.meta.preferred_season}`,
                            ev.meta.event_kind && `Giro: ${ev.meta.event_kind}`,
                            ev.meta.element_text && `Detalle: "${ev.meta.element_text}"`,
                            ev.meta.copied_text && `Copió: "${ev.meta.copied_text}"`,
                            ev.meta.timers?.active_time_ms &&
                              `Tiempo activo: ${Math.round(ev.meta.timers.active_time_ms / 1000)}s`,
                          ]
                            .filter(Boolean)
                            .join(' | ') || `Ruta: ${ev.path}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

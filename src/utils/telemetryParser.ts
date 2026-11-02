// Utilidad central para codificar, decodificar, normalizar, filtrar bots/QA, retro-analizar y exportar la telemetría UX, SEO, GEO, Geográfica, Temporal y Comercial

export const UX_META_DELIMITER = ' ||| __UX_META__:';

export interface GeoInfo {
  ip_masked?: string;
  country?: string;
  region?: string;
  city?: string;
  zip?: string;
  isp?: string;
  is_mobile_net?: boolean;
  lat?: number;
  lon?: number;
  timezone?: string;
}

export interface DeviceInfo {
  device_type?: 'Mobile' | 'Tablet' | 'Desktop';
  os?: string;
  browser?: string;
  in_app_browser?: string | null;
  viewport?: string;
  screen?: string;
  language?: string;
  connection_type?: string;
}

export interface AcquisitionInfo {
  traffic_channel?: string; // 'IA Generativa (ChatGPT / GEO)', 'Google Orgánico (SEO)', 'Facebook Ads / App', 'Instagram', 'TikTok', 'Tráfico Directo', etc.
  referrer?: string;
  referrer_domain?: string;
  landing_path?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ad_click_id?: string; // fbclid, gclid, ttclid
}

export interface TimersInfo {
  active_time_ms?: number;
  hidden_time_ms?: number;
  ttfi_ms?: number; // Time to first interaction
  time_to_cta_ms?: number;
  section_dwell_ms?: number;
  step_duration_ms?: number;
  ttfb_ms?: number;
  fcp_ms?: number;
  lcp_ms?: number;
  cls_score?: number;
  dom_load_ms?: number;
}

export interface UXTelemetryMeta {
  v?: number;
  session_id?: string;
  visitor_id?: string;
  visit_number?: number;
  is_returning?: boolean;
  section?: string;
  scroll_pct?: number;
  max_scroll_pct?: number;
  tab_switches?: number;
  cookie_consent?: string;
  geo?: GeoInfo;
  device?: DeviceInfo;
  acquisition?: AcquisitionInfo;
  timers?: TimersInfo;
  // Datos comerciales y del precotizador / interacción
  guests_range?: string;
  package_name?: string;
  event_kind?: string;
  preferred_day?: string; // 'Sábado', 'Viernes', 'Domingo', 'Entre Semana'
  preferred_season?: string; // Temporada / mes tentativo
  step_number?: number;
  locked_package_attempted?: string;
  element_text?: string;
  element_tag?: string;
  copied_text?: string;
  gallery_category?: string;
  photo_title?: string;
  dish_title?: string;
  experience_title?: string;
  blog_slug?: string;
  is_bot?: boolean;
  is_internal_qa?: boolean;
  extra?: Record<string, unknown>;
}

export interface RawAnalyticsRow {
  id: string;
  event_type: string;
  source: string | null;
  path: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ParsedAnalyticsEvent {
  id: string;
  event_type: string;
  source: string;
  path: string;
  raw_user_agent: string;
  created_at: string;
  // Horario CDMX calculado
  date_cdmx: string; // YYYY-MM-DD
  time_cdmx: string; // HH:mm:ss
  hour_cdmx: number; // 0 - 23
  day_of_week: string; // Lunes..Domingo
  day_index: number; // 0 (Dom) - 6 (Sáb)
  is_weekend: boolean; // Viernes, Sábado o Domingo
  time_slot: 'Madrugada (00-06h)' | 'Mañana (06-12h)' | 'Tarde (12-18h)' | 'Noche (18-24h)';
  month_name: string;
  // Metadatos enriquecidos (extraídos de __UX_META__ o retro-calculados del User-Agent)
  session_id: string;
  visitor_id: string;
  is_historical: boolean;
  // Banderas de higiene de tráfico (Bots, Rastreadores y QA interno)
  is_bot: boolean;
  is_internal_qa: boolean;
  is_non_human_or_qa: boolean;
  traffic_actor_reason?: string;
  meta: UXTelemetryMeta;
}

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// ============================================================================
// NORMALIZADORES CANÓNICOS DE DEMANDA COMERCIAL Y SECCIONES
// ============================================================================

export function normalizeEventKind(raw?: string | null): string {
  if (!raw) return '';
  const clean = raw.trim().toLowerCase();
  if (!clean) return '';
  if (clean === 'xv' || clean.includes('xv') || clean.includes('quince')) return 'XV Años';
  if (clean.includes('boda')) return 'Boda';
  if (clean.includes('empresarial') || clean.includes('corporativo')) return 'Empresarial';
  if (clean.includes('graduac')) return 'Graduación';
  if (clean.includes('bautizo') || clean.includes('cumple') || clean.includes('social')) {
    return 'Bautizo / Cumpleaños';
  }
  if (clean === 'otro') return 'Otro Evento Social';
  return raw.trim();
}

export function normalizeExtraService(raw?: string | null): string {
  if (!raw) return '';
  const clean = raw.trim().toLowerCase();
  if (!clean) return '';
  if (clean.includes('combo') || clean.includes('vip')) return 'Combo Fiesta VIP (Limusina + Shots + Letras)';
  if (clean.includes('shot')) return 'Carrito de Shots';
  if (clean.includes('limusina') || clean.includes('limo')) return 'Servicio de Limusina';
  if (clean.includes('letra')) return 'Letras Gigantes';
  if (clean.includes('dulce')) return 'Mesa de Dulces';
  if (clean.includes('mariachi')) return 'Mariachi';
  if (clean.includes('robot') || clean.includes('batucada') || clean.includes('iron')) return 'Robot LED / Batucada';
  if (clean.includes('cabina') || clean.includes('360')) return 'Cabina 360';
  return raw.trim();
}

export function normalizePackageName(rawPkg?: string | null, source?: string | null): string {
  const cleanPkg = (rawPkg || '').trim().toLowerCase();
  const cleanSrc = (source || '').trim().toLowerCase();

  if (cleanPkg.includes('all inclusive') || cleanSrc === 'paquete_all_inclusive') {
    return 'Paquete All Inclusive ($1,010 p/p)';
  }
  if (cleanPkg.includes('plus') || cleanSrc === 'paquete_plus') {
    return 'Paquete Plus ($710 p/p)';
  }
  if (cleanPkg.includes('premier') || cleanSrc === 'paquete_premier') {
    return 'Paquete Premier ($530 p/p)';
  }
  if (cleanSrc === 'paquete_cta') {
    return 'Paquete Premier ($530 p/p)';
  }
  if (rawPkg && rawPkg.trim()) {
    return rawPkg.trim();
  }
  return '';
}

export function normalizeGalleryCategory(raw?: string | null, source?: string | null): string {
  const combined = `${raw || ''} ${source || ''}`.toLowerCase();
  if (combined.includes('diamante')) return 'Salón Diamante';
  if (combined.includes('platino')) return 'Salón Platino';
  return raw || source || 'Galería General';
}

// ============================================================================
// DETECCIÓN FORENSE DE BOTS, CRAWLERS Y TRÁFICO INTERNO DE QA / ADMIN
// ============================================================================

const KNOWN_QA_VISITOR_IDS = new Set([
  'usr_iez6z_e7k92646',
]);

const KNOWN_SMOKE_TEST_SESSIONS = new Set([
  'ses_3f9ph_px4w2auf',
  'ses_1dzui_iz9kbcot',
  'ses_65mrm_m4sas8kk',
  'ses_zxkds_3ctvwd8t',
  'ses_kkfj1_9x9hab3a',
]);

export function detectBotOrInternalQA(
  rawUA: string,
  meta: UXTelemetryMeta,
  sessionId: string,
  visitorId: string
): {
  is_bot: boolean;
  is_internal_qa: boolean;
  is_non_human_or_qa: boolean;
  traffic_actor_reason?: string;
} {
  const uaLower = (rawUA || '').toLowerCase();
  const ispLower = (meta.geo?.isp || '').toLowerCase();
  const cityLower = (meta.geo?.city || '').toLowerCase();
  const screen = meta.device?.screen || '';
  const ref = (meta.acquisition?.referrer || '').toLowerCase();

  // 1. Detección de Bots y Crawlers (Googlebot, Bingbot, Meta Ads Crawler, HeadlessChrome)
  if (
    meta.is_bot ||
    /googlebot|bingbot|headlesschrome|facebookexternalhit|meta-externalagent|adsbot-google|ahrefsbot|semrushbot|bytespider|petalbot|applebot|yandexbot|baiduspider|twitterbot|linkedinbot/i.test(
      uaLower
    )
  ) {
    return {
      is_bot: true,
      is_internal_qa: false,
      is_non_human_or_qa: true,
      traffic_actor_reason: 'Bot / Crawler por User-Agent',
    };
  }

  if (
    ispLower.includes('google llc') ||
    ispLower.includes('microsoft corporation') ||
    ispLower.includes('facebook, inc') ||
    ispLower.includes('meta platforms') ||
    (cityLower === 'mountain view' && ispLower.includes('google')) ||
    (cityLower === 'clonee' && screen === '2000x2000') ||
    (cityLower === 'quincy' && screen === '800x600')
  ) {
    return {
      is_bot: true,
      is_internal_qa: false,
      is_non_human_or_qa: true,
      traffic_actor_reason: `Servidor Automatizado (${meta.geo?.isp || meta.geo?.city || 'Crawler'})`,
    };
  }

  // 2. Detección de Tráfico Interno de Administración y Pruebas de Humo (QA)
  if (
    meta.is_internal_qa ||
    meta.extra?.is_admin_device === true ||
    ref.includes('/admin') ||
    KNOWN_QA_VISITOR_IDS.has(visitorId) ||
    KNOWN_SMOKE_TEST_SESSIONS.has(sessionId)
  ) {
    return {
      is_bot: false,
      is_internal_qa: true,
      is_non_human_or_qa: true,
      traffic_actor_reason: 'Tráfico Interno / QA Administrativo (/admin)',
    };
  }

  return {
    is_bot: false,
    is_internal_qa: false,
    is_non_human_or_qa: false,
  };
}

export function encodeUserAgentWithMeta(rawUserAgent: string, meta: UXTelemetryMeta): string {
  try {
    const cleanUA = (rawUserAgent || 'unknown').split(UX_META_DELIMITER)[0];
    return `${cleanUA}${UX_META_DELIMITER}${JSON.stringify(meta)}`;
  } catch {
    return rawUserAgent || 'unknown';
  }
}

export function parseUserAgentFallback(ua: string): { device: DeviceInfo; channelHint: string | null } {
  const lower = (ua || '').toLowerCase();

  let device_type: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';
  if (/ipad|tablet|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
    device_type = 'Tablet';
  } else if (/iphone|ipod|android.*mobile|windows phone|iemobile|mobile/i.test(ua)) {
    device_type = 'Mobile';
  }

  let os = 'Otro SO';
  if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS (iPhone/iPad)';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let in_app_browser: string | null = null;
  let channelHint: string | null = null;

  if (lower.includes('fb_iab') || lower.includes('fbav') || lower.includes('fban')) {
    in_app_browser = 'Facebook In-App Browser';
    channelHint = 'Facebook Ads / App';
  } else if (lower.includes('instagram')) {
    in_app_browser = 'Instagram In-App Browser';
    channelHint = 'Instagram App';
  } else if (lower.includes('tiktok') || lower.includes('musical_ly') || lower.includes('bytedance')) {
    in_app_browser = 'TikTok In-App Browser';
    channelHint = 'TikTok App';
  } else if (lower.includes('gsa/')) {
    in_app_browser = 'Google Search App';
    channelHint = 'Google Search App (Móvil)';
  } else if (lower.includes('whatsapp')) {
    in_app_browser = 'WhatsApp Browser';
    channelHint = 'WhatsApp';
  }

  let browser = 'Otro Navegador';
  if (in_app_browser) browser = in_app_browser;
  else if (/edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/crios/i.test(ua)) browser = 'Chrome iOS';
  else if (/chrome|chromium/i.test(ua)) browser = 'Google Chrome';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Apple Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';

  return {
    device: {
      device_type,
      os,
      browser,
      in_app_browser,
    },
    channelHint,
  };
}

export function getCDMXDateParts(isoString: string) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return {
      date_cdmx: '2026-01-01',
      time_cdmx: '00:00:00',
      hour_cdmx: 0,
      day_of_week: 'Jueves',
      day_index: 4,
      is_weekend: false,
      time_slot: 'Madrugada (00-06h)' as const,
      month_name: 'Enero',
    };
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short',
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    map[p.type] = p.value;
  }

  const year = map.year || '2026';
  const monthNum = parseInt(map.month || '1', 10);
  const day = map.day || '01';
  let hour = parseInt(map.hour || '0', 10);
  if (hour === 24) hour = 0;
  const minute = map.minute || '00';
  const second = map.second || '00';

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const day_index = weekdayMap[map.weekday || 'Thu'] ?? 4;
  const day_of_week = DAYS_ES[day_index];
  const is_weekend = day_index === 0 || day_index === 5 || day_index === 6;

  let time_slot: 'Madrugada (00-06h)' | 'Mañana (06-12h)' | 'Tarde (12-18h)' | 'Noche (18-24h)' = 'Noche (18-24h)';
  if (hour >= 0 && hour < 6) time_slot = 'Madrugada (00-06h)';
  else if (hour >= 6 && hour < 12) time_slot = 'Mañana (06-12h)';
  else if (hour >= 12 && hour < 18) time_slot = 'Tarde (12-18h)';

  return {
    date_cdmx: `${year}-${String(monthNum).padStart(2, '0')}-${day}`,
    time_cdmx: `${String(hour).padStart(2, '0')}:${minute}:${second}`,
    hour_cdmx: hour,
    day_of_week,
    day_index,
    is_weekend,
    time_slot,
    month_name: MONTHS_ES[(monthNum - 1) % 12] || 'Enero',
  };
}

export function parseAnalyticsRow(row: RawAnalyticsRow): ParsedAnalyticsEvent {
  const uaField = row.user_agent || '';
  const delimIdx = uaField.indexOf(UX_META_DELIMITER);

  let rawUA = uaField;
  let meta: UXTelemetryMeta = {};
  let is_historical = true;

  if (delimIdx !== -1) {
    rawUA = uaField.slice(0, delimIdx);
    const jsonStr = uaField.slice(delimIdx + UX_META_DELIMITER.length);
    try {
      meta = JSON.parse(jsonStr) as UXTelemetryMeta;
      is_historical = false;
    } catch {
      meta = {};
    }
  }

  const fallback = parseUserAgentFallback(rawUA);
  if (!meta.device) {
    meta.device = fallback.device;
  } else {
    meta.device = { ...fallback.device, ...meta.device };
  }

  if (!meta.acquisition) {
    meta.acquisition = {
      traffic_channel: fallback.channelHint || 'Directo / Orgánico (Histórico)',
      landing_path: row.path || '/',
    };
  } else if (!meta.acquisition.traffic_channel) {
    meta.acquisition.traffic_channel = fallback.channelHint || 'Directo / Orgánico';
  }

  // Regla explícita de atribución GEO: reclasificar utm_source=chatgpt.com o referrers de IA Generativa
  const utmSourceLower = (meta.acquisition.utm_source || '').toLowerCase();
  const refLower = (meta.acquisition.referrer || meta.acquisition.referrer_domain || '').toLowerCase();
  if (
    /chatgpt|openai|perplexity|gemini\.google|claude\.ai|copilot\.microsoft/i.test(utmSourceLower) ||
    /chatgpt|openai|perplexity|gemini\.google|claude\.ai|copilot\.microsoft/i.test(refLower)
  ) {
    meta.acquisition.traffic_channel = 'IA Generativa (ChatGPT / GEO)';
  } else if (refLower.includes('l.wl.co') || (meta.acquisition.traffic_channel || '').includes('l.wl.co')) {
    meta.acquisition.traffic_channel = 'WhatsApp Business (Enlace Directo)';
  } else if (
    (utmSourceLower === 'ig' || utmSourceLower.includes('instagram')) &&
    meta.acquisition.traffic_channel === 'Tráfico Directo'
  ) {
    meta.acquisition.traffic_channel = 'Instagram Ads / App';
  }

  // Normalizar campos comerciales dentro de meta para evitar fragmentación estadística
  if (meta.event_kind) {
    meta.event_kind = normalizeEventKind(meta.event_kind);
  }
  if (meta.gallery_category || row.event_type === 'gallery_interaction') {
    meta.gallery_category = normalizeGalleryCategory(meta.gallery_category, row.source);
  }
  if (row.event_type === 'extra_service_interest' && meta.element_text) {
    meta.element_text = normalizeExtraService(meta.element_text);
  }
  if (meta.extra && Array.isArray(meta.extra.extras)) {
    meta.extra.extras = meta.extra.extras.map((x) => normalizeExtraService(String(x)));
  }

  const cdmx = getCDMXDateParts(row.created_at);

  const fallbackSessionId = `hist_${cdmx.date_cdmx}_${cdmx.hour_cdmx}h_${(rawUA || '').slice(-18).replace(/[^a-zA-Z0-9]/g, '')}`;
  const session_id = meta.session_id || fallbackSessionId;
  const visitor_id = meta.visitor_id || session_id;

  if (!meta.section) {
    const src = row.source || '';
    if (src.includes('paquete')) meta.section = 'paquetes';
    else if (src.includes('precotizador')) meta.section = 'precotizador';
    else if (src.includes('header')) meta.section = 'inicio';
    else if (src.includes('floating')) meta.section = 'floating_whatsapp';
    else if ((row.path || '').startsWith('/blog')) meta.section = 'blog';
  }

  const hygiene = detectBotOrInternalQA(rawUA, meta, session_id, visitor_id);

  return {
    id: row.id,
    event_type: row.event_type,
    source: row.source || 'desconocido',
    path: row.path || '/',
    raw_user_agent: rawUA,
    created_at: row.created_at,
    ...cdmx,
    session_id,
    visitor_id,
    is_historical,
    ...hygiene,
    meta,
  };
}

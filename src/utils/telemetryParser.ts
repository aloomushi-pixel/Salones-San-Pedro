// Utilidad central para codificar, decodificar, retro-analizar y exportar la telemetría UX, SEO, Geográfica, Temporal y Comercial

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
  traffic_channel?: string; // 'Google Orgánico', 'Google Search App', 'Facebook / Instagram App', 'TikTok', 'Directo', 'Referencia Web'
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
  meta: UXTelemetryMeta;
}

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

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

  // Convertir a zona horaria America/Mexico_City
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
  // En la industria de salones de eventos, Viernes, Sábado y Domingo constituyen el bloque de Fin de Semana
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

  const cdmx = getCDMXDateParts(row.created_at);

  // Para eventos históricos sin session_id, agrupamos por fecha + navegador + hora aproximada
  const fallbackSessionId = `hist_${cdmx.date_cdmx}_${cdmx.hour_cdmx}h_${(rawUA || '').slice(-18).replace(/[^a-zA-Z0-9]/g, '')}`;
  const session_id = meta.session_id || fallbackSessionId;
  const visitor_id = meta.visitor_id || session_id;

  // Inferir sección si es un evento histórico
  if (!meta.section) {
    const src = row.source || '';
    if (src.includes('paquete')) meta.section = 'paquetes';
    else if (src.includes('precotizador')) meta.section = 'precotizador';
    else if (src.includes('header')) meta.section = 'inicio';
    else if (src.includes('floating')) meta.section = 'floating_whatsapp';
    else if ((row.path || '').startsWith('/blog')) meta.section = 'blog';
  }

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
    meta,
  };
}

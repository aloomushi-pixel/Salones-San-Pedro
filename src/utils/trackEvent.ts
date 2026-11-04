import { AcquisitionInfo, DeviceInfo, UXTelemetryMeta } from './telemetryParser';

interface RuntimeMonitorState {
  sessionId: string;
  visitorId: string;
  visitNumber: number;
  isReturning: boolean;
  pageStartTime: number;
  activeTimeMs: number;
  hiddenTimeMs: number;
  lastActiveTick: number;
  isTabVisible: boolean;
  tabSwitchCount: number;
  maxScrollPct: number;
  currentScrollPct: number;
  currentSection: string;
  ttfiMs?: number;
  timeToCtaMs?: number;
  acquisition?: AcquisitionInfo;
}

let runtimeState: RuntimeMonitorState | null = null;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setMonitorCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function generateShortId(prefix: string): string {
  const rand = Math.random().toString(36).substring(2, 10);
  const ts = Date.now().toString(36).slice(-5);
  return `${prefix}_${ts}_${rand}`;
}

function detectTrafficChannel(referrer: string, ua: string, searchParams: URLSearchParams): AcquisitionInfo {
  const utm_source = searchParams.get('utm_source') || undefined;
  const utm_medium = searchParams.get('utm_medium') || undefined;
  const utm_campaign = searchParams.get('utm_campaign') || undefined;
  const utm_term = searchParams.get('utm_term') || undefined;
  const utm_content = searchParams.get('utm_content') || undefined;

  const fbclid = searchParams.get('fbclid');
  const gclid = searchParams.get('gclid');
  const ttclid = searchParams.get('ttclid');
  const ad_click_id = fbclid ? `fbclid:${fbclid.slice(0, 12)}` : gclid ? `gclid:${gclid.slice(0, 12)}` : ttclid ? `ttclid:${ttclid.slice(0, 12)}` : undefined;

  let referrer_domain = '';
  if (referrer) {
    try {
      const url = new URL(referrer);
      referrer_domain = url.hostname.replace(/^www\./, '');
    } catch {
      referrer_domain = referrer.slice(0, 50);
    }
  }

  const lowerUA = ua.toLowerCase();
  const lowerRef = referrer_domain.toLowerCase();
  const lowerUtmSrc = (utm_source || '').toLowerCase();
  let traffic_channel = 'Tráfico Directo';

  // 1. Regla explícita GEO: Motores de IA Generativa (ChatGPT, Perplexity, Gemini, Claude, Copilot)
  if (
    /chatgpt|openai|perplexity|gemini\.google|claude\.ai|copilot\.microsoft/i.test(lowerUtmSrc) ||
    /chatgpt|openai|perplexity|gemini\.google|claude\.ai|copilot\.microsoft/i.test(lowerRef)
  ) {
    traffic_channel = 'IA Generativa (ChatGPT / GEO)';
  } else if (gclid || (utm_source && /google/i.test(utm_source) && /cpc|ppc|paid/i.test(utm_medium || ''))) {
    traffic_channel = 'Google Ads (Pagado)';
  } else if (lowerUA.includes('instagram') || /instagram/i.test(lowerRef) || /instagram|^ig$/i.test(utm_source || '')) {
    traffic_channel = 'Instagram';
  } else if (fbclid || lowerUA.includes('fb_iab') || lowerUA.includes('fbav') || /facebook|fb\.com|m\.facebook/i.test(lowerRef) || /facebook|fb|meta/i.test(utm_source || '')) {
    traffic_channel = 'Facebook Ads / App';
  } else if (ttclid || lowerUA.includes('tiktok') || lowerUA.includes('musical_ly') || /tiktok/i.test(lowerRef) || /tiktok/i.test(utm_source || '')) {
    traffic_channel = 'TikTok';
  } else if (lowerUA.includes('gsa/')) {
    traffic_channel = 'Google Search App (Móvil)';
  } else if (/google\./i.test(lowerRef)) {
    traffic_channel = 'Google Orgánico (SEO)';
  } else if (/bing\.|yahoo\.|duckduckgo\./i.test(lowerRef)) {
    traffic_channel = 'Buscadores Orgánicos (Bing/Yahoo)';
  } else if (/l\.wl\.co/i.test(lowerRef)) {
    traffic_channel = 'WhatsApp Business (Enlace Directo)';
  } else if (/wa\.me|whatsapp/i.test(lowerRef) || lowerUA.includes('whatsapp')) {
    traffic_channel = 'WhatsApp Compartido';
  } else if (referrer_domain && !referrer_domain.includes(window.location.hostname)) {
    traffic_channel = `Referencia Web (${referrer_domain})`;
  }

  return {
    traffic_channel,
    referrer: referrer ? referrer.slice(0, 180) : undefined,
    referrer_domain: referrer_domain || undefined,
    landing_path: window.location.pathname,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    ad_click_id,
  };
}

export function getOrInitMonitorState(): RuntimeMonitorState | null {
  if (typeof window === 'undefined') return null;

  // Marcar dispositivo si accede a /admin o proviene de /admin para segregar tráfico QA
  try {
    if (window.location.pathname.startsWith('/admin') || (document.referrer && document.referrer.includes('/admin'))) {
      localStorage.setItem('ssp_is_admin_qa', 'true');
    }
  } catch {
    // Ignorar errores de localStorage
  }

  if (runtimeState) {
    const now = Date.now();
    if (runtimeState.isTabVisible) {
      runtimeState.activeTimeMs += Math.max(0, now - runtimeState.lastActiveTick);
    } else {
      runtimeState.hiddenTimeMs += Math.max(0, now - runtimeState.lastActiveTick);
    }
    runtimeState.lastActiveTick = now;
    return runtimeState;
  }

  let visitorId = getCookie('ssp_vid') || localStorage.getItem('ssp_vid') || '';
  let visitNumber = parseInt(localStorage.getItem('ssp_visit_count') || '0', 10) || 0;
  let sessionId = sessionStorage.getItem('ssp_sid') || getCookie('ssp_sid') || '';

  if (!visitorId) {
    visitorId = generateShortId('usr');
    localStorage.setItem('ssp_vid', visitorId);
    setMonitorCookie('ssp_vid', visitorId, 365);
  }

  if (!sessionId) {
    sessionId = generateShortId('ses');
    sessionStorage.setItem('ssp_sid', sessionId);
    setMonitorCookie('ssp_sid', sessionId, 1);
    visitNumber += 1;
    localStorage.setItem('ssp_visit_count', String(visitNumber));
  } else if (visitNumber === 0) {
    visitNumber = 1;
    localStorage.setItem('ssp_visit_count', '1');
  }

  // Persistir adquisición inicial de la sesión, pero actualizar si entran nuevos parámetros UTM (ej. utm_source=chatgpt.com)
  let acquisition: AcquisitionInfo | undefined;
  try {
    const params = new URLSearchParams(window.location.search);
    const hasNewUtm = params.has('utm_source') || params.has('fbclid') || params.has('gclid');
    const cachedAcq = sessionStorage.getItem('ssp_acquisition');
    if (cachedAcq && !hasNewUtm) {
      acquisition = JSON.parse(cachedAcq);
      if (
        acquisition &&
        (acquisition.referrer_domain === 'l.wl.co' ||
          acquisition.traffic_channel === 'Referencia Web (l.wl.co)')
      ) {
        acquisition.traffic_channel = 'WhatsApp Business (Enlace Directo)';
        sessionStorage.setItem('ssp_acquisition', JSON.stringify(acquisition));
      } else if (
        acquisition &&
        (acquisition.utm_source === 'ig' ||
          acquisition.referrer_domain === 'l.instagram.com' ||
          (acquisition.referrer && acquisition.referrer.includes('instagram.com')))
      ) {
        acquisition.traffic_channel = 'Instagram';
        sessionStorage.setItem('ssp_acquisition', JSON.stringify(acquisition));
      }
    } else {
      acquisition = detectTrafficChannel(document.referrer || '', navigator.userAgent || '', params);
      sessionStorage.setItem('ssp_acquisition', JSON.stringify(acquisition));
    }
  } catch {
    acquisition = { traffic_channel: 'Tráfico Directo', landing_path: window.location.pathname };
  }

  const now = Date.now();
  runtimeState = {
    sessionId,
    visitorId,
    visitNumber,
    isReturning: visitNumber > 1,
    pageStartTime: now,
    activeTimeMs: 0,
    hiddenTimeMs: 0,
    lastActiveTick: now,
    isTabVisible: typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
    tabSwitchCount: 0,
    maxScrollPct: 0,
    currentScrollPct: 0,
    currentSection: 'inicio',
    acquisition,
  };

  return runtimeState;
}

export function updateMonitorScroll(scrollPct: number, currentSection?: string) {
  const st = getOrInitMonitorState();
  if (!st) return;
  st.currentScrollPct = Math.min(100, Math.max(0, Math.round(scrollPct)));
  if (st.currentScrollPct > st.maxScrollPct) {
    st.maxScrollPct = st.currentScrollPct;
  }
  if (currentSection) {
    st.currentSection = currentSection;
  }
}

export function updateMonitorVisibility(isVisible: boolean): { tabSwitchCount: number; activeTimeMs: number; hiddenTimeMs: number } {
  const st = getOrInitMonitorState();
  if (!st) return { tabSwitchCount: 0, activeTimeMs: 0, hiddenTimeMs: 0 };
  const now = Date.now();
  if (st.isTabVisible) {
    st.activeTimeMs += Math.max(0, now - st.lastActiveTick);
  } else {
    st.hiddenTimeMs += Math.max(0, now - st.lastActiveTick);
  }
  runtimeState!.lastActiveTick = now;
  if (st.isTabVisible && !isVisible) {
    st.tabSwitchCount += 1;
  }
  st.isTabVisible = isVisible;
  return {
    tabSwitchCount: st.tabSwitchCount,
    activeTimeMs: st.activeTimeMs,
    hiddenTimeMs: st.hiddenTimeMs,
  };
}

export function recordFirstInteraction(): number | null {
  const st = getOrInitMonitorState();
  if (!st) return null;
  if (typeof st.ttfiMs === 'number') return null;
  st.ttfiMs = Math.max(10, Date.now() - st.pageStartTime);
  return st.ttfiMs;
}

function collectDeviceContext(): DeviceInfo {
  if (typeof window === 'undefined') return {};
  const w = window.innerWidth || 0;
  const h = window.innerHeight || 0;
  const device_type: 'Mobile' | 'Tablet' | 'Desktop' = w < 768 ? 'Mobile' : w < 1024 ? 'Tablet' : 'Desktop';
  const nav = navigator as Navigator & { connection?: { effectiveType?: string } };

  return {
    device_type,
    viewport: `${w}x${h}`,
    screen: typeof window.screen !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : undefined,
    language: navigator.language || 'es-MX',
    connection_type: nav.connection?.effectiveType || undefined,
  };
}

export const trackEvent = async (
  event_type: string,
  source: string,
  customMeta?: Partial<UXTelemetryMeta>,
  useBeacon = false
) => {
  try {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/admin')) return;

    const ua = navigator.userAgent || '';
    const isBotClient =
      Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver) ||
      /googlebot|bingbot|headlesschrome|facebookexternalhit|meta-externalagent|adsbot-google|ahrefsbot|semrushbot|bytespider|petalbot/i.test(
        ua
      );

    // Ignorar rastreadores automatizados y navegadores headless en el cliente
    if (isBotClient) return;

    const st = getOrInitMonitorState();
    if (!st) return;

    const isAdminDevice =
      localStorage.getItem('ssp_is_admin_qa') === 'true' ||
      (document.referrer && document.referrer.includes('/admin')) ||
      st.visitorId === 'usr_iez6z_e7k92646';

    if ((event_type === 'cotizar_click' || event_type === 'whatsapp_click' || event_type === 'precotizador_open') && !st.timeToCtaMs) {
      st.timeToCtaMs = st.activeTimeMs;
    }

    const consentStatus = getCookie('ssp_consent') || localStorage.getItem('ssp_consent') || 'implicit_active';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Mexico_City';

    const meta: UXTelemetryMeta = {
      session_id: st.sessionId,
      visitor_id: st.visitorId,
      visit_number: st.visitNumber,
      is_returning: st.isReturning,
      section: customMeta?.section || st.currentSection,
      scroll_pct: st.currentScrollPct,
      max_scroll_pct: st.maxScrollPct,
      tab_switches: st.tabSwitchCount,
      cookie_consent: consentStatus,
      is_internal_qa: Boolean(isAdminDevice),
      geo: {
        timezone,
        ...customMeta?.geo,
      },
      device: {
        ...collectDeviceContext(),
        ...customMeta?.device,
      },
      acquisition: st.acquisition,
      timers: {
        active_time_ms: Math.round(st.activeTimeMs),
        hidden_time_ms: Math.round(st.hiddenTimeMs),
        ttfi_ms: st.ttfiMs,
        time_to_cta_ms: st.timeToCtaMs,
        ...customMeta?.timers,
      },
      ...customMeta,
      extra: {
        ...(customMeta?.extra || {}),
        ...(isAdminDevice ? { is_admin_device: true } : {}),
      },
    };

    const payload = JSON.stringify({
      event_type,
      source,
      path: window.location.pathname,
      meta,
    });

    if (useBeacon && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
      return;
    }

    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      keepalive: true,
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

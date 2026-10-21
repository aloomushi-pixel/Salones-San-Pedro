import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { encodeUserAgentWithMeta, GeoInfo, UXTelemetryMeta } from '@/utils/telemetryParser';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Caché en memoria por IP para no repetir consultas de geolocalización en la misma sesión
const geoCache = new Map<string, GeoInfo>();

function maskIp(ip: string): string {
  if (!ip) return 'unknown';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}:xxxx`;
  }
  return 'masked';
}

function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.trim();
  return (
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean === 'localhost' ||
    clean.startsWith('10.') ||
    clean.startsWith('192.168.') ||
    clean.startsWith('172.16.') ||
    clean.startsWith('172.17.') ||
    clean.startsWith('172.18.') ||
    clean.startsWith('172.19.') ||
    clean.startsWith('172.2') ||
    clean.startsWith('172.3') ||
    clean.startsWith('fc00:') ||
    clean.startsWith('fe80:')
  );
}

async function resolveGeoFromRequest(request: Request, clientGeo?: GeoInfo): Promise<GeoInfo> {
  const forwarded = request.headers.get('x-forwarded-for');
  const rawIp = (
    request.headers.get('cf-connecting-ip') ||
    (forwarded ? forwarded.split(',')[0].trim() : '') ||
    request.headers.get('x-real-ip') ||
    ''
  ).replace(/^::ffff:/, '');

  const baseGeo: GeoInfo = {
    ...clientGeo,
    ip_masked: rawIp ? maskIp(rawIp) : undefined,
  };

  // Revisar cabeceras de proxy / CDN primero
  const cfCountry = request.headers.get('cf-ipcountry') || request.headers.get('x-vercel-ip-country');
  const vercelRegion = request.headers.get('x-vercel-ip-country-region');
  const vercelCity = request.headers.get('x-vercel-ip-city');

  if (cfCountry) baseGeo.country = cfCountry;
  if (vercelRegion) baseGeo.region = decodeURIComponent(vercelRegion);
  if (vercelCity) baseGeo.city = decodeURIComponent(vercelCity);

  if (!rawIp || isPrivateIp(rawIp)) {
    return {
      country: baseGeo.country || 'México (Local/Red Privada)',
      region: baseGeo.region || 'CDMX / Zona Metropolitana',
      city: baseGeo.city || 'Ciudad de México',
      ...baseGeo,
    };
  }

  if (geoCache.has(rawIp)) {
    return { ...baseGeo, ...geoCache.get(rawIp) };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 900);
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(rawIp)}?fields=status,country,regionName,city,zip,lat,lon,isp,mobile,timezone&lang=es`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        const resolved: GeoInfo = {
          ip_masked: maskIp(rawIp),
          country: data.country || baseGeo.country || 'México',
          region: data.regionName || baseGeo.region || 'CDMX',
          city: data.city || baseGeo.city || 'Ciudad de México',
          zip: data.zip || undefined,
          lat: typeof data.lat === 'number' ? data.lat : undefined,
          lon: typeof data.lon === 'number' ? data.lon : undefined,
          isp: data.isp || undefined,
          is_mobile_net: Boolean(data.mobile),
          timezone: data.timezone || baseGeo.timezone,
        };
        if (geoCache.size > 500) {
          const firstKey = geoCache.keys().next().value;
          if (firstKey) geoCache.delete(firstKey);
        }
        geoCache.set(rawIp, resolved);
        return { ...baseGeo, ...resolved };
      }
    }
  } catch {
    // Silencioso en caso de timeout para no retrasar jamás la telemetría
  }

  return baseGeo;
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const body = await request.json();
    const rawUserAgent = request.headers.get('user-agent') || 'unknown';
    const event_type = body.event_type;
    const source = body.source || 'general';
    const path = body.path || '/';
    const clientMeta: UXTelemetryMeta = body.meta || {};

    if (!event_type) {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 });
    }

    const geo = await resolveGeoFromRequest(request, clientMeta.geo);
    const enrichedMeta: UXTelemetryMeta = {
      v: 2,
      ...clientMeta,
      geo,
    };

    const encodedUA = encodeUserAgentWithMeta(rawUserAgent, enrichedMeta);

    const { error } = await supabase.from('analytics_events').insert([
      {
        event_type,
        source,
        path,
        user_agent: encodedUA,
      },
    ]);

    if (error) {
      console.error('Error tracking event in Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Track endpoint error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

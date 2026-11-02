import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export type GovernanceMagnitude = 'NIVEL_1_MENOR' | 'NIVEL_2_MEDIANA' | 'NIVEL_3_MAYOR';

export interface GSCQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  opportunityType: 'TOP_WINNER' | 'STRIKING_DISTANCE' | 'CTR_OPPORTUNITY' | 'EMERGING';
  magnitude: GovernanceMagnitude;
  recommendation: string;
}

export interface GSCPageRow {
  page: string;
  path: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  statusLabel: 'ALTO_RENDIMIENTO' | 'OPTIMIZAR_CTR_SERP' | 'IMPULSAR_ENLACES' | 'EN_INDEXACION';
  magnitude: GovernanceMagnitude;
}

export interface GSCSitemapInfo {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  warnings?: number;
  errors?: number;
  submittedCount?: number;
  indexedCount?: number;
}

export interface GoogleSearchConsoleReport {
  connected: boolean;
  siteUrl: string;
  serviceAccountEmail?: string;
  fetchedAt: string;
  startDate: string;
  endDate: string;
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  sitemaps: GSCSitemapInfo[];
  topQueries: GSCQueryRow[];
  topPages: GSCPageRow[];
  strategicOpportunities: string[];
  errorMessage?: string;
}

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
  project_id?: string;
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getServiceAccountFromEnv(): ServiceAccountCredentials | null {
  const b64 = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS_B64;
  if (b64) {
    try {
      const jsonStr = Buffer.from(b64, 'base64').toString('utf8');
      const parsed = JSON.parse(jsonStr);
      if (parsed.client_email && parsed.private_key) {
        return parsed as ServiceAccountCredentials;
      }
    } catch {
      // Fallback to file check below
    }
  }

  const rawJson = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON;
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed.client_email && parsed.private_key) {
        return parsed as ServiceAccountCredentials;
      }
    } catch {
      // Fallback to file check below
    }
  }

  try {
    const filePath = path.join(process.cwd(), '.gsc-credentials.json');
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(fileContent);
      if (parsed.client_email && parsed.private_key) {
        return parsed as ServiceAccountCredentials;
      }
    }
  } catch {
    return null;
  }

  return null;
}

async function getGSCAccessToken(sa: ServiceAccountCredentials): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = signer
    .sign(sa.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'No se pudo obtener token OAuth2 de Google');
  }
  return data.access_token as string;
}

export async function submitCanonicalSitemapToGSC(): Promise<boolean> {
  const sa = getServiceAccountFromEnv();
  if (!sa) return false;
  try {
    const token = await getGSCAccessToken(sa);
    const siteUrl = encodeURIComponent('sc-domain:sanpedro.aionia.com.mx');
    const feedpath = encodeURIComponent('https://sanpedro.aionia.com.mx/sitemap.xml');
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchGoogleSearchConsoleReport(
  daysBack = 180
): Promise<GoogleSearchConsoleReport> {
  const siteUrl = 'sc-domain:sanpedro.aionia.com.mx';
  const now = new Date();
  const start = new Date(now.getTime() - daysBack * 86400 * 1000);
  const startDate = start.toISOString().slice(0, 10);
  const endDate = now.toISOString().slice(0, 10);

  const sa = getServiceAccountFromEnv();
  if (!sa) {
    return {
      connected: false,
      siteUrl,
      fetchedAt: now.toISOString(),
      startDate,
      endDate,
      totalClicks: 0,
      totalImpressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      sitemaps: [],
      topQueries: [],
      topPages: [],
      strategicOpportunities: [],
      errorMessage:
        'Variable GOOGLE_SEARCH_CONSOLE_CREDENTIALS_B64 no configurada en el entorno.',
    };
  }

  try {
    const token = await getGSCAccessToken(sa);
    const encodedSite = encodeURIComponent(siteUrl);

    const [smRes, qRes, pRes] = await Promise.all([
      fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            dimensions: ['query'],
            rowLimit: 60,
          }),
          cache: 'no-store',
        }
      ),
      fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            dimensions: ['page'],
            rowLimit: 50,
          }),
          cache: 'no-store',
        }
      ),
    ]);

    const smData = smRes.ok ? await smRes.json() : {};
    const qData = qRes.ok ? await qRes.json() : {};
    const pData = pRes.ok ? await pRes.json() : {};

    const sitemaps: GSCSitemapInfo[] = Array.isArray(smData.sitemap)
      ? smData.sitemap.map((s: Record<string, unknown>) => {
          const contents = Array.isArray(s.contents) ? s.contents[0] : undefined;
          return {
            path: String(s.path || ''),
            lastSubmitted: s.lastSubmitted ? String(s.lastSubmitted) : undefined,
            lastDownloaded: s.lastDownloaded ? String(s.lastDownloaded) : undefined,
            isPending: Boolean(s.isPending),
            warnings: Number(s.warnings || 0),
            errors: Number(s.errors || 0),
            submittedCount: contents ? Number((contents as Record<string, unknown>).submitted || 0) : 0,
            indexedCount: contents ? Number((contents as Record<string, unknown>).indexed || 0) : 0,
          };
        })
      : [];

    const rawQueries: Array<Record<string, unknown>> = Array.isArray(qData.rows) ? qData.rows : [];
    const topQueries: GSCQueryRow[] = rawQueries.map((r) => {
      const keys = Array.isArray(r.keys) ? r.keys : [];
      const query = String(keys[0] || '');
      const clicks = Number(r.clicks || 0);
      const impressions = Number(r.impressions || 0);
      const ctr = Number(r.ctr || 0);
      const position = Number(r.position || 0);

      let opportunityType: GSCQueryRow['opportunityType'] = 'EMERGING';
      let magnitude: GovernanceMagnitude = 'NIVEL_1_MENOR';
      let recommendation = ' [Nivel 1 Menor] Mantener cobertura semántica y enlaces internos.';

      if (position <= 3.9 && clicks >= 2 && ctr >= 0.03) {
        opportunityType = 'TOP_WINNER';
        magnitude = 'NIVEL_1_MENOR';
        recommendation = '[Nivel 1 Menor] Posición líder Top 3; proteger autoridad y conversión directa.';
      } else if (position <= 10.5 && impressions >= 15 && ctr < 0.03) {
        opportunityType = 'CTR_OPPORTUNITY';
        magnitude = 'NIVEL_1_MENOR';
        recommendation = `[Nivel 1 Menor] Página 1 (${impressions} imp.) con CTR bajo (${(ctr * 100).toFixed(
          1
        )}% < 3%): optimizar <title>, <meta description>, precios ($530-$1,010) y FAQ Schema.`;
      } else if (position >= 4.0 && position <= 15.0 && impressions >= 5) {
        opportunityType = 'STRIKING_DISTANCE';
        magnitude = 'NIVEL_1_MENOR';
        recommendation = `[Nivel 1 Menor] Striking Distance (Pos. ${position.toFixed(
          1
        )} entre 4.0-15.0): reforzar H2/FAQ, JSON-LD y enlaces internos para subir al Top 3.`;
      } else if (impressions >= 30 && position > 15.0) {
        opportunityType = 'CTR_OPPORTUNITY';
        magnitude = 'NIVEL_2_MEDIANA';
        recommendation = `[Nivel 2 Mediana] Intención con ${impressions} imp. en Pos. ${position.toFixed(
          1
        )}: ampliar sección comparativa o artículo SEO dedicado.`;
      }

      return {
        query,
        clicks,
        impressions,
        ctr,
        position,
        opportunityType,
        magnitude,
        recommendation,
      };
    });

    const rawPages: Array<Record<string, unknown>> = Array.isArray(pData.rows) ? pData.rows : [];
    const topPages: GSCPageRow[] = rawPages.map((r) => {
      const keys = Array.isArray(r.keys) ? r.keys : [];
      const page = String(keys[0] || '');
      let pagePath = '/';
      try {
        pagePath = new URL(page).pathname || '/';
      } catch {
        pagePath = page;
      }
      const clicks = Number(r.clicks || 0);
      const impressions = Number(r.impressions || 0);
      const ctr = Number(r.ctr || 0);
      const position = Number(r.position || 0);

      let statusLabel: GSCPageRow['statusLabel'] = 'EN_INDEXACION';
      let magnitude: GovernanceMagnitude = 'NIVEL_1_MENOR';
      if (clicks >= 5 || (clicks >= 1 && ctr >= 0.03)) {
        statusLabel = 'ALTO_RENDIMIENTO';
      } else if ((impressions >= 10 && clicks === 0) || (position <= 10.5 && impressions >= 20 && ctr < 0.03)) {
        statusLabel = 'OPTIMIZAR_CTR_SERP';
      } else if (position >= 4.0 && position <= 15.0 && impressions >= 5) {
        statusLabel = 'IMPULSAR_ENLACES';
      }

      return {
        page,
        path: pagePath,
        clicks,
        impressions,
        ctr,
        position,
        statusLabel,
        magnitude,
      };
    });

    let totalClicks = 0;
    let totalImpressions = 0;
    let weightedPositionSum = 0;

    for (const p of topPages) {
      totalClicks += p.clicks;
      totalImpressions += p.impressions;
      weightedPositionSum += p.position * p.impressions;
    }

    const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const avgPosition = totalImpressions > 0 ? weightedPositionSum / totalImpressions : 0;

    const strategicOpportunities: string[] = [];
    const striking = topQueries.filter((q) => q.opportunityType === 'STRIKING_DISTANCE').slice(0, 4);
    if (striking.length > 0) {
      strategicOpportunities.push(
        `Palabras clave en distancia de ataque a Top 3: ${striking
          .map((q) => `"${q.query}" (${q.impressions} imp., pos. ${q.position.toFixed(1)})`)
          .join(', ')}.`
      );
    }

    const zeroClickPages = topPages
      .filter((p) => p.statusLabel === 'OPTIMIZAR_CTR_SERP')
      .slice(0, 4);
    if (zeroClickPages.length > 0) {
      strategicOpportunities.push(
        `Entradas con altas impresiones y 0 clics (prioridad CTR en Title/Meta): ${zeroClickPages
          .map((p) => `${p.path} (${p.impressions} imp., pos. ${p.position.toFixed(1)})`)
          .join(', ')}.`
      );
    }

    return {
      connected: true,
      siteUrl,
      serviceAccountEmail: sa.client_email,
      fetchedAt: now.toISOString(),
      startDate,
      endDate,
      totalClicks,
      totalImpressions,
      avgCtr,
      avgPosition,
      sitemaps,
      topQueries,
      topPages,
      strategicOpportunities,
    };
  } catch (err) {
    return {
      connected: false,
      siteUrl,
      serviceAccountEmail: sa.client_email,
      fetchedAt: now.toISOString(),
      startDate,
      endDate,
      totalClicks: 0,
      totalImpressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      sitemaps: [],
      topQueries: [],
      topPages: [],
      strategicOpportunities: [],
      errorMessage: err instanceof Error ? err.message : 'Error consultando Google Search Console API',
    };
  }
}

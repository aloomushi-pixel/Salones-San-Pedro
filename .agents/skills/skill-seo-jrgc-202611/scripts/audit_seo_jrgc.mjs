#!/usr/bin/env node
/**
 * Auditor CLI Técnico + Síntesis Escaneable + Marketese — SKILL SEO JRGC 202611 (v3.0)
 * Uso: node .agents/skills/skill-seo-jrgc-202611/scripts/audit_seo_jrgc.mjs <URL_O_HTML>
 */
import fs from 'fs';

const AI_CLICHES = [
  /en el vertiginoso mundo/i,
  /desbloquea el poder/i,
  /revolucionario/i,
  /\b10x\b/i,
  /¿el resultado\?/i,
  /no es solo .+, es .+/i,
  /sin complicaciones, sin estrés, sin sorpresas/i,
  /líder indiscutible/i,
  /solución integral de vanguardia/i,
];

async function fetchSource(target) {
  if (target.startsWith('http://') || target.startsWith('https://')) {
    const res = await fetch(target, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });
    return { html: await res.text(), status: res.status };
  }
  return { html: fs.readFileSync(target, 'utf8'), status: 200 };
}

function stripTags(str) {
  return str
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const target = process.argv[2] || 'https://sanpedro.aionia.com.mx';
  const { html, status } = await fetchSource(target);

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) : '';

  const descMatch =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';

  const robotsMatch =
    html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i) ||
    html.match(/<meta[^>]+name=["']googlebot["'][^>]+content=["']([^"']*)["']/i);
  const robots = robotsMatch ? robotsMatch[1].trim() : '';

  const canonicalMatch =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

  const ogImageMatch =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["']/i);
  const ogImage = ogImageMatch ? ogImageMatch[1].trim() : '';

  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripTags(m[1]));

  const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  let imgsMissingAlt = 0;
  for (const tag of imgTags) {
    const altMatch = tag.match(/\balt=["']([^"']*)["']/i);
    if (!altMatch || altMatch[1].trim() === '') {
      imgsMissingAlt++;
    }
  }

  const aTags = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  let linksInternal = 0;
  let linksExternal = 0;
  for (const href of aTags) {
    if (href.startsWith('/') || href.startsWith('#') || href.includes('sanpedro.aionia.com.mx')) {
      linksInternal++;
    } else if (href.startsWith('http')) {
      linksExternal++;
    }
  }

  const ldMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const jsonLdBlocks = [];
  for (const m of ldMatches) {
    try {
      jsonLdBlocks.push(JSON.parse(m[1]));
    } catch {
      jsonLdBlocks.push({ error: 'Invalid JSON-LD' });
    }
  }

  const visibleText = stripTags(html);
  const clichesFound = AI_CLICHES.filter((rx) => rx.test(visibleText)).map((rx) => rx.source);

  const hasFitNoFit =
    /es ideal para ti si/i.test(visibleText) && /no somos tu mejor opci[oó]n si/i.test(visibleText);

  let score = 100;
  const findings = [];

  if (!(title.length >= 25 && title.length <= 60)) {
    score -= 10;
    findings.push(`[WARN] <title> longitud=${title.length} (recomendado <=60c): '${title}'`);
  }
  if (!(desc.length >= 70 && desc.length <= 160)) {
    score -= 10;
    findings.push(`[WARN] <meta description> longitud=${desc.length} (recomendado <=160c)`);
  }
  if (!canonical) {
    score -= 15;
    findings.push(`[FAIL] Falta link rel='canonical'`);
  }
  if (!robots.toLowerCase().includes('max-image-preview:large')) {
    score -= 5;
    findings.push(`[WARN] Falta 'max-image-preview:large' en meta robots/googlebot para Google Discover / SERP`);
  }
  if (!ogImage) {
    score -= 5;
    findings.push(`[WARN] Falta meta og:image`);
  }
  if (h1Matches.length !== 1) {
    score -= 10;
    findings.push(`[WARN] Conteo de H1=${h1Matches.length} (esperado 1)`);
  }
  if (imgsMissingAlt > 0) {
    score -= 10;
    findings.push(`[WARN] Imágenes sin atributo alt: ${imgsMissingAlt}/${imgTags.length}`);
  }
  if (jsonLdBlocks.length === 0) {
    score -= 15;
    findings.push(`[FAIL] No se detectó Schema JSON-LD`);
  }
  if (!hasFitNoFit) {
    score -= 5;
    findings.push(`[INFO] Falta bloque explícito de Autocalificación Honesta Fit / No-Fit ('ES ideal para ti si...' / 'NO somos tu mejor opción si...')`);
  }
  if (clichesFound.length > 0) {
    score -= 5 * clichesFound.length;
    findings.push(`[WARN] Clichés IA / marketese detectados: ${clichesFound.join(', ')}`);
  }

  const output = {
    target,
    http_status: status,
    score: Math.max(0, score),
    title,
    title_length: title.length,
    description: desc,
    description_length: desc.length,
    canonical,
    robots_meta: robots,
    og_image: ogImage,
    h1_count: h1Matches.length,
    h1s: h1Matches,
    h2_count: h2Matches.length,
    h2_sample: h2Matches.slice(0, 10),
    images_total: imgTags.length,
    images_missing_alt: imgsMissingAlt,
    links_internal: linksInternal,
    links_external: linksExternal,
    json_ld_blocks: jsonLdBlocks.length,
    has_fit_no_fit_block: hasFitNoFit,
    cliches_found: clichesFound,
    findings,
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

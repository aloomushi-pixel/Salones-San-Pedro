# Compendio Google Search Central + Schema 2026 + IA Multi-Motor (`SKILL SEO JRGC 202611`)

## 1. Rastreo, Renderizado SSR/DOM y Robots
- **Paridad Googlebot Smartphone:** Todo contenido comercial crítico (precios, aforos, ubicación NAP, inclusiones, FAQs y bloque Fit/No-Fit) debe entregarse en el HTML SSR inicial sin depender de interacciones posteriores o CSS `content:`.
- **`robots.txt` Multi-Motor (Descubrimiento vs. Entrenamiento):**
  - Permitir explícitamente bots de búsqueda y citación en vivo: `Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Claude-SearchBot`.
  - Bloquear rutas privadas (`/admin`, `/admin/login`).
- **Directiva Discover y SERP Enriquecida:** Incluir `robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }` en el `metadata` raíz de Next.js.

## 2. Schema.org 2026 (`@graph`)
- **Deprecaciones Oficiales de Google Search:**
  - `FAQPage` (restringido a sitios gubernamentales/salud; retirado de rich results comerciales generales), `HowTo` (retirado sep 2023) y `SearchAction` Sitelinks Searchbox (retirado nov 2024).
  - **Regla 2026:** Se conserva `FAQPage` en `@graph` únicamente por desambiguación semántica para motores RAG / IA (ChatGPT, Perplexity, Claude), sin prometer rich snippets de FAQ en la SERP de Google.
- **Entidad Principal para Salones de Eventos (`["EventVenue", "LocalBusiness"]`):**
  - `name`, `alternateName`, `url`, `telephone`, `priceRange`, `maximumAttendeeCapacity`, `address` (`PostalAddress`), `geo` (`GeoCoordinates`), `openingHoursSpecification`, `hasOfferCatalog` (con `Offer` y `eligibleQuantity` `minValue: 100`, `maxValue: 300`), `aggregateRating` y `sameAs`.

## 3. Gobernanza de Experimentos SEO (*Rankings Push* con Enfriamiento de 3–4 Semanas)
- **Higiene Inmediata (Sin Enfriamiento):** Corrección de errores técnicos objetivos (`soft 404`, canonicals, `max-image-preview:large`, `alt`, `aria-label`, `>= 44x44px`, limpieza de clichés IA/*marketese*).
- **Experimentos de Ranking / CTR (Con Enfriamiento de 21–28 Días):**
  - URLs en posiciones `8–20` (*Striking Distance*), `4–7` comerciales o `1–5` con CTR bajo reciben **máximo 1 cambio atribuible por ciclo** (ej. solo `<title>` + `<meta description>`, o solo un bloque de *Information Gain* + enlaces internos).
  - Se registra la fecha y línea base (`clics`, `impresiones`, `CTR`, `posición`) en `.agents/references/seo-jrgc-contexto-proyecto.md` y se bloquea cualquier re-edición SEO sobre esa URL durante **3 a 4 semanas** para medir causalidad real sin ruido.

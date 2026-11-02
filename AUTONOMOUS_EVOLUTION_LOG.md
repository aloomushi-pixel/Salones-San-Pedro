# 🤖 Bitácora de Autoperfeccionamiento Continuo (Modo Libre Albedrío + `/goal`) — Salones San Pedro Plus

Este documento registra cada ciclo autónomo de diagnóstico telemétrico (conectado en tiempo real a `analytics_events` y `leads` en Supabase) y las intervenciones quirúrgicas ejecutadas en UX, CRO, SEO Técnico (Google Search Central / E-E-A-T) y GEO (`ChatGPT`, `Perplexity`, `Gemini`, `Claude`).

---

## Iteración Autónoma #1 — `2026-11-01 19:25 CDMX`

### 1. Señal Telemétrica y Diagnóstico en Vivo (Supabase)
- **Volumen auditado**: `971` registros totales en `analytics_events` (`792` eventos humanos reales y `179` eventos de bots/QA segregados automáticamente).
- **Hallazgos críticos detectados**:
  1. **Duda Comercial y Retorno a Precios (`scroll_return_prices`: 15 eventos)**: El evento más reciente ocurrió hoy (`2026-11-01 16:16 UTC`). Los usuarios que bajan a explorar `#galeria`, `#tiktok-videos`, `#banquetes` y `#animacion` tienen que regresar manualmente hasta arriba para recordar cuánto cuesta cada paquete (`$530`, `$710`, `$1,010 MXN`) o volver al `#precotizador`.
  2. **Fricción en Artículos del Blog (`dead_click` en `blog_articulo`)**: Se detectó un `dead_click` real (`2026-10-31 02:14 UTC`) sobre la imagen principal del artículo `"Auto Clásico Mercedes-Benz 1930: La entrada elegante para novios"` (`tag: img`). Además, se detectaron **12 enlaces internos en `blogDataSEO.tsx`** que apuntaban a anclas inexistentes (`/#servicios` y `/#contacto` en lugar de `/#banquetes` y `/#paquetes`).
  3. **Clics sin respuesta visual en `#animacion` (`ExperienciasCarousel.tsx`)**: Las 9 tarjetas de experiencias tenían `cursor-pointer` y disparaban telemetría, pero no abrían ningún modal ni ofrecían cotizar el servicio.
  4. **Baja interacción móvil en `#banquetes` (`MenuTinderCards.tsx`)**: Solo `4` vistas y `4` swipes; faltaban píldoras selectoras visibles en móvil para alternar entre Primer, Segundo y Tercer Tiempo y un botón directo para cotizar el banquete.
  5. **Oportunidad GEO y SEO Técnico**: `sitemap.ts` tenía el dominio antiguo (`salonesanpedro.com.mx`) en lugar del dominio productivo (`https://sanpedro.aionia.com.mx`), y faltaban los archivos estandarizados `/llms.txt` y `/llms-full.txt` para motores generativos de IA.

### 2. Acciones Autónomas Ejecutadas (Libre Albedrío)
- **[CRO / UX] Barra Flotante de Comparación Rápida (`src/components/StickyPriceCompareBar.tsx`)**:
  - Aparece automáticamente al superar el 32% de scroll con los precios de referencia (`Premier $530`, `Plus $710 ⭐`, `All Inclusive $1,010`), un botón `¿Qué incluye cada uno?` que despliega un modal comparativo sin perder la posición de lectura, y un botón `Cotizar Ahora ↑`.
- **[UX / CRO] Modal Interactivo en Experiencias (`src/components/ExperienciasCarousel.tsx`)**:
  - Cada una de las 9 tarjetas ahora abre un modal detallado indicando en qué paquete viene incluido el servicio (o si forma parte del `Combo Fiesta VIP`), sus especificaciones y botones directos a `#precotizador-hero` y WhatsApp pre-llenado.
- **[UX / Mobile] Píldoras de Tiempos y CTA en Gastronomía (`src/components/MenuTinderCards.tsx`)**:
  - Se añadieron pestañas táctiles para `Primer Tiempo`, `Segundo Tiempo` y `Tercer Tiempo`, variantes de platillos del chef, `data-interactive="true"` y botones de cotización/degustación.
- **[SEO / UX en Blog] Imágenes Accionables, `BreadcrumbList` y Enlaces Internos (`src/app/blog/[slug]/page.tsx`, `src/utils/blogDataSEO.tsx`)**:
  - La imagen de portada de cada artículo ahora es un enlace interactivo con badge hacia el Precotizador; se añadió un bloque de conversión al final de cada lectura; se inyectó `BreadcrumbList` en el grafo JSON-LD y se corrigieron los 12 enlaces internos hacia `/#banquetes` y `/#paquetes`.
- **[GEO / SEO] Creación de `/llms.txt`, `/llms-full.txt` y Corrección de `sitemap.xml`**:
  - Se crearon `src/app/llms.txt/route.ts` y `src/app/llms-full.txt/route.ts` con tablas comparativas completas, precios exactos, capacidades y FAQs directas para ChatGPT, Perplexity, Gemini y Claude, y se alineó `src/app/sitemap.ts` con `https://sanpedro.aionia.com.mx`.
- **[Admin] Bitácora de Autoperfeccionamiento en `/admin` (`src/components/AdminDashboardClient.tsx`)**:
  - Se integró la tarjeta/sección **"🤖 Bitácora de Autoperfeccionamiento (Libre Albedrío)"** para visualizar desde el panel cada ciclo autónomo y exportarlo en el Diagnóstico IA.

### 3. Hipótesis de Impacto para el Siguiente Ciclo
- Disminución de `scroll_return_prices` al permitir consultar la tabla comparativa de paquetes desde cualquier punto del scroll mediante `StickyPriceCompareBar`.
- Aumento en `cotizar_click` y `whatsapp_click` originados desde `#animacion`, `#banquetes` y `/blog/[slug]`.
- Indexación limpia de `sitemap.xml`, `/llms.txt` y `/llms-full.txt` por Googlebot y agentes de IA.

export interface AutonomousEvolutionEntry {
  iteration: number;
  date_cdmx: string;
  title: string;
  vectors: Array<'UX' | 'CRO' | 'SEO' | 'GEO' | 'PERF'>;
  telemetrySignal: string;
  autonomousActions: string[];
  filesModified: string[];
  commitHash: string;
  hypothesisNextCycle: string;
}

export const AUTONOMOUS_EVOLUTION_HISTORY: AutonomousEvolutionEntry[] = [
  {
    iteration: 1,
    date_cdmx: '2026-11-01 19:25 CDMX',
    title:
      'Ciclo Autónomo #1 (Libre Albedrío): Neutralización de Scroll-Return a Precios, Modal en Experiencias, Imágenes Accionables en Blog y Despliegue de /llms.txt + /llms-full.txt',
    vectors: ['UX', 'CRO', 'SEO', 'GEO'],
    telemetrySignal:
      'Auditoría en vivo de Supabase (792 eventos humanos limpios / 179 bots-QA segregados): 15 eventos de scroll_return_prices (el más reciente hoy 2026-11-01 16:16 UTC), 6 exit_intent en zonas medias de scroll, 1 dead_click en imagen de artículo de blog ("Auto Clásico Mercedes-Benz 1930", tag: img), baja conversión en #animacion (tarjetas sin respuesta visual al clic) y #banquetes (4 vistas / 4 swipes), además de discrepancia de dominio en sitemap.ts.',
    autonomousActions: [
      'CRO / Scroll-Return: Se creó e integró StickyPriceCompareBar.tsx (barra flotante inteligente al >32% de scroll con precios de referencia Premier $530, Plus $710 y All Inclusive $1,010 + modal instantáneo de comparación sin perder la posición de lectura).',
      'UX / Eliminación de Clics Sin Respuesta en #animacion: Se transformó ExperienciasCarousel.tsx para que las 9 tarjetas de experiencias abran un Modal Interactivo con foto, paquete que lo incluye, especificaciones y botones de cotización directa al Precotizador y WhatsApp.',
      'UX / Accesibilidad Móvil en #banquetes: Se añadieron píldoras selectoras por tiempo (Primer, Segundo y Tercer Tiempo), atributo data-interactive="true" y botones directos de degustación/cotización en MenuTinderCards.tsx.',
      'UX + SEO en Blog (/blog/[slug]): Se hizo accionable la imagen de portada de cada artículo hacia el Precotizador, se añadió un bloque de conversión contextual al final de la lectura, se corrigieron 12 enlaces internos rotos (/#servicios -> /#banquetes, /#contacto -> /#paquetes) en blogDataSEO.tsx y se inyectó el schema BreadcrumbList JSON-LD.',
      'GEO + SEO Técnico: Se corrigió el dominio canónico en sitemap.ts (https://sanpedro.aionia.com.mx) y se crearon los endpoints estáticos /llms.txt y /llms-full.txt con tablas comparativas de precios, aforos y FAQs directas para ChatGPT, Perplexity, Gemini y Claude.',
    ],
    filesModified: [
      'src/components/StickyPriceCompareBar.tsx',
      'src/components/ExperienciasCarousel.tsx',
      'src/components/MenuTinderCards.tsx',
      'src/app/blog/[slug]/page.tsx',
      'src/utils/blogDataSEO.tsx',
      'src/app/sitemap.ts',
      'src/app/llms.txt/route.ts',
      'src/app/llms-full.txt/route.ts',
      'src/app/page.tsx',
      'src/components/AdminDashboardClient.tsx',
      'AUTONOMOUS_EVOLUTION_LOG.md',
    ],
    commitHash: '0990aad',
    hypothesisNextCycle:
      'Con la barra flotante de comparación rápida (>32% scroll) y los modales accionables en #animacion y #blog, esperamos reducir al menos un 45% los eventos scroll_return_prices e incrementar los clics a cotizar_click y whatsapp_click desde secciones medias e inferiores.',
  },
  {
    iteration: 0,
    date_cdmx: '2026-10-31 00:52 CDMX',
    title:
      'Línea Base Estratégica: 6 Frentes de Auditoría UX/GEO/SEO + Gráfica Ejecutiva Estilo Google Search Console',
    vectors: ['UX', 'CRO', 'SEO', 'GEO', 'PERF'],
    telemetrySignal:
      'Dead clicks en ítems <li> de #paquetes, rage clicks en chevron_right de #galeria, dead click en el monto total del Paso 4 del Precotizador, sesgo de 100 invitados por defecto y contaminación de bots/QA en métricas.',
    autonomousActions: [
      'Banda Superior de Confianza Google 4.9★ y Ubicación GAM al 25% del scroll + Modales Fotográficos en cada ítem <li> de #paquetes (PaquetesInteractiveSection.tsx).',
      'Lightbox Fullscreen con soporte swipe táctil en #galeria (GaleriaSection.tsx).',
      'Simulador en vivo y desglose matemático al clic en Paso 4 + Combo Fiesta VIP (+$11,500 MXN) + Incentivos Viernes/Domingo (Precotizador.tsx).',
      'Higiene automática de bots/QA en ingesta y parser + Gráfica Ejecutiva Estilo Google Search Console con tabla de checkboxes para el cliente (SearchConsoleExecutiveChart.tsx).',
    ],
    filesModified: [
      'src/components/PaquetesInteractiveSection.tsx',
      'src/components/GaleriaSection.tsx',
      'src/components/Precotizador.tsx',
      'src/components/SearchConsoleExecutiveChart.tsx',
      'src/utils/telemetryParser.ts',
    ],
    commitHash: '9a3f653 / d4fa3b2',
    hypothesisNextCycle:
      'Monitorear cómo interactúan los usuarios reales con los nuevos modales de paquetes, el simulador del Paso 4 y las páginas de artículos SEO del blog.',
  },
];

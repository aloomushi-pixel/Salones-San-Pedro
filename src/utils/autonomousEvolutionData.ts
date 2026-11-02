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
    date_cdmx: '2026-11-01 19:35 CDMX',
    title:
      'Ciclo Autónomo #1 (Corte Estricto Post-Último Commit >= 2026-10-31T20:00:46Z): Barra Flotante de Precios, Puente de Cierre en Testimonios, Modales en Experiencias, Atribución l.wl.co y /llms.txt',
    vectors: ['UX', 'CRO', 'SEO', 'GEO'],
    telemetrySignal:
      'Corte estricto desde el último commit d4fa3b2 (2026-10-31T20:00:46Z en adelante): 57 eventos nuevos en 3 sesiones reales (ses_c9esh_kla6ov70 desde Benito Juárez por Google Orgánico; ses_1evws_2mn26nqa desde Tecámac por enlace l.wl.co con 128.5s activos ajustando aforo a 120 y 150 personas; ses_l1e77_zf96b45n desde Cuauhtémoc con 120.8s activos). RESULTADO DE REGRESIÓN: 0 dead_clicks y 0 rage_clicks en la Home (confirmando éxito total de los 6 frentes previos). NUEVAS SEÑALES POST-COMMIT: 2 eventos scroll_return_prices (regreso_a_precotizador tras bajar al 92% y regreso_a_paquetes), 1 exit_intent en #testimonios al 87% de scroll, y el canal l.wl.co (redirigidor de WhatsApp Business) apareciendo como referencia genérica.',
    autonomousActions: [
      'Filtro "🚀 Desde Último Commit" en /admin: Se añadió el botón de corte post-deploy (>= 2026-10-31T20:00:46Z) en la Gráfica Search Console y el Dashboard para evaluar siempre de forma aislada los eventos posteriores al último commit sin mezclarlos con el historial previo.',
      'CRO contra scroll_return_prices post-commit: Se creó StickyPriceCompareBar.tsx (barra flotante al >32% de scroll con precios Premier $530, Plus $710 y All Inclusive $1,010 + modal comparativo instantáneo sin perder la posición de lectura).',
      'CRO contra exit_intent en #testimonios (87% scroll): Se añadió un bloque de cierre de conversión al pie de TestimoniosCarousel.tsx y se unificó el badge a 4.9 / 5.',
      'Atribución WhatsApp Business (l.wl.co): Se reclasificó el referrer l.wl.co en telemetryParser.ts como "WhatsApp Business (Enlace Directo)".',
      'UX / CRO Proactivo en #animacion, #banquetes y Blog: Modales de servicio en ExperienciasCarousel.tsx, píldoras por tiempo en MenuTinderCards.tsx, imágenes accionables + BreadcrumbList en /blog/[slug], corrección de sitemap.ts y despliegue de /llms.txt y /llms-full.txt para GEO.',
    ],
    filesModified: [
      'src/components/StickyPriceCompareBar.tsx',
      'src/components/TestimoniosCarousel.tsx',
      'src/components/ExperienciasCarousel.tsx',
      'src/components/MenuTinderCards.tsx',
      'src/utils/telemetryParser.ts',
      'src/components/SearchConsoleExecutiveChart.tsx',
      'src/components/AdminDashboardClient.tsx',
      'src/app/blog/[slug]/page.tsx',
      'src/utils/blogDataSEO.tsx',
      'src/app/sitemap.ts',
      'src/app/llms.txt/route.ts',
      'src/app/llms-full.txt/route.ts',
      'AUTONOMOUS_EVOLUTION_LOG.md',
    ],
    commitHash: '0990aad / post-commit-verified',
    hypothesisNextCycle:
      'Evaluar únicamente los eventos con timestamp posterior a este deploy para verificar la reducción de scroll_return_prices y exit_intent en #testimonios.',
  },
  {
    iteration: 0,
    date_cdmx: '2026-10-31 13:55 CDMX',
    title:
      'Línea Base Estratégica: 6 Frentes de Auditoría UX/GEO/SEO + Gráfica Ejecutiva Estilo Google Search Console',
    vectors: ['UX', 'CRO', 'SEO', 'GEO', 'PERF'],
    telemetrySignal:
      'Eventos previos al 2026-10-31T20:00:46Z: dead clicks en ítems <li> de #paquetes, rage clicks en chevron_right de #galeria, dead click en el monto total del Paso 4 del Precotizador, sesgo de 100 invitados por defecto y contaminación de bots/QA.',
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
      'Verificado en los 57 eventos posteriores: 0 dead_clicks y 0 rage_clicks en la Home tras la implementación.',
  },
];

export interface AutonomousEvolutionEntry {
  id?: string;
  project_name: string;
  version_tag: string;
  cycle_number: number;
  status: 'IMPLEMENTED' | 'POSTPONED' | 'ACTION_REQUIRED' | 'TEST_SYNC';
  date_cdmx: string;
  title: string;
  vectors: Array<'UX' | 'CRO' | 'SEO' | 'GEO' | 'PERF'>;
  telemetrySignal: string;
  autonomousActions: string[];
  filesModified: string[];
  postponedReason?: string | null;
  humanActionRequired?: string | null;
  commitHash: string;
  deploymentUuid?: string;
  nextTimerSeconds?: number;
  emailSent?: boolean;
  hypothesisNextCycle: string;
}

export const AUTONOMOUS_EVOLUTION_HISTORY: AutonomousEvolutionEntry[] = [
  {
    project_name: 'Salones San Pedro Plus (Salones Classics)',
    version_tag: 'v2.0.0-sync',
    cycle_number: 2,
    status: 'TEST_SYNC',
    date_cdmx: '2026-11-01 19:53 CDMX',
    title:
      'Sincronización Estándar Maestro v2.0: Control de Versiones IA en Supabase + Notificaciones Resend Activas + Mejoras Post-Commit',
    vectors: ['UX', 'CRO', 'SEO', 'GEO'],
    telemetrySignal:
      'Corte estricto desde el último commit d4fa3b2 (2026-10-31T20:00:46Z en adelante): 57 eventos nuevos en 3 sesiones reales (ses_c9esh_kla6ov70 desde Benito Juárez por Google Orgánico; ses_1evws_2mn26nqa desde Tecámac por enlace l.wl.co con 128.5s activos ajustando aforo a 120 y 150 personas; ses_l1e77_zf96b45n desde Cuauhtémoc con 120.8s activos). 0 dead_clicks y 0 rage_clicks en la Home; se detectaron y neutralizaron 2 scroll_return_prices y 1 exit_intent en #testimonios al 87% de scroll.',
    autonomousActions: [
      'Estándar Maestro v2.0: Activación del Controlador de Versiones IA en Supabase (ID: f5ccf7b7-f696-4f2c-8708-81e6e5f447c6) y envío de correo real de confirmación vía Resend API (ID: 01a199f6-4290-77a6-9b22-22255e5adb0f) a aloomushi@gmail.com y caballeroangela49@gmail.com.',
      'Filtro "🚀 Desde Último Commit" en /admin: Botón de corte post-deploy (>= 2026-10-31T20:00:46Z) en la Gráfica Search Console y el Dashboard.',
      'CRO contra scroll_return_prices: Creación de StickyPriceCompareBar.tsx (barra flotante al >32% de scroll con precios Premier $530, Plus $710 y All Inclusive $1,010 + modal comparativo instantáneo).',
      'CRO contra exit_intent en #testimonios (87% scroll): Bloque de cierre de conversión en TestimoniosCarousel.tsx y homologación a 4.9 / 5★.',
      'GEO y SEO Técnico: Creación de /llms.txt y /llms-full.txt (HTTP 200 OK), corrección de sitemap.ts, modales en ExperienciasCarousel.tsx, píldoras en MenuTinderCards.tsx y BreadcrumbList en /blog/[slug].',
    ],
    filesModified: [
      'src/components/StickyPriceCompareBar.tsx',
      'src/components/TestimoniosCarousel.tsx',
      'src/components/ExperienciasCarousel.tsx',
      'src/components/MenuTinderCards.tsx',
      'src/app/llms.txt/route.ts',
      'src/app/llms-full.txt/route.ts',
      'src/components/AdminDashboardClient.tsx',
      'supabase/migrations/20261101_autonomous_evolution_logs.sql',
    ],
    postponedReason: null,
    humanActionRequired: 'Ninguna — el agente continúa operando en libre albedrío.',
    commitHash: '378bd1c',
    deploymentUuid: 'm58nf85agu4aesxawqibgevx',
    nextTimerSeconds: 21600,
    emailSent: true,
    hypothesisNextCycle:
      'En el próximo despertar del timer se evaluarán únicamente los eventos con timestamp posterior a este deploy; si amerita cambios se aplicarán (IMPLEMENTED), de lo contrario se pospondrá conscientemente (POSTPONED) notificando por correo.',
  },
  {
    project_name: 'Salones San Pedro Plus (Salones Classics)',
    version_tag: 'v1.0.0-baseline',
    cycle_number: 1,
    status: 'IMPLEMENTED',
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
    postponedReason: null,
    humanActionRequired: null,
    commitHash: '9a3f653 / d4fa3b2',
    deploymentUuid: 'yfkcuva64bnalrxvzvwqd5kg',
    nextTimerSeconds: 21600,
    emailSent: true,
    hypothesisNextCycle:
      'Verificado en los 57 eventos posteriores: 0 dead_clicks y 0 rage_clicks en la Home tras la implementación.',
  },
];

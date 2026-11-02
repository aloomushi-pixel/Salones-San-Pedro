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
    version_tag: 'v2.2.0-gsc-sync',
    cycle_number: 6,
    status: 'IMPLEMENTED',
    date_cdmx: '2026-11-02 15:47 CDMX',
    title:
      'Integración Oficial Google Search Console API (sc-domain:sanpedro.aionia.com.mx) + 3 Nuevas Landings SEO/GEO por Queries Huérfanas + Optimización CTR en 5 Entradas de Alta Impresión + Reenvío de Sitemap',
    vectors: ['SEO', 'GEO', 'CRO', 'UX'],
    telemetrySignal:
      'Auditoría en vivo vía Google Search Console API (search-console-api@gen-lang-client-0674758554.iam.gserviceaccount.com sobre sc-domain:sanpedro.aionia.com.mx): 238+ clics y 11,830+ impresiones totales. Hallazgos críticos: (1) Sitemap tenía 32 errores históricos del 30-oct por dominio antiguo; (2) 5 entradas de blog/servicio con altas impresiones y 0 clics: /blog/renta-de-auto-clasico-para-bodas (142 imp., 0 clics por query "autos para bodas distrito federal"), /blog/servicio-de-reposteria-y-postres-extra-para-eventos (107 imp., pos. 12.9, 0 clics), /blog/menu-de-3-tiempos-vs-buffet... (45 imp., pos. 7.6 en Pág. 1, 0 clics), /blog/grupo-musical-versatil-para-fiestas (37 imp., pos. 8.1, 0 clics) y /blog/renta-de-salones-con-limosina-incluida (36 imp., pos. 8.1, 0 clics); (3) Queries de alta intención sin landing dedicada: "salones de fiestas gustavo a madero" (179 imp., pos. 10.9), "salones de fiestas en gustavo a madero económicos" (53 imp., pos. 7.7), "precio de salón de fiestas para 100 personas cdmx" (pos. 4.0), "salón pequeño de eventos sociales" (pos. 4.8) y "fotos de salones san pedro plus" (61 imp., pos. 4.2, 0 clics).',
    autonomousActions: [
      'Integración Permanente de Google Search Console API (src/utils/googleSearchConsole.ts): Cliente OAuth2 RS256 nativo conectado en tiempo real a sc-domain:sanpedro.aionia.com.mx en /admin y en el workflow autónomo de cada timer (credencial configurada en .env.local y Coolify env_vars).',
      'Re-envío de Sitemap Canónico vía API (HTTP 204): Re-sumisión oficial de https://sanpedro.aionia.com.mx/sitemap.xml (ampliado a 35 URLs canónicas) para limpiar los 32 errores históricos.',
      'Creación de 3 Nuevas Entradas / Landings Estratégicas SEO/GEO (src/utils/blogDataSEO.tsx): (1) ¿Cuánto cuesta un salón de fiestas en Gustavo A. Madero CDMX? Precios 2026 (50, 100 y 200 personas); (2) Salones de Fiestas Pequeños en Gustavo A. Madero CDMX (50 a 80 personas); (3) Fotos y Recorrido de Salones San Pedro Plus (Salón Diamante y Platino) en Calle Norte 84, GAM.',
      'Optimización de CTR en SERP en 5 Entradas con Impresiones en Pág. 1 y 0 Clics (src/utils/blogData.tsx y blogDataSEO.tsx): Reescritura estratégica de Title y Meta Excerpt con precios ($530 p/p) y geolocalización (CDMX / Distrito Federal / Gustavo A. Madero).',
      'Panel Oficial Google Search Console en /admin (src/app/admin/page.tsx y AdminDashboardClient.tsx): Visualización en tiempo real de Clics, Impresiones, CTR, Posición Media, Top Queries y Top Páginas.',
    ],
    filesModified: [
      'src/utils/googleSearchConsole.ts',
      'src/utils/blogDataSEO.tsx',
      'src/utils/blogData.tsx',
      'src/app/admin/page.tsx',
      'src/components/AdminDashboardClient.tsx',
    ],
    postponedReason: null,
    humanActionRequired: 'Ninguna — el agente continúa operando en libre albedrío con acceso directo a Supabase + Google Search Console API.',
    commitHash: 'pending',
    deploymentUuid: 'pending',
    nextTimerSeconds: 21600,
    emailSent: true,
    hypothesisNextCycle:
      'En cada despertar del timer se cotejará simultáneamente la telemetría de Supabase y las métricas de Google Search Console API para detectar nuevas queries, cambios de posición/CTR y estado de indexación.',
  },
  {
    project_name: 'Salones San Pedro Plus (Salones Classics)',
    version_tag: 'v2.1.0-cycle5',
    cycle_number: 5,
    status: 'IMPLEMENTED',
    date_cdmx: '2026-11-02 14:12 CDMX',
    title:
      'Ciclo Diurno #5 (IMPLEMENTED): Simulador Instantáneo de Inversión en #paquetes + Preselección hacia Cotizador + Ajuste Sticky Bar al 22% Scroll + Fix Telemetría Móvil iPhone',
    vectors: ['UX', 'CRO', 'SEO', 'PERF'],
    telemetrySignal:
      'Corte estricto post-Ciclo #4 (>= 2026-11-02T14:06:42Z a 2026-11-02T20:08:09Z): 33 eventos humanos nuevos en 3 sesiones reales: (1) ses_1evws_2mn26nqa (Tecámac, Android, WhatsApp Business l.wl.co); (2) ses_io43s_jqd1i0sf (CDMX CP 06740, iPhone 390x665, Google Orgánico SEO, TTFB 84ms, FCP 468ms) que hizo clic en VER PRECIOS (#paquetes) con 34.7s activos pero donde sec_paquetes no disparó en móvil por superar 2,850px de alto (<25% intersectionRatio); (3) ses_n8qfi_2fj14wp7 (Gustavo A. Madero CP 07510, Desktop 1536x730, Google Orgánico SEO, 44.1s activos, 100% scroll) que disparó scroll_return_prices (regreso_a_paquetes) en scroll_pct: 29% (antes del umbral previo de 32% de la StickyPriceCompareBar) y al final regresó a #precotizador (11s). 0 dead_clicks y 0 rage_clicks.',
    autonomousActions: [
      'CRO en #paquetes (PaquetesInteractiveSection.tsx): Adición de Simulador Instantáneo de Invitados (80, 100, 150, 200, 250 pers.) y Día (Viernes/Domingo Preferencial vs Sábado Estelar) con cálculo en vivo del Total en MXN dentro de cada tarjeta (Premier, Plus, All Inclusive) + botón "Personalizar en Cotizador ↑" con pre-llenado directo al Paso 3.',
      'Sincronización Paquetes ↔ Precotizador (Precotizador.tsx): Listener del evento ssp:select-package para pre-cargar paquete, número de invitados y día preferido al instante cuando el usuario elige personalizar desde #paquetes.',
      'CRO contra scroll_return_prices al 29% de scroll (StickyPriceCompareBar.tsx): Reducción del umbral de aparición de 32% a 22% de scroll y homologación 100% de las viñetas del modal comparativo con PaquetesInteractiveSection.tsx.',
      'Precisión de Telemetría Móvil en iPhone (UXMonitorProvider.tsx y trackEvent.ts): Ajuste de IntersectionObserver (threshold 0.08/0.15 para secciones altas >75% del viewport móvil) y normalización cliente de l.wl.co como "WhatsApp Business (Enlace Directo)".',
    ],
    filesModified: [
      'src/components/PaquetesInteractiveSection.tsx',
      'src/components/Precotizador.tsx',
      'src/components/StickyPriceCompareBar.tsx',
      'src/components/UXMonitorProvider.tsx',
      'src/utils/trackEvent.ts',
    ],
    postponedReason: null,
    humanActionRequired: 'Ninguna — el agente continúa operando en libre albedrío.',
    commitHash: 'bb36a00',
    deploymentUuid: 'uhdpu6vtwru8werd6sq2qr6y',
    nextTimerSeconds: 21600,
    emailSent: true,
    hypothesisNextCycle:
      'Con el simulador de inversión total integrado en #paquetes, la pre-selección directa hacia el Paso 3 del Precotizador y la StickyPriceCompareBar activa desde el 22% de scroll, se espera eliminar el scroll_return_prices al 29% y elevar el paso de #paquetes a cotización.',
  },
  {
    project_name: 'Salones San Pedro Plus (Salones Classics)',
    version_tag: 'v2.0.2-cycle4',
    cycle_number: 4,
    status: 'POSTPONED',
    date_cdmx: '2026-11-02 08:07 CDMX',
    title:
      'Ciclo de Amanecer #4 (POSTPONED): Sin Tráfico en Madrugada (02:04 a 08:06 hrs CDMX) — Preservación de Línea Base Dominical',
    vectors: ['UX', 'CRO'],
    telemetrySignal:
      'Corte estricto post-Ciclo #3 (>= 2026-11-02T08:03:59Z hasta 2026-11-02T14:06:42Z): 0 eventos de telemetría humana y 0 leads nuevos durante la franja de madrugada/amanecer (02:04 a 08:06 hrs CDMX, domingo 2 de noviembre). Acumulado desde deploy d7efbff: 0 dead_clicks y 0 rage_clicks.',
    autonomousActions: [
      'Criterio Consciente (POSTPONED): Ante 0 sesiones en la franja 02:04–08:06 hrs CDMX, se conserva intacta la versión en producción (commit d7efbff) sin cambios forzados ni redespliegues artificiales, manteniendo limpia la línea base para medir el tráfico dominical diurno (08:06 a 14:07 hrs CDMX).',
    ],
    filesModified: [],
    postponedReason:
      'Franja de madrugada/amanecer (02:04 a 08:06 hrs CDMX) con 0 sesiones nuevas y 0 eventos de interacción desde el corte del Ciclo #3. Siguiendo el Estándar Maestro v2.0, se pospone cualquier cambio para evaluar el tráfico diurno real.',
    humanActionRequired: 'Ninguna — el agente continúa operando en libre albedrío.',
    commitHash: 'd7efbff',
    deploymentUuid: 'ds9fr8kcx1bwubhncfo9v8yb',
    nextTimerSeconds: 21600,
    emailSent: true,
    hypothesisNextCycle:
      'Evaluar el tráfico dominical diurno (08:07 a 14:07 hrs CDMX) en el Ciclo #5 para medir interacciones con el Precotizador, StickyPriceCompareBar y canales SEO/GEO/WhatsApp.',
  },
  {
    project_name: 'Salones San Pedro Plus (Salones Classics)',
    version_tag: 'v2.0.1-cycle3',
    cycle_number: 3,
    status: 'POSTPONED',
    date_cdmx: '2026-11-02 02:05 CDMX',
    title:
      'Ciclo Nocturno #3 (POSTPONED): Sin Nuevas Sesiones en Madrugada (20:00 a 02:04 CDMX) — Cero Cambios Forzados',
    vectors: ['UX', 'CRO'],
    telemetrySignal:
      'Corte estricto post-deploy d7efbff (>= 2026-11-02T01:59:49Z hasta 2026-11-02T08:03:59Z): 4 eventos registrados correspondientes únicamente al cierre de pestaña (tab_hidden, exit_from_ubicacion y page_unload) de la sesión previa ses_l1e77_zf96b45n (Cuauhtémoc CDMX, Desktop 3440x1440) que había quedado abierta con 7,462s de tiempo oculto. 0 sesiones nuevas (session_start), 0 dead_clicks, 0 rage_clicks y 0 scroll_return_prices.',
    autonomousActions: [
      'Criterio Consciente (POSTPONED): Al tratarse de ventana nocturna (20:00 a 02:04 hrs CDMX) sin nuevas sesiones iniciadas ni señales de fricción posteriores al último deploy, se pospone cualquier modificación de código para evitar cambios forzados y permitir que la versión v2.0.0-sync acumule tráfico diurno real.',
    ],
    filesModified: [],
    postponedReason:
      'Ventana nocturna (20:00 a 02:04 hrs CDMX) con 0 sesiones nuevas (session_start) desde el deploy d7efbff (2026-11-02T01:59:49Z); únicamente se registró el cierre de pestaña de la sesión previa ses_l1e77_zf96b45n. Se conserva intacta la versión en producción para evaluar el tráfico matutino.',
    humanActionRequired: 'Ninguna — el agente continúa operando en libre albedrío.',
    commitHash: 'd7efbff',
    deploymentUuid: 'ds9fr8kcx1bwubhncfo9v8yb',
    nextTimerSeconds: 21600,
    emailSent: true,
    hypothesisNextCycle:
      'Evaluar el tráfico matutino (02:05 a 08:05 hrs CDMX) y validar la interacción real con StickyPriceCompareBar.tsx y el puente de cierre en #testimonios.',
  },
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

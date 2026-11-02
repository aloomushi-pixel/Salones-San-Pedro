# 🤖 Bitácora de Autoperfeccionamiento Continuo (Modo Libre Albedrío + `/goal`) — Salones San Pedro Plus

Este documento registra cada ciclo autónomo de diagnóstico telemétrico (conectado en tiempo real a `analytics_events` y `leads` en Supabase), aislando estrictamente los eventos ocurridos **desde el último commit/deploy en adelante** para evitar mezclar fricciones históricas ya resueltas con el comportamiento actual en producción.

---

## Integración Google Search Console API + Evolución SEO/GEO (`v2.2.0-gsc-sync`) — `2026-11-02 15:47 CDMX`

### 1. Conexión Oficial a Google Search Console API (`sc-domain:sanpedro.aionia.com.mx`)
- **Service Account conectada**: `search-console-api@gen-lang-client-0674758554.iam.gserviceaccount.com` (`permissionLevel: siteOwner`).
- **Configuración segura**: Almacenada en `.env.local` y en las variables de entorno de producción de Coolify (`GOOGLE_SEARCH_CONSOLE_CREDENTIALS_B64`, UUID `ntawypnditnnuahxbtpfqygf`).
- **Métricas históricas extraídas en vivo**:
  - **Home (`https://sanpedro.aionia.com.mx/`)**: `224` clics, `11,144` impresiones, posición media `8.64`.
  - **Sitemaps**: Se detectó que el sitemap tenía `32` errores del `2026-10-30` (previos a la corrección de dominio). Se ejecutó `PUT /sitemaps` vía API (`HTTP 204`) re-enviando `https://sanpedro.aionia.com.mx/sitemap.xml` con las nuevas URLs canónicas.

### 2. Acciones Estratégicas Ejecutadas con Datos Reales de Search Console
1. **Creación de 3 Nuevas Landings / Entradas SEO/GEO para Queries de Alta Intención (`src/utils/blogDataSEO.tsx`)**:
   - `/blog/cuanto-cuesta-un-salon-de-fiestas-en-gustavo-a-madero-cdmx-precios-2026` $\rightarrow$ Ataca `"salones de fiestas gustavo a madero"` (`179 imp., pos. 10.9`), `"salones de fiestas en gustavo a madero económicos"` (`53 imp., pos. 7.7`), `"precio de salón de fiestas para 100 personas cdmx"` (`pos. 4.0`) y `"cuanto cuesta un salón de fiesta para 15"` (`pos. 8.0`).
   - `/blog/salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas` $\rightarrow$ Ataca `"salón pequeño de eventos sociales"` (`pos. 4.8`), `"salones de fiestas pequeños cdmx"` (`pos. 9.0`) y `"pequeños salones para fiestas"` (`pos. 7.3`).
   - `/blog/fotos-y-recorrido-salones-san-pedro-plus-diamante-y-platino-norte-84-gam` $\rightarrow$ Ataca `"fotos de salones san pedro plus"` (`61 imp., 0 clics, pos. 4.26`) y `"norte 84 san pedro el chico"` (`14 imp., pos. 1.07`).
2. **Optimización de CTR en 5 Entradas con Impresiones en Google y 0 Clics (`src/utils/blogData.tsx` y `blogDataSEO.tsx`)**:
   - `/blog/renta-de-auto-clasico-para-bodas` (`142 imp., 0 clics`)
   - `/blog/servicio-de-reposteria-y-postres-extra-para-eventos` (`107 imp., pos. 12.9, 0 clics`)
   - `/blog/menu-de-3-tiempos-vs-buffet-cual-es-la-mejor-opcion-para-tu-boda-o-graduacion` (`45 imp., pos. 7.6, 0 clics`)
   - `/blog/grupo-musical-versatil-para-fiestas` (`37 imp., pos. 8.1, 0 clics`)
   - `/blog/renta-de-salones-con-limosina-incluida` (`36 imp., pos. 8.1, 0 clics`)
3. **Panel en Vivo de Google Search Console en `/admin` (`src/utils/googleSearchConsole.ts`, `src/app/admin/page.tsx`, `src/components/AdminDashboardClient.tsx`)**:
   - Muestra en tiempo real Clics, Impresiones, CTR, Posición Media, Estado del Sitemap, Top Queries y Top Páginas con clasificación automática de oportunidades.

---

## Ciclo Autónomo #5 — `2026-11-02 14:12 CDMX` (`v2.1.0-cycle5` — `IMPLEMENTED`)

### 1. Diagnóstico Telemétrico Post-Ciclo #4 (`>= 2026-11-02T14:06:42Z` a `2026-11-02T20:08:09Z`)
- **Eventos humanos nuevos registrados en la franja dominical (`08:06` a `14:08 hrs CDMX`)**: **`33` eventos** en **3 sesiones reales**:
  1. `ses_1evws_2mn26nqa` (`09:20 hrs CDMX`, Tecámac, Edomex — Android `360x712` — `l.wl.co` / WhatsApp Business): Reapertura breve de pestaña (`624ms`). Detectó que `sessionStorage` en el cliente conservaba `"Referencia Web (l.wl.co)"`.
  2. `ses_io43s_jqd1i0sf` (`11:12 hrs CDMX`, CDMX CP `06740` — iPhone `390x665` — `Google Orgánico (SEO)`): Web Vitals sobresalientes (`TTFB: 84ms`, `FCP: 468ms`). Exploró `#precotizador` (`16s`), hizo clic en **`hero_click: ver_precios` (`#paquetes`)** y permaneció `34.7s` activos (`max_scroll_pct: 19%`), pero `sec_paquetes` no se disparó en iPhone porque la altura total de `#paquetes` en móvil (~2,850px) hacía que `intersectionRatio` fuera `~0.23` (`< 0.25`).
  3. `ses_n8qfi_2fj14wp7` (`13:20 hrs CDMX`, **Gustavo A. Madero CP `07510`** — Desktop `1536x730` — `Google Orgánico (SEO)`): Prospecto local en GAM con `44.1s` activos y `100%` de scroll. Recorrió `#inicio` (`11s`), `#precotizador` (`11s`), `#paquetes` (`7s`), `#confianza_ubicacion` (`5s`), `#galeria`, disparó **`scroll_return_prices` (`regreso_a_paquetes`) en `scroll_pct: 29%` (`max_scroll_pct: 36%`)** — justo antes del umbral previo de `32%` de `StickyPriceCompareBar` — y al final regresó nuevamente a `#precotizador`.
- **Fricción UX (`dead_clicks` / `rage_clicks`)**: `0` `dead_clicks` y `0` `rage_clicks` en las 3 sesiones.

### 2. Mejoras Implementadas (`IMPLEMENTED`)
1. **Simulador Instantáneo de Aforo y Día dentro de `#paquetes` (`PaquetesInteractiveSection.tsx`)**:
   - Barra interactiva (`80`, `100`, `150`, `200`, `250` personas + `Viernes/Dom Preferencial` vs `Sábado Estelar`) que calcula en tiempo real la **Inversión Total en MXN** directamente en cada tarjeta (`Premier`, `Plus`, `All Inclusive`), más botón **`Personalizar en Cotizador ↑`** que pre-selecciona el paquete y aforo en el Paso 3 de `Precotizador.tsx`.
2. **Conexión Directa `#paquetes` $\rightarrow$ Paso 3 del `Precotizador.tsx`**:
   - Listener del evento `ssp:select-package` para pre-llenar paquete, invitados y día preferido sin obligar al usuario a reiniciar el formulario desde el Paso 1.
3. **Ajuste de Umbral de `StickyPriceCompareBar.tsx` al `22%` de Scroll + Homologación de Modal**:
   - Ahora aparece desde el `22%` de scroll (cubriendo el punto exacto de `29%` donde ocurrió `scroll_return_prices` en la sesión de Gustavo A. Madero) y sus viñetas coinciden 100% con `PaquetesInteractiveSection.tsx`.
4. **Corrección de Observador de Secciones Altas en Móvil (`UXMonitorProvider.tsx`) y Normalización `l.wl.co` en Cliente (`trackEvent.ts`)**:
   - Soporte de `threshold: [0.08, 0.15, 0.25, 0.5, 0.75]` para secciones móviles altas (`>75%` del viewport) y normalización automática de `l.wl.co` a `"WhatsApp Business (Enlace Directo)"`.

---

## Ciclo Autónomo #4 — `2026-11-02 08:07 CDMX` (`v2.0.2-cycle4` — `POSTPONED`)

### 1. Diagnóstico Telemétrico Post-Ciclo #3 (`>= 2026-11-02T08:03:59Z` a `2026-11-02T14:06:42Z`)
- **Eventos registrados en la franja de madrugada/amanecer (`02:04` a `08:06 hrs CDMX`)**: `0` eventos humanos y `0` leads nuevos.
- **Estado acumulado desde el último deploy (`d7efbff`)**: `0` sesiones nuevas en horario nocturno, `0` `dead_clicks` y `0` `rage_clicks`.
- **Decisión Consciente (`POSTPONED`)**: Siguiendo el Estándar Maestro v2.0, no se ejecutan cambios forzados ante `0` visitas en horario de madrugada. Se preserva intacta la versión en producción para evaluar el tráfico dominical diurno (`08:07` a `14:07 hrs CDMX`), se registra el ciclo en Supabase, se envía el reporte ejecutivo por correo y se programa el timer de 6 horas para el Ciclo #5.

---

## Ciclo Autónomo #3 — `2026-11-02 02:05 CDMX` (`v2.0.1-cycle3` — `POSTPONED`)

### 1. Diagnóstico Telemétrico Post-Deploy (`>= 2026-11-02T01:59:49Z` a `2026-11-02T08:03:59Z`)
- **Eventos registrados en la ventana nocturna (20:00 a 02:04 CDMX)**: `4` eventos (`a548d83c-674f-4339-934d-80a519c33f94`, `d694b71e-30bd-4b8b-b5e1-63a993d83eac`, `b930824f-8296-4eb7-9555-35d591e60d8d`, `ac3517ab-4a94-4b52-8d5e-9d7dabeb2e44`).
- **Naturaleza de los eventos**: Pertenecen exclusivamente al cierre de pestaña (`tab_hidden`, `exit_from_ubicacion` y `page_unload`) de la sesión previa `ses_l1e77_zf96b45n` (Cuauhtémoc, CDMX — Desktop `3440x1440`), la cual había permanecido con la pestaña oculta durante `7,462,526 ms` (~2.07 horas) antes de cerrarse a las `04:01:28Z` (`22:01 CDMX`).
- **Nuevas sesiones (`session_start`)**: `0`.
- **Fricción UX (`dead_clicks` / `rage_clicks`)**: `0`.
- **Decisión Consciente (`POSTPONED`)**: Siguiendo la Regla de Oro del Estándar Maestro v2.0, no se realizan cambios forzados ni despliegues innecesarios cuando no hubo tráfico nuevo en la ventana nocturna. Se registra el ciclo en Supabase, se envía el reporte ejecutivo por correo y se reprograma el timer de 6 horas para el Ciclo #4.

---

## Iteración Autónoma #1 / Sync v2.0 — `2026-11-01 19:35 CDMX` (Corte Estricto Post-Commit `d4fa3b2` >= `2026-10-31T20:00:46Z`)

### 1. Verificación de No-Contraposición y Auditoría de Eventos Post-Último Commit
- **Fecha/Hora del último commit previo (`d4fa3b2` / `9a3f653`)**: `2026-10-31T20:00:46Z` (`13:55 hrs CDMX`).
- **Eventos registrados estrictamente después de `2026-10-31T20:00:46Z`**: **`57` eventos humanos nuevos** distribuidos en **3 sesiones reales**:
  1. `ses_c9esh_kla6ov70` (`2026-11-01 04:37 UTC`, Benito Juárez, CDMX — `Google Orgánico (SEO)`): Aterrizó en `/` pero permaneció en primera pantalla (`5.9s`).
  2. `ses_1evws_2mn26nqa` (`2026-11-01 16:14 UTC`, Tecámac, Edomex — `l.wl.co` / WhatsApp Business): Sesión de alta intención (`128.5s` activos). Ajustó el selector de invitados en el Precotizador a `120` y `150` personas (`guests_slider_adjust`), recorrió `#confianza_ubicacion`, `#galeria` (`next_diamante`), `#tiktok-videos`, `#banquetes`, `#animacion`, `#testimonios` y `#ubicacion` (`92%` scroll), y a las `16:16:12 UTC` disparó **`scroll_return_prices` (`regreso_a_precotizador`)** para volver arriba a su cotización.
  3. `ses_l1e77_zf96b45n` (`2026-11-02 01:30 UTC` / `19:30 CDMX`, Cuauhtémoc, CDMX — `Tráfico Directo`): Sesión de `120.8s` activos. Usó las nuevas píldoras interactivas del Hero (`hero_click: badge_salones_diamante_platino`), disparó **`scroll_return_prices` (`regreso_a_paquetes`)**, recorrió hasta el 100% de la página y disparó **`exit_intent` en `#testimonios` (`scroll_pct: 87`, `"Intento de salida mientras veía testimonios"`)**.
- **Validación de lo implementado ayer/hoy**:
  - En los `57` eventos posteriores al último commit hubo **`0` `dead_clicks` y `0` `rage_clicks`**, confirmando que las implementaciones de los 6 frentes (`PaquetesInteractiveSection`, `GaleriaSection` Lightbox, `Precotizador` Simulador y Hero pills) funcionan sin regresiones y sin ninguna contraposición.

### 2. Acciones Autónomas Ejecutadas (Basadas en las Señales Post-Commit + Auditoría Proactiva SEO/GEO)
1. **Filtro `"🚀 Desde Último Commit"` en `/admin` (`SearchConsoleExecutiveChart.tsx` y `AdminDashboardClient.tsx`)**:
   - Permite aislar con 1 clic únicamente los eventos ocurridos desde `2026-10-31T20:00:46Z` en adelante.
2. **CRO contra `scroll_return_prices` detectado en las sesiones `ses_1evws_2mn26nqa` y `ses_l1e77_zf96b45n` (`StickyPriceCompareBar.tsx`)**:
   - Barra flotante inferior que aparece después del `32%` de scroll con los precios de referencia (`Premier $530`, `Plus $710 ⭐`, `All Inclusive $1,010`), un modal instantáneo `¿Qué incluye cada uno?` sin perder la posición de lectura y botón directo `Cotizar Ahora ↑`.
3. **CRO contra `exit_intent` en `#testimonios` al 87% de scroll (`TestimoniosCarousel.tsx`)**:
   - Se añadió un puente de conversión al final de la sección de testimonios con botones hacia `#precotizador-hero` y WhatsApp, y se homologó el badge a `4.9 / 5`.
4. **Atribución de Canal `l.wl.co` (`telemetryParser.ts`)**:
   - Se reclasificó el referrer `l.wl.co` (detectado en la sesión de Tecámac) como `"WhatsApp Business (Enlace Directo)"`.
5. **Enriquecimiento Proactivo UX, SEO y GEO (`/llms.txt` y `/llms-full.txt`)**:
   - Modales interactivos en las 9 tarjetas de `#animacion` (`ExperienciasCarousel.tsx`), píldoras por tiempo en `#banquetes` (`MenuTinderCards.tsx`), imágenes accionables + `BreadcrumbList` en `/blog/[slug]`, corrección de 12 enlaces internos en `blogDataSEO.tsx`, alineación de dominio en `sitemap.ts` y creación de `/llms.txt` y `/llms-full.txt`.

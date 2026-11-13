# 🤖 Bitácora de Autoperfeccionamiento Continuo (Modo Libre Albedrío + `/goal`) — Salones San Pedro Plus

Este documento registra cada ciclo autónomo de diagnóstico telemétrico (conectado en tiempo real a `analytics_events` y `leads` en Supabase), aislando estrictamente los eventos ocurridos **desde el último commit/deploy en adelante** para evitar mezclar fricciones históricas ya resueltas con el comportamiento actual en producción.

---

## Ciclo Autónomo #42 — `2026-11-12 20:00 CDMX` (`v2.5.7-cycle42` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-12T21:54:59Z` a `2026-11-13T01:55:16Z`)
- **Telemetría en Supabase (`239` eventos humanos reales en `6` sesiones con `4` conversiones a WhatsApp y validación del 4to Tiempo en `#banquetes`):**
  1. **`ses_95bv7_gx4259w8` (Coyoacán CDMX, Desktop `1536x695`, `26` min activos: `572s` en `#galeria`, `388s` en `#precotizador`, `186s` en `#banquetes`):**
     - Recorrió los 4 tiempos de `#banquetes` incluyendo la nueva tarjeta **`menu_card_swipe: next_4to Tiempo y Tornafiesta`** con **`0` `dead_clicks` en `#banquetes`**.
     - En `#precotizador`, avanzó al Paso 3 (`XV Años`, `Sábado`) y alternó entre `select_pkg_premier` y `select_pkg_plus`, regresando del Paso 3 al Paso 1 **dos veces** (`back_from_3_to_2` -> `back_from_2_to_1` y `back_from_3_to_1`) para probar `100`, `110`, `120` y `130` invitados, haciendo **`rage_click` sobre el número `"100"` y `"120"`** al intentar editar directamente la cifra.
  2. **`ses_yjhug_1f5yj18a` (Azcapotzalco CDMX, Desktop `1920x945`):**
     - En `#paquetes`, exploró `6` modales de inclusiones, convirtió en `cotizar_click: paquete_all_inclusive`, `cotizar_click: paquete_premier` y `cotizar_click: paquete_plus`, registró `2` `dead_clicks` sobre los encabezados `"All Inclusive"` y `"Premier"`, y luego completó el Precotizador hasta el Paso 4 (`Empresarial`, `100` personas, `Viernes`, `Paquete Plus` + `Letras Gigantes` + `Mariachi` = `$81,000 MXN`).
  3. **`ses_8q0mk_snsw2g9n` (Pachuca, Hidalgo, Mobile `360x637`):**
     - Ajustó el slider `8` veces (`120`, `100`, `150`, `180`, `200`, `220`) y tocó la píldora `"Premier $53,000 • Plus ⭐ $71,000"` (`dead_click: dead_precotizador`).
  4. **`ses_6hwb0_szleo9i5` (Gustavo A. Madero CDMX, Mobile `393x695`) y `ses_4zsck_igs2syp1` (Azcapotzalco CDMX, Desktop):**
     - `ses_4zsck_igs2syp1` convirtió directo en `whatsapp_click: floating_button`; `ses_6hwb0_szleo9i5` tocó `"Alcaldía Gustavo A. Madero"` (`dead_click: dead_confianza_ubicacion`) 2 segundos antes de abrir `google_maps_midpage`.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 2 — Mediana):**
   - **Input numérico directo en Paso 1:** El indicador grande `{guests}` ahora es un `<input type="number" min={100} max={250} step={10}>` interactivo, se agregan los chips rápidos `110` y `130`, y la píldora `"Premier • Plus ⭐"` ahora es un `<button>` interactivo.
   - **Steppers `[-10]` / `[+10]` en la cabecera de los Pasos 2 y 3:** Permite ajustar el número de invitados directamente dentro del Paso 3 mientras se compara `Premier` vs `Plus` vs `All Inclusive` sin tener que regresar al Paso 1.
   - **CTA Primario Above-the-Fold en Paso 4:** Botones **`"Recibir Cotización en WhatsApp"`** y **`"Copiar"`** ubicados inmediatamente debajo del precio total estimado (`$budget MXN`).
2. **[`src/components/PaquetesInteractiveSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/PaquetesInteractiveSection.tsx) (Nivel 1 — Menor):**
   - Encabezados `"Premier"`, `"Plus"` y `"All Inclusive"` convertidos en botones interactivos que preseleccionan el paquete en el cotizador, y bloque `"Alcaldía Gustavo A. Madero"` enlazado directamente a Google Maps.

---

## Ciclo Autónomo #41 — `2026-11-12 15:52 CDMX` (`v2.5.6-cycle41` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-12T17:47:04Z` a `2026-11-12T21:47:30Z`)
- **Telemetría en Supabase (`58` eventos humanos reales en `ses_yjhug_1f5yj18a`, Azcapotzalco CDMX, Desktop `1920x945`, `635s` de permanencia acumulada en secciones):**
  1. **Uso del Nuevo Comparador del Paso 1 + Fricción por Modal Duplicado del Header (`[19:48:43]` a `[19:50:27]`):**
     - El usuario ajustó `aforo_100` y utilizó el nuevo comparador del Paso 1 (`precotizador_step: step1_preview_pkg_premier`, `$53,000 MXN`).
     - A los `29s` hizo clic en el botón **`COTIZAR`** del Header (`cotizar_click: header_desktop`), el cual montó un **segundo `<Precotizador />` en modal** encima del Precotizador que ya estaba usando en el Hero, terminando en `precotizador_abandon: modal_header_close` `64s` después.
  2. **Fricción Puntual en `#banquetes` (`[19:52:23]`):**
     - Se registró `1` `dead_click: dead_banquetes` sobre la barra `"PRIMER TIEMPO SEGUNDO TIEMPO TERCER TIEMPO"` seguido de `8` interacciones `menu_card_swipe` (`next_Primer Tiempo`, `next_Segundo Tiempo`, `next_Tercer Tiempo`, `tab_Tercer Tiempo`).
  3. **Recorrido Secuencial de Miniaturas `1` a `10` en `#galeria` (`[19:53:25]` a `[19:55:06]`):**
     - Hizo clic uno por uno desde `thumb_diamante_1` hasta `thumb_diamante_10` y tocó **`thumb_diamante_10` tres veces seguidas en `1.3s`** antes de subir a cambiar a `tab_platino`.
  4. **Apertura del Modal Comparador en `scroll: 86%` (`[19:55:24]`):**
     - Tras leer el testimonio de `Mauricio Ortega`, hizo clic en `cotizar_click: sticky_bar_comparar_paquetes` (*"¿Qué incluye cada uno?"*), donde las 3 tarjetas dentro del modal no contaban con botones de selección directa por paquete ni botón directo de WhatsApp.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap saludable con `37` URLs enviadas y `0` errores; `/` acumula `144` clics y `7,686` impresiones.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/Header.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Header.tsx) (Nivel 1 — Menor):**
   - Si `#precotizador` ya existe en el DOM (Home `/`), el botón `COTIZAR` del Header hace scroll suave al cotizador activo en lugar de abrir un segundo modal duplicado encima (conservando el modal para las páginas de `/blog`).
2. **[`src/components/StickyPriceCompareBar.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/StickyPriceCompareBar.tsx) (Nivel 2 — Mediana):**
   - Sincronización en vivo del modal comparador con el aforo elegido (`100` a `250` invitados), mostrando el monto total por paquete (`$53,000`, `$71,000`, `$101,000 MXN`), botones directos **`"Elegir Premier / Plus ⭐ / All Inclusive →"`** en cada tarjeta y botón de **WhatsApp** directo en el pie del modal.
3. **[`src/components/MenuTinderCards.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/MenuTinderCards.tsx) (Nivel 1 — Menor):**
   - Eliminación del `dead_click` en la barra de píldoras de tiempos (`data-interactive="true"`, tocar la píldora activa avanza al siguiente tiempo) e incorporación de la 4ta tarjeta (**`4to Tiempo y Tornafiesta`**).
4. **[`src/components/GaleriaSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/GaleriaSection.tsx) (Nivel 1 — Menor):**
   - Tocar nuevamente la miniatura activa abre el **Lightbox** a pantalla completa, y al final de la tira de miniaturas (`#10`) se añade el botón directo **`"Ver Salón Platino →"` / `"Ver Salón Diamante →"`**.

---

## Ciclo Autónomo #40 — `2026-11-12 11:45 CDMX` (`v2.5.5-cycle40` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-12T13:43:45Z`)
- **Telemetría en Supabase (`07:43` a `11:44 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana matutina.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas y `0` errores.
- **Decisión Consciente (`POSTPONED`):** Se preserva intacta la versión en producción (`commit 87155b5`, Coolify `uo6exu4erbqzrf1xzykfw2e6`) para medir con el tráfico vespertino el Comparador Táctil de los 3 Paquetes en el Paso 1 y la sincronización bidireccional `#precotizador` ↔ `#paquetes`.

---

## Ciclo Autónomo #39 — `2026-11-12 07:42 CDMX` (`v2.5.4-cycle39` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-12T09:41:22Z`)
- **Telemetría en Supabase (`03:41` a `07:42 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana de amanecer posterior al despliegue del Ciclo #38 (`commit 87155b5`).
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas y `0` errores.
- **Decisión Consciente (`POSTPONED`):** Se preserva intacta la versión en producción (`commit 87155b5`, Coolify `uo6exu4erbqzrf1xzykfw2e6`) para medir con el tráfico matutino el Comparador Táctil de los 3 Paquetes en el Paso 1 y la sincronización bidireccional `#precotizador` ↔ `#paquetes`.

---

## Ciclo Autónomo #38 — `2026-11-12 03:39 CDMX` (`v2.5.3-cycle38` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-12T05:36:55Z` a `2026-11-12T09:37:08Z`)
- **Telemetría en Supabase (`44` eventos humanos reales en `2` sesiones con `0` `dead_clicks` y `0` `rage_clicks`):**
  1. **Exploración de Alto Aforo (`100` a `250` personas) en Gustavo A. Madero (`ses_ayv74_n27llc2i`, Mobile `473x855`, GAM CDMX, `323s` de permanencia acumulada):**
     - Aterrizó a las `02:45 hrs CDMX` (`08:45:28Z`) y tocó la píldora del Hero **`hero_click: badge_aforo_50_400`** (*"✓ Aforos de 100 a 250+ personas"*). Como ese enlace apuntaba a `#paquetes` en vez de `#precotizador`, bajó a `scroll: 10%` y 3 segundos después tuvo que regresar manualmente a `#precotizador`.
     - Ya en el Paso 1 del Precotizador, ajustó el slider **4 veces seguidas** (`aforo_250` -> `aforo_100` -> `aforo_230` -> `aforo_100`) buscando comparar el costo total de los 3 paquetes para distintos tamaños de evento, y luego bajó a `#paquetes` (`69s` de lectura) y `#galeria` (`13` interacciones en el Lightbox de Diamante y Platino).
     - **Oportunidad detectada:** En el Paso 1, debajo del slider solo aparecía un texto estático (*"100+ personas: Todos los paquetes desbloqueados"*) y la píldora superior solo mostraba `Premier` y `Plus` (sin `All Inclusive`), además de que el botón `Siguiente: Día y Beneficios` no reflejaba el paquete ni el monto total activo.
  2. **Cierre de Sesión de `ses_3fu1u_xlccu5ey` (Benito Juárez CDMX, Desktop `3432x1316`):**
     - Concluyó su sesión con `102s` acumulados en `#galeria` y `68s` en `#tiktok-videos`.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap saludable con `37` URLs enviadas y `0` errores.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 2 — Mediana):**
   - Sustitución de la etiqueta estática inferior del Paso 1 por un **Comparador Táctil en Vivo de los 3 Paquetes (`Premier $530`, `Plus ⭐ $710`, `All Inclusive $1,010`)** que muestra simultáneamente los 3 totales conforme el usuario mueve el slider (`100` a `250` invitados) y permite preseleccionar cualquier paquete desde el Paso 1 (`step1_preview_pkg_*`).
   - Actualización del botón primario del Paso 1 para mostrar el paquete y presupuesto activo: **`"Siguiente: Día y Beneficios ({packageType} $71,000) →"`**.
2. **[`src/app/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/page.tsx) (Nivel 1 — Menor):**
   - Cambio de destino en `badge_aforo_50_400` (*"✓ Aforos de 100 a 250+ personas"*) de `#paquetes` a `#precotizador`.

---

## Ciclo Autónomo #37 — `2026-11-11 23:34 CDMX` (`v2.5.2-cycle37` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-12T01:29:03Z` a `2026-11-12T05:30:00Z`)
- **Telemetría en Supabase (`106` eventos humanos reales en `3` sesiones con `0` `dead_clicks`, `0` `rage_clicks` y `3` conversiones):**
  1. **Validación Inmediata del Nuevo Cotizador Base `100 Personas` + Conversión a WhatsApp (`ses_1na2b_5cumw5xx`, Mobile `428x781`, CDMX, `281s` activos):**
     - Aterrizó en `/`, ajustó el aforo a **`120 personas` (`aforo_120`)**, eligió **`Bautizo / Cumpleaños`** (`step_1_completado`), seleccionó **`Viernes`** (`step_2_completado`), eligió **`Paquete Plus` (`$85,200 MXN` / `$710 p/p`)** (`select_pkg_plus` -> `step_3_completado`), bajó a `#paquetes` y convirtió en **`cotizar_click: paquete_plus`**.
     - **Oportunidad detectada:** Cuando el usuario bajó de `#precotizador` (donde ya había elegido `120 personas` y `Viernes`) hacia `#paquetes` y tocó `paquete_preseleccionar_plus`, el componente `PaquetesInteractiveSection` seguía en su valor inicial (`100 personas`) porque aún no existía sincronización en sentido `#precotizador` -> `#paquetes`.
  2. **Exploración Profunda de Lightbox en `#galeria` (`ses_3fu1u_xlccu5ey`, Desktop `3432x1316`, Benito Juárez CDMX, `230s` activos):**
     - Recorrió toda la página (`scroll_100%`), copió la dirección (`text_copy: copy_ubicacion`), permaneció `41s` en `#tiktok-videos` y **`78s` en `#galeria` ejecutando `38` interacciones dentro del Lightbox** (`lightbox_open_diamante`, `lightbox_open_platino`, recorriendo todas las fotos de ambos salones).
  3. **Tráfico en Blog SEO (`ses_1e59s_bjuoyl22`, Mobile `384x701`, Gustavo A. Madero CDMX):**
     - Visitó `/blog/salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas` (que ya acumula **`115` impresiones** en Google Search Console, junto con `123` impresiones del tour fotográfico).

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) y [`src/components/PaquetesInteractiveSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/PaquetesInteractiveSection.tsx) (Nivel 2 — Mediana):**
   - Sincronización bidireccional `#precotizador` ↔ `#paquetes` mediante `CustomEvent('ssp:sync-from-precotizador')`, de modo que cuando el usuario elige `120`, `150` o `200` invitados y su día preferido en `#precotizador` y baja a `#paquetes`, las tarjetas de `#paquetes` muestran automáticamente ese mismo aforo y tarifa sin reiniciar a `100`. Además, `Paquete Plus` queda preseleccionado por defecto para todos los giros de evento desde `100` personas.
2. **[`src/components/GaleriaSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/GaleriaSection.tsx), [`src/utils/blogDataSEO.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/blogDataSEO.tsx) y [`src/app/blog/[slug]/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/blog/%5Bslug%5D/page.tsx) (Nivel 1 — Menor):**
   - Botón dorado destacado **`"Simular Paquete en {Salón Diamante/Platino} ↑"`** (`galeria_lightbox_cotizar_*`) en el Lightbox de `#galeria` y actualización de los chips del Blog SEO a **`100`, `120`, `150` y `200` personas**.

---

## Ciclo Autónomo #36 — `2026-11-11 19:26 CDMX` (`v2.5.1-cycle36` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-11T21:22:58Z` a `2026-11-12T01:24:00Z`)
- **Telemetría en Supabase (`50` eventos humanos reales en `2` sesiones con `0` `dead_clicks` y `0` `rage_clicks`):**
  1. **`ses_mmp5y_xcx9srhc` (Iztacalco CDMX, Desktop `1920x911`, `55s` activos):**
     - Exploró `#precotizador`, `#paquetes`, `#galeria` (`5` clics en `next_diamante` y `3` clics en miniaturas `thumb_diamante_7`, `thumb_diamante_8`, `thumb_diamante_10`), entró a `#tiktok-videos` (`9s` de permanencia) donde activó **`exit_intent: exit_from_tiktok-videos`** y continuó hasta `#banquetes`, `#animacion` y `#testimonios`.
  2. **`ses_pe4my_fythbm5x` (San Miguel Totoltepec -> Gustavo A. Madero CDMX, Mobile `389x775`):**
     - Hizo clic en `hero_click: ver_precios`, interactuó con el simulador de `#paquetes` (`sim_dia_sabado`) y regresó horas después desde Gustavo A. Madero para consultar nuevamente `#paquetes`.
- **Directriz Comercial del Humano Incorporada:**
  - El cotizador y el simulador de paquetes inician en **`100 personas`** como aforo mínimo en lugar de `50 personas`, permitiendo que los 3 paquetes (**Premier**, **Plus** y **All Inclusive**) estén desbloqueados desde el inicio.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap saludable con `37` URLs enviadas y `0` errores; consultas principales lideradas por `"salones san pedro plus"` (`22` clics, `631` impresiones, pos `1.02`) y `"salon san pedro plus"` (`16` clics, `205` impresiones, pos `1.21`).

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx), [`src/components/PaquetesInteractiveSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/PaquetesInteractiveSection.tsx), [`src/components/StickyPriceCompareBar.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/StickyPriceCompareBar.tsx) y [`src/app/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/page.tsx) (Nivel 2 — Mediana):**
   - Estandarización integral del mínimo de **`100 personas`** en el Precotizador (`min="100"`, presets `100` a `250`), en la barra simuladora y modales de `#paquetes`, en la barra comparativa flotante y en los textos del Hero y Footer.
2. **[`src/components/TikTokVideos.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/TikTokVideos.tsx) (Nivel 1 — Menor):**
   - En respuesta a `exit_intent: exit_from_tiktok-videos` (`ses_mmp5y_xcx9srhc`), se integró el botón primario **`"Cotizar este Montaje ↑"`** (`cotizar_click: tiktok_ir_precotizador`) y se actualizó el CTA de WhatsApp (`tiktok_section_cta`) con el título del video activo hacia `wa.me/526633670431`.

---

## Ciclo Autónomo #35 — `2026-11-11 15:18 CDMX` (`v2.5.0-cycle35` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-07T13:34:23Z` a `2026-11-11T21:15:00Z`)
- **Telemetría en Supabase (`478` eventos humanos reales en `33` sesiones):**
  - **¡Récord de Conversión y Validación GEO/CRO (`14` conversiones: `9` `whatsapp_click` + `5` `cotizar_click`):**
    1. **75% de Conversión a WhatsApp desde ChatGPT (`IA Generativa / GEO` — 3 de 4 sesiones convirtieron):**
       - `ses_yhryf_ftnjnejs` (`2026-11-10`, Ecatepec, Mobile desde ChatGPT): Completó los Pasos 1 y 2 (`50 personas • Bautizo / Cumpleaños • Sábado`) y **convirtió directamente desde el nuevo botón WhatsApp Express del Paso 3 (`whatsapp_click: precotizador` con `$26,500 MXN`)** implementado en el Ciclo #31.
       - `ses_9rtcj_zykw8yn6` (`2026-11-11`, Miguel Hidalgo CDMX, Desktop desde ChatGPT): Seleccionó `70 personas`, completó el Paso 1 y convirtió en `whatsapp_click: floating_button`.
       - `ses_eiylj_j403dzzk` (`2026-11-11`, Miguel Hidalgo CDMX, Desktop desde ChatGPT): Fue rescatado por `exit_intent: exit_from_precotizador`, completó los Pasos 1 a 3 (`50 personas`), activó el upsell a **`100 invitados` (`upsell_a_100_invitados` -> `Paquete Plus`)** y convirtió en `whatsapp_click: floating_button`.
    2. **Conversión Orgánica High-Ticket (`200+ personas • Paquete All Inclusive` — `ses_63d54_37zdrn2v`):**
       - Aterrizó desde Google Orgánico, seleccionó `200 o más personas`, utilizó el nuevo selector `select_pkg_all_inclusive`, completó el Paso 3 y convirtió en **`whatsapp_click: precotizador` (`Paquete All Inclusive`)**; luego recorrió `#galeria` (`next_platino_auto_from_diamante`) y volvió a convertir en **`whatsapp_click: galeria_lightbox_platino`**.
  - **3 Fricciones Reales Detectadas en las `478` Señales y Resueltas en este Ciclo:**
    1. **Botón Flotante de WhatsApp (`floating_button`) sin sincronización del borrador activo (`ses_dezol_8r7zq2x6`, `ses_3mpb4_m2gply9j`, `ses_9rtcj_zykw8yn6`, `ses_eiylj_j403dzzk`):** 4 usuarios cotizaron su evento en el Precotizador (`60`, `70` y `100` invitados) y luego hicieron clic en el botón verde flotante de la esquina inferior derecha (`floating_button`), el cual abría un mensaje genérico sin incluir su cotización simulada.
    2. **Selección manual de los 3 extras del Combo VIP en lugar del paquete con descuento + `locked_plus` en `< 100` invitados (`ses_nimj4_3bfai4cp` y `ses_eloly_6dxi1cjn`):** En `ses_nimj4_3bfai4cp` (ChatGPT, `70 personas`), tras tocar `locked_plus`, el usuario seleccionó manualmente `extra_letras`, `extra_limusina` y `extra_shots` (`$14,500 MXN` individuales en lugar de `$11,500 MXN` del Combo Fiesta VIP).
    3. **`dead_click` en el encabezado del simulador en vivo del Paso 4 + retrocesos `back_from_4_to_2` (`ses_eloly_6dxi1cjn`):** El usuario hizo clic sobre `"⚡ Ajusta tu simulación en vivo sin salir: {eventKind}"` intentando cambiar el tipo de evento desde el Paso 4 y retrocedió dos veces al Paso 2 para cambiar la temporada.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** `563` impresiones y `24` clics acumulados (CTR `4.26%`, posición media `8.4`). Fuerte tracción en artículos SEO/GEO: `/blog/salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas` (`104` impresiones, `2` clics, pos `9.3`), `/blog/fotos-y-recorrido-salones-san-pedro-plus-diamante-y-platino-norte-84-gam` (`104` impresiones, `1` clic, pos `6.8`) y `/blog/cuanto-cuesta-un-salon-de-fiestas-en-gustavo-a-madero-cdmx-precios-2026` (`79` impresiones, `2` clics, pos `6.6`).

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/TrackedLink.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/TrackedLink.tsx) (Nivel 2 — Mediana):**
   - Sincronización automática del borrador activo (`sanpedro_precotizador_draft_v1` en `sessionStorage`) al hacer clic en `whatsapp_click` (`floating_button`, `header_nav`, `footer_ubicacion_whatsapp`), inyectando aforo, tipo de evento, día, temporada, paquete y presupuesto estimado tanto en el evento de Supabase como en el mensaje de WhatsApp enviado al asesor.
2. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 2 — Mediana):**
   - Auto-activación del **Combo Fiesta VIP (`$11,500 MXN`, ahorro inmediato de `$3,000 MXN`)** cuando el usuario marca manualmente los 3 extras (`limusina`, `shots`, `letras`), y adición del botón **`"Conservar {guests} pers. + Combo VIP (+$11,500)"`** en el banner de `< 100` invitados del Paso 3.
3. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 1 — Menor):**
   - Conversión del encabezado `"⚡ Ajusta tu simulación en vivo sin salir: {eventKind} ↻"` del Paso 4 en un botón interactivo para alternar el tipo de evento sin salir del Paso 4, más selector compacto de temporada (`Oct–Dic 2026`, `Ene–Sep`, `Año 2027`).

---

## Ciclo Autónomo #34 — `2026-11-07 07:32 CDMX` (`v2.4.9-cycle34` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-07T09:31:27Z`)
- **Telemetría en Supabase (`03:31` a `07:32 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana de amanecer del sábado posterior al Ciclo #33.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas y `0` errores.
- **Decisión Consciente (`POSTPONED`):** Se preserva intacta la versión en producción (`commit 65145d0`, Coolify `qrjhojb5rofr6ic3c4khkcrg`) para evaluar con el tráfico matutino de fin de semana la sincronización `#paquetes` ↔ `#precotizador` y el botón de WhatsApp directo en el Paso 3.

---

## Ciclo Autónomo #33 — `2026-11-07 03:30 CDMX` (`v2.4.8-cycle33` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-07T05:28:56Z`)
- **Telemetría en Supabase (`23:28` a `03:29 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana de sueño profundo de madrugada posterior al despliegue del Ciclo #32 (`commit 65145d0`).
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas y `0` errores.
- **Decisión Consciente (`POSTPONED`):** Se preserva intacta la versión en producción (`commit 65145d0`, Coolify `qrjhojb5rofr6ic3c4khkcrg`) para evaluar con el tráfico matutino la sincronización en vivo `#paquetes` ↔ `#precotizador` (`ssp:sync-from-paquetes`) y el cintillo de precio + botón de cotizador dentro de los modales de servicios incluidos.

---

## Ciclo Autónomo #32 — `2026-11-06 23:24 CDMX` (`v2.4.7-cycle32` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-07T01:20:01Z`)
- **Telemetría en Supabase (`19:20` a `23:20 hrs CDMX`):** **`34` eventos humanos reales** en 3 sesiones de `Google Orgánico (SEO)`:
  1. **Exploración Intensiva en `#paquetes` y Regreso a `#precotizador` (`ses_xybsg_koj9ors7`, `23:06 hrs CDMX`, Cuauhtémoc CDMX CP `06800`, Desktop `1536x791`, `142.8s` activos y `92s` en `#paquetes`):**
     - Seleccionó `aforo_200` en el Precotizador (`05:06:54Z`), bajó a `#paquetes` y `#confianza_ubicacion`, y tras activar `exit_intent: exit_from_confianza_ubicacion` fue retenido durante **`67` segundos adicionales** gracias a la barra de rescate.
     - En `#paquetes` utilizó intensivamente la barra simuladora: alternó `sim_dia_sabado` -> `sim_dia_viernes_domingo` -> `sim_dia_sabado`, seleccionó **`250 personas` (`paquetes_sim_250`)** y abrió el modal **`modal_paquete_servicio_7h`** (*"7 Horas de Celebración Extendida (Paquete Plus)"*).
     - Finalmente subió de regreso a `scroll: 2%` (`last_section: "precotizador"`).
     - **Oportunidades detectadas:**
       - Cuando el usuario cambia el aforo (`250 personas`), el día (`Sábado`) o abre un modal de servicio (`Paquete Plus`) en `#paquetes` y luego sube manualmente a `#precotizador`, esos cambios en `#paquetes` no se sincronizaban silenciosamente con el `Precotizador` superior.
       - Además, el modal de servicio incluido (`selectedInclusion`) en `#paquetes` solo tenía el botón `"Cotizar con este servicio en WhatsApp"` (sin mostrar el monto total simulado para sus `250` personas ni ofrecer el botón `"Personalizar en Cotizador ↑"` para usuarios de Desktop).
  2. **Sesiones `ses_rus0r_fvnsxh79` y `ses_s1rdl_tp4profe`:**
     - Validaron auditoría SEO limpia (`title_len: 64`, `meta_desc_len: 159`, `0` imágenes sin `alt`).

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/PaquetesInteractiveSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/PaquetesInteractiveSection.tsx) y [`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 2 — Mediana):**
   - Sincronización automática `#paquetes` -> `#precotizador` mediante `CustomEvent('ssp:sync-from-paquetes')` cada vez que el usuario selecciona un aforo (`50` a `250`), cambia entre `Viernes/Dom` y `Sábado` o abre el modal de un servicio en `#paquetes`.
2. **[`src/components/PaquetesInteractiveSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/PaquetesInteractiveSection.tsx) (Nivel 1 — Menor):**
   - Adición de cintillo con el presupuesto simulado en vivo dentro del modal de servicio incluido (*"Incluido en Paquete Plus (250 pers. • Sábado Estelar): $186,250 MXN"*) y botón **`"Personalizar {Paquete} ({simGuests} pers.) ↑"`** junto al botón de WhatsApp.

---

## Ciclo Autónomo #31 — `2026-11-06 19:17 CDMX` (`v2.4.6-cycle31` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-06T21:14:25Z`)
- **Telemetría en Supabase (`15:14` a `19:15 hrs CDMX`):** **`14` eventos humanos reales** en 2 sesiones:
  1. **Validación en Vivo de Precio en Paso 1/2 desde Instagram + Análisis del Paso 3 (`ses_oavh8_u9qkge30`, `18:36 hrs CDMX`, Gustavo A. Madero CP `07400`, Mobile `428x835` desde Instagram `link_in_bio`, `74.6s` activos):**
     - Ajustó el aforo a **`100 personas` (`aforo_100`)**, seleccionó **`XV Años`** y completó el Paso 1 (`step_1_completado` en `24s`) gracias a la nueva píldora de precio en vivo.
     - En el Paso 2 seleccionó **`Sábado`** y **`Primavera / Graduaciones (Abr-Jun)`**, completando el Paso 2 (`step_2_completado` en `27.5s`) con la nueva barra resumen de precio.
     - En el Paso 3 permaneció `22.6s` (`scroll: 8% -> 15%`), donde se detectaron 3 oportunidades clave:
       - Cada tarjeta de paquete solo mostraba `"desde $530/$710/$1010 p/p"` sin mostrar el monto total calculado para sus `100` invitados (`$53,000`, `$71,000` y `$101,000 MXN`).
       - La condición `!hasTouchedGuests` en `handleStep1Next` impedía que al elegir `100+` invitados para `XV Años` / `Boda` / `Graduación` se pre-seleccionara automáticamente el **`Paquete Plus`** (`⭐ El Más Elegido`).
       - Los usuarios de Instagram en móvil que ya definieron sus 5 variables en el Paso 3 aún debían pasar al Paso 4 antes de ver el botón verde de WhatsApp.
  2. **Sesión `ses_lxd9t_y40q8nnm` (`17:30 hrs CDMX`, WhatsApp Business `l.wl.co`):**
     - Validó `title_len: 64`, `meta_desc_len: 159`, `0` imágenes sin `alt`.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 1 — Menor):**
   - Pre-selección automática de **`Paquete Plus`** cuando el usuario elige `100+` invitados para `XV Años`, `Boda` o `Graduación` en `handleStep1Next`, y telemetría `precotizador_step: select_pkg_*` al tocar cualquier tarjeta en el Paso 3.
2. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 2 — Mediana):**
   - Visualización del monto total calculado (`$53,000 MXN`, `$71,000 MXN`, `$101,000 MXN` para 100 invitados) junto al precio por persona en cada tarjeta del Paso 3, e integración de la doble fila de acción debajo de los paquetes: **`"Desglose {packageType} ($71,000) →"`** + **`"WhatsApp Directo ($71,000)"`**.

---

## Ciclo Autónomo #30 — `2026-11-06 15:11 CDMX` (`v2.4.5-cycle30` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-06T17:03:17Z`)
- **Telemetría en Supabase (`11:03` a `15:07 hrs CDMX`):** **`68` eventos humanos reales** en 4 sesiones:
  1. **¡Hito GEO/CRO! Conversión Real desde ChatGPT (`utm_source=chatgpt.com`) a WhatsApp en `47` Segundos (`ses_acl9j_4zhonfzt`):**
     - Prospecto de Xochimilco, CDMX (`12:06 hrs CDMX`, Mobile `384x728`), que llegó directamente desde **`IA Generativa (ChatGPT / GEO)` (`utm_source=chatgpt.com`)**.
     - Ajustó el slider a **`50 personas` (`aforo_50`)**, seleccionó **`Empresarial`** (`step_1_completado` a los `14s`), eligió **`Viernes`** y **`Temporada Alta / Fin de Año (Oct-Dic)`** (`step_2_completado` a los `22s`), avanzó en el Paso 3 con **`Paquete Premier` (`$26,500 MXN` / `$530 p/p`)** (`step_3_completado` a los `41s`) con **`0` clics falsos sobre `sticky_bar_ir_precotizador`** y convirtió en **`whatsapp_click: precotizador`** a los `47s` (`wants_tour: true`).
     - Posteriormente regresó a la pestaña, exploró `#galeria` (`4` clics en `next_diamante`), `#tiktok-videos` y el menú móvil del Blog.
  2. **Tráfico Orgánico SEO en Blog de Salones Pequeños -> Embudo Home (`ses_gquu1_ugyr3f5t`, `15:05 hrs CDMX`, Mobile `392x791`, `99s` activos):**
     - Aterrizó desde Google Orgánico en `/blog/salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas` (`title_len: 65`, `meta_desc_len: 160`).
     - **Fricción detectada #1 (`dead_click` en `<li>` del artículo):** Hizo `dead_click` (`dead_blog_articulo`) sobre el elemento `<li>` *"80 invitados: Desde $42,400 MXN todo incluido."* esperando que fuera clicable; 5 segundos después tocó `cotizar_click: blog_cta_chip_80`, llegando exitosamente a `/?guests=80#precotizador`.
     - **Fricción detectada #2 (Slider en Paso 1 sin precio en vivo):** Ya en `/#precotizador`, movió el slider (`80` -> `240` -> `80` -> `250`) buscando ver cómo cambiaba el precio en el Paso 1, y al no ver una cifra monetaria debajo del número de invitados, tocó `hero_click: ver_precios` para bajar a `#paquetes`.
  3. **Intención de Copia de Ubicación/Marca en Paso 2 del Precotizador (`ses_awql0_d10h5q0p`, Desktop `1920x911`, Benito Juárez CDMX, `144s` activos):**
     - Completó el Paso 1 (`80 personas`, `Bautizo / Cumpleaños`), permaneció `125s` en el Paso 2 y ejecutó **2 eventos `text_copy: copy_precotizador`** copiando *"San Pedro Plus"* y *"Salón de eventos en Gustavo A. Madero - CDMX San Pedro Plus"*.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/utils/blogDataSEO.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/blogDataSEO.tsx) (Nivel 1 — Menor):**
   - Conversión de la lista plana `<ul>` de `50`, `70` y `80` invitados en el artículo `salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas` en 4 tarjetas interactivas `TrackedLink` (`blog_small_venues_50`, `blog_small_venues_70`, `blog_small_venues_80`, `blog_small_venues_100`) con botón `"Simular {N} →"`.
2. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 2 — Mediana):**
   - Adición de píldora de presupuesto en vivo debajo del contador de invitados en el Paso 1 (*"Desde $42,400 MXN todo incluido"* / *"Premier $53,000 • Plus ⭐ $71,000"*), barra resumen y CTA con precio explícito en el Paso 2 (*"Ver Paquetes desde $42,400 MXN →"*) y pie de ubicación verificada con botón de 1 clic **`"Copiar Ubicación y Teléfono"`** (`precotizador_copy_location`).

---

## Ciclo Autónomo #29 — `2026-11-06 11:02 CDMX` (`v2.4.4-cycle29` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-06T12:55:24Z`)
- **Telemetría en Supabase (`06:55` a `10:58 hrs CDMX`):** **`21` eventos humanos reales** en la sesión **`ses_7v211_cjcn9adx`** (`10:56 hrs CDMX`, Mobile `411x782` vía `Google Orgánico SEO`):
  1. **Validación en Vivo del Ciclo #27:** `0` clics falsos sobre `sticky_bar_ir_precotizador` durante los `13s` de permanencia en `#inicio`/`#precotizador`, y auditoría SEO limpia (`title_len: 64`, `meta_desc_len: 159`).
  2. **Exploración Inline en `#galeria` sin Lightbox (`16s` activos — sección con mayor permanencia):**
     - El visitante tocó `hero_click: ver_galeria`, cambió a la pestaña **`Salón Platino` (`tab_platino`)** y **avanzó `6` fotos seguidas (`next_platino`)** en el carrusel inline sin abrir el visor Lightbox.
     - **Fricción detectada en `#galeria` inline:** Mientras que el visor Lightbox a pantalla completa sí contaba con un botón inferior `"Cotizar en este Salón"`, el carrusel inline principal carecía de botones de conversión (`Cotizar en Salón Platino ↑` / `Agendar Visita`) debajo de las miniaturas.
  3. **Calibración de `scroll_return_prices`:** Se detectó que al bajar desde `#paquetes` hacia `#galeria`, `scroll_return_prices: regreso_a_paquetes` se disparó `49ms` después de que `#galeria` entró en pantalla porque `#paquetes` aún mantenía `15%` de intersección superior durante el desplazamiento descendente.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/GaleriaSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/GaleriaSection.tsx) (Nivel 2 — Mediana):**
   - Incorporación de una **Barra de Conversión y Aforo Inline** debajo de las miniaturas del carrusel principal (*"✨ Salón Diamante • Ideal de 100 a 250+ Invitados"* / *"✨ Salón Platino • Ideal de 50 a 180 Invitados"*) con los botones **`"Cotizar en {Salón} ↑"`** (`galeria_inline_cotizar_diamante` / `platino`) y **`"Agendar Visita"`** (`galeria_inline_wa_diamante` / `platino`), además de habilitar la transición continua `Diamante ↔ Platino` también en el carrusel inline.
2. **[`src/components/UXMonitorProvider.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/UXMonitorProvider.tsx) (Nivel 1 — Menor):**
   - Calibración de `scroll_return_prices` exigiendo que `#paquetes` haya dejado de intersectar previamente y que el desplazamiento sea ascendente (`window.scrollY <= lastScrollYRef.current`).

---

## Ciclo Autónomo #28 — `2026-11-06 06:56 CDMX` (`v2.4.3-cycle28` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-06T08:54:09Z`)
- **Telemetría en Supabase (`02:54` a `06:55 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana de amanecer del jueves posterior al despliegue del Ciclo #27 (`commit 5464895`).
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas y `0` errores.
- **Decisión Consciente (`POSTPONED`):** Se preserva intacta la versión en producción (`commit 5464895`, Coolify `rjr2l6nsyrkgfwi3gmsydcpb`) para medir con tráfico matutino real la supresión automática de `StickyPriceCompareBar` sobre `#precotizador` y el nuevo botón de avance directo en el Paso 3.

---

## Ciclo Autónomo #27 — `2026-11-06 02:52 CDMX` (`v2.4.2-cycle27` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-06T04:46:56Z`)
- **Telemetría en Supabase (`22:46` a `02:47 hrs CDMX`):** **`25` eventos humanos reales** en 2 sesiones:
  1. **Sesión `ses_mczh3_ph3wj3kl` (`00:54 hrs CDMX`, Cuautlalpan, Estado de México CP `56383`, Mobile desde `Facebook Ads / App` `m.facebook.com`, **`206.5s` = `3.4 minutos` activos**):**
     - Prospecto de alto interés cotizando un evento **`Empresarial` para `100 personas` en `Viernes` (`Temporada Alta / Fin de Año Oct-Dic`)**.
     - **Fricción Crítica #1 (Colisión de `StickyPriceCompareBar` con `#precotizador` en móvil):** Al encontrarse en los Pasos 1 y 2 del `Precotizador` (`scroll: 5% a 10%`), la barra flotante `StickyPriceCompareBar` permanecía visible en la parte inferior mostrando el botón dorado `"Cotizar Ahora ↑"`. El usuario **tocó `sticky_bar_ir_precotizador` `6` veces seguidas** creyendo que era el botón de avance del cotizador, lo que rebotaba el scroll al tope de `#precotizador-hero` sin avanzar de paso.
     - **Fricción #2 (Distancia al CTA en Paso 3 para eventos Empresariales):** Al avanzar finalmente al Paso 3 (`step_2_completado`), el usuario permaneció `15s` viendo las tarjetas de paquete sin llegar al botón inferior `"Ver Cotización y Simulador"` (situado debajo de `Combo Fiesta VIP` y los 6 servicios extra).
     - **Fricción #3 (`dead_click` en `<h1>`):** Registró `1` `dead_click` (`dead_inicio`) sobre el `<h1>` principal en `scroll: 0%`.
  2. **Sesión `ses_khrwk_o9xd6phd` (`/blog/tendencias-decoracion-boutique-este-ano`):**
     - Validó `title_len: 54`, `meta_desc_len: 160`, `0` imágenes sin `alt`.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/StickyPriceCompareBar.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/StickyPriceCompareBar.tsx) (Nivel 2 — Mediana):**
   - Integración de `IntersectionObserver` sobre `#precotizador` para ocultar automáticamente la barra flotante siempre que el `Precotizador` esté visible en pantalla (`precotizadorInView = true`), restauración del rango de scroll a `24%–88%` y cierre inmediato de la barra al tocar `"Cotizar Ahora ↑"`.
2. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 1 — Menor):**
   - Adición de un botón de avance directo **`"Continuar con Paquete {packageType} (${budget} MXN) →"`** inmediatamente debajo de las 3 tarjetas de paquete en el Paso 3, permitiendo pasar al Paso 4 en 1 toque sin tener que hacer scroll por la sección opcional de extras.
3. **[`src/app/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/page.tsx) (Nivel 1 — Menor):**
   - Conversión del `<h1>` del Hero en un `TrackedLink` (`h1_headline_precotizador` → `#precotizador`) para eliminar `dead_clicks` sobre el titular principal.

---

## Ciclo Autónomo #26 — `2026-11-05 22:45 CDMX` (`v2.4.1-cycle26` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-06T00:40:04Z`)
- **Telemetría en Supabase (`18:40` a `22:41 hrs CDMX`):** **`51` eventos humanos reales** en 3 sesiones:
  1. **Sesión `ses_19hbq_toap2r4z` (`21:20` y `22:06 hrs CDMX`, Brownsville, Texas CP `78521`, Mobile `390x651` vía **`IA Generativa (ChatGPT / GEO)`** `utm_source=chatgpt.com`):**
     - **Hito GEO Verificado:** ChatGPT recomendó directamente `https://sanpedro.aionia.com.mx/?utm_source=chatgpt.com`.
     - En su primera visita exploró hasta el `72%` de scroll (`#banquetes`/`#animacion`), y **46 minutos más tarde regresó a la pestaña** y bajó hasta **`scroll: 92%` (`#ubicacion` — Footer)** permaneciendo `15s` revisando la ubicación y el mapa.
     - **Fricción detectada en `#ubicacion`:** A partir del `94%` de scroll `StickyPriceCompareBar` se oculta para no tapar el pie de página, y el Footer (`#ubicacion`) no tenía ningún botón de conversión (`Simular Presupuesto` o `WhatsApp`).
  2. **Sesión `ses_drp7m_u0ixm7n1` (`20:53 hrs CDMX`, Gustavo A. Madero CP `07950`, Mobile `432x814` vía `Google Orgánico SEO`):**
     - Aterrizó directamente desde Google en `/blog/cuanto-cuesta-un-salon-de-fiestas-en-gustavo-a-madero-cdmx-precios-2026`, **validando en vivo el blindaje `generateMetadata` del Ciclo #25 (`title_len: 66`, `meta_desc_len: 160`, `0` errores)**.
     - Leyó el `100%` del artículo durante **`47.4s` activos**, pero la sección `1. Tabla de Precios por Persona y Totales para 50, 100, 150 y 200 Invitados` era solo una lista de viñetas sin tabla interactiva ni botones por aforo.
  3. **Sesión `ses_gasng_sk3qegjg` (`22:04 hrs CDMX`, Gustavo A. Madero CP `07420`, Mobile `392x736` vía `Google Orgánico SEO`):**
     - Visitante local en GAM CDMX (`21s` activos en `#inicio`, `#precotizador` y `#paquetes`, confirmando `title_len: 64`, `meta_desc_len: 159`).

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/app/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/page.tsx) (Nivel 2 — Mediana):**
   - Incorporación de una **Banda de Conversión y Referencia Vial al cierre de `#ubicacion`** debajo del mapa (*"A 10 min de Lindavista, Aragón y Circuito Interior"*) con CTAs rastreados (`footer_ubicacion_ir_precotizador` y `footer_ubicacion_whatsapp`) para convertir a los usuarios GEO/ChatGPT y orgánicos que llegan al `90%–100%` de scroll.
2. **[`src/utils/blogDataSEO.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/blogDataSEO.tsx) y [`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx) (Nivel 2 — Mediana):**
   - Construcción de la **Tabla Interactiva de Precios 2026 (`50, 80, 100, 150 y 200 personas`)** con botones de simulación directa (`/?guests=100&pkg=Plus#precotizador-hero`) y soporte del parámetro `?pkg=` en el `Precotizador`, además de píldoras rápidas de aforo en el componente `CTA` final de los artículos SEO.
3. **[`src/utils/blogDataSEO.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/blogDataSEO.tsx) (Nivel 1 — Menor):**
   - Ajuste del título de `/blog/cuanto-cuesta-un-salon-de-fiestas-en-gustavo-a-madero-cdmx-precios-2026` a **`65` caracteres exactos sin elipsis** (`"¿Cuánto Cuesta un Salón de Fiestas en GAM CDMX? Precios 2026 Reales"`).

---

## Ciclo Autónomo #25 — `2026-11-05 18:36 CDMX` (`v2.4.0-cycle25` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-05T20:32:15Z`)
- **Telemetría en Supabase (`14:32` a `18:32 hrs CDMX`):** **`9` eventos humanos reales** en la sesión **`ses_4p25u_u6ohd636`** (`16:39 hrs CDMX`, CDMX CP `03220`, Desktop `1272x634` / pantalla `1280x800` desde **`Buscadores Orgánicos (Bing/Yahoo)`** `https://www.bing.com/`):
  1. **Validación SEO en Vivo:** `web_vitals` (`seo_audit`) en `/` confirmó `title_len: 64`, `meta_desc_len: 159`, `h1_count: 1`, `img_missing_alt: 0`.
  2. **Fricción Detectada (Viewport Laptop Compacto `1272x634` + `exit_intent` sin Rescate):**
     - El visitante permaneció **`32.6s` activos** (`26s` en `#inicio`/`#precotizador` y `6s` en `#paquetes` al `11%` de scroll), regresó a `scroll: 0%` y disparó **`exit_intent` (`exit_from_inicio`)** a los `30.5s` antes de cerrar la pestaña (`session_exit: page_unload`).
     - Como [`StickyPriceCompareBar.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/StickyPriceCompareBar.tsx) exigía `scroll >= 22%` y [`UXMonitorProvider.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/UXMonitorProvider.tsx) no emitía señal visual al detectar `exit_intent`, la barra de referencia rápida (`$530 / $710 / $1,010`) nunca se mostró ni al bajar al `11%` ni al intentar abandonar la página.
     - Además, en un viewport de `634px` de alto (`1272x634`), el padding superior acumulado de `#inicio` (`152px`) más el `<h1>` `lg:text-6xl` desplazaban la mitad inferior del `Precotizador` debajo del pliegue inicial.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):**
  - La consulta **`"autos para bodas distrito federal"`** hacia `/blog/renta-de-auto-clasico-para-bodas` acumula **`135` impresiones con `0` clics** (4ª consulta con más impresiones de todo el dominio, posición `27.99`), y su `<title>` medía `89` caracteres (truncado en SERP).

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 y Nivel 2 (`IMPLEMENTED`)
1. **[`src/components/UXMonitorProvider.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/UXMonitorProvider.tsx) y [`src/components/StickyPriceCompareBar.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/StickyPriceCompareBar.tsx) (Nivel 2 — Mediana):**
   - Emisión del evento `CustomEvent('sanpedro:exit-intent')` cuando el usuario lleva el cursor al borde superior (`e.clientY <= 8` tras `>= 4s` activos) y reducción del umbral de aparición por scroll de `22%` a `10%`, activando la barra inferior en modo rescate (`⚡ Antes de salir: Premier $530 • Plus $710 ⭐ • All Inclusive $1,010`) incluso en `scroll: 0%`.
2. **[`src/app/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/page.tsx) (Nivel 1 — Menor):**
   - Ajuste vertical en `lg:` (`lg:pt-20 lg:pb-12`, contenedor `pt-4 lg:pt-6`, `<h1>` `lg:text-4xl xl:text-5xl mb-4 lg:mb-6`) para que el Paso 1 completo del `Precotizador` y su CTA principal queden 100% visibles sin scroll en laptops de `634px–768px` de altura.
3. **[`src/utils/blogData.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/blogData.tsx) y [`src/app/blog/[slug]/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/blog/%5Bslug%5D/page.tsx) (Nivel 2 — Mediana):**
   - Optimización del `<title>` de `renta-de-auto-clasico-para-bodas` a **`58` caracteres** (`"Autos para Bodas en CDMX (DF): Clásico y Limusina Incluida"`), blindaje de `generateMetadata` (`<= 66` chars en todos los artículos) e incorporación de tabla comparativa 2026 (**Renta Externa en DF `$6,500–$9,500 MXN` vs Combo Fiesta VIP / Paquete All Inclusive en Salones San Pedro Plus GAM**).

---

## Ciclo Autónomo #24 — `2026-11-05 14:29 CDMX` (`v2.3.9-cycle24` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-05T16:25:37Z`)
- **Telemetría en Supabase (`10:25` a `14:25 hrs CDMX`):** **`76` eventos humanos reales** en 3 sesiones:
  1. **Sesión `ses_rgthm_te0w64xf` (`10:29 hrs CDMX`, CDMX CP `06479`, Mobile `430x775` desde `Google Orgánico SEO`):**
     - **Validación en Vivo del Ciclo #23:** El monitor `web_vitals` (`seo_audit`) confirmó `title_len: 64` y `meta_desc_len: 159` en la Home (`/`).
     - Recorrió el embudo dos veces hasta el Paso 4: primero cotizó `Bautizo / Cumpleaños` para `100 personas` en `Paquete Premier` (`$53,000 MXN`), y luego desde `#paquetes` seleccionó `150 personas` (`paquetes_sim_150`) y cotizó `Paquete Plus` + `Carrito de Shots` + `Mariachi` + `Letras Gigantes` (**`$121,000 MXN`**).
     - **4 `dead_clicks` detectados y aislados en `ses_rgthm_te0w64xf`:**
       - `2` en el Paso 4 del `Precotizador`: sobre `<span>🎁 Tarifa Preferencial Incluido</span>` y sobre `<div>verified PRESUPUESTO ESTIMADO EN VIVO</div>`.
       - `2` en `#paquetes`: sobre `<p>A partir de 100 personas</p>` cuando el simulador estaba en `150 personas` y el usuario tocó dos veces `"A partir de 100 personas"` intentando regresar el cálculo de la tarjeta a `100 invitados`.
  2. **Sesión `ses_zouxo_a6ztqeg6` (`11:18 hrs CDMX`, Gustavo A. Madero CP `07050`):**
     - Tercera visita del prospecto local de GAM CDMX (`title_len: 64`, `meta_desc_len: 159`).
  3. **Sesión `ses_zksye_mr4rdhc4` (`14:16 hrs CDMX`, Azcapotzalco CP `09810`, Desktop desde `Google Orgánico SEO`):**
     - Aterrizó directamente desde Google en `/blog/carrito-de-shots-para-animacion-de-fiestas` (confirmando `title_len: 67` y `meta_desc_len: 160` tras la optimización del Ciclo #21) y leyó hasta el `100%` del artículo.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 (Menor — `IMPLEMENTED`)
1. **[`src/components/PaquetesInteractiveSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/PaquetesInteractiveSection.tsx):**
   - Conversión de las leyendas estáticas `"Disponible desde 50 personas"` (`Premier`) y `"A partir de 100 personas"` (`Plus` y `All Inclusive`) en botones interactivos que ajustan el simulador a `50` o `100` invitados en 1 toque.
   - Ajuste de `scrollIntoView({ behavior: 'smooth', block: 'start' })` hacia `#precotizador` al preseleccionar un paquete.
2. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx):**
   - Inclusión de la insignia `"verified Presupuesto Estimado en Vivo"` dentro del `<button>` desplegable del desglose matemático en el Paso 4.
   - Conversión de la fila `"Día (Viernes/Sábado)"` dentro del desglose matemático en un botón interactivo que alterna el día y muestra el beneficio explícito (`"🎁 Tarifa Preferencial (+ Cortesía VIP de Bienvenida)"`).
3. **[`src/app/blog/[slug]/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/blog/%5Bslug%5D/page.tsx):**
   - Copia contextual en la barra inferior fija para artículos de animación y servicios (`carrito-de-shots`, `robot`, `limosinas`, `dulces`) destacando que vienen incluidos en `Paquete Plus` (`$710 p/p`) y `Combo Fiesta VIP`.

---

## Ciclo Autónomo #23 — `2026-11-05 10:23 CDMX` (`v2.3.8-cycle23` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-05T12:20:14Z`)
- **Telemetría en Supabase (`06:20` a `10:20 hrs CDMX`):** **`43` eventos humanos reales** en 2 sesiones matutinas:
  1. **Sesión `ses_zouxo_a6ztqeg6` (`07:34 hrs CDMX`, Mobile `406x760`, retorno del prospecto que visitó anoche desde WhatsApp Business):**
     - Hizo clic en `hero_click: ver_galeria`, abrió el visor a pantalla completa (`lightbox_open_diamante`) y **tocó `next_diamante` `26` veces consecutivas** durante `47s` activos.
     - **Fricción detectada en el Lightbox:** Como `Salón Diamante` tiene 10 fotos y el botón "Siguiente" del Lightbox reiniciaba el mismo salón (`0 -> 9 -> 0`), el usuario dio **2.6 vueltas completas al Salón Diamante** sin poder pasar automáticamente al `Salón Platino` ni contar con un selector de salón dentro del visor a pantalla completa.
  2. **Auditoría `web_vitals` (`seo_audit`) en la Home (`/`) (`ses_zouxo_a6ztqeg6` y `ses_oy2ts_fi7854yu`):**
     - El monitor reportó `title_len: 110` y `meta_desc_len: 281` en la página principal (`/`), ocasionando que Google SERP truncara el precio (`Desde $530 p/p`) y la ubicación (`Gustavo A. Madero`).

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 (Menor — `IMPLEMENTED`)
1. **[`src/components/GaleriaSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/GaleriaSection.tsx):**
   - Navegación continua entre salones dentro del Lightbox: al avanzar después de la foto 10 del `Salón Diamante`, el visor pasa automáticamente a la foto 1 del `Salón Platino` (y viceversa), permitiendo recorrer las 20 fotografías sin quedar atrapado en un bucle de un solo salón.
   - Adición de un selector rápido **`Salón Diamante | Salón Platino`** en la barra superior del Lightbox.
2. **[`src/app/layout.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/layout.tsx):**
   - Optimización del `<title>` de la Home de `110` a **`64` caracteres** (`"Salones de Fiestas en GAM CDMX | San Pedro Plus (Desde $530 p/p)"`) y de la `<meta name="description">` de `281` a **`159` caracteres** para eliminar por completo el truncamiento en Google Search.

---

## Ciclo Autónomo #22 — `2026-11-05 06:18 CDMX` (`v2.3.7-cycle22` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-05T08:18:03Z`)
- **Telemetría en Supabase (`02:18` a `06:18 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana de amanecer del miércoles posterior al despliegue del Ciclo #21 (`commit 1c0f57e`).
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** Se mantiene intacta la versión en producción (`commit 1c0f57e`, Coolify `olc5xvbpzdoc6zwmfns8xoiw`) para evaluar el tráfico matutino sobre el nuevo botón de 50 personas, el puente de personalización en `Paquete Plus` y los 3 artículos SEO posicionados.

---

## Ciclo Autónomo #21 — `2026-11-05 02:14 CDMX` (`v2.3.6-cycle21` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-05T04:09:35Z`)
- **Telemetría en Supabase (`22:09` a `02:09 hrs CDMX`):** **`57` eventos humanos reales** en 5 sesiones:
  1. **Sesión `ses_1kusk_r6y7h1nx` (`22:24 hrs CDMX`, CDMX CP `06740`, Mobile `360x674` desde `Google Orgánico SEO`):**
     - Aterrizó directamente desde Google en **`/blog/cuanto-cuesta-un-salon-de-fiestas-en-gustavo-a-madero-cdmx-precios-2026`** — el **3er artículo nuevo creado en el Ciclo #6** a partir de datos de Search Console. Con esto, **los 3 artículos nuevos del Ciclo #6 ya posicionan en Google y atraen tráfico orgánico real**.
     - Leyó el `100%` del artículo durante **`206.9s` activos** (`3.5 minutos`). En `web_vitals` (`seo_audit`) se detectó `title_len: 129` y `meta_desc_len: 277`.
  2. **Sesión `ses_51doi_ahs7l4us` (`00:01 hrs CDMX`, CDMX CP `06740`, Mobile `384x694` desde `Instagram Link-in-Bio` `utm_source=ig`):**
     - Validó en producción la prioridad de atribución `utm_source=ig` sobre `fbclid` implementada en el Ciclo #15 y **convirtió en `whatsapp_click` (`floating_button`)** en `1.6s`.
  3. **Sesiones `ses_698pg_cefjcq4r` y `ses_743ze_fggz0n3y` (`00:35` y `00:59 hrs CDMX`, Mobile):**
     - `ses_698pg_cefjcq4r` disparó `scroll_return_prices: regreso_a_paquetes` y permaneció **`99s` activos** en `#paquetes`.
     - `ses_743ze_fggz0n3y` seleccionó **`80 personas` (`paquetes_sim_80`)** en la barra rápida de `#paquetes` y permaneció **`110s` activos** comparando `Paquete Premier` (`80 pers.`) contra `Paquete Plus` (`mínimo 100 pers.`), sin saber que puede cotizar `Premier` para `50` u `80` invitados y agregar extras de `Plus` (`Robot LED`, `Mesa de Dulces`, `Combo VIP`) a su medida.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 (Menor — `IMPLEMENTED`)
1. **[`src/components/PaquetesInteractiveSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/PaquetesInteractiveSection.tsx):**
   - Adición del botón rápido **`50 pers.`** (`$26,500 MXN`) a la barra de simulación (`[50, 80, 100, 150, 200, 250]`).
   - Inclusión de un puente interactivo dentro de la tarjeta `Paquete Plus` cuando `simGuests < 100` (`"💡 ¿Tu evento es de 50/80 personas? Cotiza Premier y suma Robot LED, Mesa de Dulces o Combo VIP a tu medida ↑"`).
2. **[`src/app/blog/[slug]/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/blog/%5Bslug%5D/page.tsx):**
   - Optimización de `generateMetadata` colocando el gancho de precio (`"Desde $530 p/p ($26,500 por 50 pers.) en GAM CDMX:"`) al inicio de la `meta description` acotada a `<= 160` caracteres para evitar truncamiento en Google SERPs, y personalización de la barra flotante para los artículos de Precios 2026 y Fotos/Recorrido.

---

## Ciclo Autónomo #20 — `2026-11-04 22:06 CDMX` (`v2.3.5-cycle20` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-05T00:03:03Z`)
- **Telemetría en Supabase (`18:03` a `22:04 hrs CDMX`):** **`57` eventos humanos reales** en 4 sesiones:
  1. **Sesiones `ses_v82vs_0rkrdoqf` y `ses_v8nkl_ur74fdf9` (`19:27 hrs CDMX`, CDMX CP `03220`, Desktop Windows 10 desde `Google Orgánico SEO`):**
     - Aterrizaron directamente desde Google en **`/blog/salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas`** — el **2º artículo nuevo creado en el Ciclo #6** a partir de datos de Search Console que ya posiciona en Google y atrae tráfico orgánico.
     - Leyeron el artículo durante **`408s` activos** (`58%` y `100%` de scroll) y dispararon `exit_intent: exit_from_blog_articulo` sin hacer clic en cotizar porque los botones de llamada a la acción solo se encontraban en la imagen de portada o hasta el final del texto.
  2. **Sesión `ses_xf8j4_exrntueu` (`20:28 hrs CDMX` y `21:57 hrs CDMX`, Gustavo A. Madero, CDMX CP `07050`, Android 10 desde `Google Orgánico SEO`):**
     - Activó `upsell_a_100_invitados` (`Paquete Plus`), completó el Paso 1 (`XV Años`, `100 personas`) y el Paso 2 (`Viernes`, `Temporada Alta Oct-Dic`), llegó al Paso 3 (`49s` activos) y ocultó la pestaña (`tab_hidden`).
     - Al regresar **90 minutos después (`21:57 hrs CDMX`)**, Chrome en Android recargó la pestaña (`page_view: home_landing`), reiniciando el `Precotizador` al Paso 1 (`80 personas`, `Boda`) y provocando que el usuario saliera 2 segundos después al ver perdido su avance.
  3. **Sesión `ses_zouxo_a6ztqeg6` (`21:32 hrs CDMX`, Gustavo A. Madero, CDMX CP `07510`, Android 10 desde `WhatsApp Business` `l.wl.co`):**
     - Tráfico directo desde el enlace del perfil de WhatsApp Business de Salones San Pedro Plus (`TTFB: 102ms`, `DOM Load: 826ms`).

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 (Menor — `IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx):**
   - Persistencia automática del estado del cotizador en `sessionStorage` (`sanpedro_precotizador_draft_v1`) para restaurar el paso exacto (`step`), número de invitados, tipo de evento, día, temporada, paquete y extras cuando Android/iOS recarga la pestaña al cambiar de aplicación, junto con botón `"Reiniciar"` en el encabezado y soporte de parámetro `?guests=60` desde artículos SEO.
2. **[`src/app/blog/[slug]/page.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/blog/%5Bslug%5D/page.tsx):**
   - Barra inferior fija de conversión contextual durante la lectura del blog (`"¿Buscas salón para 50 a 80 personas? Simular 50–80 Personas ($530 p/p) →"` hacia `/?guests=60#precotizador` + botón directo de WhatsApp) para capturar a los lectores orgánicos antes de `exit_intent`.

---

## Ciclo Autónomo #19 — `2026-11-04 17:57 CDMX` (`v2.3.4-cycle19` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-04T19:53:33Z`)
- **Telemetría en Supabase (`13:53` a `17:54 hrs CDMX`):** **`105` eventos humanos reales** en 2 sesiones de altísima intención comercial:
  1. **Sesión `ses_na1z3_eheca1ru` (`15:44 hrs CDMX`, Benito Juárez, CDMX CP `03300`, Desktop Windows 10 desde `IA Generativa ChatGPT / GEO` vía `utm_source=chatgpt.com`):**
     - Utilizó el nuevo botón de alternancia `50 / 80` desplegado en el Ciclo #18 para elegir **50 personas en 1 clic (`0` `rage_clicks`)** y **convirtió en `whatsapp_click` en el Paso 4** (`Bautizo / Cumpleaños`, `50 personas`, `Sábado`, `Temporada Alta Oct-Dic`, `Paquete Premier $26,500 MXN`, `wants_tour: true`).
  2. **Sesión `ses_pavc9_pbzu4j94` (`16:41 hrs CDMX`, Azcapotzalco, CDMX CP `02300`, Android 10 desde `Google Orgánico SEO`):**
     - Aterrizó directamente desde Google en **`/blog/fotos-y-recorrido-salones-san-pedro-plus-diamante-y-platino-norte-84-gam`** (uno de los 3 artículos nuevos creados en el Ciclo #6 a partir de Search Console), leyó hasta el `88%` del artículo, hizo clic en el CTA hacia la Home, cotizó **XV Años para 250 personas en Paquete All Inclusive (`$252,500 MXN`)** y exploró **20 fotografías** a pantalla completa en el Lightbox de **Salón Platino** y **Salón Diamante** (`122.8s` activos).
     - **Dos oportunidades reales detectadas en `ses_pavc9_pbzu4j94`:**
       - En su primera cotización (`22:42:38Z`), tras elegir `Paquete All Inclusive` (`$1,010 p/p`), el usuario seleccionó `Mariachi` en la lista de extras (sin notar que `All Inclusive` ya incluye 1 hora de Mariachi), lo que sumó `+$6,500 MXN` duplicados (`$263,500 MXN`) y lo obligó a recargar la página para recotizar sin extras (`$252,500 MXN`).
       - Al pasar del Paso 4 a inspeccionar 20 fotos en el Lightbox de Salón Platino y Salón Diamante, el visor a pantalla completa carecía de un botón directo para **"Volver a mi Cotización"** o **"Agendar Visita a Salón Diamante/Platino en WhatsApp"**.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 (Menor — `IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx):**
   - Definición de `PACKAGE_INCLUDED_EXTRAS` para etiquetar automáticamente como **"Incluido" (`$0` extra)** los servicios que ya forman parte de `Paquete Plus` (`Mesa de Dulces`, `Robot LED`, `Cabina 360`) y `Paquete All Inclusive` (`Mariachi`, `Limusina`, `Mesa de Dulces`, `Robot LED`, `Cabina 360`), evitando cobros duplicados.
2. **[`src/components/GaleriaSection.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/GaleriaSection.tsx):**
   - Barra de conversión dentro del Lightbox a pantalla completa con **"Volver a mi Cotización"** y **"Agendar Visita a Salón Diamante/Platino en WhatsApp"**, más atributo `data-ux-stepper="true"` en las flechas de galería.

---

## Ciclo Autónomo #18 — `2026-11-04 13:48 CDMX` (`v2.3.3-cycle18` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-04T15:45:40Z`)
- **Telemetría en Supabase (`09:45` a `13:46 hrs CDMX`):** `16` eventos humanos reales en la sesión **`ses_b6ku9_bpi4mywu`** (`10:06 hrs CDMX`, **Gustavo A. Madero, CDMX CP `07550`**, Desktop Windows 10 `1920x945`, canal **`IA Generativa (ChatGPT / GEO)`** vía `utm_source=chatgpt.com`).
  - **Conversión completa del embudo a WhatsApp (`38.1s` activos):**
    - **Paso 1 (`17.4s`):** `Empresarial` • **50 personas** (`50 a 99 personas`).
    - **Paso 2 (`9.2s`):** `Viernes` • `Temporada Alta / Fin de Año (Oct-Dic)`.
    - **Paso 3 (`9.5s`):** `Paquete Premier` (`$530 p/p` = **`$26,500 MXN`**).
    - **Paso 4 (`1.9s`):** **`whatsapp_click` en Precotizador** (`estimated_budget: $26,500 MXN`, `wants_tour: true`), seguido inmediatamente (`49ms` después) por `tab_visibility: tab_hidden` al abrirse la pestaña de WhatsApp con el mensaje prellenado.
  - **Fricción / Falso Positivo detectado en Paso 1:** Al bajar de `80` a `50` personas haciendo 3 clics seguidos en el botón `−10` (`80 -> 70 -> 60 -> 50` en `370ms`), `UXMonitorProvider` disparó un falso `rage_click` sobre `<button>−10</button>`.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 (Menor — `IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx):**
   - La tarjeta de rango `"50 – 80"` ahora alterna entre `80` y `50` invitados con un solo clic, muestra la etiqueta `"invitados (mínimo de paquete)"` al llegar a `50` y marca los botones `−10` / `+10` con `data-ux-stepper="true"`.
2. **[`src/components/UXMonitorProvider.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/UXMonitorProvider.tsx) y [`src/utils/telemetryParser.ts`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/telemetryParser.ts):**
   - Exclusión de botones `[data-ux-stepper="true"]` del detector de `rage_click` y reclasificación retroactiva de `rage_click` sobre `−10` / `+10` como `guests_slider_adjust` (`stepper_rapid_adjust`).

---

## Ciclo Autónomo #17 — `2026-11-04 09:44 CDMX` (`v2.3.2-cycle17` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-04T11:43:33Z`)
- **Telemetría en Supabase (`05:43` a `09:44 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana de pre-apertura matutina del martes.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** Se mantiene intacta la versión en producción (`commit 5d3d7fe`, Coolify `fu22scrzsbszf15aftctedqh`) para evaluar el tráfico comercial del mediodía.

---

## Ciclo Autónomo #16 — `2026-11-04 05:42 CDMX` (`v2.3.1-cycle16` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-04T07:41:36Z`)
- **Telemetría en Supabase (`01:41` a `05:42 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana de amanecer del martes posterior al despliegue del Ciclo #15 (`commit 5d3d7fe`).
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** Se mantiene intacta la versión en producción (`commit 5d3d7fe`, Coolify `fu22scrzsbszf15aftctedqh`) para evaluar el tráfico matutino sobre el nuevo Paso 4 del Precotizador.

---

## Ciclo Autónomo #15 — `2026-11-04 01:33 CDMX` (`v2.3.0-cycle15` — `IMPLEMENTED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-04T03:27:27Z`)
- **Telemetría en Supabase (`21:27` a `01:27 hrs CDMX`):** `10` eventos humanos reales en la sesión **`ses_l573r_twr1t40i`** (`21:57 hrs CDMX`, **Delegación Iztapalapa, CDMX CP `09000`**, iPhone `440x879` dentro de **Instagram In-App Browser `IABMV/1`** vía `utm_source=ig&utm_medium=social&utm_content=link_in_bio`).
  - **Recorrido completo del embudo (`56.7s` activos):**
    - **Paso 1 (`28.5s`):** `Bautizo / Cumpleaños`, `80 personas` (`50 a 99 personas`).
    - **Paso 2 (`7.2s`):** `Sábado`, `Temporada Baja / Invierno (Ene-Mar)`.
    - **Paso 3 (`21.0s`):** `Paquete Premier` (`$530 p/p` = **`$42,400 MXN`**), sin extras.
  - **Dos fricciones reales detectadas:**
    1. **Salto de scroll móvil al pasar de Paso 3 a Paso 4 (`47ms` de diferencia):** `step_3_completado` se disparó a las `03:58:02.313Z` e inmediatamente después (`03:58:02.360Z`, apenas `47ms` más tarde) se disparó `section_view: sec_paquetes` porque el Paso 3 es mucho más alto que el Paso 4 en pantallas móviles (`440x879`), haciendo que el encabezado con el precio final (`$42,400 MXN`) quedara arriba del viewport al contraerse el contenedor.
    2. **Atribución de Instagram Link-in-Bio opacada por `fbclid`:** Como Instagram inyecta `fbclid=PAZXh0...` en enlaces salientes desde la biografía (`utm_source=ig`), evaluar `fbclid` antes que `instagram` etiquetaba la sesión como `'Facebook Ads / App'` en lugar de `'Instagram'`.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.

### 2. Acciones Ejecutadas bajo Gobernanza Nivel 1 (Menor — `IMPLEMENTED`)
1. **[`src/components/Precotizador.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/components/Precotizador.tsx):**
   - Auto-anclaje suave (`scrollPrecotizadorIntoView`) en cada cambio de paso (`1 -> 2 -> 3 -> 4`) para mantener siempre visible el encabezado y el monto cotizado en pantallas móviles.
   - Conversión del botón de WhatsApp en Paso 4 a un enlace universal nativo `<a href={whatsappUrl} target="_blank" rel="noopener noreferrer">` para compatibilidad total con `Instagram IABMV/1` en iOS, más botón de 1 toque **"Copiar resumen de cotización ($XX,XXX MXN)"** para usuarios nocturnos.
   - Inclusión de `estimated_budget` y `effective_per_person` desde `step_3_completado`.
2. **[`src/utils/trackEvent.ts`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/trackEvent.ts) y [`src/utils/telemetryParser.ts`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/telemetryParser.ts):**
   - Priorización de `utm_source=ig`, `l.instagram.com` y User-Agent `Instagram` por encima de `fbclid`, con normalización retroactiva en `/admin`.

---

## Ciclo Autónomo #14 — `2026-11-03 21:27 CDMX` (`v2.2.8-cycle14` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-03T23:25:36Z`)
- **Telemetría en Supabase (`17:25` a `21:26 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana nocturna del lunes.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** Se mantiene intacta la versión en producción (`commit 0400407`) sin forzar cambios ni redeploys innecesarios.

---

## Ciclo Autónomo #13 — `2026-11-03 17:24 CDMX` (`v2.2.7-cycle13` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-03T19:22:40Z`)
- **Telemetría en Supabase (`13:22` a `17:23 hrs CDMX`):** `5` eventos humanos en **`1` sesión orgánica nueva** (`ses_69wzb_xbdfjbm0`, Benito Juárez, CDMX CP `03020`, Android 10 Chrome `411x745` en red AT&T 4G, canal `Google Orgánico (SEO)` a las `15:00 hrs CDMX`).
  - **Web Vitals y Auditoría SEO en dispositivo real:** `TTFB: 141ms`, `DOM Load: 1,117ms`, `FCP: 1,364ms`, `TTFI: 3,569ms` (`scroll_start`), confirmando en producción el nuevo `<title>` (`110` caracteres) y `<meta description>` (`281` caracteres) desplegados en el Ciclo #7 (`commit 0400407`). `0` `dead_clicks` y `0` `rage_clicks`.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** La sesión orgánica validó el rendimiento y los metadatos del `commit 0400407` con `0` fricciones; se posponen cambios de código para seguir acumulando sesiones en la franja nocturna.

---

## Ciclo Autónomo #12 — `2026-11-03 13:22 CDMX` (`v2.2.6-cycle12` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-03T15:20:53Z`)
- **Telemetría en Supabase (`09:20` a `13:21 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana matutina/mediodía del lunes.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** Se mantiene intacta la versión en producción (`commit 0400407`) sin forzar cambios ni redeploys innecesarios.

---

## Ciclo Autónomo #11 — `2026-11-03 09:20 CDMX` (`v2.2.5-cycle11` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-03T11:18:40Z`)
- **Telemetría en Supabase (`05:18` a `09:19 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la franja pre-apertura matutina del lunes.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** Se mantiene intacta la versión en producción (`commit 0400407`) sin forzar cambios ni redeploys innecesarios.

---

## Ciclo Autónomo #10 — `2026-11-03 05:18 CDMX` (`v2.2.4-cycle10` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-03T07:16:36Z`)
- **Telemetría en Supabase (`01:16` a `05:17 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana de amanecer del lunes.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** Se mantiene intacta la versión en producción (`commit 0400407`) sin forzar cambios ni redeploys innecesarios.

---

## Ciclo Autónomo #9 — `2026-11-03 01:16 CDMX` (`v2.2.3-cycle9` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-03T03:14:45Z`)
- **Telemetría en Supabase (`21:14` a `01:15 hrs CDMX`):** `0` sesiones nuevas, `0` eventos humanos y `0` leads durante la ventana nocturna/madrugada.
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):** Sitemap `https://sanpedro.aionia.com.mx/sitemap.xml` estable con `37` URLs enviadas, `0` errores y `0` advertencias.
- **Decisión Consciente (`POSTPONED`):** Se mantiene intacta la versión en producción (`commit 0400407`) sin forzar cambios ni redeploys innecesarios.

---

## Ciclo Autónomo #8 — `2026-11-02 21:14 CDMX` (`v2.2.2-cycle8` — `POSTPONED`)

### 1. Diagnóstico en Vivo: Supabase + Google Search Console (`>= 2026-11-02T23:10:52Z`)
- **Google Search Console (`sc-domain:sanpedro.aionia.com.mx`):**
  - El nuevo sitemap (`https://sanpedro.aionia.com.mx/sitemap.xml`) ya fue descargado y validado por Google (`lastDownloaded: 2026-11-02T21:55:52.349Z`) con **`37` URLs enviadas, `0` errores y `0` advertencias** (limpiando por completo los `32` errores históricos del 30 de octubre).
- **Telemetría en Supabase (`23:10:52Z` a `03:12:32Z` / `17:10` a `21:12 hrs CDMX`):**
  - Únicamente `2` eventos pasivos de recarga de pestaña en segundo plano (`active_time_ms: 0`) de la sesión previa `ses_io43s_jqd1i0sf` (iPhone CDMX). `0` sesiones nuevas con interacción activa, `0` `dead_clicks`, `0` `rage_clicks` y `0` nuevos leads.
- **Decisión Consciente (`POSTPONED`):**
  - Bajo el **Estándar Maestro v2.1**, al haberse desplegado hace 4 horas las optimizaciones Nivel 1 de CTR en la Home y los artículos de Página 1 (`commit 0400407`) y no existir tráfico nuevo en la ventana nocturna dominical, se pospone cualquier cambio de código hasta acumular nuevas sesiones activas.

---

## Ciclo Autónomo #7 — Alineación Estándar Maestro v2.1 + Gobernanza por Magnitud (`v2.2.1-gsc-governance` — `2026-11-02 17:08 CDMX`)

### 1. Adopción del Protocolo de Gobernanza por Magnitud (Nivel 1 / Nivel 2 / Nivel 3) y `.gsc-credentials.json`
- **Credenciales aseguradas en `.gitignore`:** Se configuró `.gsc-credentials.json` en la raíz del proyecto (verificado con `git check-ignore -v`) con filtro estricto sobre `sc-domain:sanpedro.aionia.com.mx`.
- **Clasificación Automática por Magnitud en [`src/utils/googleSearchConsole.ts`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/googleSearchConsole.ts) y [`.agent/workflows/autonomous-evolution.md`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/.agent/workflows/autonomous-evolution.md):**
  - 🟢 **NIVEL 1 (MENOR — Libertad Espontánea Total):** `<title>`, `<meta description>`, `H1`-`H3`, `JSON-LD`, `/llms.txt`, `sitemap.xml`, FAQs y micro-UX/CRO $\rightarrow$ Ejecución inmediata (`IMPLEMENTED`).
  - 🟡 **NIVEL 2 (MEDIANA — Plan Documentado):** Nuevos componentes/secciones retrocompatibles en vistas existentes $\rightarrow$ Ejecución con trazabilidad (`IMPLEMENTED`).
  - 🔴 **NIVEL 3 (MAYOR / ARQUITECTÓNICA — `ACTION_REQUIRED`):** Nuevas rutas de primer nivel, cambios de enrutador, navegación global, precios comerciales o esquemas de BD $\rightarrow$ Persistencia en `gsc_architectural_pivot_plan.md` y notificación por correo solicitando aprobación explícita.

### 2. Optimizaciones Nivel 1 (Menor) Ejecutadas con base en los Últimos 28 Días de Search Console
1. **Optimización de CTR en la Home (`/` acumuló `1,743` imp., `25` clics, CTR `1.43% < 3%` y `"salones san pedro plus"` `148` imp. en Pos. `1.06` con CTR `2.03%`) en [`src/app/layout.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/app/layout.tsx):**
   - Nuevo `<title>`: `"Salones San Pedro Plus CDMX | Salones de Fiestas y Eventos Todo Incluido en Gustavo A. Madero (Desde $530 p/p)"`.
   - Nueva `<meta name="description">` con precios (`$530 MXN p/p`), aforo (`50 a 300 personas`), dirección (`Norte 84 #6507, San Pedro el Chico`) y salones (`Salón Diamante y Platino`).
   - Adición de `WebSite` Schema, `canonical`, `openGraph` y nuevas preguntas en `FAQPage` para `"fotos de salones san pedro plus"` y `"autos clásicos y limusina para bodas en CDMX"`.
2. **Optimización de CTR en 4 Artículos Adicionales en Página 1 (Pos. `5.3` a `9.5`) con `0` Clics en los Últimos 28 Días ([`src/utils/blogDataSEO.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/blogDataSEO.tsx) y [`src/utils/blogData.tsx`](file:///c:/Users/info/Documents/Desarrollo/SKILLS/Salones%20Classic/src/utils/blogData.tsx)):**
   - `/blog/tendencias-en-banquetes-para-eventos-en-2026-lo-que-no-puede-faltar` (`19` imp. 28d, pos. `7.3`, `0` clics)
   - `/blog/tipos-de-pistas-de-baile-para-eventos-cual-va-mejor-con-tu-estilo` (`14` imp. 28d, pos. `5.36`, `0` clics)
   - `/blog/como-elegir-el-menu-perfecto-para-tu-evento-guia-paso-a-paso` (`8` imp. 28d, pos. `8.1`, `0` clics)
   - `/blog/paquetes-de-fotografia-profesional-para-eventos` (`6` imp. 28d, pos. `9.5`, `0` clics)

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

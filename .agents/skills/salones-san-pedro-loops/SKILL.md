---
name: salones-san-pedro-loops
description: Runbook modular de los 2 Loops Autónomos de Salones San Pedro Plus bajo el Estándar Maestro v4.0 (Loop 1 Principal de Autoperfeccionamiento Consciente UX/CRO/SEO/GEO y Loop 2 Secundario Meta-Agente Auditor de Prompts).
---

# 🧠 Skill Modular: Loops Autónomos de Salones San Pedro Plus (v4.0)

Activa esta skill cada vez que se dispare cualquiera de los **2 Loops Oficiales** del proyecto **Salones San Pedro Plus (`https://sanpedro.aionia.com.mx`)**.

---

## 🔒 Paso 0 Obligatorio en Ambos Loops: Verificación Criptográfica (`SHA-256`)
Antes de ejecutar cualquier diagnóstico o edición:
```powershell
node .agents/scripts/verify_immutable_guardrails.js --verify
```
Si el código de salida es distinto de `0`, aborta inmediatamente y alerta al usuario.

---

## ⚡ LOOP 1 (Loop Principal): Autoperfeccionamiento Consciente UX + CRO + SEO + GEO + Monitores Autónomos
- **Horario Diurno (`CRON_TZ=America/Mexico_City`):** `15 9,13,17,21 * * *` (`09:15`, `13:15`, `17:15` y `21:15 hrs CDMX` — **Cero Madrugada**).
- **Enrutamiento de Modelo Sugerido:**
  - Pulso sin tráfico humano nuevo (`0` eventos): **Gemini 4 Hydrogen (`Low` / `Medium`)**.
  - Pulso con eventos humanos, mejoras Nivel 1–2 o sincronización SEO/GEO: **Gemini 4 Hydrogen (`High`)** o **Gemini 4 Argon (`Medium` / `High`)**.

### Protocolo Paso a Paso del Loop 1:
1. **Corte Estricto de Telemetría (`Supabase` + `Google Search Console`):**
   - Consultar `analytics_events` y `leads` estrictamente posteriores al timestamp del último corte (`event_type=eq.autonomous_evolution_log&order=created_at.desc&limit=1`).
   - **Esquema Exacto de `public.analytics_events` (Cero Errores HTTP 400 / Ahorro de Tokens):**
     - Columnas de lectura/escritura: `id`, `event_type`, `source`, `path`, `user_agent`, `created_at` (no existen columnas `metadata` ni `event_data`).
     - Para extraer el payload enriquecido de `trackEvent.ts`, buscar el delimitador exacto `__UX_META__:` dentro de `user_agent` (`const idx = ua.indexOf('__UX_META__:'); const meta = idx !== -1 ? JSON.parse(ua.slice(idx + 12)) : {};`).
     - Para insertar el registro del ciclo (`autonomous_evolution_log`), enviar `{ event_type: 'autonomous_evolution_log', source: '<version>:<status>', path: '/admin#autonomous-evolution', user_agent: JSON.stringify(cyclePayload) }`.
   - Evaluar señales de los **Monitores UX Autónomos**:
     - `dead_click`, `rage_click`, `text_copy`, `scroll_return_prices`, `exit_intent`.
     - Errores JS en cliente, discrepancias de hidratación SSR/CSR, latencia (`web_vitals`) y áreas táctiles móviles (`>= 44×44 px`).
     - Embudo de 4 pasos de `src/components/Precotizador.tsx` (aforo mínimo oficial: **`100 personas`**, precios base: `Premier $530`, `Plus $710`, `All Inclusive $1,010`) y su puente bidireccional (`sessionStorage['sanpedro_precotizador_draft_v1']` + evento `ssp:sync-from-precotizador`) con `GaleriaSection.tsx` (incluyendo el Lightbox), `PaquetesInteractiveSection.tsx`, `TikTokVideos.tsx`, `MenuTinderCards.tsx` y `StickyPriceCompareBar.tsx`.
   - **Heurísticas UX/CRO Validadas Empíricamente (Meta-Auditoría #2):**
     - **Saltos de Embudo sin Pérdida de Contexto:** Cuando un CTA externo salta directo al Paso 3 o Paso 4 del `Precotizador`, esos pasos deben incluir píldoras interactivas `1-Tap` para `Tipo de Evento` y `Día Preferido` antes del botón de WhatsApp.
     - **Cierre Determinista en Barras Flotantes:** Todo botón de cierre (`✕`) en barras controladas por scroll debe invocar simultáneamente `setDismissed(true)` y `setVisible(false)`, y el render debe evaluar `(dismissed || !visible)`.
     - **Visibilidad Above-the-Fold en Laptops `1366×768` (`height ~636px`):** Mantener el `<h1>` dentro de la columna izquierda (`lg:w-1/2`) del Hero para alinear `<Precotizador />` al borde superior y evitar que el botón de avance del Paso 1 quede oculto bajo el pliegue.
   - Consultar `sc-domain:sanpedro.aionia.com.mx` vía Google Search Console API (`.gsc-credentials.json`) y aplicar **`SKILL SEO JRGC 202611 (v3.0)`** (`.agents/skills/skill-seo-jrgc-202611/SKILL.md` + `.agents/references/seo-jrgc-contexto-proyecto.md`):
     - **Higiene Automática en Cada Corte:** Ejecutar `node .agents/skills/skill-seo-jrgc-202611/scripts/audit_seo_jrgc.mjs https://sanpedro.aionia.com.mx` para verificar `score >= 95`, `<title> <= 60c`, `<meta description> <= 160c`, `max-image-preview:large`, paridad `1:1` del `NAP` (`Calle Norte 84 No. 6507, Col. San Pedro el Chico`) con Schema 2026 (`@graph` `EventVenue`/`LocalBusiness`; `FAQPage` retenido solo por semántica RAG/IA sin prometer rich snippets retirados), presencia del bloque de Autocalificación Honesta (*Fit / No-Fit*), primera pantalla móvil en `5` segundos (`390×664 px`), accesibilidad `WCAG 2.2 AA` (`>= 44×44 px`, `alt`, `aria-label`) y **cero clichés IA / *marketese* / datos no verificados (*Claim Gate*)**.
     - **Ciclo *Rankings Push* con Enfriamiento Obligatorio (`3–4` semanas / `21–28` días):** Cuando GSC muestre URLs en posiciones `8–20` (*Striking Distance*), `4–7` comerciales o `1–5` con CTR bajo, aplicar **máximo `1` cambio SEO atribuible por ciclo** en esa URL, registrar la línea base fechada en `.agents/references/seo-jrgc-contexto-proyecto.md` y **respetar la ventana de enfriamiento de `3–4` semanas** antes de volver a editar `<title>`, `<meta description>` o `H1` de esa misma URL.
     - **Auto-enriquecimiento Continuo (*Claim Gate*):** Cada vez que la telemetría o GSC revele nuevas objeciones, dudas reales (`text_copy`, pasos del cotizador) o cambios en la SERP, actualizar `.agents/references/seo-jrgc-contexto-proyecto.md` con evidencia fechada y enviar cualquier mejora que requiera datos no confirmados a la lista **"Para hacer esto verdad"**.
2. **Clasificación bajo Gobernanza (Grupo A / Grupo B y Nivel 1 / 2 / 3):**
   - **Nivel 1 (Menor) y Nivel 2 (Mediano 100% retrocompatible):** Implementar de inmediato, validar `0` errores con `npx tsc --noEmit`, hacer `git commit` + `git push origin main` y desplegar en Coolify (`jpgg3sovj8zh2mec0e54sfws`).
   - **Nivel 3 (Mayor / Arquitectónico / Comercial):** No ejecutar en automático; registrar propuesta técnica en `.agents/state/persistent_suggestions_queue.json` con estado `EN_ANALISIS_MAYOR`.
3. **Protocolo Anti-Spam de Correos (`Resend`) y Registro en Bitácora:**
   - Registrar siempre el resultado del pulso en `.agents/state/prompt_performance_ledger.jsonl`, `src/utils/autonomousEvolutionData.ts`, `AUTONOMOUS_EVOLUTION_LOG.md` y Supabase (`autonomous_evolution_log`).
   - **Regla Cero Spam:** Si el pulso diurno tuvo `0` eventos humanos nuevos, `0` cambios implementados y `0` ítems nuevos en la cola (`POSTPONED` silencioso), **no enviar correo en los cortes intermedios (`09:15` o `17:15`)**; consolidar como máximo en los **2 cortes ejecutivos diarios (`13:15` y `21:15 CDMX`)** o enviar de inmediato cuando el estado sea `IMPLEMENTED` / `ACTION_REQUIRED`.
   - Todo correo HTML enviado a `aloomushi@gmail.com` y `caballeroangela49@gmail.com` **DEBE incluir al final la Tabla Persistente Completa de Pendientes por Resolver** leída de `.agents/state/persistent_suggestions_queue.json`.

---

## 🧬 LOOP 2 (Loop Secundario de Periodo Más Largo): Meta-Agente Auditor de Prompts (`meta-prompt-auditor`)
- **Horario Programado (`CRON_TZ=America/Mexico_City`):** `0 20 1,6,11,16,21,26 * *` (Días `1, 6, 11, 16, 21 y 26` de cada mes a las `20:00 hrs CDMX`, o cada `10` ciclos efectivos del Loop 1).
- **Enrutamiento de Modelo Sugerido:** **Gemini 4 Carbon (`High`)** o **Gemini 4 Argon (`High`)**.

### Protocolo Paso a Paso del Loop 2:
1. **Verificación Previa SHA-256:** Ejecutar `node .agents/scripts/verify_immutable_guardrails.js --verify`.
2. **Auditoría Empírica de Desempeño de Prompts:**
   - Leer `.agents/state/prompt_performance_ledger.jsonl` y `.agents/state/persistent_suggestions_queue.json`.
   - Evaluar qué mejoras del Loop 1 redujeron `dead_clicks` / `rage_clicks` / `exit_intent`, cuáles generaron clics a WhatsApp (`whatsapp_click`, `cotizar_click`), cuántos tokens/pasos consumió cada corte y qué propuestas de la cola aprobó o descartó el usuario.
3. **Autoperfeccionamiento Local (Proyecto):**
   - Refinar `.agents/rules/reglas_autonomas_proyecto.md` (**únicamente fuera del bloque `IMMUTABLE_GUARDRAILS`**) y este archivo `.agents/skills/salones-san-pedro-loops/SKILL.md` para:
     - Eliminar instrucciones redundantes o verbosas que consumen tokens sin aportar.
     - Añadir heurísticas UX/CRO/SEO/GEO comprobadas empíricamente en Salones San Pedro Plus.
     - Recalibrar el enrutamiento de modelos según complejidad real.
4. **Autoperfeccionamiento Global (Prompt Maestro Universal v4.0):**
   - Cuando se valide un patrón universal aplicable a todos los proyectos futuros, guardar respaldo fechado en `.agents/state/master_prompt_history/` y actualizar `C:\Users\info\Desktop\prompt_maestro_ecosistema_autonomo_universal.md`.
5. **Verificación Posterior SHA-256 y Reporte de Diff:**
   - Ejecutar `node .agents/scripts/verify_immutable_guardrails.js --verify` tras editar. Si falla, revertir de inmediato (`git checkout -- .agents/rules/reglas_autonomas_proyecto.md`).
   - Hacer `git commit` + `git push` de las mejoras del prompt y enviar reporte ejecutivo con el `diff` exacto aplicado.

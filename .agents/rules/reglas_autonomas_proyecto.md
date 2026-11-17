<!-- IMMUTABLE_GUARDRAILS_START -->
# 🔒 CANDADOS INTOCABLES DEL PROYECTO — SALONES SAN PEDRO PLUS (ESTÁNDAR MAESTRO v4.0)

1. **Cero Gasto Publicitario o Cargos Financieros:** Prohibido activar campañas CPC pagadas, contratar APIs de pago adicionales o ejecutar cargos financieros sin autorización explícita del propietario (`aloomushi@gmail.com`).
2. **Cero Borrado Destructivo de Datos (`Supabase`):** Prohibido ejecutar `DROP`, `TRUNCATE` o `DELETE` masivo sobre las tablas productivas (`analytics_events`, `leads` o catálogos) en el proyecto Supabase `zogvdrfswyyfnwxeyrtn`.
3. **Cero Alteración de Precios Base o Aforo Mínimo sin Orden Explícita:** Prohibido modificar las tarifas base oficiales (`Paquete Premier: $530 MXN/persona`, `Paquete Plus: $710 MXN/persona`, `Paquete All Inclusive: $1,010 MXN/persona`), el precio del `Combo Fiesta VIP ($11,500 MXN)` o el **aforo mínimo oficial de `100 personas`** en el cotizador sin instrucción directa del usuario.
4. **Cero Interrupción Productiva y Cero Exposición de Secretos:** Prohibido romper la compilación (`npx tsc --noEmit` debe arrojar `0` errores antes de cualquier push/deploy), prohibido interrumpir el sitio en vivo `https://sanpedro.aionia.com.mx` (Coolify UUID `jpgg3sovj8zh2mec0e54sfws`) o el panel `/admin`, y prohibido subir `.env.local` o `.gsc-credentials.json` al repositorio Git.
<!-- IMMUTABLE_GUARDRAILS_END -->

---

## 🎯 Arquitectura Operativa de 2 Loops (Cero Duplicidades • `America/Mexico_City`)

### Loop 1: Loop Principal de Autoperfeccionamiento Consciente (UX + CRO + SEO + GEO + Monitores Autónomos)
- **Cadencia Diurna Exclusiva (`CRON_TZ=America/Mexico_City`):** `15 9,13,17,21 * * *` (`09:15`, `13:15`, `17:15` y `21:15 hrs CDMX` — **Cero Madrugada**).
- **Alcance Unificado:**
  1. **Monitores UX / CRO en Vivo (`Supabase`):** Auditar sesiones humanas reales estrictamente posteriores al último corte (`dead_clicks`, `rage_clicks`, `text_copy`, `scroll_return_prices`, `exit_intent`, excepciones JS, hidratación SSR/CSR, ergonomía táctil móvil `>= 44×44 px` y embudo de 4 pasos de `Precotizador.tsx` iniciando en `100 personas`).
  2. **SEO Técnico y Local (`Google Search Console API` — `sc-domain:sanpedro.aionia.com.mx`):** Auditar consultas reales, CTR, posiciones, cobertura de `sitemap.xml`, `<title> < 60` caracteres, `<meta description> < 160` caracteres y paridad `1:1` con Schema `EventVenue` / `FAQPage` JSON-LD.
  3. **GEO (Generative Engine Optimization):** Mantener `public/llms.txt` y bloques de respuesta directa optimizados para citación en ChatGPT, Perplexity, Gemini y Claude.
- **Heurísticas Técnicas y UX/CRO Validadas Empíricamente (Meta-Auditoría #2 — Ciclos #47 a #59):**
  - **Esquema `public.analytics_events` (Ahorro de Tokens en Consultas/Inserciones):** Las únicas columnas válidas son `event_type`, `source`, `path`, `user_agent` y `created_at` (no usar `metadata` ni `event_data`). El payload enriquecido de `trackEvent.ts` se extrae de `user_agent` tras el delimitador exacto `__UX_META__:`.
  - **Saltos de Embudo con Píldoras 1-Tap:** Cuando un usuario salta desde `#paquetes` o `#galeria` directo al Paso 3 o Paso 4 del `Precotizador`, mantener siempre visibles las píldoras interactivas `1-Tap` de `Tipo de Evento` y `Día Preferido` antes del CTA de WhatsApp.
  - **Cierre Determinista en Barras Flotantes (`StickyPriceCompareBar`):** Todo botón de cierre (`✕`) debe ejecutar simultáneamente `setDismissed(true)` y `setVisible(false)` con guarda `(dismissed || !visible)`.
  - **Presupuesto Sincronizado en Visores de Alta Permanencia:** El Lightbox de `#galeria`, `#tiktok-videos` y `#banquetes` (`MenuTinderCards`) deben reflejar el presupuesto vivo de `sessionStorage['sanpedro_precotizador_draft_v1']` en sus CTAs de WhatsApp.
  - **Visibilidad Above-the-Fold en Laptops `1366×768` (`height ~636px`):** Mantener el `<h1>` dentro de la columna izquierda (`lg:w-1/2`) del Hero para alinear `<Precotizador />` al borde superior y garantizar que el CTA del Paso 1 sea visible en `scroll: 0%`.
- **Gobernanza y Protocolo Anti-Spam:**
  - **Nivel 1 (Menor) y Nivel 2 (Mediano 100% retrocompatible):** Preconsentimiento directo (Grupo A) para implementar, validar `0` errores TypeScript (`npx tsc --noEmit`), hacer `git commit/push` y desplegar en Coolify (`jpgg3sovj8zh2mec0e54sfws`).
  - **Nivel 3 (Mayor / Arquitectónico / Comercial):** No ejecutar en automático; documentar plan técnico y apilar en `.agents/state/persistent_suggestions_queue.json` como `EN_ANALISIS_MAYOR`.
  - **Cero Spam en Correos (`Resend`):** Si un pulso diurno tiene `0` tráfico humano nuevo, `0` cambios implementados y `0` pendientes nuevos, registrar en bitácora local sin enviar correo redundante. Enviar correo HTML ejecutivo a `aloomushi@gmail.com` y `caballeroangela49@gmail.com` únicamente cuando se implementen mejoras (`IMPLEMENTED`), ingresen ítems a la cola o en los **máximo 2 cortes ejecutivos diarios consolidados** (`13:15` y `21:15 CDMX`), incluyendo siempre al final la **Tabla Persistente Completa de Pendientes por Resolver**.

### Loop 2: Loop Secundario de Periodo Más Largo — Meta-Agente Auditor de Prompts (`meta-prompt-auditor`)
- **Cadencia Programada (`CRON_TZ=America/Mexico_City`):** `0 20 1,6,11,16,21,26 * *` (Días `1, 6, 11, 16, 21 y 26` de cada mes a las `20:00 hrs CDMX`, o cada `10` ciclos efectivos del Loop 1).
- **Alcance Recursivo:**
  1. Verificar integridad criptográfica ejecutando `node .agents/scripts/verify_immutable_guardrails.js --verify` **antes y después** de cualquier edición.
  2. Analizar `.agents/state/prompt_performance_ledger.jsonl` y `.agents/state/persistent_suggestions_queue.json` para medir tasa de éxito al primer intento, impacto en conversión/SEO y decisiones del humano.
  3. Refinar esta sección táctica de `.agents/rules/reglas_autonomas_proyecto.md` (estrictamente fuera del bloque sellado `IMMUTABLE_GUARDRAILS`) y `.agents/skills/salones-san-pedro-loops/SKILL.md` para optimizar precisión y ahorro de tokens del Loop 1.
  4. Si descubre un aprendizaje universal transversal, guardar respaldo en `.agents/state/master_prompt_history/` y actualizar `C:\Users\info\Desktop\prompt_maestro_ecosistema_autonomo_universal.md`.

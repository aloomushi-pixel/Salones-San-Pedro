---
description: Flujo de Autoperfeccionamiento Consciente (Estándar Maestro v2.1 + Google Search Console API + Gobernanza por Magnitud + Modo GOAL)
---

# Workflow Autónomo v2.1 — Salones San Pedro Plus (`sanpedro.aionia.com.mx`)

## 1. Identificadores Oficiales del Proyecto
- **Proyecto:** `Salones San Pedro Plus (Salones Classics)`
- **Dominio Oficial:** `https://sanpedro.aionia.com.mx`
- **Propiedad Google Search Console (Filtro Estricto):** `sc-domain:sanpedro.aionia.com.mx` (`siteOwner` vía `.gsc-credentials.json` / `GOOGLE_SEARCH_CONSOLE_CREDENTIALS_B64`)
- **Supabase Project ID:** `zogvdrfswyyfnwxeyrtn` (`https://zogvdrfswyyfnwxeyrtn.supabase.co`)
- **Coolify Application UUID:** `jpgg3sovj8zh2mec0e54sfws`
- **Notificaciones por Correo (Resend API):** `aloomushi@gmail.com` y `caballeroangela49@gmail.com`

---

## 2. Protocolo de Ejecución en Cada Ciclo (`schedule` — 14,400s / 4h)

1. **Corte Estricto Post-Commit en Supabase:**
   - Consultar `analytics_events` con `created_at > [timestamp_del_último_deploy]` para evitar duplicar diagnósticos de ciclos previos.
2. **Consulta en Vivo a Google Search Console (`sc-domain:sanpedro.aionia.com.mx`, últimos 28 días):**
   - Extraer Top Consultas (`query`), Top Páginas (`page`), Sitemaps (`/sitemaps`) y detectar oportunidades en **Striking Distance (`4.0` a `15.0`)** y **Bajo CTR en Página 1 (`< 3%`)**.
3. **Clasificación y Gobernanza por Magnitud (Nivel 1 / Nivel 2 / Nivel 3):**
   - **🟢 NIVEL 1 (MENOR — Libertad Espontánea Total):** Optimización de `<title>`, `<meta name="description">`, `H1`-`H3`, `alt`, enlaces canónicos, `JSON-LD` (`EventVenue`, `LocalBusiness`, `WebSite`, `FAQPage`, `BreadcrumbList`), `/llms.txt`, `sitemap.xml`, FAQs basadas en consultas reales, micro-UX/CRO, corrección de `dead_clicks`/`rage_clicks`. **Se ejecuta, compila (`tsc --noEmit` + `npm run build`) y despliega de inmediato (`status = "IMPLEMENTED"`).**
   - **🟡 NIVEL 2 (MEDIANA — Libertad Operativa con Plan Documentado):** Nuevos componentes/secciones o calculadoras dentro de vistas existentes 100% retrocompatibles sin alterar rutas globales ni esquema de BD. **Se documenta e implementa en el mismo ciclo (`status = "IMPLEMENTED"`).**
   - **🔴 NIVEL 3 (MAYOR / ARQUITECTÓNICA — Requiere Autorización Explícita `ACTION_REQUIRED`):** Nuevas rutas de primer nivel, reestructuración de enrutador, cambios en navegación global, precios comerciales o esquemas de base de datos. **No se ejecuta todavía; se persiste en el artifact `gsc_architectural_pivot_plan.md`, se guarda el ciclo con `status = "ACTION_REQUIRED"` y se solicita aprobación por correo al usuario manteniendo el timer activo a `14400` segundos.**

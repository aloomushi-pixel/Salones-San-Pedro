'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  getOrInitMonitorState,
  recordFirstInteraction,
  trackEvent,
  updateMonitorScroll,
  updateMonitorVisibility,
} from '@/utils/trackEvent';
import CookieConsentBanner from './CookieConsentBanner';

export default function UXMonitorProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const scrollMilestonesRef = useRef<Set<number>>(new Set());
  const seenSectionsRef = useRef<Set<string>>(new Set());
  const sectionDwellRef = useRef<Record<string, number>>({});
  const activeSectionRef = useRef<string>('inicio');
  const recentClicksRef = useRef<Array<{ t: number; x: number; y: number }>>([]);
  const deadClickCountRef = useRef<number>(0);
  const flushedExitRef = useRef<boolean>(false);
  const exitIntentTrackedRef = useRef<boolean>(false);
  const returnToPricesTrackedRef = useRef<boolean>(false);
  const wentBelowPricesRef = useRef<boolean>(false);
  const lastScrollYRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(Date.now());
  const scrollSpeedSamplesRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname.startsWith('/admin')) return;

    getOrInitMonitorState();
    scrollMilestonesRef.current.clear();
    seenSectionsRef.current.clear();
    sectionDwellRef.current = {};
    flushedExitRef.current = false;
    exitIntentTrackedRef.current = false;
    returnToPricesTrackedRef.current = false;
    wentBelowPricesRef.current = false;
    scrollSpeedSamplesRef.current = [];

    const defaultSec = pathname.startsWith('/blog/')
      ? 'blog_articulo'
      : pathname === '/blog'
      ? 'blog_indice'
      : 'inicio';
    activeSectionRef.current = defaultSec;

    // 1. Registrar vista de página (page_view)
    trackEvent('page_view', pathname === '/' ? 'home_landing' : pathname, {
      section: defaultSec,
      blog_slug: pathname.startsWith('/blog/') ? pathname.replace('/blog/', '') : undefined,
    });

    // 2. Medir Web Vitals + Auditoría Técnica SEO On-Page en Tiempo Real
    const perfTimeout = setTimeout(() => {
      try {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        const paintEntries = performance.getEntriesByType('paint');
        const nav = navEntries[0];
        const fcpEntry = paintEntries.find((p) => p.name === 'first-contentful-paint');

        const ttfb_ms = nav ? Math.round(nav.responseStart - nav.requestStart) : undefined;
        const dom_load_ms = nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : undefined;
        const fcp_ms = fcpEntry ? Math.round(fcpEntry.startTime) : undefined;

        // Auditoría SEO On-Page automática de la página actual
        const h1Els = document.querySelectorAll('h1');
        const h2Els = document.querySelectorAll('h2');
        const imgEls = Array.from(document.querySelectorAll('img'));
        const imgsMissingAlt = imgEls.filter((img) => !img.getAttribute('alt') || img.getAttribute('alt')?.trim() === '').length;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const h1Text = h1Els[0]?.innerText?.replace(/\s+/g, ' ').trim().slice(0, 90) || 'Sin H1';

        trackEvent('web_vitals', pathname, {
          section: activeSectionRef.current,
          timers: {
            ttfb_ms: ttfb_ms && ttfb_ms > 0 ? ttfb_ms : undefined,
            fcp_ms: fcp_ms && fcp_ms > 0 ? fcp_ms : undefined,
            dom_load_ms: dom_load_ms && dom_load_ms > 0 ? dom_load_ms : undefined,
          },
          extra: {
            seo_audit: {
              title_len: document.title.length,
              meta_desc_len: metaDesc.length,
              h1_count: h1Els.length,
              h1_text: h1Text,
              h2_count: h2Els.length,
              img_total: imgEls.length,
              img_missing_alt: imgsMissingAlt,
            },
          },
        });
      } catch {
        // Ignorar si el navegador no soporta PerformanceNavigationTiming
      }
    }, 2200);

    // 3. Observar secciones con IntersectionObserver + Cronómetro de permanencia + Detección de Re-lectura de Precios
    const observedElements = document.querySelectorAll('[data-ux-section], section[id]');
    const visibleRatios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const secName = el.getAttribute('data-ux-section') || el.id || defaultSec;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            visibleRatios.set(secName, entry.intersectionRatio);
            if (!seenSectionsRef.current.has(secName)) {
              seenSectionsRef.current.add(secName);
              trackEvent('section_view', `sec_${secName}`, { section: secName });
            }

            // Detectar si bajó más allá de paquetes y luego regresó a paquetes o precotizador
            if (secName === 'galeria' || secName === 'banquetes' || secName === 'animacion' || secName === 'testimonios' || secName === 'ubicacion') {
              wentBelowPricesRef.current = true;
            }
            if (
              wentBelowPricesRef.current &&
              !returnToPricesTrackedRef.current &&
              (secName === 'paquetes' || secName === 'inicio')
            ) {
              returnToPricesTrackedRef.current = true;
              trackEvent('scroll_return_prices', `regreso_a_${secName}`, {
                section: secName,
                element_text: `Usuario regresó a revisar ${secName} tras explorar el resto de la página`,
              });
            }
          } else {
            visibleRatios.delete(secName);
          }
        });

        let bestSec = activeSectionRef.current;
        let maxRatio = 0;
        visibleRatios.forEach((ratio, sec) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            bestSec = sec;
          }
        });
        activeSectionRef.current = bestSec;
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    observedElements.forEach((el) => observer.observe(el));

    // Reloj cada 1 segundo para acumular tiempo activo por sección
    const dwellInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const sec = activeSectionRef.current || defaultSec;
        sectionDwellRef.current[sec] = (sectionDwellRef.current[sec] || 0) + 1000;
      }
    }, 1000);

    // 4. Listener de Scroll, Velocidad de Lectura y Primera Interacción
    let scrollTicking = false;
    const handleScroll = () => {
      const ttfi = recordFirstInteraction();
      if (ttfi !== null) {
        trackEvent('first_interaction', 'scroll_start', {
          section: activeSectionRef.current,
          timers: { ttfi_ms: ttfi },
        });
      }

      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const now = Date.now();
          const dt = Math.max(16, now - lastScrollTimeRef.current);
          const dy = Math.abs(window.scrollY - lastScrollYRef.current);
          if (dt < 1000 && dy > 5) {
            const speedPxPerSec = Math.round((dy / dt) * 1000);
            if (scrollSpeedSamplesRef.current.length < 40) {
              scrollSpeedSamplesRef.current.push(speedPxPerSec);
            }
          }
          lastScrollYRef.current = window.scrollY;
          lastScrollTimeRef.current = now;

          const docHeight =
            Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) -
            window.innerHeight;
          const pct = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 100;
          updateMonitorScroll(pct, activeSectionRef.current);

          const milestones = [25, 50, 75, 100];
          for (const m of milestones) {
            if (pct >= m && !scrollMilestonesRef.current.has(m)) {
              scrollMilestonesRef.current.add(m);
              trackEvent('scroll_depth', `scroll_${m}%`, {
                section: activeSectionRef.current,
                scroll_pct: m,
              });
            }
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    // 5. Detector de Rage Clicks, Dead Clicks e Interacción con Tarjetas de Paquetes
    const handleGlobalClick = (e: MouseEvent) => {
      const ttfi = recordFirstInteraction();
      if (ttfi !== null) {
        trackEvent('first_interaction', 'first_click', {
          section: activeSectionRef.current,
          timers: { ttfi_ms: ttfi },
        });
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const now = Date.now();
      const x = e.clientX;
      const y = e.clientY;

      recentClicksRef.current = recentClicksRef.current.filter(
        (c) => now - c.t < 850 && Math.hypot(c.x - x, c.y - y) < 45
      );
      recentClicksRef.current.push({ t: now, x, y });

      const cleanText = (
        target.innerText ||
        target.getAttribute('alt') ||
        target.getAttribute('aria-label') ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 70);

      if (recentClicksRef.current.length >= 3) {
        recentClicksRef.current = [];
        trackEvent('rage_click', `rage_${activeSectionRef.current}`, {
          section: activeSectionRef.current,
          element_tag: target.tagName.toLowerCase(),
          element_text: cleanText || 'elemento_sin_texto',
        });
        return;
      }

      const interactiveAncestor = target.closest(
        'a, button, input, select, textarea, label, [role="button"], [data-interactive="true"], video, iframe'
      );

      if (!interactiveAncestor && deadClickCountRef.current < 6) {
        const tag = target.tagName.toLowerCase();
        if (
          (cleanText.length >= 3 && cleanText.length <= 65) ||
          tag === 'img' ||
          tag === 'h3' ||
          tag === 'h4' ||
          tag === 'span' ||
          tag === 'li'
        ) {
          deadClickCountRef.current += 1;
          trackEvent('dead_click', `dead_${activeSectionRef.current}`, {
            section: activeSectionRef.current,
            element_tag: tag,
            element_text: cleanText || `[${tag}]`,
          });
        }
      }
    };

    // 6. Detector de Copiado de Texto
    const handleCopy = () => {
      try {
        const selected = window.getSelection()?.toString().replace(/\s+/g, ' ').trim();
        if (selected && selected.length >= 3) {
          trackEvent('text_copy', `copy_${activeSectionRef.current}`, {
            section: activeSectionRef.current,
            copied_text: selected.slice(0, 100),
          });
        }
      } catch {
        // Ignorar
      }
    };

    // 7. Detector de Intención de Salida (Exit Intent en Desktop)
    const handleMouseLeaveViewport = (e: MouseEvent) => {
      if (exitIntentTrackedRef.current) return;
      if (e.clientY <= 8) {
        const st = getOrInitMonitorState();
        if (st && st.activeTimeMs >= 4000) {
          exitIntentTrackedRef.current = true;
          trackEvent('exit_intent', `exit_from_${activeSectionRef.current}`, {
            section: activeSectionRef.current,
            element_text: `Intento de salida mientras veía ${activeSectionRef.current}`,
          });
        }
      }
    };

    // 8. Calcular patrón de lectura (Lectura Atenta vs Escaneo Rápido)
    const getReadingBehaviorMode = (): string => {
      const samples = scrollSpeedSamplesRef.current;
      if (samples.length === 0) return 'Fijo en Primera Pantalla';
      const avgSpeed = samples.reduce((a, b) => a + b, 0) / samples.length;
      if (avgSpeed < 420) return 'Lectura Detenida / Atenta';
      if (avgSpeed < 950) return 'Exploración Moderada';
      return 'Escaneo Rápido (Skimming)';
    };

    // 9. Visibilidad de pestaña y salida de sesión
    const flushSessionSummary = (reason: string) => {
      if (flushedExitRef.current) return;
      flushedExitRef.current = true;

      let topSection = activeSectionRef.current;
      let topDwell = 0;
      Object.entries(sectionDwellRef.current).forEach(([sec, ms]) => {
        if (ms > topDwell) {
          topDwell = ms;
          topSection = sec;
        }
      });

      trackEvent(
        'session_exit',
        reason,
        {
          section: topSection,
          element_text: getReadingBehaviorMode(),
          timers: {
            section_dwell_ms: topDwell,
          },
          extra: {
            section_dwell_map_ms: sectionDwellRef.current,
            last_section: activeSectionRef.current,
            reading_mode: getReadingBehaviorMode(),
          },
        },
        true
      );
    };

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      const stats = updateMonitorVisibility(isVisible);
      if (!isVisible) {
        let topSection = activeSectionRef.current;
        let topDwell = 0;
        Object.entries(sectionDwellRef.current).forEach(([sec, ms]) => {
          if (ms > topDwell) {
            topDwell = ms;
            topSection = sec;
          }
        });
        trackEvent(
          'tab_visibility',
          'tab_hidden',
          {
            section: topSection,
            tab_switches: stats.tabSwitchCount,
            element_text: getReadingBehaviorMode(),
            timers: {
              active_time_ms: Math.round(stats.activeTimeMs),
              hidden_time_ms: Math.round(stats.hiddenTimeMs),
              section_dwell_ms: topDwell,
            },
            extra: {
              section_dwell_map_ms: sectionDwellRef.current,
              reading_mode: getReadingBehaviorMode(),
            },
          },
          true
        );
      }
    };

    const handlePageHide = () => {
      flushSessionSummary('page_unload');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleGlobalClick, { passive: true });
    document.addEventListener('copy', handleCopy);
    document.addEventListener('mouseleave', handleMouseLeaveViewport);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      clearTimeout(perfTimeout);
      clearInterval(dwellInterval);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('mouseleave', handleMouseLeaveViewport);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [pathname]);

  return (
    <>
      {children}
      <CookieConsentBanner />
    </>
  );
}

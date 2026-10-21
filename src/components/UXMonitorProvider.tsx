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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname.startsWith('/admin')) return;

    getOrInitMonitorState();
    scrollMilestonesRef.current.clear();
    seenSectionsRef.current.clear();
    sectionDwellRef.current = {};
    flushedExitRef.current = false;

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

    // 2. Medir Web Vitals y tiempos técnicos de carga para SEO (una vez por carga)
    const perfTimeout = setTimeout(() => {
      try {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        const paintEntries = performance.getEntriesByType('paint');
        const nav = navEntries[0];
        const fcpEntry = paintEntries.find((p) => p.name === 'first-contentful-paint');

        const ttfb_ms = nav ? Math.round(nav.responseStart - nav.requestStart) : undefined;
        const dom_load_ms = nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : undefined;
        const fcp_ms = fcpEntry ? Math.round(fcpEntry.startTime) : undefined;

        if (ttfb_ms || dom_load_ms || fcp_ms) {
          trackEvent('web_vitals', pathname, {
            section: activeSectionRef.current,
            timers: {
              ttfb_ms: ttfb_ms && ttfb_ms > 0 ? ttfb_ms : undefined,
              fcp_ms: fcp_ms && fcp_ms > 0 ? fcp_ms : undefined,
              dom_load_ms: dom_load_ms && dom_load_ms > 0 ? dom_load_ms : undefined,
            },
          });
        }
      } catch {
        // Ignore si el navegador no soporta PerformanceNavigationTiming
      }
    }, 2500);

    // 3. Observar secciones con IntersectionObserver + Cronómetro de permanencia por sección
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
          } else {
            visibleRatios.delete(secName);
          }
        });

        // Determinar la sección con mayor visibilidad actual
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

    // 4. Listener de Scroll y Primera Interacción
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
          const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          ) - window.innerHeight;
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

    // 5. Detector de Rage Clicks y Dead Clicks
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

      // Filtrar clics de los últimos 850ms cercanos en radio de 45px
      recentClicksRef.current = recentClicksRef.current.filter(
        (c) => now - c.t < 850 && Math.hypot(c.x - x, c.y - y) < 45
      );
      recentClicksRef.current.push({ t: now, x, y });

      const cleanText = (target.innerText || target.getAttribute('alt') || target.getAttribute('aria-label') || '')
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

      // Verificar si fue un clic en un elemento NO interactivo (Dead Click)
      const interactiveAncestor = target.closest(
        'a, button, input, select, textarea, label, [role="button"], [data-interactive="true"], video, iframe'
      );

      if (!interactiveAncestor && deadClickCountRef.current < 6) {
        const tag = target.tagName.toLowerCase();
        // Si hace clic en un texto corto, insignia, imagen o tarjeta estática esperando acción
        if (
          (cleanText.length >= 3 && cleanText.length <= 65) ||
          tag === 'img' ||
          tag === 'h3' ||
          tag === 'h4' ||
          tag === 'span'
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

    // 6. Detector de Copiado de Texto (alta intención / compartición en familia)
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

    // 7. Visibilidad de pestaña y salida de sesión (con tiempos por sección)
    const flushSessionSummary = (reason: string) => {
      if (flushedExitRef.current) return;
      flushedExitRef.current = true;

      // Enviar la sección donde más tiempo pasó el usuario y el mapa completo en extra
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
          timers: {
            section_dwell_ms: topDwell,
          },
          extra: {
            section_dwell_map_ms: sectionDwellRef.current,
            last_section: activeSectionRef.current,
          },
        },
        true
      );
    };

    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      const stats = updateMonitorVisibility(isVisible);
      if (!isVisible) {
        // Enviar pulso de permanencia cuando oculta la pestaña o minimiza en móvil
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
            timers: {
              active_time_ms: Math.round(stats.activeTimeMs),
              hidden_time_ms: Math.round(stats.hiddenTimeMs),
              section_dwell_ms: topDwell,
            },
            extra: {
              section_dwell_map_ms: sectionDwellRef.current,
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
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      clearTimeout(perfTimeout);
      clearInterval(dwellInterval);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('copy', handleCopy);
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

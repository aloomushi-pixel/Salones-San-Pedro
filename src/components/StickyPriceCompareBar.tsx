'use client';

import React, { useEffect, useState } from 'react';
import { trackEvent } from '@/utils/trackEvent';

export default function StickyPriceCompareBar() {
  const [visible, setVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [exitRescueTriggered, setExitRescueTriggered] = useState(false);
  const [precotizadorInView, setPrecotizadorInView] = useState(true);
  const [syncedGuests, setSyncedGuests] = useState(100);
  const [syncedDay, setSyncedDay] = useState<'sabado' | 'viernes_domingo' | 'entre_semana'>('sabado');
  const [syncedPkg, setSyncedPkg] = useState('Plus');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readDraft = () => {
      try {
        const raw = window.sessionStorage.getItem('sanpedro_precotizador_draft_v1');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (typeof parsed.guests === 'number' && parsed.guests >= 100 && parsed.guests <= 250) {
          setSyncedGuests(parsed.guests);
        }
        if (typeof parsed.packageType === 'string') {
          setSyncedPkg(parsed.packageType);
        }
        if (parsed.preferredDay === 'Viernes' || parsed.preferredDay === 'Domingo') {
          setSyncedDay('viernes_domingo');
        } else if (parsed.preferredDay === 'Entre Semana') {
          setSyncedDay('entre_semana');
        } else {
          setSyncedDay('sabado');
        }
      } catch {
        // Ignore sessionStorage errors
      }
    };
    readDraft();

    const handleSync = (evt: Event) => {
      const customEvt = evt as CustomEvent<{
        guests?: number;
        preferredDay?: string;
        packageType?: string;
      }>;
      const detail = customEvt.detail || {};
      if (typeof detail.guests === 'number' && detail.guests >= 100 && detail.guests <= 250) {
        setSyncedGuests(detail.guests);
      }
      if (typeof detail.packageType === 'string') {
        setSyncedPkg(detail.packageType);
      }
      if (detail.preferredDay === 'Viernes' || detail.preferredDay === 'Domingo') {
        setSyncedDay('viernes_domingo');
      } else if (detail.preferredDay === 'Entre Semana') {
        setSyncedDay('entre_semana');
      } else if (detail.preferredDay === 'Sábado') {
        setSyncedDay('sabado');
      }
    };

    window.addEventListener('ssp:sync-from-precotizador', handleSync as EventListener);
    return () => window.removeEventListener('ssp:sync-from-precotizador', handleSync as EventListener);
  }, []);

  const selectPackageFromModal = (pkgName: 'Premier' | 'Plus' | 'All Inclusive', pricePerPerson: number) => {
    setOpenModal(false);
    setExitRescueTriggered(false);
    trackEvent('cotizar_click', `sticky_modal_elegir_${pkgName.toLowerCase().replace(/\s+/g, '_')}`, {
      section: 'sticky_price_bar',
      package_name: `Paquete ${pkgName}`,
      guests_range: `${syncedGuests} personas`,
      extra: {
        exact_guests: syncedGuests,
        estimated_budget: syncedGuests * pricePerPerson,
      },
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ssp:open-precotizador-package', {
          detail: {
            pkg: pkgName,
            guests: syncedGuests,
            preferredDay: syncedDay,
          },
        })
      );
      const el =
        document.getElementById('precotizador') ||
        document.getElementById('precotizador-hero');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const target =
      document.getElementById('precotizador') ||
      document.getElementById('precotizador-hero');
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setPrecotizadorInView(entry.isIntersecting && entry.intersectionRatio >= 0.08);
        }
      },
      { threshold: [0, 0.08, 0.2] }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      // Ocultar siempre que el Precotizador esté visible en pantalla (evita que el usuario móvil confunda "Cotizar Ahora ↑" con el botón Siguiente del wizard)
      if (precotizadorInView && !exitRescueTriggered) {
        setVisible(false);
        return;
      }
      setVisible(exitRescueTriggered || (pct >= 24 && pct <= 88));
    };

    const handleExitIntent = () => {
      if (dismissed) return;
      setExitRescueTriggered(true);
      setVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('sanpedro:exit-intent', handleExitIntent as EventListener);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('sanpedro:exit-intent', handleExitIntent as EventListener);
    };
  }, [dismissed, exitRescueTriggered, precotizadorInView]);

  if (!visible && !openModal) return null;

  return (
    <>
      {visible && (
        <div
          data-interactive="true"
          className={`fixed bottom-4 left-3 right-24 sm:left-6 sm:right-28 z-[90] max-w-3xl mx-auto bg-[#121212]/95 text-white border ${
            exitRescueTriggered
              ? 'border-amber-400 ring-2 ring-amber-400/30'
              : 'border-primary/40'
          } rounded-2xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300`}
        >
          <div className="flex items-center justify-between sm:justify-start gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              <span className="hidden md:inline-block text-[10px] font-extrabold uppercase tracking-wider text-primary">
                {exitRescueTriggered ? '⚡ Antes de salir:' : 'Referencia Rápida:'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 font-semibold text-[11px]">
                Premier <strong className="text-primary">$530</strong>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-primary/20 border border-primary/40 font-semibold text-[11px]">
                Plus <strong className="text-primary">$710 ⭐</strong>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 font-semibold text-[11px]">
                All Inclusive <strong className="text-primary">$1,010</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Ocultar barra de precios"
              className="sm:hidden text-white/60 hover:text-white text-xs px-1.5 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setOpenModal(true);
                trackEvent('cotizar_click', 'sticky_bar_comparar_paquetes', {
                  section: 'sticky_price_bar',
                });
              }}
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-colors cursor-pointer"
            >
              ¿Qué incluye cada uno?
            </button>
            <a
              href="#precotizador"
              onClick={(e) => {
                e.preventDefault();
                setExitRescueTriggered(false);
                setVisible(false);
                trackEvent('cotizar_click', 'sticky_bar_ir_precotizador', {
                  section: 'sticky_price_bar',
                });
                const el =
                  document.getElementById('precotizador') ||
                  document.getElementById('precotizador-hero');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-[11px] font-extrabold uppercase tracking-wider text-center hover:opacity-95 transition-opacity"
            >
              Cotizar Ahora ↑
            </a>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Cerrar barra de referencia"
              className="hidden sm:inline-flex text-white/50 hover:text-white text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE COMPARACIÓN RÁPIDA SIN PERDER POSICIÓN DE SCROLL (NEUTRALIZA SCROLL_RETURN_PRICES) */}
      {openModal && (
        <div
          className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-surface-container-lowest text-on-surface border border-outline-variant/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant/30 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary block">
                  Comparativa Instantánea • Calculado para {syncedGuests} Invitados
                </span>
                <h3 className="font-display-lg text-xl sm:text-2xl font-bold mt-0.5">
                  Resumen de Paquetes Salones San Pedro Plus
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display-lg text-base font-bold text-primary">Premier</span>
                    <span className="text-lg font-black">$530 p/p</span>
                  </div>
                  <p className="text-[11px] font-bold text-on-surface bg-surface-container-high px-2.5 py-1 rounded-lg">
                    Total {syncedGuests} pers.: <span className="text-primary">${(syncedGuests * 530).toLocaleString('es-MX')} MXN</span>
                  </p>
                  <ul className="space-y-1.5 text-on-surface pt-1">
                    <li>✓ 6 hrs de servicio + 1/2 hr recepción</li>
                    <li>✓ Menú formal a 3 tiempos + Tornafiesta</li>
                    <li>✓ Barra libre de mezcladores (descorche libre)</li>
                    <li>✓ DJ, iluminación LED y batucada clásica</li>
                    <li>✓ Montaje imperial con mesa de cristal</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => selectPackageFromModal('Premier', 530)}
                  className="w-full py-2.5 px-3 rounded-xl bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Elegir Premier (${(syncedGuests * 530).toLocaleString('es-MX')}) →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display-lg text-base font-bold text-primary">
                      Plus ⭐ Más Elegido
                    </span>
                    <span className="text-lg font-black">$710 p/p</span>
                  </div>
                  <p className="text-[11px] font-bold text-on-surface bg-primary/20 px-2.5 py-1 rounded-lg">
                    Total {syncedGuests} pers.: <span className="text-primary">${(syncedGuests * 710).toLocaleString('es-MX')} MXN</span>
                  </p>
                  <ul className="space-y-1.5 text-on-surface pt-1 font-medium">
                    <li>✓ Todo lo de Premier + <strong>7 hrs de servicio</strong></li>
                    <li>✓ <strong>Menú formal a 4 tiempos</strong></li>
                    <li>✓ <strong>Robot LED</strong> y batucada espectacular</li>
                    <li>✓ <strong>Mesa de dulces + Cabina fotográfica</strong></li>
                    <li>✓ <strong>Letras gigantes + Carrito de shots</strong></li>
                    <li>✓ <strong>Pre-fiesta para 30 personas</strong> (L a J, 4 hrs)</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => selectPackageFromModal('Plus', 710)}
                  className="w-full py-2.5 px-3 rounded-xl bg-primary text-on-primary font-extrabold uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer shadow-md"
                >
                  Elegir Plus ⭐ (${(syncedGuests * 710).toLocaleString('es-MX')}) →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display-lg text-base font-bold text-primary">
                      All Inclusive
                    </span>
                    <span className="text-lg font-black">$1,010 p/p</span>
                  </div>
                  <p className="text-[11px] font-bold text-on-surface bg-surface-container-high px-2.5 py-1 rounded-lg">
                    Total {syncedGuests} pers.: <span className="text-primary">${(syncedGuests * 1010).toLocaleString('es-MX')} MXN</span>
                  </p>
                  <ul className="space-y-1.5 text-on-surface pt-1">
                    <li>✓ Todo lo del Paquete Plus incluido</li>
                    <li>✓ <strong>1 hora de Mariachi</strong> en vivo</li>
                    <li>✓ <strong>Servicio de Limusina</strong> de lujo</li>
                    <li>✓ <strong>Robot Iron Man</strong> en batucada</li>
                    <li>✓ <strong>Video filmación y fotos con álbum</strong></li>
                    <li>✓ <strong>Vino espumoso + 1 botella/mesa + Cabina 360</strong></li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => selectPackageFromModal('All Inclusive', 1010)}
                  className="w-full py-2.5 px-3 rounded-xl bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Elegir All Inclusive (${(syncedGuests * 1010).toLocaleString('es-MX')}) →
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong className="text-primary">🔥 Tip Intermedio:</strong> ¿Quieres el Paquete{' '}
                <strong>Premier ($530)</strong> o <strong>Plus ($710)</strong> con{' '}
                <strong>Limusina + Carrito de Shots + Letras Gigantes</strong>? Agrégalos en el Paso 3 con el{' '}
                <strong>Combo Fiesta VIP (+$11,500 MXN, 20% de descuento)</strong>.
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="#precotizador"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenModal(false);
                    trackEvent('cotizar_click', 'modal_comparador_ir_precotizador', {
                      section: 'sticky_price_bar',
                    });
                    const el =
                      document.getElementById('precotizador') ||
                      document.getElementById('precotizador-hero');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold uppercase tracking-wider text-center"
                >
                  Armar mi Cotización ↑
                </a>
                <a
                  href={`https://wa.me/526633670431?text=${encodeURIComponent(
                    `¡Hola Salones San Pedro Plus! Revisé la comparativa de paquetes para ${syncedGuests} invitados (me interesa el Paquete ${syncedPkg}) y me gustaría confirmar disponibilidad de fechas.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setOpenModal(false);
                    trackEvent('whatsapp_click', 'modal_comparador_whatsapp', {
                      section: 'sticky_price_bar',
                      package_name: `Paquete ${syncedPkg}`,
                      guests_range: `${syncedGuests} personas`,
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold uppercase tracking-wider text-center"
                >
                  Pedir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

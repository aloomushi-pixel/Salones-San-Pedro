'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { trackEvent } from '@/utils/trackEvent';

interface Photo {
  src: string;
  alt: string;
  caption: string;
}

const diamantePhotos: Photo[] = [
  {
    src: '/galeria/diamante/diamante_1.jpg',
    alt: 'Vista panorámica del Salón Diamante con pista de baile LED y techo estrellado',
    caption: 'Vista Panorámica de la Pista LED y Salón Diamante',
  },
  {
    src: '/galeria/diamante/diamante_2.jpg',
    alt: 'Vista amplia del salón Diamante con pista LED y mesas redondas vestidas de rosa',
    caption: 'Distribución del Salón con Montaje de Gala Rosa',
  },
  {
    src: '/galeria/diamante/diamante_3.jpg',
    alt: 'Escenario principal del salón Diamante con letras gigantes de LOVE',
    caption: 'Escenario Principal y Letras LOVE Iluminadas',
  },
  {
    src: '/galeria/diamante/diamante_4.jpg',
    alt: 'Mesa imperial número 1 montada con vajilla fina y pista de baile al fondo',
    caption: 'Mesa Imperial de Honor y Pista al Fondo',
  },
  {
    src: '/galeria/diamante/diamante_5.jpg',
    alt: 'Detalle de mesa número 1 con cristalería y centro de mesa floral alto',
    caption: 'Detalle de Montaje de Mesa e Iluminación en Mesa 1',
  },
  {
    src: '/galeria/diamante/diamante_6.jpg',
    alt: 'Primer plano de centro de mesa alto con flores blancas y azules',
    caption: 'Centro de Mesa de Cristal con Arreglo Floral Elegante',
  },
  {
    src: '/galeria/diamante/diamante_7.jpg',
    alt: 'Detalle de mesa número 2 con vajilla de filo dorado y servilletas azules en Salón Diamante',
    caption: 'Vajilla con Filo Dorado y Servilletas de Lujo en Mesa 2',
  },
  {
    src: '/galeria/diamante/diamante_8.jpg',
    alt: 'Detalle de mesa con vajilla blanca, servilleta azul y centro de mesa alto iluminado en Salón Diamante',
    caption: 'Mesa Montada de Gala con Vajilla Fina y Servilletas Azules',
  },
  {
    src: '/galeria/diamante/diamante_9.jpg',
    alt: 'Detalle de mesa número 6 con vajilla fina y servilletas de gala azules',
    caption: 'Vajilla de Gala con Copas y Servilletas Azules',
  },
  {
    src: '/galeria/diamante/diamante_10.jpg',
    alt: 'Mesa número 6 vestida con mantelería fina y servilletas rosas para XV Años',
    caption: 'Montaje de Mesa para Quince Años (XV) con Vajilla y Servilletas Rosas',
  },
];

const platinoPhotos: Photo[] = [
  {
    src: '/galeria/platino/platino_1.jpg',
    alt: 'Entrada del Salón Platino decorada con arco de globos azules y negros',
    caption: 'Acceso Principal al Salón Platino',
  },
  {
    src: '/galeria/platino/platino_2.jpg',
    alt: 'Detalle de mesa montada con servilletas azules y centro de mesa floral en Salón Platino',
    caption: 'Montaje de Gala - Mesa de Honor para XV Años',
  },
  {
    src: '/galeria/platino/platino_3.jpg',
    alt: 'Vista amplia de las mesas y candelabro esférico en Salón Platino',
    caption: 'Distribución de Mesas e Iluminación del Salón',
  },
  {
    src: '/galeria/platino/platino_4.jpg',
    alt: 'Mampara de shinty azul y arco de globos para set de fotografías en Salón Platino',
    caption: 'Set Fotográfico - Mampara Shimmer y Globos',
  },
  {
    src: '/galeria/platino/platino_5.jpg',
    alt: 'Vista panorámica de la pista de baile iluminada con letras gigantes en Salón Platino',
    caption: 'Vista General con Pista LED y Escenario Principal',
  },
  {
    src: '/galeria/platino/platino_6.jpg',
    alt: 'Mesa número 6 montada con cristalería y servilletas de gala en Salón Platino',
    caption: 'Mesa Imperial y Vajilla Fina en Mesa 6',
  },
  {
    src: '/galeria/platino/platino_7.jpg',
    alt: 'Primer plano de centro de mesa alto con flores blancas y fondo de pista LED en Salón Platino',
    caption: 'Arreglos Florales de Alta Gama',
  },
  {
    src: '/galeria/platino/platino_8.jpg',
    alt: 'Vista amplia del Salón Platino con mantelería de gala y pista de baile',
    caption: 'Distribución del Espacio y Pista de Baile LED',
  },
  {
    src: '/galeria/platino/platino_9.jpg',
    alt: 'Detalle de cubiertos y mantelería en mesa número 4 en Salón Platino',
    caption: 'Montaje de Cubiertos e Iluminación en Mesa 4',
  },
  {
    src: '/galeria/platino/platino_10.jpg',
    alt: 'Mesa número 1 montada con arco de globos en Salón Platino',
    caption: 'Detalle de Mesa 1 y Set con Globos al Fondo',
  },
];

export default function GaleriaSection() {
  const [activeTab, setActiveTab] = useState<'diamante' | 'platino'>('diamante');
  const [diamanteIndex, setDiamanteIndex] = useState(0);
  const [platinoIndex, setPlatinoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [userPausedAutoScroll, setUserPausedAutoScroll] = useState(false);

  // Estado sincronizado con el Precotizador (sessionStorage + evento en vivo) para convertir usuarios como ses_9pg0p_leigmtcj que bajan a ver fotos tras cotizar
  const [syncedGuests, setSyncedGuests] = useState(100);
  const [syncedEventKind, setSyncedEventKind] = useState('Evento');
  const [syncedDay, setSyncedDay] = useState('Viernes / Sábado');
  const [syncedPkg, setSyncedPkg] = useState('Premier');
  const [hasActiveDraft, setHasActiveDraft] = useState(false);

  const touchStartXRef = useRef<number | null>(null);

  const photos = activeTab === 'diamante' ? diamantePhotos : platinoPhotos;
  const activeIndex = activeTab === 'diamante' ? diamanteIndex : platinoIndex;
  const canonicalCategory = activeTab === 'diamante' ? 'Salón Diamante' : 'Salón Platino';

  const syncedUnitPrice =
    syncedPkg === 'Premier' ? 530 : syncedPkg === 'All Inclusive' ? 1010 : 710;
  const syncedTotal = syncedGuests * syncedUnitPrice;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readDraft = () => {
      try {
        const raw = window.sessionStorage.getItem('sanpedro_precotizador_draft_v1');
        if (raw) {
          const saved = JSON.parse(raw);
          if (typeof saved.guests === 'number' && saved.guests >= 100 && saved.guests <= 250) {
            setSyncedGuests(saved.guests);
          }
          if (typeof saved.eventKind === 'string' && saved.eventKind) {
            setSyncedEventKind(saved.eventKind);
          }
          if (typeof saved.preferredDay === 'string' && saved.preferredDay) {
            setSyncedDay(saved.preferredDay);
          }
          if (typeof saved.packageType === 'string' && saved.packageType) {
            setSyncedPkg(saved.packageType);
          }
          if ((saved.step && saved.step >= 2) || saved.hasTouchedGuests) {
            setHasActiveDraft(true);
          }
        }
      } catch {
        // Ignorar errores de sessionStorage
      }
    };
    readDraft();

    const onSync = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        if (typeof detail.guests === 'number') setSyncedGuests(Math.max(100, detail.guests));
        if (typeof detail.eventKind === 'string') setSyncedEventKind(detail.eventKind);
        if (typeof detail.preferredDay === 'string') setSyncedDay(detail.preferredDay);
        if (typeof detail.packageType === 'string') setSyncedPkg(detail.packageType);
        setHasActiveDraft(true);
      }
    };
    window.addEventListener('ssp:sync-from-precotizador', onSync);
    return () => window.removeEventListener('ssp:sync-from-precotizador', onSync);
  }, []);

  const setActiveIndex = useCallback(
    (index: number) => {
      setUserPausedAutoScroll(true);
      if (activeTab === 'diamante') {
        setDiamanteIndex(index);
      } else {
        setPlatinoIndex(index);
      }
    },
    [activeTab]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setUserPausedAutoScroll(true);
      if (activeTab === 'diamante') {
        if (diamanteIndex === diamantePhotos.length - 1) {
          setActiveTab('platino');
          setPlatinoIndex(0);
          trackEvent('gallery_interaction', 'next_platino_auto_from_diamante', {
            section: 'galeria',
            gallery_category: 'Salón Platino',
            photo_title: platinoPhotos[0]?.caption,
          });
          return;
        }
        setDiamanteIndex((prev) => {
          const nextIdx = (prev + 1) % diamantePhotos.length;
          trackEvent('gallery_interaction', `next_diamante`, {
            section: 'galeria',
            gallery_category: 'Salón Diamante',
            photo_title: diamantePhotos[nextIdx]?.caption,
          });
          return nextIdx;
        });
      } else {
        if (platinoIndex === platinoPhotos.length - 1) {
          setActiveTab('diamante');
          setDiamanteIndex(0);
          trackEvent('gallery_interaction', 'next_diamante_auto_from_platino', {
            section: 'galeria',
            gallery_category: 'Salón Diamante',
            photo_title: diamantePhotos[0]?.caption,
          });
          return;
        }
        setPlatinoIndex((prev) => {
          const nextIdx = (prev + 1) % platinoPhotos.length;
          trackEvent('gallery_interaction', `next_platino`, {
            section: 'galeria',
            gallery_category: 'Salón Platino',
            photo_title: platinoPhotos[nextIdx]?.caption,
          });
          return nextIdx;
        });
      }
    },
    [activeTab, diamanteIndex, platinoIndex]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setUserPausedAutoScroll(true);
      if (activeTab === 'diamante') {
        if (diamanteIndex === 0) {
          setActiveTab('platino');
          setPlatinoIndex(platinoPhotos.length - 1);
          trackEvent('gallery_interaction', 'prev_platino_auto_from_diamante', {
            section: 'galeria',
            gallery_category: 'Salón Platino',
            photo_title: platinoPhotos[platinoPhotos.length - 1]?.caption,
          });
          return;
        }
        setDiamanteIndex((prev) => {
          const prevIdx = (prev - 1 + diamantePhotos.length) % diamantePhotos.length;
          trackEvent('gallery_interaction', `prev_diamante`, {
            section: 'galeria',
            gallery_category: 'Salón Diamante',
            photo_title: diamantePhotos[prevIdx]?.caption,
          });
          return prevIdx;
        });
      } else {
        if (platinoIndex === 0) {
          setActiveTab('diamante');
          setDiamanteIndex(diamantePhotos.length - 1);
          trackEvent('gallery_interaction', 'prev_diamante_auto_from_platino', {
            section: 'galeria',
            gallery_category: 'Salón Diamante',
            photo_title: diamantePhotos[diamantePhotos.length - 1]?.caption,
          });
          return;
        }
        setPlatinoIndex((prev) => {
          const prevIdx = (prev - 1 + platinoPhotos.length) % platinoPhotos.length;
          trackEvent('gallery_interaction', `prev_platino`, {
            section: 'galeria',
            gallery_category: 'Salón Platino',
            photo_title: platinoPhotos[prevIdx]?.caption,
          });
          return prevIdx;
        });
      }
    },
    [activeTab, diamanteIndex, platinoIndex]
  );

  const openLightbox = () => {
    setUserPausedAutoScroll(true);
    setLightboxOpen(true);
    trackEvent('gallery_interaction', `lightbox_open_${activeTab}`, {
      section: 'galeria',
      gallery_category: canonicalCategory,
      photo_title: photos[activeIndex]?.caption,
    });
  };

  // Soporte de gestos táctiles (Swipe izquierda / derecha)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Auto-scroll cada 7 segundos (pausado cuando el usuario navega manualmente o abre el Lightbox; evita el salto/reset detectado en ses_9pg0p_leigmtcj)
  useEffect(() => {
    if (lightboxOpen || userPausedAutoScroll) return;
    const timer = setTimeout(() => {
      if (activeTab === 'diamante') {
        setDiamanteIndex((prev) => (prev + 1) % diamantePhotos.length);
      } else {
        setPlatinoIndex((prev) => (prev + 1) % platinoPhotos.length);
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeTab, diamanteIndex, platinoIndex, lightboxOpen, userPausedAutoScroll]);

  // Navegación con teclado dentro del Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">
          Nuestros Salones: Diamante y Platino
        </h2>
        <p className="font-body-lg text-secondary max-w-2xl mx-auto mt-3">
          Explora cada detalle de nuestras instalaciones. Toca cualquier fotografía o título para ampliarla a pantalla completa.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex justify-center items-center gap-3 mb-6 border-b border-outline-variant/30 pb-px">
        <button
          type="button"
          onClick={() => {
            setActiveTab('diamante');
            trackEvent('gallery_interaction', 'tab_diamante', {
              section: 'galeria',
              gallery_category: 'Salón Diamante',
            });
          }}
          className={`px-6 py-2.5 transition-all duration-200 font-bold uppercase tracking-wider text-sm border-b-2 cursor-pointer ${
            activeTab === 'diamante'
              ? 'text-primary border-primary bg-primary/5 rounded-t-xl'
              : 'text-secondary border-transparent hover:text-on-surface'
          }`}
        >
          <span className="pointer-events-none">Salón Diamante ({diamantePhotos.length} fotos)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('platino');
            trackEvent('gallery_interaction', 'tab_platino', {
              section: 'galeria',
              gallery_category: 'Salón Platino',
            });
          }}
          className={`px-6 py-2.5 transition-all duration-200 font-bold uppercase tracking-wider text-sm border-b-2 cursor-pointer ${
            activeTab === 'platino'
              ? 'text-primary border-primary bg-primary/5 rounded-t-xl'
              : 'text-secondary border-transparent hover:text-on-surface'
          }`}
        >
          <span className="pointer-events-none">Salón Platino ({platinoPhotos.length} fotos)</span>
        </button>
      </div>

      {/* Main Carousel Container */}
      <div className="relative w-full max-w-5xl mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xl p-3 sm:p-4 md:p-6">
        {/* Large Image Frame — Clicable para abrir Lightbox (Elimina los 4 dead_clicks en títulos e imágenes) */}
        <div
          role="button"
          tabIndex={0}
          data-interactive="true"
          onClick={openLightbox}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openLightbox();
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-[16/10] md:aspect-[16/9] w-full rounded-xl overflow-hidden bg-black group/frame cursor-zoom-in select-none"
          aria-label={`Ampliar imagen: ${photos[activeIndex].caption}`}
        >
          <Image
            src={photos[activeIndex].src}
            alt={photos[activeIndex].alt}
            className="object-cover transition-transform duration-500 group-hover/frame:scale-105 pointer-events-none"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          {/* Preload silencioso de la siguiente imagen para transición instantánea al pulsar Siguiente (con alt válido para 100% cobertura SEO) */}
          <Image
            src={photos[(activeIndex + 1) % photos.length].src}
            alt={`Siguiente vista en ${canonicalCategory}: ${photos[(activeIndex + 1) % photos.length].alt}`}
            aria-hidden="true"
            className="opacity-0 pointer-events-none"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
          />

          {/* Top Bar: Counter + Fullscreen Affordance Badge */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-white/15">
              {canonicalCategory} • {activeIndex + 1} / {photos.length}
            </span>
            <span className="bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/15 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">zoom_in</span>
              <span>Ampliar foto</span>
            </span>
          </div>

          {/* Overlay Gradient and Caption (Con pointer-events-none para que el toque abra siempre el Lightbox) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex flex-col justify-end p-5 md:p-8 pointer-events-none">
            <h3 className="text-white font-display-lg text-base sm:text-lg md:text-2xl font-bold tracking-wide">
              {photos[activeIndex].caption}
            </h3>
            <p className="text-white/75 text-xs mt-1 flex items-center gap-1">
              <span>Desliza o toca para ver en pantalla completa</span>
            </p>
          </div>

          {/* Left Arrow — Siempre visible en móvil y con respuesta instantánea sin bloqueo */}
          <button
            type="button"
            data-ux-stepper="true"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-primary active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-white/20 shadow-lg"
            aria-label="Imagen anterior"
          >
            <span data-ux-decorative="true" className="material-symbols-outlined text-2xl pointer-events-none">
              chevron_left
            </span>
          </button>

          {/* Right Arrow — Siempre visible en móvil y con respuesta instantánea sin bloqueo (Resuelve rage_click) */}
          <button
            type="button"
            data-ux-stepper="true"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-primary active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-white/20 shadow-lg"
            aria-label="Siguiente imagen"
          >
            <span data-ux-decorative="true" className="material-symbols-outlined text-2xl pointer-events-none">
              chevron_right
            </span>
          </button>
        </div>

        {/* Thumbnail Navigation Bar */}
        <div className="flex justify-start sm:justify-center gap-2 mt-4 overflow-x-auto py-2 px-1">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (idx === activeIndex) {
                  openLightbox();
                  return;
                }
                setActiveIndex(idx);
                trackEvent('gallery_interaction', `thumb_${activeTab}_${idx + 1}`, {
                  section: 'galeria',
                  gallery_category: canonicalCategory,
                  photo_title: photo.caption,
                });
              }}
              title={
                idx === activeIndex
                  ? 'Toca de nuevo para ampliar a pantalla completa'
                  : `Ver foto ${idx + 1}: ${photo.caption}`
              }
              className={`relative flex-shrink-0 w-20 md:w-24 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                idx === activeIndex
                  ? 'border-primary scale-105 shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={photo.src}
                alt={`Miniatura ${idx + 1} - ${photo.caption}`}
                className="object-cover pointer-events-none"
                fill
                sizes="112px"
              />
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const nextSalon = activeTab === 'diamante' ? 'platino' : 'diamante';
              setActiveTab(nextSalon);
              if (nextSalon === 'platino') {
                setPlatinoIndex(0);
              } else {
                setDiamanteIndex(0);
              }
              trackEvent('gallery_interaction', `thumb_end_switch_${nextSalon}`, {
                section: 'galeria',
                gallery_category: nextSalon === 'platino' ? 'Salón Platino' : 'Salón Diamante',
              });
            }}
            className="flex-shrink-0 w-24 md:w-28 aspect-[16/10] rounded-lg border-2 border-primary/50 bg-primary/10 hover:bg-primary hover:text-on-primary text-primary px-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer"
          >
            <span className="text-[10px] font-extrabold uppercase leading-tight pointer-events-none">
              {activeTab === 'diamante' ? 'Ver Salón Platino →' : 'Ver Salón Diamante →'}
            </span>
          </button>
        </div>

        {/* Barra de Conversión Inline bajo el Carrusel de Galería (Sincronizada con el Precotizador para convertir sesiones como ses_9pg0p_leigmtcj y ses_7v211_cjcn9adx) */}
        <div className="mt-4 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary block">
              {activeTab === 'diamante'
                ? '✨ Salón Diamante • Ideal de 100 a 250+ Invitados (Pista LED y Techo Estrellado)'
                : '✨ Salón Platino • Ideal de 100 a 180 Invitados (Pista LED, Mampara Shimmer y Gala)'}
            </span>
            <p className="text-xs text-secondary mt-0.5">
              {hasActiveDraft ? (
                <>
                  Tu cotización activa:{' '}
                  <strong className="text-on-surface">
                    {syncedEventKind} • {syncedGuests} pers. ({syncedDay}) • Paquete {syncedPkg}: $
                    {syncedTotal.toLocaleString('es-MX')} MXN
                  </strong>
                </>
              ) : (
                <>
                  Paquetes Todo Incluido para <strong>{syncedGuests} personas</strong> desde{' '}
                  <strong className="text-on-surface">$53,000 MXN ($530 p/p)</strong> en Calle Norte 84, GAM, CDMX.
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                trackEvent('cotizar_click', `galeria_inline_cotizar_${activeTab}`, {
                  section: 'galeria',
                  gallery_category: canonicalCategory,
                  photo_title: photos[activeIndex]?.caption,
                  guests_range: `${syncedGuests} personas`,
                  package_name: `Paquete ${syncedPkg}`,
                  extra: { exact_guests: syncedGuests, estimated_budget: syncedTotal },
                });
                const el =
                  document.getElementById('precotizador') ||
                  document.getElementById('precotizador-hero');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-primary text-on-primary font-extrabold text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity cursor-pointer"
            >
              <span className="pointer-events-none">
                {hasActiveDraft
                  ? `Ver mi Cotización ($${syncedTotal.toLocaleString('es-MX')}) ↑`
                  : `Cotizar en ${canonicalCategory} ↑`}
              </span>
            </button>
            <a
              href={`https://wa.me/526633670431?text=${encodeURIComponent(
                hasActiveDraft
                  ? `¡Hola Salones San Pedro Plus! Estuve viendo las fotos del ${canonicalCategory} y armé mi pre-cotización web para ${syncedEventKind} (${syncedGuests} invitados, día ${syncedDay}, Paquete ${syncedPkg}: $${syncedTotal.toLocaleString('es-MX')} MXN). ¿Me confirman disponibilidad y agendamos visita?`
                  : `¡Hola Salones San Pedro Plus! Estuve viendo las fotos del ${canonicalCategory} en su galería web y me gustaría cotizar mi evento (${syncedGuests} invitados) o agendar una visita.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', `galeria_inline_wa_${activeTab}`, {
                  section: 'galeria',
                  gallery_category: canonicalCategory,
                  photo_title: photos[activeIndex]?.caption,
                  guests_range: `${syncedGuests} personas`,
                  package_name: `Paquete ${syncedPkg}`,
                  extra: { exact_guests: syncedGuests, estimated_budget: syncedTotal },
                })
              }
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-extrabold text-xs uppercase tracking-wider text-center shadow-md hover:opacity-95 transition-opacity"
            >
              {hasActiveDraft
                ? `WhatsApp: ${canonicalCategory} ($${syncedTotal.toLocaleString('es-MX')})`
                : 'Agendar Visita en WhatsApp'}
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================================
          VISOR A PANTALLA COMPLETA (LIGHTBOX) CON NAVEGACIÓN CÍCLICA Y SWIPE
      ===================================================================== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Barra Superior del Lightbox + Selector Rápido de Salón */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 max-w-6xl w-full mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-primary block">
                {canonicalCategory} • Foto {activeIndex + 1} de {photos.length}
              </span>
              <h4 className="font-display-lg text-base sm:text-xl font-bold">
                {photos[activeIndex].caption}
              </h4>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="inline-flex items-center bg-white/10 p-1 rounded-full border border-white/15">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('diamante');
                    trackEvent('gallery_interaction', 'lightbox_switch_diamante', {
                      section: 'galeria',
                      gallery_category: 'Salón Diamante',
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'diamante'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Salón Diamante
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('platino');
                    trackEvent('gallery_interaction', 'lightbox_switch_platino', {
                      section: 'galeria',
                      gallery_category: 'Salón Platino',
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'platino'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Salón Platino
                </button>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <span className="pointer-events-none">Cerrar</span>
                <span data-ux-decorative="true" className="material-symbols-outlined text-base pointer-events-none">
                  close
                </span>
              </button>
            </div>
          </div>

          {/* Imagen Central Ampliada */}
          <div
            className="relative flex-1 w-full max-w-6xl mx-auto my-4 flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full min-h-[55vh] max-h-[75vh]">
              <Image
                src={photos[activeIndex].src}
                alt={photos[activeIndex].alt}
                fill
                className="object-contain select-none"
                sizes="100vw"
                priority
              />
            </div>

            <button
              type="button"
              data-ux-stepper="true"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-primary active:scale-90 text-white flex items-center justify-center border border-white/20 cursor-pointer shadow-xl"
              aria-label="Foto anterior"
            >
              <span data-ux-decorative="true" className="material-symbols-outlined text-2xl pointer-events-none">
                chevron_left
              </span>
            </button>

            <button
              type="button"
              data-ux-stepper="true"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-primary active:scale-90 text-white flex items-center justify-center border border-white/20 cursor-pointer shadow-xl"
              aria-label="Siguiente foto"
            >
              <span data-ux-decorative="true" className="material-symbols-outlined text-2xl pointer-events-none">
                chevron_right
              </span>
            </button>
          </div>

          {/* Barra de Conversión Directa en Lightbox + Miniaturas Inferiores */}
          <div
            className="flex flex-col gap-2.5 max-w-4xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setLightboxOpen(false);
                  trackEvent('cotizar_click', `galeria_lightbox_cotizar_${activeTab}`, {
                    section: 'galeria',
                    gallery_category: canonicalCategory,
                    photo_title: photos[activeIndex].caption,
                  });
                  const el = document.getElementById('precotizador');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:opacity-95 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <span data-ux-decorative="true" className="material-symbols-outlined text-base pointer-events-none">
                  calculate
                </span>
                <span className="pointer-events-none">
                  Simular Paquete en {canonicalCategory} ↑
                </span>
              </button>

              <a
                href={`https://wa.me/526633670431?text=${encodeURIComponent(
                  `¡Hola! Estuve viendo la galería fotográfica del ${canonicalCategory} (${photos[activeIndex].caption}) en Salones San Pedro Plus y me gustaría agendar una visita guiada y confirmar disponibilidad.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('whatsapp_click', `galeria_lightbox_${activeTab}`, {
                    section: 'galeria',
                    gallery_category: canonicalCategory,
                    photo_title: photos[activeIndex].caption,
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <span data-ux-decorative="true" className="material-symbols-outlined text-base pointer-events-none">
                  forum
                </span>
                <span className="pointer-events-none">
                  Agendar Visita a {canonicalCategory} en WhatsApp
                </span>
              </a>
            </div>

            <div className="flex justify-center gap-2 overflow-x-auto py-1.5 w-full">
              {photos.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex-shrink-0 w-16 sm:w-20 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === activeIndex
                      ? 'border-primary scale-105'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    className="object-cover pointer-events-none"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

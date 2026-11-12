'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import TrackedLink from './TrackedLink';
import { trackEvent } from '@/utils/trackEvent';

interface InclusionDetail {
  id: string;
  label: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
  packageOrigin: string;
}

const INCLUSION_CATALOG: Record<string, InclusionDetail> = {
  servicio_6h: {
    id: 'servicio_6h',
    label: '6 horas de servicio + 1/2 hr recepción',
    title: '6.5 Horas Totales de Evento con Coordinador',
    description:
      'Tiempo amplio y perfectamente cronometrado: media hora de recepción con música ambiental para la llegada de tus invitados y 6 horas efectivas de fiesta continua en Salón Diamante o Platino.',
    highlights: [
      'Coordinador de evento y capitán de meseros incluidos',
      'Personal de seguridad en acceso y recepción de invitados',
      'Sanitarios impecables con personal de asistencia continua',
    ],
    image: '/galeria/diamante/diamante_1.jpg',
    packageOrigin: 'Premier',
  },
  menu_3_tiempos: {
    id: 'menu_3_tiempos',
    label: 'Menú formal a 3 tiempos y tornafiesta',
    title: 'Alta Gastronomía: Menú a 3 Tiempos + Tornafiesta',
    description:
      'Experiencia culinaria servida caliente a cada mesa con vajilla de gala: entrada o crema gourmet, plato fuerte con guarnición a elegir (suprema rellena, lomo o arrachera) y postre, además de chilaquiles o taquiza de tornafiesta.',
    highlights: [
      'Degustación previa para elegir los platillos de tu evento',
      'Panadería recién horneada y servicio de café',
      'Tornafiesta incluida para recargar energía durante el baile',
    ],
    image: '/servicios/arrachera.jpg',
    packageOrigin: 'Premier',
  },
  barra_mezcladores: {
    id: 'barra_mezcladores',
    label: 'Barra libre de mezcladores (descorche libre)',
    title: 'Barra Libre Ilimitada de Refrescos, Hielo y Descorche Libre',
    description:
      'Refrescos de línea (Coca-Cola, Toronja, Manzana, Agua Mineral), hielo ilimitado y cristalería durante todo el evento sin cobro por descorche para que traigas las botellas de tu preferencia.',
    highlights: [
      'Cero costo adicional por descorche de botellas',
      'Barman y servicio directo a la mesa con cristalería fina',
      'Refrescos, jugos, aguas minerales y hielo sin límite',
    ],
    image: '/servicios/cocteleria.jpg',
    packageOrigin: 'Premier',
  },
  dj_luces: {
    id: 'dj_luces',
    label: 'DJ, iluminación y batucada clásica',
    title: 'Producción de Audio, DJ en Vivo, Pista LED y Batucada',
    description:
      'Sistema de audio profesional de alta fidelidad, iluminación robótica arquitectónica, pista de baile LED iluminada y animación con globos y souvenirs en batucada.',
    highlights: [
      'DJ versátil mezclando en vivo según los gustos de tus invitados',
      'Pista de baile iluminada LED y luces robóticas',
      'Batucada con artículos de animación para encender la fiesta',
    ],
    image: '/galeria/diamante/diamante_3.jpg',
    packageOrigin: 'Premier',
  },
  montaje_imperial: {
    id: 'montaje_imperial',
    label: 'Montaje imperial con mesa de cristal',
    title: 'Montaje Imperial de Gala y Centros de Mesa',
    description:
      'Mesas imperiales de cristal e iluminadas, sillas Tiffany o Versalles vestidas al color de tu evento, servilletas de tela de gala y centros de mesa florales altos.',
    highlights: [
      'Mesa principal de honor decorada para novios o quinceañera',
      'Vajilla de porcelana, cubertería de lujo y cristalería completa',
      'Amplia gama de colores de mantelería para personalizar tu gala',
    ],
    image: '/galeria/diamante/diamante_4.jpg',
    packageOrigin: 'Premier',
  },
  servicio_7h: {
    id: 'servicio_7h',
    label: '7 horas de servicio',
    title: '7 Horas de Celebración Extendida (Paquete Plus)',
    description:
      'Una hora adicional de fiesta incluida en tu paquete para disfrutar sin prisas el protocolo, el vals, el banquete de 4 tiempos y la pista de baile.',
    highlights: [
      '7 horas continuas con todos los servicios activos',
      'Cronograma personalizado por nuestro coordinador de eventos',
      'Mayor tiempo de pista abierta y convivencia familiar',
    ],
    image: '/galeria/platino/platino_5.jpg',
    packageOrigin: 'Plus',
  },
  menu_4_tiempos: {
    id: 'menu_4_tiempos',
    label: 'Menú formal a 4 tiempos',
    title: 'Banquete de Gala a 4 Tiempos + Pastel',
    description:
      'Eleva tu recepción con un tiempo gastronómico adicional: entrada fría o ensalada gourmet, crema aterciopelada, plato fuerte especial de nuestro chef y postre/pastel de evento.',
    highlights: [
      '4 tiempos servidos con protocolo de etiqueta',
      'Opciones infantiles y vegetarianas disponibles',
      'Incluye tornafiesta al cierre para tus invitados',
    ],
    image: '/servicios/postres.jpg',
    packageOrigin: 'Plus',
  },
  robot_led: {
    id: 'robot_led',
    label: 'Batucada espectacular y servicio de robot',
    title: 'Show de Robot LED Gigante y Batucada Espectacular',
    description:
      'Nuestro Robot LED de más de 2.20 metros entra a la pista de baile con láseres, luces sincronizadas, animación interactiva y souvenirs para que todos tus invitados se levanten a bailar.',
    highlights: [
      'Robot LED gigante interactuando en el centro de la pista',
      'Souvenirs luminosos, sombreros, antifaces y globos largos',
      'Set musical de alta energía mezclado en vivo por el DJ',
    ],
    image: '/servicios/robot.jpg',
    packageOrigin: 'Plus',
  },
  mesa_dulces_cabina: {
    id: 'mesa_dulces_cabina',
    label: 'Mesa de dulces y cabina fotográfica',
    title: 'Mesa de Dulces Personalizada + Cabina Fotográfica Instantánea',
    description:
      'Montaje temático de Mesa de Dulces y botanas gourmet decorada al color de tu evento, más Cabina de Fotos con impresiones instantáneas ilimitadas y accesorios divertidos.',
    highlights: [
      'Mesa de dulces, postres y botanas con diseño personalizado',
      'Cabina fotográfica con tiras impresas al instante para tus invitados',
      'Personal encargado de asistir tanto en la mesa como en la cabina',
    ],
    image: '/servicios/mesa-dulces.jpg',
    packageOrigin: 'Plus',
  },
  letras_shots: {
    id: 'letras_shots',
    label: 'Letras gigantes y carrito de shots',
    title: 'Letras Gigantes Iluminadas + Carrito de Shots en Pista',
    description:
      'Set fotográfico con Letras Gigantes iluminadas (XV, LOVE o iniciales) y entrada del Carrito de Shots LED a la pista de baile para brindar con todos tus invitados.',
    highlights: [
      'Letras gigantes de 1.20m ideales para fotos de bienvenida',
      'Carrito de shots iluminado recorriendo la pista de baile',
      'Shots preparados con y sin alcohol para todas las edades',
    ],
    image: '/servicios/carrito-shots.jpg',
    packageOrigin: 'Plus',
  },
  prefiesta_30: {
    id: 'prefiesta_30',
    label: 'Pre-fiesta para 30 personas (L a J, 4 hrs)',
    title: 'Pre-Fiesta o Rompehielos de Cortesía para 30 Personas',
    description:
      'Beneficio exclusivo de nuestros paquetes superiores: celebra tu despedida de solteros, ensayo de XV años o reunión íntima previa para 30 personas de lunes a jueves durante 4 horas.',
    highlights: [
      '4 horas de salón previas a tu gran evento (Lunes a Jueves)',
      'Capacidad para hasta 30 familiares o amigos cercanos',
      'Ideal para ensayo de vals, brindis civil o reunión familiar',
    ],
    image: '/galeria/platino/platino_4.jpg',
    packageOrigin: 'Plus',
  },
  robot_ironman: {
    id: 'robot_ironman',
    label: 'Batucada con Robot Iron Man',
    title: 'Show Especial Robot Iron Man con Pirotecnia Fría',
    description:
      'El espectáculo más impactante para bodas y XV años: nuestro Robot Iron Man con armadura iluminada, efectos láser y chispas frías seguras en interiores.',
    highlights: [
      'Traje réplica Iron Man iluminado de alto impacto visual',
      'Efectos especiales seguros para interiores y batucada VIP',
      'Momento estelar garantizado para fotos, reels y TikTok',
    ],
    image: '/servicios/robot.jpg',
    packageOrigin: 'All Inclusive',
  },
  mariachi_1h: {
    id: 'mariachi_1h',
    label: '1 hora de Mariachi',
    title: '1 Hora Completa de Mariachi en Vivo Uniformado',
    description:
      'Cierra con broche de oro o sorprende durante la recepción con una hora completa de Mariachi profesional en vivo interpretando el repertorio mexicano favorito de tu familia.',
    highlights: [
      'Mariachi completo con traje de gala y voces profesionales',
      '1 hora efectiva de música en vivo dentro del salón',
      'Complacencias para los novios, quinceañera y familiares',
    ],
    image: '/servicios/mariachi.jpg',
    packageOrigin: 'All Inclusive',
  },
  limusina: {
    id: 'limusina',
    label: 'Servicio de Limusina',
    title: 'Traslado de Gala en Limusina Premium (Lincoln / Hummer / Chrysler)',
    description:
      'Llegada espectacular al salón: recorrido y traslado en Limusina de lujo con chofer uniformado, interiores de piel, iluminación LED, sonido envolvente y bebidas de cortesía.',
    highlights: [
      'Recorrido panorámico y llegada triunfal a la puerta del salón',
      'Capacidad para la festejada/novios junto con damas o chambelanes',
      'Chofer profesional, decoración exterior y bebidas de cortesía',
    ],
    image: '/servicios/limosinas.jpg',
    packageOrigin: 'All Inclusive',
  },
  video_fotos: {
    id: 'video_fotos',
    label: 'Video filmación y fotos con álbum',
    title: 'Cobertura Completa de Fotografía, Álbum de Lujo y Video HD',
    description:
      'Equipo de fotógrafos y videógrafos profesionales cubriendo tu evento de principio a fin, entregando memoria USB en alta definición, fotolibro impreso y cuadro de firmas.',
    highlights: [
      'Video editado en alta definición entregado en memoria USB',
      'Fotografías digitales ilimitadas + álbum impreso de lujo',
      'Ampliación fotográfica con marco para recepción de invitados',
    ],
    image: '/servicios/fotografia.jpg',
    packageOrigin: 'All Inclusive',
  },
  vino_botellas: {
    id: 'vino_botellas',
    label: 'Vino espumoso y 1 botella de licor por mesa',
    title: 'Brindis con Vino Espumoso + 1 Botella de Destilado por Mesa',
    description:
      'Olvídate de comprar alcohol por separado: incluye vino espumoso para el brindis oficial en todas las mesas más 1 botella de tequila, whisky o brandy por cada mesa de 10 invitados.',
    highlights: [
      'Vino espumoso servido en copas flauta para el brindis de honor',
      '1 botella de licor por cada mesa de 10 personas incluida',
      'Además conservas descorche libre si deseas traer botellas extra',
    ],
    image: '/servicios/cocteleria.jpg',
    packageOrigin: 'All Inclusive',
  },
  cabina_360: {
    id: 'cabina_360',
    label: 'Cabina 360 (1.30 hrs)',
    title: 'Plataforma de Video Cabina 360° Ilimitada (1.5 Horas)',
    description:
      'La experiencia más viral para tus invitados: plataforma giratoria 360° con cámara slow-motion, efectos visuales, accesorios de fiesta y descarga instantánea por código QR.',
    highlights: [
      '1 hora y media de videos 360° ilimitados en alta definición',
      'Operador profesional y utilería divertida (pistola de burbujas, billetes, lentes)',
      'Descarga inmediata en el celular de cada invitado vía QR',
    ],
    image: '/servicios/cabina-360.jpg',
    packageOrigin: 'All Inclusive',
  },
};

export default function PaquetesInteractiveSection() {
  const [selectedInclusion, setSelectedInclusion] = useState<InclusionDetail | null>(null);
  const [simGuests, setSimGuests] = useState<number>(100);
  const [simDayMode, setSimDayMode] = useState<'viernes_domingo' | 'sabado'>('viernes_domingo');

  const formatMXN = (amount: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(amount);

  const getPackageUnitPrice = (basePrice: number) =>
    simDayMode === 'sabado' ? basePrice + 35 : basePrice;

  const getPackageTotal = (basePrice: number, minGuests: number) => {
    const effectiveGuests = Math.max(minGuests, simGuests);
    return effectiveGuests * getPackageUnitPrice(basePrice);
  };

  const getInclusionPackageMeta = (pkgOrigin: string) => {
    if (pkgOrigin === 'Premier') return { basePrice: 530, minGuests: 100 };
    if (pkgOrigin === 'Plus') return { basePrice: 710, minGuests: 100 };
    return { basePrice: 1010, minGuests: 100 };
  };

  const syncWithPrecotizador = (
    nextGuests: number,
    nextDayMode: 'viernes_domingo' | 'sabado',
    nextPkg?: string
  ) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('ssp:sync-from-paquetes', {
        detail: { guests: nextGuests, dayMode: nextDayMode, packageId: nextPkg },
      })
    );
  };

  const handlePreselectInCalculator = (packageId: string) => {
    trackEvent('cotizar_click', `paquete_preseleccionar_${packageId.toLowerCase().replace(/\s+/g, '_')}`, {
      section: 'paquetes',
      package_name: `Paquete ${packageId}`,
      guests_range: `${simGuests} personas`,
      extra: { sim_guests: simGuests, sim_day_mode: simDayMode },
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ssp:select-package', {
          detail: { packageId, guests: simGuests, dayMode: simDayMode },
        })
      );
      const heroEl = document.getElementById('precotizador') || document.getElementById('precotizador-hero');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleOpenInclusion = (key: string) => {
    const item = INCLUSION_CATALOG[key];
    if (!item) return;
    setSelectedInclusion(item);
    syncWithPrecotizador(simGuests, simDayMode, item.packageOrigin);
    trackEvent('experience_interaction', `modal_paquete_${key}`, {
      section: 'paquetes',
      package_name: `Paquete ${item.packageOrigin}`,
      experience_title: item.label,
      element_text: item.title,
    });
  };

  const renderInclusionButton = (key: string, accentClass = 'text-primary') => {
    const item = INCLUSION_CATALOG[key];
    if (!item) return null;
    return (
      <li key={key}>
        <button
          type="button"
          onClick={() => handleOpenInclusion(key)}
          className="w-full text-left flex items-start justify-between gap-2 py-1.5 px-2 -mx-2 rounded-lg hover:bg-primary/10 transition-colors group cursor-pointer"
        >
          <span className="flex items-start text-sm text-secondary group-hover:text-on-surface transition-colors pointer-events-none">
            <span
              data-ux-decorative="true"
              className={`${accentClass} font-bold mr-2 shrink-0`}
            >
              ✓
            </span>
            <span className="underline decoration-dotted decoration-outline-variant underline-offset-4 group-hover:decoration-primary">
              {item.label}
            </span>
          </span>
          <span
            data-ux-decorative="true"
            className="material-symbols-outlined text-sm text-primary/70 group-hover:text-primary shrink-0 mt-0.5 pointer-events-none"
            title="Ver foto y detalle del servicio"
          >
            visibility
          </span>
        </button>
      </li>
    );
  };

  return (
    <>
      {/* =====================================================================
          SECCIÓN DE PAQUETES CON ÍTEMS INTERACTIVOS (CERO DEAD CLICKS)
      ===================================================================== */}
      <section
        data-ux-section="paquetes"
        className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface text-on-surface scroll-mt-20"
        id="paquetes"
      >
        <div className="max-w-container-max mx-auto">
          {/* Encabezado de la Sección */}
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span data-ux-decorative="true" className="material-symbols-outlined text-sm">
                touch_app
              </span>
              Toca cualquier servicio de la lista para ver foto y detalles
            </span>
            <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface">
              Nuestros Paquetes Todo Incluido
            </h2>
            <p className="font-body-lg text-secondary max-w-2xl mx-auto">
              Conoce nuestras tarifas transparentes, simula al instante la inversión total según tu número de invitados y toca cada beneficio incluido para ver fotos reales.
            </p>
          </div>

          {/* SIMULADOR INSTANTÁNEO DE AFORO Y DÍA EN #PAQUETES (Evita scroll_return_prices) */}
          <div
            data-interactive="true"
            className="max-w-4xl mx-auto mb-10 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary shrink-0">
                👥 Calcular total para:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[100, 120, 150, 180, 200, 250].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setSimGuests(g);
                      syncWithPrecotizador(g, simDayMode);
                      trackEvent('guests_slider_adjust', `paquetes_sim_${g}`, {
                        section: 'paquetes',
                        guests_range: `${g} personas`,
                        extra: { exact_guests: g, source_widget: 'paquetes_quick_bar' },
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      simGuests === g
                        ? 'bg-primary text-on-primary shadow-sm scale-105'
                        : 'bg-surface-container-low text-secondary hover:text-on-surface border border-outline-variant/30'
                    }`}
                  >
                    {g} pers.
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => {
                  setSimDayMode('viernes_domingo');
                  syncWithPrecotizador(simGuests, 'viernes_domingo');
                  trackEvent('package_select', 'sim_dia_viernes_domingo', { section: 'paquetes' });
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  simDayMode === 'viernes_domingo'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                🎁 Viernes / Dom (Preferencial)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimDayMode('sabado');
                  syncWithPrecotizador(simGuests, 'sabado');
                  trackEvent('package_select', 'sim_dia_sabado', { section: 'paquetes' });
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  simDayMode === 'sabado'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                📅 Sábado Estelar
              </button>
            </div>
          </div>

          {/* Tarjetas de Precios */}
          <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch max-w-6xl mx-auto px-2 md:px-8 gap-6 md:gap-0 md:-space-x-4">
            {/* Paquete Premier */}
            <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border border-outline-variant/30 transition-all hover:z-30 duration-300 relative z-10 w-full md:w-[360px] flex-shrink-0">
              <div>
                <div className="p-7 text-center bg-surface-container-low border-b border-outline-variant/30">
                  <h3 className="font-display-lg text-3xl text-on-surface font-bold mb-1">
                    Premier
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSimGuests(100);
                      trackEvent('guests_slider_adjust', 'paquetes_card_min_100', {
                        section: 'paquetes',
                        guests_range: '100 personas',
                        extra: { exact_guests: 100, source_widget: 'paquete_premier_badge' },
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors cursor-pointer"
                    title="Toca para simular con 100 personas"
                  >
                    <span className="pointer-events-none">
                      Disponible desde 100 personas {simGuests !== 100 ? '(simular 100)' : '✓'}
                    </span>
                  </button>
                  <div className="mt-3 space-y-1.5 text-on-surface/80 text-sm">
                    <p>
                      {simDayMode === 'viernes_domingo' ? 'Viernes / Dom desde' : 'Sábado Platino'}{' '}
                      <span className="font-bold text-xl text-primary">
                        ${getPackageUnitPrice(530)} p/p
                      </span>
                    </p>
                    <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 text-xs font-bold text-on-surface">
                      Total {simGuests} pers.:{' '}
                      <span className="text-primary font-extrabold">
                        {formatMXN(getPackageTotal(530, 100))} MXN
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Incluye (toca para ver foto):</span>
                    <span className="text-primary">🔍 Interactivo</span>
                  </p>
                  <ul className="space-y-2">
                    {renderInclusionButton('servicio_6h', 'text-primary-container')}
                    {renderInclusionButton('menu_3_tiempos', 'text-primary-container')}
                    {renderInclusionButton('barra_mezcladores', 'text-primary-container')}
                    {renderInclusionButton('dj_luces', 'text-primary-container')}
                    {renderInclusionButton('montaje_imperial', 'text-primary-container')}
                  </ul>
                </div>
              </div>
              <div className="p-7 pt-0 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handlePreselectInCalculator('Premier')}
                  className="block w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl transition-all uppercase tracking-wider text-center text-xs font-bold cursor-pointer"
                >
                  Personalizar en Cotizador ({simGuests} pers.) ↑
                </button>
                <TrackedLink
                  eventType="cotizar_click"
                  source="paquete_premier"
                  href={`https://wa.me/526633670431?text=${encodeURIComponent(
                    `¡Hola! Visité su sitio web y me interesa el Paquete Premier para ${Math.max(100, simGuests)} personas (aprox. ${formatMXN(
                      getPackageTotal(530, 100)
                    )} MXN). ¿Me podrían dar más detalles y fechas disponibles?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-on-primary rounded-xl font-label-sm transition-all uppercase tracking-wider text-center text-xs font-bold"
                >
                  Verificar Disponibilidad Premier
                </TrackedLink>
              </div>
            </div>

            {/* Paquete Plus (Destacado) */}
            <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl md:-translate-y-4 overflow-hidden border-2 border-primary-container flex flex-col justify-between relative transition-all hover:z-30 duration-300 z-20 w-full md:w-[380px] flex-shrink-0">
              <div className="absolute top-0 inset-x-0 bg-primary-container text-on-primary-container text-xs font-bold text-center py-1.5 uppercase tracking-wider">
                ⭐ El Más Elegido en Bodas y XV Años
              </div>
              <div>
                <div className="p-7 text-center bg-primary-container/10 border-b border-outline-variant/30 mt-6">
                  <h3 className="font-display-lg text-3xl text-primary font-bold mb-1">Plus</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSimGuests(100);
                      trackEvent('guests_slider_adjust', 'paquetes_card_min_100', {
                        section: 'paquetes',
                        guests_range: '100 personas',
                        extra: { exact_guests: 100, source_widget: 'paquete_min_100_badge' },
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container hover:bg-primary/15 text-secondary hover:text-primary text-xs font-semibold transition-colors cursor-pointer"
                    title="Toca para simular con 100 personas"
                  >
                    <span className="pointer-events-none">
                      A partir de 100 personas {simGuests !== 100 ? '(simular 100)' : '✓'}
                    </span>
                  </button>
                  <div className="mt-3 space-y-1.5 text-on-surface/80 text-sm">
                    <p>
                      {simDayMode === 'viernes_domingo' ? 'Platino desde' : 'Sábado Platino'}{' '}
                      <span className="font-bold text-xl text-primary">
                        ${getPackageUnitPrice(710)} p/p
                      </span>
                    </p>
                    <div className="inline-block px-3 py-1 rounded-lg bg-primary/15 border border-primary/40 text-xs font-bold text-on-surface">
                      Total {Math.max(100, simGuests)} pers.:{' '}
                      <span className="text-primary font-extrabold">
                        {formatMXN(getPackageTotal(710, 100))} MXN
                      </span>
                    </div>
                    {simGuests < 100 && (
                      <button
                        type="button"
                        onClick={() => handlePreselectInCalculator('Premier')}
                        className="mt-2 block w-full text-left p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-[11px] leading-snug text-on-surface transition-colors cursor-pointer"
                      >
                        <span className="font-extrabold text-primary block">
                          💡 ¿Tu evento es de {simGuests} personas?
                        </span>
                        Cotiza <strong>Premier ({formatMXN(getPackageTotal(530, 50))})</strong> y suma Robot LED, Mesa de Dulces o Combo VIP a tu medida ↑
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-xs font-bold text-primary uppercase mb-3 flex items-center justify-between">
                    <span>Incluye Premier, más:</span>
                    <span className="text-[11px] font-semibold">🔍 Toca cada ítem</span>
                  </p>
                  <ul className="space-y-2">
                    {renderInclusionButton('servicio_7h')}
                    {renderInclusionButton('menu_4_tiempos')}
                    {renderInclusionButton('robot_led')}
                    {renderInclusionButton('mesa_dulces_cabina')}
                    {renderInclusionButton('letras_shots')}
                    {renderInclusionButton('prefiesta_30')}
                  </ul>
                </div>
              </div>
              <div className="p-7 pt-0 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handlePreselectInCalculator('Plus')}
                  className="block w-full py-3 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/40 rounded-xl transition-all uppercase tracking-wider text-center text-xs font-bold cursor-pointer"
                >
                  Personalizar Plus en Cotizador ({Math.max(100, simGuests)} pers.) ↑
                </button>
                <TrackedLink
                  eventType="cotizar_click"
                  source="paquete_plus"
                  href={`https://wa.me/526633670431?text=${encodeURIComponent(
                    `¡Hola! Visité su sitio web y me interesa el Paquete Plus para ${Math.max(
                      100,
                      simGuests
                    )} personas (aprox. ${formatMXN(
                      getPackageTotal(710, 100)
                    )} MXN). ¿Me podrían confirmar disponibilidad?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-primary text-on-primary hover:opacity-90 rounded-xl font-label-sm shadow-md transition-all uppercase tracking-wider text-center text-xs font-bold"
                >
                  Verificar Disponibilidad Plus
                </TrackedLink>
              </div>
            </div>

            {/* Paquete All Inclusive */}
            <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border border-outline-variant/30 transition-all hover:z-30 duration-300 relative z-10 w-full md:w-[360px] flex-shrink-0">
              <div>
                <div className="p-7 text-center bg-surface-container-low border-b border-outline-variant/30">
                  <h3 className="font-display-lg text-3xl text-on-surface font-bold mb-1">
                    All Inclusive
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSimGuests(100);
                      trackEvent('guests_slider_adjust', 'paquetes_card_min_100', {
                        section: 'paquetes',
                        guests_range: '100 personas',
                        extra: { exact_guests: 100, source_widget: 'paquete_min_100_badge' },
                      });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container hover:bg-primary/15 text-secondary hover:text-primary text-xs font-semibold transition-colors cursor-pointer"
                    title="Toca para simular con 100 personas"
                  >
                    <span className="pointer-events-none">
                      A partir de 100 personas {simGuests !== 100 ? '(simular 100)' : '✓'}
                    </span>
                  </button>
                  <div className="mt-3 space-y-1.5 text-on-surface/80 text-sm">
                    <p>
                      {simDayMode === 'viernes_domingo' ? 'Platino desde' : 'Sábado Platino'}{' '}
                      <span className="font-bold text-xl text-primary">
                        ${getPackageUnitPrice(1010).toLocaleString('es-MX')} p/p
                      </span>
                    </p>
                    <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 text-xs font-bold text-on-surface">
                      Total {Math.max(100, simGuests)} pers.:{' '}
                      <span className="text-primary font-extrabold">
                        {formatMXN(getPackageTotal(1010, 100))} MXN
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-xs font-bold text-primary uppercase mb-3 flex items-center justify-between">
                    <span>Incluye Plus, más:</span>
                    <span className="text-[11px] font-semibold">🔍 Toca cada ítem</span>
                  </p>
                  <ul className="space-y-2">
                    {renderInclusionButton('robot_ironman')}
                    {renderInclusionButton('mariachi_1h')}
                    {renderInclusionButton('limusina')}
                    {renderInclusionButton('video_fotos')}
                    {renderInclusionButton('vino_botellas')}
                    {renderInclusionButton('cabina_360')}
                  </ul>
                </div>
              </div>
              <div className="p-7 pt-0 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handlePreselectInCalculator('All Inclusive')}
                  className="block w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl transition-all uppercase tracking-wider text-center text-xs font-bold cursor-pointer"
                >
                  Personalizar All Inclusive ({Math.max(100, simGuests)} pers.) ↑
                </button>
                <TrackedLink
                  eventType="cotizar_click"
                  source="paquete_all_inclusive"
                  href={`https://wa.me/526633670431?text=${encodeURIComponent(
                    `¡Hola! Visité su sitio web y me interesa el Paquete All Inclusive para ${Math.max(
                      100,
                      simGuests
                    )} personas (aprox. ${formatMXN(
                      getPackageTotal(1010, 100)
                    )} MXN). ¿Me podrían dar más detalles?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 border-2 border-primary text-primary hover:bg-primary hover:text-on-primary rounded-xl font-label-sm transition-all uppercase tracking-wider text-center text-xs font-bold"
                >
                  Verificar Disponibilidad All Inclusive
                </TrackedLink>
              </div>
            </div>
          </div>

          {/* =================================================================
              FRENTE 1: BANDA DE PRUEBA SOCIAL (GOOGLE REVIEWS) + CERTEZA GEOGRÁFICA
              Ubicada estratégicamente en el ~25-30% de scroll para neutralizar exit_intent
          ================================================================= */}
          <div
            data-ux-section="confianza_ubicacion"
            className="mt-14 max-w-6xl mx-auto bg-surface-container-low border border-outline-variant/40 rounded-3xl p-5 sm:p-8 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Columna Izquierda: Calificación Oficial + 3 Reseñas Verificadas */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/15 text-primary font-extrabold text-xl sm:text-2xl px-3.5 py-1.5 rounded-xl border border-primary/30">
                      4.9 ★
                    </div>
                    <div>
                      <h3 className="font-display-lg text-base sm:text-lg font-bold text-on-surface">
                        Respaldo y Confianza Comprobada en Google Maps
                      </h3>
                      <p className="text-xs text-secondary">
                        Más de 350 bodas, XV años y eventos empresariales realizados con éxito en el norte de CDMX
                      </p>
                    </div>
                  </div>
                  <a
                    href="#testimonios"
                    onClick={() =>
                      trackEvent('testimonial_pause', 'ver_todos_testimonios_arriba', {
                        section: 'paquetes',
                      })
                    }
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Ver todas las reseñas</span>
                    <span data-ux-decorative="true" className="material-symbols-outlined text-sm">
                      arrow_downward
                    </span>
                  </a>
                </div>

                {/* 3 Mini-Testimonios de Alto Impacto */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/25">
                    <div className="text-primary text-xs font-bold mb-1">★★★★★ • XV Años</div>
                    <p className="text-xs text-secondary leading-relaxed">
                      &ldquo;Celebramos los XV de mi hija para 150 personas en el Salón Platino con Paquete Plus. La comida caliente, el Robot LED y la limusina superaron todo.&rdquo;
                    </p>
                    <span className="block text-[11px] font-bold text-on-surface mt-2">
                      — Familia Caballero (Gustavo A. Madero)
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/25">
                    <div className="text-primary text-xs font-bold mb-1">★★★★★ • Boda</div>
                    <p className="text-xs text-secondary leading-relaxed">
                      &ldquo;El Salón Diamante luce espectacular con la pista LED y las mesas de cristal. El coordinador cuidó cada minuto para que nosotros solo disfrutáramos.&rdquo;
                    </p>
                    <span className="block text-[11px] font-bold text-on-surface mt-2">
                      — Mariana y Carlos (Cuauhtémoc, CDMX)
                    </span>
                  </div>

                  <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/25">
                    <div className="text-primary text-xs font-bold mb-1">★★★★★ • Gala 200 pers.</div>
                    <p className="text-xs text-secondary leading-relaxed">
                      &ldquo;Excelente relación calidad-precio sin costos ocultos. Descorche libre real, estacionamiento y acceso rapidísimo desde Circuito Interior.&rdquo;
                    </p>
                    <span className="block text-[11px] font-bold text-on-surface mt-2">
                      — Ing. Roberto Méndez (Miguel Hidalgo)
                    </span>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Ubicación Exacta en GAM y Botón de Mapa / Recorrido */}
              <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-3">
                  <span
                    data-ux-decorative="true"
                    className="material-symbols-outlined text-2xl text-primary shrink-0 mt-0.5"
                  >
                    location_on
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
                      Ubicación Estratégica Norte CDMX
                    </span>
                    <h4 className="font-display-lg text-base font-bold text-on-surface">
                      Alcaldía Gustavo A. Madero
                    </h4>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      Calle Nte 84 No. 6507, Col. San Pedro el Chico, CP 07800, CDMX. A 5 min de Eduardo Molina y Circuito Interior.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <TrackedLink
                    eventType="footer_click"
                    source="google_maps_midpage"
                    href="https://maps.app.goo.gl/oarkXjctGWr5d4J96?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/40"
                  >
                    <span data-ux-decorative="true" className="material-symbols-outlined text-base">
                      map
                    </span>
                    <span>Abrir en Google Maps</span>
                  </TrackedLink>

                  <TrackedLink
                    eventType="whatsapp_click"
                    source="agendar_recorrido_midpage"
                    href="https://wa.me/526633670431?text=%C2%A1Hola!%20Vi%20sus%20paquetes%20y%20ubicaci%C3%B3n%20en%20Gustavo%20A.%20Madero.%20Me%20gustar%C3%ADa%20agendar%20una%20visita%20para%20conocer%20los%20salones%20Diamante%20y%20Platino."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <span data-ux-decorative="true" className="material-symbols-outlined text-base">
                      event_available
                    </span>
                    <span>Agendar Visita al Salón</span>
                  </TrackedLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MODAL VISUAL DE SERVICIO INCLUIDO (RESUELVE DEAD CLICKS EN #PAQUETES)
      ===================================================================== */}
      {selectedInclusion && (
        <div
          className="fixed inset-0 z-[240] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedInclusion(null)}
        >
          <div
            className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 sm:h-64 w-full bg-black">
              <Image
                src={selectedInclusion.image}
                alt={selectedInclusion.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 512px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold uppercase tracking-wider">
                    Incluido en Paquete {selectedInclusion.packageOrigin}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedInclusion(null)}
                    className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer"
                    aria-label="Cerrar detalle"
                  >
                    <span data-ux-decorative="true" className="material-symbols-outlined text-lg pointer-events-none">
                      close
                    </span>
                  </button>
                </div>
                <h3 className="font-display-lg text-xl sm:text-2xl font-bold text-white leading-snug">
                  {selectedInclusion.title}
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {(() => {
                const meta = getInclusionPackageMeta(selectedInclusion.packageOrigin);
                const effGuests = Math.max(meta.minGuests, simGuests);
                const totalSim = getPackageTotal(meta.basePrice, meta.minGuests);
                const dayLabel = simDayMode === 'sabado' ? 'Sábado Estelar' : 'Viernes / Domingo';
                return (
                  <div className="p-3 rounded-2xl bg-primary/10 border border-primary/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-on-surface font-medium">
                      Incluido en <strong>Paquete {selectedInclusion.packageOrigin}</strong> ({effGuests} pers. • {dayLabel}):
                    </span>
                    <span className="text-primary font-extrabold text-sm">
                      {formatMXN(totalSim)} MXN
                    </span>
                  </div>
                );
              })()}

              <p className="text-sm text-secondary leading-relaxed">
                {selectedInclusion.description}
              </p>

              <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/30 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                  Lo que incluye este servicio:
                </span>
                <ul className="space-y-1.5 text-xs text-on-surface">
                  {selectedInclusion.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span data-ux-decorative="true" className="text-primary font-bold">
                        ✓
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const pkg = selectedInclusion.packageOrigin;
                    setSelectedInclusion(null);
                    handlePreselectInCalculator(pkg);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider text-center shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                >
                  <span className="pointer-events-none">
                    Personalizar {selectedInclusion.packageOrigin} ({Math.max(100, simGuests)} pers.) ↑
                  </span>
                </button>
                <TrackedLink
                  eventType="cotizar_click"
                  source={`modal_inclusion_${selectedInclusion.id}`}
                  href={`https://wa.me/526633670431?text=${encodeURIComponent(
                    `¡Hola! Vi el detalle de "${selectedInclusion.title}" en su web y me interesa cotizar el Paquete ${selectedInclusion.packageOrigin} para ${Math.max(
                      100,
                      simGuests
                    )} personas (${simDayMode === 'sabado' ? 'Sábado' : 'Viernes / Domingo'}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider text-center shadow-md transition-colors"
                >
                  Pedir en WhatsApp
                </TrackedLink>
                <button
                  type="button"
                  onClick={() => setSelectedInclusion(null)}
                  className="px-3.5 py-3 rounded-xl border border-outline-variant/40 text-secondary hover:text-on-surface font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <span className="pointer-events-none">Cerrar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

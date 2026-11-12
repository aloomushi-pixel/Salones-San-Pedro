'use client';

import { useState } from 'react';
import Image from 'next/image';
import { trackEvent } from '@/utils/trackEvent';

const initialCards = [
  {
    id: 1,
    tiempo: 'Primer Tiempo',
    badge: 'Entrada Gourmet o Crema',
    title: 'Entradas ligeras y sofisticadas para abrir el apetito.',
    desc: 'Ensalada gourmet de frutos rojos, zarzamoras frescas y queso de cabra, o crema de chile poblano / elote / champiñones.',
    options: ['Ensalada de Frutos Rojos y Queso de Cabra', 'Crema Poblana o de Champiñones', 'Crema de Elote o Nuez'],
    image: '/gastronomia/primer_tiempo.jpg',
  },
  {
    id: 2,
    tiempo: 'Segundo Tiempo',
    badge: 'Pastas Artesanales',
    title: 'Pastas artesanales preparadas con salsas clásicas.',
    desc: 'Fetuccini al pesto, espagueti a los tres quesos o penne rigate a la italiana con toque de parmesano.',
    options: ['Fetuccini al Pesto', 'Espagueti a los Tres Quesos', 'Fetuccini Alfredo o Boloñesa'],
    image: '/gastronomia/segundo_tiempo.jpg',
  },
  {
    id: 3,
    tiempo: 'Tercer Tiempo',
    badge: 'Plato Fuerte de Gala + Guarnición',
    title: 'Especialidades principales preparadas al punto ideal.',
    desc: 'Lomo de cerdo en salsa de ciruela o tamarindo, o suprema de ave rellena de queso crema en salsa de mango.',
    options: ['Lomo al Ciruelo o Tamarindo', 'Suprema de Ave Rellena', 'Medallón en Salsa de Champiñones'],
    image: '/gastronomia/tercer_tiempo.jpg',
  },
  {
    id: 4,
    tiempo: '4to Tiempo y Tornafiesta',
    badge: 'Postre Gourmet + Chilaquiles / Tacos',
    title: 'Cierre dulce de gala y tornafiesta tradicional para seguir bailando.',
    desc: 'Pastel y postre individual en mesa (Paquete Plus / All Inclusive) más tornafiesta de chilaquiles o taquiza de madrugada.',
    options: ['Postre Gourmet Individual (4to Tiempo)', 'Tornafiesta de Chilaquiles', 'Café Americano y Pastel'],
    image: '/gastronomia/primer_tiempo.jpg',
  },
];

export default function MenuTinderCards() {
  const [cards, setCards] = useState(initialCards);
  const [animating, setAnimating] = useState<'next' | 'prev' | null>(null);

  const handleNext = () => {
    if (animating) return;
    setAnimating('next');
    trackEvent('menu_card_swipe', `next_${cards[0]?.tiempo || 'platillo'}`, {
      section: 'banquetes',
      dish_title: `${cards[0]?.tiempo}: ${cards[0]?.desc}`,
    });

    setTimeout(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const first = newCards.shift();
        if (first) newCards.push(first);
        return newCards;
      });
      setAnimating(null);
    }, 260);
  };

  const handlePrev = () => {
    if (animating) return;
    setAnimating('prev');
    trackEvent('menu_card_swipe', `prev_${cards[cards.length - 1]?.tiempo || 'platillo'}`, {
      section: 'banquetes',
      dish_title: `${cards[cards.length - 1]?.tiempo}: ${cards[cards.length - 1]?.desc}`,
    });

    setCards((prev) => {
      const newCards = [...prev];
      const last = newCards.pop();
      if (last) newCards.unshift(last);
      return newCards;
    });

    setTimeout(() => {
      setAnimating(null);
    }, 260);
  };

  const handleSelectById = (id: number) => {
    if (animating) return;
    if (cards[0]?.id === id) {
      handleNext();
      return;
    }
    const target = initialCards.find((c) => c.id === id);
    trackEvent('menu_card_swipe', `tab_${target?.tiempo || id}`, {
      section: 'banquetes',
      dish_title: target ? `${target.tiempo}: ${target.desc}` : String(id),
    });
    const idx = initialCards.findIndex((c) => c.id === id);
    if (idx !== -1) {
      const rotated = [...initialCards.slice(idx), ...initialCards.slice(0, idx)];
      setCards(rotated);
    }
  };

  const activeId = cards[0]?.id || 1;

  return (
    <div className="space-y-6">
      {/* Píldoras de Navegación Directa por Tiempo (Accesible en Móvil y Desktop) */}
      <div
        data-interactive="true"
        className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 mx-auto"
      >
        {initialCards.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-interactive="true"
              onClick={() => handleSelectById(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                isActive
                  ? 'bg-primary text-on-primary border-primary shadow-md scale-105'
                  : 'bg-surface-container-high text-on-surface border-outline-variant/40 hover:border-primary/60'
              }`}
            >
              <span className="pointer-events-none">{item.tiempo}</span>
            </button>
          );
        })}
      </div>

      <div className="relative w-full max-w-sm mx-auto h-[520px] md:h-[550px] perspective-1000 mb-6 flex items-center justify-center">
        {/* Botón Anterior (Desktop) */}
        <button
          type="button"
          onClick={handlePrev}
          className="hidden md:flex absolute -left-16 z-40 bg-surface-container-high hover:bg-surface-container-highest text-on-surface p-3 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          aria-label="Tiempo anterior del menú"
        >
          <span className="material-symbols-outlined text-2xl pointer-events-none">chevron_left</span>
        </button>

        {/* Contenedor de las tarjetas */}
        <div className="relative w-full h-full">
          {cards.map((card, index) => {
            const isFront = index === 0;
            const animatingNext = animating === 'next' && isFront;
            const animatingPrev = animating === 'prev' && isFront;

            const zIndex = 30 - index * 10;
            const scale = 1 - index * 0.05;
            const translateY = index * 20;
            const opacity = 1 - index * 0.15;

            return (
              <div
                key={card.id}
                role="button"
                tabIndex={isFront ? 0 : -1}
                data-interactive="true"
                onClick={isFront ? handleNext : undefined}
                onKeyDown={(e) => {
                  if (isFront && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                className="absolute top-0 left-0 w-full h-full transition-all duration-300 ease-out cursor-pointer select-none"
                style={{
                  zIndex,
                  transform: animatingNext
                    ? 'translateX(-120%) rotate(-15deg) scale(0.9)'
                    : animatingPrev
                    ? 'translateX(120%) rotate(15deg) scale(0.9)'
                    : `translateY(${translateY}px) scale(${scale})`,
                  opacity: animatingNext || animatingPrev ? 0 : opacity,
                }}
              >
                <div className="w-full h-full bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden pointer-events-none">
                  <div className="space-y-3.5 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display-lg text-xl text-primary font-bold tracking-wider uppercase">
                        {card.tiempo}
                      </h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                        {card.badge}
                      </span>
                    </div>
                    <div className="relative h-44 md:h-52 w-full rounded-xl overflow-hidden shadow-md">
                      <Image
                        className="object-cover saturate-[1.15] contrast-[1.05] brightness-[1.02]"
                        alt={`${card.tiempo} - ${card.title} en Salones San Pedro CDMX`}
                        src={card.image}
                        fill
                        sizes="(max-width: 768px) 100vw, 384px"
                        draggable={false}
                      />
                    </div>
                    <h4 className="font-body-md font-bold text-on-surface text-base leading-snug">
                      {card.title}
                    </h4>
                    <p className="font-body-md text-secondary text-xs sm:text-sm leading-relaxed">
                      {card.desc}
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {card.options.map((opt, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface border border-outline-variant/30"
                        >
                          ✓ {opt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`mt-3 pt-2 border-t border-outline-variant/25 flex items-center justify-center gap-2 text-primary text-xs font-bold uppercase tracking-widest transition-opacity duration-300 ${
                      isFront ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span>Toca la tarjeta para ver el siguiente tiempo</span>
                    <span className="material-symbols-outlined text-sm">swipe_right</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón Siguiente (Desktop) */}
        <button
          type="button"
          onClick={handleNext}
          className="hidden md:flex absolute -right-16 z-40 bg-surface-container-high hover:bg-surface-container-highest text-on-surface p-3 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          aria-label="Siguiente tiempo del menú"
        >
          <span className="material-symbols-outlined text-2xl pointer-events-none">chevron_right</span>
        </button>
      </div>

      {/* CTA de Degustación y Cotización de Banquete */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="#precotizador-hero"
          onClick={() =>
            trackEvent('cotizar_click', 'banquetes_cotizar_menu', {
              section: 'banquetes',
            })
          }
          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-transform"
        >
          Cotizar Paquete con Banquete Incluido
        </a>
        <a
          href="https://wa.me/526633670431?text=%C2%A1Hola%20Salones%20San%20Pedro!%20Vi%20su%20men%C3%BA%20de%203%20y%204%20tiempos%20en%20la%20web%20y%20me%20gustar%C3%ADa%20solicitar%20informes%20y%20opciones%20de%20degustaci%C3%B3n."
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent('whatsapp_click', 'banquetes_degustacion_wa', {
              section: 'banquetes',
            })
          }
          className="px-6 py-3 rounded-xl border border-primary/50 text-primary hover:bg-primary hover:text-on-primary font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Consultar Menú Completo por WhatsApp
        </a>
      </div>
    </div>
  );
}

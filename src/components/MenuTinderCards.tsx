'use client';

import { useState } from 'react';
import Image from 'next/image';

const initialCards = [
  {
    id: 1,
    tiempo: 'Primer Tiempo',
    title: 'Entradas ligeras y sofisticadas para abrir el apetito.',
    desc: 'Ensalada gourmet de frutos rojos, zarzamoras frescas y queso de cabra.',
    image: '/gastronomia/primer_tiempo.jpg'
  },
  {
    id: 2,
    tiempo: 'Segundo Tiempo',
    title: 'Pastas artesanales preparadas con salsas clásicas.',
    desc: 'Fetuccini al pesto.',
    image: '/gastronomia/segundo_tiempo.jpg'
  },
  {
    id: 3,
    tiempo: 'Tercer Tiempo',
    title: 'Especialidades principales preparadas al punto ideal.',
    desc: 'Lomo al ciruelo.',
    image: '/gastronomia/tercer_tiempo.jpg'
  }
];

export default function MenuTinderCards() {
  const [cards, setCards] = useState(initialCards);
  const [animating, setAnimating] = useState<'next' | 'prev' | null>(null);

  const handleNext = () => {
    if (animating) return;
    setAnimating('next');
    
    setTimeout(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const first = newCards.shift();
        if (first) newCards.push(first);
        return newCards;
      });
      setAnimating(null);
    }, 300);
  };

  const handlePrev = () => {
    if (animating) return;
    setAnimating('prev');
    
    // For prev, we immediately move the back card to the front, then animate it coming in.
    // Actually, it's simpler to just reorder then animate, but CSS transitions make it tricky.
    // Let's just do the state update first so it's in front, but start it off-screen, then slide in.
    setCards((prev) => {
      const newCards = [...prev];
      const last = newCards.pop();
      if (last) newCards.unshift(last);
      return newCards;
    });
    
    setTimeout(() => {
      setAnimating(null);
    }, 300);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-[480px] md:h-[520px] perspective-1000 mb-12 flex items-center justify-center">
      {/* Botón Anterior (Desktop) */}
      <button 
        onClick={handlePrev}
        className="hidden md:flex absolute -left-16 z-40 bg-surface-container-high hover:bg-surface-container-highest text-on-surface p-3 rounded-full shadow-md transition-all active:scale-95"
        aria-label="Anterior"
      >
        <span className="material-symbols-outlined text-2xl">chevron_left</span>
      </button>

      {/* Contenedor de las tarjetas */}
      <div className="relative w-full h-full">
        {cards.map((card, index) => {
          const isFront = index === 0;
          const animatingNext = animating === 'next' && isFront;
          const animatingPrev = animating === 'prev' && isFront; // Newly brought to front

          const zIndex = 30 - index * 10;
          const scale = 1 - index * 0.05;
          const translateY = index * 20; 
          const opacity = 1 - index * 0.15;
          
          return (
            <div
              key={card.id}
              onClick={isFront ? handleNext : undefined}
              className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ease-out cursor-pointer select-none`}
              style={{
                zIndex,
                transform: animatingNext 
                  ? 'translateX(-120%) rotate(-15deg) scale(0.9)' 
                  : animatingPrev
                  ? 'translateX(120%) rotate(15deg) scale(0.9)' // Start off-screen right? No wait, this happens *during* the transition if we just added it. But it's fine.
                  : `translateY(${translateY}px) scale(${scale})`,
                opacity: animatingNext || animatingPrev ? 0 : opacity,
              }}
            >
              <div className="w-full h-full bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden pointer-events-none">
                <div className="space-y-4 text-left">
                  <h3 className="font-display-lg text-xl text-primary font-bold tracking-wider uppercase">
                    {card.tiempo}
                  </h3>
                  <div className="relative h-48 md:h-56 w-full rounded-xl overflow-hidden shadow-md">
                    <Image
                      className="object-cover saturate-[1.15] contrast-[1.05] brightness-[1.02]"
                      alt={card.title}
                      src={card.image}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      draggable={false}
                    />
                  </div>
                  <h4 className="font-body-md font-bold text-on-surface text-base md:text-lg leading-snug">
                    {card.title}
                  </h4>
                  <p className="font-body-md text-secondary text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                
                <div className={`mt-4 flex items-center justify-center gap-2 text-primary text-xs font-bold uppercase tracking-widest transition-opacity duration-300 ${isFront ? 'opacity-100' : 'opacity-0'}`}>
                  <span>Haz clic o usa las flechas</span>
                  <span className="material-symbols-outlined text-sm">swipe_right</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón Siguiente (Desktop) */}
      <button 
        onClick={handleNext}
        className="hidden md:flex absolute -right-16 z-40 bg-surface-container-high hover:bg-surface-container-highest text-on-surface p-3 rounded-full shadow-md transition-all active:scale-95"
        aria-label="Siguiente"
      >
        <span className="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </div>
  );
}

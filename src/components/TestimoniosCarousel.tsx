'use client';

import { useState, useEffect } from 'react';

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
}

const reviews: Review[] = [
  {
    name: "María de Jesús Rodríguez",
    rating: 5,
    text: "Excelente salón para eventos, muy amplio y con un servicio de banquete de primera calidad. Festejamos aquí la boda de mi hija y todo el personal estuvo muy atento a los detalles. ¡Muy recomendado!",
    date: "Hace 2 meses"
  },
  {
    name: "Alejandro Gómez",
    rating: 5,
    text: "Gran atención por parte de los coordinadores del evento. El diseño de iluminación y la música son increíbles, hicieron que la fiesta fuera todo un éxito. Muy profesional.",
    date: "Hace 1 mes"
  },
  {
    name: "Sofía Martínez",
    rating: 4,
    text: "Las instalaciones están muy cuidadas y la ubicación en Zona Esmeralda le da mucha exclusividad. El menú de 4 tiempos estuvo delicioso, mis invitados quedaron encantados. Excelente servicio en general.",
    date: "Hace 3 meses"
  },
  {
    name: "Juan Manuel Ortiz",
    rating: 5,
    text: "Festejamos un evento corporativo y superó nuestras expectativas. La logística y la decoración floral boutique estuvieron de 10. Cumplieron con todo lo prometido en el paquete Premium. Excelente lugar.",
    date: "Hace 2 semanas"
  }
];

export default function TestimoniosCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 md:px-12 py-8">
      {/* Google badge info */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span className="font-semibold text-on-surface">Opiniones de Google</span>
        </div>
        <div className="flex text-[#C5A059] tracking-wider font-bold">
          {"★".repeat(5)}
        </div>
        <span className="text-secondary text-sm bg-surface-container-high px-2 py-0.5 rounded-full">4.8 / 5</span>
      </div>

      {/* Review Box */}
      <div className="min-h-[220px] bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden transition-all duration-500">
        <span className="material-symbols-outlined absolute right-6 md:right-8 top-6 md:top-8 text-primary/10 text-8xl font-bold select-none pointer-events-none">format_quote</span>
        
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase">
                {reviews[activeIndex].name[0]}
              </div>
              <div>
                <h4 className="font-semibold text-on-surface text-lg leading-snug">{reviews[activeIndex].name}</h4>
                <div className="flex text-[#C5A059] text-sm mt-0.5">
                  {"★".repeat(reviews[activeIndex].rating)}
                  {"☆".repeat(5 - reviews[activeIndex].rating)}
                </div>
              </div>
            </div>
            
            <p className="text-secondary italic text-lg leading-relaxed pt-2 pr-6">
              "{reviews[activeIndex].text}"
            </p>
          </div>

          <span className="text-secondary/60 text-xs self-start">{reviews[activeIndex].date}</span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-[-8px] md:left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-container-highest/80 hover:bg-primary hover:text-on-primary shadow-lg flex items-center justify-center transition-all cursor-pointer z-10"
        aria-label="Anterior"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-[-8px] md:right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface-container-highest/80 hover:bg-primary hover:text-on-primary shadow-lg flex items-center justify-center transition-all cursor-pointer z-10"
        aria-label="Siguiente"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Indicator Bullets */}
      <div className="flex justify-center gap-2 mt-6">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === activeIndex 
                ? 'bg-primary w-5' 
                : 'bg-outline-variant hover:bg-primary/50'
            }`}
            aria-label={`Ir a reseña ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

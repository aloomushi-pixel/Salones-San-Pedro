'use client';

import { useState, useEffect } from 'react';

interface Photo {
  src: string;
  alt: string;
  caption: string;
}

const diamantePhotos: Photo[] = [
  {
    src: "/galeria/diamante/diamante_1.jpg",
    alt: "Detalle de mesa con vajilla fina y servilletas azules en Salón Diamante",
    caption: "Montaje de Gala - Vajilla Fina y Cristalería"
  },
  {
    src: "/galeria/diamante/diamante_2.jpg",
    alt: "Vista del salón Diamante con pista iluminada y letras de LOVE",
    caption: "Escenario Principal y Pista de Baile Iluminada"
  },
  {
    src: "/galeria/diamante/diamante_3.jpg",
    alt: "Detalle de mesa imperial decorada para XV Años en Salón Diamante",
    caption: "Detalle de Mesa Imperial para Quince Años (XV)"
  },
  {
    src: "/galeria/diamante/diamante_4.jpg",
    alt: "Vista panorámica del salón Diamante con pista LED y globos",
    caption: "Vista Panorámica y Distribución del Salón"
  },
  {
    src: "/galeria/diamante/diamante_5.jpg",
    alt: "Detalle de centros de mesa altos con flores en Salón Diamante",
    caption: "Centros de Mesa de Cristal y Luces Ambientales"
  }
];

const platinoPhotos: Photo[] = [
  {
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Montaje íntimo para banquetes en Salón Platino",
    caption: "Montaje Íntimo para Bodas y Eventos Sociales (Referencia)"
  },
  {
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    alt: "Detalles gourmet y copas en Salón Platino",
    caption: "Decoración Floral y Detalles de Cristalería (Referencia)"
  },
  {
    src: "https://images.unsplash.com/photo-1507504038482-76210214dae1?auto=format&fit=crop&w=1200&q=80",
    alt: "Iluminación cálida y romántica en Salón Platino",
    caption: "Iluminación Cálida y Acogedora (Referencia)"
  },
  {
    src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    alt: "Mesa montada para recepción en Salón Platino",
    caption: "Estilo Imperial y Ambientación del Espacio (Referencia)"
  }
];

export default function GaleriaSection() {
  const [activeTab, setActiveTab] = useState<'diamante' | 'platino'>('diamante');
  const [diamanteIndex, setDiamanteIndex] = useState(0);
  const [platinoIndex, setPlatinoIndex] = useState(0);

  const photos = activeTab === 'diamante' ? diamantePhotos : platinoPhotos;
  const activeIndex = activeTab === 'diamante' ? diamanteIndex : platinoIndex;

  const setActiveIndex = (index: number) => {
    if (activeTab === 'diamante') {
      setDiamanteIndex(index);
    } else {
      setPlatinoIndex(index);
    }
  };

  const handleNext = () => {
    setActiveIndex((activeIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setActiveIndex((activeIndex - 1 + photos.length) % photos.length);
  };

  // Auto-scroll every 6 seconds
  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [activeIndex, activeTab]);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Encabezado */}
      <div className="text-center mb-10">
        <span className="font-label-sm text-primary tracking-widest uppercase">Galería de Espacios</span>
        <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">
          Nuestros Salones
        </h2>
        <p className="font-body-lg text-secondary max-w-2xl mx-auto mt-4">
          Espacios diseñados con el máximo refinamiento y sofisticación para hacer de su evento un momento inolvidable.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('diamante')}
          className={`px-6 py-3 font-label-sm rounded-full transition-all duration-300 text-xs tracking-wider uppercase border ${
            activeTab === 'diamante'
              ? 'bg-primary text-on-primary border-primary shadow-md'
              : 'bg-surface-container-low text-secondary border-outline-variant/30 hover:bg-surface-container-high'
          }`}
        >
          Salón Diamante (100 - 200 pers.)
        </button>
        <button
          onClick={() => setActiveTab('platino')}
          className={`px-6 py-3 font-label-sm rounded-full transition-all duration-300 text-xs tracking-wider uppercase border ${
            activeTab === 'platino'
              ? 'bg-primary text-on-primary border-primary shadow-md'
              : 'bg-surface-container-low text-secondary border-outline-variant/30 hover:bg-surface-container-high'
          }`}
        >
          Salón Platino (50 - 180 pers.)
        </button>
      </div>

      {/* Main Carousel Container */}
      <div className="relative w-full max-w-5xl mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xl p-4 md:p-6">
        
        {/* Large Image Frame */}
        <div className="relative aspect-[16/10] md:aspect-[16/9] w-full rounded-xl overflow-hidden bg-black group/frame">
          <img
            src={photos[activeIndex].src}
            alt={photos[activeIndex].alt}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover/frame:scale-105"
          />
          
          {/* Overlay Gradient and Caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8">
            <h3 className="text-white font-display-lg text-lg md:text-2xl font-bold tracking-wide">
              {photos[activeIndex].caption}
            </h3>
            {activeTab === 'platino' && (
              <p className="text-white/60 text-xs mt-1 italic">
                * Las imágenes del Salón Platino son referentes de montajes reales.
              </p>
            )}
          </div>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-primary text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/frame:opacity-100 z-10"
            aria-label="Imagen anterior"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          
          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-primary text-white flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover/frame:opacity-100 z-10"
            aria-label="Siguiente imagen"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </div>

        {/* Thumbnail Navigation Bar */}
        <div className="flex justify-center gap-2 mt-4 overflow-x-auto py-2">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 md:w-28 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                idx === activeIndex
                  ? 'border-primary scale-105 shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={photo.src}
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

      </div>

      {/* Booking CTA */}
      <div className="text-center mt-12">
        <a
          href="#disponibilidad"
          className="inline-block bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-sm text-sm px-8 py-3.5 rounded-lg shadow-md transition-all uppercase tracking-wider font-semibold active:scale-95"
        >
          COTIZAR EVENTO EN {activeTab === 'diamante' ? 'SALÓN DIAMANTE' : 'SALÓN PLATINO'}
        </a>
      </div>
    </div>
  );
}

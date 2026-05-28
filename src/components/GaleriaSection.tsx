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
    alt: "Vista panorámica del Salón Diamante con pista de baile LED y techo estrellado",
    caption: "Vista Panorámica de la Pista LED y Salón Diamante"
  },
  {
    src: "/galeria/diamante/diamante_2.jpg",
    alt: "Vista amplia del salón Diamante con pista LED y mesas redondas vestidas de rosa",
    caption: "Distribución del Salón con Montaje de Gala Rosa"
  },
  {
    src: "/galeria/diamante/diamante_3.jpg",
    alt: "Escenario principal del salón Diamante con letras gigantes de LOVE",
    caption: "Escenario Principal y Letras LOVE Iluminadas"
  },
  {
    src: "/galeria/diamante/diamante_4.jpg",
    alt: "Mesa imperial número 1 montada con vajilla fina y pista de baile al fondo",
    caption: "Mesa Imperial de Honor y Pista al Fondo"
  },
  {
    src: "/galeria/diamante/diamante_5.jpg",
    alt: "Detalle de mesa número 1 con cristalería y centro de mesa floral alto",
    caption: "Detalle de Montaje de Mesa e Iluminación en Mesa 1"
  },
  {
    src: "/galeria/diamante/diamante_6.jpg",
    alt: "Primer plano de centro de mesa alto con flores blancas y azules",
    caption: "Centro de Mesa de Cristal con Arreglo Floral Elegante"
  },
  {
    src: "/galeria/diamante/diamante_7.jpg",
    alt: "Detalle de mesa número 2 con vajilla de filo dorado y servilletas azules en Salón Diamante",
    caption: "Vajilla con Filo Dorado y Servilletas de Lujo en Mesa 2"
  },
  {
    src: "/galeria/diamante/diamante_8.jpg",
    alt: "Detalle de mesa con vajilla blanca, servilleta azul y centro de mesa alto iluminado en Salón Diamante",
    caption: "Mesa Montada de Gala con Vajilla Fina y Servilletas Azules"
  },
  {
    src: "/galeria/diamante/diamante_9.jpg",
    alt: "Detalle de mesa número 6 con vajilla fina y servilletas de gala azules",
    caption: "Vajilla de Gala con Copas y Servilletas Azules"
  },
  {
    src: "/galeria/diamante/diamante_10.jpg",
    alt: "Mesa número 6 vestida con mantelería fina y servilletas rosas para XV Años",
    caption: "Montaje de Mesa para Quince Años (XV) con Vajilla y Servilletas Rosas"
  }
];

const platinoPhotos: Photo[] = [
  {
    src: "/galeria/platino/platino_1.jpg",
    alt: "Entrada del Salón Platino decorada con arco de globos azules y negros",
    caption: "Acceso Principal al Salón Platino"
  },
  {
    src: "/galeria/platino/platino_2.jpg",
    alt: "Detalle de mesa montada con servilletas azules y centro de mesa floral en Salón Platino",
    caption: "Montaje de Gala - Mesa de Honor para XV Años"
  },
  {
    src: "/galeria/platino/platino_3.jpg",
    alt: "Vista amplia de las mesas y candelabro esférico en Salón Platino",
    caption: "Distribución de Mesas e Iluminación del Salón"
  },
  {
    src: "/galeria/platino/platino_4.jpg",
    alt: "Mampara de shinty azul y arco de globos para set de fotografías en Salón Platino",
    caption: "Set Fotográfico - Mampara Shimmer y Globos"
  },
  {
    src: "/galeria/platino/platino_5.jpg",
    alt: "Vista panorámica de la pista de baile iluminada con letras gigantes en Salón Platino",
    caption: "Vista General con Pista LED y Escenario Principal"
  },
  {
    src: "/galeria/platino/platino_6.jpg",
    alt: "Mesa número 6 montada con cristalería y servilletas de gala en Salón Platino",
    caption: "Mesa Imperial y Vajilla Fina en Mesa 6"
  },
  {
    src: "/galeria/platino/platino_7.jpg",
    alt: "Primer plano de centro de mesa alto con flores blancas y fondo de pista LED en Salón Platino",
    caption: "Arreglos Florales de Alta Gama"
  },
  {
    src: "/galeria/platino/platino_8.jpg",
    alt: "Vista amplia del Salón Platino con mantelería de gala y pista de baile",
    caption: "Distribución del Espacio y Pista de Baile LED"
  },
  {
    src: "/galeria/platino/platino_9.jpg",
    alt: "Detalle de cubiertos y mantelería en mesa número 4 en Salón Platino",
    caption: "Montaje de Cubiertos e Iluminación en Mesa 4"
  },
  {
    src: "/galeria/platino/platino_10.jpg",
    alt: "Mesa número 1 montada con arco de globos en Salón Platino",
    caption: "Detalle de Mesa 1 y Set con Globos al Fondo"
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
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('diamante')}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl transition-all duration-300 border flex flex-col items-center text-center ${
            activeTab === 'diamante'
              ? 'bg-primary text-on-primary border-primary shadow-md'
              : 'bg-surface-container-low text-secondary border-outline-variant/30 hover:bg-surface-container-high'
          }`}
        >
          <span className="text-xs font-bold tracking-wider uppercase">Salón Diamante (100 - 200 pers.)</span>
          <span className={`text-[10px] mt-1 font-medium ${activeTab === 'diamante' ? 'text-on-primary/90' : 'text-secondary/80'}`}>
            Primer Piso
          </span>
        </button>
        <button
          onClick={() => setActiveTab('platino')}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl transition-all duration-300 border flex flex-col items-center text-center ${
            activeTab === 'platino'
              ? 'bg-primary text-on-primary border-primary shadow-md'
              : 'bg-surface-container-low text-secondary border-outline-variant/30 hover:bg-surface-container-high'
          }`}
        >
          <span className="text-xs font-bold tracking-wider uppercase">Salón Platino (50 - 180 pers.)</span>
          <span className={`text-[10px] mt-1 font-medium ${activeTab === 'platino' ? 'text-on-primary/90' : 'text-secondary/80'}`}>
            Planta Baja
          </span>
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 max-w-xl mx-auto px-margin-mobile">
        <a
          href="#disponibilidad"
          className="flex-1 bg-primary text-on-primary hover:opacity-90 font-label-sm text-xs md:text-sm px-6 py-3.5 rounded-lg shadow-md transition-all uppercase tracking-wider font-semibold active:scale-95 text-center"
        >
          Cotizar Salón Diamante
        </a>
        <a
          href="#disponibilidad"
          className="flex-1 border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-sm text-xs md:text-sm px-6 py-3.5 rounded-lg shadow-md transition-all uppercase tracking-wider font-semibold active:scale-95 text-center"
        >
          Cotizar Salón Platino
        </a>
      </div>
    </div>
  );
}

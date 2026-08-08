'use client';

import Image from 'next/image';

const experiencias = [
  {
    title: 'Curaduría Sonora',
    desc: 'Audio Hi-Fi y DJ sets personalizados.',
    image: '/animacion/sonido.jpg',
  },
  {
    title: 'Iluminación LED',
    desc: 'Diseño arquitectónico y dinámico.',
    image: '/animacion/iluminacion.jpg',
  },
  {
    title: 'Cabina Fotográfica / 360',
    desc: 'Recuerdos inmersivos en alta definición.',
    image: '/animacion/360.jpg',
  },
  {
    title: 'Mariachi',
    desc: 'Tradición y emoción en tu celebración.',
    image: '/animacion/mariachi.jpg',
  },
  {
    title: 'Robot LED / Animador',
    desc: 'Energía y diversión para tu pista de baile.',
    image: '/animacion/robot_led.jpg',
  },
  {
    title: 'Mesa de Dulces',
    desc: 'Postres y detalles exquisitos para tus invitados.',
    image: '/animacion/mesa_dulces.jpg',
  },
  {
    title: 'Letras Gigantes',
    desc: 'Un toque espectacular, iluminado y fotogénico.',
    image: '/animacion/letras_gigantes.jpg',
  },
  {
    title: 'Carrito de Shots',
    desc: 'Bebidas coloridas para encender el ambiente festivo.',
    image: '/animacion/carrito_shots.jpg',
  },
  {
    title: 'Servicio de Limusina',
    desc: 'Llegada elegante y sofisticada a tu evento.',
    image: '/animacion/limusina.jpg',
  }
];

export default function ExperienciasCarousel() {
  return (
    <div className="w-full pb-8">
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory custom-scrollbar pb-6">
        {experiencias.map((exp, index) => (
          <article 
            key={index}
            className="snap-start shrink-0 w-[280px] md:w-[320px] group bg-surface-container-lowest rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden border border-outline-variant/30 text-center flex flex-col"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image 
                src={exp.image} 
                alt={exp.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw" 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h3 className="font-display-lg text-headline-md mb-2 text-on-surface">{exp.title}</h3>
              <p className="text-secondary text-sm">{exp.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { trackEvent } from '@/utils/trackEvent';

interface ExperienciaItem {
  title: string;
  desc: string;
  longDesc: string;
  image: string;
  includedIn: string;
  badge: string;
  specs: string[];
}

const experiencias: ExperienciaItem[] = [
  {
    title: 'Curaduría Sonora',
    desc: 'Audio Hi-Fi y DJ sets personalizados.',
    longDesc:
      'Sistema de audio profesional line-array con DJ versátil en vivo que adapta la música a cada momento de tu evento: recepción, banquete gourmet, brindis y fiesta.',
    image: '/animacion/sonido.jpg',
    includedIn: 'Incluido en Premier ($530), Plus ($710) y All Inclusive ($1,010)',
    badge: '✓ Incluido en todos los paquetes',
    specs: [
      'DJ versátil con mezcla en vivo durante las 5.5 horas de evento',
      'Cabina iluminada y microfonía inalámbrica para brindis y maestro de ceremonias',
      'Playlist personalizada previa con tus géneros favoritos',
    ],
  },
  {
    title: 'Iluminación LED',
    desc: 'Diseño arquitectónico y dinámico.',
    longDesc:
      'Escenografía lumínica robótica y arquitectónica que transforma los Salones Diamante y Platino para el vals, entrada triunfal y pista de baile.',
    image: '/animacion/iluminacion.jpg',
    includedIn: 'Incluido en Premier ($530), Plus ($710) y All Inclusive ($1,010)',
    badge: '✓ Incluido en todos los paquetes',
    specs: [
      'Cabezas móviles robóticas sincronizadas con el ritmo de la música',
      'Pista iluminada profesional y efectos de humo bajo para el vals',
      'Ambientación cromática personalizada al color de tu gala',
    ],
  },
  {
    title: 'Cabina Fotográfica / 360',
    desc: 'Recuerdos inmersivos en alta definición.',
    longDesc:
      'Plataforma de video 360° en cámara lenta o cabina fotográfica con accesorios divertidos y descarga instantánea por código QR para todos tus invitados.',
    image: '/animacion/360.jpg',
    includedIn: 'Incluido en Paquete All Inclusive ($1,010) o como Extra ($3,500 MXN)',
    badge: '⭐ Favorito en Bodas y XV Años',
    specs: [
      'Videos slow-motion con aro de luz LED y accesorios de fiesta',
      'Entrega digital inmediata al celular de tus invitados vía QR / AirDrop',
      'Staff operador dedicado durante el servicio',
    ],
  },
  {
    title: 'Mariachi',
    desc: 'Tradición y emoción en tu celebración.',
    longDesc:
      'Presentación de Mariachi en vivo con traje de gala para cerrar la noche con broche de oro o acompañar la recepción y serenata.',
    image: '/animacion/mariachi.jpg',
    includedIn: 'Incluido en Paquete All Inclusive ($1,010) o como Extra ($6,500 MXN)',
    badge: '🎺 Show en Vivo',
    specs: [
      '1 hora completa de repertorio tradicional mexicano en vivo',
      'Músicos uniformados de gala con excelente presencia escénica',
      'Coordinación exacta de entrada sorpresa con el director del evento',
    ],
  },
  {
    title: 'Robot LED / Animador',
    desc: 'Energía y diversión para tu pista de baile.',
    longDesc:
      'Show interactivo de batucada con Robot LED gigante (Iron Man / Predator), zancos, disparos de CO2 frío y animación de alta energía en pista.',
    image: '/animacion/robot_led.jpg',
    includedIn: 'Incluido en Paquete All Inclusive ($1,010) o como Extra ($3,500 MXN)',
    badge: '🤖 Incluido en All Inclusive',
    specs: [
      '45 a 60 minutos de batucada explosiva en el clímax de la fiesta',
      'Souvenirs de animación (globos largos, antifaces, collares o varitas LED)',
      'Momento fotográfico estelar con los novios o quinceañera',
    ],
  },
  {
    title: 'Mesa de Dulces',
    desc: 'Postres y detalles exquisitos para tus invitados.',
    longDesc:
      'Montaje temático de dulces finos, snacks gourmet, chocolates y botanas saladas/enchiladas decorado de acuerdo con la paleta de colores de tu evento.',
    image: '/animacion/mesa_dulces.jpg',
    includedIn: 'Disponible como Servicio Adicional Personalizado ($4,500 MXN)',
    badge: '🍬 Personalizable al tema de tu evento',
    specs: [
      'Variedad de postres individuales, dulces ácidos, chocolates y snacks',
      'Decoración y papelería temática con el nombre de los festejados',
      'Montaje previo a la llegada de tus invitados',
    ],
  },
  {
    title: 'Letras Gigantes',
    desc: 'Un toque espectacular, iluminado y fotogénico.',
    longDesc:
      'Letras monumentales iluminadas (XV, Iniciales de Novios o números de graduación) ideales para el set fotográfico principal del salón.',
    image: '/animacion/letras_gigantes.jpg',
    includedIn: 'Incluido en Paquete All Inclusive ($1,010) y en el Combo Fiesta VIP',
    badge: '🔥 Disponible en Combo Fiesta VIP',
    specs: [
      'Letras de 1.20m de altura con iluminación LED cálida o multicolor',
      'Montaje durante las 5.5 horas completas de recepción y fiesta',
      'Incluido con 20% de descuento dentro del Combo Fiesta VIP',
    ],
  },
  {
    title: 'Carrito de Shots',
    desc: 'Bebidas coloridas para encender el ambiente festivo.',
    longDesc:
      'Carrito iluminado que entra directo a la pista de baile durante la batucada para repartir rondas de shots preparados y encender el ambiente.',
    image: '/animacion/carrito_shots.jpg',
    includedIn: 'Disponible en Combo Fiesta VIP o individual ($3,500 MXN)',
    badge: '🔥 Top #1 Extra Más Cotizado',
    specs: [
      'Carrito LED de lujo con bartender/animador en pista de baile',
      'Variedad de shots de tequila, vodka y coctelería frutal',
      'Integrado en el Combo Fiesta VIP (Limusina + Shots + Letras)',
    ],
  },
  {
    title: 'Servicio de Limusina',
    desc: 'Llegada elegante y sofisticada a tu evento.',
    longDesc:
      'Recorrido panorámico y llegada triunfal a la puerta de Salones San Pedro en Limusina de lujo con iluminación interior, sonido y chofer de gala.',
    image: '/animacion/limusina.jpg',
    includedIn: 'Incluido en Paquete Plus ($710) y All Inclusive ($1,010)',
    badge: '🚘 Incluido desde Paquete Plus',
    specs: [
      'Traslado de lujo de la ceremonia religiosa al salón de eventos',
      'Chofer uniformado, aire acondicionado y barra iluminada interior',
      'Sesión fotográfica al descender en la alfombra de entrada',
    ],
  },
];

export default function ExperienciasCarousel() {
  const [selectedExp, setSelectedExp] = useState<ExperienciaItem | null>(null);

  const handleOpenModal = (exp: ExperienciaItem) => {
    setSelectedExp(exp);
    trackEvent('experience_interaction', `modal_${exp.title}`, {
      section: 'animacion',
      experience_title: exp.title,
    });
  };

  return (
    <div className="w-full pb-8">
      <div className="flex overflow-x-auto gap-5 snap-x snap-mandatory custom-scrollbar pb-6 px-1">
        {experiencias.map((exp, index) => (
          <button
            key={index}
            type="button"
            data-interactive="true"
            onClick={() => handleOpenModal(exp)}
            className="snap-start shrink-0 w-[285px] md:w-[325px] group bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-outline-variant/40 text-left flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="relative h-48 w-full overflow-hidden pointer-events-none">
              <Image
                src={exp.image}
                alt={`${exp.title} para bodas y XV años en Salones San Pedro CDMX`}
                fill
                sizes="(max-width: 768px) 85vw, 325px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-primary text-[11px] font-bold px-2.5 py-1 rounded-full border border-primary/30">
                {exp.badge}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between pointer-events-none">
              <div>
                <h3 className="font-display-lg text-lg font-bold mb-1.5 text-on-surface group-hover:text-primary transition-colors">
                  {exp.title}
                </h3>
                <p className="text-secondary text-sm leading-relaxed">{exp.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/25 flex items-center justify-between text-xs font-bold text-primary">
                <span>Ver qué paquete lo incluye</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL INTERACTIVO DE EXPERIENCIA (ELIMINA CLICS SIN RESPUESTA EN #ANIMACION) */}
      {selectedExp && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedExp(null)}
        >
          <div
            className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 w-full">
              <Image
                src={selectedExp.image}
                alt={selectedExp.title}
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedExp(null)}
                aria-label="Cerrar detalle de experiencia"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="inline-block px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold mb-2">
                  {selectedExp.badge}
                </span>
                <h3 className="font-display-lg text-2xl font-bold text-white">
                  {selectedExp.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4 text-left">
              <p className="text-sm text-secondary leading-relaxed">{selectedExp.longDesc}</p>

              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 text-xs font-semibold text-on-surface">
                <span className="text-primary font-bold block uppercase tracking-wider text-[10px] mb-0.5">
                  Disponibilidad en Paquetes:
                </span>
                {selectedExp.includedIn}
              </div>

              <ul className="space-y-2 text-xs text-secondary">
                {selectedExp.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <a
                  href="#precotizador-hero"
                  onClick={() => {
                    trackEvent('cotizar_click', `modal_exp_${selectedExp.title}`, {
                      section: 'animacion',
                      experience_title: selectedExp.title,
                    });
                    setSelectedExp(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider text-center hover:opacity-95 transition-opacity"
                >
                  Incluir en mi Cotización
                </a>
                <a
                  href={`https://wa.me/526633670431?text=${encodeURIComponent(
                    `¡Hola Salones San Pedro! Vi el servicio de "${selectedExp.title}" en su sitio web y me gustaría cotizarlo para mi evento.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent('whatsapp_click', `modal_exp_wa_${selectedExp.title}`, {
                      section: 'animacion',
                      experience_title: selectedExp.title,
                    });
                    setSelectedExp(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider text-center hover:opacity-95 transition-opacity"
                >
                  Preguntar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

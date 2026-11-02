import React from 'react';
import { BlogPost, BlogPostDetail } from './blogData';
import Link from 'next/link';

const CTA = () => (
  <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg my-8 shadow-sm">
    <h2 className="font-display-lg text-xl font-bold text-on-surface mb-2">¿Listo para empezar a planear tu evento en CDMX?</h2>
    <p className="text-secondary mb-4">En Salones San Pedro nos encargamos de que tu celebración sea perfecta de principio a fin. Calcula tu presupuesto en línea o agenda un recorrido por nuestras instalaciones.</p>
    <div className="flex flex-wrap gap-3">
      <Link href="/#precotizador-hero" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-md text-xs uppercase tracking-wider">
        Calcular Cotización en Línea
      </Link>
      <a href="https://wa.me/526633670431?text=%C2%A1Hola%20Salones%20San%20Pedro!%20Le%C3%AD%20su%20gu%C3%ADa%20de%20eventos%20en%20el%20blog%20y%20me%20interesa%20cotizar%20mi%20evento." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-md text-xs uppercase tracking-wider">
        Contactar por WhatsApp
      </a>
    </div>
  </div>
);

export const SEO_BLOG_POSTS: BlogPost[] = [
  {
    slug: "como-elegir-el-menu-perfecto-para-tu-evento-guia-paso-a-paso",
    title: "Cómo elegir el menú perfecto para tu evento: Guía paso a paso",
    excerpt: "Descubre cómo calcular porciones, elegir entre menú formal o buffet, y conoce la variedad de platillos que ofrecemos en CDMX.",
    date: "30 de Junio, 2026",
    readTime: "5 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/banquet_table_setup_1782782321503.png"
  },
  {
    slug: "tendencias-en-banquetes-para-eventos-en-2026-lo-que-no-puede-faltar",
    title: "Tendencias en banquetes para eventos en 2026: Lo que no puede faltar",
    excerpt: "Los ingredientes y estilos más innovadores que dominarán las bodas y eventos corporativos este 2026 en la Ciudad de México.",
    date: "30 de Junio, 2026",
    readTime: "4 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/innovative_catering_dishes_1782782329531.png"
  },
  {
    slug: "menu-de-3-tiempos-vs-buffet-cual-es-la-mejor-opcion-para-tu-boda-o-graduacion",
    title: "Menú de 3 tiempos vs. Buffet: ¿Cuál es la mejor opción para tu boda o graduación?",
    excerpt: "Comparamos los dos formatos de servicio más populares para ayudarte a decidir cuál se adapta mejor al estilo y energía de tu evento.",
    date: "30 de Junio, 2026",
    readTime: "6 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/buffet_vs_plated_1782782338754.png"
  },
  {
    slug: "tipos-de-pistas-de-baile-para-eventos-cual-va-mejor-con-tu-estilo",
    title: "Tipos de pistas de baile para eventos: ¿Cuál va mejor con tu estilo?",
    excerpt: "Desde pistas iluminadas LED hasta acabados de madera. Explora cómo la pista de baile puede transformar por completo la atmósfera de tu fiesta.",
    date: "30 de Junio, 2026",
    readTime: "4 min de lectura",
    category: "Pistas y Espacios",
    imageUrl: "/blog/led_dance_floor_1782782352317.png"
  },
  {
    slug: "como-distribuir-el-espacio-en-tu-evento-para-que-la-pista-de-baile-siempre-este-llena",
    title: "Cómo distribuir el espacio en tu evento para que la pista de baile siempre esté llena",
    excerpt: "Consejos de arquitectura de eventos para acomodar mesas, DJ y pista, garantizando que todos tus invitados se animen a bailar.",
    date: "30 de Junio, 2026",
    readTime: "5 min de lectura",
    category: "Pistas y Espacios",
    imageUrl: "/blog/event_space_layout_1782782359857.png"
  },
  {
    slug: "checklist-definitivo-para-organizar-un-evento-inolvidable-sin-estresarte",
    title: "Checklist definitivo para organizar un evento inolvidable (sin estresarte)",
    excerpt: "Tu guía mes a mes con todas las tareas esenciales para planear tu boda o XV años en CDMX con total tranquilidad.",
    date: "30 de Junio, 2026",
    readTime: "7 min de lectura",
    category: "Coordinación",
    imageUrl: "/blog/wedding_planner_checklist_1782782369508.png"
  },
  {
    slug: "5-razones-por-las-que-necesitas-un-coordinador-de-eventos-profesional",
    title: "5 razones por las que necesitas un coordinador de eventos profesional",
    excerpt: "Descubre el enorme valor que aporta un equipo experto en la solución de imprevistos, control de tiempos y trato con proveedores.",
    date: "30 de Junio, 2026",
    readTime: "4 min de lectura",
    category: "Coordinación",
    imageUrl: "/blog/event_coordinator_professional_1782782383705.png"
  },
  {
    slug: "errores-comunes-al-planear-una-boda-xv-anos-y-como-evitarlos",
    title: "Errores comunes al planear una boda o XV años y cómo evitarlos",
    excerpt: "Nuestra experiencia organizando cientos de eventos nos ha enseñado qué cosas no hacer. Conoce cómo evitar los errores de planeación más costosos.",
    date: "30 de Junio, 2026",
    readTime: "6 min de lectura",
    category: "Coordinación",
    imageUrl: "/blog/wedding_planning_errors_1782782393476.png"
  }
];

export const SEO_BLOG_POSTS_DETAILS: Record<string, BlogPostDetail> = {
  "como-elegir-el-menu-perfecto-para-tu-evento-guia-paso-a-paso": {
    slug: "como-elegir-el-menu-perfecto-para-tu-evento-guia-paso-a-paso",
    title: "Cómo elegir el menú perfecto para tu evento: Guía paso a paso",
    excerpt: "Descubre cómo calcular porciones, elegir entre menú formal o buffet, y conoce la variedad de platillos que ofrecemos en CDMX.",
    date: "30 de Junio, 2026",
    readTime: "5 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/banquet_table_setup_1782782321503.png",
    content: (
      <div className="space-y-6">
        <p>La comida es sin duda uno de los elementos más recordados de cualquier fiesta. Ya sea una boda elegante o una gran celebración de XV años en la CDMX, servir los mejores <strong><Link href="/#banquetes" className="text-primary hover:underline">platillos</Link></strong> garantizará que tus invitados se vayan con un excelente sabor de boca.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">1. Calcula las porciones correctamente</h2>
        <p>Es preferible que sobre comida a que falte. Un cálculo estándar en la industria de banquetes es sumar un 10% adicional al número total de confirmados. Esto cubre imprevistos y asegura que nadie se quede sin su platillo favorito.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">2. ¿Menú Formal o Buffet?</h2>
        <p>El menú servido a la mesa (2 o 3 tiempos) aporta un toque de máxima elegancia y permite controlar los tiempos del evento a la perfección. Por otro lado, un buffet bien ejecutado ofrece dinamismo y una mayor variedad de <strong><Link href="/#banquetes" className="text-primary hover:underline">platillos</Link></strong> para los diferentes paladares de tus asistentes.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">3. Variedad de Platillos en Salones San Pedro</h2>
        <p>En Salones San Pedro, nuestra cocina internacional y nacional se adapta a tu visión. Ofrecemos degustaciones previas para que los novios o quinceañeras elijan exactamente lo que desean servir. ¡Desde jugosas carnes hasta opciones vegetarianas excepcionales!</p>
        
        <CTA />
      </div>
    )
  },
  "tendencias-en-banquetes-para-eventos-en-2026-lo-que-no-puede-faltar": {
    slug: "tendencias-en-banquetes-para-eventos-en-2026-lo-que-no-puede-faltar",
    title: "Tendencias en banquetes para eventos en 2026: Lo que no puede faltar",
    excerpt: "Los ingredientes y estilos más innovadores que dominarán las bodas y eventos corporativos este 2026 en la Ciudad de México.",
    date: "30 de Junio, 2026",
    readTime: "4 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/innovative_catering_dishes_1782782329531.png",
    content: (
      <div className="space-y-6">
        <p>El 2026 viene marcado por la sofisticación y la experiencia visual en la gastronomía para eventos. Los asistentes ya no solo buscan comer, buscan vivir una experiencia a través de los <strong><Link href="/#banquetes" className="text-primary hover:underline">platillos</Link></strong>.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Estaciones Interactivas</h2>
        <p>Las mesas de quesos han evolucionado hacia estaciones donde el chef prepara ceviches, pastas o cortes de carne al momento frente a los invitados. Esta es una tendencia obligada en CDMX.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Platillos Fotogénicos (Instagram-worthy)</h2>
        <p>El emplatado es más importante que nunca. Colores vibrantes, flores comestibles y salsas en texturas vanguardistas aseguran que tu banquete sea el centro de todas las fotos de la noche.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Coctelería de Autor para Acompañar</h2>
        <p>Nuestros <strong><Link href="/#banquetes" className="text-primary hover:underline">platillos</Link></strong> se complementan perfectamente con mixología moderna. Olvida los licores tradicionales y atrévete con infusiones herbales y humo aromático.</p>
        
        <CTA />
      </div>
    )
  },
  "menu-de-3-tiempos-vs-buffet-cual-es-la-mejor-opcion-para-tu-boda-o-graduacion": {
    slug: "menu-de-3-tiempos-vs-buffet-cual-es-la-mejor-opcion-para-tu-boda-o-graduacion",
    title: "Menú de 3 tiempos vs. Buffet: ¿Cuál es la mejor opción para tu boda o graduación?",
    excerpt: "Comparamos los dos formatos de servicio más populares para ayudarte a decidir cuál se adapta mejor al estilo y energía de tu evento.",
    date: "30 de Junio, 2026",
    readTime: "6 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/buffet_vs_plated_1782782338754.png",
    content: (
      <div className="space-y-6">
        <p>Una de las preguntas más frecuentes de nuestras parejas y comités de graduación en CDMX es si deben optar por un servicio emplatado o un generoso buffet. Aquí desglosamos ambas opciones.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Menú de 3 Tiempos: Elegancia y Control</h2>
        <p>El servicio emplatado es el rey de los eventos formales. Permite que tus invitados no tengan que levantarse, mantiene un protocolo ordenado y asegura una presentación impecable. En Salones San Pedro dominamos este formato entregando los <strong><Link href="/#banquetes" className="text-primary hover:underline">platillos</Link></strong> a la temperatura perfecta.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Buffet: Dinamismo y Abundancia</h2>
        <p>Si tu fiesta tiene una vibra más relajada y festiva, el buffet es ideal. Ofrece mayor variedad, permitiendo que los invitados exigentes elijan exactamente lo que desean comer de nuestra vasta oferta gastronómica.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">El Veredicto</h2>
        <p>No hay respuesta incorrecta. Tu decisión dependerá de la atmósfera que desees crear. Con gusto podemos asesorarte sobre qué estilo encaja mejor con tu temática y presupuesto.</p>
        
        <CTA />
      </div>
    )
  },
  "tipos-de-pistas-de-baile-para-eventos-cual-va-mejor-con-tu-estilo": {
    slug: "tipos-de-pistas-de-baile-para-eventos-cual-va-mejor-con-tu-estilo",
    title: "Tipos de pistas de baile para eventos: ¿Cuál va mejor con tu estilo?",
    excerpt: "Desde pistas iluminadas LED hasta acabados de madera. Explora cómo la pista de baile puede transformar por completo la atmósfera de tu fiesta.",
    date: "30 de Junio, 2026",
    readTime: "4 min de lectura",
    category: "Pistas y Espacios",
    imageUrl: "/blog/led_dance_floor_1782782352317.png",
    content: (
      <div className="space-y-6">
        <p>La pista de baile es el corazón de tu celebración. Es el lugar donde ocurren los momentos más memorables de la noche. Elegir la pista correcta puede elevar drásticamente el impacto visual de tu evento en CDMX.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Pistas de Cristal Iluminadas LED</h2>
        <p>Perfectas para XV años y bodas modernas. Estas pistas cambian de color al ritmo de la música y le dan un efecto infinito al salón. Son sinónimo de energía y diversión absoluta.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Pistas de Madera Vintage o Pintadas a Mano</h2>
        <p>Si tu evento tiene una temática rústica, boho-chic o extremadamente elegante, una pista de madera pulida o con un diseño floral pintado a mano aporta una sofisticación inigualable.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Nuestros Espacios</h2>
        <p>En Salones San Pedro contamos con espacios versátiles adaptables a cualquier tipo de montaje y estilo de pista que tengas en mente. ¡Haremos que el centro de atención brille como nunca!</p>
        
        <CTA />
      </div>
    )
  },
  "como-distribuir-el-espacio-en-tu-evento-para-que-la-pista-de-baile-siempre-este-llena": {
    slug: "como-distribuir-el-espacio-en-tu-evento-para-que-la-pista-de-baile-siempre-este-llena",
    title: "Cómo distribuir el espacio en tu evento para que la pista de baile siempre esté llena",
    excerpt: "Consejos de arquitectura de eventos para acomodar mesas, DJ y pista, garantizando que todos tus invitados se animen a bailar.",
    date: "30 de Junio, 2026",
    readTime: "5 min de lectura",
    category: "Pistas y Espacios",
    imageUrl: "/blog/event_space_layout_1782782359857.png",
    content: (
      <div className="space-y-6">
        <p>Acomodar las mesas al azar es uno de los errores más grandes al planear un evento. La arquitectura espacial de tu salón determinará si tus invitados se sienten motivados a pararse a bailar o prefieren quedarse sentados.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">La Pista como Punto Focal</h2>
        <p>La pista de baile no debe estar arrinconada. Debe estar en el centro, visible desde la gran mayoría de las mesas. Esto invita subconscientemente a la acción.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">La Cercanía del DJ o Grupo Musical</h2>
        <p>La cabina del DJ o el escenario del grupo musical debe estar pegado a la pista. Esta proximidad crea una sinergia de energía entre los músicos y los bailarines.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">La Barra de Bebidas</h2>
        <p>Un excelente truco de nuestros planificadores en Salones San Pedro es colocar la barra de coctelería relativamente cerca de la pista. De esta manera, quienes van por una bebida se incorporan rápidamente al baile.</p>
        
        <CTA />
      </div>
    )
  },
  "checklist-definitivo-para-organizar-un-evento-inolvidable-sin-estresarte": {
    slug: "checklist-definitivo-para-organizar-un-evento-inolvidable-sin-estresarte",
    title: "Checklist definitivo para organizar un evento inolvidable (sin estresarte)",
    excerpt: "Tu guía mes a mes con todas las tareas esenciales para planear tu boda o XV años en CDMX con total tranquilidad.",
    date: "30 de Junio, 2026",
    readTime: "7 min de lectura",
    category: "Coordinación",
    imageUrl: "/blog/wedding_planner_checklist_1782782369508.png",
    content: (
      <div className="space-y-6">
        <p>Organizar una fiesta de gran magnitud puede ser abrumador. Para mantener el estrés a raya, la organización temporal lo es todo.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">A 6 Meses del Evento</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Define la cantidad de invitados.</li>
          <li>Reserva el salón y la fecha.</li>
          <li>Contrata música y fotografía.</li>
        </ul>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">A 3 Meses del Evento</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Elige las invitaciones.</li>
          <li>Haz la degustación de <strong><Link href="/#banquetes" className="text-primary hover:underline">platillos</Link></strong> y define el menú.</li>
          <li>Define la decoración floral.</li>
        </ul>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">A 1 Mes del Evento</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Confirma asistencia final de invitados.</li>
          <li>Arma el croquis de mesas.</li>
          <li>Define el programa de la noche con tu <strong><Link href="/#paquetes" className="text-primary hover:underline">coordinación</Link></strong> de eventos.</li>
        </ul>
        
        <p>Si quieres olvidarte del estrés por completo y disfrutar de tu fiesta como un invitado más, conoce nuestro servicio de <strong><Link href="/#paquetes" className="text-primary hover:underline">coordinación</Link></strong> de eventos. ¡Nosotros nos encargamos del trabajo pesado!</p>
        
        <CTA />
      </div>
    )
  },
  "5-razones-por-las-que-necesitas-un-coordinador-de-eventos-profesional": {
    slug: "5-razones-por-las-que-necesitas-un-coordinador-de-eventos-profesional",
    title: "5 razones por las que necesitas un coordinador de eventos profesional",
    excerpt: "Descubre el enorme valor que aporta un equipo experto en la solución de imprevistos, control de tiempos y trato con proveedores.",
    date: "30 de Junio, 2026",
    readTime: "4 min de lectura",
    category: "Coordinación",
    imageUrl: "/blog/event_coordinator_professional_1782782383705.png",
    content: (
      <div className="space-y-6">
        <p>Tener un salón hermoso y <strong><Link href="/#banquetes" className="text-primary hover:underline">platillos</Link></strong> deliciosos es clave, pero sin alguien que dirija la orquesta, el ritmo puede perderse.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">1. Solución Invisible de Imprevistos</h2>
        <p>Los imprevistos siempre suceden, pero un profesional los resuelve sin que tú o tus invitados se den cuenta.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">2. Control Absoluto del Cronograma</h2>
        <p>Desde la entrada triunfal hasta el corte de pastel, garantizamos que todo ocurra en el tiempo pactado para no enfriar el ambiente.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">3. Trato con Proveedores</h2>
        <p>Olvídate de estar llamando al fotógrafo o al florista el día de tu evento. Nuestra <strong><Link href="/#paquetes" className="text-primary hover:underline">coordinación</Link></strong> lo hace por ti.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">4. Asesoría Basada en Experiencia</h2>
        <p>Sugerimos dinámicas probadas que funcionan y evitamos aquellas que suelen fallar.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">5. Paz Mental Total</h2>
        <p>Tu única tarea será sonreír, bailar y disfrutar de tu fiesta en CDMX.</p>
        
        <CTA />
      </div>
    )
  },
  "errores-comunes-al-planear-una-boda-xv-anos-y-como-evitarlos": {
    slug: "errores-comunes-al-planear-una-boda-xv-anos-y-como-evitarlos",
    title: "Errores comunes al planear una boda o XV años y cómo evitarlos",
    excerpt: "Nuestra experiencia organizando cientos de eventos nos ha enseñado qué cosas no hacer. Conoce cómo evitar los errores de planeación más costosos.",
    date: "30 de Junio, 2026",
    readTime: "6 min de lectura",
    category: "Coordinación",
    imageUrl: "/blog/wedding_planning_errors_1782782393476.png",
    content: (
      <div className="space-y-6">
        <p>La experiencia es la mejor maestra. A través de nuestros años en Salones San Pedro, hemos identificado las fallas más recurrentes de quienes organizan su propio evento por primera vez.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Asumir Asistencias Perfectas</h2>
        <p>Nunca pagues <strong><Link href="/#banquetes" className="text-primary hover:underline">platillos</Link></strong> asumiendo que el 100% de tus invitados asistirá. Suele haber una merma del 10% al 15%. Pide confirmaciones reales.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Ignorar el Factor Clima y Tráfico en CDMX</h2>
        <p>Poner citas muy estrictas en días de alto tráfico en la zona de Gustavo A. Madero puede arruinar tu cronograma. Siempre da un margen de 30 minutos de tolerancia.</p>
        
        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Hacerlo Todo Solo</h2>
        <p>Delegar es necesario. Querer supervisar la música, los alimentos y la decoración tú mismo provocará que no disfrutes tu propio evento. Para eso existe nuestro servicio integral de <strong><Link href="/#paquetes" className="text-primary hover:underline">coordinación</Link></strong>.</p>
        
        <CTA />
      </div>
    )
  }
};

import React from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
}

export interface BlogPostDetail {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  content: React.ReactNode;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "como-elegir-el-menu-de-bodas-perfecto",
    title: "Cómo elegir el menú de bodas perfecto: 5 consejos gourmet",
    excerpt: "Descubre los secretos de nuestro chef ejecutivo para crear una experiencia gastronómica inolvidable que deleite a todos tus invitados con toques poblanos contemporáneos.",
    date: "24 de Mayo, 2026",
    readTime: "5 min de lectura",
    category: "Gastronomía",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "importancia-de-la-iluminacion-en-eventos",
    title: "La importancia de la iluminación en eventos de gala",
    excerpt: "Cómo el diseño lumínico y los efectos especiales pueden transformar un espacio y crear la atmósfera emocional adecuada para tu boda o XV años.",
    date: "18 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Producción",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "tendencias-decoracion-boutique-este-ano",
    title: "Tendencias de decoración floral boutique para este año",
    excerpt: "Desde arreglos suspendidos hasta centros de mesa orgánicos. Te presentamos lo último en interiorismo floral para eventos con sello de distinción.",
    date: "10 de Mayo, 2026",
    readTime: "6 min de lectura",
    category: "Decoración",
    imageUrl: "https://images.unsplash.com/photo-1519225495810-7517c2965a7d?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "salones-para-fiestas-con-mesa-de-dulces-personalizada",
    title: "Mesas de dulces personalizadas: La tendencia indispensable en CDMX",
    excerpt: "Consiente a tus invitados con una mesa de dulces diseñada a la medida. Conoce cómo nuestras golosinas premium y montajes temáticos marcan la diferencia.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "/servicios/mesa-dulces.jpg"
  },
  {
    slug: "servicios-de-cocteleria-para-eventos-sociales",
    title: "Coctelería de autor: Bebidas espectaculares para animar tu recepción",
    excerpt: "Piñas coladas, medias de seda, congas y margaritas. Descubre cómo nuestra barra de coctelería eleva la experiencia de tus invitados en Gustavo A. Madero.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Bebidas",
    imageUrl: "/servicios/cocteleria.jpg"
  },
  {
    slug: "salones-con-banquete-de-arrachera",
    title: "Menú con Arrachera: La reina de la gastronomía en eventos boutique",
    excerpt: "Sorprende a tus invitados con un banquete de arrachera en su punto perfecto. Te explicamos por qué esta opción es ideal para bodas y cenas de fin de año.",
    date: "28 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Gastronomía",
    imageUrl: "/servicios/arrachera.jpg"
  },
  {
    slug: "batucada-con-robot-led-para-eventos",
    title: "Show de Robot Iron-Man: La revolución de las batucadas en XV años",
    excerpt: "Añade luces LED, baile y un show inolvidable a tu celebración. Conoce cómo nuestro Robot Iron-Man transforma la fiesta y anima a todos a bailar.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Show",
    imageUrl: "/servicios/robot.jpg"
  },
  {
    slug: "renta-de-cabina-360-para-eventos",
    title: "Cabina 360°: La experiencia interactiva más viral para bodas y XV años",
    excerpt: "Videos ilimitados en alta definición con souvenirs divertidos. Descubre por qué la cabecera interactiva es la atracción favorita de los jóvenes en CDMX.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "/servicios/cabina-360.jpg"
  },
  {
    slug: "paquetes-de-fotografia-profesional-para-eventos",
    title: "Fotografía Profesional: Captura los momentos más emotivos de tu boda",
    excerpt: "Paquetes fotográficos con fotos digitales en USB, ampliaciones e impresiones en álbum. Asegura que los mejores recuerdos de tu gran día perduren.",
    date: "28 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Producción",
    imageUrl: "/servicios/fotografia.jpg"
  },
  {
    slug: "video-profesional-para-bodas-y-xv-anos",
    title: "Video Profesional de Eventos: Revive las emociones en alta definición",
    excerpt: "Filmación cinemática de tu evento entregada en una memoria USB personalizada. Guarda cada discurso, baile y sonrisa para siempre.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Producción",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "renta-de-letras-gigantes-iluminadas",
    title: "Letras Gigantes Iluminadas: Dale un toque espectacular a tu recepción",
    excerpt: "Renta de letreros iluminados 'X.V' y 'Corazón'. El marco fotográfico ideal para que tus invitados inmortalicen su asistencia a tu fiesta.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Decoración",
    imageUrl: "/servicios/letras.jpg"
  },
  {
    slug: "renta-de-cabina-de-fotos-instantanea",
    title: "Cabina de fotos instantánea: Diversión y souvenirs ilimitados",
    excerpt: "Fotos instantáneas ilimitadas durante 1.30 hrs con accesorios divertidos y tiras personalizadas. El recuerdo impreso favorito de tus invitados.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "/servicios/cabina-fotos.jpg"
  },
  {
    slug: "grupo-musical-versatil-para-fiestas",
    title: "Grupo Musical Versátil: La garantía de una pista de baile llena",
    excerpt: "Grupos de 5 y 8 elementos con dinámicas interactivas y sets de DJ incluidos. Descubre cómo mantener el ambiente al máximo en Gustavo A. Madero.",
    date: "28 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Música",
    imageUrl: "/servicios/grupo-musical.jpg"
  },
  {
    slug: "salones-con-show-de-mariachi-incluido",
    title: "Show de Mariachi en Vivo: Tradición y emoción en tu celebración",
    excerpt: "Consiente a tus familiares y amigos con música de mariachi en vivo. El complemento perfecto para bodas y aniversarios en la CDMX.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Música",
    imageUrl: "/servicios/mariachi.jpg"
  },
  {
    slug: "renta-de-inflables-seguros-para-eventos-infantiles",
    title: "Inflables para fiestas: Diversión y seguridad para los más pequeños",
    excerpt: "Inflables de alta resistencia y limpieza garantizada para fiestas en salones. Conoce cómo asegurar el entretenimiento de los niños en tu evento.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "https://images.unsplash.com/photo-1572945236204-094fa95b9c7a?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "show-de-saxofon-en-vivo-para-recepciones",
    title: "Saxofón en vivo: Sofisticación para tu cóctel de bienvenida",
    excerpt: "Música en vivo elegante para recibir a tus invitados y amenizar el banquete. Añade un toque de distinción jazzística y moderna a tu evento corporativo.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Música",
    imageUrl: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "show-de-violin-en-vivo-para-bodas",
    title: "Violín en vivo: Romanticismo y gala para ceremonias en CDMX",
    excerpt: "Melodías clásicas y contemporáneas interpretadas con violín en vivo. El acompañamiento ideal para la marcha nupcial y momentos memorables.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Música",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "decoracion-con-globos-moderna-para-fiestas",
    title: "Decoración con Globos: Diseños orgánicos y arcos para eventos de gala",
    excerpt: "Transforma tu salón con decoraciones con globos creativas y modernas. Conoce las últimas tendencias de arcos de globos para XV años.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Decoración",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "servicio-de-reposteria-y-postres-extra-para-eventos",
    title: "Postre Extra: El dulce complemento perfecto para tu menú de 3 tiempos",
    excerpt: "Agrega repostería fina, tartas o mousse como postre extra y deleita los paladares de tus invitados con el toque final de nuestro chef.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Gastronomía",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "carrito-de-shots-para-animacion-de-fiestas",
    title: "Carrito de Shots: Animación y sabor para encender la pista de baile",
    excerpt: "Un divertido carrito móvil que reparte shots personalizados a tus invitados en plena fiesta. Conoce esta tendencia de animación de bodas.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Show",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "renta-de-salones-con-limosina-incluida",
    title: "Renta de Limusinas: Una llegada espectacular para tus XV años",
    excerpt: "Modelos Hummer H2, Lincoln y Chrysler 300 con pista iluminada y pantallas. Conoce nuestro paquete premium con traslado de 4 horas incluido.",
    date: "28 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Servicios Plus",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "renta-de-auto-clasico-para-bodas",
    title: "Auto Clásico Mercedes-Benz 1930: La entrada elegante para novios",
    excerpt: "Elegante auto de época Mercedes-Benz clásico con chofer y arreglos florales incluidos. La mejor opción de transporte nupcial con estilo retro.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80"
  }
];

const renderCTA = (serviceName: string) => (
  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center my-8">
    <h3 className="font-display-lg text-xl text-primary font-bold mb-2">¿Quieres incluir {serviceName} en tu paquete?</h3>
    <p className="text-secondary mb-4 text-sm font-body-md">
      En Salones San Pedro Plus personalizamos cada elemento para adaptarlo a tus necesidades y hacer realidad el evento de tus sueños en la Ciudad de México y Estado de México.
    </p>
    <a href="/#disponibilidad" className="inline-block bg-primary text-on-primary font-label-sm uppercase tracking-wider px-6 py-3 rounded hover:bg-primary/95 transition-all text-sm font-semibold shadow-md">
      COTIZAR EVENTO
    </a>
  </div>
);

export const BLOG_POSTS_DETAILS: Record<string, BlogPostDetail> = {
  "como-elegir-el-menu-de-bodas-perfecto": {
    slug: "como-elegir-el-menu-de-bodas-perfecto",
    title: "Cómo elegir el menú de bodas perfecto: 5 consejos gourmet",
    excerpt: "Descubre los secretos de nuestro chef ejecutivo para crear una experiencia gastronómica inolvidable que deleite a todos tus invitados con toques poblanos contemporáneos.",
    date: "24 de Mayo, 2026",
    readTime: "5 min de lectura",
    category: "Gastronomía",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>El banquete de bodas es mucho más que comida; es un momento de celebración, una muestra de agradecimiento hacia tus invitados y un reflejo de la personalidad de la pareja. Para lograr que la cena de tu boda sea un éxito rotundo, es fundamental planificar con cuidado.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">1. Conoce el perfil de tus invitados</h2>
        <p>Antes de definir los platillos, considera las restricciones alimenticias más comunes: invitados vegetarianos, veganos, celíacos o con alergias alimentarias. Nuestro servicio de banquetes ofrece alternativas deliciosas para cada uno de ellos sin alterar la calidad del menú general.</p>

        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">2. Elige ingredientes de temporada</h2>
        <p>Utilizar ingredientes locales y de temporada asegura la frescura de los alimentos y potencia el sabor. La gastronomía boutique de Salones San Pedro Plus se destaca por incorporar productos frescos de la más alta calidad.</p>

        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">3. El equilibrio de los tiempos</h2>
        <p>Un menú tradicional de tres tiempos (entrada, plato fuerte y postre) debe estar perfectamente balanceado. Si la entrada es cremosa o pesada, el plato fuerte debe ser más ligero. Lograr esta armonía es el sello característico de nuestro chef ejecutivo.</p>

        {renderCTA("nuestro Banquete de Gala")}
      </article>
    )
  },
  "importancia-de-la-iluminacion-en-eventos": {
    slug: "importancia-de-la-iluminacion-en-eventos",
    title: "La importancia de la iluminación en eventos de gala",
    excerpt: "Cómo el diseño lumínico y los efectos especiales pueden transformar un espacio y crear la atmósfera adecuada para tu boda o XV años.",
    date: "18 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Producción",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La iluminación es uno de los elementos de producción más influyentes en un evento. Tiene el poder de transformar por completo el aspecto visual de un salón, enfocar la atención en momentos clave y, sobre todo, definir el estado de ánimo de tus invitados.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Iluminación Arquitectónica: Resaltando la elegancia</h2>
        <p>La iluminación arquitectónica consiste en proyectar luces sobre las columnas, techos y paredes del salón para resaltar sus formas y texturas. En Salones San Pedro Plus utilizamos tecnología LED programable para bañar el recinto en tonos cálidos o dorados durante la cena, y cambiarlos a tonos vibrantes cuando comienza el baile.</p>

        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">La Pista de Baile LED: El imán de la fiesta</h2>
        <p>Nuestra pista de baile LED pixelada añade dinamismo y modernidad a la celebración. Se sincroniza con la música del DJ y genera efectos visuales increíbles que animan a todos a pararse a bailar y lucen espectaculares en las fotografías y videos de recuerdo.</p>

        {renderCTA("la Iluminación LED y Audio")}
      </article>
    )
  },
  "tendencias-decoracion-boutique-este-ano": {
    slug: "tendencias-decoracion-boutique-este-ano",
    title: "Tendencias de decoración floral boutique para este año",
    excerpt: "Desde arreglos suspendidos hasta centros de mesa orgánicos. Te presentamos lo último en interiorismo floral para eventos con sello de distinción.",
    date: "10 de Mayo, 2026",
    readTime: "6 min de lectura",
    category: "Decoración",
    imageUrl: "https://images.unsplash.com/photo-1519225495810-7517c2965a7d?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>El interiorismo de eventos ha evolucionado hacia la naturalidad y la personalización boutique. Este año, las tendencias de diseño floral se enfocan en crear ambientes envolventes que transporten a los invitados a un escenario de fantasía y lujo sutil.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Arreglos Florales Suspendidos</h2>
        <p>Una de las corrientes más populares es llevar las flores de las mesas al techo. Las cascadas florales y coronas suspendidas sobre las mesas principales y la pista de baile crean una sensación inmersiva y añaden volumen y elegancia al salón Diamante o Platino.</p>

        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Centros de Mesa Orgánicos y Asimétricos</h2>
        <p>Atrás quedaron las esferas de flores perfectas y rígidas. La tendencia hoy apunta a centros de mesa de estilo silvestre, donde los follajes exóticos, ramas y flores de distintas alturas interactúan de forma natural, acompañados por velas aromáticas para un ambiente íntimo.</p>

        {renderCTA("la Decoración Floral Boutique")}
      </article>
    )
  },
  "salones-para-fiestas-con-mesa-de-dulces-personalizada": {
    slug: "salones-para-fiestas-con-mesa-de-dulces-personalizada",
    title: "Mesas de dulces personalizadas: La tendencia indispensable en CDMX",
    excerpt: "Consiente a tus invitados con una mesa de dulces diseñada a la medida. Conoce cómo nuestras golosinas premium y montajes temáticos marcan la diferencia.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "/servicios/mesa-dulces.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La mesa de dulces se ha convertido en un elemento esencial y de alto impacto visual en bodas, graduaciones y XV años. No es solo un buffet de golosinas; es una declaración de diseño que complementa la temática de tu evento y deleita a invitados de todas las edades.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Diseño a la medida y Golosinas Premium</h2>
        <p>En Salones San Pedro Plus, diseñamos cada mesa de dulces cuidando la paleta de colores de tu evento. Ofrecemos una selección premium que incluye repostería miniatura, chocolates artesanales, gomitas gourmet, postres individuales de vasito y frituras personalizadas con salsas tradicionales.</p>

        <h3 className="font-display-lg text-xl text-on-surface font-semibold mt-6">¿Qué incluye nuestro servicio de Mesa de Dulces?</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Montaje decorativo temático con bases de cristal, madera o espejos.</li>
          <li>Variedad de 10 a 15 tipos de golosinas (dulces, salados, aciditos y repostería).</li>
          <li>Letreros y etiquetas personalizadas con el nombre del festejado.</li>
          <li>Personal a cargo del montaje y asistencia a los invitados durante la apertura.</li>
        </ul>

        {renderCTA("nuestra Mesa de Dulces personalizada")}
      </article>
    )
  },
  "servicios-de-cocteleria-para-eventos-sociales": {
    slug: "servicios-de-cocteleria-para-eventos-sociales",
    title: "Coctelería de autor: Bebidas espectaculares para animar tu recepción",
    excerpt: "Piñas coladas, medias de seda, congas y margaritas. Descubre cómo nuestra barra de coctelería eleva la experiencia de tus invitados en Gustavo A. Madero.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Bebidas",
    imageUrl: "/servicios/cocteleria.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>Ofrecer una barra de bebidas sofisticada y divertida desde la llegada de tus invitados marca el tono de la fiesta. La coctelería para eventos ha evolucionado más allá del clásico refresco y vino, incorporando cocteles clásicos y mezclas de autor con una presentación impecable.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Nuestra propuesta de barra de cócteles</h2>
        <p>Contamos con mixólogos profesionales que preparan bebidas en vivo utilizando ingredientes de calidad, jarabes artesanales y garnituras frescas. Entre los favoritos de nuestros clientes se encuentran:</p>
        
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Piñas Coladas y Medias de Seda:</strong> Cócteles cremosos y dulces que encantan a todos.</li>
          <li><strong>Margaritas y Mojitos:</strong> Bebidas cítricas y refrescantes, perfectas para abrir boca durante la recepción.</li>
          <li><strong>Congas y Cócteles sin alcohol (Mocktails):</strong> Opciones espectaculares y coloridas para los jóvenes y niños.</li>
        </ul>

        {renderCTA("la Barra de Coctelería de Autor")}
      </article>
    )
  },
  "salones-con-banquete-de-arrachera": {
    slug: "salones-con-banquete-de-arrachera",
    title: "Menú con Arrachera: La reina de la gastronomía en eventos boutique",
    excerpt: "Sorprende a tus invitados con un banquete de arrachera en su punto perfecto. Te explicamos por qué esta opción es ideal para bodas y cenas de fin de año.",
    date: "28 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Gastronomía",
    imageUrl: "/servicios/arrachera.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La selección del plato fuerte es la decisión gastronómica más importante de tu banquete. Para quienes buscan garantizar que cada invitado disfrute una experiencia deliciosa, tierna y con mucho sabor, el menú con arrachera marinada al punto es la opción ganadora en la Ciudad de México y Estado de México.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">¿Por qué elegir Arrachera para tu banquete?</h2>
        <p>La arrachera es un corte sumamente popular por su textura suave y sabor intenso. Nuestro equipo de cocina la prepara utilizando un marinado especial de la casa y la sirve asada al punto exacto, acompañada de guarniciones gourmet como papas al horno rellenas de queso y tocino, o espárragos envueltos en tocino con mantequilla de ajo.</p>

        <h3 className="font-display-lg text-xl text-on-surface font-semibold mt-6">Propuesta de menú de 3 tiempos con Arrachera:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Primer Tiempo:</strong> Crema suave de elote con hojuelas de chile ancho o ensalada tibia de portobello.</li>
          <li><strong>Segundo Tiempo:</strong> Suprema de arrachera marinada a las hierbas con puré rústico y atado de verduras.</li>
          <li><strong>Tercer Tiempo:</strong> Mousse de chocolate semi-amargo o strudel de manzana con helado de vainilla.</li>
        </ul>

        {renderCTA("nuestro Menú Especial de Arrachera")}
      </article>
    )
  },
  "batucada-con-robot-led-para-eventos": {
    slug: "batucada-con-robot-led-para-eventos",
    title: "Show de Robot Iron-Man: La revolución de las batucadas en XV años",
    excerpt: "Añade luces LED, baile y un show inolvidable a tu celebración. Conoce cómo nuestro Robot Iron-Man transforma la fiesta y anima a todos a bailar.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Show",
    imageUrl: "/servicios/robot.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La batucada es el punto culminante de la fiesta, el momento en que se reparte la animación y la pista se llena al máximo. Para hacer de este momento algo verdaderamente espectacular y memorable, nuestro show con el Robot Iron-Man gigante iluminado es ideal.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Impacto Visual y Baile Interactivo</h2>
        <p>Nuestro Robot Iron-Man mide más de 2 metros de altura y cuenta con un traje de armadura iluminado con tecnología LED de última generación y efectos láser. El animador dentro del traje interactúa directamente con los invitados en la pista de baile, organizando coreografías, portando pistolas de chispa fría y creando un ambiente futurista que fascina a jóvenes y adultos.</p>

        {renderCTA("el Show de Robot Iron-Man en Batucada")}
      </article>
    )
  },
  "renta-de-cabina-360-para-eventos": {
    slug: "renta-de-cabina-360-para-eventos",
    title: "Cabina 360°: La experiencia interactiva más viral para bodas y XV años",
    excerpt: "Videos ilimitados en alta definición con souvenirs divertidos. Descubre por qué la cabecera interactiva es la atracción favorita de los jóvenes en CDMX.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "/servicios/cabina-360.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La cabina 360° se ha convertido en la atracción indispensable de los eventos modernos. Permite a tus invitados grabar videos dinámicos y divertidos en cámara lenta que están listos para subirse instantáneamente a TikTok o Instagram, generando un gran recuerdo digital de tu fiesta.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">¿Cómo funciona nuestro servicio de Cabina 360°?</h2>
        <p>Instalamos una plataforma giratoria con capacidad para 3 o 4 personas. Una cámara de alta definición gira alrededor de los invitados mientras bailan, saltan y se divierten con accesorios inflables, confeti o pistolas de burbujas. El video se procesa con música de fondo y efectos especiales en menos de un minuto.</p>

        <h3 className="font-display-lg text-xl text-on-surface font-semibold mt-6">Nuestro paquete incluye:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>1 hora y media de videos ilimitados.</li>
          <li>Operador profesional a cargo del equipo y la asistencia a invitados.</li>
          <li>Accesorios de animación divertidos (sombreros, antifaces, souvenirs).</li>
          <li>Entrega de videos vía código QR o WhatsApp de forma inmediata.</li>
        </ul>

        {renderCTA("la Cabina 360° para tu evento")}
      </article>
    )
  },
  "paquetes-de-fotografia-profesional-para-eventos": {
    slug: "paquetes-de-fotografia-profesional-para-eventos",
    title: "Fotografía Profesional: Captura los momentos más emotivos de tu boda",
    excerpt: "Paquetes fotográficos con fotos digitales en USB, ampliaciones e impresiones en álbum. Asegura que los mejores recuerdos de tu gran día perduren.",
    date: "28 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Producción",
    imageUrl: "/servicios/fotografia.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>El día de tu boda o los XV años de tu hija transcurren rápidamente, pero las fotografías quedan para siempre. Contar con un equipo de fotografía profesional que domine la iluminación en interiores y capte las expresiones espontáneas de alegría y emoción es vital para documentar tu evento.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Nuestro servicio de cobertura fotográfica</h2>
        <p>Salones San Pedro Plus cuenta con fotógrafos especializados en eventos de gala. Capturamos desde la sesión casual de preparación, la ceremonia, la recepción y todo el desarrollo del banquete y baile de gala.</p>

        <h3 className="font-display-lg text-xl text-on-surface font-semibold mt-6">Contenido de nuestro paquete de Fotografía:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cobertura completa del evento por fotógrafos profesionales.</li>
          <li>Entrega de todas las fotos digitales editadas en alta resolución en memoria USB.</li>
          <li>Álbum impreso personalizado con acabados de lujo y selección de fotos clave.</li>
          <li>Ampliación de fotografía montada en bastidor para la mesa de firmas o recepción.</li>
        </ul>

        {renderCTA("el servicio de Fotografía Profesional")}
      </article>
    )
  },
  "video-profesional-para-bodas-y-xv-anos": {
    slug: "video-profesional-para-bodas-y-xv-anos",
    title: "Video Profesional de Eventos: Revive las emociones en alta definición",
    excerpt: "Filmación cinemática de tu evento entregada en una memoria USB personalizada. Guarda cada discurso, baile y sonrisa para siempre.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Producción",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La fotografía captura un instante, pero el video captura el sonido del 'sí, acepto', los discursos emotivos de los padres, las risas de los amigos y el ambiente festivo de la pista de baile. El video cinemático profesional te permite revivir tu gran día una y otra vez con la máxima calidad.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Edición cinematográfica y calidad digital</h2>
        <p>Utilizamos cámaras de alta definición con estabilizadores para lograr tomas fluidas y elegantes. El video final se edita incorporando música de fondo seleccionada por los novios y se entrega en formato digital de alta resolución en una USB personalizada, listo para compartir y ver con toda la familia.</p>

        {renderCTA("el servicio de Video Profesional")}
      </article>
    )
  },
  "renta-de-letras-gigantes-iluminadas": {
    slug: "renta-de-letras-gigantes-iluminadas",
    title: "Letras Gigantes Iluminadas: Dale un toque espectacular a tu recepción",
    excerpt: "Renta de letreros iluminados 'X.V' y 'Corazón'. El marco fotográfico ideal para que tus invitados inmortalicen su asistencia a tu fiesta.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Decoración",
    imageUrl: "/servicios/letras.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>Las letras gigantes iluminadas con focos tipo vintage o luces LED se han convertido en un elemento decorativo de gran impacto para bodas y XV años. No solo delimitan un espacio elegante dentro del salón, sino que sirven como el fondo perfecto para la sesión de fotos de los invitados.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Nuestros modelos disponibles para renta</h2>
        <p>Ofrecemos letras de 1.20 metros de altura en color blanco mate con iluminación cálida:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Letrero 'X.V':</strong> Ideal para quinceañeras, colocado a los costados de la mesa de honor o en el acceso principal.</li>
          <li><strong>Letrero 'Corazón':</strong> Un elemento romántico e iluminado perfecto para bodas y aniversarios en el salón Diamante.</li>
        </ul>

        {renderCTA("las Letras Gigantes Iluminadas")}
      </article>
    )
  },
  "renta-de-cabina-de-fotos-instantanea": {
    slug: "renta-de-cabina-de-fotos-instantanea",
    title: "Cabina de fotos instantánea: Diversión y souvenirs ilimitados",
    excerpt: "Fotos instantáneas ilimitadas durante 1.30 hrs con accesorios divertidos y tiras personalizadas. El recuerdo impreso favorito de tus invitados.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "/servicios/cabina-fotos.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>Una cabina de fotos instantánea (photo booth) es una excelente manera de entretener a tus invitados durante el cóctel de bienvenida y el baile. Es una actividad divertida y dinámica donde las personas pueden ponerse pelucas, sombreros y lentes graciosos para tomarse fotos que se imprimen al momento.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Detalles de nuestro servicio de Cabina de Fotos</h2>
        <p>Instalamos una cabina automatizada con una pantalla táctil. Los invitados posan y se toman una serie de 4 imágenes por fotografía. La máquina imprime dos copias de la tira en papel fotográfico de alta calidad en segundos, incluyendo el logotipo y fecha personalizada del evento.</p>
        
        <p><strong>Duración:</strong> 1 hora y media de impresiones ilimitadas con accesorios y utilería divertida incluida.</p>

        {renderCTA("la Cabina de Fotos instantánea")}
      </article>
    )
  },
  "grupo-musical-versatil-para-fiestas": {
    slug: "grupo-musical-versatil-para-fiestas",
    title: "Grupo Musical Versátil: La garantía de una pista de baile llena",
    excerpt: "Grupos de 5 y 8 elementos con dinámicas interactivas y sets de DJ incluidos. Descubre cómo mantener el ambiente al máximo en Gustavo A. Madero.",
    date: "28 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Música",
    imageUrl: "/servicios/grupo-musical.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La música en vivo tiene una energía incomparable que contagia a los invitados y los invita a bailar. Contratar un grupo versátil profesional que domine géneros desde cumbia, salsa y rock en español, hasta pop moderno y éxitos de los 80, es la clave de un evento exitoso.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Nuestras alineaciones de Grupo Versátil</h2>
        <p>Ofrecemos opciones de 5 y 8 elementos compuestos por cantantes, teclados, percusiones, guitarra y metales. Para garantizar que la música nunca pare, nuestro servicio se estructura en 5 tiempos continuos de animación:</p>
        
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>45 Minutos de Grupo en Vivo:</strong> Con sets temáticos de baile, coreografías y artículos de animación.</li>
          <li><strong>15 Minutos de DJ:</strong> Para cubrir la transición y mantener la energía al máximo mientras el grupo toma un breve descanso.</li>
        </ul>

        {renderCTA("nuestro Grupo Musical Versátil")}
      </article>
    )
  },
  "salones-con-show-de-mariachi-incluido": {
    slug: "salones-con-show-de-mariachi-incluido",
    title: "Show de Mariachi en Vivo: Tradición y emoción en tu celebración",
    excerpt: "Consiente a tus familiares y amigos con música de mariachi en vivo. El complemento perfecto para bodas y aniversarios en la CDMX.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Música",
    imageUrl: "/servicios/mariachi.jpg",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>El mariachi es sinónimo de fiesta mexicana. El sonido de las trompetas y los violines al entonar 'El Son de la Negra' o 'Sabes una cosa' crea un momento mágico y emotivo que toca las fibras de todos los asistentes. Es el cierre perfecto para el banquete o la apertura ideal de la tornaboda.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Show profesional de Mariachi en Salones San Pedro Plus</h2>
        <p>Ofrecemos la presentación de un mariachi profesional compuesto por músicos uniformados y con instrumentos de gala. El show incluye una hora completa de canciones tradicionales, complacencias para los festejados y dinámicas de canto grupal para animar la fiesta.</p>

        {renderCTA("el Show de Mariachi profesional")}
      </article>
    )
  },
  "renta-de-inflables-seguros-para-eventos-infantiles": {
    slug: "renta-de-inflables-seguros-para-eventos-infantiles",
    title: "Inflables para fiestas: Diversión y seguridad para los más pequeños",
    excerpt: "Inflables de alta resistencia y limpieza garantizada para fiestas en salones. Conoce cómo asegurar el entretenimiento de los niños en tu evento.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "https://images.unsplash.com/photo-1572945236204-094fa95b9c7a?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>En las bodas, bautizos y graduaciones, el entretenimiento de los niños es fundamental para permitir que los papás disfruten plenamente de la celebración. Un inflable dentro de las instalaciones amplias de nuestro salón ofrece diversión segura, activa y contenida para los pequeños.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Seguridad y Sanitización Garantizada</h2>
        <p>Nuestros inflables están fabricados con lona de alta resistencia y cuentan con mallas de protección perimetral. Cada equipo es lavado y sanitizado profundamente antes y después de cada evento. El servicio incluye instalación, inflador silencioso y monitoreo para asegurar el uso adecuado por parte de los niños.</p>

        {renderCTA("la Renta de Inflables infantiles")}
      </article>
    )
  },
  "show-de-saxofon-en-vivo-para-recepciones": {
    slug: "show-de-saxofon-en-vivo-para-recepciones",
    title: "Saxofón en vivo: Sofisticación para tu cóctel de bienvenida",
    excerpt: "Música en vivo elegante para recibir a tus invitados y amenizar el banquete. Añade un toque de distinción jazzística y moderna a tu evento corporativo.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Música",
    imageUrl: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>El sonido cálido y envolvente de un saxofón es el complemento musical ideal para crear una atmósfera distinguida durante el cóctel de bienvenida de tu boda o el banquete de un evento empresarial. Añade clase y permite a tus invitados conversar cómodamente.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Repertorio elegante y moderno</h2>
        <p>Nuestro saxofonista profesional ofrece un repertorio versátil que incluye estándares de jazz clássico, covers de música pop y baladas contemporáneas en inglés y español. El servicio se realiza con equipo de amplificación discreto pero de alta fidelidad, asegurando el volumen perfecto.</p>

        {renderCTA("el Show de Saxofón en vivo")}
      </article>
    )
  },
  "show-de-violin-en-vivo-para-bodas": {
    slug: "show-de-violin-en-vivo-para-bodas",
    title: "Violín en vivo: Romanticismo y gala para ceremonias en CDMX",
    excerpt: "Melodías clásicas y contemporáneas interpretadas con violín en vivo. El acompañamiento ideal para la marcha nupcial y momentos memorables.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Música",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>Pocos instrumentos musicales evocan tantas emociones y romanticismo como el violín. Su interpretación en vivo durante la ceremonia civil o religiosa, el brindis de honor de la boda o la recepción de invitados añade una distinción inolvidable al evento.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Melodías para enmarcar momentos especiales</h2>
        <p>Nuestros violinistas interpretan piezas que van desde la tradicional marcha nupcial clásica hasta adaptaciones contemporáneas de rock acústico, pop y baladas de amor modernas. La elegancia visual y sonora del violín es perfecta para tu evento en Salones San Pedro Plus.</p>

        {renderCTA("el Show de Violín en vivo")}
      </article>
    )
  },
  "decoracion-con-globos-moderna-para-fiestas": {
    slug: "decoracion-con-globos-moderna-para-fiestas",
    title: "Decoración con Globos: Diseños orgánicos y arcos para eventos de gala",
    excerpt: "Transforma tu salón con decoraciones con globos creativas y modernas. Conoce las últimas tendencias de arcos de globos para XV años.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Decoración",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La decoración con globos ha dado un giro espectacular, convirtiéndose en una tendencia de interiorismo de alta gama. Los globos modernos se utilizan en diseños asimétricos y orgánicos mezclados con follaje y flores artificiales, ideales para mamparas de fotos en bodas y XV años.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Diseño orgánico de Globos en Salones San Pedro Plus</h2>
        <p>Ofrecemos arcos orgánicos, cascadas de globos sobre paredes y decoración de sets fotográficos integrando globos de diferentes tamaños, texturas (mate, metálicos y transparentes) y tonalidades que sigan el color de tu evento. Aportan elegancia, color y volumen a la recepción.</p>

        {renderCTA("la Decoración con Globos profesional")}
      </article>
    )
  },
  "servicio-de-reposteria-y-postres-extra-para-eventos": {
    slug: "servicio-de-reposteria-y-postres-extra-para-eventos",
    title: "Postre Extra: El dulce complemento perfecto para tu menú de 3 tiempos",
    excerpt: "Agrega repostería fina, tartas o mousse como postre extra y deleita los paladares de tus invitados con el toque final de nuestro chef.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Gastronomía",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>El postre es el último recuerdo culinario que tus invitados se llevan de la noche. Para los paladares más dulces, añadir un postre extra o un servicio de repostería fina es la mejor manera de cerrar con broche de oro la cena y complementar el banquete principal.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Nuestras opciones de repostería fina</h2>
        <p>Ofrecemos repostería de autor preparada por nuestros chefs reposteros en formatos individuales y emplatados. Nuestras especialidades recomendadas incluyen:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Tartas individuales:</strong> De frutos rojos con crema pastelera o manzana glaseada.</li>
          <li><strong>Mousses finos:</strong> Mousse de chocolate de metate y avellanas o mousse de maracuyá refrescante.</li>
          <li><strong>Cheesecakes y Brownies:</strong> Cheesecakes de New York con salsa de frambuesa y brownies de chocolate fudge.</li>
        </ul>

        {renderCTA("la opción de Postres Extra para tu banquete")}
      </article>
    )
  },
  "carrito-de-shots-para-animacion-de-fiestas": {
    slug: "carrito-de-shots-para-animacion-de-fiestas",
    title: "Carrito de Shots: Animación y sabor para encender la pista de baile",
    excerpt: "Un divertido carrito móvil que reparte shots personalizados a tus invitados en plena fiesta. Conoce esta tendencia de animación de bodas.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Show",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>El Carrito de Shots es una de las dinámicas de animación más solicitadas en la actualidad. Durante el baile, un carrito temático e iluminado ingresa a la pista repartiendo caballitos de shots coloridos y con combinaciones deliciosas (con y sin alcohol) que animan la fiesta.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Sabor y Diversión en Movimiento</h2>
        <p>El servicio cuenta con un barman y animadores que interactúan con los invitados. Los shots se preparan con jarabes cítricos, licores frutales, tequila y mezcal, decorados con escarchados dulces y salados. Es un complemento dinámico que alegra la recepción y saca risas a todos.</p>

        {renderCTA("nuestro Carrito de Shots para animación")}
      </article>
    )
  },
  "renta-de-salones-con-limosina-incluida": {
    slug: "renta-de-salones-con-limosina-incluida",
    title: "Renta de Limusinas: Una llegada espectacular para tus XV años",
    excerpt: "Modelos Hummer H2, Lincoln y Chrysler 300 con pista iluminada y pantallas. Conoce nuestro paquete premium con traslado de 4 horas incluido.",
    date: "28 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Servicios Plus",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>La llegada al salón es el primer momento de gran impacto de tus XV años o tu boda. Hacer un recorrido por la ciudad y descender de una espectacular limusina Hummer o Lincoln es una experiencia de celebridad que recordaras para siempre y que iniciará tu evento con la máxima elegancia.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Modelos Exclusivos y Confort Premium</h2>
        <p>Salones San Pedro Plus ofrece paquetes que integran el salón con el transporte de gala. Contamos con una flotilla premium que incluye limusinas Cadillac Escalade, Hummer H2 y H3, Lincoln MKZ y Chrysler 300. Todas las unidades cuentan con interiores de piel, quemacocos, pista de baile iluminada con LED, pantallas, sonido envolvente y bebidas de cortesía.</p>

        <h3 className="font-display-lg text-xl text-on-surface font-semibold mt-6">Detalles del Servicio de Limusina:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>4 horas de servicio continuo con chofer calificado.</li>
          <li>Capacidad para 10 personas (para ir con tus damas o padrinos).</li>
          <li>Refrescos y aguas de cortesía en el bar integrado de la limusina.</li>
          <li>Arreglos florales o listón decorativo en el exterior del auto.</li>
        </ul>

        {renderCTA("el paquete con Limusina Premium incluida")}
      </article>
    )
  },
  "renta-de-auto-clasico-para-bodas": {
    slug: "renta-de-auto-clasico-para-bodas",
    title: "Auto Clásico Mercedes-Benz 1930: La entrada elegante para novios",
    excerpt: "Elegante auto de época Mercedes-Benz clásico con chofer y arreglos florales incluidos. La mejor opción de transporte nupcial con estilo retro.",
    date: "28 de Mayo, 2026",
    readTime: "3 min de lectura",
    category: "Servicios Plus",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    content: (
      <article className="space-y-6 font-body-md text-secondary">
        <p>Para las bodas que buscan un estilo clásico, romántico e inolvidable, el traslado de los novios en un automóvil de época de los años 1930 es la opción idónea. Añade un glamour nostálgico que luce de ensueño en la sesión de fotografía nupcial.</p>
        
        <h2 className="font-display-lg text-2xl text-on-surface font-bold mt-8">Un Mercedes-Benz Clásico de los años 30 a tu servicio</h2>
        <p>Ofrecemos en renta un elegante auto clásico Mercedes-Benz en color marfil y negro, perfectamente restaurado. Cuenta con interiores de lujo, capacidad para 2 personas (ideal para el traslado exclusivo de la novia y su padre, y posteriormente para los recién casados) y chofer formalmente uniformado.</p>

        <h3 className="font-display-lg text-xl text-on-surface font-semibold mt-6">¿Qué incluye el servicio de Auto Clásico?</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>3 horas de servicio de traslado para la ceremonia y el salón.</li>
          <li>Chofer uniformado a cargo de la ruta.</li>
          <li>Arreglos de flores naturales en cofre y cajuela del auto clásico.</li>
          <li>Bebidas refrescantes de cortesía para el novio y la novia.</li>
        </ul>

        {renderCTA("el servicio de Auto Clásico Mercedes-Benz")}
      </article>
    )
  }
};

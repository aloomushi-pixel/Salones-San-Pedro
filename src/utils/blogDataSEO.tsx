import React from 'react';
import { BlogPost, BlogPostDetail } from './blogData';
import Link from 'next/link';
import TrackedLink from '../components/TrackedLink';

const CTA = () => (
  <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-xl my-8 shadow-sm space-y-4">
    <h2 className="font-display-lg text-xl font-bold text-on-surface">
      ¿Cuántos invitados tendrá tu evento en Gustavo A. Madero, CDMX?
    </h2>
    <p className="text-secondary text-sm">
      Toca tu número aproximado de invitados para abrir el simulador oficial con el precio precargado al instante:
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <TrackedLink
        eventType="cotizar_click"
        source="blog_cta_chip_50"
        href="/?guests=50#precotizador-hero"
        className="px-3 py-2 rounded-xl bg-surface-container-lowest border border-primary/40 hover:border-primary text-center transition-colors shadow-xs"
      >
        <span className="block text-xs font-extrabold text-primary">50 Personas</span>
        <span className="block text-[11px] font-semibold text-on-surface">Desde $26,500</span>
      </TrackedLink>
      <TrackedLink
        eventType="cotizar_click"
        source="blog_cta_chip_80"
        href="/?guests=80#precotizador-hero"
        className="px-3 py-2 rounded-xl bg-surface-container-lowest border border-primary/40 hover:border-primary text-center transition-colors shadow-xs"
      >
        <span className="block text-xs font-extrabold text-primary">80 Personas</span>
        <span className="block text-[11px] font-semibold text-on-surface">Desde $42,400</span>
      </TrackedLink>
      <TrackedLink
        eventType="cotizar_click"
        source="blog_cta_chip_100"
        href="/?guests=100&pkg=Plus#precotizador-hero"
        className="px-3 py-2 rounded-xl bg-primary/15 border-2 border-primary text-center transition-colors shadow-xs"
      >
        <span className="block text-xs font-extrabold text-primary">100 Personas ⭐</span>
        <span className="block text-[11px] font-semibold text-on-surface">$53,000 – $71,000</span>
      </TrackedLink>
      <TrackedLink
        eventType="cotizar_click"
        source="blog_cta_chip_150"
        href="/?guests=150&pkg=Plus#precotizador-hero"
        className="px-3 py-2 rounded-xl bg-surface-container-lowest border border-primary/40 hover:border-primary text-center transition-colors shadow-xs"
      >
        <span className="block text-xs font-extrabold text-primary">150 Personas</span>
        <span className="block text-[11px] font-semibold text-on-surface">$79,500 – $106,500</span>
      </TrackedLink>
    </div>
    <div className="flex flex-wrap gap-3 pt-1">
      <TrackedLink
        eventType="cotizar_click"
        source="blog_inline_cta_precotizador"
        href="/#precotizador-hero"
        className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-md text-xs uppercase tracking-wider"
      >
        Personalizar mi Cotización en Línea →
      </TrackedLink>
      <TrackedLink
        eventType="whatsapp_click"
        source="blog_inline_cta_whatsapp"
        href="https://wa.me/526633670431?text=%C2%A1Hola%20Salones%20San%20Pedro!%20Le%C3%AD%20su%20gu%C3%ADa%20de%20precios%202026%20en%20el%20blog%20y%20me%20interesa%20cotizar%20mi%20evento."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-md text-xs uppercase tracking-wider"
      >
        Recibir Cotización por WhatsApp
      </TrackedLink>
    </div>
  </div>
);

export const SEO_BLOG_POSTS: BlogPost[] = [
  {
    slug: "cuanto-cuesta-un-salon-de-fiestas-en-gustavo-a-madero-cdmx-precios-2026",
    title: "¿Cuánto Cuesta un Salón de Fiestas en GAM CDMX? Precios 2026 Reales",
    excerpt: "Guía real de precios 2026 de salones de fiestas en Gustavo A. Madero (CDMX) para XV años, bodas y graduaciones. Paquetes todo incluido desde $530 p/p ($53,000 MXN para 100 invitados).",
    date: "2 de Noviembre, 2026",
    readTime: "5 min de lectura",
    category: "Precios y Paquetes",
    imageUrl: "/galeria/diamante/diamante_1.jpg"
  },
  {
    slug: "salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas",
    title: "Salones de Fiestas Pequeños en Gustavo A. Madero CDMX: Eventos de 50 a 80 Personas Todo Incluido",
    excerpt: "¿Buscas un salón pequeño de eventos sociales en Gustavo A. Madero o norte de CDMX? Conoce el Paquete Premier desde 50 hasta 80 invitados ($530 p/p) con banquete, DJ, pista LED y descorche libre.",
    date: "2 de Noviembre, 2026",
    readTime: "4 min de lectura",
    category: "Pistas y Espacios",
    imageUrl: "/galeria/platino/platino_4.jpg"
  },
  {
    slug: "fotos-y-recorrido-salones-san-pedro-plus-diamante-y-platino-norte-84-gam",
    title: "Fotos de Salones San Pedro Plus (Salón Diamante y Platino) en Calle Norte 84, Gustavo A. Madero",
    excerpt: "Galería fotográfica oficial y recorrido por Salón Diamante y Salón Platino de Salones San Pedro Plus en Calle Norte 84 No. 6507, Col. San Pedro el Chico, Gustavo A. Madero, CDMX.",
    date: "2 de Noviembre, 2026",
    readTime: "4 min de lectura",
    category: "Pistas y Espacios",
    imageUrl: "/galeria/diamante/diamante_3.jpg"
  },
  {
    slug: "como-elegir-el-menu-perfecto-para-tu-evento-guia-paso-a-paso",
    title: "Cómo Elegir el Menú Perfecto para tu Boda o XV Años en CDMX: Guía y Degustación (3 y 4 Tiempos)",
    excerpt: "Guía paso a paso para elegir el menú de tu boda, XV años o graduación en CDMX: cálculo de porciones, menú formal de 3 y 4 tiempos con arrachera, tornafiesta y degustación previa desde $530 p/p.",
    date: "30 de Junio, 2026",
    readTime: "5 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/banquet_table_setup_1782782321503.png"
  },
  {
    slug: "tendencias-en-banquetes-para-eventos-en-2026-lo-que-no-puede-faltar",
    title: "Tendencias en Banquetes para Bodas y XV Años en CDMX 2026: Menús de 3 y 4 Tiempos (Desde $530 p/p)",
    excerpt: "Conoce los platillos gourmet, estaciones interactivas y menús de 3 y 4 tiempos con tornafiesta incluida que dominan las bodas, XV años y eventos corporativos en CDMX este 2026.",
    date: "30 de Junio, 2026",
    readTime: "4 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/innovative_catering_dishes_1782782329531.png"
  },
  {
    slug: "menu-de-3-tiempos-vs-buffet-cual-es-la-mejor-opcion-para-tu-boda-o-graduacion",
    title: "Menú de 3 y 4 Tiempos vs. Buffet para Bodas y XV Años en CDMX: Precios 2026 (Desde $530 p/p)",
    excerpt: "Comparamos menú formal de 3 y 4 tiempos vs buffet para bodas, XV años y graduaciones en CDMX. Conoce costos reales por persona ($530 a $1,010 MXN) con tornafiesta y descorche libre.",
    date: "30 de Junio, 2026",
    readTime: "6 min de lectura",
    category: "Gastronomía",
    imageUrl: "/blog/buffet_vs_plated_1782782338754.png"
  },
  {
    slug: "tipos-de-pistas-de-baile-para-eventos-cual-va-mejor-con-tu-estilo",
    title: "Pistas de Baile LED Iluminadas y de Cristal para Bodas y XV Años en CDMX (Incluida en Paquete)",
    excerpt: "Descubre cómo nuestra pista de baile LED de cristal iluminada, DJ, luces robóticas y show de Robot LED están incluidos en tu paquete de evento en Gustavo A. Madero, CDMX desde $530 p/p.",
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
  "cuanto-cuesta-un-salon-de-fiestas-en-gustavo-a-madero-cdmx-precios-2026": {
    slug: "cuanto-cuesta-un-salon-de-fiestas-en-gustavo-a-madero-cdmx-precios-2026",
    title: "¿Cuánto Cuesta un Salón de Fiestas en GAM CDMX? Precios 2026 Reales",
    excerpt: "Guía real de precios 2026 de salones de fiestas en Gustavo A. Madero (CDMX) para XV años, bodas y graduaciones. Paquetes todo incluido desde $530 p/p ($53,000 MXN para 100 invitados).",
    date: "2 de Noviembre, 2026",
    readTime: "5 min de lectura",
    category: "Precios y Paquetes",
    imageUrl: "/galeria/diamante/diamante_1.jpg",
    content: (
      <div className="space-y-6">
        <p>Si estás buscando <strong>salones de fiestas en Gustavo A. Madero económicos y elegantes</strong> o te preguntas <strong>cuánto cuesta un salón de fiestas para 50, 100 o 200 personas en CDMX</strong>, en esta guía transparente te compartimos las tarifas oficiales 2026 de <strong>Salones San Pedro Plus</strong> (ubicados en Calle Norte 84 No. 6507, Col. San Pedro el Chico, Alcaldía Gustavo A. Madero).</p>

        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">1. Tabla Interactiva de Precios 2026 (50, 80, 100, 150 y 200 Invitados)</h2>
        <p>Toca cualquier fila de la tabla para abrir nuestro simulador con ese número de invitados y paquete precargado:</p>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-left border-collapse border border-outline-variant/40 text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container-high text-on-surface">
                <th className="p-3 border border-outline-variant/40 font-bold">Invitados</th>
                <th className="p-3 border border-outline-variant/40 font-bold">Premier ($530 p/p)</th>
                <th className="p-3 border border-outline-variant/40 font-bold text-primary">Plus ⭐ ($710 p/p)</th>
                <th className="p-3 border border-outline-variant/40 font-bold">All Inclusive ($1,010 p/p)</th>
                <th className="p-3 border border-outline-variant/40 font-bold text-center">Cotizar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-outline-variant/40 font-bold">50 personas</td>
                <td className="p-3 border border-outline-variant/40 font-semibold">$26,500 MXN</td>
                <td className="p-3 border border-outline-variant/40 text-secondary">Personalizable con Extras</td>
                <td className="p-3 border border-outline-variant/40 text-secondary">Personalizable con Extras</td>
                <td className="p-3 border border-outline-variant/40 text-center">
                  <TrackedLink eventType="cotizar_click" source="blog_table_50" href="/?guests=50#precotizador-hero" className="inline-block px-3 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs">Simular 50 →</TrackedLink>
                </td>
              </tr>
              <tr className="bg-surface-container-low/50">
                <td className="p-3 border border-outline-variant/40 font-bold">80 personas</td>
                <td className="p-3 border border-outline-variant/40 font-semibold">$42,400 MXN</td>
                <td className="p-3 border border-outline-variant/40 text-secondary">Premier + Combo VIP ($53,900)</td>
                <td className="p-3 border border-outline-variant/40 text-secondary">Personalizable con Extras</td>
                <td className="p-3 border border-outline-variant/40 text-center">
                  <TrackedLink eventType="cotizar_click" source="blog_table_80" href="/?guests=80#precotizador-hero" className="inline-block px-3 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs">Simular 80 →</TrackedLink>
                </td>
              </tr>
              <tr className="bg-primary/5">
                <td className="p-3 border border-outline-variant/40 font-bold text-primary">100 personas ⭐</td>
                <td className="p-3 border border-outline-variant/40 font-semibold">$53,000 MXN</td>
                <td className="p-3 border border-outline-variant/40 font-bold text-primary">$71,000 MXN</td>
                <td className="p-3 border border-outline-variant/40 font-semibold">$101,000 MXN</td>
                <td className="p-3 border border-outline-variant/40 text-center">
                  <TrackedLink eventType="cotizar_click" source="blog_table_100" href="/?guests=100&pkg=Plus#precotizador-hero" className="inline-block px-3 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs">Simular 100 →</TrackedLink>
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-outline-variant/40 font-bold">150 personas</td>
                <td className="p-3 border border-outline-variant/40 font-semibold">$79,500 MXN</td>
                <td className="p-3 border border-outline-variant/40 font-bold text-primary">$106,500 MXN</td>
                <td className="p-3 border border-outline-variant/40 font-semibold">$151,500 MXN</td>
                <td className="p-3 border border-outline-variant/40 text-center">
                  <TrackedLink eventType="cotizar_click" source="blog_table_150" href="/?guests=150&pkg=Plus#precotizador-hero" className="inline-block px-3 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs">Simular 150 →</TrackedLink>
                </td>
              </tr>
              <tr className="bg-surface-container-low/50">
                <td className="p-3 border border-outline-variant/40 font-bold">200 personas</td>
                <td className="p-3 border border-outline-variant/40 font-semibold">$106,000 MXN</td>
                <td className="p-3 border border-outline-variant/40 font-bold text-primary">$142,000 MXN</td>
                <td className="p-3 border border-outline-variant/40 font-semibold">$202,000 MXN</td>
                <td className="p-3 border border-outline-variant/40 text-center">
                  <TrackedLink eventType="cotizar_click" source="blog_table_200" href="/?guests=200&pkg=Plus#precotizador-hero" className="inline-block px-3 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs">Simular 200 →</TrackedLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>En <strong><Link href="/#paquetes" className="text-primary hover:underline">Salones San Pedro Plus</Link></strong> todos los paquetes incluyen descorche libre sin cargo adicional:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Paquete Premier ($530 MXN por persona):</strong> Disponible desde 50 invitados. Incluye 6.5 horas totales, menú formal a 3 tiempos + tornafiesta (chilaquiles), barra libre de refrescos/mezcladores, DJ con pista LED y montaje imperial con mesa de cristal.</li>
          <li><strong>Paquete Plus ($710 MXN por persona — ⭐ El más elegido en XV años y Bodas):</strong> A partir de 100 invitados. Suma 7 horas de servicio, menú a 4 tiempos, show de Robot LED gigante, mesa de dulces, cabina fotográfica, letras gigantes, carrito de shots y pre-fiesta de cortesía para 30 personas.</li>
          <li><strong>Paquete All Inclusive ($1,010 MXN por persona):</strong> A partir de 100 invitados. Incluye todo lo del Paquete Plus más 1 hora de Mariachi en vivo, traslado en Limusina de lujo, Robot Iron Man, foto/video con álbum, vino espumoso, 1 botella de licor por mesa y Cabina 360°.</li>
        </ul>

        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">2. ¿Cómo ahorrar al cotizar tu salón en Gustavo A. Madero?</h2>
        <p>Celebrar tu evento en <strong>Viernes o Domingo</strong> te otorga tarifa preferencial y bonos de cortesía frente al sábado de alta demanda. Además, puedes personalizar cualquier paquete con nuestro <strong>Combo Fiesta VIP (Limusina + Carrito de Shots + Letras Gigantes por $11,500 MXN)</strong> directamente en nuestro <strong><Link href="/#precotizador-hero" className="text-primary hover:underline">Simulador en Línea</Link></strong>.</p>

        <CTA />
      </div>
    )
  },
  "salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas": {
    slug: "salones-de-fiestas-pequenos-en-cdmx-gustavo-a-madero-50-a-80-personas",
    title: "Salones de Fiestas Pequeños en Gustavo A. Madero CDMX: Eventos de 50 a 80 Personas Todo Incluido",
    excerpt: "¿Buscas un salón pequeño de eventos sociales en Gustavo A. Madero o norte de CDMX? Conoce el Paquete Premier desde 50 hasta 80 invitados ($530 p/p) con banquete, DJ, pista LED y descorche libre.",
    date: "2 de Noviembre, 2026",
    readTime: "4 min de lectura",
    category: "Pistas y Espacios",
    imageUrl: "/galeria/platino/platino_4.jpg",
    content: (
      <div className="space-y-6">
        <p>Encontrar <strong>salones de fiestas pequeños en CDMX (50 a 80 personas)</strong> que ofrezcan la misma elegancia, pista iluminada y banquete formal que una gran gala suele ser difícil, ya que muchos recintos exigen mínimos de 150 o 200 personas. En <strong>Salones San Pedro Plus (Gustavo A. Madero)</strong> diseñamos configuraciones íntimas desde <strong>50 invitados</strong>.</p>

        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">Paquete Todo Incluido desde 50 y 80 Personas ($530 MXN p/p)</h2>
        <p>Nuestro <strong><Link href="/#paquetes" className="text-primary hover:underline">Paquete Premier</Link></strong> está disponible a partir de 50 personas en nuestros salones climatizados y con distribución modular para que tu evento luzca cálido, lleno y espectacular. Toca cualquier opción para simular tu evento al instante:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <TrackedLink
            eventType="cotizar_click"
            source="blog_small_venues_50"
            href="/?guests=50&pkg=Premier#precotizador-hero"
            className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:border-primary transition-all shadow-xs"
          >
            <div>
              <strong className="text-on-surface block text-sm">50 invitados (Íntimo)</strong>
              <span className="text-xs text-secondary">Desde <strong className="text-primary">$26,500 MXN</strong> todo incluido</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs shrink-0">Simular 50 →</span>
          </TrackedLink>
          <TrackedLink
            eventType="cotizar_click"
            source="blog_small_venues_70"
            href="/?guests=70&pkg=Premier#precotizador-hero"
            className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:border-primary transition-all shadow-xs"
          >
            <div>
              <strong className="text-on-surface block text-sm">70 invitados (Intermedio)</strong>
              <span className="text-xs text-secondary">Desde <strong className="text-primary">$37,100 MXN</strong> todo incluido</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs shrink-0">Simular 70 →</span>
          </TrackedLink>
          <TrackedLink
            eventType="cotizar_click"
            source="blog_small_venues_80"
            href="/?guests=80&pkg=Premier#precotizador-hero"
            className="flex items-center justify-between p-3.5 rounded-xl bg-primary/10 border-2 border-primary hover:bg-primary/15 transition-all shadow-xs"
          >
            <div>
              <strong className="text-on-surface block text-sm">80 invitados ⭐ (Más Solicitado)</strong>
              <span className="text-xs text-secondary">Desde <strong className="text-primary">$42,400 MXN</strong> todo incluido</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs shrink-0">Simular 80 →</span>
          </TrackedLink>
          <TrackedLink
            eventType="cotizar_click"
            source="blog_small_venues_100"
            href="/?guests=100&pkg=Plus#precotizador-hero"
            className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 hover:border-primary transition-all shadow-xs"
          >
            <div>
              <strong className="text-on-surface block text-sm">100 invitados (Desbloquea Plus)</strong>
              <span className="text-xs text-secondary"><strong className="text-primary">$53,000</strong> Premier • <strong className="text-primary">$71,000</strong> Plus</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs shrink-0">Simular 100 →</span>
          </TrackedLink>
        </div>
        <p>Perfecto para bautizos, bodas civiles o íntimas, aniversarios, cumpleaños y reuniones empresariales cerca de Aragón, Lindavista, Eduardo Molina y Circuito Interior.</p>

        <CTA />
      </div>
    )
  },
  "fotos-y-recorrido-salones-san-pedro-plus-diamante-y-platino-norte-84-gam": {
    slug: "fotos-y-recorrido-salones-san-pedro-plus-diamante-y-platino-norte-84-gam",
    title: "Fotos de Salones San Pedro Plus (Salón Diamante y Platino) en Calle Norte 84, Gustavo A. Madero",
    excerpt: "Galería fotográfica oficial y recorrido por Salón Diamante y Salón Platino de Salones San Pedro Plus en Calle Norte 84 No. 6507, Col. San Pedro el Chico, Gustavo A. Madero, CDMX.",
    date: "2 de Noviembre, 2026",
    readTime: "4 min de lectura",
    category: "Pistas y Espacios",
    imageUrl: "/galeria/diamante/diamante_3.jpg",
    content: (
      <div className="space-y-6">
        <p>Conoce a detalle las instalaciones de <strong>Salones San Pedro Plus</strong> en <strong>Calle Norte 84 No. 6507, Col. San Pedro el Chico, CP 07800, Alcaldía Gustavo A. Madero, CDMX</strong>. Contamos con dos salones independientes de gala: <strong>Salón Diamante</strong> y <strong>Salón Platino</strong>.</p>

        <h2 className="font-display-lg text-2xl font-bold text-on-surface mt-8 mb-4">1. Salón Diamante y Salón Platino: Qué incluyen nuestras instalaciones</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Montaje Imperial con Mesas de Cristal Iluminadas:</strong> Sillas Tiffany y Versalles vestidas al color de tu evento y centros de mesa florales altos.</li>
          <li><strong>Pista de Baile LED e Iluminación Robótica:</strong> Escenario con cabina de DJ profesional, pantallas y efectos especiales seguros en interiores.</li>
          <li><strong>Ubicación y Accesibilidad en Norte 84, GAM:</strong> A solo 5 minutos de Av. Eduardo Molina, Calz. San Juan de Aragón y Circuito Interior. Explora la <strong><Link href="/#galeria" className="text-primary hover:underline">Galería Fotográfica Completa en Pantalla Completa</Link></strong> o agenda tu recorrido presencial sin compromiso.</li>
        </ul>

        <CTA />
      </div>
    )
  },
  "como-elegir-el-menu-perfecto-para-tu-evento-guia-paso-a-paso": {
    slug: "como-elegir-el-menu-perfecto-para-tu-evento-guia-paso-a-paso",
    title: "Cómo Elegir el Menú Perfecto para tu Boda o XV Años en CDMX: Guía y Degustación (3 y 4 Tiempos)",
    excerpt: "Guía paso a paso para elegir el menú de tu boda, XV años o graduación en CDMX: cálculo de porciones, menú formal de 3 y 4 tiempos con arrachera, tornafiesta y degustación previa desde $530 p/p.",
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
    title: "Tendencias en Banquetes para Bodas y XV Años en CDMX 2026: Menús de 3 y 4 Tiempos (Desde $530 p/p)",
    excerpt: "Conoce los platillos gourmet, estaciones interactivas y menús de 3 y 4 tiempos con tornafiesta incluida que dominan las bodas, XV años y eventos corporativos en CDMX este 2026.",
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
    title: "Menú de 3 y 4 Tiempos vs. Buffet para Bodas y XV Años en CDMX: Precios 2026 (Desde $530 p/p)",
    excerpt: "Comparamos menú formal de 3 y 4 tiempos vs buffet para bodas, XV años y graduaciones en CDMX. Conoce costos reales por persona ($530 a $1,010 MXN) con tornafiesta y descorche libre.",
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
    title: "Pistas de Baile LED Iluminadas y de Cristal para Bodas y XV Años en CDMX (Incluida en Paquete)",
    excerpt: "Descubre cómo nuestra pista de baile LED de cristal iluminada, DJ, luces robóticas y show de Robot LED están incluidos en tu paquete de evento en Gustavo A. Madero, CDMX desde $530 p/p.",
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

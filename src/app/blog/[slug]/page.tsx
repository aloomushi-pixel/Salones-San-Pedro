import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";

interface BlogPostDetail {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  content: React.ReactNode;
}

const BLOG_POSTS_DETAILS: Record<string, BlogPostDetail> = {
  "como-elegir-el-menu-de-bodas-perfecto": {
    slug: "como-elegir-el-menu-de-bodas-perfecto",
    title: "Cómo elegir el menú de bodas perfecto: 5 consejos gourmet",
    excerpt: "Descubre los secretos de nuestro chef ejecutivo para crear una experiencia gastronómica inolvidable que deleite a todos tus invitados con toques poblanos contemporáneos.",
    date: "24 de Mayo, 2026",
    readTime: "5 min de lectura",
    category: "Gastronomía",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3HpPPLtGqhlEVNzWf0ykU5N-7oSNb7fo5p6x6A9VEod_dSxNW_7zLG37nrJBlgDn8YcivcQM8Gnu7lCPAGxyDQWhV0gWJ6vtgEdX05Vupc19PBgY2PQJt0RcLh4wCl1VlR3SQNNJfnU0EQdk13I1Pj0izwl1HrZ97cdaDFexgZH45-akW9U77bGkZYSkTuJyyzxt8nCtkEznqpdRPOG1mM_BEn1a8TAZb6lIkwvemaXgbuXXYuyfbDFMO5FnltTf3XDuPHu0LImCJ",
    content: (
      <div className="space-y-6">
        <p>
          La gastronomía es uno de los pilares más recordados en cualquier boda. No se trata simplemente de alimentar a los invitados, sino de ofrecer una experiencia sensorial que refleje la personalidad de la pareja y la riqueza cultural del entorno. En <strong>Salones San Pedro</strong>, entendemos que cada platillo cuenta una historia.
        </p>
        <p>
          A continuación, nuestro chef ejecutivo comparte 5 consejos gourmet para diseñar el menú perfecto para tu boda:
        </p>
        
        <h3 className="font-display-lg text-2xl text-on-surface pt-4">1. Conoce el perfil de tus invitados</h3>
        <p>
          Antes de decidir los platillos, es fundamental contemplar si entre tus invitados hay personas con restricciones alimenticias (vegetarianos, veganos, celíacos o alérgicos). Contar con opciones alternativas preparadas con el mismo nivel de sofisticación asegura que todos se sientan incluidos y atendidos.
        </p>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">2. Estructura un menú con ritmo y balance</h3>
        <p>
          Un menú clásico de alta escuela suele estructurarse en 4 tiempos: una entrada ligera (fría o caliente), una crema o sopa fina, el plato fuerte (generalmente una proteína premium de res o ave) y el postre. La clave está en balancear los sabores: si el plato fuerte es intenso y especiado, las entradas deben ser más sutiles y frescas.
        </p>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">3. La importancia del maridaje</h3>
        <p>
          El vino y la coctelería de autor deben complementar perfectamente cada bocado. Un maridaje adecuado potencia los sabores de la comida. Por ejemplo, un vino tinto de barrica resalta la jugosidad de un filete de res en salsa de tres chiles, mientras que un blanco fresco o rosado acompaña idealmente las notas cremosas de una entrada de mariscos.
        </p>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">4. Incorpora la herencia culinaria con técnica moderna</h3>
        <p>
          Puebla es famosa por su gastronomía histórica. Fieles a esta tradición, en nuestro salón nos encanta sorprender a los novios con reinterpretaciones de autor. ¿Qué tal un chile en nogada deconstruido con granada cristalizada, o un solomillo bañado en mole boutique aterciopelado? Este toque local le dará un carácter exclusivo e identitario a tu banquete.
        </p>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">5. Un cierre espectacular</h3>
        <p>
          El postre es el último recuerdo del banquete. Te sugerimos optar por una combinación de sabores clásicos con texturas innovadoras. Además del pastel tradicional, las mesas de dulces boutique y las estaciones de postres vivos (como helados artesanales flameados al momento) añaden un factor de entretenimiento que fascinará a todos.
        </p>
      </div>
    )
  },
  "la-importancia-de-la-iluminacion-en-eventos": {
    slug: "la-importancia-de-la-iluminacion-en-eventos",
    title: "La importancia de la iluminación en eventos de gala",
    excerpt: "La luz no solo ilumina, crea emociones. Te explicamos cómo diseñar la atmósfera perfecta con tecnología robótica y efectos dinámicos para tu gran día.",
    date: "18 de Mayo, 2026",
    readTime: "4 min de lectura",
    category: "Planeación",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSf4kmdGeSyJYwNSG3lSoHza4UpObgjsHFhaRY9JfMHzKaxNhDNogK45EcM3of_c8GScAsj4RGvPfrR9z6PapBM43ualufmxSwjgx7GzwA9H7J6QbyQZnSqbPubP8EfRKRUUHhXzvOcdNabRhRA4_SKUcJTQbUD56ZVmYvPTRR-KCHjh0j7vCbnAx2W53xcTCpBFPG95aGQaidxKUZdjhe6XOJYAT7gD-2BVkbBFwAd5IRY1Mr9Z76RHcQUU0EeNHv1u_Ocu70LEsH",
    content: (
      <div className="space-y-6">
        <p>
          Cuando planeamos un evento de gala, solemos enfocarnos en las flores, la mantelería y el menú. Sin embargo, hay un elemento invisible que tiene el poder de transformar por completo cómo se ve y se siente todo el lugar: <strong>la iluminación</strong>.
        </p>
        <p>
          Un mal diseño de iluminación puede arruinar una decoración costosa, mientras que un diseño lumínico profesional resalta cada detalle arquitectónico y genera una atmósfera de lujo.
        </p>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">Iluminación Ambiental vs. Iluminación Dinámica</h3>
        <p>
          Para lograr el equilibrio perfecto, es necesario combinar dos tipos de luz:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Iluminación Ambiental (o arquitectónica):</strong> Es la luz estática que tiñe las columnas, techos y paredes del salón. En Salones San Pedro utilizamos tonos cálidos y dorados para acentuar los detalles sofisticados del espacio, creando una sensación de amplitud y elegancia acogedora.</li>
          <li><strong>Iluminación Dinámica (robótica):</strong> Es la que se utiliza durante los momentos de fiesta. Cabezas móviles y proyectores LED siguen el ritmo de la música, cambiando de color y patrones para incentivar a los invitados a llenar la pista de baile.</li>
        </ul>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">Los momentos clave del evento</h3>
        <p>
          La luz debe adaptarse a las distintas fases del evento. Durante la recepción y el banquete, la iluminación debe ser tenue y elegante, permitiendo que la gente converse cómodamente y resalten las velas de las mesas. En cambio, para el vals de los novios, un reflector de seguimiento o una luz cenital suave los convertirá en el foco absoluto de atención, logrando fotos y videos verdaderamente cinematográficos.
        </p>
        <p>
          En tu próxima planeación, no subestimes el poder de la luz. Invertir en una curaduría sonora y lumínica de alta calidad marcará la diferencia entre un evento bonito y una experiencia extraordinaria.
        </p>
      </div>
    )
  },
  "tendencias-decoracion-floral-boutique": {
    slug: "tendencias-decoracion-floral-boutique",
    title: "Tendencias en decoración floral boutique para este año",
    excerpt: "Desde arreglos suspendidos hasta paletas de colores orgánicos y follajes exóticos. Inspírate con las últimas corrientes de diseño floral para salones exclusivos.",
    date: "10 de Mayo, 2026",
    readTime: "6 min de lectura",
    category: "Decoración",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHeTnIJ33jk9qkLiLqVUxENCpoXpzhoM1V-bM2WDYn5Q9seks4TwfGfI7JI0oEU8SgaNsow_gR3xn9ACGKpss4EZojFM0cycs09VT9eiCx0vu3p9F6-tsgkoykFHFtSneTyiZ_tLns4NRwKUN2T3g7K5mThA_8qcpnkoDvWjJgppGyFLkgnR3ZmDy-9ptle7WuKqhnH8eOTmGkWZH5uFLv6lpwEgt68uvy-_VG_IBdqNNk31O86UKLfO-ejpe_clBpT4SR5tT8wv2w",
    content: (
      <div className="space-y-6">
        <p>
          Las flores tienen el poder único de dar vida, aroma y romanticismo a cualquier salón de eventos. El diseño floral ya no se limita a colocar centros de mesa tradicionales; hoy en día se trata de crear instalaciones artísticas tridimensionales.
        </p>
        <p>
          En el segmento boutique de alta gama, las tendencias están evolucionando hacia composiciones más orgánicas y sofisticadas. Aquí te presentamos las corrientes que están dominando los eventos más exclusivos de Puebla:
        </p>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">1. Estructuras florales suspendidas</h3>
        <p>
          Aprovechando los techos altos de recintos prestigiosos, los diseñadores florales crean nubes de follaje y flores que flotan sobre las mesas de los invitados o la pista de baile. Esta técnica aporta un factor 'wow' instantáneo y crea una atmósfera de bosque encantado o jardín flotante.
        </p>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">2. Paletas de colores orgánicas y monocromía</h3>
        <p>
          Atrás quedaron las combinaciones saturadas. Ahora domina la sofisticación de las paletas orgánicas: colores arena, melocotón suave, terracota, blanco puro y acentos en verde olivo. Las propuestas monocromáticas (por ejemplo, utilizar únicamente rosas blancas de distintas variedades y tamaños) proyectan un lujo minimalista de gran impacto visual.
        </p>

        <h3 className="font-display-lg text-2xl text-on-surface pt-4">3. Integración de texturas y materiales no tradicionales</h3>
        <p>
          Las flores ahora se mezclan con ramas secas texturizadas, musgo natural, frutos de temporada e incluso velas flotantes en tubos de vidrio soplado. Las bases de los arreglos se seleccionan con cuidado: herrerías esbeltas en acabados dorados mate, cerámica artesanal o piedra pulida que complementan la propuesta floral de forma armónica.
        </p>
        <p>
          Al planear las flores de tu boda en Salones San Pedro, te recomendamos asesorarte con nuestros coordinadores para integrar las flores con el diseño de mantelería e iluminación, garantizando que todo el salón hable el mismo lenguaje de exclusividad.
        </p>
      </div>
    )
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS_DETAILS[slug];

  if (!post) {
    notFound();
  }

  // Generate lists of other posts for the sidebar/recommendations
  const otherPosts = Object.values(BLOG_POSTS_DETAILS).filter((p) => p.slug !== slug);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-surface py-12 md:py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm uppercase tracking-wider mb-8">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al Blog
          </Link>

          {/* Post Header */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 text-xs font-semibold text-primary uppercase tracking-widest">
              <span>{post.category}</span>
              <span>•</span>
              <span className="text-secondary/70 normal-case">{post.date}</span>
              <span>•</span>
              <span className="text-secondary/70 normal-case">{post.readTime}</span>
            </div>
            <h1 className="font-display-lg text-3xl md:text-4xl lg:text-5xl text-on-surface leading-tight">
              {post.title}
            </h1>
            <p className="font-body-lg text-secondary text-lg leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative h-64 md:h-[480px] rounded-2xl overflow-hidden shadow-xl mb-12">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post Content & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 font-body-md text-secondary leading-relaxed text-base md:text-lg">
              {post.content}
            </div>

            {/* Sidebar / Recommended Posts */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 space-y-6 shadow-sm">
                <h4 className="font-display-lg text-lg text-on-surface font-semibold border-b border-outline-variant/30 pb-3">Otros artículos</h4>
                <div className="space-y-6">
                  {otherPosts.map((otherPost) => (
                    <div key={otherPost.slug} className="space-y-2 group">
                      <span className="text-xs text-primary font-bold uppercase tracking-wider">{otherPost.category}</span>
                      <h5 className="font-display-lg text-on-surface font-medium group-hover:text-primary transition-colors leading-snug">
                        <Link href={`/blog/${otherPost.slug}`}>
                          {otherPost.title}
                        </Link>
                      </h5>
                      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">{otherPost.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action */}
              <div className="bg-primary text-on-primary rounded-xl p-6 space-y-4 text-center shadow-lg">
                <h4 className="font-display-lg text-xl font-bold">¡Haz realidad tu gran día!</h4>
                <p className="text-sm opacity-90 leading-relaxed">
                  Aparta tu recorrido guiado por Salones San Pedro hoy mismo y recibe atención personalizada de nuestros coordinadores.
                </p>
                <Link href="/#disponibilidad" className="block w-full py-3 bg-surface text-primary rounded-lg font-label-sm text-xs font-bold shadow hover:bg-surface-variant transition-all uppercase tracking-wider">
                  Agendar Recorrido
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-8 bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <img
              alt="SALONES SAN PEDRO"
              className="h-16 w-auto cursor-pointer object-contain"
              src="/logo.svg"
            />
          </Link>
          <div className="text-center font-body-md text-secondary mt-1">
            <a href="tel:5557516268" className="hover:text-primary transition-colors flex items-center gap-2 justify-center">
              <span className="material-symbols-outlined text-primary text-lg">call</span>
              <span className="font-semibold text-on-surface dark:text-inverse-on-surface">55 5751 6268</span>
            </a>
          </div>
          <div className="flex gap-6 mt-2">
            <a aria-label="Facebook" className="text-primary hover:scale-110 transition-transform" href="https://www.facebook.com/people/San-Pedro-Plus/100015619187458/?locale=es_LA#" target="_blank" rel="noopener noreferrer">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
            </a>
            <a aria-label="Instagram" className="text-primary hover:scale-110 transition-transform" href="https://www.instagram.com/salones_sanpedroplus/?hl=es" target="_blank" rel="noopener noreferrer">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.884 8.74 24 12 24s3.667-.012 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path></svg>
            </a>
            <a aria-label="TikTok" className="text-primary hover:scale-110 transition-transform" href="https://www.tiktok.com/@salones_sanpedroplus" target="_blank" rel="noopener noreferrer">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.66 1 6.33 6.33 0 0 0-3 5.37 6.34 6.34 0 0 0 10.86 4.5 6.3 6.3 0 0 0 2.25-4.81V7.26a9.68 9.68 0 0 0 4.7-2.13 9.77 9.77 0 0 0 2.83-4.13V2h-3.46a4.84 4.84 0 0 1-3.42 4.69z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-body-md text-body-md text-secondary">
          <a className="hover:text-primary transition-colors" href="#">Aviso de Privacidad</a>
          <a className="hover:text-primary transition-colors" href="#">Términos de Servicio</a>
          <a className="hover:text-primary transition-colors" href="#">Preguntas Frecuentes</a>
        </div>
        <p className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface mt-4 text-center opacity-70">© 2026 Salones San Pedro Eventos. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

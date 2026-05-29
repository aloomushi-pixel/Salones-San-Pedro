import Link from "next/link";
import Header from "../../components/Header";
import { BLOG_POSTS } from "@/utils/blogData";
import Image from "next/image";

export default function BlogPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-surface py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-label-sm text-primary tracking-widest uppercase">Artículos &amp; Consejos</span>
            <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-on-surface">Blog San Pedro</h1>
            <p className="font-body-lg text-secondary">
              Todo lo que necesitas saber para la planeación, gastronomía y tendencias para que tu evento en CDMX y el Estado de México sea inolvidable.
            </p>
          </div>

          {/* Featured Post (First) */}
          <div className="mb-16">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-0 group">
              <div className="lg:col-span-7 relative h-72 lg:h-[450px] overflow-hidden">
                <Image
                  src={BLOG_POSTS[0].imageUrl}
                  alt={BLOG_POSTS[0].title}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute top-4 left-4 bg-primary text-on-primary font-label-sm text-xs px-3 py-1 rounded">
                  {BLOG_POSTS[0].category}
                </div>
              </div>
              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between space-y-6 bg-surface-container-lowest">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs text-secondary/70">
                    <span>{BLOG_POSTS[0].date}</span>
                    <span>•</span>
                    <span>{BLOG_POSTS[0].readTime}</span>
                  </div>
                  <h2 className="font-display-lg text-2xl md:text-3xl text-on-surface hover:text-primary transition-colors leading-tight">
                    <Link href={`/blog/${BLOG_POSTS[0].slug}`}>
                      {BLOG_POSTS[0].title}
                    </Link>
                  </h2>
                  <p className="font-body-md text-secondary text-sm md:text-base leading-relaxed">
                    {BLOG_POSTS[0].excerpt}
                  </p>
                </div>
                <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all self-start text-sm md:text-base uppercase tracking-wider">
                  Leer artículo
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Grid of Other Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(1).map((post) => (
              <div key={post.slug} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-on-primary font-label-sm text-xs px-3 py-1 rounded">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-secondary/70">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-display-lg text-xl text-on-surface group-hover:text-primary transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="font-body-md text-secondary text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all self-start text-xs uppercase tracking-wider pt-2">
                    Leer artículo
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}

            {/* CTA/Info Card */}
            <div className="bg-surface-container-low border-2 border-dashed border-outline-variant/50 rounded-2xl p-6 flex flex-col justify-between text-center items-center group">
              <div className="my-auto space-y-4">
                <span className="material-symbols-outlined text-primary text-5xl">event_available</span>
                <h3 className="font-display-lg text-xl text-on-surface">¿Planeas tu propio evento?</h3>
                <p className="font-body-md text-secondary text-sm leading-relaxed max-w-[240px] mx-auto">
                  Permítenos ayudarte a hacer realidad la boda o festejo de tus sueños.
                </p>
              </div>
              <Link href="/#disponibilidad" className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-sm text-xs shadow hover:opacity-90 transition-all uppercase tracking-wider">
                Verificar Disponibilidad
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-8 bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <Image
              alt="SALONES SAN PEDRO"
              className="h-16 w-auto cursor-pointer object-contain"
              src="/logo.svg"
              width={200}
              height={64}
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

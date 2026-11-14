import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import { BLOG_POSTS_DETAILS } from "@/utils/blogData";
import Image from "next/image";
import TrackedLink from "../../../components/TrackedLink";
import LegalModals from "../../../components/LegalModals";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS_DETAILS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_DETAILS[slug];

  if (!post) {
    return {
      title: "Artículo no encontrado | Salones San Pedro Plus CDMX",
      description: "Explora nuestra guía de bodas, XV años y eventos en Gustavo A. Madero, CDMX.",
    };
  }

  const seoTitle =
    post.title.length <= 31
      ? `${post.title} | Salones San Pedro CDMX`
      : post.title.length <= 42
      ? `${post.title} | San Pedro Plus`
      : post.title.length <= 58
      ? post.title
      : `${post.title.slice(0, 55).trim()}...`;
  const rawDescription = `Desde $530 p/p ($53,000 por 100 pers.) en GAM CDMX: ${post.excerpt}`;
  const seoDescription =
    rawDescription.length > 158
      ? `${rawDescription.slice(0, 155).trim()}...`
      : rawDescription;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `https://sanpedro.aionia.com.mx/blog/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      url: `https://sanpedro.aionia.com.mx/blog/${slug}`,
      images: [
        {
          url: post.imageUrl.startsWith("http")
            ? post.imageUrl
            : `https://sanpedro.aionia.com.mx${post.imageUrl}`,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS_DETAILS[slug];

  if (!post) {
    notFound();
  }

  const otherPosts = Object.values(BLOG_POSTS_DETAILS)
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  const isSmallEventsArticle = slug.includes("50-a-80-personas");
  const isPricingArticle = slug.includes("cuanto-cuesta-un-salon");
  const isPhotosArticle = slug.includes("fotos-y-recorrido");
  const isShotsOrAnimationArticle =
    slug.includes("carrito-de-shots") ||
    slug.includes("robot") ||
    slug.includes("limosinas") ||
    slug.includes("auto-clasico") ||
    slug.includes("dulces");
  const precotizadorHref = "/?guests=100&pkg=Plus#precotizador";
  const stickyHeadline = isSmallEventsArticle
    ? "¿Buscas salón en GAM CDMX? Paquetes Todo Incluido desde base de 100 personas"
    : isPricingArticle
    ? "Precios Oficiales 2026 GAM: 100 pers. desde $53,000 Premier • $71,000 Plus ⭐"
    : isPhotosArticle
    ? "¿Te gustaron los Salones Diamante y Platino en Norte 84 GAM?"
    : isShotsOrAnimationArticle
    ? "🔥 Carrito de Shots LED, Letras Gigantes, Robot y Limo en un solo lugar"
    : "Salones Diamante y Platino en Gustavo A. Madero, CDMX";
  const stickySubheadline = isSmallEventsArticle
    ? "Paquetes desde $530 p/p ($53,000 MXN Premier o $71,000 MXN Plus todo incluido)"
    : isPricingArticle
    ? "Simula tu presupuesto exacto (100 a 250+ invitados) con barra libre, banquete, DJ y Robot LED"
    : isPhotosArticle
    ? "Agenda un recorrido presencial sin costo o simula el precio de tu fecha en 30 segundos"
    : isShotsOrAnimationArticle
    ? "Incluidos en Paquete Plus ($710 p/p) o en nuestro Combo Fiesta VIP en Salones San Pedro Plus"
    : "Cotiza tu Boda, XV Años o Evento Empresarial desde 100 personas en 30 segundos";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl.startsWith("http")
          ? post.imageUrl
          : `https://sanpedro.aionia.com.mx${post.imageUrl}`,
        author: {
          "@type": "Organization",
          name: "Salones San Pedro Plus CDMX",
          url: "https://sanpedro.aionia.com.mx",
        },
        publisher: {
          "@type": "Organization",
          name: "Salones San Pedro Plus",
          logo: {
            "@type": "ImageObject",
            url: "https://sanpedro.aionia.com.mx/logo.svg",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://sanpedro.aionia.com.mx/blog/${slug}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Salones San Pedro Plus CDMX",
            item: "https://sanpedro.aionia.com.mx",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guía y Blog de Eventos",
            item: "https://sanpedro.aionia.com.mx/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://sanpedro.aionia.com.mx/blog/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

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

            {/* Respuesta Directa & Cotización Rápida Above-the-Fold (Resuelve permanencia fija scroll:0 en móvil) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-surface-container-low border border-primary/35 shadow-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-primary">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Precios Oficiales 2026 • GAM CDMX (Base 100 pers.)
                </span>
                <span className="text-[11px] font-semibold text-on-surface bg-primary/10 px-2.5 py-0.5 rounded-full">
                  Norte 84 #5336, a 5 min de Eduardo Molina
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface leading-snug">
                <strong>Premier:</strong> $530 p/p ($53,000) • <strong>Plus ⭐:</strong> $710 p/p ($71,000 c/Barra Libre, Robot LED y Carrito de Shots) • <strong>All Inclusive c/Limusina:</strong> $1,010 p/p ($101,000).
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <TrackedLink
                  eventType="cotizar_click"
                  source={`blog_atf_precotizador_${slug}`}
                  href={precotizadorHref}
                  className="flex-1 min-w-[160px] min-h-[44px] inline-flex items-center justify-center px-3.5 py-2 rounded-lg bg-primary text-on-primary font-extrabold text-[11px] uppercase tracking-wider text-center shadow-xs hover:opacity-95 transition-opacity"
                >
                  Simular Presupuesto (100+ pers.) →
                </TrackedLink>
                <TrackedLink
                  eventType="whatsapp_click"
                  source={`blog_atf_wa_${slug}`}
                  href={`https://wa.me/526633670431?text=${encodeURIComponent(
                    `¡Hola Salones San Pedro! Leí "${post.title}" y quiero cotizar mi evento desde 100 personas.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center px-3.5 py-2 rounded-lg bg-[#25D366] text-white font-extrabold text-[11px] uppercase tracking-wider text-center shadow-xs hover:opacity-95 transition-opacity"
                >
                  WhatsApp 24/7
                </TrackedLink>
              </div>
            </div>
          </div>

          {/* Cover Image Accionable (Convierte dead_clicks en imágenes de blog en tráfico al Precotizador) */}
          <TrackedLink
            eventType="cotizar_click"
            source={`blog_cover_img_${slug}`}
            href={precotizadorHref}
            className="group block relative h-64 md:h-[480px] rounded-2xl overflow-hidden shadow-xl mb-12 border border-outline-variant/30"
          >
            <Image
              src={post.imageUrl}
              alt={post.title}
              className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 text-white text-xs font-semibold backdrop-blur-xs border border-white/20">
                ✨ Disponible en nuestros Salones Diamante y Platino (GAM, CDMX)
              </span>
              <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-extrabold uppercase tracking-wider shadow-lg group-hover:scale-105 transition-transform">
                Cotizar mi Evento desde $530 p/p →
              </span>
            </div>
          </TrackedLink>

          {/* Post Content & Sidebar */}
          <div data-ux-section="blog_articulo" className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 font-body-md text-secondary leading-relaxed text-base md:text-lg space-y-6">
              {post.content}

              {/* Bloque de Conversión Contextual al Final de la Lectura */}
              <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-surface-container-low border-2 border-primary/40 shadow-md space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary block">
                  Cotización Instantánea en Línea • Salones San Pedro Plus
                </span>
                <h2 className="font-display-lg text-2xl font-bold text-on-surface">
                  ¿Te gustaría incluir esto en tu Boda, XV Años o Graduación?
                </h2>
                <p className="text-sm text-secondary leading-relaxed">
                  Calcula en menos de 1 minuto el presupuesto exacto para tu evento de 100 a 300+ invitados en Gustavo A. Madero, CDMX, o escríbenos por WhatsApp para agendar un recorrido presencial.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <TrackedLink
                    eventType="cotizar_click"
                    source={`blog_footer_precotizador_${slug}`}
                    href={precotizadorHref}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider text-center shadow-md hover:opacity-95 transition-opacity"
                  >
                    Calcular Presupuesto en Línea
                  </TrackedLink>
                  <TrackedLink
                    eventType="whatsapp_click"
                    source={`blog_footer_wa_${slug}`}
                    href={`https://wa.me/526633670431?text=${encodeURIComponent(
                      `¡Hola Salones San Pedro! Leí su artículo "${post.title}" y me gustaría cotizar mi evento y conocer los paquetes.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 px-5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider text-center shadow-md hover:opacity-95 transition-opacity"
                  >
                    Cotizar por WhatsApp 24/7
                  </TrackedLink>
                </div>
              </div>
            </div>

            {/* Sidebar / Recommended Posts */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-6 space-y-6 shadow-sm">
                <h2 className="font-display-lg text-lg text-on-surface font-semibold border-b border-outline-variant/30 pb-3">
                  Otros artículos recomendados
                </h2>
                <div className="space-y-6">
                  {otherPosts.map((otherPost) => (
                    <div key={otherPost.slug} className="space-y-2 group">
                      <span className="text-xs text-primary font-bold uppercase tracking-wider">{otherPost.category}</span>
                      <h3 className="font-display-lg text-on-surface font-medium group-hover:text-primary transition-colors leading-snug">
                        <Link href={`/blog/${otherPost.slug}`}>
                          {otherPost.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">{otherPost.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action */}
              <div className="bg-primary text-on-primary rounded-xl p-6 space-y-4 text-center shadow-lg">
                <h2 className="font-display-lg text-xl font-bold">¡Haz realidad tu gran día!</h2>
                <p className="text-sm opacity-90 leading-relaxed">
                  Verifica la disponibilidad para tu evento en Salones San Pedro hoy mismo y recibe atención personalizada de nuestros coordinadores.
                </p>
                <TrackedLink eventType="cotizar_click" source={`blog_post_${slug}`} href="/#paquetes" className="block w-full py-3 bg-surface text-primary rounded-lg font-label-sm text-xs font-bold shadow hover:bg-surface-variant transition-all uppercase tracking-wider">
                  Ver disponibilidad
                </TrackedLink>
              </div>
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
            <a aria-label="Facebook" className="text-primary hover:scale-110 transition-transform" href="https://www.facebook.com/salonsanpedroplus/" target="_blank" rel="noopener noreferrer">
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
          <LegalModals />
        </div>
        <p className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface mt-4 text-center opacity-70 pb-16">© 2026 Salones San Pedro Eventos. Todos los derechos reservados.</p>
      </footer>

      {/* Barra Flotante Contextual de Conversión en Lectura de Blog (Evita exit_intent sin cotizar en artículos SEO) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-highest/95 dark:bg-inverse-surface/95 backdrop-blur-md border-t border-primary/30 shadow-2xl px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-bold text-on-surface dark:text-inverse-on-surface leading-tight">
              {stickyHeadline}
            </p>
            <p className="text-[11px] text-secondary leading-tight hidden sm:block">
              {stickySubheadline}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <TrackedLink
              eventType="cotizar_click"
              source={`blog_sticky_precotizador_${slug}`}
              href={precotizadorHref}
              className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-primary text-on-primary font-extrabold text-[11px] uppercase tracking-wider text-center shadow-md hover:opacity-95 transition-opacity whitespace-nowrap"
            >
              {isSmallEventsArticle ? "Simular desde 100 Personas ($530 p/p) →" : "Cotizar en 30 Seg ($530 p/p) →"}
            </TrackedLink>
            <TrackedLink
              eventType="whatsapp_click"
              source={`blog_sticky_wa_${slug}`}
              href={`https://wa.me/526633670431?text=${encodeURIComponent(
                `¡Hola Salones San Pedro! Leí su artículo "${post.title}" y me gustaría cotizar mi evento y conocer fechas disponibles.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-xl bg-[#25D366] text-white font-extrabold text-[11px] uppercase tracking-wider text-center shadow-md hover:opacity-95 transition-opacity whitespace-nowrap"
            >
              WhatsApp
            </TrackedLink>
          </div>
        </div>
      </div>
    </>
  );
}

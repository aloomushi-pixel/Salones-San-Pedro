import Image from "next/image";
import Precotizador from "../components/Precotizador";
import TestimoniosCarousel from "../components/TestimoniosCarousel";
import GaleriaSection from "../components/GaleriaSection";
import TikTokVideos from "../components/TikTokVideos";
import Header from "../components/Header";
import MenuTinderCards from "../components/MenuTinderCards";
import ExperienciasCarousel from "../components/ExperienciasCarousel";
import TrackedLink from "../components/TrackedLink";
export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen pt-24 pb-16 w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              className="object-cover"
              alt="Instalación de gala en Salón Diamante"
              src="/hero_bg.jpg"
              fill
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-16">
            <h1 className="font-display-lg text-display-lg-mobile md:text-5xl lg:text-6xl text-surface-container-lowest mb-10 text-center lg:text-left drop-shadow-xl font-bold">
              Salón de eventos en CDMX San Pedro Plus
            </h1>
            
            <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-between">
              {/* Columna Izquierda: Texto y CTA */}
              <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-10 pt-4">
                <p className="font-body-lg text-xl md:text-2xl text-surface-variant max-w-xl drop-shadow-md leading-relaxed">
                  Salón de eventos en Ciudad de México para bodas, XV años, bautizos, graduaciones y eventos corporativos con precio económico.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <a className="bg-primary-container text-on-primary-container px-8 py-4 font-bold tracking-wider rounded-xl hover:scale-105 transition-transform uppercase text-center shadow-lg" href="#paquetes">
                    VER PRECIOS
                  </a>
                  <a className="border-2 border-surface-container-lowest text-surface-container-lowest px-8 py-4 font-bold tracking-wider rounded-xl hover:bg-surface-container-lowest hover:text-primary transition-all uppercase text-center backdrop-blur-sm shadow-lg" href="#galeria">
                    VER GALERÍA
                  </a>
                </div>
              </div>

              {/* Columna Derecha: Precotizador */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="w-full max-w-lg transform transition-transform hover:scale-[1.02] duration-300">
                  <Precotizador />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Paquetes */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface text-on-surface" id="paquetes">
          <div className="max-w-container-max mx-auto">
            
            {/* Encabezado de la Sección */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface">
                Nuestros Paquetes
              </h2>
              <p className="font-body-lg text-secondary max-w-2xl mx-auto">
                Conoce nuestras tarifas y opciones diseñadas para ofrecerte la mejor experiencia al mejor precio.
              </p>
            </div>

            {/* Tarjetas de Precios */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch max-w-6xl mx-auto px-4 md:px-8 -space-y-4 md:space-y-0 md:-space-x-4">
              
              {/* Paquete Premier */}
              <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border border-outline-variant/30 transition-all hover:scale-105 hover:z-30 duration-300 relative z-10 w-full md:w-[360px] flex-shrink-0 cursor-pointer">
                <div>
                  <div className="p-8 text-center bg-surface-container-low border-b border-outline-variant/30">
                    <h3 className="font-display-lg text-3xl text-on-surface font-bold mb-2">Premier</h3>
                    <p className="text-secondary text-sm">Base 100 personas</p>
                    <div className="mt-4 space-y-1 text-on-surface/80 text-sm">
                      <p>Viernes Platino desde <span className="font-bold text-lg text-primary">$530 p/p</span></p>
                    </div>
                  </div>
                  <div className="p-8">
                    <ul className="space-y-4 text-sm text-secondary">
                      <li className="flex items-start"><span className="text-primary-container font-bold mr-2">✓</span> 6 horas de servicio + 1/2 hr recepción</li>
                      <li className="flex items-start"><span className="text-primary-container font-bold mr-2">✓</span> Menú formal a 3 tiempos y tornafiesta</li>
                      <li className="flex items-start"><span className="text-primary-container font-bold mr-2">✓</span> Barra libre de mezcladores (descorche libre)</li>
                      <li className="flex items-start"><span className="text-primary-container font-bold mr-2">✓</span> DJ, iluminación y batucada clásica</li>
                      <li className="flex items-start"><span className="text-primary-container font-bold mr-2">✓</span> Montaje imperial con mesa de cristal</li>
                    </ul>
                  </div>
                </div>
                <div className="p-8 pt-0">
                  <TrackedLink eventType="cotizar_click" source="paquete_CTA" href="https://wa.me/526633670431?text=%C2%A1Hola!%20Visit%C3%A9%20su%20sitio%20web%20y%20me%20interesa%20agendar%20mi%20evento.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20detalles%3F" target="_blank" rel="noopener noreferrer" className="block w-full py-3 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-lg font-label-sm transition-all uppercase tracking-wider text-center text-xs font-bold">Verificar Disponibilidad</TrackedLink>
                </div>
              </div>

              {/* Paquete Plus (Destacado) */}
              <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl md:-translate-y-4 overflow-hidden border-2 border-primary-container flex flex-col justify-between relative transition-all hover:scale-105 hover:z-30 duration-300 z-20 w-full md:w-[380px] flex-shrink-0 cursor-pointer">
                <div className="absolute top-0 inset-x-0 bg-primary-container text-on-primary-container text-xs font-bold text-center py-1.5 uppercase tracking-wider">
                  El Más Elegido
                </div>
                <div>
                  <div className="p-8 text-center bg-primary-container/10 border-b border-outline-variant/30 mt-6">
                    <h3 className="font-display-lg text-3xl text-primary font-bold mb-2">Plus</h3>
                    <p className="text-secondary text-sm">Base 100 personas</p>
                    <div className="mt-4 space-y-1 text-on-surface/80 text-sm">
                      <p>Platino desde <span className="font-bold text-lg text-primary">$710 p/p</span></p>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-xs font-bold text-primary uppercase mb-3">Incluye Premier, más:</p>
                    <ul className="space-y-4 text-sm text-secondary">
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> 7 horas de servicio</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Menú formal a 4 tiempos</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Batucada espectacular y servicio de robot</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Mesa de dulces y cabina fotográfica</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Letras gigantes y carrito de shots</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Pre-fiesta para 30 personas (L a J, 4 hrs)</li>
                    </ul>
                  </div>
                </div>
                <div className="p-8 pt-0">
                  <TrackedLink
                    eventType="cotizar_click"
                    source="paquete_plus"
                    href="https://wa.me/526633670431?text=%C2%A1Hola!%20Visit%C3%A9%20su%20sitio%20web%20y%20me%20interesa%20agendar%20mi%20evento.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20detalles%3F" target="_blank" rel="noopener noreferrer"
                    className="block w-full py-3.5 bg-primary text-on-primary hover:opacity-90 rounded-lg font-label-sm shadow-md transition-all uppercase tracking-wider text-center text-xs font-bold"
                  >
                    Verificar Disponibilidad
                  </TrackedLink>
                </div>
              </div>

              {/* Paquete All Inclusive */}
              <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border border-outline-variant/30 transition-all hover:scale-105 hover:z-30 duration-300 relative z-10 w-full md:w-[360px] flex-shrink-0 cursor-pointer">
                <div>
                  <div className="p-8 text-center bg-surface-container-low border-b border-outline-variant/30">
                    <h3 className="font-display-lg text-3xl text-on-surface font-bold mb-2">All Inclusive</h3>
                    <p className="text-secondary text-sm">Base 100 personas</p>
                    <div className="mt-4 space-y-1 text-on-surface/80 text-sm">
                      <p>Platino desde <span className="font-bold text-lg text-primary">$1,010 p/p</span></p>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-xs font-bold text-primary uppercase mb-3">Incluye Plus, más:</p>
                    <ul className="space-y-4 text-sm text-secondary">
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Batucada con Robot Iron Man</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> 1 hora de Mariachi</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Servicio de Limusina</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Video filmación y fotos con álbum</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Vino espumoso y 1 botella de licor por mesa</li>
                      <li className="flex items-start"><span className="text-primary font-bold mr-2">✓</span> Cabina 360 (1.30 hrs)</li>
                    </ul>
                  </div>
                </div>
                <div className="p-8 pt-0">
                  <TrackedLink eventType="cotizar_click" source="paquete_CTA" href="https://wa.me/526633670431?text=%C2%A1Hola!%20Visit%C3%A9%20su%20sitio%20web%20y%20me%20interesa%20agendar%20mi%20evento.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20detalles%3F" target="_blank" rel="noopener noreferrer" className="block w-full py-3 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-lg font-label-sm transition-all uppercase tracking-wider text-center text-xs font-bold">Verificar Disponibilidad</TrackedLink>
                </div>
              </div>
            </div>


          </div>
        </section>

        {/* Sección Galería */}
        <section className="py-section-gap bg-surface-container-lowest" id="galeria">
          <GaleriaSection />
        </section>

        {/* Sección TikTok Videos */}
        <section className="py-section-gap bg-surface-container-low border-t border-b border-outline-variant/30" id="tiktok-videos">
          <TikTokVideos />
        </section>



        {/* Sección Gastronomía */}
        <section className="py-12 md:py-16 bg-surface-container-lowest" id="banquetes">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">
              EXPERIENCIA GASTRONÓMICA
            </h2>
            <div className="w-24 h-0.5 bg-primary-container mx-auto my-4"></div>
            <p className="font-body-lg text-secondary max-w-2xl mx-auto mb-12">
              Menú de 3 tiempos. Descubra nuestra selección exclusiva para eventos inolvidables.
            </p>

            {/* Menú de 3 Tiempos Tinder Cards */}
            <MenuTinderCards />
          </div>

        </section>

        {/* Sección Animación */}
        <section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-high" id="animacion">
          <div className="max-w-container-max mx-auto text-center mb-12">
            <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-4">Experiencias Multi-sensoriales</h2>
            <p className="font-body-md text-secondary max-w-3xl mx-auto mt-4 px-4">
              Ofrecemos estos servicios adicionales para personalizar al máximo tu celebración y hacer de tu evento algo verdaderamente inolvidable.
            </p>
          </div>
          <ExperienciasCarousel />
        </section>

        {/* Sección Testimonios */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface" id="testimonios">
          <div className="max-w-container-max mx-auto">

            <TestimoniosCarousel />
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="w-full bg-[#111111] text-white border-t border-[#333333]" id="ubicacion">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Social */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <Image alt="SALONES SAN PEDRO" className="h-16 w-auto object-contain brightness-0 invert" src="/logo.svg" width={160} height={64} />
            <p className="text-[#a0a0a0] text-center md:text-left font-body-md leading-relaxed">
              Experiencias inolvidables con la máxima elegancia y distinción para tu gran día.
            </p>
            <div className="flex gap-4 mt-2">
              <a aria-label="Facebook" className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="https://www.facebook.com/salonsanpedroplus/" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
              </a>
              <a aria-label="TikTok" className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="https://www.tiktok.com/@salones_sanpedroplus" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.66 1 6.33 6.33 0 0 0-3 5.37 6.34 6.34 0 0 0 10.86 4.5 6.3 6.3 0 0 0 2.25-4.81V7.26a9.68 9.68 0 0 0 4.7-2.13 9.77 9.77 0 0 0 2.83-4.13V2h-3.46a4.84 4.84 0 0 1-3.42 4.69z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Contacto & Ubicacion */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <h4 className="font-display-lg text-lg text-[#d4af37] uppercase tracking-widest border-b border-[#333333] pb-2 w-full text-center md:text-left">Ubicación</h4>
            <div className="flex items-start gap-3 text-[#a0a0a0]">
              <span className="material-symbols-outlined text-xl text-[#d4af37] shrink-0 mt-0.5">pin_drop</span>
              <span className="leading-relaxed">Calle Nte 84 No. 6507, Gustavo A. Madero,<br/>07800 Ciudad de México, CDMX</span>
            </div>
            <a
              href="https://maps.app.goo.gl/oarkXjctGWr5d4J96?g_st=ac"
              target="_blank" rel="noopener noreferrer"
              className="text-[#d4af37] hover:text-white transition-colors mt-2 font-semibold flex items-center gap-2 group"
            >
              Abrir en Google Maps <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
            </a>
          </div>

          {/* Horarios & Teléfono */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <h4 className="font-display-lg text-lg text-[#d4af37] uppercase tracking-widest border-b border-[#333333] pb-2 w-full text-center md:text-left">Contacto</h4>
            <div className="flex items-center gap-3 text-[#a0a0a0]">
              <span className="material-symbols-outlined text-xl text-[#d4af37]">call</span>
              <a href="tel:5557516268" className="hover:text-white transition-colors font-semibold tracking-wider">55 5751 6268</a>
            </div>
            <div className="flex items-start gap-3 text-[#a0a0a0]">
              <span className="material-symbols-outlined text-xl text-[#d4af37] mt-0.5">schedule</span>
              <span className="leading-relaxed">Lunes a Sábado<br/>10:00 AM - 7:00 PM</span>
            </div>
          </div>

          {/* Mapa Pequeño */}
          <div className="w-full h-full min-h-[200px] bg-[#222222] rounded-xl overflow-hidden border border-[#333333] shadow-lg hidden md:block relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.5471415170364!2d-99.098881!3d19.469571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fbd833cddd65%3A0x59fb21f0e39a618a!2sSalones%20San%20Pedro%20plus!5e0!3m2!1ses!2smx!4v1716800000000!5m2!1ses!2smx"
              className="absolute inset-0 w-full h-full opacity-80 hover:opacity-100 transition-opacity"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="bg-[#0a0a0a] border-t border-[#222222] py-6">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#666666] tracking-wide">
            <p>© {new Date().getFullYear()} Salones San Pedro Eventos. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a className="hover:text-[#d4af37] transition-colors uppercase" href="#">Aviso de Privacidad</a>
              <a className="hover:text-[#d4af37] transition-colors uppercase" href="#">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </footer>
      {/* WhatsApp Floating Button */}
      <TrackedLink eventType="whatsapp_click" source="floating_button" aria-label="Chat on WhatsApp" className="fixed bottom-8 right-8 z-[100] flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group" href="https://wa.me/526633670431?text=%C2%A1Hola!%20Visit%C3%A9%20su%20sitio%20web%20y%20me%20interesa%20agendar%20mi%20evento.%20%C2%BFMe%20podr%C3%ADan%20dar%20m%C3%A1s%20detalles%3F" target="_blank">
        <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
        </svg>
      </TrackedLink>
    </>
  );
}



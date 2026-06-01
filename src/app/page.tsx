import Image from "next/image";
import LeadForm from "../components/LeadForm";
import TestimoniosCarousel from "../components/TestimoniosCarousel";
import GaleriaSection from "../components/GaleriaSection";
import TikTokVideos from "../components/TikTokVideos";
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
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
          <div className="relative z-10 text-center px-margin-mobile max-w-4xl">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-surface-container-lowest mb-6">
              Momentos Extraordinarios, Sabores de Tradición
            </h1>
            <p className="font-body-lg text-body-lg text-surface-variant mb-10 max-w-2xl mx-auto">
              Exclusividad y prestigio en CDMX. Creamos experiencias que fusionan la elegancia contemporánea.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a className="bg-primary-container text-on-primary-container px-10 py-4 font-label-sm rounded-lg hover:opacity-90 transition-all uppercase" href="#disponibilidad">
                COTIZAR EVENTO
              </a>
              <a className="border border-surface-container-lowest text-surface-container-lowest px-10 py-4 font-label-sm rounded-lg hover:bg-surface-container-lowest hover:text-primary transition-all uppercase" href="#galeria">
                VER GALERÍA
              </a>
            </div>
          </div>
        </section>

        {/* Sección Gastronomía */}
        <section className="py-section-gap bg-surface-container-lowest" id="banquetes">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
            <span className="font-label-sm text-primary tracking-widest uppercase">Gastronomía de Autor</span>
            <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">
              EXPERIENCIA GASTRONÓMICA: MENÚ DE 3 TIEMPOS
            </h2>
            <div className="w-24 h-0.5 bg-primary-container mx-auto my-4"></div>
            <p className="font-body-lg text-secondary max-w-2xl mx-auto mb-12">
              Descubra nuestra selección exclusiva para eventos inolvidables.
            </p>

            {/* Menú de 3 Tiempos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
              {/* Primer Tiempo */}
              <div className="group bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-6">
                  <h3 className="font-display-lg text-xl text-primary font-bold tracking-wider uppercase">Primer Tiempo</h3>
                  <div className="relative h-60 rounded-xl overflow-hidden shadow-md">
                    <Image
                      className="object-cover group-hover:scale-105 transition-transform duration-500 saturate-[1.15] contrast-[1.05] brightness-[1.02]"
                      alt="Primer Tiempo - Ensalada Gourmet"
                      src="/gastronomia/primer_tiempo.jpg"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h4 className="font-body-md font-bold text-on-surface text-base leading-snug">
                    Entradas ligeras y sofisticadas para abrir el apetito.
                  </h4>
                  <p className="font-body-md text-secondary text-sm leading-relaxed">
                    Ensalada gourmet de frutos rojos, zarzamoras frescas y queso de cabra.
                  </p>
                </div>
                <a
                  href="https://wa.me/message/U7UANPSABGW4K1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 bg-inverse-surface hover:bg-primary text-on-primary hover:text-on-primary text-xs uppercase px-6 py-3 rounded-full transition-all duration-300 font-semibold tracking-wider self-center shadow-sm text-center"
                >
                  Ver Opciones
                </a>
              </div>

              {/* Segundo Tiempo */}
              <div className="group bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-6">
                  <h3 className="font-display-lg text-xl text-primary font-bold tracking-wider uppercase">Segundo Tiempo</h3>
                  <div className="relative h-60 rounded-xl overflow-hidden shadow-md">
                    <Image
                      className="object-cover group-hover:scale-105 transition-transform duration-500 saturate-[1.15] contrast-[1.05] brightness-[1.02]"
                      alt="Segundo Tiempo - Fetuccini al pesto"
                      src="/gastronomia/segundo_tiempo.jpg"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h4 className="font-body-md font-bold text-on-surface text-base leading-snug">
                    Pastas artesanales preparadas con salsas clásicas.
                  </h4>
                  <p className="font-body-md text-secondary text-sm leading-relaxed">
                    Fetuccini al pesto.
                  </p>
                </div>
                <a
                  href="https://wa.me/message/U7UANPSABGW4K1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 bg-inverse-surface hover:bg-primary text-on-primary hover:text-on-primary text-xs uppercase px-6 py-3 rounded-full transition-all duration-300 font-semibold tracking-wider self-center shadow-sm text-center"
                >
                  Ver Opciones
                </a>
              </div>

              {/* Tercer Tiempo */}
              <div className="group bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-6">
                  <h3 className="font-display-lg text-xl text-primary font-bold tracking-wider uppercase">Tercer Tiempo</h3>
                  <div className="relative h-60 rounded-xl overflow-hidden shadow-md">
                    <Image
                      className="object-cover group-hover:scale-105 transition-transform duration-500 saturate-[1.15] contrast-[1.05] brightness-[1.02]"
                      alt="Tercer Tiempo - Lomo al ciruelo"
                      src="/gastronomia/tercer_tiempo.jpg"
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h4 className="font-body-md font-bold text-on-surface text-base leading-snug">
                    Especialidades principales preparadas al punto ideal.
                  </h4>
                  <p className="font-body-md text-secondary text-sm leading-relaxed">
                    Lomo al ciruelo.
                  </p>
                </div>
                <a
                  href="https://wa.me/message/U7UANPSABGW4K1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 bg-inverse-surface hover:bg-primary text-on-primary hover:text-on-primary text-xs uppercase px-6 py-3 rounded-full transition-all duration-300 font-semibold tracking-wider self-center shadow-sm text-center"
                >
                  Ver Opciones
                </a>
              </div>
            </div>
          </div>

          {/* Banner inferior de personalización */}
          <div className="w-full bg-inverse-surface py-12 text-center text-inverse-on-surface">
            <div className="max-w-4xl mx-auto px-margin-mobile flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="font-display-lg text-xl md:text-2xl text-surface-container-lowest font-medium">
                ¿Desea personalizar su menú para su evento?
              </p>
              <a
                href="#disponibilidad"
                className="bg-primary-container text-on-primary-container hover:bg-primary-container/90 px-8 py-3.5 rounded-full font-label-sm text-sm uppercase tracking-wider font-bold transition-all shadow-md active:scale-95"
              >
                Solicitar Cotización
              </a>
            </div>
          </div>
        </section>

        {/* Sección Animación */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-high" id="animacion">
          <div className="max-w-container-max mx-auto text-center mb-16">
            <span className="font-label-sm text-primary tracking-widest uppercase">Entretenimiento Elite</span>
            <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-4">Experiencias Multi-sensoriales</h2>
          </div>
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest p-10 rounded-lg shadow-sm hover:shadow-lg transition-all border border-outline-variant/30 text-center">
              <span className="material-symbols-outlined text-primary text-5xl mb-6">speaker_group</span>
              <h3 className="font-display-lg text-headline-md mb-4 text-on-surface">Curaduría Sonora</h3>
              <p className="text-secondary">Sistemas de audio de alta fidelidad y DJ sets personalizados que crean la atmósfera perfecta para cada etapa de tu evento.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-lg shadow-sm hover:shadow-lg transition-all border border-outline-variant/30 text-center">
              <span className="material-symbols-outlined text-primary text-5xl mb-6">lightbulb_circle</span>
              <h3 className="font-display-lg text-headline-md mb-4 text-on-surface">Iluminación LED</h3>
              <p className="text-secondary">Diseño lumínico arquitectónico y dinámico que transforma el salón según el ritmo y la emoción del momento.</p>
            </div>
            <div className="bg-surface-container-lowest p-10 rounded-lg shadow-sm hover:shadow-lg transition-all border border-outline-variant/30 text-center">
              <span className="material-symbols-outlined text-primary text-5xl mb-6">photo_camera_front</span>
              <h3 className="font-display-lg text-headline-md mb-4 text-on-surface">Plataforma 360</h3>
              <p className="text-secondary">Captura recuerdos inmersivos con nuestra tecnología de última generación para videos en alta definición de tus invitados.</p>
            </div>
          </div>
        </section>

        {/* Sección Paquetes */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface text-on-surface" id="paquetes">
          <div className="max-w-container-max mx-auto">
            
            {/* Encabezado de la Sección */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="font-label-sm text-primary tracking-widest uppercase">Nuestros Paquetes</span>
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface">
                Paquetes Exclusivos
              </h2>
              <p className="font-body-lg text-secondary max-w-2xl mx-auto">
                Es un honor para Salones San Pedro Plus ser considerados para la planeación de tu evento. Te ayudaremos a que sea un día inolvidable.
              </p>
            </div>

            {/* Capacidades de los Salones */}
            <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
              <div className="bg-surface-container-lowest border border-outline-variant/40 p-6 rounded-xl text-center w-full md:w-1/3 shadow-sm">
                <h3 className="font-display-lg text-2xl text-primary mb-2">Salón Platino</h3>
                <p className="font-body-md text-secondary">Capacidad de 50 hasta 180 personas</p>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/40 p-6 rounded-xl text-center w-full md:w-1/3 shadow-sm">
                <h3 className="font-display-lg text-2xl text-primary mb-2">Salón Diamante</h3>
                <p className="font-body-md text-secondary">Capacidad de 100 hasta 200 personas</p>
              </div>
            </div>

            {/* Tarjetas de Precios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* Paquete Premier */}
              <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border border-outline-variant/30 transition-transform hover:-translate-y-2 duration-300">
                <div>
                  <div className="p-8 text-center bg-surface-container-low border-b border-outline-variant/30">
                    <h3 className="font-display-lg text-3xl text-on-surface font-bold mb-2">Premier</h3>
                    <p className="text-secondary text-sm">Base 100 personas</p>
                    <div className="mt-4 space-y-1 text-on-surface/80 text-sm">
                      <p>Viernes (Platino): <span className="font-bold text-lg text-primary">$530 p/p</span></p>
                      <p>Sábado (Diamante): <span className="font-bold text-lg text-primary">$590 p/p</span></p>
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
                  <a
                    href="#disponibilidad"
                    className="block w-full py-3 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-lg font-label-sm transition-all uppercase tracking-wider text-center text-xs font-bold"
                  >
                    Verificar Disponibilidad
                  </a>
                </div>
              </div>

              {/* Paquete Plus (Destacado) */}
              <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl transform md:-translate-y-4 overflow-hidden border-2 border-primary-container flex flex-col justify-between relative transition-all duration-300">
                <div className="absolute top-0 inset-x-0 bg-primary-container text-on-primary-container text-xs font-bold text-center py-1.5 uppercase tracking-wider">
                  El Más Elegido
                </div>
                <div>
                  <div className="p-8 text-center bg-primary-container/10 border-b border-outline-variant/30 mt-6">
                    <h3 className="font-display-lg text-3xl text-primary font-bold mb-2">Plus</h3>
                    <p className="text-secondary text-sm">Base 100 personas</p>
                    <div className="mt-4 space-y-1 text-on-surface/80 text-sm">
                      <p>Platino: <span className="font-bold text-lg text-primary">$710 p/p</span></p>
                      <p>Diamante: <span className="font-bold text-lg text-primary">$730 p/p</span></p>
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
                  <a
                    href="#disponibilidad"
                    className="block w-full py-3.5 bg-primary text-on-primary hover:opacity-90 rounded-lg font-label-sm shadow-md transition-all uppercase tracking-wider text-center text-xs font-bold"
                  >
                    Verificar Disponibilidad
                  </a>
                </div>
              </div>

              {/* Paquete All Inclusive */}
              <div className="bg-surface-container-lowest text-on-surface rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between border border-outline-variant/30 transition-transform hover:-translate-y-2 duration-300">
                <div>
                  <div className="p-8 text-center bg-surface-container-low border-b border-outline-variant/30">
                    <h3 className="font-display-lg text-3xl text-on-surface font-bold mb-2">All Inclusive</h3>
                    <p className="text-secondary text-sm">Base 100 personas</p>
                    <div className="mt-4 space-y-1 text-on-surface/80 text-sm">
                      <p>Platino: <span className="font-bold text-lg text-primary">$1,010 p/p</span></p>
                      <p>Diamante: <span className="font-bold text-lg text-primary">$1,030 p/p</span></p>
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
                  <a
                    href="#disponibilidad"
                    className="block w-full py-3 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-lg font-label-sm transition-all uppercase tracking-wider text-center text-xs font-bold"
                  >
                    Verificar Disponibilidad
                  </a>
                </div>
              </div>
            </div>

            {/* Condiciones de Pago */}
            <div className="mt-20 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 max-w-4xl mx-auto shadow-md">
              <h4 className="font-display-lg text-2xl font-bold text-primary text-center mb-8">Condiciones de Pago</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-secondary text-center">
                <div className="space-y-3">
                  <span className="block text-4xl font-bold text-primary">1</span>
                  <p className="font-body-md leading-relaxed">Reserva tu fecha con $3,000.00 MXN a la firma del contrato.</p>
                </div>
                <div className="space-y-3">
                  <span className="block text-4xl font-bold text-primary">2</span>
                  <p className="font-body-md leading-relaxed">Liquida el 25% del total a los 30 días posteriores a la firma.</p>
                </div>
                <div className="space-y-3">
                  <span className="block text-4xl font-bold text-primary">3</span>
                  <p className="font-body-md leading-relaxed">El monto total deberá ser liquidado 15 días previos al evento.</p>
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

        {/* Sección Testimonios */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface" id="testimonios">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-12">
              <span className="font-label-sm text-primary tracking-widest uppercase">Opiniones de Nuestros Clientes</span>
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">Testimonios</h2>
              <p className="text-secondary mt-4 max-w-2xl mx-auto">
                Lo que dicen nuestros clientes tras vivir su gran día en Salones San Pedro.
              </p>
            </div>
            <TestimoniosCarousel />
          </div>
        </section>

        {/* Sección Disponibilidad */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low" id="disponibilidad">
          <div className="max-w-container-max mx-auto text-center">
            <div className="mb-12">
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mb-6">Verificador de Disponibilidad</h2>
              <p className="font-body-lg text-secondary max-w-2xl mx-auto">
                Asegura tu fecha en el escenario más exclusivo de la CDMX. Elige tu evento y descubre si aún tenemos espacio para ti.
              </p>
            </div>
            <div className="max-w-4xl mx-auto bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-2xl border border-outline-variant/30">
              <LeadForm />
            </div>
          </div>
        </section>

        {/* Sección Ubicación */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface text-on-surface border-t border-outline-variant/30" id="ubicacion">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-12">
              <span className="font-label-sm text-primary tracking-widest uppercase">Ubicación Estratégica</span>
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">Nuestros Salones</h2>
              <div className="w-24 h-0.5 bg-primary-container mx-auto my-4"></div>
              <p className="font-body-lg text-secondary max-w-2xl mx-auto">
                Visítanos y conoce de cerca la elegancia y el equipamiento que harán único tu gran día.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
              {/* Info Panel */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 shadow-md">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">pin_drop</span>
                    <div>
                      <h4 className="font-display-lg text-lg font-bold text-on-surface mb-2">Dirección</h4>
                      <p className="font-body-md text-secondary leading-relaxed">
                        Calle Nte 84 No. 6507, Gustavo A. Madero,<br />
                        07800 Ciudad de México, CDMX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">call</span>
                    <div>
                      <h4 className="font-display-lg text-lg font-bold text-on-surface mb-2">Teléfono de Informes</h4>
                      <a href="tel:5557516268" className="font-body-md text-secondary hover:text-primary transition-colors font-semibold">
                        55 5751 6268
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
                    <div>
                      <h4 className="font-display-lg text-lg font-bold text-on-surface mb-2">Horario de Atención</h4>
                      <p className="font-body-md text-secondary">
                        Lunes a Sábado: 10:00 AM - 7:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-outline-variant/40 mt-8">
                  <a
                    href="https://www.google.com/maps/place/Salones+San+Pedro+plus/@19.469571,-99.2513163,12z/data=!4m10!1m2!2m1!1ssalones+san+pedro!3m6!1s0x85d1fbd833cddd65:0x59fb21f0e39a618a!8m2!3d19.469571!4d-99.098881!15sChFzYWxvbmVzIHNhbiBwZWRyb1oTIhFzYWxvbmVzIHNhbiBwZWRyb5IBFmZ1bmN0aW9uX3Jvb21fZmFjaWxpdHmaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVTnFYMDl5Ym5wblJSQULgAQD6AQQIABA5!16s%2Fg%2F1pzs7jq25?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-on-primary rounded-xl font-label-sm text-sm hover:opacity-90 transition-opacity uppercase tracking-wider font-bold shadow-md"
                  >
                    <span className="material-symbols-outlined text-lg">map</span>
                    Abrir en Google Maps
                  </a>
                </div>
              </div>

              {/* Map Panel */}
              <div className="lg:col-span-7 h-[450px] lg:h-auto min-h-[400px] bg-black rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.5471415170364!2d-99.098881!3d19.469571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fbd833cddd65%3A0x59fb21f0e39a618a!2sSalones%20San%20Pedro%20plus!5e0!3m2!1ses!2smx!4v1716800000000!5m2!1ses!2smx"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-8 bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
        <div className="flex flex-col items-center gap-4">
          <Image
            alt="SALONES SAN PEDRO"
            className="h-16 w-auto object-contain"
            src="/logo.svg"
            width={200}
            height={64}
          />
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
          <a className="hover:text-primary transition-colors" href="#">Aviso de Privacidad</a>
          <a className="hover:text-primary transition-colors" href="#">Términos de Servicio</a>
          <a className="hover:text-primary transition-colors" href="#">Preguntas Frecuentes</a>
        </div>
        <p className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface mt-4 text-center opacity-70">© 2026 Salones San Pedro Eventos. Todos los derechos reservados.</p>
      </footer>

      {/* WhatsApp Floating Button */}
      <a aria-label="Chat on WhatsApp" className="fixed bottom-8 right-8 z-[100] flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group" href="https://wa.me/message/U7UANPSABGW4K1" target="_blank">
        <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
        </svg>
      </a>
    </>
  );
}

import Image from "next/image";
import LeadForm from "../components/LeadForm";
import TestimoniosCarousel from "../components/TestimoniosCarousel";

export default function Home() {
  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-error text-on-error py-3 px-4 text-center font-label-sm sticky top-0 z-[60] shadow-md">
        🚨 Fechas de temporada alta agotándose rápido. ¡Aparta tu fecha con precio especial este mes!
      </div>

      {/* TopNavBar */}
      <nav className="sticky top-[48px] w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 bg-surface/90 dark:bg-surface/90 backdrop-blur-md shadow-sm">
        <div className="flex items-center">
          <img
            alt="SALONES SAN PEDRO"
            className="h-12 w-auto object-contain"
            src="/logo.svg"
          />
        </div>
        <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
          <a className="text-secondary hover:text-primary transition-colors duration-300" href="#paquetes">Paquetes</a>
          <a className="text-secondary hover:text-primary transition-colors duration-300" href="#galeria">Galería</a>
          <a className="text-secondary hover:text-primary transition-colors duration-300" href="#banquetes">Gastronomía</a>
          <a className="text-secondary hover:text-primary transition-colors duration-300" href="#disponibilidad">Verificar espacio</a>
          <a className="text-secondary hover:text-primary transition-colors duration-300" href="#testimonios">Testimonios</a>
          <a className="text-secondary hover:text-primary transition-colors duration-300 font-semibold" href="/blog">Blog</a>
        </div>
        <button className="bg-primary-container text-on-primary-container px-6 py-3 font-label-sm rounded-lg hover:opacity-80 transition-all scale-95 active:scale-90 uppercase tracking-wider">
          COTIZAR EVENTO
        </button>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover"
              alt="A grand luxury event ballroom in Puebla"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVMwgJur-c2cosAMZvey9gTxNUXrBb9TfOLSTnPThJ0UrPab0et4l3Za3XKmU8nsArtFIWXI63S14JFnNcYEynO1Y9U4anfBDe95--UvBkUWS8x_U3OikPP1zUbI0gX8k27fWlfa0YMC07GLDaRj1Gp7FWbJFxOePVW12fHq-koFkfjFnrqIYOx0y5stobbsq3w-fCtGwn-Z2hGypq7pIaR2ESClUBYcSa6lsLE0cuU9WQ5NzjrpJjzLkbUtUMTWQycmc1GpkefO-g"
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
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-6">
                  <h3 className="font-display-lg text-xl text-primary font-bold tracking-wider uppercase">Primer Tiempo</h3>
                  <div className="relative h-60 rounded-xl overflow-hidden shadow-md">
                    <img
                      className="w-full h-full object-cover"
                      alt="Primer Tiempo - Ensalada"
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
                    />
                  </div>
                  <h4 className="font-body-md font-bold text-on-surface text-base leading-snug">
                    Entradas ligeras y sofisticadas para abrir el apetito.
                  </h4>
                  <p className="font-body-md text-secondary text-sm leading-relaxed">
                    Ensalada de Verano con Vinagreta de Cítricos y Frutos Rojos.
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
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-6">
                  <h3 className="font-display-lg text-xl text-primary font-bold tracking-wider uppercase">Segundo Tiempo</h3>
                  <div className="relative h-60 rounded-xl overflow-hidden shadow-md">
                    <img
                      className="w-full h-full object-cover"
                      alt="Segundo Tiempo - Pasta"
                      src="https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80"
                    />
                  </div>
                  <h4 className="font-body-md font-bold text-on-surface text-base leading-snug">
                    Platos principales elaborados con ingredientes de temporada.
                  </h4>
                  <p className="font-body-md text-secondary text-sm leading-relaxed">
                    Fettuccine al Tartufo con Setas Silvestres.
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
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="space-y-6">
                  <h3 className="font-display-lg text-xl text-primary font-bold tracking-wider uppercase">Tercer Tiempo</h3>
                  <div className="relative h-60 rounded-xl overflow-hidden shadow-md">
                    <img
                      className="w-full h-full object-cover"
                      alt="Tercer Tiempo - Pollo"
                      src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80"
                    />
                  </div>
                  <h4 className="font-body-md font-bold text-on-surface text-base leading-snug">
                    Una culminación deliciosa para su banquete.
                  </h4>
                  <p className="font-body-md text-secondary text-sm leading-relaxed">
                    Pechuga de Pollo Rostizada a las Hierbas Finas y Vegetales de Estación.
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
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface" id="paquetes">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface">Paquetes Exclusivos</h2>
              <p className="text-secondary mt-4 max-w-2xl mx-auto">Opciones diseñadas para superar las expectativas más exigentes, garantizando una ejecución impecable.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* Básico */}
              <div className="flex flex-col p-8 rounded-lg bg-surface-container-low border border-outline-variant transition-transform hover:-translate-y-2">
                <div className="mb-8">
                  <h3 className="font-display-lg text-headline-md text-on-surface">Básico</h3>
                  <p className="text-primary font-bold text-2xl mt-2">$550 <span className="text-sm font-normal text-secondary">MXN / persona</span></p>
                </div>
                <ul className="flex-grow space-y-4 mb-8 text-secondary">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Menú de 3 tiempos</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Mezcladores ilimitados</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Personal de servicio</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Valet Parking incluido</li>
                </ul>
                <button className="w-full py-3 border border-primary text-primary rounded-lg font-label-sm hover:bg-primary hover:text-on-primary transition-all uppercase">Agendar mi recorrido</button>
              </div>

              {/* Gala */}
              <div className="flex flex-col p-10 rounded-lg bg-surface-container-lowest shadow-2xl border-2 border-primary-container relative z-10 scale-105">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Recomendado</div>
                <div className="mb-8">
                  <h3 className="font-display-lg text-headline-md text-on-surface">Gala</h3>
                  <p className="text-primary font-bold text-3xl mt-2">$1,200 <span className="text-sm font-normal text-secondary">MXN / persona</span></p>
                </div>
                <ul className="flex-grow space-y-4 mb-8 text-on-surface">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">star</span> Menú degustación 5 tiempos</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">star</span> Coctelería de autor premium</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">star</span> Decoración floral boutique</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">star</span> Iluminación robótica completa</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">star</span> Valet Parking &amp; Seguridad VIP</li>
                </ul>
                <button className="w-full py-4 bg-primary text-on-primary rounded-lg font-label-sm shadow-lg hover:opacity-90 transition-all uppercase">Agendar mi recorrido por el salón</button>
              </div>

              {/* Premium */}
              <div className="flex flex-col p-8 rounded-lg bg-surface-container-low border border-outline-variant transition-transform hover:-translate-y-2">
                <div className="mb-8">
                  <h3 className="font-display-lg text-headline-md text-on-surface">Premium</h3>
                  <p className="text-primary font-bold text-2xl mt-2">$850 <span className="text-sm font-normal text-secondary">MXN / persona</span></p>
                </div>
                <ul className="flex-grow space-y-4 mb-8 text-secondary">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Menú de 4 tiempos</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Barra libre nacional</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> DJ &amp; Animación básica</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Valet Parking incluido</li>
                </ul>
                <button className="w-full py-3 border border-primary text-primary rounded-lg font-label-sm hover:bg-primary hover:text-on-primary transition-all uppercase">Agendar mi recorrido</button>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Galería */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest" id="galeria">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="font-label-sm text-primary tracking-widest uppercase">Instalaciones</span>
                <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">Galería de Espacios</h2>
              </div>
              <p className="hidden md:block text-secondary max-w-xs text-right">Arquitectura contemporánea diseñada para la elegancia funcional.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px]">
              <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Luxury wedding reception"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSf4kmdGeSyJYwNSG3lSoHza4UpObgjsHFhaRY9JfMHzKaxNhDNogK45EcM3of_c8GScAsj4RGvPfrR9z6PapBM43ualufmxSwjgx7GzwA9H7J6QbyQZnSqbPubP8EfRKRUUHhXzvOcdNabRhRA4_SKUcJTQbUD56ZVmYvPTRR-KCHjh0j7vCbnAx2W53xcTCpBFPG95aGQaidxKUZdjhe6XOJYAT7gD-2BVkbBFwAd5IRY1Mr9Z76RHcQUU0EeNHv1u_Ocu70LEsH"
                />
              </div>
              <div className="md:col-span-1 overflow-hidden rounded-lg group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Outdoor terrace"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwMEeThPct2BQ74I8Br0-QkDL90_PD3cpOsfFmpKtzEulwTmNM-4wlqxUCHUK6bgj6QE-g1i5evaZhegA3FGINImKwP8pUbwlGqhIEge8Ie9fON-d79rR4SpLuIFmL2rvRrDMCyAtxDgzN8Hb_N6fgWtbzoVpNOjnBeUuEe4e0Gal62CxnPDnkh3fkGy4qsqGN1Val9XOW7vpISx7RwXlOUJxI-XXqohCMwpmR5brTuxe44-_jsSaSOt53HaAJ5gg4Tg1R8O3iNQA0"
                />
              </div>
              <div className="md:col-span-1 overflow-hidden rounded-lg group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Cocktail bar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWUZBL45IhD6lcoOny-X8CV_w3HZ2DXEIzaS3KWL5ZeUBZJnadeHxOvf_2zjJkJSgOwj3Fyguja078-pQUfmoTzgrIesDCU3GfY0GTt7bGplsHJbeThifeSzKpshyBflFNe8k5SoSGE3vY6U9doXCREcmbiej6y-F6Y8eCtqgm29oINxIb5qbti6Lq2qSBBL-m_lcEpoxVjyyu7JwA5l3FNjOEbbWywQ54sM63QH37iILSxwRtASsXug030auUtxQh5XR7dh6l1Sbl"
                />
              </div>
              <div className="md:col-span-2 overflow-hidden rounded-lg group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Banquet table set"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHeTnIJ33jk9qkLiLqVUxENCpoXpzhoM1V-bM2WDYn5Q9seks4TwfGfI7JI0oEU8SgaNsow_gR3xn9ACGKpss4EZojFM0cycs09VT9eiCx0vu3p9F6-tsgkoykFHFtSneTyiZ_tLns4NRwKUN2T3g7K5mThA_8qcpnkoDvWjJgppGyFLkgnR3ZmDy-9ptle7WuKqhnH8eOTmGkWZH5uFLv6lpwEgt68uvy-_VG_IBdqNNk31O86UKLfO-ejpe_clBpT4SR5tT8wv2w"
                />
              </div>
            </div>
          </div>
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
                Asegura tu fecha en el escenario más exclusivo de Puebla. Elige tu evento y descubre si aún tenemos espacio para ti.
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-2xl border border-outline-variant/30">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-8 bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
        <div className="flex flex-col items-center gap-4">
          <img
            alt="SALONES SAN PEDRO"
            className="h-16 w-auto object-contain"
            src="/logo.svg"
          />
          <div className="flex gap-6 mt-2">
            <a aria-label="Facebook" className="text-primary hover:scale-110 transition-transform" href="#">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
            </a>
            <a aria-label="Instagram" className="text-primary hover:scale-110 transition-transform" href="#">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.884 8.74 24 12 24s3.667-.012 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path></svg>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-body-md text-body-md text-secondary">
          <a className="hover:text-primary transition-colors" href="#">Aviso de Privacidad</a>
          <a className="hover:text-primary transition-colors" href="#">Términos de Servicio</a>
          <a className="hover:text-primary transition-colors" href="#">Preguntas Frecuentes</a>
        </div>
        <p className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface mt-4 text-center opacity-70">© 2024 Salones San Pedro Eventos. Todos los derechos reservados. Zona Esmeralda, Puebla.</p>
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

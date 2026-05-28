"use client";

import { useState, useEffect } from "react";

interface VideoData {
  id: number;
  title: string;
  views: string;
  caption: string;
  tiktokId: string; // The official numeric TikTok video ID from @salones_sanpedroplus
  coverUrl: string;
}

const TIKTOK_VIDEOS: VideoData[] = [
  {
    id: 1,
    title: "Montaje de Gala Especial ✨",
    views: "18.4K",
    caption: "La magia de un montaje de gala diseñado a la perfección en Salones San Pedro Plus. Cuidamos cada detalle para hacer tu día inolvidable.",
    tiktokId: "7339402070270708998", // Real video ID from @salones_sanpedroplus
    coverUrl: "/galeria/diamante/diamante_1.jpg",
  },
  {
    id: 2,
    title: "Fiesta y Pista de Baile LED 💃",
    views: "12.2K",
    caption: "¡Luces, robótica y la pista LED encendida! Así se vive la máxima diversión en nuestros recintos. #XVAños #BodasDeGala #Party",
    tiktokId: "7365667181096455442", // Real video ID from @salones_sanpedroplus
    coverUrl: "/galeria/platino/platino_10.jpg",
  },
  {
    id: 3,
    title: "Experiencia de Gala Boutique 🕯️",
    views: "5.7K",
    caption: "Elegancia contemporánea y un servicio boutique excepcional para tus momentos más especiales. Vive la experiencia San Pedro.",
    tiktokId: "7548605393782541575", // Real video ID from @salones_sanpedroplus
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Entrada de Honor 👰🤵",
    views: "3.1K",
    caption: "Un momento de ensueño: la entrada triunfal rodeada de luces y el cariño de tus seres queridos. Creamos recuerdos eternos.",
    tiktokId: "7501856695526739207", // Real video ID from @salones_sanpedroplus
    coverUrl: "/galeria/diamante/diamante_4.jpg",
  },
];

export default function TikTokVideos() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  const handleNextVideo = () => {
    setSelectedVideo((current) => {
      if (!current) return null;
      const currentIndex = TIKTOK_VIDEOS.findIndex((v) => v.id === current.id);
      const nextIndex = (currentIndex + 1) % TIKTOK_VIDEOS.length;
      return TIKTOK_VIDEOS[nextIndex];
    });
  };

  const handlePrevVideo = () => {
    setSelectedVideo((current) => {
      if (!current) return null;
      const currentIndex = TIKTOK_VIDEOS.findIndex((v) => v.id === current.id);
      const prevIndex = (currentIndex - 1 + TIKTOK_VIDEOS.length) % TIKTOK_VIDEOS.length;
      return TIKTOK_VIDEOS[prevIndex];
    });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data["x-tiktok-player"]) {
        // If the video ends (value === 0), go to the next one
        if (
          (data.type === "onStateChange" && data.value === 0) ||
          data.type === "ended"
        ) {
          handleNextVideo();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="font-label-sm text-primary tracking-widest uppercase">Momentos Reales</span>
        <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">
          Salones San Pedro en TikTok
        </h2>
        <div className="w-24 h-0.5 bg-primary-container mx-auto my-4"></div>
        <p className="font-body-lg text-secondary max-w-2xl mx-auto">
          Descubre el ambiente único de nuestras celebraciones a través de nuestros videos más virales (+2K vistas).
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIKTOK_VIDEOS.map((vid) => (
          <div
            key={vid.id}
            className="group relative bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedVideo(vid)}
          >
            {/* Cover Image */}
            <div className="relative aspect-[9/16] overflow-hidden">
              <img
                src={vid.coverUrl}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              {/* View Count Tag */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-label-sm text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/15">
                <span className="material-symbols-outlined text-xs text-error font-bold fill-current">local_fire_department</span>
                <span>{vid.views} vistas</span>
              </div>

              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-primary/95 text-on-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl fill-current pl-1">play_arrow</span>
                </div>
              </div>

              {/* Title & Caption */}
              <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                <h3 className="font-display-lg text-lg font-bold tracking-wide text-primary-container leading-snug">
                  {vid.title}
                </h3>
                <p className="font-body-md text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {vid.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Link Button */}
      <div className="text-center mt-12">
        <a
          href="https://www.tiktok.com/@salones_sanpedroplus"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-8 py-4 font-label-sm rounded-lg hover:opacity-90 transition-all uppercase tracking-wider shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.66 1 6.33 6.33 0 0 0-3 5.37 6.34 6.34 0 0 0 10.86 4.5 6.3 6.3 0 0 0 2.25-4.81V7.26a9.68 9.68 0 0 0 4.7-2.13 9.77 9.77 0 0 0 2.83-4.13V2h-3.46a4.84 4.84 0 0 1-3.42 4.69z"></path>
          </svg>
          Seguir en @salones_sanpedroplus
        </a>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-4xl bg-surface-container-low rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-outline-variant/30">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/55 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Cerrar modal"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* TikTok Official Embedded Player Column */}
            <div className="relative w-full md:w-[50%] bg-black flex items-center justify-center aspect-[9/16] md:aspect-auto md:h-[700px] overflow-hidden group/player">
              <iframe
                src={`https://www.tiktok.com/player/v1/${selectedVideo.tiktokId}?autoplay=1&loop=0&rel=0`}
                className="w-full h-full"
                style={{ border: "none" }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevVideo}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center transition-all opacity-70 md:opacity-0 md:group-hover/player:opacity-100 focus:opacity-100 hover:bg-black/80 hover:scale-105 active:scale-95 shadow-md"
                aria-label="Video anterior"
              >
                <span className="material-symbols-outlined text-2xl font-bold">chevron_left</span>
              </button>

              <button
                onClick={handleNextVideo}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center transition-all opacity-70 md:opacity-0 md:group-hover/player:opacity-100 focus:opacity-100 hover:bg-black/80 hover:scale-105 active:scale-95 shadow-md"
                aria-label="Siguiente video"
              >
                <span className="material-symbols-outlined text-2xl font-bold">chevron_right</span>
              </button>
            </div>

            {/* Content Column */}
            <div className="w-full md:w-[50%] p-6 md:p-10 flex flex-col justify-between h-[350px] md:h-[700px] overflow-y-auto bg-surface-container-lowest">
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-container rounded-full overflow-hidden flex items-center justify-center border border-primary/20">
                      <img
                        src="/logo.svg"
                        alt="Logo Salones San Pedro"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-display-lg text-sm font-bold text-on-surface">salones_sanpedroplus</h4>
                      <p className="font-body-md text-xs text-secondary">Salones San Pedro Plus</p>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-4">
                  <span className="font-label-sm text-primary tracking-widest uppercase text-xs">Video Destacado</span>
                  <h3 className="font-display-lg text-xl md:text-2xl font-bold text-on-surface">
                    {selectedVideo.title}
                  </h3>
                  <p className="font-body-md text-sm md:text-base text-secondary leading-relaxed">
                    {selectedVideo.caption}
                  </p>
                  
                  {/* Views count */}
                  <div className="flex items-center gap-2 text-xs md:text-sm text-error font-semibold bg-error/5 p-3 rounded-lg border border-error/10 self-start">
                    <span className="material-symbols-outlined text-base">local_fire_department</span>
                    <span>Este video cuenta con más de {selectedVideo.views} reproducciones en TikTok</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-4 pt-6 border-t border-outline-variant/40 mt-6">
                {/* WhatsApp Contact CTA */}
                <a
                  href="https://wa.me/message/U7UANPSABGW4K1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-xl font-label-sm text-sm hover:opacity-90 transition-opacity uppercase tracking-wider shadow"
                >
                  <span className="material-symbols-outlined text-xl">chat</span>
                  Preguntar por Disponibilidad
                </a>

                {/* View on TikTok Button */}
                <a
                  href={`https://www.tiktok.com/@salones_sanpedroplus/video/${selectedVideo.tiktokId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-inverse-surface text-inverse-on-surface rounded-xl font-label-sm text-sm hover:opacity-90 transition-opacity uppercase tracking-wider shadow"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.66 1 6.33 6.33 0 0 0-3 5.37 6.34 6.34 0 0 0 10.86 4.5 6.3 6.3 0 0 0 2.25-4.81V7.26a9.68 9.68 0 0 0 4.7-2.13 9.77 9.77 0 0 0 2.83-4.13V2h-3.46a4.84 4.84 0 0 1-3.42 4.69z"></path>
                  </svg>
                  Ver en la App de TikTok
                </a>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

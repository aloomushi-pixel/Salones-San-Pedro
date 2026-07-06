"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    title: "Nuestro Nuevo Video ✨",
    views: "Nuevo",
    caption: "Descubre más de la magia de Salones San Pedro Plus en nuestro nuevo video de TikTok. ¡Síguenos!",
    tiktokId: "7644667860891028756",
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Montaje de Gala Especial ✨",
    views: "18.4K",
    caption: "La magia de un montaje de gala diseñado a la perfección en Salones San Pedro Plus. Cuidamos cada detalle para hacer tu día inolvidable.",
    tiktokId: "7339402070270708998",
    coverUrl: "/galeria/diamante/diamante_1.jpg",
  },
  {
    id: 3,
    title: "Fiesta y Pista de Baile LED 💃",
    views: "12.2K",
    caption: "¡Luces, robótica y la pista LED encendida! Así se vive la máxima diversión en nuestros recintos. #XVAños #BodasDeGala #Party",
    tiktokId: "7365667181096455442",
    coverUrl: "/galeria/platino/platino_10.jpg",
  },
  {
    id: 4,
    title: "Experiencia de Gala Boutique 🕯️",
    views: "5.7K",
    caption: "Elegancia contemporánea y un servicio boutique excepcional para tus momentos más especiales. Vive la experiencia San Pedro.",
    tiktokId: "7548605393782541575",
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Entrada de Honor 👰🤵",
    views: "3.1K",
    caption: "Un momento de ensueño: la entrada triunfal rodeada de luces y el cariño de tus seres queridos. Creamos recuerdos eternos.",
    tiktokId: "7501856695526739207",
    coverUrl: "/galeria/diamante/diamante_4.jpg",
  },
];

export default function TikTokVideos() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData>(TIKTOK_VIDEOS[0]);

  const handleNextVideo = () => {
    setSelectedVideo((current) => {
      const currentIndex = TIKTOK_VIDEOS.findIndex((v) => v.id === current.id);
      const nextIndex = (currentIndex + 1) % TIKTOK_VIDEOS.length;
      return TIKTOK_VIDEOS[nextIndex];
    });
  };

  const handlePrevVideo = () => {
    setSelectedVideo((current) => {
      const currentIndex = TIKTOK_VIDEOS.findIndex((v) => v.id === current.id);
      const prevIndex = (currentIndex - 1 + TIKTOK_VIDEOS.length) % TIKTOK_VIDEOS.length;
      return TIKTOK_VIDEOS[prevIndex];
    });
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data["x-tiktok-player"]) {
        // When the video finishes (value === 0), autoplay the next video
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
      {/* Title Section */}
      <div className="text-center mb-12">
        <span className="font-label-sm text-primary tracking-widest uppercase">Momentos Reales</span>
        <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">
          Así se vive la experiencia San Pedro Plus
        </h2>
        <div className="w-24 h-0.5 bg-primary-container mx-auto my-4"></div>
        <p className="font-body-lg text-secondary max-w-2xl mx-auto">
          Descubre el ambiente único de nuestras celebraciones a través de nuestra lista de reproducción viral (+2K vistas).
        </p>
      </div>

      {/* Playlist Player Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch justify-center max-w-5xl mx-auto">
        
        {/* Left Column: Vertical TikTok Player */}
        <div className="w-full sm:max-w-[360px] lg:w-[40%] flex flex-col justify-center">
          <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 group/player animate-fade-in">
            <iframe
              src={`https://www.tiktok.com/player/v1/${selectedVideo.tiktokId}?autoplay=1&loop=0&rel=0`}
              className="w-full h-full"
              style={{ border: "none" }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            
            {/* Quick Manual Nav Buttons overlaying player */}
            <button
              onClick={handlePrevVideo}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center transition-all opacity-70 md:opacity-0 md:group-hover/player:opacity-100 focus:opacity-100 hover:bg-black/85 hover:scale-105 active:scale-95 shadow-md"
              aria-label="Video anterior"
            >
              <span className="material-symbols-outlined text-2xl font-bold">chevron_left</span>
            </button>

            <button
              onClick={handleNextVideo}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center transition-all opacity-70 md:opacity-0 md:group-hover/player:opacity-100 focus:opacity-100 hover:bg-black/85 hover:scale-105 active:scale-95 shadow-md"
              aria-label="Siguiente video"
            >
              <span className="material-symbols-outlined text-2xl font-bold">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Right Column: Playlist Details and Queue */}
        <div className="w-full lg:w-[60%] flex flex-col justify-between bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8 min-h-[500px]">
          
          {/* Top Panel: Currently Playing Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/40 pb-4">
              <div className="w-12 h-12 bg-primary-container rounded-full overflow-hidden flex items-center justify-center border border-primary/20">
                <Image
                  src="/logo.svg"
                  alt="Logo Salones San Pedro"
                  className="object-contain"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <h4 className="font-display-lg text-sm font-bold text-on-surface">salones_sanpedroplus</h4>
                <p className="font-body-md text-xs text-secondary">Salones San Pedro Plus</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary font-label-sm text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                  Ahora Reproduciendo
                </span>
                <div className="flex items-center gap-1.5 text-xs text-error font-semibold bg-error/5 px-2.5 py-1 rounded-full border border-error/10">
                  <span className="material-symbols-outlined text-sm font-bold fill-current">local_fire_department</span>
                  <span>{selectedVideo.views} vistas</span>
                </div>
              </div>
              
              <h3 className="font-display-lg text-xl md:text-2xl font-bold text-on-surface">
                {selectedVideo.title}
              </h3>
              
              <p className="font-body-md text-sm md:text-base text-secondary leading-relaxed line-clamp-3">
                {selectedVideo.caption}
              </p>
            </div>
          </div>

          {/* Bottom Panel: Interactive Playlist Queue */}
          <div className="mt-8 space-y-4">
            <h4 className="font-display-lg text-xs font-bold uppercase tracking-wider text-secondary border-b border-outline-variant/20 pb-2">
              Lista de Reproducción
            </h4>
            
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {TIKTOK_VIDEOS.map((vid, idx) => {
                const isActive = vid.id === selectedVideo.id;
                return (
                  <button
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left border ${
                      isActive
                        ? "bg-primary/5 border-primary/30 shadow-sm"
                        : "bg-surface-container-lowest border-outline-variant/10 hover:border-outline-variant/50 hover:bg-surface-container-high"
                    }`}
                  >
                    {/* Number index */}
                    <span className={`font-display-lg text-sm font-bold w-4 text-center ${isActive ? "text-primary" : "text-outline"}`}>
                      {idx + 1}
                    </span>

                    {/* Mini Thumbnail */}
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <Image
                        src={vid.coverUrl}
                        alt={vid.title}
                        className="object-cover"
                        fill
                        sizes="48px"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-base animate-pulse">play_arrow</span>
                        </div>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-display-lg text-sm font-bold truncate ${isActive ? "text-primary" : "text-on-surface"}`}>
                        {vid.title}
                      </h5>
                      <p className="font-body-md text-xs text-secondary truncate mt-0.5">
                        {vid.caption}
                      </p>
                    </div>

                    {/* Views tag or status indicator */}
                    <div className="flex-shrink-0 text-right">
                      <span className="font-label-sm text-[11px] text-secondary bg-outline-variant/30 px-2 py-0.5 rounded-full">
                        {vid.views}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-outline-variant/40 mt-6">
            <a
              href="https://wa.me/message/U7UANPSABGW4K1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-label-sm text-xs hover:opacity-90 transition-opacity uppercase tracking-wider shadow"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              Preguntar por Disponibilidad
            </a>

            <a
              href="https://www.tiktok.com/@salones_sanpedroplus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-inverse-surface text-inverse-on-surface rounded-xl font-label-sm text-xs hover:opacity-90 transition-opacity uppercase tracking-wider shadow"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.66 1 6.33 6.33 0 0 0-3 5.37 6.34 6.34 0 0 0 10.86 4.5 6.3 6.3 0 0 0 2.25-4.81V7.26a9.68 9.68 0 0 0 4.7-2.13 9.77 9.77 0 0 0 2.83-4.13V2h-3.46a4.84 4.84 0 0 1-3.42 4.69z"></path>
              </svg>
              Seguir en @salones_sanpedroplus
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { trackEvent } from "@/utils/trackEvent";

interface VideoData {
  id: number;
  title: string;
  views: string;
  caption: string;
  tiktokId?: string; // The official numeric TikTok video ID from @salones_sanpedroplus
  videoSrc?: string; // Native self-hosted MP4 video in /videos/ for instant playback
  coverUrl: string;
}

const TIKTOK_VIDEOS: VideoData[] = [
  {
    id: 1,
    title: "Recorrido Real XV Años: Pista LED y Escalera Imperial ✨",
    views: "Video HD Real",
    caption:
      "Recorrido real en Salones San Pedro Plus: mesa de dulces con muro shimmer, letras gigantes XV iluminadas, coctelería de bienvenida en escalera imperial, vajilla dorada y pista de baile LED infinita.",
    videoSrc: "/videos/evento_real_2.mp4",
    coverUrl: "/galeria/platino/platino_5.jpg",
  },
  {
    id: 2,
    title: "Recorrido Real de Gala: Pista Infinita, Cristal y Robot 🥂",
    views: "Video HD Real",
    caption:
      "Conoce nuestro montaje real en piso: recepción con coctelería de bienvenida, mesas de cristal iluminadas, centros de mesa florales altos, mesa de dulces con Robot LED, cabina de DJ y pista LED infinita.",
    videoSrc: "/videos/evento_real_1.mp4",
    coverUrl: "/videos/evento_real_1_poster.jpg",
  },
  {
    id: 3,
    title: "Montaje de Gala Especial ✨",
    views: "18.4K",
    caption: "La magia de un montaje de gala diseñado a la perfección en Salones San Pedro Plus. Cuidamos cada detalle para hacer tu día inolvidable.",
    tiktokId: "7339402070270708998",
    coverUrl: "/galeria/diamante/diamante_1.jpg",
  },
  {
    id: 4,
    title: "Fiesta y Pista de Baile LED 💃",
    views: "12.2K",
    caption: "¡Luces, robótica y la pista LED encendida! Así se vive la máxima diversión en nuestros recintos. #XVAños #BodasDeGala #Party",
    tiktokId: "7365667181096455442",
    coverUrl: "/galeria/platino/platino_10.jpg",
  },
  {
    id: 5,
    title: "Experiencia de Gala Boutique 🕯️",
    views: "5.7K",
    caption: "Elegancia contemporánea y un servicio boutique excepcional para tus momentos más especiales. Vive la experiencia San Pedro.",
    tiktokId: "7548605393782541575",
    coverUrl: "/galeria/diamante/diamante_5.jpg",
  },
  {
    id: 6,
    title: "Entrada de Honor 👰🤵",
    views: "3.1K",
    caption: "Un momento de ensueño: la entrada triunfal rodeada de luces y el cariño de tus seres queridos. Creamos recuerdos eternos.",
    tiktokId: "7501856695526739207",
    coverUrl: "/galeria/diamante/diamante_4.jpg",
  },
  {
    id: 7,
    title: "Nuestro Video en TikTok ✨",
    views: "TikTok Oficial",
    caption: "Descubre más de Salones San Pedro Plus en nuestro perfil oficial de TikTok @salones_sanpedroplus.",
    tiktokId: "7644667860891028756",
    coverUrl: "/galeria/diamante/diamante_2.jpg",
  },
];

export default function TikTokVideos() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData>(TIKTOK_VIDEOS[0]);
  const [draftQuote, setDraftQuote] = useState<{
    guests: number;
    packageType: string;
    eventType: string;
  }>({
    guests: 100,
    packageType: "Plus",
    eventType: "Evento",
  });

  useEffect(() => {
    const readDraft = () => {
      try {
        const raw = sessionStorage.getItem("sanpedro_precotizador_draft_v1");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        setDraftQuote({
          guests:
            typeof parsed.guests === "number" && parsed.guests >= 100
              ? parsed.guests
              : 100,
          packageType: parsed.packageType || "Plus",
          eventType: parsed.eventType || "Evento",
        });
      } catch {}
    };
    readDraft();

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<{
        guests?: number;
        packageType?: string;
        eventType?: string;
      }>;
      if (custom.detail) {
        setDraftQuote((prev) => ({
          guests:
            typeof custom.detail.guests === "number" && custom.detail.guests >= 100
              ? custom.detail.guests
              : prev.guests,
          packageType: custom.detail.packageType || prev.packageType,
          eventType: custom.detail.eventType || prev.eventType,
        }));
      }
    };

    window.addEventListener("ssp:sync-from-precotizador", handleSync);
    return () => window.removeEventListener("ssp:sync-from-precotizador", handleSync);
  }, []);

  const unitPrice =
    draftQuote.packageType === "Premier"
      ? 530
      : draftQuote.packageType === "All Inclusive"
      ? 1010
      : 710;
  const totalFormatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(draftQuote.guests * unitPrice);

  const handleNextVideo = () => {
    setSelectedVideo((current) => {
      const currentIndex = TIKTOK_VIDEOS.findIndex((v) => v.id === current.id);
      const nextIndex = (currentIndex + 1) % TIKTOK_VIDEOS.length;
      const nextVid = TIKTOK_VIDEOS[nextIndex];
      trackEvent("tiktok_interaction", `next_video_${nextVid.id}`, {
        section: "tiktok-videos",
        experience_title: nextVid.title,
      });
      return nextVid;
    });
  };

  const handlePrevVideo = () => {
    setSelectedVideo((current) => {
      const currentIndex = TIKTOK_VIDEOS.findIndex((v) => v.id === current.id);
      const prevIndex = (currentIndex - 1 + TIKTOK_VIDEOS.length) % TIKTOK_VIDEOS.length;
      const prevVid = TIKTOK_VIDEOS[prevIndex];
      trackEvent("tiktok_interaction", `prev_video_${prevVid.id}`, {
        section: "tiktok-videos",
        experience_title: prevVid.title,
      });
      return prevVid;
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
        <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-surface mt-2">
          Últimos videos de San Pedro Plus
        </h2>
        <div className="w-24 h-0.5 bg-primary-container mx-auto my-4"></div>
      </div>

      {/* Playlist Player Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch justify-center max-w-5xl mx-auto">
        
        {/* Left Column: Vertical Native MP4 / TikTok Player */}
        <div className="w-full sm:max-w-[360px] lg:w-[40%] flex flex-col justify-center">
          <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30 group/player animate-fade-in">
            {selectedVideo.videoSrc ? (
              <video
                key={selectedVideo.videoSrc}
                src={selectedVideo.videoSrc}
                poster={selectedVideo.coverUrl}
                controls
                playsInline
                preload="metadata"
                onPlay={() =>
                  trackEvent("tiktok_interaction", `native_video_play_${selectedVideo.id}`, {
                    section: "tiktok-videos",
                    experience_title: selectedVideo.title,
                  })
                }
                onEnded={handleNextVideo}
                className="w-full h-full object-cover bg-black"
              />
            ) : (
              <iframe
                src={`https://www.tiktok.com/player/v1/${selectedVideo.tiktokId}?autoplay=1&loop=0&rel=0`}
                className="w-full h-full"
                style={{ border: "none" }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
            
            {/* Quick Manual Nav Buttons overlaying player (>=44x44px mobile tap targets) */}
            <button
              onClick={handlePrevVideo}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-80 md:opacity-0 md:group-hover/player:opacity-100 focus:opacity-100 hover:bg-black/85 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              aria-label="Video anterior"
            >
              <span className="material-symbols-outlined text-2xl font-bold pointer-events-none">chevron_left</span>
            </button>

            <button
              onClick={handleNextVideo}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-40 w-11 h-11 bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-80 md:opacity-0 md:group-hover/player:opacity-100 focus:opacity-100 hover:bg-black/85 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              aria-label="Siguiente video"
            >
              <span className="material-symbols-outlined text-2xl font-bold pointer-events-none">chevron_right</span>
            </button>
          </div>

          {/* Barra Rápida de Videos y Conversión en Móvil (Visible al instante en scroll 49-54% sin bajar 500px) */}
          <div className="lg:hidden mt-3 space-y-2.5 bg-surface-container-lowest border border-primary/30 rounded-2xl p-3 shadow-md">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {TIKTOK_VIDEOS.map((vid, idx) => {
                const active = vid.id === selectedVideo.id;
                return (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => {
                      setSelectedVideo(vid);
                      trackEvent("tiktok_interaction", `mobile_pill_video_${vid.id}`, {
                        section: "tiktok-videos",
                        experience_title: vid.title,
                      });
                    }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-on-primary shadow-xs"
                        : "bg-surface-container-low text-secondary border border-outline-variant/30"
                    }`}
                  >
                    {idx + 1}. {vid.title.replace(/✨|💃|🕯️|👰🤵/g, "").trim()}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-2 text-[11px] text-secondary px-1">
              <span className="font-semibold text-on-surface truncate">
                Tu cotización: <strong className="text-primary">{draftQuote.guests} pers. • {draftQuote.packageType} ({totalFormatted})</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#precotizador"
                onClick={() =>
                  trackEvent("cotizar_click", "tiktok_mobile_bar_precotizador", {
                    section: "tiktok-videos",
                    experience_title: selectedVideo.title,
                  })
                }
                className="min-h-[44px] flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-primary text-on-primary font-extrabold text-[11px] uppercase tracking-wider text-center shadow-xs"
              >
                <span className="material-symbols-outlined text-sm pointer-events-none">calculate</span>
                <span className="pointer-events-none">Cotizar Montaje ↑</span>
              </a>
              <a
                href={`https://wa.me/526633670431?text=${encodeURIComponent(
                  `¡Hola Salones San Pedro Plus! Vi su video "${selectedVideo.title}" y me interesa agendar recorrido para mi ${draftQuote.eventType} de ${draftQuote.guests} personas (Paquete ${draftQuote.packageType} - ${totalFormatted}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", "tiktok_mobile_bar_wa", {
                    section: "tiktok-videos",
                    experience_title: selectedVideo.title,
                  })
                }
                className="min-h-[44px] flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-[#25D366] text-white font-extrabold text-[11px] uppercase tracking-wider text-center shadow-xs"
              >
                <span className="material-symbols-outlined text-sm pointer-events-none">chat</span>
                <span className="pointer-events-none">WhatsApp / Visita</span>
              </a>
            </div>
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
                    onClick={() => {
                      setSelectedVideo(vid);
                      trackEvent("tiktok_interaction", `select_video_${vid.id}`, {
                        section: "experiencias",
                        experience_title: vid.title,
                      });
                    }}
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
          <div className="flex flex-col sm:flex-row gap-2.5 pt-6 border-t border-outline-variant/40 mt-6">
            <a
              href="#precotizador"
              onClick={() =>
                trackEvent("cotizar_click", "tiktok_ir_precotizador", {
                  section: "tiktok-videos",
                  experience_title: selectedVideo.title,
                })
              }
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 bg-primary text-on-primary rounded-xl font-bold text-xs hover:opacity-90 transition-opacity uppercase tracking-wider shadow text-center"
            >
              <span className="material-symbols-outlined text-base pointer-events-none">calculate</span>
              <span className="pointer-events-none">Cotizar este Montaje ↑</span>
            </a>

            <a
              href={`https://wa.me/526633670431?text=${encodeURIComponent(
                `¡Hola Salones San Pedro Plus! Vi su video "${selectedVideo.title}" en el sitio web y me gustaría cotizar mi evento desde 100 personas.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("whatsapp_click", "tiktok_section_cta", {
                  section: "tiktok-videos",
                  experience_title: selectedVideo.title,
                })
              }
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 bg-[#25D366] text-white rounded-xl font-bold text-xs hover:opacity-90 transition-opacity uppercase tracking-wider shadow text-center"
            >
              <span className="material-symbols-outlined text-base pointer-events-none">chat</span>
              <span className="pointer-events-none">Disponibilidad WhatsApp</span>
            </a>

            <a
              href="https://www.tiktok.com/@salones_sanpedroplus"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("tiktok_interaction", "follow_profile_cta", {
                  section: "tiktok-videos",
                })
              }
              className="sm:w-auto flex items-center justify-center gap-1.5 py-3 px-3.5 bg-inverse-surface text-inverse-on-surface rounded-xl font-bold text-xs hover:opacity-90 transition-opacity uppercase tracking-wider shadow text-center"
            >
              <svg className="w-3.5 h-3.5 fill-current pointer-events-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.66 1 6.33 6.33 0 0 0-3 5.37 6.34 6.34 0 0 0 10.86 4.5 6.3 6.3 0 0 0 2.25-4.81V7.26a9.68 9.68 0 0 0 4.7-2.13 9.77 9.77 0 0 0 2.83-4.13V2h-3.46a4.84 4.84 0 0 1-3.42 4.69z"></path>
              </svg>
              <span className="pointer-events-none">TikTok</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

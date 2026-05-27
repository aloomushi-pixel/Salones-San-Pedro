"use client";

import { useState, useRef, useEffect } from "react";

interface VideoData {
  id: number;
  title: string;
  views: string;
  likes: string;
  comments: string;
  caption: string;
  videoUrl: string;
  coverUrl: string;
  musicName: string;
}

const TIKTOK_VIDEOS: VideoData[] = [
  {
    id: 1,
    title: "Montaje Imperial Diamante ✨",
    views: "18.4K",
    likes: "1,245",
    comments: "42",
    caption: "Un montaje de gala imperial para 150 invitados. La elegancia hecha realidad en el Salón Diamante. #BodasCDMX #EventosDeGala #DecoracionBoutique",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-decorations-on-tables-at-a-wedding-reception-42861-large.mp4",
    coverUrl: "/galeria/diamante/diamante_1.jpg",
    musicName: "Perfect - Piano & Violin Cover",
  },
  {
    id: 2,
    title: "Fiesta y Pista LED 💃",
    views: "12.2K",
    likes: "894",
    comments: "31",
    caption: "¡La pista LED encendida y la robótica a tope! Así se vive la energía en la fiesta de unos XV años en Salón Platino. #XVAños #PistaLED #PartyVibes",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-people-dancing-at-a-wedding-party-40356-large.mp4",
    coverUrl: "/galeria/platino/platino_10.jpg",
    musicName: "Don't Stop Believin' - DJ Remix",
  },
  {
    id: 3,
    title: "Experiencia Gourmet 🍽️",
    views: "5.7K",
    likes: "432",
    comments: "18",
    caption: "Nuestra selección exclusiva de banquetes de 3 y 4 tiempos listos para deleitar a tus invitados. ¡Sabor y distinción! #Gourmet #BanqueteDeBodas #ChefExecutive",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-serving-food-at-a-party-table-40353-large.mp4",
    coverUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    musicName: "Acoustic Cafe - Smooth Jazz",
  },
  {
    id: 4,
    title: "Entrada de los Novios 👰🤵",
    views: "3.1K",
    likes: "256",
    comments: "12",
    caption: "El momento más mágico: la entrada triunfal de los novios bajo las chispas estrelladas en el Salón Diamante. #LoveStory #EntradaNovios #PirotecniaFria",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wedding-guests-lighting-sparklers-40347-large.mp4",
    coverUrl: "/galeria/diamante/diamante_4.jpg",
    musicName: "A Thousand Years - Orchestral version",
  },
];

export default function TikTokVideos() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize likes count
  useEffect(() => {
    const counts: Record<number, number> = {};
    TIKTOK_VIDEOS.forEach((vid) => {
      counts[vid.id] = parseInt(vid.likes.replace(",", ""));
    });
    setLikeCounts(counts);
  }, []);

  // Handle play state on modal open
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Auto-play prevented", err));
    }
  }, [selectedVideo]);

  const handleLike = (id: number) => {
    setIsLiked((prev) => {
      const newLikedState = !prev[id];
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [id]: newLikedState ? prevCounts[id] + 1 : prevCounts[id] - 1,
      }));
      return { ...prev, [id]: newLikedState };
    });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

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

            {/* Video Column (9:16) */}
            <div className="relative w-full md:w-[45%] bg-black flex items-center justify-center aspect-[9/16] md:aspect-auto md:h-[650px] overflow-hidden">
              <video
                ref={videoRef}
                src={selectedVideo.videoUrl}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
              />

              {/* Custom Overlay Controls */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {isMuted ? "volume_off" : "volume_up"}
                  </span>
                </button>
              </div>
            </div>

            {/* Content Column */}
            <div className="w-full md:w-[55%] p-6 md:p-10 flex flex-col justify-between h-[350px] md:h-[650px] overflow-y-auto bg-surface-container-lowest">
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
                  <a
                    href="https://www.tiktok.com/@salones_sanpedroplus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Seguir
                  </a>
                </div>

                {/* Video Info */}
                <div className="space-y-4">
                  <h3 className="font-display-lg text-xl md:text-2xl font-bold text-primary">
                    {selectedVideo.title}
                  </h3>
                  <p className="font-body-md text-sm md:text-base text-secondary leading-relaxed">
                    {selectedVideo.caption}
                  </p>
                  
                  {/* Music Track */}
                  <div className="flex items-center gap-2 text-xs md:text-sm text-primary font-semibold bg-primary-container/10 p-3 rounded-lg border border-primary/10">
                    <span className="material-symbols-outlined text-base animate-spin" style={{ animationDuration: '4s' }}>music_note</span>
                    <span>Sonido original - {selectedVideo.musicName}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-6 pt-6 border-t border-outline-variant/40 mt-6">
                <div className="flex items-center gap-8 justify-around md:justify-start">
                  
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(selectedVideo.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                      isLiked[selectedVideo.id]
                        ? "bg-error/10 border-error text-error scale-110"
                        : "bg-surface border-outline-variant hover:border-error hover:text-error"
                    }`}>
                      <span className="material-symbols-outlined text-2xl font-bold fill-current">favorite</span>
                    </div>
                    <span className="font-body-md text-xs font-semibold text-secondary">
                      {likeCounts[selectedVideo.id]?.toLocaleString() || selectedVideo.likes}
                    </span>
                  </button>

                  {/* Comments Count */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-surface border border-outline-variant rounded-full flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-2xl font-bold fill-current">forum</span>
                    </div>
                    <span className="font-body-md text-xs font-semibold text-secondary">
                      {selectedVideo.comments}
                    </span>
                  </div>

                  {/* Views Count */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-surface border border-outline-variant rounded-full flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-2xl font-bold fill-current">visibility</span>
                    </div>
                    <span className="font-body-md text-xs font-semibold text-secondary">
                      {selectedVideo.views}
                    </span>
                  </div>

                </div>

                {/* View on TikTok Button */}
                <a
                  href="https://www.tiktok.com/@salones_sanpedroplus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-inverse-surface text-inverse-on-surface rounded-xl font-label-sm text-sm hover:opacity-90 transition-opacity uppercase tracking-wider shadow"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11V9.4a6.27 6.27 0 0 0-3.66 1 6.33 6.33 0 0 0-3 5.37 6.34 6.34 0 0 0 10.86 4.5 6.3 6.3 0 0 0 2.25-4.81V7.26a9.68 9.68 0 0 0 4.7-2.13 9.77 9.77 0 0 0 2.83-4.13V2h-3.46a4.84 4.84 0 0 1-3.42 4.69z"></path>
                  </svg>
                  Ver este video en TikTok
                </a>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { setMonitorCookie, trackEvent } from '@/utils/trackEvent';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/admin')) return;
    const saved = localStorage.getItem('ssp_consent');
    if (!saved) {
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ssp_consent', 'accepted');
    setMonitorCookie('ssp_consent', 'accepted', 365);
    setVisible(false);
    trackEvent('cookie_consent', 'banner_accepted');
  };

  const handleOpenPrivacy = () => {
    window.dispatchEvent(new CustomEvent('open-privacy-modal'));
    trackEvent('footer_click', 'aviso_privacidad_desde_banner');
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies y monitoreo de experiencia"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-[90] bg-neutral-950/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-neutral-200 animate-fade-in"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="flex-1 text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-white mb-1 flex items-center gap-2">
            Aviso de Cookies y Mejora de Experiencia
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              100% Privado
            </span>
          </p>
          <p className="text-neutral-400 text-xs leading-relaxed">
            Utilizamos cookies técnicas propias y herramientas en JavaScript exclusivamente para monitorear la interacción y mejorar la experiencia de usuario en nuestro sitio.{' '}
            <strong className="text-neutral-200 font-medium">
              Ningún dato personal es recolectado, distribuido ni vendido a terceros.
            </strong>
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-yellow-500 transition-all shadow-md cursor-pointer"
            >
              Entendido y continuar
            </button>
            <button
              onClick={handleOpenPrivacy}
              className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Leer Aviso de Privacidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

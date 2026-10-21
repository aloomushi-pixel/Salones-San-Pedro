'use client';

import React, { useEffect, useState } from 'react';
import { trackEvent } from '@/utils/trackEvent';

export default function LegalModals() {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    const handleOpenPrivacy = () => {
      setModalType('privacy');
    };
    window.addEventListener('open-privacy-modal', handleOpenPrivacy);
    return () => window.removeEventListener('open-privacy-modal', handleOpenPrivacy);
  }, []);

  const openModal = (type: 'privacy' | 'terms') => {
    setModalType(type);
    trackEvent('footer_click', type === 'privacy' ? 'aviso_privacidad' : 'terminos_servicio', {
      section: 'ubicacion',
    });
  };

  return (
    <>
      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => openModal('privacy')}
          className="hover:text-[#d4af37] transition-colors uppercase cursor-pointer"
        >
          Aviso de Privacidad
        </button>
        <button
          type="button"
          onClick={() => openModal('terms')}
          className="hover:text-[#d4af37] transition-colors uppercase cursor-pointer"
        >
          Términos de Servicio
        </button>
      </div>

      {modalType && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalType(null)}
        >
          <div
            className="bg-neutral-950 border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 md:p-8 text-neutral-200 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
              <h3 className="font-display-lg text-xl md:text-2xl text-amber-400 font-bold">
                {modalType === 'privacy'
                  ? 'Aviso de Privacidad y Uso de Cookies'
                  : 'Términos de Servicio y Cotizaciones'}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {modalType === 'privacy' ? (
              <div className="space-y-4 text-sm text-neutral-300 leading-relaxed text-left">
                <p>
                  En <strong>Salones San Pedro Plus</strong> (ubicado en Calle Nte 84 No. 6507, Col. San Pedro el Chico, Alcaldía Gustavo A. Madero, C.P. 07800, Ciudad de México), respetamos de manera absoluta la privacidad de nuestros visitantes.
                </p>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm">
                  <strong>Compromiso de Cero Recolección de Datos Personales:</strong> Este sitio web informativo y su herramienta de precotización rápida <strong>NO recolectan, almacenan, distribuyen, comercializan ni venden datos personales identificables</strong> (como nombres, correos electrónicos, teléfonos o datos bancarios) a ningún tercero.
                </div>
                <h4 className="font-bold text-white text-base pt-2">
                  Monitoreo de Experiencia de Usuario mediante Cookies Técnicas y JavaScript
                </h4>
                <p>
                  Con el único propósito de mejorar continuamente la claridad de nuestra información, la organización de nuestros paquetes y la experiencia de navegación, nuestro sitio utiliza <strong>cookies técnicas propias de primera parte</strong> y scripts en <strong>JavaScript</strong> que registran indicadores estadísticos y anónimos de interacción, tales como:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-400 text-xs sm:text-sm">
                  <li>Tiempo de permanencia en cada sección y profundidad de desplazamiento (scroll).</li>
                  <li>Interacción con botones, filtros de galería, tarjetas de menú y pasos del precotizador (aforo aproximado, día de la semana y temporada de interés).</li>
                  <li>Datos técnicos generales de navegación (tipo de dispositivo, navegador, horario de visita y región geográfica aproximada a nivel ciudad/alcaldía).</li>
                </ul>
                <p>
                  Toda esta información estadística es estrictamente anónima y se utiliza de forma interna para optimizar nuestro sitio web y ofrecer un mejor servicio. Cuando decides contactarnos voluntariamente vía WhatsApp o llamada telefónica, la comunicación se realiza directamente a través de dichas plataformas.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-neutral-300 leading-relaxed text-left">
                <p>
                  Bienvenido al sitio web oficial de <strong>Salones San Pedro Plus</strong>. Al consultar nuestros paquetes y utilizar nuestro Precotizador en línea, aceptas los siguientes términos informativos:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-xs sm:text-sm">
                  <li>
                    <strong>Precios y Presupuestos Estimados:</strong> Los montos generados en el Precotizador en línea constituyen una referencia informativa inicial calculada sobre nuestra tarifa base (Viernes en Salón Platino) y están sujetos a confirmación formal de acuerdo con la fecha exacta, día de la semana (Viernes, Sábado o Domingo), salón elegido (Platino o Diamante) y servicios adicionales seleccionados.
                  </li>
                  <li>
                    <strong>Aforo Mínimo por Paquete:</strong> El paquete <strong>Premier</strong> está disponible a partir de 50 personas (en Sábado sujeto a disponibilidad y condiciones de horario en Salón Platino). Los paquetes <strong>Plus</strong> y <strong>All Inclusive</strong> requieren un mínimo de 100 personas.
                  </li>
                  <li>
                    <strong>Reservación de Fechas:</strong> Ninguna cotización en línea o conversación preliminar por WhatsApp bloquea una fecha en calendario hasta la firma del contrato de prestación de servicios y el depósito del anticipo correspondiente directamente en nuestras oficinas.
                  </li>
                </ul>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

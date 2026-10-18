'use client';

import React, { useState } from 'react';
import { trackEvent } from '@/utils/trackEvent';

const PACKAGES = [
  {
    id: 'Premier',
    name: 'Premier',
    price: 530,
    minGuests: 50,
    features: ['6 horas de servicio', 'Menú a 3 tiempos', 'Barra libre de mezcladores']
  },
  {
    id: 'Plus',
    name: 'Plus',
    price: 710,
    minGuests: 100,
    features: ['7 horas de servicio', 'Batucada con Robot LED', 'Mesa de dulces']
  },
  {
    id: 'All Inclusive',
    name: 'All Inclusive',
    price: 1010,
    minGuests: 100,
    features: ['Mariachi (1 hr)', 'Cabina 360 y Video', 'Servicio de Limusina']
  }
];

const EXTRAS = [
  { id: 'mariachi', label: 'Mariachi', icon: 'music_note' },
  { id: 'robot', label: 'Robot LED / Animador', icon: 'smart_toy' },
  { id: 'cabina', label: 'Cabina Fotográfica / 360', icon: 'camera' },
  { id: 'dulces', label: 'Mesa de Dulces', icon: 'cake' },
  { id: 'letras', label: 'Letras Gigantes', icon: 'format_size' },
  { id: 'shots', label: 'Carrito de Shots', icon: 'local_bar' },
  { id: 'limusina', label: 'Servicio de Limusina', icon: 'directions_car' }
];

export default function Precotizador() {
  const [step, setStep] = useState(1);
  
  const [guests, setGuests] = useState(100);
  const [packageType, setPackageType] = useState('Premier');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const handleGuestsChange = (value: number) => {
    setGuests(value);
    if (value < 100 && packageType !== 'Premier') {
      setPackageType('Premier');
    }
  };

  const handleContinueToStep2 = () => {
    if (guests < 100 && packageType !== 'Premier') {
      setPackageType('Premier');
    }
    setStep(2);
  };

  const handleExtraToggle = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const getPackagePrice = () => {
    const pkg = PACKAGES.find(p => p.id === packageType);
    return pkg ? pkg.price : 0;
  };

  const budget = guests * getPackagePrice();

  const handleWhatsApp = () => {
    const extrasText = selectedExtras.length > 0 
      ? EXTRAS.filter(e => selectedExtras.includes(e.id)).map(e => e.label).join(', ')
      : 'Ninguno por ahora';

    const message = `¡Hola! Usé su herramienta rápida en la página y me interesa un evento para ${guests} personas con el paquete ${packageType}. Extras de interés: ${extrasText}. Mi presupuesto base aproximado arrojó $${budget.toLocaleString('es-MX')}. ¿Podrían darme más detalles?`;
    
    trackEvent('whatsapp_click', 'precotizador');
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/526633670431?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container border border-outline-variant/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Title */}
      {step !== 4 && (
        <h2 className="text-center font-display-lg text-2xl md:text-3xl font-bold text-on-surface mb-6">Precotizador de Evento</h2>
      )}

      {/* Progress Bar */}
      {step !== 4 && (
        <div className="flex gap-2 mb-8 relative z-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-outline-variant/30'}`}></div>
          ))}
        </div>
      )}

      <div className="relative z-10 h-[450px] flex flex-col overflow-y-auto custom-scrollbar pr-1 pb-1">
        {/* Step 1: Guests */}
        {step === 1 && (
          <div className="animate-fade-in flex-1 flex flex-col justify-center text-center">
            <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface mb-2">¿Cuántos invitados esperas?</h3>
            <p className="text-secondary mb-8">Desliza para seleccionar la cantidad aproximada</p>
            
            <div className="pt-4 pb-8">
              <div className="text-5xl font-bold text-primary mb-4 font-display-lg">
                {guests} <span className="text-xl text-secondary font-normal">personas</span>
              </div>

              {guests < 100 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-6">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Paquete disponible para este aforo: Premier
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-700 text-xs font-semibold rounded-full mb-6">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Todos los paquetes disponibles
                </div>
              )}

              <input 
                type="range" 
                min="50" 
                max="200" 
                step="10" 
                value={guests} 
                onChange={(e) => handleGuestsChange(Number(e.target.value))}
                className="w-full h-2 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between mt-3 text-xs text-secondary font-bold">
                <span>50 min</span>
                <span>200 max</span>
              </div>
            </div>

            <button 
              onClick={handleContinueToStep2}
              className="mt-auto w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider text-sm shadow-md"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Package */}
        {step === 2 && (
          <div className="animate-fade-in flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setStep(1)} className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h3 className="font-display-lg text-2xl text-on-surface">Nivel de Servicio</h3>
            </div>

            {guests < 100 && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">info</span>
                <span>Para tu evento de <strong>{guests} personas</strong>, el paquete disponible es <strong>Premier</strong>. Los paquetes Plus y All Inclusive están disponibles a partir de 100 personas.</span>
              </div>
            )}
            
            <div className="space-y-4 mb-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {PACKAGES.map((pkg) => {
                const isAvailable = guests >= pkg.minGuests;
                const isSelected = packageType === pkg.id;

                return (
                  <div 
                    key={pkg.id} 
                    onClick={() => {
                      if (isAvailable) {
                        setPackageType(pkg.id);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all relative ${
                      !isAvailable
                        ? 'opacity-40 bg-surface-container-low/60 border-outline-variant/20 cursor-not-allowed select-none'
                        : isSelected 
                          ? 'border-primary bg-primary/5 shadow-md cursor-pointer' 
                          : 'border-outline-variant/30 hover:border-primary/50 cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-lg ${isAvailable ? 'text-on-surface' : 'text-secondary'}`}>
                          {pkg.name}
                        </h4>
                        {!isAvailable && (
                          <span className="text-[11px] font-semibold text-secondary bg-surface-container-high px-2 py-0.5 rounded-full flex items-center gap-1 border border-outline-variant/30">
                            <span className="material-symbols-outlined text-[13px]">lock</span>
                            Mínimo 100 personas
                          </span>
                        )}
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        isAvailable 
                          ? 'text-primary bg-primary/10' 
                          : 'text-secondary bg-surface-container-high'
                      }`}>
                        desde ${pkg.price} <span className="text-xs font-normal">p/p</span>
                      </span>
                    </div>
                    <ul className="text-sm text-secondary space-y-1 mt-3">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[1rem] ${isAvailable ? 'text-primary' : 'text-secondary/50'}`}>
                            check_circle
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setStep(3)}
              className="mt-auto w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider text-sm shadow-md"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Extras */}
        {step === 3 && (
          <div className="animate-fade-in flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2">
              <button onClick={() => setStep(2)} className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h3 className="font-display-lg text-2xl text-on-surface">Servicios Extra</h3>
            </div>
            <p className="text-sm text-secondary mb-6">Selecciona los servicios adicionales que te gustaría considerar para personalizar tu evento.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {EXTRAS.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id);
                return (
                  <div 
                    key={extra.id}
                    onClick={() => handleExtraToggle(extra.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'}`}>
                      <span className="material-symbols-outlined text-lg">{extra.icon}</span>
                    </div>
                    <span className={`text-sm font-medium flex-1 ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{extra.label}</span>
                    {isSelected && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                  </div>
                )
              })}
            </div>

            <button 
              onClick={() => setStep(4)}
              className="mt-auto w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Calcular Presupuesto</span>
              <span className="material-symbols-outlined text-lg">calculate</span>
            </button>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <div className="animate-fade-in flex-1 flex flex-col justify-center text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shadow-inner border border-green-500/20">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
            </div>
            
            <h3 className="font-display-lg text-2xl text-on-surface mb-6">¡Presupuesto Generado!</h3>
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-inner mb-6">
              <p className="text-sm text-secondary mb-2 uppercase tracking-widest font-bold">Inversión Base Estimada</p>
              <div className="font-display-lg text-4xl md:text-5xl text-primary font-bold mb-4">
                ${budget.toLocaleString('es-MX')} <span className="text-lg font-normal text-secondary">MXN</span>
              </div>
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm text-secondary mb-4">
                <span className="font-semibold bg-surface-container-high px-2 py-1 rounded-md">{guests} invitados</span>
                <span className="font-semibold bg-surface-container-high px-2 py-1 rounded-md">Paquete {packageType}</span>
              </div>
              <p className="text-xs text-secondary/80 leading-relaxed bg-primary/5 p-3 rounded-lg text-left">
                * Este es un presupuesto aproximado inicial. Necesitas solicitar una cotización formal para conocer el precio exacto de acuerdo a la fecha de tu evento y el costo de los servicios extraordinarios que hayas seleccionado.
              </p>
            </div>

            <button 
              onClick={handleWhatsApp}
              className="mt-4 w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1EBE5D] active:scale-95 transition-all uppercase tracking-wider text-sm shadow-lg flex items-center justify-center gap-2 flex-shrink-0"
            >
              <span className="material-symbols-outlined text-xl">forum</span>
              <span>Solicitar Cotización por WhatsApp</span>
            </button>
            
            <button onClick={() => setStep(1)} className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest mt-6 mb-4 flex-shrink-0">
              Volver a calcular
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

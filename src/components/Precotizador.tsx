'use client';

import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/utils/trackEvent';

const PACKAGES = [
  {
    id: 'Premier',
    name: 'Premier',
    price: 530,
    minGuests: 50,
    features: ['6 horas de servicio', 'Menú a 3 tiempos', 'Barra libre de mezcladores'],
  },
  {
    id: 'Plus',
    name: 'Plus',
    price: 710,
    minGuests: 100,
    features: ['7 horas de servicio', 'Batucada con Robot LED', 'Mesa de dulces'],
  },
  {
    id: 'All Inclusive',
    name: 'All Inclusive',
    price: 1010,
    minGuests: 100,
    features: ['Mariachi (1 hr)', 'Cabina 360 y Video', 'Servicio de Limusina'],
  },
];

const PREFERRED_DAYS = [
  { id: 'Sábado', label: 'Sábado', badge: 'Alta Demanda' },
  { id: 'Viernes', label: 'Viernes', badge: 'Tarifa Preferencial' },
  { id: 'Domingo', label: 'Domingo', badge: 'Familiar' },
  { id: 'Entre Semana', label: 'Lun – Jue', badge: 'Especial' },
];

const SEASONS = [
  { id: 'Próximos 1-3 meses', label: 'Próximos 1–3 meses' },
  { id: 'Primavera / Graduaciones (Abr-Jun)', label: 'Abr–Jun (Primavera)' },
  { id: 'Verano (Jul-Sep)', label: 'Jul–Sep (Verano)' },
  { id: 'Temporada Alta / Fin de Año (Oct-Dic)', label: 'Oct–Dic (Fin de Año)' },
  { id: 'Invierno (Ene-Mar)', label: 'Ene–Mar (Invierno)' },
  { id: '2027 / Planeación Anticipada', label: '2027 / Anticipado' },
];

const EVENT_KINDS = [
  { id: 'XV Años', label: 'XV Años' },
  { id: 'Boda', label: 'Boda' },
  { id: 'Graduación', label: 'Graduación' },
  { id: 'Bautizo / Cumpleaños', label: 'Social / Cumpleaños' },
  { id: 'Empresarial', label: 'Empresarial' },
];

const EXTRAS = [
  { id: 'mariachi', label: 'Mariachi', icon: 'music_note' },
  { id: 'robot', label: 'Robot LED / Animador', icon: 'smart_toy' },
  { id: 'cabina', label: 'Cabina Fotográfica / 360', icon: 'camera' },
  { id: 'dulces', label: 'Mesa de Dulces', icon: 'cake' },
  { id: 'letras', label: 'Letras Gigantes', icon: 'format_size' },
  { id: 'shots', label: 'Carrito de Shots', icon: 'local_bar' },
  { id: 'limusina', label: 'Servicio de Limusina', icon: 'directions_car' },
];

export default function Precotizador() {
  const [step, setStep] = useState(1);

  const [guests, setGuests] = useState(100);
  const [preferredDay, setPreferredDay] = useState('Sábado');
  const [preferredSeason, setPreferredSeason] = useState('Temporada Alta / Fin de Año (Oct-Dic)');
  const [packageType, setPackageType] = useState('Premier');
  const [eventKind, setEventKind] = useState('XV Años');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [lockedAttemptPkg, setLockedAttemptPkg] = useState<string | null>(null);

  const stepStartRef = useRef<number>(Date.now());
  const wizardStartRef = useRef<number>(Date.now());

  useEffect(() => {
    stepStartRef.current = Date.now();
  }, [step]);

  const getGuestsBucket = (val: number) => {
    if (val < 100) return '50 a 99 personas';
    if (val < 150) return '100 a 149 personas';
    if (val < 200) return '150 a 199 personas';
    return '200+ personas';
  };

  const handleGuestsChange = (value: number) => {
    setGuests(value);
    setLockedAttemptPkg(null);
    if (value < 100 && packageType !== 'Premier') {
      setPackageType('Premier');
    }
  };

  const handleContinueToStep2 = () => {
    const duration = Date.now() - stepStartRef.current;
    if (guests < 100 && packageType !== 'Premier') {
      setPackageType('Premier');
    }
    trackEvent('precotizador_step', 'step_1_completado', {
      section: 'precotizador',
      step_number: 1,
      guests_range: getGuestsBucket(guests),
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      timers: { step_duration_ms: duration },
      extra: { exact_guests: guests },
    });
    setStep(2);
  };

  const handleContinueToStep3 = () => {
    const duration = Date.now() - stepStartRef.current;
    trackEvent('precotizador_step', 'step_2_completado', {
      section: 'precotizador',
      step_number: 2,
      guests_range: getGuestsBucket(guests),
      package_name: packageType,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      timers: { step_duration_ms: duration },
      extra: { exact_guests: guests },
    });
    setStep(3);
  };

  const handleContinueToStep4 = () => {
    const duration = Date.now() - stepStartRef.current;
    trackEvent('precotizador_step', 'step_3_completado', {
      section: 'precotizador',
      step_number: 3,
      guests_range: getGuestsBucket(guests),
      package_name: packageType,
      event_kind: eventKind,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      timers: { step_duration_ms: duration },
      extra: {
        exact_guests: guests,
        extras: selectedExtras,
      },
    });
    setStep(4);
  };

  const handleBackStep = (targetStep: number) => {
    const duration = Date.now() - stepStartRef.current;
    trackEvent('precotizador_backtrack', `back_from_${step}_to_${targetStep}`, {
      section: 'precotizador',
      step_number: step,
      guests_range: getGuestsBucket(guests),
      package_name: packageType,
      preferred_day: preferredDay,
      timers: { step_duration_ms: duration },
    });
    setStep(targetStep);
  };

  const handleLockedPackageClick = (pkgName: string) => {
    setLockedAttemptPkg(pkgName);
    trackEvent('locked_package_click', `locked_${pkgName.toLowerCase().replace(/\s+/g, '_')}`, {
      section: 'precotizador',
      guests_range: getGuestsBucket(guests),
      locked_package_attempted: pkgName,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      extra: { exact_guests: guests },
    });
  };

  const handleUpsellTo100 = (pkgName: string) => {
    setGuests(100);
    setPackageType(pkgName);
    setLockedAttemptPkg(null);
    trackEvent('precotizador_step', 'upsell_a_100_invitados', {
      section: 'precotizador',
      guests_range: '100 a 149 personas',
      package_name: pkgName,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
    });
  };

  const handleExtraToggle = (id: string) => {
    const extraObj = EXTRAS.find((e) => e.id === id);
    const willSelect = !selectedExtras.includes(id);
    if (willSelect && extraObj) {
      trackEvent('extra_service_interest', `extra_${id}`, {
        section: 'precotizador',
        element_text: extraObj.label,
        guests_range: getGuestsBucket(guests),
        package_name: packageType,
      });
    }
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const getPackagePrice = () => {
    const pkg = PACKAGES.find((p) => p.id === packageType);
    return pkg ? pkg.price : 0;
  };

  const budget = guests * getPackagePrice();

  const handleWhatsApp = () => {
    const extrasText =
      selectedExtras.length > 0
        ? EXTRAS.filter((e) => selectedExtras.includes(e.id))
            .map((e) => e.label)
            .join(', ')
        : 'Ninguno por ahora';

    const totalWizardMs = Date.now() - wizardStartRef.current;

    const message = `¡Hola! Usé el Precotizador en su página web:\n• Tipo de evento: ${eventKind}\n• Invitados: ${guests} personas\n• Día de interés: ${preferredDay}\n• Temporada tentativa: ${preferredSeason}\n• Paquete: ${packageType}\n• Extras de interés: ${extrasText}\n• Presupuesto base estimado: $${budget.toLocaleString('es-MX')} MXN\n¿Podrían confirmarme disponibilidad y cotización exacta?`;

    trackEvent('whatsapp_click', 'precotizador', {
      section: 'precotizador',
      step_number: 4,
      guests_range: getGuestsBucket(guests),
      package_name: packageType,
      event_kind: eventKind,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      timers: {
        step_duration_ms: totalWizardMs,
      },
      extra: {
        exact_guests: guests,
        estimated_budget: budget,
        extras: selectedExtras,
      },
    });

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/526633670431?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container border border-outline-variant/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Title */}
      {step !== 4 && (
        <h2 className="text-center font-display-lg text-2xl md:text-3xl font-bold text-on-surface mb-4">
          Precotizador de Evento
        </h2>
      )}

      {/* Progress Bar */}
      {step !== 4 && (
        <div className="flex gap-2 mb-6 relative z-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-primary' : 'bg-outline-variant/30'
              }`}
            ></div>
          ))}
        </div>
      )}

      <div className="relative z-10 h-[480px] flex flex-col overflow-y-auto custom-scrollbar pr-1 pb-1">
        {/* Step 1: Guests + Day + Season */}
        {step === 1 && (
          <div className="animate-fade-in flex-1 flex flex-col justify-between text-center">
            <div>
              <h3 className="font-display-lg text-xl md:text-2xl text-on-surface mb-1">
                1. Aforo, Día y Temporada
              </h3>
              <p className="text-xs md:text-sm text-secondary mb-4">
                Desliza el número de invitados y elige cuándo planeas tu evento
              </p>

              <div className="py-2">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-display-lg">
                  {guests} <span className="text-lg text-secondary font-normal">personas</span>
                </div>

                {guests < 100 ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Paquete disponible para 50–99 personas: Premier
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-700 text-xs font-semibold rounded-full mb-3">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Todos los paquetes desbloqueados (Premier, Plus y All Inclusive)
                  </div>
                )}

                <input
                  type="range"
                  min="50"
                  max="250"
                  step="10"
                  value={guests}
                  onChange={(e) => handleGuestsChange(Number(e.target.value))}
                  onMouseUp={() =>
                    trackEvent('guests_slider_adjust', `aforo_${guests}`, {
                      section: 'precotizador',
                      guests_range: getGuestsBucket(guests),
                      extra: { exact_guests: guests },
                    })
                  }
                  onTouchEnd={() =>
                    trackEvent('guests_slider_adjust', `aforo_${guests}`, {
                      section: 'precotizador',
                      guests_range: getGuestsBucket(guests),
                      extra: { exact_guests: guests },
                    })
                  }
                  className="w-full h-2 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-1.5 text-[11px] text-secondary font-bold">
                  <span>50 mín</span>
                  <span>100 (Todos los paquetes)</span>
                  <span>250+ máx</span>
                </div>
              </div>

              {/* Selección de Día Preferido */}
              <div className="mt-4 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                  Día de la semana preferido:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PREFERRED_DAYS.map((d) => {
                    const active = preferredDay === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setPreferredDay(d.id)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          active
                            ? 'border-primary bg-primary/15 text-primary font-bold shadow-sm'
                            : 'border-outline-variant/30 text-on-surface hover:border-primary/40'
                        }`}
                      >
                        <div className="text-xs font-bold">{d.label}</div>
                        <div className="text-[10px] text-secondary">{d.badge}</div>
                      </button>
                    );
                  })}
                </div>

                {guests < 100 && preferredDay === 'Sábado' && (
                  <p className="mt-2 text-[11px] text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5">
                    Nota: Para eventos de 50 a 99 personas en <strong>Sábado</strong> aplica Paquete Premier en Salón Platino (sujeto a horarios y disponibilidad). En Viernes obtienes tarifa preferencial.
                  </p>
                )}
              </div>

              {/* Selección de Temporada / Mes */}
              <div className="mt-4 text-left mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                  Temporada o fecha aproximada:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SEASONS.map((s) => {
                    const active = preferredSeason === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setPreferredSeason(s.id)}
                        className={`px-2.5 py-2 rounded-xl border text-xs transition-all cursor-pointer truncate ${
                          active
                            ? 'border-primary bg-primary/15 text-primary font-bold shadow-sm'
                            : 'border-outline-variant/30 text-on-surface hover:border-primary/40'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleContinueToStep2}
              className="mt-auto w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider text-sm shadow-md cursor-pointer"
            >
              Continuar a Paquetes
            </button>
          </div>
        )}

        {/* Step 2: Package */}
        {step === 2 && (
          <div className="animate-fade-in flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => handleBackStep(1)}
                className="text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h3 className="font-display-lg text-2xl text-on-surface">2. Nivel de Servicio</h3>
            </div>

            {guests < 100 && (
              <div className="mb-3 p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary flex items-start gap-2">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">info</span>
                <span>
                  Para tu evento de <strong>{guests} personas</strong> ({preferredDay}), el paquete disponible es{' '}
                  <strong>Premier</strong>. Los paquetes Plus y All Inclusive requieren mínimo 100 personas.
                </span>
              </div>
            )}

            {lockedAttemptPkg && guests < 100 && (
              <div className="mb-3 p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
                <span>
                  ¿Te interesa el paquete <strong>{lockedAttemptPkg}</strong>? Está disponible a partir de 100 invitados.
                </span>
                <button
                  type="button"
                  onClick={() => handleUpsellTo100(lockedAttemptPkg)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs shrink-0 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Cotizar con 100 personas
                </button>
              </div>
            )}

            <div className="space-y-3 mb-4 overflow-y-auto max-h-[290px] pr-2 custom-scrollbar">
              {PACKAGES.map((pkg) => {
                const isAvailable = guests >= pkg.minGuests;
                const isSelected = packageType === pkg.id;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      if (isAvailable) {
                        setPackageType(pkg.id);
                        setLockedAttemptPkg(null);
                      } else {
                        handleLockedPackageClick(pkg.name);
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all relative ${
                      !isAvailable
                        ? 'opacity-50 bg-surface-container-low/60 border-outline-variant/20 cursor-pointer select-none hover:border-amber-500/40'
                        : isSelected
                        ? 'border-primary bg-primary/5 shadow-md cursor-pointer'
                        : 'border-outline-variant/30 hover:border-primary/50 cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
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
                      <span
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          isAvailable ? 'text-primary bg-primary/10' : 'text-secondary bg-surface-container-high'
                        }`}
                      >
                        desde ${pkg.price} <span className="text-xs font-normal">p/p</span>
                      </span>
                    </div>
                    <ul className="text-sm text-secondary space-y-1 mt-2">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-[1rem] ${
                              isAvailable ? 'text-primary' : 'text-secondary/50'
                            }`}
                          >
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
              onClick={handleContinueToStep3}
              className="mt-auto w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider text-sm shadow-md cursor-pointer"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Event Kind + Extras */}
        {step === 3 && (
          <div className="animate-fade-in flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => handleBackStep(2)}
                  className="text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h3 className="font-display-lg text-xl md:text-2xl text-on-surface">
                  3. Giro del Evento y Extras
                </h3>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                  ¿Qué tipo de celebración realizas?
                </label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_KINDS.map((ev) => {
                    const active = eventKind === ev.id;
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => setEventKind(ev.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          active
                            ? 'border-primary bg-primary text-on-primary font-bold shadow-sm'
                            : 'border-outline-variant/30 text-on-surface hover:border-primary/40'
                        }`}
                      >
                        {ev.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-secondary mb-2 font-semibold uppercase tracking-wider">
                Servicios adicionales opcionales:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {EXTRAS.map((extra) => {
                  const isSelected = selectedExtras.includes(extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => handleExtraToggle(extra.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-outline-variant/30 hover:border-primary/50'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-high text-secondary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{extra.icon}</span>
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium flex-1 ${
                          isSelected ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {extra.label}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-sm">
                          check_circle
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleContinueToStep4}
              className="mt-auto w-full bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Calcular Presupuesto</span>
              <span className="material-symbols-outlined text-lg">calculate</span>
            </button>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <div className="animate-fade-in flex-1 flex flex-col justify-center text-center">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shadow-inner border border-green-500/20">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
            </div>

            <h3 className="font-display-lg text-2xl text-on-surface mb-4">¡Presupuesto Generado!</h3>

            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-inner mb-4">
              <p className="text-xs text-secondary mb-1 uppercase tracking-widest font-bold">
                Inversión Base Estimada (Tarifa Viernes Platino)
              </p>
              <div className="font-display-lg text-4xl md:text-5xl text-primary font-bold mb-3">
                ${budget.toLocaleString('es-MX')}{' '}
                <span className="text-lg font-normal text-secondary">MXN</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 text-xs text-secondary mb-3">
                <span className="font-semibold bg-surface-container-high px-2.5 py-1 rounded-md">
                  {eventKind}
                </span>
                <span className="font-semibold bg-surface-container-high px-2.5 py-1 rounded-md">
                  {guests} invitados
                </span>
                <span className="font-semibold bg-surface-container-high px-2.5 py-1 rounded-md">
                  Paquete {packageType}
                </span>
                <span className="font-semibold bg-surface-container-high px-2.5 py-1 rounded-md">
                  Día: {preferredDay}
                </span>
                <span className="font-semibold bg-surface-container-high px-2.5 py-1 rounded-md">
                  {preferredSeason}
                </span>
              </div>
              <p className="text-xs text-secondary/80 leading-relaxed bg-primary/5 p-3 rounded-lg text-left">
                * Este presupuesto base está calculado sobre tarifa inicial Viernes en Salón Platino. Solicita tu cotización formal por WhatsApp para confirmar disponibilidad exacta en <strong>{preferredDay}</strong> ({preferredSeason}) y costos de servicios extra.
              </p>
            </div>

            <button
              onClick={handleWhatsApp}
              className="mt-2 w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1EBE5D] active:scale-95 transition-all uppercase tracking-wider text-sm shadow-lg flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">forum</span>
              <span>Solicitar Cotización por WhatsApp</span>
            </button>

            <button
              onClick={() => handleBackStep(1)}
              className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest mt-4 mb-2 flex-shrink-0 cursor-pointer"
            >
              Volver a calcular
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

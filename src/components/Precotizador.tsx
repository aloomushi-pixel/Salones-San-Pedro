'use client';

import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/utils/trackEvent';

const PACKAGES = [
  {
    id: 'Premier',
    name: 'Premier',
    price: 530,
    minGuests: 50,
    badge: 'Desde 50 pers.',
    features: ['6 hrs servicio', 'Menú 3 tiempos', 'Barra mezcladores', 'DJ y luces'],
  },
  {
    id: 'Plus',
    name: 'Plus',
    price: 710,
    minGuests: 100,
    badge: '⭐ El Más Elegido',
    features: ['7 hrs servicio', 'Menú 4 tiempos', 'Robot LED + Batucada', 'Mesa dulces y Cabina'],
  },
  {
    id: 'All Inclusive',
    name: 'All Inclusive',
    price: 1010,
    minGuests: 100,
    badge: 'Todo Incluido',
    features: ['Mariachi (1 hr)', 'Limusina', 'Cabina 360 + Video', 'Botella por mesa'],
  },
];

const QUICK_GUEST_PRESETS = [50, 80, 100, 120, 150, 200, 250];

const PREFERRED_DAYS = [
  { id: 'Sábado', label: 'Sábado', badge: 'Alta Demanda', icon: 'calendar_month' },
  { id: 'Viernes', label: 'Viernes', badge: 'Tarifa Preferencial', icon: 'sell' },
  { id: 'Domingo', label: 'Domingo', badge: 'Ambiente Familiar', icon: 'wb_sunny' },
  { id: 'Entre Semana', label: 'Lunes a Jueves', badge: 'Tarifa Especial', icon: 'event_available' },
];

const SEASONS = [
  { id: 'Próximos 1-3 meses', label: 'Próximos 1–3 meses' },
  { id: 'Primavera / Graduaciones (Abr-Jun)', label: 'Abr – Jun (Primavera)' },
  { id: 'Verano (Jul-Sep)', label: 'Jul – Sep (Verano)' },
  { id: 'Temporada Alta / Fin de Año (Oct-Dic)', label: 'Oct – Dic (Fin de Año)' },
  { id: 'Invierno (Ene-Mar)', label: 'Ene – Mar (Invierno)' },
  { id: '2027 / Planeación Anticipada', label: 'Año 2027 / Anticipado' },
];

const EVENT_KINDS = [
  { id: 'XV Años', label: 'XV Años', icon: 'auto_awesome' },
  { id: 'Boda', label: 'Boda', icon: 'favorite' },
  { id: 'Graduación', label: 'Graduación', icon: 'school' },
  { id: 'Bautizo / Cumpleaños', label: 'Social / Cumple', icon: 'cake' },
  { id: 'Empresarial', label: 'Empresarial', icon: 'business_center' },
];

const EXTRAS = [
  { id: 'mariachi', label: 'Mariachi', icon: 'music_note' },
  { id: 'robot', label: 'Robot LED', icon: 'smart_toy' },
  { id: 'cabina', label: 'Cabina 360', icon: 'camera' },
  { id: 'dulces', label: 'Mesa de Dulces', icon: 'icecream' },
  { id: 'letras', label: 'Letras Gigantes', icon: 'format_size' },
  { id: 'shots', label: 'Carrito de Shots', icon: 'local_bar' },
  { id: 'limusina', label: 'Limusina', icon: 'directions_car' },
];

const STEP_LABELS = [
  { num: 1, label: 'Aforo' },
  { num: 2, label: 'Fecha' },
  { num: 3, label: 'Paquete' },
  { num: 4, label: 'Cotización' },
];

export default function Precotizador() {
  const [step, setStep] = useState(1);

  const [guests, setGuests] = useState(100);
  const [eventKind, setEventKind] = useState('XV Años');
  const [preferredDay, setPreferredDay] = useState('Sábado');
  const [preferredSeason, setPreferredSeason] = useState('Temporada Alta / Fin de Año (Oct-Dic)');
  const [packageType, setPackageType] = useState('Plus');
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

  const handleGuestsChange = (value: number, recordTelemetry = false) => {
    const clamped = Math.min(250, Math.max(50, value));
    setGuests(clamped);
    setLockedAttemptPkg(null);
    if (clamped < 100 && packageType !== 'Premier') {
      setPackageType('Premier');
    }
    if (recordTelemetry) {
      trackEvent('guests_slider_adjust', `aforo_${clamped}`, {
        section: 'precotizador',
        guests_range: getGuestsBucket(clamped),
        extra: { exact_guests: clamped },
      });
    }
  };

  const handleStep1Next = () => {
    const duration = Date.now() - stepStartRef.current;
    if (guests < 100 && packageType !== 'Premier') {
      setPackageType('Premier');
    }
    trackEvent('precotizador_step', 'step_1_completado', {
      section: 'precotizador',
      step_number: 1,
      guests_range: getGuestsBucket(guests),
      event_kind: eventKind,
      timers: { step_duration_ms: duration },
      extra: { exact_guests: guests },
    });
    setStep(2);
  };

  const handleStep2Next = () => {
    const duration = Date.now() - stepStartRef.current;
    trackEvent('precotizador_step', 'step_2_completado', {
      section: 'precotizador',
      step_number: 2,
      guests_range: getGuestsBucket(guests),
      event_kind: eventKind,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      timers: { step_duration_ms: duration },
      extra: { exact_guests: guests },
    });
    setStep(3);
  };

  const handleStep3Next = () => {
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
    if (targetStep === step) return;
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
    <div className="w-full max-w-xl mx-auto bg-surface-container border border-outline-variant/40 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Resplandor decorativo */}
      <div className="absolute -top-28 -right-28 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Encabezado Compacto + Stepper Táctil Interactivo */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
              Cotización Instantánea en 30 Segundos
            </span>
            <h2 className="font-display-lg text-lg sm:text-2xl font-bold text-on-surface leading-tight">
              Precotizador de Evento
            </h2>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-secondary border border-outline-variant/30">
            Paso {step} de 4
          </span>
        </div>

        {/* Barra de pasos con etiquetas táctiles */}
        <div className="grid grid-cols-4 gap-1.5">
          {STEP_LABELS.map((item) => {
            const isCompleted = item.num < step;
            const isCurrent = item.num === step;
            return (
              <button
                key={item.num}
                type="button"
                disabled={item.num > step}
                onClick={() => {
                  if (item.num < step) handleBackStep(item.num);
                }}
                className={`flex flex-col items-center py-1.5 px-1 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary/15 text-primary font-bold shadow-xs'
                    : isCompleted
                    ? 'border-primary/40 bg-primary/5 text-on-surface cursor-pointer hover:bg-primary/10'
                    : 'border-outline-variant/20 bg-surface-container-low/40 text-secondary/50 cursor-default'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px]">
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isCurrent
                        ? 'bg-primary text-on-primary'
                        : isCompleted
                        ? 'bg-primary/80 text-on-primary'
                        : 'bg-outline-variant/30 text-secondary'
                    }`}
                  >
                    {isCompleted ? '✓' : item.num}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cuerpo del Paso Actual (Sin Doble Scroll, 100% Fluido en Móvil) */}
      <div className="relative z-10 flex flex-col justify-between">
        {/* =================================================================
            PASO 1: NÚMERO DE INVITADOS + TIPO DE EVENTO
        ================================================================= */}
        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            {/* Control de Invitados */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 text-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                1. ¿Cuántos invitados esperas?
              </label>

              {/* Botones grandes [-10] Número [+10] para el pulgar */}
              <div className="flex items-center justify-between max-w-xs mx-auto gap-3 my-2">
                <button
                  type="button"
                  onClick={() => handleGuestsChange(guests - 10, true)}
                  disabled={guests <= 50}
                  aria-label="Restar 10 invitados"
                  className="w-12 h-12 rounded-2xl bg-surface-container-high hover:bg-primary hover:text-on-primary active:scale-95 disabled:opacity-30 font-bold text-lg flex items-center justify-center transition-all border border-outline-variant/40 cursor-pointer shrink-0"
                >
                  −10
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl font-bold text-primary font-display-lg leading-none">
                    {guests}
                  </span>
                  <span className="text-xs text-secondary font-medium mt-1">
                    personas
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleGuestsChange(guests + 10, true)}
                  disabled={guests >= 250}
                  aria-label="Sumar 10 invitados"
                  className="w-12 h-12 rounded-2xl bg-surface-container-high hover:bg-primary hover:text-on-primary active:scale-95 disabled:opacity-30 font-bold text-lg flex items-center justify-center transition-all border border-outline-variant/40 cursor-pointer shrink-0"
                >
                  +10
                </button>
              </div>

              {/* Chips de selección rápida en 1 toque */}
              <div className="flex flex-wrap justify-center gap-1.5 my-3">
                {QUICK_GUEST_PRESETS.map((preset) => {
                  const isActive = guests === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleGuestsChange(preset, true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-primary text-on-primary border-primary shadow-xs scale-105'
                          : 'bg-surface-container-high/70 text-on-surface border-outline-variant/30 hover:border-primary/50'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>

              {/* Slider táctil grueso */}
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={guests}
                onChange={(e) => handleGuestsChange(Number(e.target.value), false)}
                onMouseUp={() => handleGuestsChange(guests, true)}
                onTouchEnd={() => handleGuestsChange(guests, true)}
                className="w-full h-2.5 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary mt-1"
              />

              {/* Aviso dinámico de paquetes según aforo */}
              <div className="mt-2.5">
                {guests < 100 ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-[11px] font-semibold rounded-full">
                    <span className="material-symbols-outlined text-xs">info</span>
                    50 a 99 personas: Aplica Paquete Premier (desde $530 p/p)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 text-[11px] font-semibold rounded-full">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    100+ personas: Todos los paquetes disponibles (Premier, Plus y All Inclusive)
                  </span>
                )}
              </div>
            </div>

            {/* Giro del Evento */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2.5 text-center sm:text-left">
                2. ¿Qué tipo de evento celebras?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {EVENT_KINDS.map((ev) => {
                  const active = eventKind === ev.id;
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setEventKind(ev.id)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                        active
                          ? 'border-primary bg-primary text-on-primary shadow-sm'
                          : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">{ev.icon}</span>
                      <span>{ev.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón Fijo de Avance */}
            <button
              type="button"
              onClick={handleStep1Next}
              className="w-full min-h-[50px] bg-primary text-on-primary font-bold py-3.5 px-6 rounded-2xl hover:opacity-95 active:scale-[0.99] transition-all uppercase tracking-wider text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Siguiente: Elegir Día y Temporada</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        )}

        {/* =================================================================
            PASO 2: DÍA DE LA SEMANA + TEMPORADA TENTATIVA
        ================================================================= */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            {/* Selección de Día */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2.5">
                ¿Qué día de la semana prefieres?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {PREFERRED_DAYS.map((d) => {
                  const active = preferredDay === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setPreferredDay(d.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 min-h-[54px] ${
                        active
                          ? 'border-primary bg-primary/15 text-primary shadow-xs'
                          : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl text-primary shrink-0">
                        {d.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold leading-tight">{d.label}</div>
                        <div className="text-[10px] text-secondary leading-tight mt-0.5">
                          {d.badge}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {guests < 100 && preferredDay === 'Sábado' && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-400 leading-snug">
                  <strong>Nota Sábado (50–99 pers.):</strong> Aplica Paquete Premier en Salón Platino sujeto a disponibilidad y horarios. En <strong>Viernes</strong> obtienes tarifa preferencial.
                </div>
              )}
            </div>

            {/* Selección de Temporada */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2.5">
                ¿En qué temporada o fecha aproximada planeas tu evento?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SEASONS.map((s) => {
                  const active = preferredSeason === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPreferredSeason(s.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                        active
                          ? 'border-primary bg-primary text-on-primary font-bold shadow-xs'
                          : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary/40'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navegación Inferior Fija */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleBackStep(1)}
                className="px-4 min-h-[50px] rounded-2xl border border-outline-variant/40 text-secondary hover:text-on-surface font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Atrás</span>
              </button>
              <button
                type="button"
                onClick={handleStep2Next}
                className="flex-1 min-h-[50px] bg-primary text-on-primary font-bold py-3.5 px-5 rounded-2xl hover:opacity-95 active:scale-[0.99] transition-all uppercase tracking-wider text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Siguiente: Elegir Paquete</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            PASO 3: PAQUETE (COMPACTO SIN SCROLL) + EXTRAS EN CHIPS
        ================================================================= */}
        {step === 3 && (
          <div className="animate-fade-in space-y-3.5">
            {/* Banner de desbloqueo en 1 toque si intentan tocar Plus o All Inclusive con <100 invitados */}
            {lockedAttemptPkg && guests < 100 && (
              <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-2xl text-xs text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
                <span>
                  El paquete <strong>{lockedAttemptPkg}</strong> aplica desde 100 invitados (tienes {guests}).
                </span>
                <button
                  type="button"
                  onClick={() => handleUpsellTo100(lockedAttemptPkg)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-neutral-950 font-extrabold text-xs shrink-0 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Cambiar a 100 personas y elegir {lockedAttemptPkg}
                </button>
              </div>
            )}

            {/* Tarjetas de Paquetes Compactas (Caben las 3 en pantalla móvil) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary">
                1. Selecciona tu Nivel de Paquete:
              </label>
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
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      !isAvailable
                        ? 'opacity-55 bg-surface-container-low/50 border-outline-variant/20 hover:border-amber-500/40'
                        : isSelected
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected && isAvailable
                              ? 'border-primary bg-primary text-on-primary'
                              : 'border-outline-variant'
                          }`}
                        >
                          {isSelected && isAvailable && (
                            <span className="material-symbols-outlined text-xs font-bold">
                              check
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-base text-on-surface truncate">
                          {pkg.name}
                        </span>
                        {!isAvailable ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                            🔒 Mín. 100 pers.
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-secondary bg-surface-container-high px-2 py-0.5 rounded-full shrink-0">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
                        desde ${pkg.price} p/p
                      </span>
                    </div>

                    {/* Pills horizontales compactos con lo que incluye */}
                    <div className="flex flex-wrap gap-1.5 mt-2 pl-7">
                      {pkg.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] text-secondary bg-surface-container-high/60 px-2 py-0.5 rounded-md"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selección de Extras en Chips Compactos de 2/3 Columnas */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary mb-2">
                2. Servicios Extra Opcionales (Toca para agregar):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {EXTRAS.map((extra) => {
                  const isSelected = selectedExtras.includes(extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => handleExtraToggle(extra.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-left text-xs transition-all cursor-pointer min-h-[40px] ${
                        isSelected
                          ? 'border-primary bg-primary/15 text-primary font-bold'
                          : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm shrink-0">
                        {isSelected ? 'check_circle' : extra.icon}
                      </span>
                      <span className="truncate">{extra.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navegación Inferior Fija */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleBackStep(2)}
                className="px-4 min-h-[50px] rounded-2xl border border-outline-variant/40 text-secondary hover:text-on-surface font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Atrás</span>
              </button>
              <button
                type="button"
                onClick={handleStep3Next}
                className="flex-1 min-h-[50px] bg-primary text-on-primary font-bold py-3.5 px-5 rounded-2xl hover:opacity-95 active:scale-[0.99] transition-all uppercase tracking-wider text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">calculate</span>
                <span>Ver Presupuesto Estimado</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            PASO 4: RESULTADO FINAL Y CONVERSIÓN A WHATSAPP
        ================================================================= */}
        {step === 4 && (
          <div className="animate-fade-in space-y-4 text-center">
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-inner">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-sm">verified</span>
                Presupuesto Base Estimado
              </div>

              <div className="font-display-lg text-4xl sm:text-5xl text-primary font-bold my-2">
                ${budget.toLocaleString('es-MX')}{' '}
                <span className="text-base font-normal text-secondary">MXN</span>
              </div>

              <p className="text-[11px] text-secondary mb-3">
                Calculado sobre tarifa inicial Viernes en Salón Platino
              </p>

              {/* Resumen claro de selecciones */}
              <div className="flex flex-wrap justify-center gap-1.5 text-xs text-on-surface mb-3">
                <span className="font-bold bg-surface-container-high px-2.5 py-1 rounded-lg">
                  {eventKind}
                </span>
                <span className="font-bold bg-surface-container-high px-2.5 py-1 rounded-lg">
                  {guests} invitados
                </span>
                <span className="font-bold bg-primary/15 text-primary px-2.5 py-1 rounded-lg">
                  Paquete {packageType}
                </span>
                <span className="font-semibold bg-surface-container-high px-2.5 py-1 rounded-lg">
                  Día: {preferredDay}
                </span>
                <span className="font-semibold bg-surface-container-high px-2.5 py-1 rounded-lg">
                  {preferredSeason}
                </span>
              </div>

              {selectedExtras.length > 0 && (
                <p className="text-xs text-primary font-medium mb-3">
                  + Extras de interés:{' '}
                  {EXTRAS.filter((e) => selectedExtras.includes(e.id))
                    .map((e) => e.label)
                    .join(', ')}
                </p>
              )}

              <p className="text-[11px] text-secondary/80 leading-relaxed bg-primary/5 p-3 rounded-xl text-left">
                * Envía este resumen por WhatsApp con un solo toque para que un coordinador te confirme disponibilidad exacta en <strong>{preferredDay}</strong> ({preferredSeason}) y promociones vigentes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full min-h-[54px] bg-[#25D366] text-white font-bold py-4 px-6 rounded-2xl hover:bg-[#1EBE5D] active:scale-[0.99] transition-all uppercase tracking-wider text-sm shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">forum</span>
              <span>Confirmar Disponibilidad por WhatsApp</span>
            </button>

            <div className="flex items-center justify-center gap-6 pt-1">
              <button
                type="button"
                onClick={() => handleBackStep(3)}
                className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
              >
                ← Cambiar Paquete / Extras
              </button>
              <button
                type="button"
                onClick={() => handleBackStep(1)}
                className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
              >
                Reiniciar Cálculo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

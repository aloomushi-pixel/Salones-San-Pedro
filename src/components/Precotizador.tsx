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

// Rangos desanclados para evitar el sesgo del 45% en 100 invitados por defecto
const GUEST_RANGE_CARDS = [
  { label: '50 – 80', sub: 'Evento Íntimo', value: 80 },
  { label: '100 – 120', sub: 'Estándar Plus', value: 100 },
  { label: '150', sub: 'Clásico Gala', value: 150 },
  { label: '200+', sub: 'Gran Evento', value: 200 },
];

const QUICK_GUEST_PRESETS = [50, 70, 80, 90, 100, 120, 150, 200, 250];

const PREFERRED_DAYS = [
  {
    id: 'Sábado',
    label: 'Sábado',
    badge: 'Alta Demanda',
    benefit: 'Sujeto a disponibilidad de fecha',
    hasBonus: false,
    icon: 'calendar_month',
  },
  {
    id: 'Viernes',
    label: 'Viernes',
    badge: '🎁 Tarifa Preferencial',
    benefit: '+ Cortesía VIP de Bienvenida',
    hasBonus: true,
    icon: 'sell',
  },
  {
    id: 'Domingo',
    label: 'Domingo',
    badge: '🎁 Bono Familiar',
    benefit: '+ Hora o Cortesía Especial',
    hasBonus: true,
    icon: 'wb_sunny',
  },
  {
    id: 'Entre Semana',
    label: 'Lunes a Jueves',
    badge: '🎁 Tarifa Especial',
    benefit: 'Ideal Corporativo / Social',
    hasBonus: true,
    icon: 'event_available',
  },
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
  { id: 'Bautizo / Cumpleaños', label: 'Bautizo / Cumple', icon: 'cake' },
  { id: 'Empresarial', label: 'Empresarial', icon: 'business_center' },
];

const EXTRAS = [
  { id: 'limusina', label: 'Servicio de Limusina', icon: 'directions_car', approxPrice: 6500 },
  { id: 'shots', label: 'Carrito de Shots', icon: 'local_bar', approxPrice: 4500 },
  { id: 'letras', label: 'Letras Gigantes', icon: 'format_size', approxPrice: 3500 },
  { id: 'dulces', label: 'Mesa de Dulces', icon: 'icecream', approxPrice: 5500 },
  { id: 'mariachi', label: 'Mariachi', icon: 'music_note', approxPrice: 6500 },
  { id: 'robot', label: 'Robot LED / Batucada', icon: 'smart_toy', approxPrice: 5500 },
  { id: 'cabina', label: 'Cabina 360', icon: 'camera', approxPrice: 4800 },
];

const COMBO_VIP_IDS = ['limusina', 'shots', 'letras'];
const COMBO_VIP_PRICE = 11500; // Ahorro conjunto frente a $14,500 individual

const STEP_LABELS = [
  { num: 1, label: 'Aforo' },
  { num: 2, label: 'Fecha' },
  { num: 3, label: 'Paquete' },
  { num: 4, label: 'Simulador' },
];

export default function Precotizador() {
  const [step, setStep] = useState(1);

  // Iniciamos en 80 invitados (desanclado de 100) para medir demanda real y activar upsell consciente a 100
  const [guests, setGuests] = useState(80);
  const [hasTouchedGuests, setHasTouchedGuests] = useState(false);
  const [eventKind, setEventKind] = useState('Boda');
  const [preferredDay, setPreferredDay] = useState('Sábado');
  const [preferredSeason, setPreferredSeason] = useState('Temporada Alta / Fin de Año (Oct-Dic)');
  const [packageType, setPackageType] = useState('Premier');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [comboVipActive, setComboVipActive] = useState(false);
  const [lockedAttemptPkg, setLockedAttemptPkg] = useState<string | null>(null);
  const [showMathBreakdown, setShowMathBreakdown] = useState(true);
  const [wantsTour, setWantsTour] = useState(true);

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

  const applyGuestsValue = (newVal: number, recordTelemetry = false) => {
    const clamped = Math.min(250, Math.max(50, newVal));
    setGuests(clamped);
    setHasTouchedGuests(true);
    setLockedAttemptPkg(null);
    if (clamped < 100 && packageType !== 'Premier') {
      setPackageType('Premier');
    }
    if (recordTelemetry) {
      trackEvent('guests_slider_adjust', `aforo_${clamped}`, {
        section: 'precotizador',
        guests_range: getGuestsBucket(clamped),
        extra: { exact_guests: clamped, manually_adjusted: true },
      });
    }
  };

  // Actualización funcional sin latencia para evitar rage_click en botones -10 / +10
  const handleGuestsDelta = (delta: number) => {
    setGuests((prev) => {
      const clamped = Math.min(250, Math.max(50, prev + delta));
      if (clamped < 100 && packageType !== 'Premier') {
        setPackageType('Premier');
      }
      setHasTouchedGuests(true);
      setLockedAttemptPkg(null);
      trackEvent('guests_slider_adjust', `aforo_${clamped}`, {
        section: 'precotizador',
        guests_range: getGuestsBucket(clamped),
        extra: { exact_guests: clamped, manually_adjusted: true },
      });
      return clamped;
    });
  };

  const handleStep1Next = () => {
    const duration = Date.now() - stepStartRef.current;
    if (guests < 100 && packageType !== 'Premier') {
      setPackageType('Premier');
    } else if (guests >= 100 && packageType === 'Premier' && !hasTouchedGuests) {
      setPackageType('Plus');
    }
    trackEvent('precotizador_step', 'step_1_completado', {
      section: 'precotizador',
      step_number: 1,
      guests_range: getGuestsBucket(guests),
      event_kind: eventKind,
      timers: { step_duration_ms: duration },
      extra: { exact_guests: guests, manually_adjusted: hasTouchedGuests },
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
    const normalizedExtras = selectedExtras.map(
      (id) => EXTRAS.find((e) => e.id === id)?.label || id
    );
    if (comboVipActive) {
      normalizedExtras.unshift('Combo Fiesta VIP (Limusina + Shots + Letras)');
    }
    trackEvent('precotizador_step', 'step_3_completado', {
      section: 'precotizador',
      step_number: 3,
      guests_range: getGuestsBucket(guests),
      package_name: `Paquete ${packageType}`,
      event_kind: eventKind,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      timers: { step_duration_ms: duration },
      extra: {
        exact_guests: guests,
        extras: normalizedExtras,
        combo_vip: comboVipActive,
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
      package_name: `Paquete ${packageType}`,
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

  const handleUpsellTo100 = (targetPkgName = 'Plus') => {
    setGuests(100);
    setHasTouchedGuests(true);
    setPackageType(targetPkgName);
    setLockedAttemptPkg(null);
    trackEvent('precotizador_step', 'upsell_a_100_invitados', {
      section: 'precotizador',
      guests_range: '100 a 149 personas',
      package_name: `Paquete ${targetPkgName}`,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      extra: { exact_guests: 100, upsell_triggered: true },
    });
  };

  const handleToggleComboVip = () => {
    const nextState = !comboVipActive;
    setComboVipActive(nextState);
    if (nextState) {
      // Asegurar que los 3 servicios del combo queden incluidos sin duplicarse como individuales
      setSelectedExtras((prev) => prev.filter((id) => !COMBO_VIP_IDS.includes(id)));
      trackEvent('extra_service_interest', 'combo_fiesta_vip', {
        section: 'precotizador',
        element_text: 'Combo Fiesta VIP (Limusina + Shots + Letras)',
        guests_range: getGuestsBucket(guests),
        package_name: `Paquete ${packageType}`,
      });
    }
  };

  const handleExtraToggle = (id: string) => {
    if (comboVipActive && COMBO_VIP_IDS.includes(id)) {
      // Si desmarca uno de los del combo, desactivar combo y dejar los otros dos
      setComboVipActive(false);
      setSelectedExtras((prev) => [
        ...prev,
        ...COMBO_VIP_IDS.filter((cid) => cid !== id),
      ]);
      return;
    }

    const extraObj = EXTRAS.find((e) => e.id === id);
    const willSelect = !selectedExtras.includes(id);
    if (willSelect && extraObj) {
      trackEvent('extra_service_interest', `extra_${id}`, {
        section: 'precotizador',
        element_text: extraObj.label,
        guests_range: getGuestsBucket(guests),
        package_name: `Paquete ${packageType}`,
      });
    }
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const getPackagePrice = () => {
    const pkg = PACKAGES.find((p) => p.id === packageType);
    return pkg ? pkg.price : 530;
  };

  const basePackageBudget = guests * getPackagePrice();
  const extrasTotal =
    (comboVipActive && packageType !== 'All Inclusive' ? COMBO_VIP_PRICE : 0) +
    selectedExtras.reduce((sum, id) => {
      const ex = EXTRAS.find((e) => e.id === id);
      return sum + (ex ? ex.approxPrice : 0);
    }, 0);
  const budget = basePackageBudget + extrasTotal;
  const effectivePerPerson = Math.round(budget / guests);

  const selectedDayInfo =
    PREFERRED_DAYS.find((d) => d.id === preferredDay) || PREFERRED_DAYS[0];

  const handleWhatsApp = () => {
    const activeExtraLabels = [
      ...(comboVipActive && packageType !== 'All Inclusive'
        ? ['Combo Fiesta VIP (Limusina + Carrito de Shots + Letras Gigantes)']
        : []),
      ...EXTRAS.filter((e) => selectedExtras.includes(e.id)).map((e) => e.label),
    ];
    const extrasText =
      activeExtraLabels.length > 0 ? activeExtraLabels.join(', ') : 'Ninguno adicional';

    const totalWizardMs = Date.now() - wizardStartRef.current;

    const bonusText = selectedDayInfo.hasBonus
      ? `\n• Beneficio aplicable: ${selectedDayInfo.badge} (${selectedDayInfo.benefit})`
      : '';
    const tourText = wantsTour
      ? `\n• Solicitud: Me gustaría agendar un recorrido presencial para conocer los Salones Diamante y Platino.`
      : '';

    const message = `¡Hola! Realicé mi cotización en el Precotizador de Salones San Pedro Plus:\n• Tipo de evento: ${eventKind}\n• Invitados: ${guests} personas\n• Día de interés: ${preferredDay}\n• Temporada tentativa: ${preferredSeason}\n• Paquete elegido: Paquete ${packageType} ($${getPackagePrice()} p/p)\n• Extras / Combos: ${extrasText}${bonusText}\n• Presupuesto estimado: $${budget.toLocaleString('es-MX')} MXN ($${effectivePerPerson} p/p)${tourText}\n¿Podrían confirmarme disponibilidad de fecha y enviarme la cotización formal?`;

    trackEvent('whatsapp_click', 'precotizador', {
      section: 'precotizador',
      step_number: 4,
      guests_range: getGuestsBucket(guests),
      package_name: `Paquete ${packageType}`,
      event_kind: eventKind,
      preferred_day: preferredDay,
      preferred_season: preferredSeason,
      timers: {
        step_duration_ms: totalWizardMs,
      },
      extra: {
        exact_guests: guests,
        estimated_budget: budget,
        extras: activeExtraLabels,
        combo_vip: comboVipActive,
        wants_tour: wantsTour,
      },
    });

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/526633670431?text=${encodedMessage}`, '_blank');
  };

  return (
    <div
      id="precotizador"
      data-ux-section="precotizador"
      className="w-full max-w-xl mx-auto bg-surface-container border border-outline-variant/40 rounded-3xl p-4 sm:p-6 md:p-7 shadow-2xl relative overflow-hidden"
    >
      {/* Resplandor decorativo */}
      <div className="absolute -top-28 -right-28 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Encabezado Compacto + Stepper Táctil Interactivo */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
              Simulador de Precios en Tiempo Real
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
                <div className="flex items-center gap-1 text-[11px] pointer-events-none">
                  <span
                    data-ux-decorative="true"
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

      {/* Cuerpo del Paso Actual */}
      <div className="relative z-10 flex flex-col justify-between">
        {/* =================================================================
            PASO 1: RANGOS DESANCLADOS DE AFORO + GIRO DEL EVENTO
        ================================================================= */}
        {step === 1 && (
          <div className="animate-fade-in space-y-3.5">
            {/* Control de Invitados Desanclado */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 text-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                1. Selecciona tu rango o número de invitados
              </label>

              {/* Botones de Rangos Claros (Recomendación Frente 4: Desanclar de 100) */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {GUEST_RANGE_CARDS.map((rc) => {
                  const isRangeSelected =
                    (rc.value === 80 && guests >= 50 && guests < 100) ||
                    (rc.value === 100 && guests >= 100 && guests <= 130) ||
                    (rc.value === 150 && guests >= 140 && guests < 200) ||
                    (rc.value === 200 && guests >= 200);
                  return (
                    <button
                      key={rc.label}
                      type="button"
                      onClick={() => applyGuestsValue(rc.value, true)}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isRangeSelected
                          ? 'border-primary bg-primary/15 text-primary font-bold shadow-xs'
                          : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary/40'
                      }`}
                    >
                      <div className="text-xs font-extrabold pointer-events-none">{rc.label}</div>
                      <div className="text-[10px] text-secondary truncate pointer-events-none">
                        {rc.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Botones grandes [-10] Número [+10] sin latencia */}
              <div className="flex items-center justify-between max-w-xs mx-auto gap-3 my-2">
                <button
                  type="button"
                  onClick={() => handleGuestsDelta(-10)}
                  disabled={guests <= 50}
                  aria-label="Restar 10 invitados"
                  className="w-12 h-12 rounded-2xl bg-surface-container-high hover:bg-primary hover:text-on-primary active:scale-90 disabled:opacity-30 font-bold text-lg flex items-center justify-center transition-transform border border-outline-variant/40 cursor-pointer shrink-0 select-none"
                >
                  <span className="pointer-events-none">−10</span>
                </button>

                <div className="flex flex-col items-center select-none">
                  <span className="text-4xl sm:text-5xl font-bold text-primary font-display-lg leading-none">
                    {guests}
                  </span>
                  <span className="text-xs text-secondary font-medium mt-1">
                    invitados
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleGuestsDelta(10)}
                  disabled={guests >= 250}
                  aria-label="Sumar 10 invitados"
                  className="w-12 h-12 rounded-2xl bg-surface-container-high hover:bg-primary hover:text-on-primary active:scale-90 disabled:opacity-30 font-bold text-lg flex items-center justify-center transition-transform border border-outline-variant/40 cursor-pointer shrink-0 select-none"
                >
                  <span className="pointer-events-none">+10</span>
                </button>
              </div>

              {/* Chips de selección rápida */}
              <div className="flex flex-wrap justify-center gap-1 my-2.5">
                {QUICK_GUEST_PRESETS.map((preset) => {
                  const isActive = guests === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => applyGuestsValue(preset, true)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-primary text-on-primary border-primary shadow-xs scale-105'
                          : 'bg-surface-container-high/70 text-on-surface border-outline-variant/30 hover:border-primary/50'
                      }`}
                    >
                      <span className="pointer-events-none">{preset}</span>
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
                onChange={(e) => applyGuestsValue(Number(e.target.value), false)}
                onMouseUp={() => applyGuestsValue(guests, true)}
                onTouchEnd={() => applyGuestsValue(guests, true)}
                className="w-full h-2.5 bg-outline-variant/40 rounded-lg appearance-none cursor-pointer accent-primary mt-1"
              />

              {/* Incentivo Inteligente de Volumen para 50-99 invitados (Activa upsell_a_100_invitados) */}
              <div className="mt-3">
                {guests < 100 ? (
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-[11px] text-on-surface leading-snug">
                      <span className="font-bold text-primary block">
                        💡 Tip de Volumen ({guests} pers. → Paquete Premier $530 p/p):
                      </span>
                      Al llegar a <strong>100 invitados</strong> desbloqueas el <strong>Paquete Plus ($710 p/p)</strong> con Robot LED, Mesa de Dulces, Cabina y Letras Gigantes incluidas.
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpsellTo100('Plus')}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] shrink-0 hover:opacity-90 transition-opacity cursor-pointer text-center"
                    >
                      <span className="pointer-events-none">Cotizar con 100 pers.</span>
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 text-[11px] font-semibold rounded-full">
                    <span data-ux-decorative="true" className="material-symbols-outlined text-xs pointer-events-none">
                      check_circle
                    </span>
                    100+ personas: Todos los paquetes desbloqueados (Premier, Plus y All Inclusive)
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
                      <span data-ux-decorative="true" className="material-symbols-outlined text-base pointer-events-none">
                        {ev.icon}
                      </span>
                      <span className="pointer-events-none">{ev.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón de Avance */}
            <button
              type="button"
              onClick={handleStep1Next}
              className="w-full min-h-[50px] bg-primary text-on-primary font-bold py-3.5 px-6 rounded-2xl hover:opacity-95 active:scale-[0.99] transition-all uppercase tracking-wider text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="pointer-events-none">Siguiente: Día y Beneficios</span>
              <span data-ux-decorative="true" className="material-symbols-outlined text-lg pointer-events-none">
                arrow_forward
              </span>
            </button>
          </div>
        )}

        {/* =================================================================
            PASO 2: DÍA DE LA SEMANA (CON INCENTIVO VIERNES/DOMINGO) + TEMPORADA
        ================================================================= */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4">
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
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 min-h-[62px] ${
                        active
                          ? 'border-primary bg-primary/15 text-primary shadow-xs'
                          : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary/40'
                      }`}
                    >
                      <span
                        data-ux-decorative="true"
                        className="material-symbols-outlined text-xl text-primary shrink-0 mt-0.5 pointer-events-none"
                      >
                        {d.icon}
                      </span>
                      <div className="min-w-0 pointer-events-none">
                        <div className="text-xs sm:text-sm font-bold leading-tight">{d.label}</div>
                        <div className="text-[10px] font-bold text-primary leading-tight mt-0.5">
                          {d.badge}
                        </div>
                        <div className="text-[10px] text-secondary leading-tight mt-0.5">
                          {d.benefit}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Banner persuasivo para descongestionar Sábado hacia Viernes/Domingo */}
              {preferredDay === 'Sábado' ? (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-on-surface flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-amber-400 block">
                      💡 ¿Buscas el mejor precio o beneficio adicional?
                    </strong>
                    En <strong>Viernes o Domingo</strong> aseguras la <strong>Tarifa Preferencial</strong> más baja y recibes <strong>1 Cortesía VIP sin cargo</strong> (Letras Gigantes o Recepción con Coctelería).
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreferredDay('Viernes')}
                      className="px-2.5 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[10px] cursor-pointer"
                    >
                      <span className="pointer-events-none">Elegir Viernes 🎁</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredDay('Domingo')}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/40 font-bold text-[10px] cursor-pointer"
                    >
                      <span className="pointer-events-none">Domingo 🎁</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 p-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-[11px] text-green-400 font-medium">
                  🎉 <strong>Beneficio {preferredDay} Activo:</strong> Tu cotización incluye Tarifa Preferencial garantizada + Cortesía Especial al reservar.
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
                      <span className="pointer-events-none">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navegación Inferior */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleBackStep(1)}
                className="px-4 min-h-[50px] rounded-2xl border border-outline-variant/40 text-secondary hover:text-on-surface font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shrink-0"
              >
                <span data-ux-decorative="true" className="material-symbols-outlined text-base pointer-events-none">
                  arrow_back
                </span>
                <span className="pointer-events-none">Atrás</span>
              </button>
              <button
                type="button"
                onClick={handleStep2Next}
                className="flex-1 min-h-[50px] bg-primary text-on-primary font-bold py-3.5 px-5 rounded-2xl hover:opacity-95 active:scale-[0.99] transition-all uppercase tracking-wider text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="pointer-events-none">Siguiente: Paquete y Combo VIP</span>
                <span data-ux-decorative="true" className="material-symbols-outlined text-lg pointer-events-none">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            PASO 3: PAQUETE + COMBO FIESTA VIP + EXTRAS TÁCTILES SIN DEAD CLICKS
        ================================================================= */}
        {step === 3 && (
          <div className="animate-fade-in space-y-3.5">
            {/* Banner de desbloqueo a 100 invitados */}
            {guests < 100 && (
              <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-2xl text-xs text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
                <span>
                  {lockedAttemptPkg ? (
                    <>
                      El paquete <strong>{lockedAttemptPkg}</strong> aplica desde 100 invitados (tienes {guests}).
                    </>
                  ) : (
                    <>
                      Con <strong>{guests} invitados</strong> aplica Paquete Premier. Sube a 100 para desbloquear <strong>Plus</strong> y <strong>All Inclusive</strong>.
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => handleUpsellTo100(lockedAttemptPkg || 'Plus')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-neutral-950 font-extrabold text-xs shrink-0 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  <span className="pointer-events-none">
                    Subir a 100 pers. y elegir {lockedAttemptPkg || 'Plus'}
                  </span>
                </button>
              </div>
            )}

            {/* Tarjetas de Paquetes como <button> completos para eliminar dead_clicks */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary">
                1. Selecciona tu Nivel de Paquete:
              </label>
              {PACKAGES.map((pkg) => {
                const isAvailable = guests >= pkg.minGuests;
                const isSelected = packageType === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      if (isAvailable) {
                        setPackageType(pkg.id);
                        setLockedAttemptPkg(null);
                      } else {
                        handleLockedPackageClick(pkg.name);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer block ${
                      !isAvailable
                        ? 'opacity-60 bg-surface-container-low/50 border-outline-variant/20 hover:border-amber-500/40'
                        : isSelected
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pointer-events-none">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          data-ux-decorative="true"
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

                    <div className="flex flex-wrap gap-1.5 mt-2 pl-7 pointer-events-none">
                      {pkg.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] text-secondary bg-surface-container-high/60 px-2 py-0.5 rounded-md"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* NUEVO FRENTE 4.2: COMBO FIESTA VIP (Limusina + Carrito de Shots + Letras Gigantes) */}
            {packageType !== 'All Inclusive' && (
              <button
                type="button"
                onClick={handleToggleComboVip}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  comboVipActive
                    ? 'border-primary bg-primary/15 shadow-md'
                    : 'border-primary/40 bg-primary/5 hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-between gap-2 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span
                      data-ux-decorative="true"
                      className="material-symbols-outlined text-primary text-xl"
                    >
                      {comboVipActive ? 'check_circle' : 'stars'}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-extrabold text-on-surface">
                          🔥 Combo Fiesta VIP (Los 3 Favoritos)
                        </span>
                        <span className="text-[10px] font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">
                          Ahorra 20%
                        </span>
                      </div>
                      <p className="text-[11px] text-secondary mt-0.5">
                        Incluye: <strong>Servicio de Limusina</strong> + <strong>Carrito de Shots LED</strong> + <strong>Letras Gigantes</strong>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-primary block">
                      +${COMBO_VIP_PRICE.toLocaleString('es-MX')}
                    </span>
                    <span className="text-[10px] text-secondary line-through block">
                      $14,500
                    </span>
                  </div>
                </div>
              </button>
            )}

            {/* Selección de Extras Individuales (100% <button> con hijos pointer-events-none) */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary mb-2">
                2. O personaliza tus Servicios Extra individuales:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {EXTRAS.map((extra) => {
                  const isIncludedInCombo =
                    comboVipActive &&
                    packageType !== 'All Inclusive' &&
                    COMBO_VIP_IDS.includes(extra.id);
                  const isSelected = isIncludedInCombo || selectedExtras.includes(extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => handleExtraToggle(extra.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer min-h-[44px] active:scale-95 select-none ${
                        isSelected
                          ? 'border-primary bg-primary/15 text-primary font-bold shadow-xs'
                          : 'border-outline-variant/30 bg-surface-container-low text-on-surface hover:border-primary/40'
                      }`}
                    >
                      <span
                        data-ux-decorative="true"
                        className="material-symbols-outlined text-sm shrink-0 pointer-events-none"
                      >
                        {isSelected ? 'check_circle' : extra.icon}
                      </span>
                      <span className="truncate pointer-events-none">{extra.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navegación Inferior */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleBackStep(2)}
                className="px-4 min-h-[50px] rounded-2xl border border-outline-variant/40 text-secondary hover:text-on-surface font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shrink-0"
              >
                <span data-ux-decorative="true" className="material-symbols-outlined text-base pointer-events-none">
                  arrow_back
                </span>
                <span className="pointer-events-none">Atrás</span>
              </button>
              <button
                type="button"
                onClick={handleStep3Next}
                className="flex-1 min-h-[50px] bg-primary text-on-primary font-bold py-3.5 px-5 rounded-2xl hover:opacity-95 active:scale-[0.99] transition-all uppercase tracking-wider text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span data-ux-decorative="true" className="material-symbols-outlined text-lg pointer-events-none">
                  calculate
                </span>
                <span className="pointer-events-none">Ver Cotización y Simulador</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================
            PASO 4: SIMULADOR INTERACTIVO EN VIVO + DESGLOSE MATEMÁTICO + WHATSAPP
        ================================================================= */}
        {step === 4 && (
          <div className="animate-fade-in space-y-3.5 text-center">
            <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-inner">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                <span data-ux-decorative="true" className="material-symbols-outlined text-sm pointer-events-none">
                  verified
                </span>
                Presupuesto Estimado en Vivo
              </div>

              {/* Monto total clicable para ver/ocultar el desglose matemático (Resuelve dead_click en "$111,300 MXN") */}
              <button
                type="button"
                onClick={() => setShowMathBreakdown((prev) => !prev)}
                className="w-full py-1.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group"
                title="Haz clic para ver u ocultar el desglose matemático"
              >
                <div className="font-display-lg text-3xl sm:text-5xl text-primary font-bold pointer-events-none">
                  ${budget.toLocaleString('es-MX')}{' '}
                  <span className="text-sm sm:text-base font-normal text-secondary">MXN</span>
                </div>
                <div className="text-[11px] text-primary/90 font-semibold flex items-center justify-center gap-1 mt-0.5 pointer-events-none">
                  <span>
                    Equivalente a ${effectivePerPerson.toLocaleString('es-MX')} MXN por invitado
                  </span>
                  <span className="underline ml-1">
                    {showMathBreakdown ? 'Ocultar desglose ▴' : 'Ver desglose matemático ▾'}
                  </span>
                </div>
              </button>

              {/* Desglose Matemático Transparente */}
              {showMathBreakdown && (
                <div className="mt-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-left text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-on-surface">
                    <span>
                      Paquete <strong>{packageType}</strong> ({guests} pers. × ${getPackagePrice()}):
                    </span>
                    <span className="font-bold">
                      ${basePackageBudget.toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                  {comboVipActive && packageType !== 'All Inclusive' && (
                    <div className="flex justify-between items-center text-primary">
                      <span>🔥 Combo Fiesta VIP (Limusina + Shots + Letras):</span>
                      <span className="font-bold">
                        +${COMBO_VIP_PRICE.toLocaleString('es-MX')} MXN
                      </span>
                    </div>
                  )}
                  {EXTRAS.filter((e) => selectedExtras.includes(e.id)).map((ex) => (
                    <div key={ex.id} className="flex justify-between items-center text-secondary">
                      <span>+ {ex.label} (estimado):</span>
                      <span className="font-semibold">
                        +${ex.approxPrice.toLocaleString('es-MX')} MXN
                      </span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-outline-variant/30 flex justify-between items-center text-[11px]">
                    <span className="text-secondary">Día seleccionado ({preferredDay}):</span>
                    <span className="font-bold text-green-400">
                      {selectedDayInfo.hasBonus
                        ? `${selectedDayInfo.badge} Incluido`
                        : 'Tarifa Estándar Sábado'}
                    </span>
                  </div>
                </div>
              )}

              {/* SIMULADOR EN VIVO EN EL PASO 4 (Evita que el usuario tenga que regresar al Paso 1 para probar otro aforo o día) */}
              <div className="mt-3 p-3 rounded-xl bg-surface-container-high/50 border border-outline-variant/30 text-left space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center justify-between">
                  <span>⚡ Ajusta tu simulación en vivo sin salir:</span>
                  <span className="text-[10px] text-secondary font-normal">{eventKind}</span>
                </div>

                {/* 1. Simulador rápido de Invitados */}
                <div className="flex items-center justify-between gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant/20">
                  <span className="text-xs font-semibold text-on-surface">Invitados:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleGuestsDelta(-10)}
                      disabled={guests <= 50}
                      className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary font-bold text-xs flex items-center justify-center cursor-pointer disabled:opacity-30"
                    >
                      <span className="pointer-events-none">−10</span>
                    </button>
                    <span className="font-extrabold text-sm text-primary min-w-[68px] text-center">
                      {guests} pers.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGuestsDelta(10)}
                      disabled={guests >= 250}
                      className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary font-bold text-xs flex items-center justify-center cursor-pointer disabled:opacity-30"
                    >
                      <span className="pointer-events-none">+10</span>
                    </button>
                  </div>
                </div>

                {/* 2. Simulador rápido de Día (Sábado vs Viernes/Domingo con beneficio) */}
                <div className="grid grid-cols-4 gap-1">
                  {PREFERRED_DAYS.map((d) => {
                    const isDaySelected = preferredDay === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setPreferredDay(d.id)}
                        className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                          isDaySelected
                            ? 'border-primary bg-primary text-on-primary'
                            : 'border-outline-variant/30 bg-surface-container-lowest text-secondary hover:text-on-surface'
                        }`}
                      >
                        <span className="pointer-events-none block truncate">
                          {d.id === 'Entre Semana' ? 'Lun–Jue' : d.label}
                          {d.hasBonus ? ' 🎁' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 3. Simulador rápido de Paquete */}
                <div className="grid grid-cols-3 gap-1">
                  {PACKAGES.map((pkg) => {
                    const isPkgAvail = guests >= pkg.minGuests;
                    const isPkgSelected = packageType === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => {
                          if (isPkgAvail) {
                            setPackageType(pkg.id);
                          } else {
                            handleUpsellTo100(pkg.id);
                          }
                        }}
                        className={`py-1.5 px-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                          isPkgSelected
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-outline-variant/30 bg-surface-container-lowest text-secondary hover:text-on-surface'
                        }`}
                      >
                        <span className="pointer-events-none block truncate">
                          {pkg.name} (${pkg.price})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Opción de Agendar Recorrido Presencial para este Fin de Semana */}
              <button
                type="button"
                onClick={() => setWantsTour((prev) => !prev)}
                className="mt-3 w-full p-2.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-2 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 pointer-events-none">
                  <span
                    data-ux-decorative="true"
                    className="material-symbols-outlined text-primary text-lg"
                  >
                    {wantsTour ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span className="text-[11px] text-on-surface font-medium">
                    Quiero agendar visita guiada a los <strong>Salones Diamante y Platino</strong> (sin compromiso)
                  </span>
                </div>
              </button>
            </div>

            {/* Indicador de Biorritmo Operativo (Respuesta inmediata mediodía/fines de semana y planeación nocturna) */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-green-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              <span>
                Atención inmediata en WhatsApp • Recibe cotización formal en PDF al instante
              </span>
            </div>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full min-h-[54px] bg-[#25D366] text-white font-bold py-4 px-6 rounded-2xl hover:bg-[#1EBE5D] active:scale-[0.99] transition-all uppercase tracking-wider text-sm shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span data-ux-decorative="true" className="material-symbols-outlined text-xl pointer-events-none">
                forum
              </span>
              <span className="pointer-events-none">
                Recibir Cotización y Disponibilidad en WhatsApp
              </span>
            </button>

            <div className="flex items-center justify-center gap-6 pt-1">
              <button
                type="button"
                onClick={() => handleBackStep(3)}
                className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
              >
                <span className="pointer-events-none">← Editar Extras / Combo VIP</span>
              </button>
              <button
                type="button"
                onClick={() => handleBackStep(2)}
                className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
              >
                <span className="pointer-events-none">Cambiar Temporada</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

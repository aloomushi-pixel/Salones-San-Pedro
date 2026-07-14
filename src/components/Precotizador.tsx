'use client';

import { useState } from 'react';
import { submitLead } from '../app/actions/submitLead';
import Link from 'next/link';

const pricingData: any = {
  "2026": {
    "Platino": {
      "Clásico": { "Viernes": { "50": 555, "100": 460, "150": 450 } },
      "Premier": {
        "Viernes": { "50": 630, "100": 530, "150": 520, "170": 510 },
        "Sábado": { "50": 680, "100": 570, "150": 560, "170": 550 }
      },
      "Plus": {
        "Viernes": { "100": 710, "150": 710, "170": 690 },
        "Sábado": { "100": 710, "150": 710, "170": 710 }
      },
      "All Inclusive": {
        "Cualquiera": { "100": 1010, "150": 960, "170": 910 }
      }
    },
    "Diamante": {
      "Clásico": { "Viernes": { "50": 555, "100": 460, "150": 450 } },
      "Premier": {
        "Viernes": { "50": 700, "100": 550, "150": 540, "200": 530 },
        "Sábado": { "100": 590, "150": 580, "200": 570 }
      },
      "Plus": {
        "Cualquiera": { "100": 730, "150": 730, "200": 730 }
      },
      "All Inclusive": {
        "Cualquiera": { "100": 1030, "150": 980, "200": 930 }
      }
    }
  },
  "2027": {
    "Platino": {
      "Clásico": { "Viernes": { "50": 585, "100": 490, "150": 480 } },
      "Premier": {
        "Viernes": { "50": 660, "100": 560, "150": 550, "170": 540 },
        "Sábado": { "50": 710, "100": 600, "150": 590, "170": 580 }
      },
      "Plus": {
        "Viernes": { "100": 740, "150": 740, "170": 720 },
        "Sábado": { "100": 740, "150": 740, "170": 740 }
      },
      "All Inclusive": {
        "Cualquiera": { "100": 1040, "150": 990, "170": 940 }
      }
    },
    "Diamante": {
      "Clásico": { "Viernes": { "50": 585, "100": 490, "150": 480 } },
      "Premier": {
        "Viernes": { "50": 730, "100": 580, "150": 570, "200": 560 },
        "Sábado": { "100": 620, "150": 610, "200": 600 }
      },
      "Plus": {
        "Cualquiera": { "100": 760, "150": 760, "200": 760 }
      },
      "All Inclusive": {
        "Cualquiera": { "100": 1060, "150": 1010, "200": 960 }
      }
    }
  }
};

export default function Precotizador() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{precioPorPersona: number, totalEstimado: number} | null>(null);

  // Form Data
  const [eventType, setEventType] = useState('');
  const [salon, setSalon] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestsCount, setGuestsCount] = useState('');
  const [packageType, setPackageType] = useState('');
  const [wantsExtraService, setWantsExtraService] = useState<boolean | null>(null);
  const [extraServiceDetail, setExtraServiceDetail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // Computations
  const yearStr = eventDate ? eventDate.split('-')[0] : '2026';
  const year = (yearStr === '2027' || yearStr > '2027') ? '2027' : '2026';
  
  const dayOfWeekNum = eventDate ? new Date(eventDate).getUTCDay() : 5; 
  const dayName = dayOfWeekNum === 6 ? 'Sábado' : 'Viernes';

  const guestsOptions = salon === 'Diamante' ? ['50', '100', '150', '200'] : ['50', '100', '150', '170'];
  const packageOptions = ["Clásico", "Premier", "Plus", "All Inclusive"];

  const getAvailablePackages = () => {
    return packageOptions.filter(pkg => {
      const dKey = (pkg === 'All Inclusive' || (pkg === 'Plus' && salon === 'Diamante')) ? 'Cualquiera' : dayName;
      return pricingData[year]?.[salon]?.[pkg]?.[dKey]?.[guestsCount] !== undefined;
    });
  };

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Calculate final price
    const dKey = (packageType === 'All Inclusive' || (packageType === 'Plus' && salon === 'Diamante')) ? 'Cualquiera' : dayName;
    const precioPorPersona = pricingData[year][salon][packageType][dKey][guestsCount];
    const totalEstimado = precioPorPersona * parseInt(guestsCount);

    const formData = new FormData();
    formData.append('eventType', eventType);
    formData.append('guestsCount', guestsCount);
    formData.append('eventDate', eventDate);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    // Overload location to store name + salon + package + estimate to not break existing db constraints
    
    let extraInfo = wantsExtraService && extraServiceDetail ? ` | Servicio Extra: ${extraServiceDetail}` : wantsExtraService === false ? ' | Sin servicios extras' : '';
    formData.append('location', `Nombre: ${name} | Salón: ${salon} | Paquete: ${packageType} | Estimado: $${totalEstimado} MXN${extraInfo}`);
    
    // Send individual fields to new columns
    formData.append('name', name);
    formData.append('salon', salon);
    formData.append('package_type', packageType);
    formData.append('estimated_total', totalEstimado.toString());
    formData.append('extra_service', wantsExtraService && extraServiceDetail ? extraServiceDetail : '');

    const res = await submitLead(formData);
    
    if (res.success) {
      setResult({ precioPorPersona, totalEstimado });
      setSuccess(true);
    } else {
      setError(res.error || 'Ocurrió un error al enviar tu solicitud.');
    }
    setLoading(false);
  };

  if (success && result) {
    return (
      <div className="bg-primary-container text-on-primary-container p-8 rounded-xl text-center shadow-lg">
        <h3 className="text-2xl font-bold mb-4">¡Cotización Estimada Lista!</h3>
        <p className="text-lg mb-6">
          Tu inversión estimada para un evento inolvidable de {guestsCount} invitados es de <br/>
          <span className="text-3xl font-bold block my-4">${result.totalEstimado.toLocaleString('es-MX')} MXN</span>
          <span className="text-base opacity-90">(${result.precioPorPersona.toLocaleString('es-MX')} por persona).</span>
        </p>
        <p className="text-sm opacity-80 mb-6 max-w-md mx-auto">
          Este es un cálculo preliminar. ¡Un asesor te contactará por WhatsApp en breve para confirmar la disponibilidad de tu fecha y personalizar tu paquete!
        </p>
        <button 
          onClick={() => { setSuccess(false); setStep(1); }}
          className="mt-2 border border-on-primary-container px-6 py-2 rounded font-semibold hover:bg-on-primary-container hover:text-primary-container transition-colors"
        >
          Hacer nueva cotización
        </button>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="flex gap-2 mb-8">
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-surface-variant'}`} />
        ))}
      </div>

      <form className="space-y-6 text-left min-h-[300px] flex flex-col justify-between" onSubmit={handleSubmit}>
        
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-display-lg text-2xl text-on-surface">¿Qué vas a celebrar?</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Boda', 'XV Años', 'Graduación', 'Corporativo', 'Otro'].map(opt => (
                <button
                  key={opt} type="button"
                  onClick={() => { setEventType(opt); handleNext(); }}
                  className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${eventType === opt ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/30 hover:border-primary/50 text-on-surface'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-display-lg text-2xl text-on-surface">¿En qué salón estás interesado?</h3>
            <p className="text-sm text-secondary mb-4">
              <Link href="/#ubicacion" className="text-primary underline font-semibold">Ver fotos de nuestros salones aquí</Link>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Platino', 'Diamante'].map(opt => (
                <button
                  key={opt} type="button"
                  onClick={() => { setSalon(opt); handleNext(); }}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${salon === opt ? 'border-primary bg-primary/10' : 'border-outline-variant/30 hover:border-primary/50'}`}
                >
                  <span className={`block font-display-lg text-xl font-bold mb-2 ${salon === opt ? 'text-primary' : 'text-on-surface'}`}>{opt}</span>
                  <span className="text-sm text-secondary">
                    {opt === 'Platino' ? 'Ideal para eventos de 50 a 170 invitados. Ubicado en Planta Baja.' : 'El salón más grande, para 50 a 200 invitados. Ubicado en Primer Piso.'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-display-lg text-2xl text-on-surface">Selecciona la fecha específica para tu evento</h3>
            <p className="text-sm text-secondary">No te preocupes si no es la definitiva, nos ayuda a verificar precios exactos según el día de la semana. (Precios vigentes para 2026 y 2027).</p>
            <input 
              required 
              type="date" 
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full border-2 border-outline-variant/30 rounded-xl bg-transparent p-4 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-lg"
            />
            <div className="pt-4">
              <button 
                type="button" 
                disabled={!eventDate}
                onClick={handleNext}
                className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-display-lg text-2xl text-on-surface">¿Cuántos invitados esperas?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {guestsOptions.map(opt => (
                <button
                  key={opt} type="button"
                  onClick={() => { setGuestsCount(opt); handleNext(); }}
                  className={`p-4 rounded-xl border-2 font-bold text-lg transition-all ${guestsCount === opt ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/30 hover:border-primary/50 text-on-surface'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-display-lg text-2xl text-on-surface">¿Qué nivel de servicio buscas?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {packageOptions.map(pkg => {
                const availablePkgs = getAvailablePackages();
                const isAvailable = availablePkgs.includes(pkg);
                
                const showTooltip = (pkg === 'Premier' && salon === 'Platino' && guestsCount === '50' && dayName === 'Sábado');

                return (
                  <button
                    key={pkg} type="button"
                    disabled={!isAvailable}
                    onClick={() => { setPackageType(pkg); handleNext(); }}
                    className={`relative p-5 rounded-xl border-2 text-left transition-all ${packageType === pkg ? 'border-primary bg-primary/10' : 'border-outline-variant/30 hover:border-primary/50'} ${!isAvailable ? 'opacity-40 cursor-not-allowed bg-surface-variant' : ''}`}
                  >
                    <span className={`block font-display-lg text-lg font-bold ${packageType === pkg ? 'text-primary' : 'text-on-surface'}`}>{pkg}</span>
                    {!isAvailable && <span className="text-xs text-error block mt-1">No disponible para esta combinación</span>}
                    {showTooltip && isAvailable && <span className="text-xs text-error font-bold block mt-1">Nota: Eventos con término máximo a las 17:00 hrs</span>}
                  </button>
                )
              })}
            </div>
            {getAvailablePackages().length === 0 && (
              <p className="text-error text-sm font-semibold mt-4">No hay paquetes disponibles para esta cantidad de personas en {dayName}. Intenta cambiar el número de invitados o el día de la semana.</p>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-display-lg text-2xl text-on-surface">¿Estás interesado en contratar un servicio extra?</h3>
            <p className="text-sm text-secondary mb-4">
              <Link href="/blog" target="_blank" className="text-primary underline font-semibold">Ver servicios extras</Link>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setWantsExtraService(true)}
                className={`p-6 rounded-xl border-2 font-bold text-lg transition-all ${wantsExtraService === true ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/30 hover:border-primary/50 text-on-surface'}`}
              >
                SÍ
              </button>
              <button
                type="button"
                onClick={() => { setWantsExtraService(false); handleNext(); }}
                className={`p-6 rounded-xl border-2 font-bold text-lg transition-all ${wantsExtraService === false ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/30 hover:border-primary/50 text-on-surface'}`}
              >
                NO
              </button>
            </div>
            
            {wantsExtraService && (
              <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-on-surface font-semibold">¿Qué servicio extra te gustaría incluir?</p>
                <input 
                  value={extraServiceDetail} 
                  onChange={e => setExtraServiceDetail(e.target.value)} 
                  className="w-full border-2 border-outline-variant/30 rounded-xl bg-transparent p-4 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" 
                  placeholder="Ej. Fotografía, Mesa de dulces, etc." 
                  type="text" 
                />
                <div className="pt-2">
                  <button 
                    type="button" 
                    disabled={!extraServiceDetail}
                    onClick={handleNext}
                    className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold disabled:opacity-50"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-display-lg text-2xl text-on-surface">Último paso</h3>
            <p className="text-secondary text-sm">Para mostrarte tu cotización estimada y verificar disponibilidad, compártenos tus datos:</p>
            
            {error && (
              <div className="bg-error/10 text-error p-3 rounded-md text-sm border border-error/20">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <input required value={name} onChange={e=>setName(e.target.value)} className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" placeholder="Tu Nombre Completo" type="text" />
              <input required value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" placeholder="Tu WhatsApp o celular" type="tel" />
              <input required value={email} onChange={e=>setEmail(e.target.value)} className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" placeholder="correo@ejemplo.com" type="email" />
            </div>

            <div className="pt-4">
              <button disabled={loading} className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold uppercase tracking-widest shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2" type="submit">
                {loading ? 'Calculando...' : 'Ver Cotización Estimada'}
                {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>
            </div>
          </div>
        )}

        {step > 1 && step <= 7 && !loading && (
          <div className="mt-6 pt-4 border-t border-outline-variant/20">
            <button type="button" onClick={handlePrev} className="text-secondary hover:text-primary font-semibold text-sm flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Paso Anterior
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

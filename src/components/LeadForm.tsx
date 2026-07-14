'use client';

import { useState } from 'react';
import { submitLead } from '../app/actions/submitLead';

export default function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await submitLead(formData);
    
    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || 'Ocurrió un error al enviar tu solicitud.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-primary-container text-on-primary-container p-8 rounded-xl text-center shadow-lg">
        <h3 className="text-2xl font-bold mb-4">¡Gracias por tu interés!</h3>
        <p className="text-lg">Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto.</p>
        <a 
          href="https://wa.me/message/U7UANPSABGW4K1"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-[#20b858] transition-all shadow-lg shadow-[#25D366]/30 hover:scale-105 active:scale-95"
        >
          Verificar fechas disponibles con un asesor
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-10" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-error text-on-error p-4 rounded-md">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {/* Step 1 */}
        <div className="space-y-3">
          <label className="font-label-sm text-primary uppercase flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">1</span>
            ¿Cuál es tu evento?
          </label>
          <select required name="eventType" className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md appearance-none" defaultValue="">
            <option disabled value="">Selecciona una opción</option>
            <option value="boda">Boda</option>
            <option value="xv">XV Años</option>
            <option value="bautizo">Bautizo</option>
            <option value="corporativo">Evento Corporativo</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        {/* Step 2 */}
        <div className="space-y-3">
          <label className="font-label-sm text-primary uppercase flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">2</span>
            Número de personas
          </label>
          <input required name="guestsCount" min="1" className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" type="number" placeholder="Ej. 150" />
        </div>
        {/* Step 3 */}
        <div className="space-y-3">
          <label className="font-label-sm text-primary uppercase flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">3</span>
            Fecha aproximada
          </label>
          <input required name="eventDate" className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" type="date" />
        </div>
        {/* Step 4 */}
        <div className="space-y-3">
          <label className="font-label-sm text-primary uppercase flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">4</span>
            Número de teléfono
          </label>
          <input required name="phoneNumber" className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" placeholder="Tu WhatsApp o celular" type="tel" />
        </div>
        {/* Step 5 */}
        <div className="space-y-3">
          <label className="font-label-sm text-primary uppercase flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">5</span>
            Correo electrónico
          </label>
          <input required name="email" className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" placeholder="correo@ejemplo.com" type="email" />
        </div>
        {/* Step 6 */}
        <div className="space-y-3">
          <label className="font-label-sm text-primary uppercase flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">6</span>
            ¿De qué zona eres?
          </label>
          <input required name="location" className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-3 focus:ring-0 focus:border-primary transition-all text-on-surface font-body-md" placeholder="Ej. Gustavo A. Madero, CDMX" type="text" />
        </div>
      </div>

      <button disabled={loading} className="w-full py-5 bg-primary text-on-primary rounded-lg font-label-sm shadow-xl hover:bg-primary/90 transition-all scale-100 active:scale-95 text-lg tracking-widest uppercase font-bold disabled:opacity-50" type="submit">
        {loading ? 'Enviando...' : 'Verificar Disponibilidad'}
      </button>
    </form>
  );
}

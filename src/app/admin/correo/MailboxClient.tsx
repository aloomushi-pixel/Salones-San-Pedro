'use client';

import { useState, useEffect } from 'react';
import { getLeadMessages, sendEmailResponse, MessageRecord } from '../emailActions';

interface Lead {
  id: string;
  event_type: string;
  guests_count: number;
  event_date: string;
  phone_number: string;
  email: string | null;
  location: string | null;
  status: string;
  created_at: string;
}

interface MailboxClientProps {
  initialLeads: Lead[];
}

export default function MailboxClient({ initialLeads }: MailboxClientProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(initialLeads[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState('Información de Disponibilidad - Salones San Pedro');
  const [body, setBody] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filter leads based on search query
  const filteredLeads = initialLeads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const emailMatch = lead.email?.toLowerCase().includes(query) || false;
    const typeMatch = lead.event_type.toLowerCase().includes(query);
    const locationMatch = lead.location?.toLowerCase().includes(query) || false;
    return emailMatch || typeMatch || locationMatch;
  });

  // Fetch messages when selected lead changes
  useEffect(() => {
    if (!selectedLead) return;

    const fetchHistory = async () => {
      setLoadingMessages(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        const history = await getLeadMessages(selectedLead.id);
        setMessages(history);
      } catch (err) {
        console.error('Error loading history:', err);
        setErrorMsg('Error al cargar el historial de correspondencia.');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchHistory();
    setSubject(`Información de Disponibilidad - Salones San Pedro`);
    setBody(
      `Hola,\n\nMuchas gracias por contactar a Salones San Pedro plus.\n\nHemos recibido tu solicitud de disponibilidad para tu evento de ${selectedLead.event_type.toUpperCase()} con ${selectedLead.guests_count} invitados para la fecha ${selectedLead.event_date}.\n\nCon gusto te confirmamos que tu fecha está pre-reservada en nuestro sistema. Nos gustaría agendar una llamada de 5 minutos o una cita en nuestras instalaciones para mostrarte los salones Diamante (Primer Piso) y Platino (Planta Baja), así como nuestros paquetes y degustaciones de menú.\n\n¿Qué horario te queda mejor para ponernos en contacto?\n\nSaludos cordiales,\nJuan García\nCoordinador de Eventos | Salones San Pedro`
    );
  }, [selectedLead]);

  const loadTemplate = (type: 'disponible' | 'no_disponible' | 'seguimiento') => {
    if (!selectedLead) return;
    if (type === 'disponible') {
      setBody(
        `Hola,\n\nMuchas gracias por contactar a Salones San Pedro plus.\n\nHemos recibido tu solicitud de disponibilidad para tu evento de ${selectedLead.event_type.toUpperCase()} con ${selectedLead.guests_count} invitados para la fecha ${selectedLead.event_date}.\n\nCon gusto te confirmamos que tu fecha está pre-reservada en nuestro sistema. Nos gustaría agendar una llamada de 5 minutos o una cita en nuestras instalaciones para mostrarte los salones Diamante (Primer Piso) y Platino (Planta Baja), así como nuestros paquetes y degustaciones de menú.\n\n¿Qué horario te queda mejor para ponernos en contacto?\n\nSaludos cordiales,\nJuan García\nCoordinador de Eventos | Salones San Pedro`
      );
    } else if (type === 'no_disponible') {
      setBody(
        `Hola,\n\nMuchas gracias por tu interés en Salones San Pedro plus.\n\nReferente a tu consulta para tu evento de ${selectedLead.event_type.toUpperCase()} para el día ${selectedLead.event_date}, lamentablemente esa fecha ya se encuentra reservada en su totalidad.\n\nSin embargo, contamos con disponibilidad en los fines de semana adyacentes o fechas de temporada baja con precios especiales. ¿Te interesaría agendar una llamada rápida para proponerte alternativas?\n\nSaludos cordiales,\nJuan García\nCoordinador de Eventos | Salones San Pedro`
      );
    } else {
      setBody(
        `Hola,\n\nEspero te encuentres muy bien. Te escribo de Salones San Pedro para dar seguimiento a tu solicitud de cotización del evento de ${selectedLead.event_type.toUpperCase()}.\n\nQuedamos a tus órdenes para resolver cualquier duda sobre los paquetes Platino o Diamante, o para coordinar una visita guiada para verificar espacio.\n\n¿Te gustaría que agendemos una cita para este fin de semana?\n\nSaludos cordiales,\nJuan García\nCoordinador de Eventos | Salones San Pedro`
      );
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !selectedLead.email) return;

    setSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await sendEmailResponse(selectedLead.id, selectedLead.email, subject, body);
      if (res.success) {
        setSuccessMsg('¡Correo electrónico enviado con éxito!');
        setBody('');
        // Reload messages history
        const updatedHistory = await getLeadMessages(selectedLead.id);
        setMessages(updatedHistory);
        // Update selected lead status locally to reflect 'Contactado'
        selectedLead.status = 'Contactado';
      } else {
        setErrorMsg(res.error || 'Ocurrió un error al enviar el correo.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px] max-h-[80vh]">
      
      {/* Sidebar - Threads list */}
      <div className="lg:col-span-4 border-r border-outline-variant/25 flex flex-col bg-surface-container-low/40 min-w-0">
        
        {/* Search */}
        <div className="p-4 border-b border-outline-variant/20">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-lg">search</span>
            <input
              type="text"
              placeholder="Buscar por correo, evento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-outline-variant/50 focus:border-primary rounded-xl pl-10 pr-4 py-2 text-sm outline-none transition-colors"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/15">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-secondary text-xs italic">
              No se encontraron conversaciones.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              const hasIncoming = lead.status === 'Nuevo';
              return (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left p-4 flex flex-col gap-1 transition-all ${
                    isSelected
                      ? 'bg-primary-container/20 border-l-4 border-primary'
                      : 'hover:bg-surface-container-high/40 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="font-semibold text-sm capitalize text-on-surface truncate pr-2">
                      {lead.event_type}
                    </span>
                    <span className="text-[10px] text-secondary shrink-0">
                      {new Date(lead.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className="text-xs text-secondary truncate w-full font-medium">
                    {lead.email}
                  </span>
                  <div className="flex justify-between items-center w-full mt-1.5">
                    <span className="text-[10px] text-secondary font-semibold bg-surface-container border border-outline-variant/20 px-2 py-0.5 rounded">
                      {lead.location || 'Sin ubicación'}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      hasIncoming
                        ? 'bg-error/15 text-error animate-pulse'
                        : 'bg-green-500/10 text-green-500'
                    }`}>
                      {hasIncoming ? 'Por Responder' : 'Atendido'}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Pane - Chat Thread */}
      <div className="lg:col-span-8 flex flex-col bg-surface min-w-0">
        {selectedLead ? (
          <>
            {/* Header info */}
            <div className="p-6 border-b border-outline-variant/25 bg-surface-container-low/20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-display-lg text-lg font-bold text-on-surface capitalize flex items-center gap-2">
                  Evento: {selectedLead.event_type}
                  <span className="text-xs font-normal text-secondary font-body-sm">
                    ({selectedLead.guests_count} invitados)
                  </span>
                </h3>
                <p className="text-xs text-secondary mt-1">
                  Destinatario: <span className="font-semibold text-primary">{selectedLead.email}</span>
                </p>
              </div>

              {/* Badges / Links */}
              <div className="flex gap-2 flex-wrap sm:justify-end">
                <a
                  href={`https://wa.me/${selectedLead.phone_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold bg-surface-container border border-outline-variant/30 hover:border-primary/45 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  WhatsApp
                </a>
                <span className="text-xs font-semibold bg-surface-container border border-outline-variant/30 px-3 py-1.5 rounded-lg text-secondary">
                  Fecha: {new Date(selectedLead.event_date + 'T00:00:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Correspondence Messages Box */}
            <div className="flex-1 overflow-y-auto p-6 bg-surface-container-low/10 space-y-4">
              {loadingMessages ? (
                <div className="flex flex-col justify-center items-center h-full py-12 text-secondary text-xs">
                  <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">sync</span>
                  Cargando mensajes...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col justify-center items-center text-center h-full p-8 text-secondary/60 text-xs border-2 border-dashed border-outline-variant/30 rounded-2xl max-w-md mx-auto my-12">
                  <span className="material-symbols-outlined text-5xl mb-2 text-secondary/50">mail_outline</span>
                  Aún no hay correos en este hilo.
                  <p className="mt-1">
                    Redacta tu primer correo a continuación usando nuestras plantillas de disponibilidad.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOutbound = msg.sender.includes('ventas@sanpedro.com.mx') || msg.sender.includes('onboarding@resend.dev');
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] space-y-1.5 p-4 rounded-2xl shadow-sm border ${
                        isOutbound
                          ? 'self-end bg-primary-container/15 border-primary-container/30 text-on-surface ml-auto rounded-tr-none'
                          : 'self-start bg-surface-container-low border-outline-variant/30 text-on-surface mr-auto rounded-tl-none'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-6 text-[10px] text-secondary font-semibold border-b border-outline-variant/10 pb-1.5">
                        <span>{isOutbound ? 'De: Ventas San Pedro' : `De: ${msg.sender.replace(/<.*>/, '').trim()}`}</span>
                        <span>
                          {new Date(msg.created_at).toLocaleString('es-MX', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-on-surface">{msg.subject}</h4>
                      <p className="text-xs text-secondary leading-relaxed whitespace-pre-line font-body-sm">
                        {msg.body}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form Box */}
            <div className="p-6 border-t border-outline-variant/20 bg-surface">
              <form onSubmit={handleSend} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Remitente</label>
                    <input
                      type="text"
                      disabled
                      value="ventas@sanpedro.com.mx"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs text-secondary font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Asunto</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-lg px-3 py-1.5 text-xs text-on-surface font-semibold outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Templates Quick Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-secondary uppercase shrink-0">Plantillas:</span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => loadTemplate('disponible')}
                      className="text-[10px] bg-primary/10 hover:bg-primary/25 text-primary px-3 py-1 rounded-full font-semibold transition-colors"
                    >
                      ✓ Disponible
                    </button>
                    <button
                      type="button"
                      onClick={() => loadTemplate('no_disponible')}
                      className="text-[10px] bg-error/10 hover:bg-error/25 text-error px-3 py-1 rounded-full font-semibold transition-colors"
                    >
                      ✗ Reservado
                    </button>
                    <button
                      type="button"
                      onClick={() => loadTemplate('seguimiento')}
                      className="text-[10px] bg-surface-container-high hover:bg-surface-container-highest text-secondary px-3 py-1 rounded-full font-semibold transition-colors"
                    >
                      ⟳ Seguimiento
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="relative">
                  <textarea
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Escribe tu mensaje por correo electrónico aquí..."
                    className="w-full min-h-[140px] max-h-[220px] bg-surface border border-outline-variant/60 focus:border-primary rounded-lg p-3.5 text-sm text-on-surface outline-none transition-colors font-body-md resize-y"
                  />
                </div>

                {errorMsg && <div className="text-xs text-error font-semibold bg-error/10 p-2.5 rounded-lg">{errorMsg}</div>}
                {successMsg && <div className="text-xs text-green-500 font-semibold bg-green-500/10 p-2.5 rounded-lg">{successMsg}</div>}

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-secondary italic">
                    Remitente verificado a través de Resend API.
                  </span>
                  <button
                    type="submit"
                    disabled={sending || !selectedLead.email}
                    className="bg-primary text-on-primary hover:opacity-95 font-label-sm text-xs font-bold px-6 py-2.5 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">{sending ? 'sync' : 'send'}</span>
                    {sending ? 'Enviando...' : 'Enviar Respuesta'}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-12 text-secondary">
            <span className="material-symbols-outlined text-6xl mb-4 text-secondary/40">forward_to_inbox</span>
            <h4 className="font-display-lg text-lg font-bold">Sin conversaciones</h4>
            <p className="text-xs text-secondary/70 max-w-sm mt-1">
              Selecciona un prospecto en la barra izquierda para gestionar su comunicación y ver los correos correspondientes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

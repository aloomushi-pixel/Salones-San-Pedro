'use client';

import { useState } from 'react';
import { getLeadMessages, sendEmailResponse, ParsedMessage } from '../app/admin/emailActions';
import { updateLeadStatus } from '../app/admin/actions';

interface LeadActionsClientProps {
  leadId: string;
  eventType: string;
  guestsCount: number;
  eventDate: string;
  email: string | null;
  phoneNumber: string;
  status: string;
  adminName: string;
  salon?: string;
  packageType?: string;
}

export default function LeadActionsClient({
  leadId,
  eventType,
  guestsCount,
  eventDate,
  email,
  phoneNumber,
  status,
  adminName,
  salon,
  packageType
}: LeadActionsClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [subject, setSubject] = useState(`Información de Disponibilidad - Salones San Pedro`);
  const [body, setBody] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const adminRole = adminName === 'Samantha Flores'
    ? 'Coordinadora de Ventas'
    : adminName === 'José Martinez'
    ? 'Administrador de Eventos'
    : 'Coordinador de Eventos';

  const loadHistory = async () => {
    setLoadingHistory(true);
    setErrorMsg('');
    try {
      const history = await getLeadMessages(leadId);
      setMessages(history);
    } catch (err) {
      console.error('Error loading message history:', err);
      setErrorMsg('No se pudo cargar el historial de correos.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSuccessMsg('');
    setErrorMsg('');
    loadHistory();
    // Set default body template
    const salonText = salon ? ` en el Salón ${salon}` : '';
    const packageText = packageType ? ` (Paquete ${packageType})` : '';
    setBody(
      `Hola,\n\nMuchas gracias por contactar a Salones San Pedro plus.\n\nHemos recibido tu solicitud de disponibilidad para tu evento de ${eventType.toUpperCase()}${salonText} con ${guestsCount} invitados para la fecha ${eventDate}${packageText}.\n\nCon gusto te confirmamos que tu fecha está pre-reservada en nuestro sistema. Nos gustaría agendar una llamada de 5 minutos o una cita en nuestras instalaciones para mostrarte los salones Diamante (Primer Piso) y Platino (Planta Baja), así como nuestros paquetes y degustaciones de menú.\n\n¿Qué horario te queda mejor para ponernos en contacto?\n\nSaludos cordiales,\n${adminName}\n${adminRole} | Salones San Pedro`
    );
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const loadTemplate = (type: 'disponible' | 'no_disponible' | 'seguimiento') => {
    const salonText = salon ? ` en el Salón ${salon}` : '';
    const packageText = packageType ? ` (Paquete ${packageType})` : '';

    if (type === 'disponible') {
      setBody(
        `Hola,\n\nMuchas gracias por contactar a Salones San Pedro plus.\n\nHemos recibido tu solicitud de disponibilidad para tu evento de ${eventType.toUpperCase()}${salonText} con ${guestsCount} invitados para la fecha ${eventDate}${packageText}.\n\nCon gusto te confirmamos que tu fecha está pre-reservada en nuestro sistema. Nos gustaría agendar una llamada de 5 minutos o una cita en nuestras instalaciones para mostrarte los salones Diamante (Primer Piso) y Platino (Planta Baja), así como nuestros paquetes y degustaciones de menú.\n\n¿Qué horario te queda mejor para ponernos en contacto?\n\nSaludos cordiales,\n${adminName}\n${adminRole} | Salones San Pedro`
      );
    } else if (type === 'no_disponible') {
      setBody(
        `Hola,\n\nMuchas gracias por tu interés en Salones San Pedro plus.\n\nReferente a tu consulta para tu evento de ${eventType.toUpperCase()}${salonText} para el día ${eventDate}, lamentablemente esa fecha ya se encuentra reservada en su totalidad.\n\nSin embargo, contamos con disponibilidad en los fines de semana adyacentes o fechas de temporada baja con precios especiales. ¿Te interesaría agendar una llamada rápida para proponerte alternativas?\n\nSaludos cordiales,\n${adminName}\n${adminRole} | Salones San Pedro`
      );
    } else {
      setBody(
        `Hola,\n\nEspero te encuentres muy bien. Te escribo de Salones San Pedro para dar seguimiento a tu solicitud de cotización del evento de ${eventType.toUpperCase()}.\n\nQuedamos a tus órdenes para resolver cualquier duda sobre los paquetes Platino o Diamante, o para coordinar una visita guiada para verificar espacio.\n\n¿Te gustaría que agendemos una cita para este fin de semana?\n\nSaludos cordiales,\n${adminName}\n${adminRole} | Salones San Pedro`
      );
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await sendEmailResponse(leadId, email, subject, body);
      if (res.success) {
        setSuccessMsg('¡Correo enviado con éxito!');
        setBody('');
        loadHistory(); // Reload history log
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
    <>
      <div className="flex gap-2 justify-end items-center">
        {email ? (
          <button
            onClick={handleOpen}
            className="text-xs font-semibold bg-primary text-on-primary hover:opacity-90 px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">mail</span>
            Responder
          </button>
        ) : (
          <span className="text-xs text-secondary italic">Sin correo</span>
        )}
        <form action={updateLeadStatus.bind(null, leadId, status)}>
          <button className="text-xs font-semibold bg-surface-container border border-outline-variant/30 hover:border-primary/40 text-on-surface hover:text-primary px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95">
            {status === 'Nuevo' ? 'Marcar Contactado' : 'Marcar Nuevo'}
          </button>
        </form>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface border border-outline-variant/35 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="bg-surface-container-low border-b border-outline-variant/30 p-6 flex justify-between items-center">
              <div>
                <h3 className="font-display-lg text-xl font-bold text-on-surface">Herramienta de Contacto por Correo</h3>
                <p className="text-secondary text-xs mt-1">
                  Enviando respuesta a: <span className="font-semibold text-primary">{email}</span>
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-secondary hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
              {/* Left Column: Form */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <h4 className="font-display-lg text-sm font-bold uppercase tracking-wider text-secondary">Redactar Correo</h4>
                <form onSubmit={handleSend} className="space-y-4 flex flex-col flex-1">
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase mb-1">Destinatario</label>
                    <input
                      type="email"
                      value={email || ''}
                      disabled
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-sm text-secondary font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase mb-1">Asunto</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-lg px-3 py-2 text-sm text-on-surface font-semibold outline-none transition-colors"
                    />
                  </div>

                  {/* Templates Quick Selector */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-secondary uppercase">Plantillas rápidas</label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => loadTemplate('disponible')}
                        className="text-[11px] bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded-full font-semibold transition-colors"
                      >
                        ✓ Disponible
                      </button>
                      <button
                        type="button"
                        onClick={() => loadTemplate('no_disponible')}
                        className="text-[11px] bg-error/10 hover:bg-error/20 text-error px-2.5 py-1 rounded-full font-semibold transition-colors"
                      >
                        ✗ No Disponible
                      </button>
                      <button
                        type="button"
                        onClick={() => loadTemplate('seguimiento')}
                        className="text-[11px] bg-surface-container-high hover:bg-surface-container-highest text-secondary px-2.5 py-1 rounded-full font-semibold transition-colors"
                      >
                        ⟳ Seguimiento
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col min-h-[220px]">
                    <label className="block text-xs font-bold text-secondary uppercase mb-1">Mensaje (Cuerpo)</label>
                    <textarea
                      required
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Escribe tu correo aquí..."
                      className="w-full flex-1 bg-surface border border-outline-variant/60 focus:border-primary rounded-lg p-3 text-sm text-on-surface outline-none resize-none transition-colors font-body-md"
                    />
                  </div>

                  {errorMsg && <div className="text-xs text-error font-semibold bg-error/10 p-2.5 rounded-lg">{errorMsg}</div>}
                  {successMsg && <div className="text-xs text-green-500 font-semibold bg-green-500/10 p-2.5 rounded-lg">{successMsg}</div>}

                  <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-xs font-bold bg-surface-container border border-outline-variant/30 hover:border-outline text-secondary px-4 py-2.5 rounded-lg transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="text-xs font-bold bg-primary text-on-primary hover:opacity-90 px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">{sending ? 'sync' : 'send'}</span>
                      {sending ? 'Enviando...' : 'Enviar Correo'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: History */}
              <div className="lg:col-span-5 flex flex-col space-y-4 border-l border-outline-variant/20 pl-0 lg:pl-6 min-h-0">
                <h4 className="font-display-lg text-sm font-bold uppercase tracking-wider text-secondary">Historial de Mensajes</h4>

                {loadingHistory ? (
                  <div className="flex-1 flex flex-col justify-center items-center py-12 text-secondary text-xs">
                    <span className="material-symbols-outlined animate-spin text-2xl mb-2 text-primary">sync</span>
                    Cargando historial...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-6 text-secondary/60 text-xs border-2 border-dashed border-outline-variant/30 rounded-xl">
                    <span className="material-symbols-outlined text-4xl mb-2">mail_outline</span>
                    No se han enviado correos a este prospecto aún.
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[300px]">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-start text-[11px] text-secondary">
                          <span className="font-semibold text-primary truncate max-w-[150px]">De: {msg.sender.replace(/<.*>/, '').trim()}</span>
                          <span>{new Date(msg.created_at).toLocaleString('es-MX', { hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <h5 className="font-semibold text-xs text-on-surface">{msg.subject}</h5>
                        <p className="text-xs text-secondary whitespace-pre-line leading-relaxed font-body-sm bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/10">
                          {msg.bodyText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

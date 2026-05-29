'use client';

import { useState, useEffect } from 'react';
import { 
  ParsedMessage, 
  sendEmailResponse, 
  sendNewEmail, 
  toggleMessageDeleted, 
  deleteMessagePermanent 
} from '../emailActions';

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
  initialMessages: ParsedMessage[];
  currentUser: {
    name: string;
    role: string;
  };
}

export default function MailboxClient({ initialLeads, initialMessages, currentUser }: MailboxClientProps) {
  // Navigation & Folders
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'deleted' | 'compose'>('inbox');
  const [messages, setMessages] = useState<ParsedMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ParsedMessage | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Compose Form
  const [toEmail, setToEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  
  // Compose Form Autocomplete / Suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // UI Loading & Message Statuses
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle auto-selection of the first message in the active folder
  const currentFolderMessages = messages.filter((msg) => {
    if (activeFolder === 'deleted') {
      return msg.is_deleted;
    }
    if (msg.is_deleted) return false;
    
    if (activeFolder === 'inbox') {
      return msg.direction === 'inbound';
    }
    if (activeFolder === 'sent') {
      return msg.direction === 'outbound';
    }
    return false;
  });

  // Filter messages based on search query
  const filteredMessages = currentFolderMessages.filter((msg) => {
    const query = searchQuery.toLowerCase();
    const subjectMatch = msg.subject?.toLowerCase().includes(query) || false;
    const bodyMatch = msg.bodyText?.toLowerCase().includes(query) || false;
    const senderMatch = msg.sender?.toLowerCase().includes(query) || false;
    const toMatch = msg.to_email?.toLowerCase().includes(query) || false;
    return subjectMatch || bodyMatch || senderMatch || toMatch;
  });

  // Set first filtered message as selected on folder change
  useEffect(() => {
    if (filteredMessages.length > 0 && activeFolder !== 'compose') {
      setSelectedMessage(filteredMessages[0]);
    } else {
      setSelectedMessage(null);
    }
    setSuccessMsg('');
    setErrorMsg('');
  }, [activeFolder]);

  // Lead email suggestions for "Para" field
  const leadEmailSuggestions = initialLeads.filter(lead => {
    if (!lead.email) return false;
    if (!toEmail) return true; // Show all if empty
    return lead.email.toLowerCase().includes(toEmail.toLowerCase()) && lead.email.toLowerCase() !== toEmail.toLowerCase();
  });

  // Load a quick template
  const loadTemplate = (type: 'disponible' | 'no_disponible' | 'seguimiento') => {
    // Try to find if there is a lead associated with the current recipient email
    const matchingLead = initialLeads.find(l => l.email?.toLowerCase() === toEmail.toLowerCase());
    const eventType = matchingLead ? matchingLead.event_type.toUpperCase() : 'TU EVENTO';
    const guests = matchingLead ? `${matchingLead.guests_count} invitados` : 'tus invitados';
    const date = matchingLead ? matchingLead.event_date : 'tu fecha deseada';

    if (type === 'disponible') {
      setSubject(`Confirmación de Disponibilidad - Salones San Pedro`);
      setBody(
        `Hola,\n\nMuchas gracias por contactar a Salones San Pedro plus.\n\nHemos recibido tu solicitud de disponibilidad para tu evento de ${eventType} con ${guests} para la fecha ${date}.\n\nCon gusto te confirmamos que tu fecha está pre-reservada en nuestro sistema. Nos gustaría agendar una llamada de 5 minutos o una cita en nuestras instalaciones para mostrarte los salones Diamante (Primer Piso) y Platino (Planta Baja), así como nuestros paquetes y degustaciones de menú.\n\n¿Qué horario te queda mejor para ponernos en contacto?\n\nSaludos cordiales,\n${currentUser.name}\n${currentUser.role} | Salones San Pedro`
      );
    } else if (type === 'no_disponible') {
      setSubject(`Información sobre Disponibilidad - Salones San Pedro`);
      setBody(
        `Hola,\n\nMuchas gracias por tu interés en Salones San Pedro plus.\n\nReferente a tu consulta para tu evento de ${eventType} para el día ${date}, lamentablemente esa fecha ya se encuentra reservada en su totalidad.\n\nSin embargo, contamos con disponibilidad en los fines de semana adyacentes o fechas de temporada baja con precios especiales. ¿Te interesaría agendar una llamada rápida para proponerte alternativas?\n\nSaludos cordiales,\n${currentUser.name}\n${currentUser.role} | Salones San Pedro`
      );
    } else {
      setSubject(`Seguimiento a tu cotización - Salones San Pedro`);
      setBody(
        `Hola,\n\nEspero te encuentres muy bien. Te escribo de Salones San Pedro para dar seguimiento a tu solicitud de cotización del evento de ${eventType}.\n\nQuedamos a tus órdenes para resolver cualquier duda sobre los paquetes Platino o Diamante, o para coordinar una visita guiada para verificar espacio.\n\n¿Te gustaría que agendemos una cita para este fin de semana?\n\nSaludos cordiales,\n${currentUser.name}\n${currentUser.role} | Salones San Pedro`
      );
    }
  };

  // Reply handler
  const handleReply = (msg: ParsedMessage) => {
    const isLeadInbound = msg.direction === 'inbound';
    setToEmail(isLeadInbound ? msg.sender : msg.to_email);
    setSubject(msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`);
    setCcEmail('');
    setBody(`\n\n--- En respuesta al mensaje del ${new Date(msg.created_at).toLocaleDateString('es-MX')} ---\n> ${msg.bodyText.replace(/\n/g, '\n> ')}`);
    setActiveFolder('compose');
  };

  // Deletion logic
  const handleToggleDeleted = async (msgId: string, deleteFlag: boolean) => {
    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await toggleMessageDeleted(msgId, deleteFlag);
      if (res.success) {
        // Update local state
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, is_deleted: deleteFlag } : m));
        setSuccessMsg(deleteFlag ? 'Mensaje enviado a la papelera.' : 'Mensaje restaurado.');
        setSelectedMessage(null);
      } else {
        setErrorMsg(res.error || 'Ocurrió un error al procesar el mensaje.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.');
    } finally {
      setActionLoading(false);
    }
  };

  // Permanent Delete
  const handlePermanentDelete = async (msgId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar permanentemente este correo? Esta acción no se puede deshacer.')) return;
    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await deleteMessagePermanent(msgId);
      if (res.success) {
        // Update local state
        setMessages(prev => prev.filter(m => m.id !== msgId));
        setSuccessMsg('Mensaje eliminado de forma permanente.');
        setSelectedMessage(null);
      } else {
        setErrorMsg(res.error || 'Ocurrió un error al eliminar el mensaje.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Send Email
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail) return;

    setSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await sendNewEmail(toEmail, subject, body, ccEmail);
      if (res.success) {
        setSuccessMsg('¡Correo electrónico enviado con éxito!');
        setToEmail('');
        setCcEmail('');
        setSubject('');
        setBody('');
        
        // Simular la inserción del nuevo mensaje enviado en el estado local
        // Nota: en producción Next.js revalidará la ruta, pero esto da feedback instantáneo
        const newMsgLocal: ParsedMessage = {
          id: Math.random().toString(), // Temporal
          lead_id: initialLeads.find(l => l.email === toEmail)?.id || 'dummy',
          subject: subject,
          sender: 'Salones San Pedro <ventas@sanpedro.com.mx>',
          created_at: new Date().toISOString(),
          bodyText: body,
          to_email: toEmail,
          cc: ccEmail,
          direction: 'outbound',
          is_deleted: false
        };
        setMessages(prev => [newMsgLocal, ...prev]);
        
        // Ir a la bandeja de enviados
        setActiveFolder('sent');
      } else {
        setErrorMsg(res.error || 'Ocurrió un error al enviar el correo.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.');
    } finally {
      setSending(false);
    }
  };

  // Find associated lead if any
  const associatedLead = selectedMessage 
    ? initialLeads.find(lead => lead.id === selectedMessage.lead_id) 
    : null;

  // Unread/Pending badge count for Inbox
  const pendingInboxCount = messages.filter(m => m.direction === 'inbound' && !m.is_deleted).length;

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px] max-h-[85vh]">
      
      {/* 1st Pane: Sidebar navigation folders */}
      <div className="lg:col-span-2 border-r border-outline-variant/25 bg-surface-container-low/40 p-4 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Compose Button */}
          <button
            onClick={() => {
              setToEmail('');
              setCcEmail('');
              setSubject('');
              setBody('');
              setActiveFolder('compose');
            }}
            className="w-full bg-primary-container text-on-primary-container font-label-sm text-xs font-bold py-3.5 px-4 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-lg font-bold">edit</span>
            Redactar
          </button>

          {/* Navigation links */}
          <div className="space-y-1.5 font-body-sm">
            <button
              onClick={() => setActiveFolder('inbox')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === 'inbox'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-surface-container-high/40 text-secondary'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg">inbox</span>
                Bandeja de entrada
              </div>
              {pendingInboxCount > 0 && (
                <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {pendingInboxCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveFolder('sent')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === 'sent'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-surface-container-high/40 text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">send</span>
              Enviados
            </button>

            <button
              onClick={() => setActiveFolder('deleted')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === 'deleted'
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-surface-container-high/40 text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              Eliminados
            </button>
          </div>
        </div>

        <div className="text-[10px] text-secondary/60 italic text-center border-t border-outline-variant/20 pt-4">
          Salones San Pedro Mail v1.2
        </div>
      </div>

      {/* 2nd Pane: Email threads list */}
      <div className="lg:col-span-4 border-r border-outline-variant/25 flex flex-col bg-surface-container-low/20 min-w-0">
        {/* Title Header */}
        <div className="p-4 border-b border-outline-variant/20 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
            {activeFolder === 'inbox' && 'Bandeja de entrada'}
            {activeFolder === 'sent' && 'Correos enviados'}
            {activeFolder === 'deleted' && 'Correos eliminados'}
            {activeFolder === 'compose' && 'Redactar correo'}
          </h3>
          
          {/* Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-lg">search</span>
            <input
              type="text"
              placeholder="Buscar asunto, contenido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-outline-variant/50 focus:border-primary rounded-xl pl-10 pr-4 py-2 text-xs outline-none transition-colors"
            />
          </div>
        </div>

        {/* Email Cards Container */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/15">
          {activeFolder === 'compose' ? (
            <div className="p-8 text-center text-secondary text-xs italic space-y-2">
              <span className="material-symbols-outlined text-3xl text-secondary/30">edit_note</span>
              <p>Componiendo un nuevo correo en el panel derecho.</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-secondary text-xs italic">
              No se encontraron correos en esta bandeja.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const formattedDate = new Date(msg.created_at).toLocaleDateString('es-MX', {
                month: 'short',
                day: 'numeric'
              });
              
              return (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full text-left p-4 flex flex-col gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-primary-container/15 border-l-4 border-primary'
                      : 'hover:bg-surface-container-high/30 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="font-bold text-xs text-on-surface truncate pr-2">
                      {msg.direction === 'inbound' ? msg.sender.replace(/<.*>/, '').trim() : `Para: ${msg.to_email}`}
                    </span>
                    <span className="text-[10px] text-secondary shrink-0 font-medium">
                      {formattedDate}
                    </span>
                  </div>
                  
                  <span className="text-xs font-semibold text-primary truncate w-full">
                    {msg.subject || '(Sin Asunto)'}
                  </span>
                  
                  <p className="text-[11px] text-secondary line-clamp-2 leading-relaxed">
                    {msg.bodyText}
                  </p>
                  
                  {msg.cc && (
                    <div className="flex items-center gap-1 text-[9px] text-secondary/70">
                      <span className="material-symbols-outlined text-[10px]">group</span>
                      <span>CC: {msg.cc}</span>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3rd Pane: Email detail view / Compose form */}
      <div className="lg:col-span-6 flex flex-col bg-surface min-w-0">
        
        {/* Render Compose View */}
        {activeFolder === 'compose' ? (
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="border-b border-outline-variant/20 pb-3">
              <h3 className="font-display-lg text-xl font-bold text-primary">Redactar Nuevo Correo</h3>
              <p className="text-xs text-secondary">Completa los campos para enviar una correspondencia oficial.</p>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              {/* Sender Info */}
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">De</label>
                <input
                  type="text"
                  disabled
                  value="Salones San Pedro <ventas@sanpedro.com.mx>"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-secondary font-semibold outline-none"
                />
              </div>

              {/* Recipient Input (with suggestions) */}
              <div className="relative">
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Para</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={toEmail}
                  onChange={(e) => {
                    setToEmail(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-lg px-3 py-2 text-xs text-on-surface font-semibold outline-none transition-colors"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && leadEmailSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-surface-container-lowest border border-outline-variant/35 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-outline-variant/15">
                    {leadEmailSuggestions.map((lead) => (
                      <button
                        key={lead.id}
                        type="button"
                        onClick={() => {
                          setToEmail(lead.email || '');
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-primary-container/10 text-xs flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-on-surface">{lead.email}</span>
                          <span className="text-[10px] text-secondary ml-2 capitalize">({lead.event_type})</span>
                        </div>
                        <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded font-bold text-secondary">
                          {lead.guests_count} inv
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CC Input */}
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Con Copia a (CC)</label>
                <input
                  type="text"
                  placeholder="ejemplo1@correo.com, ejemplo2@correo.com"
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-lg px-3 py-2 text-xs text-on-surface font-semibold outline-none transition-colors"
                />
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Asunto</label>
                <input
                  type="text"
                  required
                  placeholder="Asunto del correo"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-lg px-3 py-2 text-xs text-on-surface font-semibold outline-none transition-colors"
                />
              </div>

              {/* Templates Panel */}
              <div className="flex items-center gap-3 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20">
                <span className="text-[10px] font-bold text-secondary uppercase shrink-0">Plantillas:</span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => loadTemplate('disponible')}
                    className="text-[10px] bg-primary-container/20 hover:bg-primary-container/45 text-on-primary-container px-3 py-1 rounded-full font-bold transition-colors uppercase tracking-wider"
                  >
                    Disponible
                  </button>
                  <button
                    type="button"
                    onClick={() => loadTemplate('no_disponible')}
                    className="text-[10px] bg-error/10 hover:bg-error/20 text-error px-3 py-1 rounded-full font-bold transition-colors uppercase tracking-wider"
                  >
                    No Disp
                  </button>
                  <button
                    type="button"
                    onClick={() => loadTemplate('seguimiento')}
                    className="text-[10px] bg-surface-container-high hover:bg-surface-container-highest text-secondary px-3 py-1 rounded-full font-bold transition-colors uppercase tracking-wider"
                  >
                    Seguimiento
                  </button>
                </div>
              </div>

              {/* Message Body Input */}
              <div>
                <label className="block text-[11px] font-bold text-secondary uppercase mb-1">Cuerpo del Correo</label>
                <textarea
                  required
                  placeholder="Escribe el contenido del correo electrónico aquí..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full min-h-[180px] max-h-[300px] bg-surface border border-outline-variant/60 focus:border-primary rounded-lg p-3 text-xs text-on-surface outline-none transition-colors font-body-md resize-y"
                />
              </div>

              {errorMsg && <div className="text-xs text-error font-semibold bg-error/10 p-3 rounded-lg border border-error/20">{errorMsg}</div>}
              {successMsg && <div className="text-xs text-green-500 font-semibold bg-green-500/10 p-3 rounded-lg border border-green-500/20">{successMsg}</div>}

              {/* Send Button */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-secondary italic">
                  * Remitente verificado mediante Resend API.
                </span>
                <button
                  type="submit"
                  disabled={sending || !toEmail}
                  className="bg-primary text-on-primary hover:opacity-95 font-label-sm text-xs font-bold px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">{sending ? 'sync' : 'send'}</span>
                  {sending ? 'Enviando...' : 'Enviar Correo'}
                </button>
              </div>
            </form>
          </div>
        ) : selectedMessage ? (
          /* Render Selected Message Detail View */
          <div className="flex flex-col flex-1 min-h-0 bg-surface">
            
            {/* Subject and Folder Header */}
            <div className="p-6 border-b border-outline-variant/20 bg-surface-container-low/20">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h2 className="font-display-lg text-lg font-bold text-on-surface leading-snug">
                  {selectedMessage.subject || '(Sin Asunto)'}
                </h2>
                
                {/* Direction Badge */}
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                  selectedMessage.direction === 'inbound'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-green-500/10 text-green-500'
                }`}>
                  {selectedMessage.direction === 'inbound' ? 'Recibido' : 'Enviado'}
                </span>
              </div>

              {/* Header Info: From, To, CC, Date */}
              <div className="space-y-1.5 text-xs text-secondary mt-4 font-body-sm">
                <p>
                  <span className="font-bold">De: </span>
                  <span className="text-on-surface">{selectedMessage.sender}</span>
                </p>
                <p>
                  <span className="font-bold">Para: </span>
                  <span className="text-on-surface">{selectedMessage.to_email}</span>
                </p>
                {selectedMessage.cc && (
                  <p>
                    <span className="font-bold">CC: </span>
                    <span className="text-on-surface">{selectedMessage.cc}</span>
                  </p>
                )}
                <p>
                  <span className="font-bold">Fecha: </span>
                  <span>
                    {new Date(selectedMessage.created_at).toLocaleString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Email Message Content Body */}
            <div className="flex-1 p-6 overflow-y-auto bg-surface-container-low/5 border-b border-outline-variant/15">
              <p className="text-xs text-on-surface leading-relaxed whitespace-pre-line font-body-md">
                {selectedMessage.bodyText}
              </p>
            </div>

            {/* Associated Lead card & Folder Actions */}
            <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/15 space-y-4">
              
              {/* Lead detail card */}
              {associatedLead ? (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm text-xs">
                  <div className="flex justify-between items-start mb-3 border-b border-outline-variant/15 pb-2">
                    <h4 className="font-bold text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">assignment_ind</span>
                      Información del Prospecto
                    </h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                      associatedLead.status === 'Nuevo' ? 'bg-error/10 text-error' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {associatedLead.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-body-sm text-secondary">
                    <div>
                      <p className="font-bold text-[9px] uppercase tracking-wider text-secondary/60">Evento</p>
                      <p className="font-semibold text-on-surface capitalize">{associatedLead.event_type}</p>
                    </div>
                    <div>
                      <p className="font-bold text-[9px] uppercase tracking-wider text-secondary/60">Invitados</p>
                      <p className="font-semibold text-on-surface font-mono">{associatedLead.guests_count}</p>
                    </div>
                    <div>
                      <p className="font-bold text-[9px] uppercase tracking-wider text-secondary/60">Fecha Evento</p>
                      <p className="font-semibold text-on-surface">
                        {new Date(associatedLead.event_date + 'T00:00:00').toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-[9px] uppercase tracking-wider text-secondary/60">Ubicación</p>
                      <p className="font-semibold text-on-surface truncate" title={associatedLead.location || ''}>
                        {associatedLead.location || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-outline-variant/10">
                    <a
                      href={`https://wa.me/${associatedLead.phone_number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-secondary italic">
                  Este correo no está directamente vinculado a un lead registrado en la base de datos de disponibilidad.
                </div>
              )}

              {/* Action Buttons for message */}
              <div className="flex justify-between items-center gap-2 flex-wrap">
                {/* Reply */}
                {activeFolder !== 'deleted' && (
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    disabled={actionLoading}
                    className="bg-primary text-on-primary hover:opacity-95 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Responder
                  </button>
                )}
                
                {/* Deleted folder actions: Restore or Permanent delete */}
                {activeFolder === 'deleted' ? (
                  <div className="flex gap-2 w-full sm:w-auto justify-end ml-auto">
                    <button
                      onClick={() => handleToggleDeleted(selectedMessage.id, false)}
                      disabled={actionLoading}
                      className="bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">restore_from_trash</span>
                      Restaurar
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(selectedMessage.id)}
                      disabled={actionLoading}
                      className="bg-error/10 hover:bg-error/20 text-error font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">delete_forever</span>
                      Eliminar Permanente
                    </button>
                  </div>
                ) : (
                  /* Standard folder action: Trash */
                  <button
                    onClick={() => handleToggleDeleted(selectedMessage.id, true)}
                    disabled={actionLoading}
                    className="bg-error/10 hover:bg-error/20 text-error font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 ml-auto"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Mover a Papelera
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Empty detail pane placeholder */
          <div className="flex-1 flex flex-col justify-center items-center text-center p-12 text-secondary">
            <span className="material-symbols-outlined text-6xl mb-4 text-secondary/30">mail_lock</span>
            <h4 className="font-display-lg text-lg font-bold text-on-surface">Visualización de Correo</h4>
            <p className="text-xs text-secondary/70 max-w-sm mt-1.5 leading-relaxed">
              Selecciona un correo electrónico de la lista del panel central para ver su contenido, detalles de destinatarios y acciones asociadas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

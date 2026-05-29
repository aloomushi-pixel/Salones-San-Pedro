'use server';

import { Resend } from 'resend';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const resendApiKey = process.env.RESEND_API_KEY;

export interface MessageRecord {
  id: string;
  lead_id: string;
  subject: string;
  body: string; // May contain JSON metadata
  sender: string;
  created_at: string;
}

// Interfaz para la aplicación de mensajería parseada
export interface ParsedMessage {
  id: string;
  lead_id: string;
  subject: string;
  sender: string;
  created_at: string;
  bodyText: string;       // El texto real del cuerpo
  to_email: string;       // Destinatario
  cc: string;             // Con copia a (CC)
  direction: 'inbound' | 'outbound';
  is_deleted: boolean;
}

function parseMessageBody(msg: MessageRecord, leadEmail: string = ''): ParsedMessage {
  const isOutbound = msg.sender.includes('ventas@sanpedro.com.mx') || 
                     msg.sender.includes('admin@sanpedro.com.mx') || 
                     msg.sender.includes('ventas@sanpedro.aionia.com.mx') || 
                     msg.sender.includes('admin@sanpedro.aionia.com.mx') || 
                     msg.sender.includes('onboarding@resend.dev');

  const defaultTo = isOutbound ? leadEmail : 'ventas@sanpedro.aionia.com.mx';
  const defaultDirection = isOutbound ? 'outbound' : 'inbound';

  try {
    const rawBody = msg.body.trim();
    if (rawBody.startsWith('{') && rawBody.endsWith('}')) {
      const data = JSON.parse(rawBody);
      if (typeof data.body === 'string') {
        return {
          id: msg.id,
          lead_id: msg.lead_id,
          subject: msg.subject,
          sender: msg.sender,
          created_at: msg.created_at,
          bodyText: data.body,
          to_email: data.to_email || defaultTo,
          cc: data.cc || '',
          direction: data.direction || defaultDirection,
          is_deleted: !!data.is_deleted
        };
      }
    }
  } catch (e) {
    // Si falla el parseo, se trata como texto plano (retrocompatibilidad)
  }

  return {
    id: msg.id,
    lead_id: msg.lead_id,
    subject: msg.subject,
    sender: msg.sender,
    created_at: msg.created_at,
    bodyText: msg.body,
    to_email: defaultTo,
    cc: '',
    direction: defaultDirection,
    is_deleted: false
  };
}

// Obtener mensajes de un lead específico
export async function getLeadMessages(leadId: string): Promise<ParsedMessage[]> {
  const supabase = await createClient();
  
  // Obtener email del lead para usarlo como default en el parseo
  const { data: lead } = await supabase
    .from('leads')
    .select('email')
    .eq('id', leadId)
    .single();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  const email = lead?.email || '';
  return (data || []).map(msg => parseMessageBody(msg, email));
}

// Obtener todos los mensajes en el sistema para la bandeja global
export async function getAllMessages(): Promise<ParsedMessage[]> {
  const supabase = await createClient();

  // Obtener leads para mapear sus correos
  const { data: leads } = await supabase
    .from('leads')
    .select('id, email');

  const leadEmailMap = new Map<string, string>();
  leads?.forEach(l => {
    if (l.email) leadEmailMap.set(l.id, l.email);
  });

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all messages:', error);
    return [];
  }

  return (data || []).map(msg => {
    const leadEmail = leadEmailMap.get(msg.lead_id) || '';
    return parseMessageBody(msg, leadEmail);
  });
}

// Cambiar el estado eliminado (Mover a Papelera / Restaurar)
export async function toggleMessageDeleted(messageId: string, isDeleted: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  try {
    const { data: msg, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single();
      
    if (fetchError || !msg) {
      throw new Error(fetchError?.message || 'Mensaje no encontrado');
    }

    let parsedBody;
    try {
      const rawBody = msg.body.trim();
      if (rawBody.startsWith('{') && rawBody.endsWith('}')) {
        parsedBody = JSON.parse(rawBody);
      }
    } catch (e) {}

    if (!parsedBody || typeof parsedBody.body !== 'string') {
      // Si era texto plano, lo convertimos a la estructura JSON
      const isOutbound = msg.sender.includes('ventas@sanpedro.com.mx') || 
                         msg.sender.includes('admin@sanpedro.com.mx') || 
                         msg.sender.includes('ventas@sanpedro.aionia.com.mx') || 
                         msg.sender.includes('admin@sanpedro.aionia.com.mx') || 
                         msg.sender.includes('onboarding@resend.dev');
      parsedBody = {
        body: msg.body,
        to_email: isOutbound ? '' : 'ventas@sanpedro.aionia.com.mx',
        cc: '',
        direction: isOutbound ? 'outbound' : 'inbound',
      };
    }

    parsedBody.is_deleted = isDeleted;

    const { error: updateError } = await supabase
      .from('messages')
      .update({ body: JSON.stringify(parsedBody) })
      .eq('id', messageId);

    if (updateError) throw updateError;

    revalidatePath('/admin/correo');
    return { success: true };
  } catch (err: any) {
    console.error('Error toggling message deleted:', err);
    return { success: false, error: err.message || 'Error al actualizar el estado del mensaje.' };
  }
}

// Eliminar mensaje permanentemente de la base de datos
export async function deleteMessagePermanent(messageId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;

    revalidatePath('/admin/correo');
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting message permanently:', err);
    return { success: false, error: err.message || 'Error al borrar el correo.' };
  }
}

// Responder a un correo (Outbound)
export async function sendEmailResponse(
  leadId: string,
  toEmail: string,
  subject: string,
  bodyText: string,
  ccEmail: string = ''
): Promise<{ success: boolean; error?: string }> {
  if (!resendApiKey) {
    console.error('Error: RESEND_API_KEY environment variable is missing.');
    return { success: false, error: 'Clave API de Resend no configurada.' };
  }

  const supabase = await createClient();
  
  // Obtener el usuario autenticado actual para configurar remitente y firma de manera dinámica
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || '';
  
  let senderName = 'Salones San Pedro';
  let senderEmail = 'ventas@sanpedro.aionia.com.mx';
  let replyToEmail = 'ventas@sanpedro.aionia.com.mx';
  
  if (userEmail === 'ventas@sanpedro.com.mx' || userEmail === 'ventas@sanpedro.aionia.com.mx') {
    senderName = 'Samantha Flores';
    senderEmail = 'ventas@sanpedro.aionia.com.mx';
    replyToEmail = 'ventas@sanpedro.aionia.com.mx';
  } else if (userEmail === 'admin@sanpedro.com.mx' || userEmail === 'admin@sanpedro.aionia.com.mx') {
    senderName = 'José Martinez';
    senderEmail = 'admin@sanpedro.aionia.com.mx';
    replyToEmail = 'admin@sanpedro.aionia.com.mx';
  } else if (userEmail === 'juangarcia@ccurity.com.mx') {
    senderName = 'Juan García';
    // Se usa un email bajo el dominio verificado sanpedro.aionia.com.mx para pasar la autorización de Resend
    senderEmail = 'admin@sanpedro.aionia.com.mx';
    replyToEmail = 'juangarcia@ccurity.com.mx';
  } else if (userEmail) {
    const namePart = userEmail.split('@')[0];
    senderName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    senderEmail = `${namePart}@sanpedro.aionia.com.mx`;
    replyToEmail = userEmail;
  }

  const resend = new Resend(resendApiKey);
  let sender = `${senderName} <${senderEmail}>`;
  const htmlContent = bodyText.replace(/\n/g, '<br />');

  try {
    // Preparar opciones de Resend
    const sendOptions: any = {
      from: sender,
      to: toEmail,
      subject: subject,
      html: htmlContent,
      replyTo: replyToEmail,
    };

    if (ccEmail.trim()) {
      // Resend acepta emails separados por coma o array
      sendOptions.cc = ccEmail.split(',').map(e => e.trim());
    }

    // Enviar correo usando Resend
    let response = await resend.emails.send(sendOptions);

    // Si falla por dominio no verificado, hacer fallback a onboarding@resend.dev
    if (response.error) {
      const errMsg = response.error.message.toLowerCase();
      if (
        errMsg.includes('domain') ||
        errMsg.includes('verify') ||
        errMsg.includes('restrict') ||
        errMsg.includes('authorized')
      ) {
        sender = 'Salones San Pedro <onboarding@resend.dev>';
        sendOptions.from = sender;
        response = await resend.emails.send(sendOptions);
        if (response.error) {
          const fbMsg = response.error.message.toLowerCase();
          if (
            fbMsg.includes('onboarding') ||
            fbMsg.includes('verify') ||
            fbMsg.includes('domain') ||
            fbMsg.includes('restrict') ||
            fbMsg.includes('authorized')
          ) {
            throw new Error('No se pudo enviar el correo porque el dominio "sanpedro.aionia.com.mx" no está verificado en Resend. Además, el correo de prueba (onboarding@resend.dev) solo permite enviar correos a la dirección registrada del propietario de la cuenta de Resend. Por favor, verifica tu dominio en el panel de Resend.');
          }
          throw response.error;
        }
      } else {
        throw response.error;
      }
    }

    // Guardar en base de datos encapsulado en JSON
    const supabase = await createClient();
    const finalBodyJson = JSON.stringify({
      body: bodyText,
      to_email: toEmail,
      cc: ccEmail,
      direction: 'outbound',
      is_deleted: false
    });

    const { error: insertError } = await supabase
      .from('messages')
      .insert([
        {
          lead_id: leadId,
          subject: subject,
          body: finalBodyJson,
          sender: sender,
        }
      ]);

    if (insertError) {
      console.error('Error inserting message log:', insertError);
    }

    // También actualizar el estado del lead a 'Contactado'
    await supabase
      .from('leads')
      .update({ status: 'Contactado' })
      .eq('id', leadId);

    revalidatePath('/admin');
    revalidatePath('/admin/correo');
    return { success: true };
  } catch (err: any) {
    console.error('Error sending email response:', err);
    return { success: false, error: err.message || 'Error desconocido al enviar correo.' };
  }
}

// Redactar un correo nuevo desde cero (Compose)
export async function sendNewEmail(
  toEmail: string,
  subject: string,
  bodyText: string,
  ccEmail: string = ''
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  try {
    // Buscar si existe un lead con este correo electrónico
    let { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', toEmail)
      .limit(1)
      .maybeSingle();

    let leadId = lead?.id;

    // Si no existe, creamos un lead "dummy" para vincular el mensaje
    if (!leadId) {
      const { data: newLead, error: createLeadErr } = await supabase
        .from('leads')
        .insert([
          {
            event_type: 'Contacto Directo',
            guests_count: 0,
            event_date: new Date().toISOString().split('T')[0],
            phone_number: 'N/A',
            email: toEmail,
            location: 'Contacto Directo Correo',
            status: 'Contactado'
          }
        ])
        .select()
        .single();

      if (createLeadErr || !newLead) {
        throw new Error(createLeadErr?.message || 'No se pudo crear un lead temporal para esta dirección de correo.');
      }
      leadId = newLead.id;
    }

    // Ahora enviamos el correo y guardamos en messages
    return await sendEmailResponse(leadId, toEmail, subject, bodyText, ccEmail);
  } catch (err: any) {
    console.error('Error in sendNewEmail:', err);
    return { success: false, error: err.message || 'Error al procesar el envío del correo.' };
  }
}

'use server';

import { Resend } from 'resend';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const resendApiKey = process.env.RESEND_API_KEY;

export interface MessageRecord {
  id: string;
  lead_id: string;
  subject: string;
  body: string;
  sender: string;
  created_at: string;
}

export async function getLeadMessages(leadId: string): Promise<MessageRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

export async function sendEmailResponse(
  leadId: string,
  toEmail: string,
  subject: string,
  bodyText: string
): Promise<{ success: boolean; error?: string }> {
  if (!resendApiKey) {
    console.error('Error: RESEND_API_KEY environment variable is missing.');
    return { success: false, error: 'Clave API de Resend no configurada.' };
  }

  const resend = new Resend(resendApiKey);
  let sender = 'Salones San Pedro <ventas@ccurity.com.mx>';
  const htmlContent = bodyText.replace(/\n/g, '<br />');

  try {
    // Send email using Resend
    let response = await resend.emails.send({
      from: sender,
      to: toEmail,
      subject: subject,
      html: htmlContent,
      replyTo: 'juangarcia@ccurity.com.mx',
    });

    // Check for errors (e.g. unverified domain) and fallback to onboarding@resend.dev
    if (response.error) {
      const errMsg = response.error.message.toLowerCase();
      if (errMsg.includes('domain') || errMsg.includes('verify') || errMsg.includes('restrict')) {
        sender = 'Salones San Pedro <onboarding@resend.dev>';
        response = await resend.emails.send({
          from: sender,
          to: toEmail,
          subject: subject,
          html: htmlContent,
          replyTo: 'juangarcia@ccurity.com.mx',
        });
        if (response.error) {
          throw response.error;
        }
      } else {
        throw response.error;
      }
    }

    // Connect to Supabase to save message log
    const supabase = await createClient();
    const { error: insertError } = await supabase
      .from('messages')
      .insert([
        {
          lead_id: leadId,
          subject: subject,
          body: bodyText,
          sender: sender,
        }
      ]);

    if (insertError) {
      console.error('Error inserting message log:', insertError);
    }

    // Also mark the lead status as 'Contactado'
    await supabase
      .from('leads')
      .update({ status: 'Contactado' })
      .eq('id', leadId);

    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('Error sending email response:', err);
    return { success: false, error: err.message || 'Error desconocido al enviar correo.' };
  }
}

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    
    // Verificar la firma de Resend Webhook (Svix) si está configurado
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret) {
      const svix_id = request.headers.get("svix-id");
      const svix_timestamp = request.headers.get("svix-timestamp");
      const svix_signature = request.headers.get("svix-signature");

      if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error('Faltan encabezados de firma de Svix.');
        return NextResponse.json({ success: false, error: 'Faltan encabezados de firma de Svix' }, { status: 401 });
      }

      const wh = new Webhook(webhookSecret);
      try {
        wh.verify(rawBody, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        });
      } catch (err: any) {
        console.error('Firma de webhook inválida:', err.message);
        return NextResponse.json({ success: false, error: 'Firma inválida' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log('Webhook de Resend recibido y verificado:', JSON.stringify(payload));

    const eventType = payload.type;
    
    // Solo nos interesan los correos recibidos
    if (eventType !== 'email.received') {
      console.log(`Evento de tipo "${eventType}" ignorado.`);
      return NextResponse.json({ success: true, message: 'Evento ignorado' });
    }

    const data = payload.data;
    if (!data) {
      return NextResponse.json({ success: false, error: 'Falta el objeto "data" en el payload.' }, { status: 400 });
    }

    const emailId = data.email_id;
    const from = data.from; // Ej: "Juan Perez <juan@example.com>"
    const subject = data.subject || 'Sin asunto';

    if (!from) {
      return NextResponse.json({ success: false, error: 'Falta el campo "from" en los datos del correo.' }, { status: 400 });
    }

    // Extraer el correo electrónico limpio
    const emailRegex = /<([^>]+)>/;
    const match = from.match(emailRegex);
    const cleanEmail = match ? match[1].trim() : from.trim();

    if (!cleanEmail) {
      return NextResponse.json({ success: false, error: 'No se pudo extraer la dirección de correo.' }, { status: 400 });
    }

    console.log(`Procesando correo de: ${cleanEmail}, ID de Correo: ${emailId}`);

    // Obtener el cuerpo del correo desde Resend
    let bodyText = '';
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && emailId) {
      const resend = new Resend(resendApiKey);
      try {
        const { data: emailContent, error: emailError } = await resend.emails.receiving.get(emailId);
        if (emailError) {
          console.error('Error al recuperar correo de Resend (receiving.get):', emailError);
          // Intentar con get tradicional por si acaso
          const { data: emailContentFallback, error: emailErrorFallback } = await resend.emails.get(emailId);
          if (emailErrorFallback) {
            console.error('Error al recuperar correo de Resend (emails.get):', emailErrorFallback);
          } else if (emailContentFallback) {
            bodyText = emailContentFallback.text || emailContentFallback.html || '';
          }
        } else if (emailContent) {
          bodyText = emailContent.text || emailContent.html || '';
        }
      } catch (err) {
        console.error('Excepción al consultar correo en Resend:', err);
      }
    }

    if (!bodyText) {
      bodyText = '[No se pudo recuperar el contenido del cuerpo del correo electrónico desde Resend]';
    }

    // Inicializar cliente de Supabase usando la clave de rol de servicio para saltar RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Faltan variables de entorno de Supabase.');
      return NextResponse.json({ success: false, error: 'Configuración de base de datos incompleta' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar si ya existe un lead con este correo (case-insensitive)
    const { data: existingLeads, error: searchError } = await supabase
      .from('leads')
      .select('*')
      .ilike('email', cleanEmail)
      .order('created_at', { ascending: false });

    if (searchError) {
      console.error('Error al buscar lead existente:', searchError);
      return NextResponse.json({ success: false, error: searchError.message }, { status: 500 });
    }

    let leadId = '';

    if (existingLeads && existingLeads.length > 0) {
      // Encontrado: asociamos el mensaje a este lead
      const lead = existingLeads[0];
      leadId = lead.id;
      console.log(`Lead existente encontrado (ID: ${leadId}). Actualizando estado y asociando mensaje.`);

      // Actualizar estado del lead a 'Nuevo' para notificar que hay novedades
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: 'Nuevo' })
        .eq('id', leadId);

      if (updateError) {
        console.error('Error al actualizar estado del lead:', updateError);
      }
    } else {
      // No encontrado: creamos un nuevo lead para este cliente
      console.log(`No se encontró un lead existente para ${cleanEmail}. Creando nuevo lead de Consulta General.`);
      
      const today = new Date().toISOString().split('T')[0];
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert([
          {
            event_type: 'Consulta General (Email)',
            guests_count: 0,
            event_date: today,
            phone_number: 'N/A',
            email: cleanEmail,
            location: 'Email Inbound',
            status: 'Nuevo'
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error al crear nuevo lead:', insertError);
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }

      if (newLead) {
        leadId = newLead.id;
      }
    }

    // Registrar el mensaje en la base de datos
    if (leadId) {
      // Estructuramos el cuerpo como JSON para que sea consumido correctamente por el MailboxClient
      const structuredBody = JSON.stringify({
        body: bodyText,
        to_email: 'ventas@sanpedro.aionia.com.mx',
        cc: '',
        direction: 'inbound',
        is_deleted: false
      });

      const { error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            lead_id: leadId,
            subject: subject,
            body: structuredBody,
            sender: from // Guardamos el remitente completo (ej: Nombre <email>)
          }
        ]);

      if (messageError) {
        console.error('Error al insertar el mensaje en la base de datos:', messageError);
        return NextResponse.json({ success: false, error: messageError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Correo procesado y registrado correctamente' });
  } catch (err: any) {
    console.error('Error general en webhook de Resend:', err);
    return NextResponse.json({ success: false, error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}

'use server';

import { createClient } from '@supabase/supabase-js';

export async function submitLead(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase environment variables are missing.');
    return { success: false, error: 'La configuración de la base de datos no está completa.' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const event_type = formData.get('eventType') as string;
  const guests_count = parseInt(formData.get('guestsCount') as string);
  const event_date = formData.get('eventDate') as string;
  const phone_number = formData.get('phoneNumber') as string;
  const email = formData.get('email') as string;
  const location = formData.get('location') as string;
  const name = (formData.get('name') as string) || '';
  const salon = formData.get('salon') as string;
  const package_type = formData.get('package_type') as string;
  const estimated_total = parseFloat(formData.get('estimated_total') as string) || null;
  const extra_service = formData.get('extra_service') as string;

  try {
    const { data: leadData, error } = await supabase.from('leads').insert([
      {
        event_type,
        guests_count,
        event_date,
        phone_number,
        email,
        location,
        name,
        salon,
        package_type,
        estimated_total,
        extra_service,
        status: 'Nuevo'
      }
    ]).select();

    if (error) {
      console.error('Error insertando lead:', error);
      return { success: false, error: error.message };
    }

    if (leadData && leadData.length > 0) {
      const leadId = leadData[0].id;
      
      const initialMessageBody = JSON.stringify({
        body: `Hola,\n\nMe gustaría solicitar información y verificar disponibilidad para mi evento.\n\nDetalles del prospecto:\n- Nombre: ${name}\n- Tipo de evento: ${event_type.toUpperCase()}\n- Cantidad de invitados: ${guests_count} personas\n- Fecha estimada: ${event_date}\n- Teléfono de contacto: ${phone_number}\n- Correo: ${email}\n- Información de Cotización:\n  ${location}\n\nQuedo a la espera de su amable respuesta.\n\nSaludos,\n${name || email}`,
        to_email: 'ventas@sanpedro.aionia.com.mx',
        cc: '',
        direction: 'inbound',
        is_deleted: false
      });

      const { error: msgError } = await supabase.from('messages').insert([
        {
          lead_id: leadId,
          subject: `Consulta de Disponibilidad: ${event_type.toUpperCase()}`,
          body: initialMessageBody,
          sender: email
        }
      ]);

      if (msgError) {
        console.error('Error insertando mensaje inicial:', msgError);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Catch error:', error);
    return { success: false, error: error.message };
  }
}

'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Usamos service_role temporalmente si no tenemos políticas públicas
const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitLead(formData: FormData) {
  const event_type = formData.get('eventType') as string;
  const guests_count = parseInt(formData.get('guestsCount') as string);
  const event_date = formData.get('eventDate') as string;
  const phone_number = formData.get('phoneNumber') as string;

  try {
    const { error } = await supabase.from('leads').insert([
      {
        event_type,
        guests_count,
        event_date,
        phone_number,
        status: 'Nuevo'
      }
    ]);

    if (error) {
      console.error('Error insertando lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Catch error:', error);
    return { success: false, error: error.message };
  }
}

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

'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function updateLeadStatus(id: string, currentStatus: string): Promise<void> {
  const supabase = await createClient();
  const newStatus = currentStatus === 'Nuevo' ? 'Contactado' : 'Nuevo';

  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Error updating status:', error);
    return;
  }

  revalidatePath('/admin');
}

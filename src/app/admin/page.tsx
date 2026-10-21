import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { parseAnalyticsRow, ParsedAnalyticsEvent, RawAnalyticsRow } from '@/utils/telemetryParser';
import AdminDashboardClient, { LeadRecord } from '@/components/AdminDashboardClient';

export const revalidate = 0; // Datos en tiempo real en cada recarga

export default async function AdminPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  let parsedEvents: ParsedAnalyticsEvent[] = [];
  let leads: LeadRecord[] = [];
  let errorMessage: string | null = null;

  if (supabase) {
    const [eventsRes, leadsRes] = await Promise.all([
      supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5000),
      supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500),
    ]);

    if (eventsRes.error) {
      errorMessage = eventsRes.error.message;
    } else if (eventsRes.data) {
      parsedEvents = (eventsRes.data as RawAnalyticsRow[]).map((row) => parseAnalyticsRow(row));
    }

    if (!leadsRes.error && leadsRes.data) {
      leads = leadsRes.data as LeadRecord[];
    }
  } else {
    errorMessage =
      'Las credenciales de Supabase no están configuradas en las variables de entorno del servidor.';
  }

  return (
    <AdminDashboardClient
      events={parsedEvents}
      leads={leads}
      errorMessage={errorMessage}
    />
  );
}

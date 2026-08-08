import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, source, path } = body;

    if (!event_type || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, source' },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const user_agent = headersList.get('user-agent') || 'Unknown';

    const supabase = await createClient();

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        source,
        path,
        user_agent
      });

    if (error) {
      console.error('Error tracking analytics event:', error);
      return NextResponse.json(
        { error: 'Failed to record event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Error in /track:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

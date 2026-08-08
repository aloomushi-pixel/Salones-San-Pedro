export const trackEvent = async (eventType: string, source: string) => {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        source: source,
        path: window.location.pathname,
      }),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

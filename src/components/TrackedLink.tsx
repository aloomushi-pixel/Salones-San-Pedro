'use client';

import React from 'react';
import { trackEvent } from '@/utils/trackEvent';

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventType: string;
  source: string;
  children: React.ReactNode;
}

const PKG_PRICES: Record<string, number> = {
  Premier: 530,
  Plus: 710,
  'All Inclusive': 1010,
};

function getGuestsBucketLabel(count: number): string {
  if (count < 100) return '50 a 99 personas';
  if (count < 150) return '100 a 149 personas';
  if (count < 200) return '150 a 199 personas';
  return '200 o más personas';
}

export default function TrackedLink({ eventType, source, onClick, ...props }: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    let draftMeta: Record<string, unknown> | undefined;

    if (eventType === 'whatsapp_click' && typeof window !== 'undefined') {
      try {
        const rawDraft = window.sessionStorage.getItem('sanpedro_precotizador_draft_v1');
        if (rawDraft) {
          const parsed = JSON.parse(rawDraft);
          const guests = typeof parsed.guests === 'number' ? parsed.guests : 80;
          const activeInteraction = Boolean(
            parsed.hasTouchedGuests || (typeof parsed.step === 'number' && parsed.step >= 2)
          );

          if (activeInteraction && guests >= 50 && guests <= 250) {
            const pkgType = typeof parsed.packageType === 'string' ? parsed.packageType : 'Premier';
            const eventKind = typeof parsed.eventKind === 'string' ? parsed.eventKind : 'Evento Social';
            const preferredDay = typeof parsed.preferredDay === 'string' ? parsed.preferredDay : 'Sábado';
            const preferredSeason =
              typeof parsed.preferredSeason === 'string'
                ? parsed.preferredSeason
                : 'Temporada Alta / Fin de Año (Oct-Dic)';
            const comboVip = Boolean(parsed.comboVipActive);
            const unitPrice = PKG_PRICES[pkgType] || 530;
            const estimatedBudget =
              guests * unitPrice + (comboVip && pkgType !== 'All Inclusive' ? 11500 : 0);

            draftMeta = {
              section: source,
              guests_range: getGuestsBucketLabel(guests),
              package_name: `Paquete ${pkgType}`,
              event_kind: eventKind,
              preferred_day: preferredDay,
              preferred_season: preferredSeason,
              extra: {
                exact_guests: guests,
                combo_vip: comboVip,
                estimated_budget: estimatedBudget,
                draft_attached_from: source,
              },
            };

            if (
              source === 'floating_button' ||
              source === 'header_nav' ||
              source === 'footer_ubicacion_whatsapp'
            ) {
              const customMsg = `¡Hola Salones San Pedro Plus! Estuve cotizando mi evento en su sitio web:\n• *Tipo de evento:* ${eventKind}\n• *Invitados:* ${guests} personas\n• *Día preferido:* ${preferredDay} (${preferredSeason})\n• *Paquete de interés:* Paquete ${pkgType}${
                comboVip ? ' + Combo Fiesta VIP' : ''
              }\n• *Presupuesto estimado:* $${estimatedBudget.toLocaleString(
                'es-MX'
              )} MXN\n\n¿Me podrían confirmar disponibilidad de fecha y agendar visita?`;
              e.currentTarget.href = `https://wa.me/526633670431?text=${encodeURIComponent(
                customMsg
              )}`;
            }
          }
        }
      } catch {
        // Ignorar errores de lectura de sessionStorage
      }
    }

    trackEvent(eventType, source, draftMeta);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a onClick={handleClick} {...props}>
      {props.children}
    </a>
  );
}

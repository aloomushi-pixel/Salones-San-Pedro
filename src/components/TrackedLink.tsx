'use client';

import React from 'react';
import { trackEvent } from '@/utils/trackEvent';

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventType: string;
  source: string;
  children: React.ReactNode;
}

export default function TrackedLink({ eventType, source, onClick, ...props }: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventType, source);
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

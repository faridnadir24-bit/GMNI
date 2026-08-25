'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationBadgeProps {
  location: string;
  district?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function LocationBadge({
  location,
  district,
  className = '',
  size = 'md'
}: LocationBadgeProps) {
  const isSm = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-1.5 text-ink-secondary ${className}`}>
      <MapPin className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-ink-tertiary shrink-0`} strokeWidth={2} />
      <span className={`${isSm ? 'text-[11px]' : 'text-xs'} font-medium text-ink-primary`}>
        {location}
      </span>
      {district && (
        <>
          <span className="text-border">·</span>
          <span className={`${isSm ? 'text-[11px]' : 'text-xs'} text-ink-secondary`}>
            {district.replace('Kec. ', 'Kecamatan ')}
          </span>
        </>
      )}
    </div>
  );
}

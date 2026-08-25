'use client';

import React from 'react';
import { IssueStatus } from '@/types';

interface StatusBadgeProps {
  status: IssueStatus | string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = (st: string) => {
    switch (st) {
      case 'Developing':
        return { dotColor: 'bg-amber-600', label: 'Developing' };
      case 'Confirmed':
        return { dotColor: 'bg-emerald-600', label: 'Confirmed' };
      case 'Monitoring':
        return { dotColor: 'bg-blue-600', label: 'Monitoring' };
      case 'Emerging':
        return { dotColor: 'bg-purple-600', label: 'Emerging' };
      case 'Archived':
        return { dotColor: 'bg-stone-400', label: 'Archived' };
      default:
        return { dotColor: 'bg-stone-500', label: st };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-ink-primary border border-border ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}

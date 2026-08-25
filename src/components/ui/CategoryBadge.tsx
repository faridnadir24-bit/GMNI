'use client';

import React from 'react';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-ink-secondary border border-border/80 ${className}`}>
      {category}
    </span>
  );
}

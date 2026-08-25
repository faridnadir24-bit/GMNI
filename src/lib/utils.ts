import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateIndo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatScoreColor(score: number): {
  badge: string;
  text: string;
  bg: string;
  border: string;
} {
  if (score >= 80) {
    return {
      badge: "bg-red-50 text-red-700 border-red-200",
      text: "text-red-700",
      bg: "bg-red-500",
      border: "border-red-500",
    };
  }
  if (score >= 60) {
    return {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      text: "text-amber-700",
      bg: "bg-amber-500",
      border: "border-amber-500",
    };
  }
  return {
    badge: "bg-slate-50 text-slate-700 border-slate-200",
    text: "text-slate-600",
    bg: "bg-slate-400",
    border: "border-slate-400",
  };
}

export function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case 'Emerging':
      return 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20';
    case 'Monitoring':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20';
    case 'Developing':
      return 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-500/20';
    case 'Confirmed':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-1 ring-emerald-500/20';
    case 'Archived':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

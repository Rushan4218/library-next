import React from 'react';
import { BookStatus, BorrowStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: BookStatus | BorrowStatus | string;
  type?: 'book' | 'borrow';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'book', size = 'md' }) => {
  let colorClasses = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  let dotColor = 'bg-gray-400';
  let label = status.replace('_', ' ');

  if (type === 'book') {
    switch (status) {
      case 'AVAILABLE':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60';
        dotColor = 'bg-emerald-500';
        break;
      case 'BORROWED':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60';
        dotColor = 'bg-amber-500';
        break;
      case 'MAINTENANCE':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60';
        dotColor = 'bg-rose-500';
        break;
      case 'RESERVED':
        colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60';
        dotColor = 'bg-indigo-500';
        break;
    }
  } else {
    switch (status) {
      case 'PENDING_PICKUP':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60';
        dotColor = 'bg-amber-500 animate-pulse';
        label = 'Pending Pickup';
        break;
      case 'FULFILLED':
        colorClasses = 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60';
        dotColor = 'bg-sky-500';
        label = 'Fulfilled (Issued)';
        break;
      case 'RETURNED':
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60';
        dotColor = 'bg-emerald-500';
        label = 'Returned';
        break;
      case 'CANCELLED':
        colorClasses = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
        dotColor = 'bg-slate-400';
        label = 'Cancelled';
        break;
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border shadow-xs tracking-wide ${colorClasses} ${sizeClasses}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
};

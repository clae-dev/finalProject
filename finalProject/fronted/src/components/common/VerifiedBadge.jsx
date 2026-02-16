import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function VerifiedBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold ${className}`}>
      <ShieldCheck className="w-3.5 h-3.5" />
      인증됨
    </span>
  );
}

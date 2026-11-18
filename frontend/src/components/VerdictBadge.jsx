import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Accessible verdict badge showing color, icon, and text together (ensuring contrast >= 4.5:1).
 * @param {object} props - Component props.
 * @param {'safe'|'suspicious'|'scam'} props.verdict - Normalized verdict key.
 * @param {string} [props.verdictBn] - Localized verdict text from backend.
 * @param {string} [props.size='large'] - Visual sizing ('large' or 'compact').
 * @returns {JSX.Element} Multimodal verdict badge.
 */
export function VerdictBadge({ verdict = 'suspicious', verdictBn, size = 'large' }) {
  const { t } = useT();

  const configs = {
    safe: {
      label: verdictBn || t('verdict_safe'),
      colorClasses: 'bg-emerald-50 text-[#1B7F3B] border-2 border-[#1B7F3B]',
      icon: (
        <svg className={size === 'large' ? 'w-7 h-7' : 'w-4 h-4'} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    suspicious: {
      label: verdictBn || t('verdict_suspicious'),
      colorClasses: 'bg-amber-50 text-[#B7791F] border-2 border-[#B7791F]',
      icon: (
        <svg className={size === 'large' ? 'w-7 h-7' : 'w-4 h-4'} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    scam: {
      label: verdictBn || t('verdict_scam'),
      colorClasses: 'bg-red-50 text-[#C0262D] border-2 border-[#C0262D]',
      icon: (
        <svg className={size === 'large' ? 'w-7 h-7' : 'w-4 h-4'} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const current = configs[verdict] || configs.suspicious;
  const paddingClass = size === 'large' ? 'px-4 py-2.5 text-xl font-extrabold gap-2.5 rounded-2xl' : 'px-2.5 py-1 text-xs font-bold gap-1.5 rounded-lg';

  return (
    <span
      role="status"
      className={`inline-flex items-center shadow-xs select-none ${paddingClass} ${current.colorClasses}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}

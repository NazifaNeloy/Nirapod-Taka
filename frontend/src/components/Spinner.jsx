import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Accessible loading indicator with spinning animation and Bangla status text.
 * @param {object} props - Component props.
 * @param {string} [props.text] - Optional custom status text.
 * @returns {JSX.Element} Centered loading spinner.
 */
export function Spinner({ text }) {
  const { t } = useT();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-8 space-y-3 min-h-[200px]"
    >
      <div className="w-10 h-10 border-4 border-[#D5E0D9] border-t-[#0F5C3A] rounded-full animate-spin" aria-hidden="true" />
      <span className="text-sm font-medium text-[#14211B] bangla-text">
        {text || t('loading')}
      </span>
    </div>
  );
}

import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Accessible toggle button to switch between Bangla and English across the application.
 * @returns {JSX.Element} Interactive language switch button.
 */
export function LangToggle() {
  const { language, toggleLanguage, t } = useT();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t('lang_label')}
      className="touch-target inline-flex items-center justify-center px-3 py-2 rounded-lg border border-[#D5E0D9] bg-white text-[#14211B] text-sm font-semibold shadow-xs hover:bg-[#F5FAF7] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] focus:ring-offset-2 transition-colors cursor-pointer select-none"
    >
      <span className={language === 'bn' ? 'font-bold text-[#0F5C3A]' : 'text-gray-500'}>
        বাং
      </span>
      <span className="mx-1 text-gray-400">/</span>
      <span className={language === 'en' ? 'font-bold text-[#0F5C3A]' : 'text-gray-500'}>
        EN
      </span>
    </button>
  );
}

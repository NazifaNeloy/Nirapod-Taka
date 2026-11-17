import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Placeholder Scam Quiz page (P2) awaiting Brief 3.9 implementation.
 * @returns {JSX.Element} Quiz placeholder view.
 */
export default function Quiz() {
  const { t } = useT();

  return (
    <section aria-labelledby="quiz-heading" className="space-y-6">
      <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs text-center space-y-4">
        <h1 id="quiz-heading" className="text-2xl font-bold text-[#0F5C3A]">
          {t('nav_quiz')}
        </h1>
        <div className="p-4 bg-[#F5FAF7] border border-[#D5E0D9] rounded-xl text-sm text-gray-600">
          {t('placeholder_quiz')}
        </div>
      </div>
    </section>
  );
}

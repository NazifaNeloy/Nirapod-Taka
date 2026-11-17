import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Placeholder Ask-Before-You-Pay Assistant page awaiting Brief 3.7 implementation.
 * @returns {JSX.Element} Ask assistant placeholder view.
 */
export default function Ask() {
  const { t } = useT();

  return (
    <section aria-labelledby="ask-heading" className="space-y-6">
      <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs text-center space-y-4">
        <h1 id="ask-heading" className="text-2xl font-bold text-[#0F5C3A]">
          {t('nav_ask')}
        </h1>
        <div className="p-4 bg-[#F5FAF7] border border-[#D5E0D9] rounded-xl text-sm text-gray-600">
          {t('placeholder_ask')}
        </div>
      </div>
    </section>
  );
}

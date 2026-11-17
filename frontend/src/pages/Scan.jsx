import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Placeholder Screenshot Scan page awaiting Brief 3.6 implementation.
 * @returns {JSX.Element} Scan placeholder view.
 */
export default function Scan() {
  const { t } = useT();

  return (
    <section aria-labelledby="scan-heading" className="space-y-6">
      <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs text-center space-y-4">
        <h1 id="scan-heading" className="text-2xl font-bold text-[#0F5C3A]">
          {t('nav_scan')}
        </h1>
        <div className="p-4 bg-[#F5FAF7] border border-[#D5E0D9] rounded-xl text-sm text-gray-600">
          {t('placeholder_scan')}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Standard footer rendered on every screen displaying mandatory ethical demo disclaimer.
 * @returns {JSX.Element} Semantic footer component.
 */
export function Footer() {
  const { t } = useT();

  return (
    <footer role="contentinfo" className="w-full border-t border-[#D5E0D9] bg-white py-6 px-4 mt-auto mb-16 md:mb-0">
      <div className="max-w-[720px] mx-auto text-center space-y-2">
        <p className="text-sm font-medium text-gray-700 leading-relaxed">
          {t('demo_disclaimer')}
        </p>
        <p className="text-xs text-gray-500">
          {t('app_name')} &bull; {t('app_tagline')}
        </p>
      </div>
    </footer>
  );
}

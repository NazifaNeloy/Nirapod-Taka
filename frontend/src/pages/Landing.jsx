import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT.jsx';

/**
 * Placeholder Landing page awaiting Brief 3.1 implementation.
 * @returns {JSX.Element} Landing placeholder view.
 */
export default function Landing() {
  const { t } = useT();

  return (
    <section aria-labelledby="landing-heading" className="space-y-6">
      <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs text-center space-y-4">
        <h1 id="landing-heading" className="text-2xl font-bold text-[#0F5C3A]">
          {t('app_name')}
        </h1>
        <p className="text-gray-700 bangla-text text-base">
          {t('app_tagline')}
        </p>
        <div className="p-4 bg-[#F5FAF7] border border-[#D5E0D9] rounded-xl text-sm text-gray-600">
          {t('placeholder_landing')}
        </div>
        <div>
          <Link
            to="/check"
            className="touch-target inline-flex items-center justify-center w-full big-button bg-[#0F5C3A] text-white hover:bg-[#0b452b] transition-all cursor-pointer font-semibold shadow-xs"
          >
            {t('nav_check')}
          </Link>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Placeholder Login page awaiting Brief 3.4 implementation.
 * @returns {JSX.Element} Login placeholder view.
 */
export default function Login() {
  const { t } = useT();

  return (
    <section aria-labelledby="login-heading" className="space-y-6">
      <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs text-center space-y-4">
        <h1 id="login-heading" className="text-2xl font-bold text-[#0F5C3A]">
          {t('nav_login')}
        </h1>
        <div className="p-4 bg-[#F5FAF7] border border-[#D5E0D9] rounded-xl text-sm text-gray-600">
          {t('placeholder_login')}
        </div>
      </div>
    </section>
  );
}

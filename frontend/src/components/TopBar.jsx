import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT.jsx';
import { LangToggle } from './LangToggle.jsx';

/**
 * Global TopBar navigation header displaying application brand, language toggle, and auth link.
 * @returns {JSX.Element} Top navigation bar.
 */
export function TopBar() {
  const { t } = useT();

  return (
    <header role="banner" className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xs border-b border-[#D5E0D9] shadow-xs">
      <div className="max-w-[720px] mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* App Brand */}
        <Link
          to="/"
          className="touch-target flex items-center gap-2 text-decoration-none focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] rounded-lg px-1"
          aria-label={t('app_name')}
        >
          <div className="w-9 h-9 rounded-full bg-[#0F5C3A] flex items-center justify-center text-white shrink-0 shadow-xs" aria-hidden="true">
            {/* Inline Shield SVG */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#0F5C3A] leading-tight tracking-tight">
              {t('app_name')}
            </span>
          </div>
        </Link>

        {/* Right Actions: LangToggle + Login/Profile */}
        <div className="flex items-center gap-2">
          <LangToggle />
          
          <Link
            to="/login"
            className="touch-target inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-[#0F5C3A] hover:bg-[#F5FAF7] rounded-lg border border-transparent hover:border-[#D5E0D9] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] transition-colors"
          >
            {t('nav_login')}
          </Link>
        </div>
      </div>
    </header>
  );
}

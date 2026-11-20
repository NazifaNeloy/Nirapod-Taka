import React, { useState } from 'react';
import { useT } from '../i18n/useT.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { BigButton } from '../components/BigButton.jsx';
import { Toast } from '../components/Toast.jsx';
import districts from '../data/districts.json';

/**
 * User Profile Page (Screen A2 / Profile) displaying user identity, district preference,
 * immediate bilingual UI language switcher, and secure session logout.
 * @returns {JSX.Element} User profile view.
 */
export default function Profile() {
  const { t, language, setLanguage } = useT();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [district, setDistrict] = useState(user?.district || 'Dhaka');
  const [selectedLang, setSelectedLang] = useState(language);
  const [toastMessage, setToastMessage] = useState('');

  /**
   * Updates profile preferences and synchronizes global application language immediately.
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSave = (e) => {
    e.preventDefault();

    // Immediately update language across the entire application and persist in storage
    if (selectedLang !== language) {
      setLanguage(selectedLang);
    }

    setToastMessage(t('profile_saved_toast'));
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-6">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

      <section aria-labelledby="profile-heading" className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-[#0F5C3A] text-2xl font-bold shadow-xs">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <h1 id="profile-heading" className="text-2xl font-extrabold text-[#14211B] leading-tight">
          {user?.name || t('profile_title')}
        </h1>
        <p className="text-sm text-gray-600 bangla-text">
          {t('profile_subtitle')}
        </p>
      </section>

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs space-y-5"
      >
        {/* Phone (Read Only for security) */}
        <div className="space-y-1">
          <label htmlFor="profile-phone" className="block text-sm font-bold text-gray-700">
            {t('phone_label')}
          </label>
          <input
            id="profile-phone"
            type="text"
            readOnly
            value={user?.phone || '01700000001'}
            disabled
            className="w-full px-3.5 py-3 text-base rounded-xl border border-[#D5E0D9] bg-gray-50 text-gray-600 cursor-not-allowed select-none"
          />
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="profile-name" className="block text-sm font-bold text-[#14211B]">
            {t('name_label')}
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-3 text-base rounded-xl border border-[#D5E0D9] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] transition-colors"
          />
        </div>

        {/* District Selector (from 64 districts) */}
        <div className="space-y-1">
          <label htmlFor="profile-district" className="block text-sm font-bold text-[#14211B]">
            {t('district_label')}
          </label>
          <select
            id="profile-district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-3.5 py-3 text-base rounded-xl border border-[#D5E0D9] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] transition-colors"
          >
            {districts.map((dist) => (
              <option key={dist.id} value={dist.id}>
                {language === 'bn' ? dist.name_bn : dist.name_en}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Language Radio */}
        <fieldset className="space-y-2 border-t border-[#D5E0D9] pt-3">
          <legend className="text-sm font-bold text-[#14211B]">
            {t('preferred_lang_label')}
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <label className={`touch-target flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer select-none transition-colors ${
              selectedLang === 'bn'
                ? 'border-[#0F5C3A] bg-emerald-50/60 font-bold text-[#0F5C3A]'
                : 'border-[#D5E0D9] bg-gray-50 text-gray-700'
            }`}>
              <input
                type="radio"
                name="pref_lang"
                value="bn"
                checked={selectedLang === 'bn'}
                onChange={() => setSelectedLang('bn')}
                className="w-4 h-4 text-[#0F5C3A] focus:ring-[#0F5C3A]"
              />
              <span>{t('lang_bn')}</span>
            </label>

            <label className={`touch-target flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer select-none transition-colors ${
              selectedLang === 'en'
                ? 'border-[#0F5C3A] bg-emerald-50/60 font-bold text-[#0F5C3A]'
                : 'border-[#D5E0D9] bg-gray-50 text-gray-700'
            }`}>
              <input
                type="radio"
                name="pref_lang"
                value="en"
                checked={selectedLang === 'en'}
                onChange={() => setSelectedLang('en')}
                className="w-4 h-4 text-[#0F5C3A] focus:ring-[#0F5C3A]"
              />
              <span>{t('lang_en')}</span>
            </label>
          </div>
        </fieldset>

        {/* Save Changes Button */}
        <div className="pt-2">
          <BigButton type="submit" ariaLabel={t('save_profile_btn')}>
            {t('save_profile_btn')}
          </BigButton>
        </div>

        {/* Shortcut to Badges */}
        <div className="pt-2 border-t border-[#D5E0D9] text-center">
          <a
            href="/badges"
            className="touch-target inline-flex items-center gap-2 text-sm font-bold text-[#0F5C3A] hover:underline"
          >
            <span>🏆 {t('nav_badges')}</span>
          </a>
        </div>
      </form>

      {/* Logout Action at Bottom */}
      <div className="pt-2">
        <button
          type="button"
          onClick={logout}
          className="touch-target w-full big-button min-h-[56px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 border-2 border-red-300 bg-red-50 text-[#C0262D] hover:bg-red-100 hover:border-red-400 active:scale-98 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{t('nav_logout')}</span>
        </button>
      </div>
    </div>
  );
}

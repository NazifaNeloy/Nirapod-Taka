import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useT } from '../i18n/useT.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { parseBanglaNumerals } from '../i18n/numerals.js';
import { BigButton } from '../components/BigButton.jsx';
import districts from '../data/districts.json';

const PHONE_REGEX = /^01[3-9][0-9]{8}$/;

/**
 * User Registration Page (Screen A2) implementing single-column responsive layout,
 * client-side field validation, accessible error bindings, and password visibility toggle.
 * @returns {JSX.Element} Register form component.
 */
export default function Register() {
  const { t, language, setLanguage } = useT();
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [preferredLang, setPreferredLang] = useState(language);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles phone input change and normalizes any Bangla numerals into Western digits.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event.
   */
  const handlePhoneChange = (e) => {
    const normalized = parseBanglaNumerals(e.target.value.trim());
    setPhone(normalized);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  /**
   * Validates registration form fields against security constraints.
   * @returns {boolean} True if form satisfies all rules.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!PHONE_REGEX.test(phone)) {
      newErrors.phone = t('phone_invalid_error');
    }

    if (!password || password.length < 8) {
      newErrors.password = t('password_min_error');
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 1 || trimmedName.length > 60) {
      newErrors.name = t('name_invalid_error');
    }

    if (!district) {
      newErrors.district = t('district_required_error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submits registration request to the server and manages tokenless session transition.
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      phone,
      password,
      name: name.trim(),
      district,
      language: preferredLang
    };

    const { success, error } = await register(payload);
    setLoading(false);

    if (success) {
      // Sync application language if user selected a different preference
      if (preferredLang !== language) {
        setLanguage(preferredLang);
      }
      const redirectTo = location.state?.from?.pathname || '/check';
      navigate(redirectTo, { replace: true });
    } else {
      setFormError(error?.message_bn || t('auth_failed_shared_error'));
      // Mandatory security rule: clear password on failed attempt
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-6">
      {/* Page Title */}
      <section aria-labelledby="register-heading" className="text-center space-y-2">
        <h1 id="register-heading" className="text-2xl md:text-3xl font-extrabold text-[#14211B] leading-tight">
          {t('auth_register_title')}
        </h1>
        <p className="text-sm text-gray-600 bangla-text">
          {t('auth_register_subtitle')}
        </p>
      </section>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs space-y-4"
      >
        {/* Form-level Error Alert */}
        {formError && (
          <div role="alert" className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-[#C0262D] font-bold flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{formError}</span>
          </div>
        )}

        {/* 1. Phone Input */}
        <div className="space-y-1">
          <label htmlFor="reg-phone" className="block text-sm font-bold text-[#14211B]">
            {t('phone_label')} <span className="text-[#C0262D]">*</span>
          </label>
          <input
            id="reg-phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={t('phone_placeholder')}
            aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
            aria-invalid={Boolean(errors.phone)}
            disabled={loading}
            className={`w-full px-3.5 py-3 text-base rounded-xl border focus:outline-hidden focus:ring-2 transition-colors ${
              errors.phone
                ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                : 'border-[#D5E0D9] focus:ring-[#0F5C3A]'
            }`}
          />
          {errors.phone && (
            <p id="reg-phone-error" role="alert" className="text-xs text-[#C0262D] font-semibold pt-0.5">
              {errors.phone}
            </p>
          )}
        </div>

        {/* 2. Password with Show/Hide Toggle */}
        <div className="space-y-1">
          <label htmlFor="reg-password" className="block text-sm font-bold text-[#14211B]">
            {t('password_label')} <span className="text-[#C0262D]">*</span>
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder={t('password_placeholder')}
              aria-describedby={errors.password ? 'reg-password-error' : undefined}
              aria-invalid={Boolean(errors.password)}
              disabled={loading}
              className={`w-full px-3.5 py-3 pr-12 text-base rounded-xl border focus:outline-hidden focus:ring-2 transition-colors ${
                errors.password
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                  : 'border-[#D5E0D9] focus:ring-[#0F5C3A]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? t('password_hide_label') : t('password_show_label')}
              className="touch-target absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] rounded-lg cursor-pointer"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p id="reg-password-error" role="alert" className="text-xs text-[#C0262D] font-semibold pt-0.5">
              {errors.password}
            </p>
          )}
        </div>

        {/* 3. Name Input */}
        <div className="space-y-1">
          <label htmlFor="reg-name" className="block text-sm font-bold text-[#14211B]">
            {t('name_label')} <span className="text-[#C0262D]">*</span>
          </label>
          <input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder={t('name_placeholder')}
            aria-describedby={errors.name ? 'reg-name-error' : undefined}
            aria-invalid={Boolean(errors.name)}
            disabled={loading}
            className={`w-full px-3.5 py-3 text-base rounded-xl border focus:outline-hidden focus:ring-2 transition-colors ${
              errors.name
                ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                : 'border-[#D5E0D9] focus:ring-[#0F5C3A]'
            }`}
          />
          {errors.name && (
            <p id="reg-name-error" role="alert" className="text-xs text-[#C0262D] font-semibold pt-0.5">
              {errors.name}
            </p>
          )}
        </div>

        {/* 4. District Dropdown (64 districts) */}
        <div className="space-y-1">
          <label htmlFor="reg-district" className="block text-sm font-bold text-[#14211B]">
            {t('district_label')} <span className="text-[#C0262D]">*</span>
          </label>
          <select
            id="reg-district"
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              if (errors.district) setErrors((prev) => ({ ...prev, district: '' }));
            }}
            aria-describedby={errors.district ? 'reg-district-error' : undefined}
            aria-invalid={Boolean(errors.district)}
            disabled={loading}
            className={`w-full px-3.5 py-3 text-base rounded-xl border bg-white focus:outline-hidden focus:ring-2 transition-colors ${
              errors.district
                ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                : 'border-[#D5E0D9] focus:ring-[#0F5C3A]'
            }`}
          >
            <option value="">{t('district_placeholder')}</option>
            {districts.map((dist) => (
              <option key={dist.id} value={dist.id}>
                {language === 'bn' ? dist.name_bn : dist.name_en}
              </option>
            ))}
          </select>
          {errors.district && (
            <p id="reg-district-error" role="alert" className="text-xs text-[#C0262D] font-semibold pt-0.5">
              {errors.district}
            </p>
          )}
        </div>

        {/* 5. Preferred Language Radio */}
        <fieldset className="space-y-2 border-t border-[#D5E0D9] pt-3">
          <legend className="text-sm font-bold text-[#14211B]">
            {t('preferred_lang_label')}
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <label className={`touch-target flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer select-none transition-colors ${
              preferredLang === 'bn'
                ? 'border-[#0F5C3A] bg-emerald-50/60 font-bold text-[#0F5C3A]'
                : 'border-[#D5E0D9] bg-gray-50 text-gray-700'
            }`}>
              <input
                type="radio"
                name="preferred_lang"
                value="bn"
                checked={preferredLang === 'bn'}
                onChange={() => setPreferredLang('bn')}
                className="w-4 h-4 text-[#0F5C3A] focus:ring-[#0F5C3A]"
              />
              <span>{t('lang_bn')}</span>
            </label>

            <label className={`touch-target flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer select-none transition-colors ${
              preferredLang === 'en'
                ? 'border-[#0F5C3A] bg-emerald-50/60 font-bold text-[#0F5C3A]'
                : 'border-[#D5E0D9] bg-gray-50 text-gray-700'
            }`}>
              <input
                type="radio"
                name="preferred_lang"
                value="en"
                checked={preferredLang === 'en'}
                onChange={() => setPreferredLang('en')}
                className="w-4 h-4 text-[#0F5C3A] focus:ring-[#0F5C3A]"
              />
              <span>{t('lang_en')}</span>
            </label>
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="pt-2">
          <BigButton type="submit" disabled={loading} ariaLabel={t('register_btn')}>
            {loading ? t('registering_btn') : t('register_btn')}
          </BigButton>
        </div>

        {/* Link to Login */}
        <div className="text-center pt-2">
          <Link
            to="/login"
            className="touch-target inline-flex items-center text-sm font-semibold text-[#0F5C3A] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] rounded-md px-2 py-1"
          >
            {t('already_have_account_link')}
          </Link>
        </div>
      </form>
    </div>
  );
}

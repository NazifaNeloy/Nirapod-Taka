import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useT } from '../i18n/useT.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { parseBanglaNumerals } from '../i18n/numerals.js';
import { BigButton } from '../components/BigButton.jsx';

/**
 * User Login Page (Screen A2) implementing single-column responsive form,
 * opaque security error handling, 429 rate limit countdown, and password wipe on failure.
 * @returns {JSX.Element} Login form view.
 */
export default function Login() {
  const { t, num } = useT();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // Countdown timer for 429 Rate Limit
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /**
   * Handles phone input change and normalizes any Bangla digits into Western digits.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event.
   */
  const handlePhoneChange = (e) => {
    setPhone(parseBanglaNumerals(e.target.value.trim()));
    setFormError('');
  };

  /**
   * Submits login credentials and enforces tokenless security policies.
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (countdown !== null && countdown > 0) return;

    if (!phone || !password) {
      // Opaque error to avoid user enumeration
      setFormError(t('auth_failed_shared_error'));
      setPassword('');
      return;
    }

    setLoading(true);

    const { success, error } = await login({ phone, password });
    setLoading(false);

    if (success) {
      const fromPath = location.state?.from?.pathname || '/check';
      navigate(fromPath, { replace: true });
    } else {
      // Security Rule: Clear password field on failed attempt
      setPassword('');

      if (error?.code === 'RATE_LIMITED') {
        const waitSec = error.retryAfter || 30;
        setCountdown(waitSec);
        setFormError(error.message_bn || t('rate_limit_wait'));
      } else {
        // Security Rule: Do NOT reveal whether phone or password was wrong
        setFormError(t('auth_failed_shared_error'));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-6">
      {/* Page Title */}
      <section aria-labelledby="login-heading" className="text-center space-y-2">
        <h1 id="login-heading" className="text-2xl md:text-3xl font-extrabold text-[#14211B] leading-tight">
          {t('auth_login_title')}
        </h1>
        <p className="text-sm text-gray-600 bangla-text">
          {t('auth_login_subtitle')}
        </p>
      </section>

      {/* Login Form Container */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs space-y-4"
      >
        {/* Shared Opaque Error Alert */}
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
          <label htmlFor="login-phone" className="block text-sm font-bold text-[#14211B]">
            {t('phone_label')} <span className="text-[#C0262D]">*</span>
          </label>
          <input
            id="login-phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={t('phone_placeholder')}
            disabled={loading || (countdown !== null && countdown > 0)}
            className="w-full px-3.5 py-3 text-base rounded-xl border border-[#D5E0D9] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] disabled:bg-gray-100 transition-colors"
          />
        </div>

        {/* 2. Password Input with Show/Hide Toggle */}
        <div className="space-y-1">
          <label htmlFor="login-password" className="block text-sm font-bold text-[#14211B]">
            {t('password_label')} <span className="text-[#C0262D]">*</span>
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password_placeholder')}
              disabled={loading || (countdown !== null && countdown > 0)}
              className="w-full px-3.5 py-3 pr-12 text-base rounded-xl border border-[#D5E0D9] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] disabled:bg-gray-100 transition-colors"
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
        </div>

        {/* Submit BigButton */}
        <div className="pt-2">
          <BigButton
            type="submit"
            disabled={loading || (countdown !== null && countdown > 0)}
            ariaLabel={t('login_btn')}
          >
            {loading ? (
              t('logging_in_btn')
            ) : countdown !== null && countdown > 0 ? (
              <span>
                {t('rate_limit_wait')} {num(countdown)} {t('seconds_unit')}
              </span>
            ) : (
              t('login_btn')
            )}
          </BigButton>
        </div>

        {/* Link to Register */}
        <div className="text-center pt-2">
          <Link
            to="/register"
            className="touch-target inline-flex items-center text-sm font-semibold text-[#0F5C3A] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] rounded-md px-2 py-1"
          >
            {t('dont_have_account_link')}
          </Link>
        </div>
      </form>
    </div>
  );
}

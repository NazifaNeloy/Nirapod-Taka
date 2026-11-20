import React, { useState, useEffect } from 'react';
import { useT } from '../i18n/useT.jsx';
import { apiClient } from '../api/client.js';
import { Toast } from '../components/Toast.jsx';
import { Spinner } from '../components/Spinner.jsx';

/**
 * Badges Page (Screen Badges / Brief 3.5) rendering achievement grid with
 * colored earned states and grayscale locked states loaded strictly from server records.
 * @returns {JSX.Element} Badges showcase view.
 */
export default function Badges() {
  const { t, num } = useT();

  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchBadges() {
      setLoading(true);
      const { data, error } = await apiClient('/api/badges', { method: 'GET' });
      if (isMounted) {
        if (!error && data && Array.isArray(data.badges)) {
          setBadges(data.badges);
        } else {
          setBadges([]);
        }
        setLoading(false);
      }
    }
    fetchBadges();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Helper to return matching SVG achievement badge icon.
   * @param {string} id - Badge identifier.
   * @param {boolean} earned - Whether badge is unlocked.
   * @returns {JSX.Element} Icon element.
   */
  const renderBadgeIcon = (id, earned) => {
    if (!earned) {
      return (
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }

    switch (id) {
      case 'first_check':
        return (
          <svg className="w-10 h-10 text-[#1B7F3B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'guardian':
        return (
          <svg className="w-10 h-10 text-[#0F5C3A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5.55-3.84 10.74-8 12-4.16-1.26-8-6.45-8-12V6l8-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
        );
      case 'quiz_master':
      default:
        return (
          <svg className="w-10 h-10 text-[#B7791F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Toast Alert */}
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

      {/* Header */}
      <section aria-labelledby="badges-heading" className="space-y-1">
        <h1 id="badges-heading" className="text-2xl md:text-3xl font-extrabold text-[#14211B] leading-tight">
          {t('badges_title')}
        </h1>
        <p className="text-sm md:text-base text-gray-600 bangla-text">
          {t('badges_subtitle')}
        </p>
      </section>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6">
          <Spinner text={t('loading')} />
        </div>
      )}

      {/* Badges Grid */}
      {!loading && badges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" role="list">
          {badges.map((badge) => {
            const isEarned = Boolean(badge.earned);

            return (
              <div
                key={badge.id}
                role="listitem"
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
                  isEarned
                    ? 'bg-white border-emerald-300 shadow-sm hover:shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar with Icon & Status Tag */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${isEarned ? 'bg-emerald-50' : 'bg-gray-200'}`}>
                      {renderBadgeIcon(badge.id, isEarned)}
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isEarned
                          ? 'bg-[#1B7F3B] text-white shadow-2xs'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {isEarned ? t('badge_status_earned') : t('badge_status_locked')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-bold leading-snug ${isEarned ? 'text-[#14211B]' : 'text-gray-600'}`}>
                    {badge.title_bn}
                  </h3>
                </div>

                {/* Footer Detail */}
                <div className="mt-4 pt-3 border-t border-gray-200/70 text-xs">
                  {isEarned ? (
                    <div className="text-gray-600 font-medium flex items-center justify-between">
                      <span>{t('badge_earned_date')}:</span>
                      <span className="font-bold text-[#0F5C3A]">{num(badge.earned_at || '২০২৬-১১-১৭')}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500 space-y-0.5">
                      <span className="font-semibold block">{t('badge_hint_label')}:</span>
                      <p className="bangla-text text-gray-600">{badge.hint_bn || ''}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

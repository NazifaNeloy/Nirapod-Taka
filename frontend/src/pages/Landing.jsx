import React from 'react';
import { useT } from '../i18n/useT.jsx';
import { BigButton } from '../components/BigButton.jsx';
import { WorkflowAnimation } from '../components/WorkflowAnimation.jsx';
import { ThreatVisual3D } from '../components/ThreatVisual3D.jsx';

/**
 * Landing Page (Screen A1) providing fraud awareness, interactive workflow demonstration,
 * key statistical evidence, 3 essential security habits, and high-contrast entry to the checker.
 * @returns {JSX.Element} Fully localized Landing page component.
 */
export default function Landing() {
  const { t, num } = useT();

  const problemStats = [
    {
      id: 'cases',
      value: num('81,423'),
      unit: '',
      title: t('problem_cases_title'),
      subtitle: t('problem_cases_sub'),
      highlightColor: 'text-[#C0262D]',
      bgColor: 'bg-red-50/70',
      borderColor: 'border-red-200'
    },
    {
      id: 'total_losses',
      value: `${num('926.01')}`,
      unit: t('million_taka'),
      title: t('problem_loss_title'),
      subtitle: t('problem_loss_sub'),
      highlightColor: 'text-[#B7791F]',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-200'
    },
    {
      id: 'mfs_losses',
      value: `${num('813.26')}`,
      unit: t('million_taka'),
      title: t('problem_mfs_title'),
      subtitle: `${t('problem_mfs_sub')}: ${num('8.7%')}`,
      highlightColor: 'text-[#0F5C3A]',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-200'
    }
  ];

  const safetyHabits = [
    {
      id: 'pin_otp',
      title: t('habit1_title'),
      desc: t('habit1_desc'),
      icon: (
        <svg className="w-7 h-7 text-[#C0262D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      badgeColor: 'bg-red-100 text-[#C0262D]'
    },
    {
      id: 'unknown_links',
      title: t('habit2_title'),
      desc: t('habit2_desc'),
      icon: (
        <svg className="w-7 h-7 text-[#B7791F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      badgeColor: 'bg-amber-100 text-[#B7791F]'
    },
    {
      id: 'helpline',
      title: t('habit3_title'),
      desc: t('habit3_desc'),
      icon: (
        <svg className="w-7 h-7 text-[#0F5C3A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      badgeColor: 'bg-emerald-100 text-[#0F5C3A]',
      actionBadge: t('habit3_call_cta')
    }
  ];

  return (
    <div className="space-y-8 pb-4">
      {/* 1. Hero Section */}
      <section aria-labelledby="hero-title" className="bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xs text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0F5C3A] text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#1B7F3B]" aria-hidden="true" />
          <span>{t('hero_guest_note')}</span>
        </div>

        <h1 id="hero-title" className="text-2xl md:text-3xl font-extrabold text-[#14211B] leading-tight">
          {t('hero_headline')}
        </h1>

        <p className="text-base md:text-lg text-gray-700 bangla-text leading-relaxed max-w-lg mx-auto">
          {t('hero_subheadline')}
        </p>

        {/* Interactive 3D Threat Visual */}
        <ThreatVisual3D />

        <div className="pt-2 max-w-md mx-auto">
          <BigButton to="/check" ariaLabel={t('hero_cta_btn')}>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{t('hero_cta_btn')}</span>
          </BigButton>
        </div>
      </section>

      {/* 2. Problem Impact Cards */}
      <section aria-labelledby="problem-heading" className="space-y-3">
        <h2 id="problem-heading" className="text-lg font-bold text-[#14211B] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C0262D]" aria-hidden="true" />
          <span>সাইবার প্রতারণার বাস্তবতা (২০২৫)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {problemStats.map((stat) => (
            <article
              key={stat.id}
              className={`p-4 rounded-xl border ${stat.borderColor} ${stat.bgColor} shadow-xs flex flex-col justify-between`}
            >
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${stat.highlightColor}`}>
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-xs font-bold text-gray-700">
                      {stat.unit}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 mt-2 bangla-text">
                {stat.subtitle}
              </p>
            </article>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 text-center leading-normal pt-1">
          {t('problem_source')}
        </p>
      </section>

      {/* 3. Four-Step Workflow Animation with Pause-on-Tap & Reduced-Motion Fallback */}
      <WorkflowAnimation />

      {/* 4. Three Essential Safety Habits */}
      <section aria-labelledby="habits-heading" className="space-y-3">
        <h2 id="habits-heading" className="text-lg font-bold text-[#14211B] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1D5FA8]" aria-hidden="true" />
          <span>{t('habits_heading')}</span>
        </h2>

        <div className="space-y-3">
          {safetyHabits.map((habit, idx) => (
            <article
              key={habit.id}
              className="bg-white border border-[#D5E0D9] rounded-xl p-4 shadow-xs flex items-start gap-4 transition-all"
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${habit.badgeColor}`}>
                {habit.icon}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-[#14211B] leading-snug">
                    {habit.title}
                  </h3>
                  {habit.actionBadge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-[#0F5C3A]">
                      {habit.actionBadge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 bangla-text leading-relaxed">
                  {habit.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Final Call To Action */}
      <section aria-labelledby="final-cta-heading" className="bg-[#0F5C3A] text-white rounded-2xl p-6 text-center space-y-4 shadow-md">
        <h2 id="final-cta-heading" className="text-xl md:text-2xl font-bold leading-tight">
          {t('final_cta_title')}
        </h2>
        <p className="text-sm md:text-base text-emerald-100 bangla-text max-w-md mx-auto">
          {t('final_cta_desc')}
        </p>
        <div className="pt-2 max-w-md mx-auto">
          <BigButton to="/check" variant="secondary" ariaLabel={t('final_cta_btn')}>
            <span>{t('final_cta_btn')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </BigButton>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Four-step inline SVG workflow animation with pause-on-tap and prefers-reduced-motion fallback.
 * @returns {JSX.Element} Interactive workflow illustration.
 */
export function WorkflowAnimation() {
  const { t } = useT();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Slow loop animation cycling through 4 steps every 2.6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2600);
    return () => clearInterval(interval);
  }, [isPaused]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const steps = [
    {
      id: 0,
      labelKey: 'workflow_step1',
      descKey: 'workflow_step1_desc',
      color: '#B7791F',
      svg: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="12" y="6" width="24" height="36" rx="4" stroke="#B7791F" strokeWidth="3" fill="#FFFBEB" />
          <circle cx="24" cy="38" r="2" fill="#B7791F" />
          <path d="M16 14h16M16 19h10" stroke="#B7791F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Chat Bubble with question mark */}
          <path d="M22 24h12a2 2 0 012 2v6a2 2 0 01-2 2h-4l-3 3v-3h-5a2 2 0 01-2-2v-6a2 2 0 012-2z" fill="#C0262D" />
          <text x="28" y="31" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">!</text>
        </svg>
      )
    },
    {
      id: 1,
      labelKey: 'workflow_step2',
      descKey: 'workflow_step2_desc',
      color: '#1D5FA8',
      svg: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          {/* Scan rays */}
          <circle cx="20" cy="20" r="12" stroke="#1D5FA8" strokeWidth="3" fill="#EFF6FF" />
          <path d="M29 29l10 10" stroke="#1D5FA8" strokeWidth="3.5" strokeLinecap="round" />
          {/* Internal lines being analyzed */}
          <path d="M14 17h12M14 21h8M14 25h10" stroke="#1D5FA8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="8" stroke="#0F5C3A" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      )
    },
    {
      id: 2,
      labelKey: 'workflow_step3',
      descKey: 'workflow_step3_desc',
      color: '#C0262D',
      svg: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          {/* Warning Shield */}
          <path d="M24 6l14 6v12c0 10-6.5 16-14 18-7.5-2-14-8-14-18V12l14-6z" stroke="#C0262D" strokeWidth="3" fill="#FEF2F2" />
          <path d="M24 16v10" stroke="#C0262D" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="24" cy="31" r="2" fill="#C0262D" />
        </svg>
      )
    },
    {
      id: 3,
      labelKey: 'workflow_step4',
      descKey: 'workflow_step4_desc',
      color: '#1B7F3B',
      svg: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          {/* Safe Box / Shield with protected coins */}
          <circle cx="20" cy="26" r="11" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
          <text x="20" y="30" fill="#854D0E" fontSize="12" fontWeight="bold" textAnchor="middle">৳</text>
          <circle cx="30" cy="20" r="11" fill="#FDE047" stroke="#A16207" strokeWidth="2" />
          <text x="30" y="24" fill="#713F12" fontSize="12" fontWeight="bold" textAnchor="middle">৳</text>
          {/* Green protection checkmark */}
          <circle cx="35" cy="33" r="8" fill="#1B7F3B" />
          <path d="M31.5 33l2.5 2.5 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section
      aria-label={t('workflow_heading')}
      className="bg-white border border-[#D5E0D9] rounded-2xl p-5 shadow-xs select-none"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#14211B] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0F5C3A]" aria-hidden="true" />
          {t('workflow_heading')}
        </h2>
        {/* Play/Pause control for accessibility */}
        <button
          type="button"
          onClick={togglePause}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-md border border-[#D5E0D9] text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] cursor-pointer"
          aria-label={isPaused ? t('workflow_resume') : t('workflow_pause')}
        >
          {isPaused ? t('workflow_paused_badge') : t('workflow_live_badge')}
        </button>
      </div>

      {/* Animated interactive loop display (for standard motion) */}
      <div
        onClick={togglePause}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            togglePause();
          }
        }}
        className="cursor-pointer relative overflow-hidden rounded-xl bg-[#F5FAF7] p-5 border border-[#D5E0D9] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A]"
        aria-live="polite"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-white rounded-full shadow-xs transition-transform duration-300 transform scale-105">
            {steps[activeStep].svg}
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-1.5" style={{ backgroundColor: steps[activeStep].color }}>
              {t('step')} {activeStep + 1}
            </div>
            <h3 className="text-xl font-bold text-[#14211B] leading-tight">
              {t(steps[activeStep].labelKey)}
            </h3>
            <p className="text-sm text-gray-600 mt-1 bangla-text max-w-xs mx-auto">
              {t(steps[activeStep].descKey)}
            </p>
          </div>
        </div>

        {/* Step Indicators / Dots */}
        <div className="flex justify-center gap-2 mt-4" aria-hidden="true">
          {steps.map((st) => (
            <span
              key={st.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveStep(st.id);
              }}
              className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                activeStep === st.id ? 'w-8 bg-[#0F5C3A]' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Reduced-motion Fallback: 4 static cards displayed simultaneously */}
      <div className="hidden motion-reduce:grid grid-cols-2 gap-3 mt-4" aria-hidden="true">
        {steps.map((st) => (
          <div key={st.id} className="p-3 bg-[#F5FAF7] border border-[#D5E0D9] rounded-xl text-center space-y-1">
            <div className="flex justify-center">{st.svg}</div>
            <h4 className="text-sm font-bold text-[#14211B]">{t(st.labelKey)}</h4>
            <p className="text-xs text-gray-600 bangla-text">{t(st.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Interactive 3D scam threat visualizer showcasing an incoming fraudulent call
 * and floating warning bubbles popping out in 3D perspective space.
 * @returns {JSX.Element} Interactive 3D component with mouse/touch tilt and pause controls.
 */
export function ThreatVisual3D() {
  const { t } = useT();
  const [isPaused, setIsPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 8, y: -10 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  /**
   * Handles pointer and touch movement across the container to calculate 3D tilt angles.
   * @param {React.PointerEvent | React.TouchEvent} e - Pointer or touch event.
   */
  const handleInteractionMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const xRatio = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const yRatio = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    // Limit maximum tilt angle to +/- 16 degrees for a refined 3D parallax feel
    const clampedX = Math.max(-1, Math.min(1, xRatio));
    const clampedY = Math.max(-1, Math.min(1, yRatio));

    setTilt({
      x: -clampedY * 16,
      y: clampedX * 16
    });
    setIsHovered(true);
  }, []);

  /**
   * Resets the 3D tilt to the default showcase angle when pointer leaves the visual.
   */
  const handleInteractionEnd = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 8, y: -10 });
  }, []);

  /**
   * Toggles the floating animation play/pause state for accessibility and user control.
   */
  const togglePlayPause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Listen for prefers-reduced-motion to automatically pause animations
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsPaused(true);
    }
    const handler = (e) => {
      if (e.matches) setIsPaused(true);
    };
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto my-2 select-none" aria-label="3D Threat Simulation Visual">
      {/* 3D Scoped Styles */}
      <style>{`
        .threat-3d-perspective {
          perspective: 1100px;
          perspective-origin: 50% 50%;
        }
        .threat-3d-stage {
          transform-style: preserve-3d;
          transition: ${isHovered ? 'transform 0.12s ease-out' : 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)'};
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }

        /* Float animations for 3D red warning notification bubbles */
        @keyframes floatBubble1 {
          0%, 100% {
            transform: translate3d(0, 0, 70px) rotateZ(-3deg);
          }
          50% {
            transform: translate3d(0, -12px, 85px) rotateZ(1deg);
          }
        }
        @keyframes floatBubble2 {
          0%, 100% {
            transform: translate3d(0, 0, 50px) rotateZ(2deg);
          }
          50% {
            transform: translate3d(0, 10px, 62px) rotateZ(-2deg);
          }
        }
        @keyframes floatBubble3 {
          0%, 100% {
            transform: translate3d(0, 0, 60px) rotateZ(-1deg);
          }
          50% {
            transform: translate3d(0, -8px, 72px) rotateZ(3deg);
          }
        }

        /* Pulse rings around threat caller */
        @keyframes callerPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.92);
            opacity: 0.8;
          }
        }

        .anim-bubble-1 {
          animation: floatBubble1 4s ease-in-out infinite;
        }
        .anim-bubble-2 {
          animation: floatBubble2 4.6s ease-in-out infinite 0.8s;
        }
        .anim-bubble-3 {
          animation: floatBubble3 3.8s ease-in-out infinite 1.4s;
        }
        .anim-pulse-ring {
          animation: callerPulse 2.2s ease-in-out infinite;
        }

        .threat-paused .anim-bubble-1,
        .threat-paused .anim-bubble-2,
        .threat-paused .anim-bubble-3,
        .threat-paused .anim-pulse-ring {
          animation-play-state: paused !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-bubble-1,
          .anim-bubble-2,
          .anim-bubble-3,
          .anim-pulse-ring {
            animation: none !important;
          }
          .threat-3d-stage {
            transition: none !important;
          }
        }
      `}</style>

      {/* Main 3D Container */}
      <div
        ref={containerRef}
        onPointerMove={handleInteractionMove}
        onPointerLeave={handleInteractionEnd}
        onTouchMove={handleInteractionMove}
        onTouchEnd={handleInteractionEnd}
        className={`threat-3d-perspective relative py-6 px-3 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${
          isPaused ? 'threat-paused' : ''
        }`}
      >
        {/* Stage with dynamic rotation */}
        <div
          className="threat-3d-stage relative flex items-center justify-center"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          }}
        >
          {/* ========================================================
              FLOATING 3D SPEECH BUBBLE 1 (Top Right - Large)
             ======================================================== */}
          <div
            className="absolute -top-3 -right-3 sm:-right-8 z-30 anim-bubble-1"
            style={{ transform: 'translate3d(0, 0, 70px)' }}
          >
            <div className="relative bg-gradient-to-br from-[#FF4D4D] to-[#DC2626] text-white p-3.5 sm:p-4 rounded-2xl shadow-[0_16px_32px_rgba(220,38,38,0.45)] border border-red-300/40 flex items-center gap-2.5">
              {/* Warning Triangle Icon with Exclamation Mark */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/40 shadow-inner">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-black tracking-wide leading-tight drop-shadow-xs">
                  {t('threat_3d_bubble1_title')}
                </span>
                <span className="block text-[10px] text-red-100 font-medium leading-none mt-0.5">
                  OTP / PIN ALERT
                </span>
              </div>
              {/* Speech bubble tail pointer pointing towards the phone */}
              <div
                className="absolute -bottom-2 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#DC2626]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ========================================================
              FLOATING 3D SPEECH BUBBLE 2 (Top Left - Medium)
             ======================================================== */}
          <div
            className="absolute top-20 -left-4 sm:-left-12 z-30 anim-bubble-2"
            style={{ transform: 'translate3d(0, 0, 50px)' }}
          >
            <div className="relative bg-gradient-to-br from-[#EF4444] to-[#B91C1C] text-white px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-2xl shadow-[0_14px_28px_rgba(185,28,28,0.4)] border border-red-300/30 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left pr-1">
                <span className="block text-xs font-bold leading-tight">
                  {t('threat_3d_bubble2_title')}
                </span>
                <span className="block text-[9px] text-red-100 font-medium mt-0.5">
                  MALICIOUS LINK
                </span>
              </div>
              {/* Speech bubble tail pointer pointing right towards the phone */}
              <div
                className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-[#EF4444]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ========================================================
              FLOATING 3D SPEECH BUBBLE 3 (Bottom Right - Medium)
             ======================================================== */}
          <div
            className="absolute bottom-16 -right-2 sm:-right-8 z-30 anim-bubble-3"
            style={{ transform: 'translate3d(0, 0, 60px)' }}
          >
            <div className="relative bg-gradient-to-br from-[#DC2626] to-[#991B1B] text-white px-3 py-2 rounded-xl shadow-[0_12px_24px_rgba(153,27,27,0.45)] border border-red-300/30 flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left pr-1">
                <span className="block text-xs font-bold leading-tight">
                  {t('threat_3d_bubble3_title')}
                </span>
                <span className="block text-[9px] text-red-200">
                  UNKNOWN SCAM
                </span>
              </div>
              {/* Speech bubble tail pointer pointing left towards the phone */}
              <div
                className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-[#DC2626]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ========================================================
              3D SMARTPHONE BODY & SCREEN
             ======================================================== */}
          <div
            className="preserve-3d relative w-[250px] sm:w-[275px] h-[460px] sm:h-[480px] bg-[#1a2332] rounded-[2.5rem] p-3 shadow-[0_28px_60px_-10px_rgba(15,23,42,0.4),0_0_0_1px_rgba(255,255,255,0.12)_inset,-14px_16px_28px_rgba(0,0,0,0.22)] border-[5px] border-[#0f172a]"
            style={{
              transform: 'translate3d(0, 0, 10px)'
            }}
          >
            {/* Phone Hardware Side Buttons */}
            <div className="absolute -left-[8px] top-24 w-[3px] h-8 bg-[#334155] rounded-l" aria-hidden="true" />
            <div className="absolute -left-[8px] top-36 w-[3px] h-10 bg-[#334155] rounded-l" aria-hidden="true" />
            <div className="absolute -right-[8px] top-28 w-[3px] h-12 bg-[#334155] rounded-r" aria-hidden="true" />

            {/* Inner Screen Bezel & Display */}
            <div className="relative w-full h-full bg-gradient-to-b from-[#0b121d] via-[#101b2b] to-[#070d14] rounded-[2rem] overflow-hidden flex flex-col justify-between text-white p-3.5 border border-white/10">
              {/* Glass Glare Overlay */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-[2rem]"
                aria-hidden="true"
              />

              {/* Top Section: Status Bar & Dynamic Camera Island */}
              <div className="relative z-10 space-y-1.5">
                {/* Dynamic Island / Notch */}
                <div className="w-20 h-4 bg-black/90 rounded-full mx-auto flex items-center justify-between px-2.5 border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b] ring-1 ring-blue-400/50" />
                  <div className="w-6 h-1 bg-[#1e293b] rounded-full" />
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between text-[11px] text-gray-300 font-semibold px-1">
                  <span>{t('threat_3d_screen_time')}</span>
                  <div className="flex items-center gap-1.5">
                    {/* 4G Icon */}
                    <span className="text-[10px] font-bold text-gray-400">4G</span>
                    {/* Signal Bars */}
                    <svg className="w-3 h-3 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M2 17h3v4H2v-4zm6-5h3v9H8v-9zm6-5h3v14h-3V7zm6-5h3v19h-3V2z" />
                    </svg>
                    {/* Battery */}
                    <div className="w-4 h-2 rounded-xs border border-gray-300 p-0.5 flex items-center">
                      <div className="w-2.5 h-1 bg-emerald-400 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Simulation Badge */}
                <div className="flex justify-center pt-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-extrabold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>{t('threat_3d_badge')}</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Threat Caller & Avatar Silhouette */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center py-2 space-y-3">
                {/* Pulse Ring Behind Avatar */}
                <div className="relative flex items-center justify-center">
                  <div
                    className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-500/20 border border-red-500/40 anim-pulse-ring pointer-events-none"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600/20 border border-red-500/50 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Caller Silhouette Circle (styled after reference photo) */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-[#334155] to-[#1e293b] border-2 border-red-500/60 shadow-lg flex items-center justify-center overflow-hidden">
                    <svg className="w-10 h-10 text-gray-200 mt-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Threat Call Details */}
                <div className="space-y-0.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                    {t('threat_3d_caller_title')}
                  </h3>
                  <p className="text-xs text-red-400 font-semibold">
                    {t('threat_3d_caller_num')}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium animate-pulse">
                    {t('threat_3d_incoming')}
                  </p>
                </div>

                {/* Fake Threat SMS Preview Snippet */}
                <div className="w-full bg-[#1b2738]/90 border border-red-500/40 rounded-xl p-2.5 text-left shadow-md">
                  <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-bold">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{t('threat_3d_msg_title')}</span>
                  </div>
                  <p className="text-[11px] text-gray-200 leading-tight mt-1 line-clamp-2">
                    {t('threat_3d_msg_body')}
                  </p>
                </div>
              </div>

              {/* Bottom Section: Call Action Buttons (Decline & Accept matching reference photo) */}
              <div className="relative z-10 pt-1 pb-1">
                <div className="flex items-center justify-around px-2">
                  {/* Decline Button (Red Circle with Phone Down) */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      tabIndex={-1}
                      className="w-12 h-12 rounded-full bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-[0_6px_16px_rgba(220,38,38,0.5)] border border-red-400/30 transition-all pointer-events-none"
                      aria-hidden="true"
                    >
                      <svg className="w-6 h-6 rotate-[135deg]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </button>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {t('threat_3d_decline')}
                    </span>
                  </div>

                  {/* Accept Button (Green Circle with Phone Call) */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      tabIndex={-1}
                      className="w-12 h-12 rounded-full bg-[#16A34A] hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-[0_6px_16px_rgba(22,163,74,0.5)] border border-emerald-400/30 transition-all pointer-events-none"
                      aria-hidden="true"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </button>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {t('threat_3d_accept')}
                    </span>
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-2" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Controls & Hint */}
        <div className="mt-4 flex items-center justify-between w-full max-w-[280px] sm:max-w-[320px] px-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-gray-200/80 shadow-2xs">
            <svg className="w-3.5 h-3.5 text-[#0F5C3A] animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
            <span>{t('threat_3d_interactive_hint')}</span>
          </div>

          <button
            type="button"
            onClick={togglePlayPause}
            aria-pressed={isPaused}
            aria-label={isPaused ? t('threat_3d_play_btn') : t('threat_3d_pause_btn')}
            className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-white hover:bg-gray-100 active:bg-gray-200 border border-gray-300 rounded-full px-2.5 py-1 shadow-2xs transition-colors"
          >
            {isPaused ? (
              <>
                <svg className="w-3 h-3 text-[#1B7F3B]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>৩ডি চালু</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 text-[#C0262D]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <span>বিরতি</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

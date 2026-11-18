import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable full-width primary action button adhering to the 56px height and 16px radius design tokens.
 * @param {object} props - Component props.
 * @param {string} [props.to] - Optional navigation path if acting as a React Router Link.
 * @param {Function} [props.onClick] - Click handler.
 * @param {React.ReactNode} props.children - Button content.
 * @param {string} [props.variant='primary'] - Visual styling variant ('primary' or 'secondary').
 * @param {boolean} [props.disabled=false] - Disabled state.
 * @param {string} [props.ariaLabel] - Accessible label for screen readers.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {JSX.Element} Interactive 56px button or router link.
 */
export function BigButton({
  to,
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  ariaLabel,
  className = ''
}) {
  const baseStyles =
    'touch-target w-full big-button min-h-[56px] rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-150 focus:outline-hidden focus:ring-3 focus:ring-[#0F5C3A] focus:ring-offset-2 select-none';

  const variants = {
    primary:
      'bg-[#0F5C3A] text-white hover:bg-[#0b452b] active:scale-98 shadow-xs border border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
    secondary:
      'bg-white text-[#0F5C3A] border-2 border-[#0F5C3A] hover:bg-[#F5FAF7] active:scale-98 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed'
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${className}`.trim();

  if (to && !disabled) {
    return (
      <Link to={to} className={combinedClasses} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}

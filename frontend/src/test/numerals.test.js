import { describe, it, expect } from 'vitest';
import { formatNumerals, parseBanglaNumerals } from '../i18n/numerals.js';

describe('i18n numerals helper', () => {
  it('converts western digits to bangla digits when lang is bn', () => {
    expect(formatNumerals('01700000001', 'bn')).toBe('০১৭০০০০০০০১');
    expect(formatNumerals(2026, 'bn')).toBe('২০২৬');
    expect(formatNumerals('Tk 926.01 million', 'bn')).toBe('Tk ৯২৬.০১ million');
  });

  it('keeps western digits when lang is en', () => {
    expect(formatNumerals('01700000001', 'en')).toBe('01700000001');
    expect(formatNumerals(2026, 'en')).toBe('2026');
  });

  it('normalizes bangla digits back to western digits', () => {
    expect(parseBanglaNumerals('০১৭০০০০০০০১')).toBe('01700000001');
    expect(parseBanglaNumerals('২০২৬')).toBe('2026');
  });
});

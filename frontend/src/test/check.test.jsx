import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Check from '../pages/Check.jsx';
import { LanguageProvider } from '../i18n/useT.jsx';

/**
 * Helper to render Check component wrapped in required providers.
 */
function renderCheckPage() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <Check />
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('Message Checker (Brief 3.2)', () => {
  it('displays empty input validation when submitting with empty message', async () => {
    renderCheckPage();

    const submitBtn = screen.getByRole('button', { name: /পরীক্ষা করুন/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText('অনুগ্রহ করে যাচাইয়ের জন্য একটি মেসেজ পেস্ট বা লিখুন।')
    ).toBeInTheDocument();
  });

  it('truncates content exceeding 2,000 characters and notifies the user', () => {
    renderCheckPage();

    const textarea = screen.getByPlaceholderText(/সন্দেহজনক এসএমএস বা মেসেজের পুরো অংশ/i);
    const longText = 'ক'.repeat(2500);

    fireEvent.change(textarea, { target: { value: longText } });

    expect(textarea.value.length).toBe(2000);
    expect(
      screen.getByText('লেখাটি ২,০০০ অক্ষরের বেশি হওয়ায় অতিরিক্ত অংশ কেটে ছোট করা হয়েছে।')
    ).toBeInTheDocument();
  });

  it('verifies scam message and safely displays verdict, risk score, and plain text evidence', async () => {
    renderCheckPage();

    const scamMsg = 'আপনার অ্যাকাউন্ট বন্ধ হয়ে যাবে। এখনই পিন পাঠান।';
    const textarea = screen.getByPlaceholderText(/সন্দেহজনক এসএমএস বা মেসেজের পুরো অংশ/i);
    fireEvent.change(textarea, { target: { value: scamMsg } });

    const submitBtn = screen.getByRole('button', { name: /পরীক্ষা করুন/i });
    fireEvent.click(submitBtn);

    // Wait for mock result
    await waitFor(() => {
      expect(screen.getByText('ফলাফল সারসংক্ষেপ')).toBeInTheDocument();
    });

    // Verdict Badge + RiskMeter indicator
    const scamBadges = screen.getAllByText('প্রতারণা');
    expect(scamBadges.length).toBeGreaterThanOrEqual(2);

    // Risk Score: 88 in Bangla numerals: ৮৮
    expect(screen.getByText('৮৮')).toBeInTheDocument();

    // Highlighted evidence mark in plain text
    expect(screen.getByText('এখনই')).toBeInTheDocument();
    expect(screen.getByText('পিন পাঠান')).toBeInTheDocument();

    // Action Box
    expect(screen.getByText(/কাউকে পিন বা ওটিপি দেবেন না/i)).toBeInTheDocument();

    // Honesty Line
    expect(screen.getByText(/ML ০.৯৭/)).toBeInTheDocument();
  });

  it('correctly identifies hard-negative awareness messages as safe', async () => {
    renderCheckPage();

    const safeMsg = 'আপনার ওটিপি ১২৩৪৫৬। কাউকে পিন বা ওটিপি বলবেন না।';
    const textarea = screen.getByPlaceholderText(/সন্দেহজনক এসএমএস বা মেসেজের পুরো অংশ/i);
    fireEvent.change(textarea, { target: { value: safeMsg } });

    const submitBtn = screen.getByRole('button', { name: /পরীক্ষা করুন/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('ফলাফল সারসংক্ষেপ')).toBeInTheDocument();
    });

    const safeBadges = screen.getAllByText('নিরাপদ');
    expect(safeBadges.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('১০')).toBeInTheDocument();
  });

  it('renders script tags and SQL injection as escaped plain text without execution', async () => {
    renderCheckPage();

    const maliciousText = "<script>alert('pwned')</script> '; DROP TABLE users;--";
    const textarea = screen.getByPlaceholderText(/সন্দেহজনক এসএমএস বা মেসেজের পুরো অংশ/i);
    fireEvent.change(textarea, { target: { value: maliciousText } });

    const submitBtn = screen.getByRole('button', { name: /পরীক্ষা করুন/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('ফলাফল সারসংক্ষেপ')).toBeInTheDocument();
    });

    // Content must be present literally as plain text
    const scriptElements = screen.getAllByText(/<script>alert\('pwned'\)<\/script>/);
    expect(scriptElements.length).toBeGreaterThanOrEqual(1);

    const sqlElements = screen.getAllByText(/DROP TABLE users/);
    expect(sqlElements.length).toBeGreaterThanOrEqual(1);
  });
});

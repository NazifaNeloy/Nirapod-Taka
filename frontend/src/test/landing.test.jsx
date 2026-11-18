import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../pages/Landing.jsx';
import { LanguageProvider } from '../i18n/useT.jsx';

describe('Landing Page (Brief 3.1)', () => {
  it('renders hero title, problem cards, workflow animation, and CTA buttons', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Landing />
        </LanguageProvider>
      </MemoryRouter>
    );

    // Hero title
    expect(screen.getByText('প্রতারণার আগেই যাচাই করুন')).toBeInTheDocument();

    // Problem stats numbers formatted in Bangla numerals
    expect(screen.getByText('৮১,৪২৩')).toBeInTheDocument();
    expect(screen.getByText('৯২৬.০১')).toBeInTheDocument();
    expect(screen.getByText('৮১৩.২৬')).toBeInTheDocument();

    // Source line
    expect(
      screen.getByText(/উৎস: বাংলাদেশ ফিন্যান্সিয়াল ইন্টেলিজেন্স ইউনিট/i)
    ).toBeInTheDocument();

    // Workflow steps
    expect(screen.getByText('কীভাবে কাজ করে?')).toBeInTheDocument();

    // 3 Safety habits
    expect(screen.getByText('পিন বা ওটিপি কাউকে বলবেন না')).toBeInTheDocument();
    const helplineElements = screen.getAllByText(/১৬২৩৬/);
    expect(helplineElements.length).toBeGreaterThanOrEqual(1);

    // CTA Buttons (Hero CTA + Bottom CTA)
    const ctaButtons = screen.getAllByRole('link', { name: /মেসেজ/i });
    expect(ctaButtons.length).toBeGreaterThanOrEqual(2);
    expect(ctaButtons[0]).toHaveAttribute('href', '/check');
    expect(ctaButtons[1]).toHaveAttribute('href', '/check');
  });
});

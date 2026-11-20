import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../pages/Landing.jsx';
import { LanguageProvider } from '../i18n/useT.jsx';

describe('Landing Page (Brief 3.1 & 3D Threat Visual)', () => {
  it('renders hero title, 3D threat visual, problem cards, workflow animation, and CTA buttons', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <Landing />
        </LanguageProvider>
      </MemoryRouter>
    );

    // Hero title
    expect(screen.getByText('প্রতারণার আগেই যাচাই করুন')).toBeInTheDocument();

    // 3D Threat Visual and 3D floating warning speech bubbles
    expect(screen.getByLabelText('3D Threat Simulation Visual')).toBeInTheDocument();
    expect(screen.getByText('সতর্কতা: ওটিপি চুরি!')).toBeInTheDocument();
    expect(screen.getByText('ভুয়া লটারি লিংক!')).toBeInTheDocument();
    expect(screen.getByText('অচেনা কল!')).toBeInTheDocument();
    expect(screen.getByText('অচেনা কলার')).toBeInTheDocument();
    expect(screen.getByText('প্রত্যাখ্যান')).toBeInTheDocument();
    expect(screen.getByText('রিসিভ')).toBeInTheDocument();

    // 3D Play/Pause accessibility toggle
    const pauseBtn = screen.getByRole('button', { name: /৩ডি অ্যানিমেশন থামান/i });
    expect(pauseBtn).toBeInTheDocument();
    expect(pauseBtn).toHaveAttribute('aria-pressed', 'false');

    // Toggle pause
    fireEvent.click(pauseBtn);
    expect(screen.getByRole('button', { name: /৩ডি অ্যানিমেশন চালু করুন/i })).toHaveAttribute('aria-pressed', 'true');

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

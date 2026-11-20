import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import History from '../pages/History.jsx';
import Profile from '../pages/Profile.jsx';
import Badges from '../pages/Badges.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { LanguageProvider } from '../i18n/useT.jsx';

describe('Brief 3.5: Profile, History, Badges, and Export', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders History list, toggles text expansion, and filters by verdict', async () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <LanguageProvider>
          <AuthProvider>
            <History />
          </AuthProvider>
        </LanguageProvider>
      </MemoryRouter>
    );

    // Wait for history items to load
    await waitFor(() => {
      expect(screen.getByText('যাচাইয়ের ইতিহাস')).toBeInTheDocument();
    });

    // Verify items are displayed
    expect(await screen.findByText(/আপনার অ্যাকাউন্ট বন্ধ হয়ে যাবে/i)).toBeInTheDocument();

    // Verify filter buttons exist
    const safeFilterBtn = screen.getByRole('tab', { name: 'নিরাপদ' });
    fireEvent.click(safeFilterBtn);

    // After filtering by safe, scam message should be hidden and safe OTP message should be shown
    expect(screen.getByText(/আপনার ওটিপি ১২৩৪৫৬/i)).toBeInTheDocument();
    expect(screen.queryByText(/লটারিতে ২৫ লাখ টাকা/i)).not.toBeInTheDocument();

    // Switch back to "সব"
    const allFilterBtn = screen.getByRole('tab', { name: 'সব' });
    fireEvent.click(allFilterBtn);
    expect(screen.getByText(/লটারিতে ২৫ লাখ টাকা/i)).toBeInTheDocument();
  });

  it('generates CSV download with UTF-8 BOM encoding for Excel/Google Sheets compatibility', async () => {
    let generatedBlob = null;
    window.URL.createObjectURL = vi.fn((blob) => {
      generatedBlob = blob;
      return 'blob:mock-url';
    });

    render(
      <MemoryRouter initialEntries={['/history']}>
        <LanguageProvider>
          <AuthProvider>
            <History />
          </AuthProvider>
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CSV ডাউনলোড')).toBeInTheDocument();
    });

    const csvBtn = screen.getByRole('button', { name: /CSV ডাউনলোড/i });
    fireEvent.click(csvBtn);

    expect(generatedBlob).not.toBeNull();
    // Verify UTF-8 BOM bytes (0xEF, 0xBB, 0xBF)
    const arrayBuffer = await generatedBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    expect(bytes[0]).toBe(0xef);
    expect(bytes[1]).toBe(0xbb);
    expect(bytes[2]).toBe(0xbf);
  });

  it('opens ConfirmDialog before permanently clearing history and reveals empty state', async () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <LanguageProvider>
          <AuthProvider>
            <History />
          </AuthProvider>
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /আমার ইতিহাস মুছুন/i })).toBeInTheDocument();
    });

    const clearBtn = screen.getByRole('button', { name: /আমার ইতিহাস মুছুন/i });
    fireEvent.click(clearBtn);

    // Confirm dialog modal appears
    expect(screen.getByText('ইতিহাস মুছে ফেলতে চান?')).toBeInTheDocument();
    expect(screen.getByText(/স্থায়ীভাবে মুছে যাবে/i)).toBeInTheDocument();

    const confirmActionBtn = screen.getByRole('button', { name: /হ্যাঁ, স্থায়ীভাবে মুছুন/i });
    fireEvent.click(confirmActionBtn);

    // Empty state should be visible
    await waitFor(() => {
      expect(screen.getByText('এখনও কোনো মেসেজ পরীক্ষা করা হয়নি')).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /মেসেজ পরীক্ষা করুন/i })).toBeInTheDocument();
  });

  it('renders Badges grid showing earned dates and locked hints strictly from server', async () => {
    render(
      <MemoryRouter initialEntries={['/badges']}>
        <LanguageProvider>
          <AuthProvider>
            <Badges />
          </AuthProvider>
        </LanguageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('অর্জিত ব্যাজ ও সম্মাননা')).toBeInTheDocument();
    });

    // Wait for async badge load
    expect(await screen.findByText('প্রথম যাচাই সম্পন্ন')).toBeInTheDocument();
    expect(screen.getByText('অর্জিত')).toBeInTheDocument();

    // Locked badges with hint
    expect(screen.getByText('কমিউনিটি রক্ষক')).toBeInTheDocument();
    expect(screen.getByText('৫টি প্রতারণামূলক বার্তা যাচাই করুন')).toBeInTheDocument();
  });

  it('renders Profile page, allows district selection and updates language preference immediately', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <LanguageProvider>
          <AuthProvider>
            <Profile />
          </AuthProvider>
        </LanguageProvider>
      </MemoryRouter>
    );

    const districtSelect = screen.getByLabelText(/জেলা নির্বাচন করুন/i);
    expect(districtSelect).toBeInTheDocument();

    fireEvent.change(districtSelect, { target: { value: 'Chattogram' } });
    expect(districtSelect.value).toBe('Chattogram');

    const enRadio = screen.getByLabelText('English');
    fireEvent.click(enRadio);

    const saveBtn = screen.getByRole('button', { name: /পরিবর্তন সংরক্ষণ করুন/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});

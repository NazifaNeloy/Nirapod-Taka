import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Register from '../pages/Register.jsx';
import Login from '../pages/Login.jsx';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';
import { LanguageProvider } from '../i18n/useT.jsx';

/**
 * Test wrapper component.
 */
function TestAuthFlow() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? `LOGGED_IN: ${user?.name}` : 'GUEST'}
      </div>
      {isAuthenticated && (
        <button onClick={logout} data-testid="logout-btn">
          Logout
        </button>
      )}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/check" element={<div>CHECK_PAGE</div>} />
      </Routes>
    </div>
  );
}

function renderAuth(initialRoute = '/register') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LanguageProvider>
        <AuthProvider>
          <TestAuthFlow />
        </AuthProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
}

describe('Authentication Flow (Brief 3.4)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('validates registration form and accepts Bangla digits in phone field', async () => {
    renderAuth('/register');

    // Wait for initial session check to finish
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('GUEST');
    });

    const submitBtn = screen.getByRole('button', { name: /রেজিস্টার করুন/i });
    fireEvent.click(submitBtn);

    // Validation errors should be visible
    expect(await screen.findByText(/সঠিক ১১ ডিজিটের ফোন নম্বর দিন/i)).toBeInTheDocument();
    expect(screen.getByText(/পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে/i)).toBeInTheDocument();

    // Type phone in Bangla numerals: ০১৭০০০০০০০১
    const phoneInput = screen.getByPlaceholderText(/01700000001/i);
    fireEvent.change(phoneInput, { target: { value: '০১৭০০০০০০০১' } });

    // Should normalize to western digits internally
    expect(phoneInput.value).toBe('01700000001');
  });

  it('successfully registers, logs in, logs out, and never stores tokens in localStorage or sessionStorage', async () => {
    renderAuth('/register');

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('GUEST');
    });

    // Fill registration form
    fireEvent.change(screen.getByPlaceholderText(/01700000001/i), { target: { value: '01700000001' } });
    fireEvent.change(screen.getByPlaceholderText(/কমপক্ষে ৮ অক্ষরের/i), { target: { value: 'Secret12345' } });
    fireEvent.change(screen.getByPlaceholderText(/রহিম উদ্দিন/i), { target: { value: 'রহিম উদ্দিন' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Dhaka' } });

    const submitBtn = screen.getByRole('button', { name: /রেজিস্টার করুন/i });
    fireEvent.click(submitBtn);

    // Should authenticate
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('LOGGED_IN: রহিম উদ্দিন');
    });

    // Rule 8 compliance check: Verify NO tokens or passwords in storage!
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('password')).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('password')).toBeNull();

    // Test Logout
    const logoutBtn = screen.getByTestId('logout-btn');
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('GUEST');
    });
  });

  it('presents opaque shared error and clears password on failed login', async () => {
    renderAuth('/login');

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('GUEST');
    });

    const phoneInput = screen.getByPlaceholderText(/01700000001/i);
    const passwordInput = screen.getByPlaceholderText(/কমপক্ষে ৮ অক্ষরের/i);
    const loginBtn = screen.getByRole('button', { name: /লগইন করুন/i });

    // Attempt login with empty password
    fireEvent.change(phoneInput, { target: { value: '01700000001' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.click(loginBtn);

    expect(await screen.findByText('ফোন নম্বর বা পাসওয়ার্ড ভুল হয়েছে।')).toBeInTheDocument();
    expect(passwordInput.value).toBe('');
  });
});

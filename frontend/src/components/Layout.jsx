import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar.jsx';
import { Footer } from './Footer.jsx';
import { BottomNav } from './BottomNav.jsx';

/**
 * Main application shell layout that structures the TopBar, max-w-720 centered body, Footer, and mobile BottomNav.
 * @returns {JSX.Element} Structural layout wrapper for page routes.
 */
export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5FAF7] text-[#14211B] antialiased overflow-x-hidden">
      {/* Top Navigation */}
      <TopBar />

      {/* Main Content Area - max width 720px centered */}
      <main className="flex-1 w-full max-w-[720px] mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Mandatory Ethics Footer */}
      <Footer />

      {/* Mobile-only Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}

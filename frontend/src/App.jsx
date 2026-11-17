import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { LanguageProvider } from './i18n/useT.jsx';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary.jsx';

/**
 * Root Application component assembling ErrorBoundary, Language Context, and Router.
 * @returns {JSX.Element} Application root hierarchy.
 */
export function App() {
  return (
    <GlobalErrorBoundary>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </GlobalErrorBoundary>
  );
}

export default App;

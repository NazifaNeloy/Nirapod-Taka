import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { LanguageProvider } from './i18n/useT.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary.jsx';

/**
 * Root Application component assembling ErrorBoundary, Language Context, Auth Context, and Router.
 * @returns {JSX.Element} Application root hierarchy.
 */
export function App() {
  return (
    <GlobalErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </LanguageProvider>
    </GlobalErrorBoundary>
  );
}

export default App;

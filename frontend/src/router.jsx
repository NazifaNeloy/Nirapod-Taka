import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { Spinner } from './components/Spinner.jsx';

// Eagerly loaded P0 routes as mandated by spec rule 7
import Landing from './pages/Landing.jsx';
import Check from './pages/Check.jsx';

// Lazy loaded secondary routes for bundle optimization
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const History = lazy(() => import('./pages/History.jsx'));
const Badges = lazy(() => import('./pages/Badges.jsx'));
const Scan = lazy(() => import('./pages/Scan.jsx'));
const Ask = lazy(() => import('./pages/Ask.jsx'));
const Metrics = lazy(() => import('./pages/Metrics.jsx'));
const Quiz = lazy(() => import('./pages/Quiz.jsx'));

/**
 * Helper to wrap lazy routes with an accessible Suspense fallback.
 * @param {React.ReactNode} Component - Route page component.
 * @returns {JSX.Element} Suspended element.
 */
function withSuspense(Component) {
  return <Suspense fallback={<Spinner />}>{Component}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'check', element: <Check /> },
      { path: 'login', element: withSuspense(<Login />) },
      { path: 'register', element: withSuspense(<Register />) },
      { path: 'profile', element: withSuspense(<Profile />) },
      { path: 'history', element: withSuspense(<History />) },
      { path: 'badges', element: withSuspense(<Badges />) },
      { path: 'scan', element: withSuspense(<Scan />) },
      { path: 'ask', element: withSuspense(<Ask />) },
      { path: 'metrics', element: withSuspense(<Metrics />) },
      { path: 'quiz', element: withSuspense(<Quiz />) },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);

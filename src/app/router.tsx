import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../components/layout/MainContent';
import { LoadingState } from '../components/error/LoadingState';

const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);

const BenchmarkPage = lazy(() =>
  import('../pages/BenchmarkPage').then((m) => ({ default: m.BenchmarkPage }))
);

const HistoryPage = lazy(() =>
  import('../pages/HistoryPage').then((m) => ({ default: m.HistoryPage }))
);

const LearningDashboardPage = lazy(() =>
  import('../pages/LearningDashboardPage').then((m) => ({ default: m.LearningDashboardPage }))
);

const AlgorithmDetailPage = lazy(() =>
  import('../pages/AlgorithmDetailPage').then((m) => ({ default: m.AlgorithmDetailPage }))
);

const AlgorithmsPage = lazy(() =>
  import('../pages/AlgorithmsPage').then((m) => ({ default: m.AlgorithmsPage }))
);

const ComplexityPage = lazy(() =>
  import('../pages/ComplexityPage').then((m) => ({ default: m.ComplexityPage }))
);

const ReportsPage = lazy(() =>
  import('../pages/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);

const SettingsPage = lazy(() =>
  import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

const AboutPage = lazy(() =>
  import('../pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);

const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading Dashboard..." />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'benchmark',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading Benchmark Studio..." />}>
            <BenchmarkPage />
          </Suspense>
        ),
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading History..." />}>
            <HistoryPage />
          </Suspense>
        ),
      },
      {
        path: 'algorithms',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading Algorithm Catalog..." />}>
            <AlgorithmsPage />
          </Suspense>
        ),
      },
      {
        path: 'complexity',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading Complexity Explorer..." />}>
            <ComplexityPage />
          </Suspense>
        ),
      },
      {
        path: 'learning',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading Learning Center..." />}>
            <LearningDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'learning/:id',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading Algorithm details..." />}>
            <AlgorithmDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading Reports & Analytics..." />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading Settings..." />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading About Specs..." />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingState type="full" label="Loading..." />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

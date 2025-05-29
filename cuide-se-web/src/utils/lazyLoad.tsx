import { lazy, Suspense, ComponentType } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink"></div>
  </div>
);

export const withSuspense = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

export const lazyLoad = <P extends object>(importFn: () => Promise<{ default: ComponentType<P> }>) => {
  const LazyComponent = lazy(importFn);
  return withSuspense(LazyComponent);
}; 
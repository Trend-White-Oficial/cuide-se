import { ComponentType } from 'react';
export declare const withSuspense: <P extends object>(Component: ComponentType<P>) => (props: P) => import("react/jsx-runtime").JSX.Element;
export declare const lazyLoad: <P extends object>(importFn: () => Promise<{
    default: ComponentType<P>;
}>) => (props: (import("react").PropsWithoutRef<P> & import("react").RefAttributes<import("react").Component<P, any, any>>) | import("react").PropsWithRef<P>) => import("react/jsx-runtime").JSX.Element;

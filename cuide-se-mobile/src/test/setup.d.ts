import '@testing-library/jest-dom';
declare global {
    interface Window {
        localStorage: Storage;
        matchMedia: (query: string) => MediaQueryList;
        IntersectionObserver: typeof IntersectionObserver;
        ResizeObserver: typeof ResizeObserver;
    }
}

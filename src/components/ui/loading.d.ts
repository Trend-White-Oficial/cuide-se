interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'spinner' | 'dots' | 'pulse';
}
export declare const LoadingFallback: ({ className, size, variant, ...props }: LoadingProps) => import("react/jsx-runtime").JSX.Element;
export {};

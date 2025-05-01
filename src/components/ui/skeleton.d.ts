interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular';
    animation?: 'pulse' | 'wave' | 'none';
}
export declare const Skeleton: ({ className, variant, animation, ...props }: SkeletonProps) => import("react/jsx-runtime").JSX.Element;
export declare const SkeletonText: ({ lines, className, ...props }: {
    lines?: number;
} & SkeletonProps) => import("react/jsx-runtime").JSX.Element;
export declare const SkeletonCard: ({ className, ...props }: SkeletonProps) => import("react/jsx-runtime").JSX.Element;
export {};

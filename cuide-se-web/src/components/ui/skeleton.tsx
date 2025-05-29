import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = ({
  className,
  variant = 'text',
  animation = 'pulse',
  ...props
}: SkeletonProps) => {
  return (
    <div
      className={cn(
        'bg-gray-200',
        {
          'rounded-full': variant === 'circular',
          'rounded-lg': variant === 'rectangular',
          'h-4 w-full': variant === 'text',
          'animate-pulse': animation === 'pulse',
          'animate-shimmer': animation === 'wave',
        },
        className
      )}
      {...props}
    />
  );
};

export const SkeletonText = ({ lines = 1, className, ...props }: { lines?: number } & SkeletonProps) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className, ...props }: SkeletonProps) => {
  return (
    <div className={cn('p-4 space-y-4', className)} {...props}>
      <Skeleton variant="circular" className="h-12 w-12" />
      <SkeletonText lines={2} />
      <Skeleton variant="rectangular" className="h-32 w-full" />
    </div>
  );
};

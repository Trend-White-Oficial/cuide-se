import { cn } from "@/utils/cn";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const LoadingFallback = ({
  className,
  size = 'md',
  variant = 'spinner',
  ...props
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const variantClasses = {
    spinner: 'animate-spin rounded-full border-t-2 border-b-2 border-pink',
    dots: 'flex space-x-1',
    pulse: 'animate-pulse rounded-full bg-pink',
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center', className)} {...props}>
        <div className={cn('flex space-x-1', sizeClasses[size])}>
          <div className="h-2 w-2 rounded-full bg-pink animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-pink animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-pink animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <div className={cn(sizeClasses[size], variantClasses[variant])} />
    </div>
  );
}; 
import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps {
  variant?: 'default' | 'warning' | 'error';
  className?: string;
  children: React.ReactNode;
}

export const Alert = ({ variant = 'default', className, children }: AlertProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        {
          'bg-yellow-50 border-yellow-200 text-yellow-800': variant === 'warning',
          'bg-red-50 border-red-200 text-red-800': variant === 'error',
          'bg-white border-gray-200': variant === 'default',
        },
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({ children }: { children: React.ReactNode }) => {
  return <h5 className="mb-1 font-medium leading-none tracking-tight">{children}</h5>;
};

export const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm [&_a]:text-current [&_a]:underline">{children}</div>;
};
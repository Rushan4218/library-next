import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', icon, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`flex h-10 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 px-3.5 py-2 text-xs text-gray-900 dark:text-gray-100 ring-offset-white transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-gray-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
            icon ? 'pl-10' : ''
          } ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

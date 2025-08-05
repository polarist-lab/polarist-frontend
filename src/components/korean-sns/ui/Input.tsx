'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'underlined';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    inputSize = 'md',
    error = false,
    leftIcon,
    rightIcon,
    type = 'text',
    ...props 
  }, ref) => {
    const baseStyles = "w-full transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      default: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:border-korean-primary dark:focus:border-korean-primary",
      filled: "border-0 bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-korean-primary",
      underlined: "border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-korean-primary rounded-none"
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-md",
      md: "h-10 px-4 text-sm rounded-lg", 
      lg: "h-12 px-4 text-base rounded-lg"
    };

    const errorStyles = error ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400" : "";

    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              baseStyles,
              variants[variant],
              sizes[inputSize],
              errorStyles,
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[inputSize],
          errorStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled';
  error?: boolean;
  resize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default',
    error = false,
    resize = true,
    ...props 
  }, ref) => {
    const baseStyles = "w-full min-h-20 px-4 py-3 text-sm transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      default: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:border-korean-primary dark:focus:border-korean-primary rounded-lg",
      filled: "border-0 bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-korean-primary rounded-lg"
    };

    const errorStyles = error ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400" : "";
    const resizeStyles = resize ? "resize-y" : "resize-none";

    return (
      <textarea
        className={cn(
          baseStyles,
          variants[variant],
          errorStyles,
          resizeStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea, type InputProps, type TextareaProps };
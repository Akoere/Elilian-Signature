/**
 * File: Button.jsx
 * Purpose: Reusable button component.
 * Dependencies: clsx, tailwind-merge
 * Notes: Supports primary, secondary, and ghost variants.
 */
import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ 
  className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props 
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white";
  
  const variants = {
    primary: "bg-[#1B1F3B] text-white hover:bg-[#1B1F3B]/90",
    secondary: "bg-[#C0522C] text-white hover:bg-[#C0522C]/90",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
  };
  
  const sizes = {
    sm: "h-9 px-3",
    md: "h-11 px-6",
    lg: "h-14 px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});
Button.displayName = "Button";

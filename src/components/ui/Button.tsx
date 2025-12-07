import React from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}
export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'min-h-[56px] px-6 rounded-xl font-semibold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 text-white active:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 active:bg-gray-200',
    danger: 'bg-red-600 text-white active:bg-red-700'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return <button className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} {...props}>
      {children}
    </button>;
}
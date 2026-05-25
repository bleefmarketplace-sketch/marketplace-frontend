import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '', 
  isLoading = false,  
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-none font-mono uppercase font-bold tracking-tight transition-colors focus:outline-none focus:ring-1 focus:ring-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed border";
  
  const variants = {
    primary: "bg-green-700 text-white border-green-700 hover:bg-green-800",
    secondary: "bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300",
    outline: "bg-transparent border border-green-700 text-green-800 hover:bg-green-50",
    danger: "bg-red-700 text-white border-red-700 hover:bg-red-800",
    ghost: "bg-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 border-transparent",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-3 text-sm",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
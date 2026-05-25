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
  const baseStyles = "inline-flex items-center justify-center rounded-none uppercase font-mono tracking-tight text-xs font-bold border transition-all duration-155 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green-700 text-white border-green-700 hover:bg-green-800 hover:border-green-800",
    secondary: "bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400",
    outline: "bg-transparent border border-green-700 text-green-800 hover:bg-green-50",
    danger: "bg-red-600 text-white border-red-600 hover:bg-red-700",
    ghost: "bg-transparent border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-2.5 text-xs",
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
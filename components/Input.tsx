'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          className={`w-full rounded-none border border-zinc-300 bg-white font-mono py-2 ${icon ? 'pl-9' : 'pl-3'} ${isPassword ? 'pr-9' : 'pr-3'} text-xs placeholder-zinc-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600/30 disabled:bg-zinc-100`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-[10px] font-mono text-red-600">{error}</p>}
    </div>
  );
};
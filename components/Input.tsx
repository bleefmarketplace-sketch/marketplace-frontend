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
      {label && <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          className={`w-full rounded-none border border-zinc-300 bg-white py-2 px-3 text-xs font-mono placeholder-zinc-400 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600/30 disabled:bg-zinc-100 ${icon ? 'pl-9' : 'pl-3'} ${isPassword ? 'pr-9' : 'pr-3'}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
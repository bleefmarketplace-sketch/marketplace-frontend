import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-none border border-zinc-200 shadow-xs overflow-hidden ${className} ${onClick ? 'cursor-pointer transition-colors hover:border-zinc-400 bg-zinc-50/20' : ''}`}
      onClick={onClick}
    >
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
};
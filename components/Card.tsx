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
      className={`bg-white rounded-none border border-zinc-200 overflow-hidden ${className} ${onClick ? 'cursor-pointer transition-colors hover:bg-zinc-50/60 hover:border-zinc-300' : ''}`}
      onClick={onClick}
    >
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
};
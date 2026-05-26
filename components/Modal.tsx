import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className={`relative bg-white rounded-none border border-zinc-300 shadow-none w-full ${sizes[size]} max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300 font-mono text-xs`}>
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-200">
          <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 border border-zinc-200 rounded-none transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
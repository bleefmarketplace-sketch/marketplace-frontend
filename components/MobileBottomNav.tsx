'use client';

import React from 'react';
import { Home, Search, ShoppingBag, User, Heart, BookOpen, MessageCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/useCartStore';

export const MobileBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const getItemCount = useCartStore((state) => state.getItemCount());

    // Only show on marketplace and account related pages, and only on mobile
    const showOn = ['/marketplace', '/account', '/community', '/learning'];
    const isVisible = showOn.some(path => pathname.startsWith(path)) || pathname === '/';

    if (!isVisible) return null;

    const navItems = [
        { label: 'Shop', icon: Home, path: '/marketplace', active: pathname.startsWith('/marketplace') },
        { label: 'Academy', icon: BookOpen, path: '/learning', active: pathname.startsWith('/learning') },
        { label: 'Social', icon: MessageCircle, path: '/community', active: pathname.startsWith('/community') },
        { label: 'Orders', icon: ShoppingBag, path: '/dashboard/buyer/orders', active: pathname.includes('orders') },
        { 
            label: 'Account', 
            icon: User, 
            path: user?.role === 'buyer' ? '/account' : '/dashboard', 
            active: pathname.startsWith('/account') || pathname.startsWith('/dashboard') 
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-4 py-2 z-[100] flex justify-between items-center pb-safe">
            {navItems.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => router.push(item.path)}
                    className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all ${
                        item.active ? 'text-emerald-600' : 'text-gray-400'
                    }`}
                >
                    <div className="relative">
                        <item.icon size={22} strokeWidth={item.active ? 2.5 : 2} />
                        {item.label === 'Orders' && getItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                {getItemCount}
                            </span>
                        )}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${item.active ? 'opacity-100' : 'opacity-60'}`}>
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

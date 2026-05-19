'use client';

import React from 'react';
import { 
    User, ShoppingBag, Wallet, Shield, MapPin, 
    Bell, LogOut, ChevronRight, Settings, 
    CreditCard, Heart, Star, HelpCircle
} from 'lucide-react';
import { Card } from '@/components/Card';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const MENU_GROUPS = [
        {
            title: "My Activity",
            items: [
                { label: "My Orders", icon: ShoppingBag, path: "/dashboard/buyer/orders", color: "text-blue-600 bg-blue-50" },
                { label: "My Wallet", icon: Wallet, path: "/dashboard/buyer/wallet", color: "text-emerald-600 bg-emerald-50" },
                { label: "Wishlist", icon: Heart, path: "/dashboard/buyer/library", color: "text-red-600 bg-red-50" },
                { label: "Reviews", icon: Star, path: "/account/reviews", color: "text-amber-600 bg-amber-50" },
            ]
        },
        {
            title: "Settings & Security",
            items: [
                { label: "Profile Information", icon: User, path: "/account/profile", color: "text-purple-600 bg-purple-50" },
                { label: "Shipping Addresses", icon: MapPin, path: "/account/addresses", color: "text-orange-600 bg-orange-50" },
                { label: "Login & Security", icon: Shield, path: "/account/security", color: "text-indigo-600 bg-indigo-50" },
                { label: "Notifications", icon: Bell, path: "/account/notifications", color: "text-pink-600 bg-pink-50" },
            ]
        },
        {
            title: "Support",
            items: [
                { label: "Help Center", icon: HelpCircle, path: "/support", color: "text-gray-600 bg-gray-50" },
                { label: "Dispute Center", icon: Shield, path: "/dashboard/disputes", color: "text-gray-600 bg-gray-50" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header / Profile Summary */}
            <div className="bg-white border-b border-gray-100 pt-12 pb-8">
                <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 mb-4">
                        <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden relative">
                            {user.userAvatar ? (
                                <Image fill src={user.userAvatar} alt="Avatar" className="object-cover" unoptimized />
                            ) : (
                                <User size={40} className="text-emerald-600" />
                            )}
                        </div>
                        <button 
                            onClick={() => router.push('/account/profile')}
                            className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full border-2 border-white shadow-lg hover:bg-emerald-700 transition-colors"
                        >
                            <Settings size={14} />
                        </button>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">{user.fullName}</h1>
                    <p className="text-gray-500 text-sm font-medium">{user.email}</p>
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                            {user.role} Account
                        </span>
                        {user.isVerified && (
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 flex items-center gap-1">
                                Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="max-w-3xl mx-auto px-4 mt-8 space-y-8">
                {MENU_GROUPS.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-3">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{group.title}</h2>
                        <Card className="divide-y divide-gray-50 border-gray-100 overflow-hidden shadow-sm">
                            {group.items.map((item, iIdx) => (
                                <div 
                                    key={iIdx} 
                                    onClick={() => router.push(item.path)}
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className="font-bold text-gray-700">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            ))}
                        </Card>
                    </div>
                ))}

                {/* Logout */}
                <button 
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>

                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-8">
                    Bleefy Marketplace v1.0.4
                </p>
            </div>
        </div>
    );
}

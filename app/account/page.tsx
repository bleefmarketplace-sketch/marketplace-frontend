'use client';

import React, { useState, useEffect } from 'react';
import {
    User, ShoppingBag, Shield, MapPin,
    Bell, LogOut, ChevronRight, Settings,
    CreditCard, Heart, Star, HelpCircle, ShieldCheck, ShieldAlert,
    RefreshCw, Loader2
} from 'lucide-react';
import { Card } from '@/components/Card';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-zinc-50/50 pb-24 font-mono text-zinc-900 text-xs antialiased">
            {/* Upper Telemetry Header */}
            <div className="bg-white border-b border-zinc-200 py-6 mb-8 select-none">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <span className="px-2 py-0.5 text-[9px] bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                            BUYER SERVICE ACCOUNT
                        </span>
                        <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-1.5">Account Administration</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push('/')}
                            className="h-8 px-4 border border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-700 font-bold uppercase tracking-wider text-[9px] cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                            Return to Marketplace
                        </button>
                        <button
                            onClick={() => logout()}
                            className="h-8 px-4 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold uppercase tracking-wider text-[9px] cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                            <LogOut size={11} /> SIGN OUT
                        </button>
                    </div>
                </div>
            </div>

            {/* Split Pane Grid Layout */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* LEFT SIDEBAR PANEL */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Profile Summary Widget */}
                        <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none text-center flex flex-col items-center">
                            <div className="relative w-20 h-20 mb-4 group select-none">
                                <div className="w-full h-full border border-zinc-250 bg-zinc-50 flex items-center justify-center shrink-0 overflow-hidden relative rounded-none">
                                    {user.userAvatar ? (
                                        <Image fill src={user.userAvatar} alt="Avatar" className="object-cover" unoptimized />
                                    ) : (
                                        <User size={32} className="text-green-700" />
                                    )}
                                </div>
                                <button
                                    onClick={() => router.push('/account/profile')}
                                    className="absolute -bottom-1 -right-1 p-1.5 bg-zinc-950 text-white border border-zinc-800 rounded-none hover:bg-zinc-900 transition-colors shadow-md cursor-pointer"
                                    title="Edit Profile"
                                >
                                    <Settings size={12} />
                                </button>
                            </div>

                            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-955 truncate max-w-full leading-tight">{user.fullName}</h3>
                            <p className="text-zinc-400 text-[10px] truncate max-w-full font-mono lowercase mt-0.5">{user.email}</p>

                            <div className="mt-4 flex gap-1.5 select-none w-full justify-center">
                                <span className="bg-green-50 border border-green-200 text-green-800 text-[8px] font-bold uppercase px-2 py-0.5 rounded-none tracking-widest">
                                    {user.role}
                                </span>
                                {user.isVerified ? (
                                    <span className="bg-blue-50 text-blue-700 text-[8px] font-bold uppercase px-2 py-0.5 border border-blue-200 rounded-none flex items-center gap-0.5">
                                        <ShieldCheck size={10} /> Verified
                                    </span>
                                ) : (
                                    <span className="bg-amber-50 text-amber-700 text-[8px] font-bold uppercase px-2 py-0.5 border border-amber-200 rounded-none flex items-center gap-0.5">
                                        <ShieldAlert size={10} /> Unverified
                                    </span>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT MAIN AREA */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* CATEGORY: E-COMMERCE CORE ACTIVITY */}
                        <div className="space-y-3.5">
                            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 leading-none">
                                E-Commerce Portfolio & Activity
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Card 1: My Orders */}
                                <div
                                    onClick={() => router.push('/account/orders')}
                                    className="bg-white border border-zinc-200 p-5 cursor-pointer hover:border-green-600 transition-all hover:-translate-y-0.5 duration-200 group flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0 rounded-none group-hover:scale-105 transition-transform">
                                        <ShoppingBag size={18} />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-950 uppercase tracking-wider text-xs flex items-center justify-between gap-1 leading-none">
                                            <span>Order Ledger & Tracking</span>
                                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-green-700 group-hover:translate-x-0.5 transition-all" />
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans font-medium">
                                            Monitor your active produce orders, download purchase invoices, and inspect logistics delivery coordinates.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2: Wishlist & Learning Library */}
                                <div
                                    onClick={() => router.push('/account/library')}
                                    className="bg-white border border-zinc-200 p-5 cursor-pointer hover:border-green-600 transition-all hover:-translate-y-0.5 duration-200 group flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-red-50 border border-red-100 text-red-700 flex items-center justify-center shrink-0 rounded-none group-hover:scale-105 transition-transform">
                                        <Heart size={18} />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-950 uppercase tracking-wider text-xs flex items-center justify-between gap-1 leading-none">
                                            <span>Digital Vault & Courses</span>
                                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-green-700 group-hover:translate-x-0.5 transition-all" />
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans font-medium">
                                            Explore your purchased agronomy webinars, precision drone tutorials, and download scientific farming handbooks.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 4: Reviews */}
                                <div
                                    onClick={() => router.push('/account/orders')}
                                    className="bg-white border border-zinc-200 p-5 cursor-pointer hover:border-green-600 transition-all hover:-translate-y-0.5 duration-200 group flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shrink-0 rounded-none group-hover:scale-105 transition-transform">
                                        <Star size={18} />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-950 uppercase tracking-wider text-xs flex items-center justify-between gap-1 leading-none">
                                            <span>Merchant Rating Feedback</span>
                                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-green-700 group-hover:translate-x-0.5 transition-all" />
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans font-medium">
                                            Manage your published ratings, crop vendor appraisals, and inspect comments from verified cooperative sellers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CATEGORY: ACCOUNT CONTROLS & SECURITY */}
                        <div className="space-y-3.5">
                            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 leading-none">
                                Settings & Security Configurations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Card 1: Profile Information */}
                                <div
                                    onClick={() => router.push('/account/profile')}
                                    className="bg-white border border-zinc-200 p-5 cursor-pointer hover:border-green-600 transition-all hover:-translate-y-0.5 duration-200 group flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shrink-0 rounded-none group-hover:scale-105 transition-transform">
                                        <User size={18} />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-950 uppercase tracking-wider text-xs flex items-center justify-between gap-1 leading-none">
                                            <span>Profile & Shipments</span>
                                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-green-700 group-hover:translate-x-0.5 transition-all" />
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans font-medium">
                                            Update physical delivery locations, primary telephone links, active profile pictures, and notification tags.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2: Login & Security */}
                                <div
                                    onClick={() => router.push('/account/security')}
                                    className="bg-white border border-zinc-200 p-5 cursor-pointer hover:border-green-600 transition-all hover:-translate-y-0.5 duration-200 group flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 rounded-none group-hover:scale-105 transition-transform">
                                        <Shield size={18} />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-950 uppercase tracking-wider text-xs flex items-center justify-between gap-1 leading-none">
                                            <span>Access Controls & 2FA</span>
                                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-green-700 group-hover:translate-x-0.5 transition-all" />
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans font-medium">
                                            Change system login passwords, bind secure two-factor authorization modules, and monitor session locks.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 3: Dispute Center */}
                                <div
                                    onClick={() => router.push('/account/disputes')}
                                    className="bg-white border border-zinc-200 p-5 cursor-pointer hover:border-green-600 transition-all hover:-translate-y-0.5 duration-200 group flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-zinc-50 border border-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 rounded-none group-hover:scale-105 transition-transform">
                                        <HelpCircle size={18} />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h3 className="font-bold text-zinc-950 uppercase tracking-wider text-xs flex items-center justify-between gap-1 leading-none">
                                            <span>Escrow Dispute Center</span>
                                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-green-700 group-hover:translate-x-0.5 transition-all" />
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans font-medium">
                                            Query refund status metrics, open escrow claims against delayed items, and check escrow settlement solutions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>


        </div>
    );
}

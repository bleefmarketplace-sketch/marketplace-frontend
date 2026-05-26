'use client';

import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, Shield, Lock, Loader2, 
    AlertTriangle, CheckCircle, Smartphone, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { TwoFactorModal } from '@/components/AdminComponents/TwoFactorModal';

export default function SecurityPage() {
    const fetcher = useApi();
    const router = useRouter();
    const { user, refreshUserData, logout } = useAuth();

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    useEffect(() => {
        if (user) {
            setIs2FAEnabled(user.isTwoFactorEnabled || false);
        }
    }, [user]);

    const handleToggle2FA = async () => {
        if (!is2FAEnabled) {
            setIs2FAModalOpen(true);
        } else {
            if (confirm("Disabling 2FA will leave your account vulnerable. Proceed?")) {
                try {
                    await fetcher('/api/users/profile', {
                        method: 'PATCH',
                        body: JSON.stringify({ isTwoFactorEnabled: false })
                    });
                    setIs2FAEnabled(false);
                    toast.warn("Two-Factor Authentication Disabled");
                    refreshUserData();
                } catch (e) { 
                    toast.error("Failed to disable Two-Factor Authentication"); 
                }
            }
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("New passwords do not match");
        }

        if (passwords.newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        setLoading(true);
        try {
            await fetcher('/api/users/change-password', {
                method: 'PATCH',
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                })
            });
            toast.success("Password changed successfully! Signing out...");
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            
            // Sign out safely
            setTimeout(() => {
                logout();
            }, 1000);
        } catch (err: any) {
            toast.error(err.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4 space-y-6 font-mono text-zinc-900 text-xs antialiased pb-24">
            
            {/* Telemetry Header */}
            <div className="border border-zinc-200 bg-white p-5 select-none sticky top-16 z-20 shadow-none flex items-center gap-4">
                <button 
                    onClick={() => router.push('/account')} 
                    className="p-2 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-none cursor-pointer flex items-center justify-center shrink-0"
                >
                    <ChevronLeft size={16} />
                </button>
                <div>
                    <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                        SECURE TERMINAL PARMETERS
                    </span>
                    <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-955 mt-1">Login & Security</h1>
                </div>
            </div>

            {/* Real 2FA Security Card */}
            <Card className="p-5 border border-zinc-200 bg-zinc-50 rounded-none shadow-none text-zinc-900 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="relative z-10 max-w-md space-y-1.5">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 leading-none flex items-center gap-1.5">
                        <Smartphone size={14} className="text-green-700 animate-pulse" /> Two-Factor Authentication
                    </h3>
                    <p className="text-zinc-500 text-[10px] leading-relaxed font-sans font-medium">
                        Secure your terminal session. When enabled, verification prompts will trigger for all sensitive actions and login sessions.
                    </p>
                </div>
                <div className="relative z-10 shrink-0 select-none">
                    <button 
                        type="button" 
                        onClick={handleToggle2FA} 
                        className={`px-4 py-2 border text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-none ${
                            is2FAEnabled 
                                ? 'border-green-700 bg-green-50 text-green-800 font-extrabold' 
                                : 'border-red-200 bg-red-50 text-red-850'
                        }`}
                    >
                        {is2FAEnabled ? '● ENABLED' : '○ DISABLED'}
                    </button>
                </div>
            </Card>

            {/* Password Change Form */}
            <Card className="p-6 md:p-8 bg-white border border-zinc-200 rounded-none shadow-none space-y-6">
                <div className="flex items-center gap-2 select-none border-b border-zinc-150 pb-2">
                    <Lock size={15} className="text-green-700" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950">Change Credentials</h2>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest ml-1">Current Password</label>
                        <Input 
                            type="password"
                            value={passwords.oldPassword}
                            onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-455 uppercase tracking-widest ml-1">New Password</label>
                        <Input 
                            type="password"
                            value={passwords.newPassword}
                            onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-455 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <Input 
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-zinc-200">
                        <button 
                            type="submit"
                            disabled={loading || !passwords.oldPassword || !passwords.newPassword}
                            className="rounded-none h-10 px-6 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-white font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin text-white" size={14} /> : 'Commit New Password'}
                        </button>
                    </div>
                </form>
            </Card>

            {/* Security Tips */}
            <div className="space-y-4 pt-4 select-none">
                <h3 className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest ml-1">Security Best Practices</h3>
                <div className="space-y-3 font-mono text-[10px]">
                    <div className="flex gap-3 items-start bg-zinc-50 border border-zinc-200 p-4">
                        <CheckCircle size={14} className="text-green-700 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide leading-relaxed">
                            Use a unique, complex passphrase for Bleefy that you do not share with other networks.
                        </p>
                    </div>
                    <div className="flex gap-3 items-start bg-zinc-50 border border-zinc-200 p-4">
                        <CheckCircle size={14} className="text-green-700 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide leading-relaxed">
                            Never disclose verification codes, secure SMS tokens, or login passwords to anyone.
                        </p>
                    </div>
                </div>
            </div>

            <TwoFactorModal
                isOpen={is2FAModalOpen}
                onClose={() => setIs2FAModalOpen(false)}
                onSuccess={async () => {
                    await refreshUserData();
                    setIs2FAModalOpen(false);
                    setIs2FAEnabled(true);
                }}
            />
        </div>
    );
}

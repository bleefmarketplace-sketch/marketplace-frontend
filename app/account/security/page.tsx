'use client';

import React, { useState } from 'react';
import { 
    ChevronLeft, Shield, Lock, Loader2, 
    AlertTriangle, CheckCircle, Smartphone
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function SecurityPage() {
    const fetcher = useApi();
    const router = useRouter();

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);

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
            toast.success("Password changed successfully");
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            toast.error(err.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-50 rounded-full">
                    <ChevronLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="flex-1 text-center font-black text-gray-900 mr-10">Login & Security</h1>
            </div>

            <div className="max-w-xl mx-auto p-6 space-y-10 pb-32">
                {/* 2FA Summary (Placeholder for now) */}
                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 rounded-3xl">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                Add an extra layer of security to your account by requiring a code from your phone to log in.
                            </p>
                            <Button variant="ghost" className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest p-0 h-auto mt-3">
                                Enable Now (Coming Soon)
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Password Change Form */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock size={18} className="text-emerald-600" />
                        <h2 className="text-lg font-black text-gray-900">Change Password</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                            <Input 
                                type="password"
                                value={passwords.oldPassword}
                                onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                                placeholder="••••••••"
                                className="h-14 rounded-2xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                            <Input 
                                type="password"
                                value={passwords.newPassword}
                                onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                                placeholder="••••••••"
                                className="h-14 rounded-2xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                            <Input 
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                                placeholder="••••••••"
                                className="h-14 rounded-2xl"
                            />
                        </div>

                        <Button 
                            type="submit"
                            fullWidth 
                            className="h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 mt-4"
                            disabled={loading || !passwords.oldPassword || !passwords.newPassword}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                        </Button>
                    </form>
                </div>

                {/* Security Tips */}
                <div className="space-y-4 pt-10">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Security Best Practices</h3>
                    <div className="space-y-3">
                        <SecurityTip text="Use a unique password for Bleefy that you don't use anywhere else." />
                        <SecurityTip text="Never share your verification codes or login credentials with anyone." />
                        <SecurityTip text="Regularly review your account activity for any suspicious behavior." />
                    </div>
                </div>
            </div>
        </div>
    );
}

const SecurityTip = ({ text }: { text: string }) => (
    <div className="flex gap-3 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-relaxed font-medium">{text}</p>
    </div>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
        {children}
    </div>
);

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import {
    User, Lock, ShieldCheck, Camera,
    Loader2, 
    Settings2,
    Plus,
    ShieldAlert,
    X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import SettingsUtility from './SettingsUtility';
import Image from 'next/image';
import { TwoFactorModal } from './TwoFactorModal';

export default function SettingsPage() {
    const { user, logout, refreshUserData } = useAuth();
    const fetcher = useApi();

    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'utility'>('profile');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    // Inline Tag Input states
    const [newExpertise, setNewExpertise] = useState("");
    const [newInterest, setNewInterest] = useState("");
    const [showExpertiseInput, setShowExpertiseInput] = useState(false);
    const [showInterestInput, setShowInterestInput] = useState(false);

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
                    toast.warn("2FA Disabled");
                    refreshUserData();
                } catch (e) { toast.error("Failed to disable 2FA"); }
            }
        }
    };

    // Profile State
    const [profile, setProfile] = useState({
        fullName: '',
        phoneNumber: '',
        location: '',
        address: '',
        farmName: '',
        farmSize: '',
        userAvatar: '',
        areaOfInterest: [] as string[],
        areaOfExpertise: [] as string[],
    });

    // Password State
    const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });

    useEffect(() => {
        if (user) {
            setProfile({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber?.toString() || '',
                location: user.location || '',
                address: user.address || '',
                farmName: user.farmName || '',
                farmSize: user.farmSize || '',
                userAvatar: user.userAvatar || '',
                areaOfInterest: user.areaOfInterest || [],
                areaOfExpertise: user.areaOfExpertise || [],
            });
            setIs2FAEnabled(user.isTwoFactorEnabled || false);
        }
    }, [user]);

    // addTag has been replaced by beautiful inline tags input controllers

    const removeTag = (type: 'expertise' | 'interest', index: number) => {
        const key = type === 'expertise' ? 'areaOfExpertise' : 'areaOfInterest';
        setProfile(prev => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index)
        }));
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetcher('/api/users/profile', {
                method: 'PATCH',
                body: JSON.stringify(profile)
            });
            toast.success("Profile updated");
            refreshUserData();
        } catch (e: any) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwd.newPassword !== pwd.confirm) return toast.error("New passwords do not match");

        setLoading(true);
        try {
            await fetcher('/api/users/change-password', {
                method: 'PATCH',
                body: JSON.stringify({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword })
            });

            toast.success("Password changed");
            setPwd({ currentPassword: '', newPassword: '', confirm: '' });
            logout();
        } catch (e: any) { toast.error(e.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">
            {/* Header */}
            <div className="border border-zinc-200 bg-white p-5">
                <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                  IDENTITY CONFIG
                </span>
                <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Operational Settings</h1>
                <p className="text-zinc-500 text-[10px] mt-0.5">Manage system identity, multifactor security clearances, and system preferences.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-zinc-100 p-1 rounded-none border border-zinc-200 w-fit select-none font-mono font-bold">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-5 py-2.5 rounded-none text-xs transition-colors flex items-center gap-2 border border-transparent cursor-pointer ${activeTab === 'profile' ? 'bg-white border-zinc-250 text-green-800 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                    <User size={14} /> PROFILE
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`px-5 py-2.5 rounded-none text-xs transition-colors flex items-center gap-2 border border-transparent cursor-pointer ${activeTab === 'security' ? 'bg-white border-zinc-250 text-green-800 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                    <Lock size={14} /> SECURITY
                </button>
                <button
                    onClick={() => setActiveTab('utility')}
                    className={`px-5 py-2.5 rounded-none text-xs transition-colors flex items-center gap-2 border border-transparent cursor-pointer ${activeTab === 'utility' ? 'bg-white border-zinc-250 text-green-800 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                    <Settings2 size={14} /> UTILITY
                </button>
            </div>

            {activeTab === 'profile' ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                    <Card className="p-6 md:p-8 bg-white border border-zinc-200 rounded-none shadow-none">
                        {/* Avatar */}
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-8 border-b border-zinc-150">
                            <div className="relative group">
                                <div className="w-28 h-28 border border-zinc-250 bg-zinc-50 text-green-700 rounded-none overflow-hidden relative flex items-center justify-center shrink-0">
                                    {profile.userAvatar ? <Image unoptimized fill src={profile.userAvatar} className="object-cover" alt="Avatar" /> : <User size={40} />}
                                    {uploading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><Loader2 className="animate-spin text-green-700" size={16} /></div>}
                                </div>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-zinc-950 text-white p-2 border border-zinc-800 rounded-none cursor-pointer"><Camera size={14} /></button>
                                <input type="file" ref={fileInputRef} onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploading(true);
                                    const fd = new FormData(); fd.append('file', file);
                                    const res = await fetch('/api/upload/upload-single-image', { method: 'POST', body: fd }).then(r => r.json());
                                    setProfile(p => ({ ...p, userAvatar: res.url }));
                                    setUploading(false);
                                }} className="hidden" accept="image/*" />
                            </div>
                            <div className="text-center md:text-left space-y-1">
                                <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-900">{profile.fullName || 'Farmer Profile'}</h3>
                                <div className="flex items-center gap-2 mt-1 justify-center md:justify-start select-none">
                                    <span className="bg-green-50 border border-green-200 text-green-800 text-[8px] font-bold uppercase px-2 py-0.5 rounded-none tracking-widest">{user?.role}</span>
                                    {user?.isVerified && <span className="bg-blue-50 text-blue-700 text-[8px] font-bold uppercase px-2 py-0.5 border border-blue-200 rounded-none flex items-center gap-1"><ShieldCheck size={11}/> Verified</span>}
                                </div>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-1.5">Personal details</h4>
                                <Input label="Full Name" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} />
                                <Input label="Phone Number" value={profile.phoneNumber} onChange={e => setProfile({...profile, phoneNumber: e.target.value})} />
                                <Input label="Physical Address" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                            </div>
                            
                            {user?.role !== 'admin' && (
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-1.5">Agricultural details</h4>
                                    <Input label="Farm Name" value={profile.farmName} onChange={e => setProfile({...profile, farmName: e.target.value})} />
                                    <Input label="Business Size" value={profile.farmSize} onChange={e => setProfile({...profile, farmSize: e.target.value})} />
                                    <Input label="Location" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
                                </div>
                            )}
                        </div>

                        {/* Tags System */}
                        <div className="mt-8 grid md:grid-cols-2 gap-8 border-t border-zinc-150 pt-8 font-mono">
                            {/* Expertise */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between items-center px-1 leading-none mb-1">
                                    <span>Area of Expertise</span>
                                    <button type="button" onClick={() => setShowExpertiseInput(!showExpertiseInput)} className="text-green-700 hover:text-green-800 cursor-pointer"><Plus size={14}/></button>
                                </label>

                                {showExpertiseInput && (
                                    <div className="flex items-center gap-2 animate-in fade-in duration-200">
                                        <input
                                            type="text"
                                            placeholder="ADD EXPERTISE..."
                                            value={newExpertise}
                                            onChange={(e) => setNewExpertise(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newExpertise.trim()) {
                                                        setProfile(prev => ({ ...prev, areaOfExpertise: [...prev.areaOfExpertise, newExpertise.trim()] }));
                                                        setNewExpertise("");
                                                        setShowExpertiseInput(false);
                                                    }
                                                }
                                            }}
                                            className="flex-1 bg-zinc-50 border border-zinc-300 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-900 rounded-none focus:outline-none focus:border-green-700"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newExpertise.trim()) {
                                                    setProfile(prev => ({ ...prev, areaOfExpertise: [...prev.areaOfExpertise, newExpertise.trim()] }));
                                                    setNewExpertise("");
                                                    setShowExpertiseInput(false);
                                                }
                                            }}
                                            className="bg-green-700 hover:bg-green-800 border border-green-700 text-white px-2 py-1 font-bold text-[9px] uppercase tracking-wider rounded-none cursor-pointer"
                                        >
                                            ADD
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewExpertise("");
                                                setShowExpertiseInput(false);
                                            }}
                                            className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-600 px-2 py-1 font-bold text-[9px] uppercase tracking-wider rounded-none cursor-pointer"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {profile.areaOfExpertise.map((tag, i) => (
                                        <span key={i} className="bg-green-50 border border-green-200 text-green-855 px-2 py-1 rounded-none text-[9px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                                            {tag} <X size={11} className="cursor-pointer text-zinc-400 hover:text-red-650" onClick={() => removeTag('expertise', i)} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Interests */}
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between items-center px-1 leading-none mb-1">
                                    <span>Area of Interest</span>
                                    <button type="button" onClick={() => setShowInterestInput(!showInterestInput)} className="text-green-700 hover:text-green-800 cursor-pointer"><Plus size={14}/></button>
                                </label>

                                {showInterestInput && (
                                    <div className="flex items-center gap-2 animate-in fade-in duration-200">
                                        <input
                                            type="text"
                                            placeholder="ADD INTEREST..."
                                            value={newInterest}
                                            onChange={(e) => setNewInterest(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newInterest.trim()) {
                                                        setProfile(prev => ({ ...prev, areaOfInterest: [...prev.areaOfInterest, newInterest.trim()] }));
                                                        setNewInterest("");
                                                        setShowInterestInput(false);
                                                    }
                                                }
                                            }}
                                            className="flex-1 bg-zinc-50 border border-zinc-300 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-900 rounded-none focus:outline-none focus:border-green-700"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newInterest.trim()) {
                                                    setProfile(prev => ({ ...prev, areaOfInterest: [...prev.areaOfInterest, newInterest.trim()] }));
                                                    setNewInterest("");
                                                    setShowInterestInput(false);
                                                }
                                            }}
                                            className="bg-green-700 hover:bg-green-800 border border-green-700 text-white px-2 py-1 font-bold text-[9px] uppercase tracking-wider rounded-none cursor-pointer"
                                        >
                                            ADD
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewInterest("");
                                                setShowInterestInput(false);
                                            }}
                                            className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-600 px-2 py-1 font-bold text-[9px] uppercase tracking-wider rounded-none cursor-pointer"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {profile.areaOfInterest.map((tag, i) => (
                                        <span key={i} className="bg-blue-50 border border-blue-200 text-blue-805 px-2 py-1 rounded-none text-[9px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                                            {tag} <X size={11} className="cursor-pointer text-zinc-400 hover:text-red-655" onClick={() => removeTag('interest', i)} />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end pt-4 border-t border-zinc-150">
                            <Button type="submit" disabled={loading} className="rounded-none h-10 px-6 bg-green-700 hover:bg-green-800 border-green-700 text-white uppercase font-bold tracking-wider text-[10px] flex items-center justify-center cursor-pointer">
                                {loading ? <Loader2 className="animate-spin text-white" size={14} /> : "Commit All Updates"}
                            </Button>
                        </div>
                    </Card>
                </form>
                
            ) : activeTab === 'security' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <Card className="p-6 md:p-8 bg-white border border-zinc-200 shadow-none rounded-none">
                         <form onSubmit={handleChangePassword} className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
                                <ShieldCheck className="text-green-700 animate-pulse" size={16} /> Password Management
                            </h3>

                            <div className="space-y-4 max-w-md">
                                <Input placeholder='**************' label="Current Password" type="password" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} />
                                <div className="h-px bg-zinc-150 my-2" />
                                <Input placeholder='**************' label="New Password" type="password" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} />
                                <Input placeholder='**************' label="Confirm New Password" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
                            </div>

                            <div className="pt-4 border-t border-zinc-155 mt-6">
                                <Button type="submit" disabled={loading} className="rounded-none h-10 w-44 bg-zinc-950 text-zinc-50 border border-zinc-900 hover:bg-zinc-900 uppercase font-bold tracking-wider text-[10px] flex items-center justify-center cursor-pointer">
                                    {loading ? <Loader2 className="animate-spin text-white" size={14} /> : "Update Password"}
                                </Button>
                            </div>
                         </form>
                    </Card>
               
                    <Card className="p-5 border border-zinc-200 bg-zinc-50 rounded-none shadow-none text-zinc-900 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <ShieldAlert className="absolute -right-8 -bottom-8 w-44 h-44 text-zinc-100/60 select-none pointer-events-none" />
                        <div className="relative z-10 max-w-md space-y-1.5">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 leading-none">Two-Factor Authentication</h3>
                            <p className="text-zinc-500 text-[10px] leading-relaxed">Secure your terminal session. When enabled, verification prompts will trigger for all sensitive escrow actions.</p>
                        </div>
                        <div className="relative z-10 shrink-0 select-none">
                            <button 
                                type="button" 
                                onClick={handleToggle2FA} 
                                className={`px-4 py-2 border text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-none ${
                                    is2FAEnabled 
                                      ? 'border-green-700 bg-green-50 text-green-800 font-extrabold' 
                                      : 'border-red-200 bg-red-50 text-red-800'
                                }`}
                            >
                                {is2FAEnabled ? '● ENABLED' : '○ DISABLED'}
                            </button>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="animate-in fade-in duration-300">
                    <SettingsUtility />  
                </div>
            )}

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
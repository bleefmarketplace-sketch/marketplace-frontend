'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, Camera, Loader2, Save,
    Mail, Phone, MapPin, CheckCircle,
    Users
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth, User } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function ProfileEditPage() {
    const { user, updateUser } = useAuth();
    const fetcher = useApi();
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        location: user?.location || '',
        userAvatar: user?.userAvatar || ''
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                location: user.location || '',
                userAvatar: user.userAvatar || ''
            });
        }
    }, [user]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch('/api/upload/upload-single-image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setForm(prev => ({ ...prev, userAvatar: data.data.url }));
                toast.success("Photo uploaded! Save changes to apply.");
            }
        } catch (err) {
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetcher('/api/users/profile', {
                method: 'PATCH',
                body: JSON.stringify(form)
            });

            if (res.success) {
                // Update local auth context
                const updatedUser: User = {
                    ...user,
                    ...form,
                };

                updateUser(updatedUser);
                toast.success("Profile updated successfully");
                router.back();
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
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
                <h1 className="flex-1 text-center font-black text-gray-900 mr-10">Edit Profile</h1>
            </div>

            <div className="max-w-xl mx-auto p-6 space-y-10 pb-32">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 border-4 border-white shadow-2xl overflow-hidden relative">
                            {form.userAvatar ? (
                                <Image fill src={form.userAvatar} alt="Avatar" className="object-cover" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Users size={48} />
                                </div>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-white" size={24} />
                                </div>
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-colors cursor-pointer border-2 border-white">
                            <Camera size={18} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>
                    </div>
                    <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Photo</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <Input
                            value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                            placeholder="Your display name"
                            className="h-14 rounded-2xl"
                            icon={<Users size={18} className="text-gray-400" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (Read-only)</label>
                        <Input
                            value={user?.email || ''}
                            readOnly
                            disabled
                            className="h-14 rounded-2xl bg-gray-50 text-gray-400 border-gray-100"
                            icon={<Mail size={18} className="text-gray-200" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <Input
                            value={form.phoneNumber}
                            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                            placeholder="+234 ..."
                            className="h-14 rounded-2xl"
                            icon={<Phone size={18} className="text-gray-400" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location / State</label>
                        <Input
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                            placeholder="e.g. Lagos, Nigeria"
                            className="h-14 rounded-2xl"
                            icon={<MapPin size={18} className="text-gray-400" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shipping Address</label>
                        <textarea
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                            placeholder="Enter your full home or office address..."
                            className="w-full p-4 border border-gray-200 rounded-2xl min-h-[120px] focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                        />
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
                    <CheckCircle className="text-emerald-600 shrink-0 mt-1" size={20} />
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Profile Integrity</h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            Keeping your information up to date ensures faster order processing and reliable delivery.
                            Verified profiles have a 40% higher trust rating in the marketplace.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40">
                <div className="max-w-xl mx-auto">
                    <Button
                        fullWidth
                        className="h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100"
                        onClick={handleSave}
                        disabled={loading || uploading}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}

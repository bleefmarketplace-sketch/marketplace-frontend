'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, Camera, Loader2, Save,
    Mail, Phone, MapPin, CheckCircle,
    Users, User as UserIcon
} from 'lucide-react';
import { useAuth, User } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';

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

    // --- Drag & Drop & Webcam States & Handlers ---
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleAvatarDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingAvatar(true);
    };

    const handleAvatarDragLeave = () => {
        setIsDraggingAvatar(false);
    };

    const uploadSingleFile = async (file: File) => {
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
                toast.success("Photo loaded! Save changes to apply.");
            } else {
                const url = data.url || data.data?.url;
                if (url) {
                    setForm(prev => ({ ...prev, userAvatar: url }));
                    toast.success("Photo loaded! Save changes to apply.");
                } else {
                    toast.error("Upload failed");
                }
            }
        } catch (err) {
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingAvatar(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            await uploadSingleFile(file);
        }
    };

    const handleCameraCapture = async (file: File) => {
        await uploadSingleFile(file);
    };

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
        await uploadSingleFile(file);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetcher('/api/users/profile', {
                method: 'PATCH',
                body: JSON.stringify(form)
            });

            if (res.success) {
                const updatedUser: User = {
                    ...user,
                    ...form,
                };

                updateUser(updatedUser);
                toast.success("Profile updated successfully");
                router.push('/account');
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
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
                        IDENTITY PARAMETER DEFINITION
                    </span>
                    <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-955 mt-1">Profile Configurations</h1>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <Card className="p-6 md:p-8 bg-white border border-zinc-200 rounded-none shadow-none flex flex-col items-center gap-4">
                    {/* Avatar drag & drop */}
                    <div 
                        onDragOver={handleAvatarDragOver}
                        onDragLeave={handleAvatarDragLeave}
                        onDrop={handleAvatarDrop}
                        className={`relative group border transition-all duration-150 p-1 rounded-none select-none ${
                            isDraggingAvatar ? "border-green-600 bg-green-50/20" : "border-transparent"
                        }`}
                    >
                        <div 
                            onClick={() => avatarInputRef.current?.click()}
                            className="w-28 h-28 bg-zinc-50 border border-zinc-250 hover:bg-zinc-100/50 flex items-center justify-center shrink-0 overflow-hidden relative rounded-none cursor-pointer transition-colors"
                            title="Click to select profile avatar image"
                        >
                            {form.userAvatar ? (
                                <Image fill src={form.userAvatar} alt="Avatar" className="object-cover" unoptimized />
                            ) : (
                                <UserIcon size={36} className="text-green-700" />
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-green-700" size={20} />
                                </div>
                            )}
                        </div>
                        <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }}
                            className="absolute -bottom-1 -right-1 p-2 bg-zinc-950 text-white border border-zinc-800 rounded-none shadow-md hover:bg-zinc-900 transition-colors cursor-pointer"
                            title="Snap avatar from webcam"
                        >
                            <Camera size={14} />
                        </button>
                        <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </div>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest font-mono select-none">Drag & Drop or Webcam snap</p>
                </Card>

                {/* Form Fields */}
                <Card className="p-6 md:p-8 bg-white border border-zinc-200 rounded-none shadow-none space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest ml-1">Full Name</label>
                        <Input
                            value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                            placeholder="Your display name"
                            icon={<Users size={16} className="text-zinc-400" />}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                        <Input
                            value={user?.email || ''}
                            readOnly
                            disabled
                            icon={<Mail size={16} className="text-zinc-300" />}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest ml-1">Phone Number</label>
                        <Input
                            value={form.phoneNumber}
                            onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                            placeholder="+234 ..."
                            icon={<Phone size={16} className="text-zinc-400" />}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest ml-1">Location / State</label>
                        <Input
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                            placeholder="e.g. Lagos, Nigeria"
                            icon={<MapPin size={16} className="text-zinc-400" />}
                            required
                        />
                    </div>

                    <div className="space-y-2 font-mono">
                        <label className="text-[9px] font-bold text-zinc-455 uppercase tracking-widest ml-1 block mb-1">Shipping Coordinates Address</label>
                        <textarea
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                            placeholder="ENTER FULL PHYSICAL SHIPPING ADDRESS..."
                            className="w-full p-3 border border-zinc-250 rounded-none bg-white font-mono text-xs uppercase tracking-wider text-zinc-900 focus:outline-none focus:border-green-700 min-h-[100px] leading-relaxed"
                            required
                        />
                    </div>
                </Card>

                {/* Trust Badge */}
                <div className="bg-green-50 p-5 border border-green-200 flex items-start gap-4 select-none">
                    <CheckCircle className="text-green-700 shrink-0 mt-0.5" size={16} />
                    <div className="space-y-1">
                        <h4 className="font-bold text-zinc-950 uppercase tracking-wider text-[10px]">Profile Integrity Verified</h4>
                        <p className="text-[9px] text-zinc-500 leading-relaxed font-bold uppercase tracking-wider">
                            Keeping your coordinates up to date ensures immediate logistics processing and optimal cargo dispatch.
                        </p>
                    </div>
                </div>

                {/* Commit Action */}
                <div className="flex justify-end pt-2 border-t border-zinc-200">
                    <button 
                        type="submit"
                        disabled={loading || uploading}
                        className="rounded-none h-10 px-6 bg-green-700 border border-green-800 hover:bg-green-800 text-white font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin text-white" size={14} /> : <Save size={13} />}
                        Commit Profile Settings
                    </button>
                </div>
            </form>

            <CameraCaptureModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCameraCapture}
            />
        </div>
    );
}

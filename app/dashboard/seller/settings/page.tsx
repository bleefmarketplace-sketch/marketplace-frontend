"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import {
  Camera,
  ImageIcon,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  ShieldAlert,
  ShieldCheck,
  Store,
  StoreIcon,
  User,
  X,
} from "lucide-react";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import { TwoFactorModal } from "@/components/AdminComponents/TwoFactorModal";
import { useSearchParams } from "next/navigation";
import { CameraCaptureModal } from "@/components/CameraCaptureModal";

interface SellerProfile {
  id: string;
  businessName: string;
  bio?: string;
  logo?: string;
  businessPhoneNumber?: string;
  businessEmail?: string;
  businessAddress?: string;
  businessCity?: string;
  businessState?: string;
  businessPostalCode?: string;
}

const Page = () => {
  const { user, logout, refreshUserData } = useAuth();
  const fetcher = useApi();

  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<SellerProfile | null>(null);
  const searchParams = useSearchParams();

  const TABS = ['profile', 'security', 'store'] as const;
  type Tab = (typeof TABS)[number];

  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<Tab>(
    TABS.includes(tabParam as Tab) ? (tabParam as Tab) : 'profile'
  );

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- Drag & Drop & Webcam States ---
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<"avatar" | "logo">("avatar");

  const handleAvatarDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingAvatar(true);
  };

  const handleAvatarDragLeave = () => {
      setIsDraggingAvatar(false);
  };

  const handleAvatarDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingAvatar(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
          setUploading(true);
          try {
              const url = await uploadImage(file);
              setProfile(p => ({ ...p, userAvatar: url }));
              toast.success("Profile avatar updated!");
          } catch (err: any) {
              toast.error(err.message || "Failed to upload avatar");
          } finally {
              setUploading(false);
          }
      }
  };

  const handleLogoDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = () => {
      setIsDraggingLogo(false);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingLogo(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
          toast.success("Store logo loaded successfully!");
      }
  };

  const handleCameraCapture = async (file: File) => {
      if (cameraTarget === "avatar") {
          setUploading(true);
          try {
              const url = await uploadImage(file);
              setProfile(p => ({ ...p, userAvatar: url }));
              toast.success("Avatar snapshot saved!");
          } catch (err: any) {
              toast.error(err.message || "Failed to upload avatar");
          } finally {
              setUploading(false);
          }
      } else {
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
          toast.success("Logo snapshot loaded!");
      }
  };

  // Inline Tag Input states
  const [newExpertise, setNewExpertise] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [showExpertiseInput, setShowExpertiseInput] = useState(false);
  const [showInterestInput, setShowInterestInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password State
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  const [form, setForm] = useState({
    logo: "",
    businessName: "",
    bio: "",
    businessPhoneNumber: "",
    businessEmail: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessPostalCode: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const hasFetchedStore = useRef(false);

  const fetchStore = useCallback(async () => {
    try {
      const res = await fetcher("/api/settings/store");
      const data: SellerProfile = res?.data;

      setStore(data);
      setForm({
        logo: data.logo || "",
        businessName: data.businessName || "",
        bio: data.bio || "",
        businessPhoneNumber: data.businessPhoneNumber || "",
        businessEmail: data.businessEmail || "",
        businessAddress: data.businessAddress || "",
        businessCity: data.businessCity || "",
        businessState: data.businessState || "",
        businessPostalCode: data.businessPostalCode || "",
      });

      setImagePreview(data.logo || null);
    } catch {
      toast.error("Failed to load store");
    }
  }, [fetcher]);

  useEffect(() => {
    if (user?.hasCreatedStore && !hasFetchedStore.current) {
      hasFetchedStore.current = true;
      fetchStore();
    }
  }, [user?.hasCreatedStore, fetchStore]);

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

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetcher("/api/upload/upload-single-image", {
      method: "POST",
      body: fd,
    });
    return res.url;
  };

  const handleSave = async () => {
    if (!form.businessName.trim()) {
      toast.error("Store name is required");
      return;
    }

    if (form.bio && form.bio.length < 10) {
      toast.error("Bio must be at least 10 characters");
      return;
    }

    if (form.businessEmail && !form.businessEmail.includes("@")) {
      toast.error("Enter a valid business email");
      return;
    }

    setLoading(true);
    try {
      let logoUrl = form.logo;
      if (imageFile) {
        logoUrl = await uploadImage(imageFile);
      }

      const payload = {
        ...form,
        logo: logoUrl,
      };

      const res = await fetcher("/api/settings/store", {
        method: store ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success(store ? "Store updated" : "Store created");
      setStore(res.data);
      refreshUserData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save store");
    } finally {
      setLoading(false);
    }
  };

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
    if (pwd.currentPassword === pwd.newPassword) return toast.error("New password cannot be the same as current password");

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
    <Suspense>
      <div className="w-full space-y-6 font-mono text-xs text-zinc-900 antialiased animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="border border-zinc-200 bg-white p-5">
            <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
              IDENTITY CONFIG
            </span>
            <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2">Operational Settings</h1>
            <p className="text-zinc-500 text-[10px] mt-0.5">Manage system identity, store storefronts, and secure credentials.</p>
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
            onClick={() => setActiveTab('store')}
            className={`px-5 py-2.5 rounded-none text-xs transition-colors flex items-center gap-2 border border-transparent cursor-pointer ${activeTab === 'store' ? 'bg-white border-zinc-250 text-green-800 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            <StoreIcon size={14} /> STOREFRONT
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2.5 rounded-none text-xs transition-colors flex items-center gap-2 border border-transparent cursor-pointer ${activeTab === 'security' ? 'bg-white border-zinc-250 text-green-800 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            <Lock size={14} /> SECURITY
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <Card className="p-6 md:p-8 bg-white border border-zinc-200 rounded-none shadow-none">
              {/* Avatar */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-8 border-b border-zinc-150">
                <div 
                  className={`relative group border transition-all duration-150 ${isDraggingAvatar ? "border-green-600 bg-green-50/20" : "border-transparent"}`}
                  onDragOver={handleAvatarDragOver}
                  onDragLeave={handleAvatarDragLeave}
                  onDrop={handleAvatarDrop}
                >
                  <div className="w-28 h-28 border border-zinc-250 bg-zinc-50 text-green-700 rounded-none overflow-hidden relative flex items-center justify-center shrink-0">
                    {profile.userAvatar ? <Image unoptimized fill src={profile.userAvatar} className="object-cover" alt="Avatar" /> : <User size={40} />}
                    {uploading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><Loader2 className="animate-spin text-green-700" size={16} /></div>}
                  </div>
                  <button type="button" onClick={() => { setCameraTarget('avatar'); setIsCameraOpen(true); }} className="absolute bottom-0 right-0 bg-zinc-950 text-white p-2 border border-zinc-800 rounded-none cursor-pointer"><Camera size={14} /></button>
                  <input type="file" ref={fileInputRef} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const url = await uploadImage(file);
                      setProfile(p => ({ ...p, userAvatar: url }));
                      toast.success("Profile avatar updated!");
                    } catch (err: any) {
                      toast.error(err.message || "Failed to upload avatar");
                    } finally {
                      setUploading(false);
                    }
                  }} className="hidden" accept="image/*" />
                </div>
                <div className="text-center md:text-left space-y-1">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-900">{profile.fullName || ''}</h3>
                  <div className="flex items-center gap-2 mt-1 justify-center md:justify-start select-none">
                    <span className="bg-green-50 border border-green-200 text-green-800 text-[8px] font-bold uppercase px-2 py-0.5 rounded-none tracking-widest">{user?.role}</span>
                    {user?.isVerified && <span className="bg-blue-50 text-blue-700 text-[8px] font-bold uppercase px-2 py-0.5 border border-blue-200 rounded-none flex items-center gap-1"><ShieldCheck size={11} /> Verified</span>}
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-1.5">Personal details</h4>
                  <Input label="Full Name" value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} />
                  <Input label="Phone Number" value={profile.phoneNumber} onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })} />
                  <Input label="Physical Address" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
                </div>

                {user?.role !== 'admin' && (
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-1.5">Business details</h4>
                    <Input label="Business Name" value={profile.farmName} onChange={e => setProfile({ ...profile, farmName: e.target.value })} />
                    <Input label="Business Size" value={profile.farmSize} onChange={e => setProfile({ ...profile, farmSize: e.target.value })} />
                    <Input label="Location" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
                  </div>
                )}
              </div>

              {/* Tags System */}
              <div className="mt-8 grid md:grid-cols-2 gap-8 border-t border-zinc-150 pt-8 font-mono">
                {/* Expertise */}
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between items-center px-1 leading-none mb-1">
                    <span>Area of Expertise</span>
                    <button type="button" onClick={() => setShowExpertiseInput(!showExpertiseInput)} className="text-green-700 hover:text-green-800 cursor-pointer"><Plus size={14} /></button>
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
                      <span key={i} className="bg-green-50 border border-green-200 text-green-855 px-2 py-1.5 rounded-none text-[9px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                        {tag} <X size={11} className="cursor-pointer text-zinc-400 hover:text-red-655" onClick={() => removeTag('expertise', i)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex justify-between items-center px-1 leading-none mb-1">
                    <span>Area of Interest</span>
                    <button type="button" onClick={() => setShowInterestInput(!showInterestInput)} className="text-green-700 hover:text-green-800 cursor-pointer"><Plus size={14} /></button>
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
                      <span key={i} className="bg-blue-50 border border-blue-200 text-blue-805 px-2 py-1.5 rounded-none text-[9px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
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
        ) : activeTab === 'store' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-4">
              {/* Store Info */}
              <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
                  <Store size={15} className="text-green-700" /> Storefront Profile Information
                </h3>

                <div className="flex flex-col sm:flex-row gap-4 items-start pt-1">
                  <div className="flex gap-2.5">
                    <label 
                      onDragOver={handleLogoDragOver}
                      onDragLeave={handleLogoDragLeave}
                      onDrop={handleLogoDrop}
                      className={`w-20 h-20 border border-dashed bg-zinc-50 hover:bg-zinc-100/60 cursor-pointer flex items-center justify-center relative overflow-hidden shrink-0 rounded-none transition-all duration-150 ${isDraggingLogo ? "border-green-600 bg-green-50/20" : "border-zinc-355"}`}
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Store Logo"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-zinc-450" size={18} />
                      )}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => { setCameraTarget('logo'); setIsCameraOpen(true); }}
                      className="w-20 h-20 border border-dashed border-green-200 bg-green-50/20 hover:bg-green-50 text-green-700 flex flex-col items-center justify-center rounded-none cursor-pointer"
                      title="Snap storefront logo from webcam"
                    >
                      <Camera size={18} />
                      <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Camera</span>
                    </button>
                  </div>

                  <div className="flex-1 w-full space-y-4 font-mono text-xs">
                    <Input
                      label="Storefront Business Name"
                      value={form.businessName}
                      onChange={(e) =>
                        setForm({ ...form, businessName: e.target.value })
                      }
                    />

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">
                        About Storefront
                      </label>
                      <textarea
                        rows={3}
                        value={form.bio}
                        onChange={(e) =>
                          setForm({ ...form, bio: e.target.value })
                        }
                        className="w-full border border-zinc-250 p-2 text-xs bg-white rounded-none font-mono focus:border-green-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact */}
              <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
                  <MapPin size={15} className="text-green-700" /> Merchant Location & Contacts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Address"
                    value={form.businessAddress}
                    onChange={(e) =>
                      setForm({ ...form, businessAddress: e.target.value })
                    }
                  />
                  <Input
                    label="City"
                    value={form.businessCity}
                    onChange={(e) =>
                      setForm({ ...form, businessCity: e.target.value })
                    }
                  />
                  <Input
                    label="State"
                    value={form.businessState}
                    onChange={(e) =>
                      setForm({ ...form, businessState: e.target.value })
                    }
                  />
                  <Input
                    label="Postal Code"
                    value={form.businessPostalCode}
                    onChange={(e) =>
                      setForm({ ...form, businessPostalCode: e.target.value })
                    }
                  />
                  <Input
                    label="Phone"
                    icon={<Phone size={14} />}
                    value={form.businessPhoneNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        businessPhoneNumber: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Email"
                    icon={<Mail size={14} />}
                    value={form.businessEmail}
                    onChange={(e) =>
                      setForm({ ...form, businessEmail: e.target.value })
                    }
                  />
                </div>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              <Card className="p-5 bg-white border border-zinc-200 rounded-none shadow-none font-mono text-xs">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-950 mb-4 pb-2 border-b border-zinc-100">Merchant Status</h3>

                <div className="flex justify-between items-center mb-5">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Storefront State</span>
                  <span
                    className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase border ${store
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                      }`}
                  >
                    {store ? "Active" : "Not Created"}
                  </span>
                </div>

                <Button 
                  fullWidth 
                  onClick={handleSave} 
                  disabled={loading}
                  className="rounded-none h-10 bg-green-700 hover:bg-green-800 border-green-700 text-white uppercase font-bold tracking-wider text-[10px] flex items-center justify-center cursor-pointer"
                >
                  <Save size={14} className="mr-1.5" />
                  {loading ? "Saving..." : "Commit Storefront Info"}
                </Button>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300 font-mono text-xs">
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
                <p className="text-zinc-500 text-[10px] leading-relaxed">Secure your terminal session. When enabled, verification prompts will trigger for all sensitive actions.</p>
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

        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
        />
      </div>
    </Suspense>
  );
};

export default Page;

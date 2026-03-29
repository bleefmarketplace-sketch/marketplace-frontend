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

/* ---------------- TYPES ---------------- */

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

/* ---------------- PAGE ---------------- */

const Page = () => {
  const { user, logout, refreshUserData } = useAuth();
  const fetcher = useApi()

  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<SellerProfile | null>(null);
  const searchParams = useSearchParams()

  const TABS = ['profile', 'security', 'store'] as const
  type Tab = (typeof TABS)[number]

  const tabParam = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState<Tab>(
    TABS.includes(tabParam as Tab) ? (tabParam as Tab) : 'profile'
  )

  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const [uploading, setUploading] = useState(false);

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

  /* ---------------- FETCH STORE ---------------- */


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
  }, []);



  useEffect(() => {
    if (user?.hasCreatedStore) {
      fetchStore();
    }
  }, [user, fetchStore]);

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

  /* ---------------- IMAGE UPLOAD ---------------- */

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetcher("/api/upload/upload-single-image", {
      method: "POST",
      body: fd,
    });

    return res.url;
  };

  /* ---------------- SAVE STORE ---------------- */

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

  /* ---------------- Toggle 2FA ---------------- */
  const handleToggle2FA = async () => {
    if (!is2FAEnabled) {
      // Turning it ON -> Open Setup Modal
      setIs2FAModalOpen(true);
    } else {
      // Turning it OFF -> Direct Confirmation
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



  /* ---------------- Tags ---------------- */
  const addTag = (type: 'expertise' | 'interest') => {
    const value = window.prompt(`Enter new ${type}:`);
    if (!value) return;
    const key = type === 'expertise' ? 'areaOfExpertise' : 'areaOfInterest';
    setProfile(prev => ({ ...prev, [key]: [...prev[key], value] }));
  };

  const removeTag = (type: 'expertise' | 'interest', index: number) => {
    const key = type === 'expertise' ? 'areaOfExpertise' : 'areaOfInterest';
    setProfile(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  /* ---------------- Profile Update ---------------- */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetcher('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(profile)
      });
      refreshUserData();



    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  /* ---------------- Password Change ---------------- */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirm) return toast.error("New passwords do not match");
    if(pwd.currentPassword === pwd.newPassword) return toast.error("New password cannot be the same as current password");

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
  /* ---------------- UI ---------------- */

  return (
    <>
      <Suspense>
        <div className="space-y-6 animate-in fade-in duration-300">

          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
            <p className="text-gray-500 text-sm">Manage your identity, security and preferences.</p>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-3xl w-fit">

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400'}`}
            >
              <User size={16} /> PROFILE
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'store' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400'}`}
            >
              <StoreIcon size={16} /> Store
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'security' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400'}`}
            >
              <Lock size={16} /> SECURITY
            </button>

          </div>

          {activeTab === 'profile' ? (
            <>
              <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="p-10 rounded-[3rem] border-none shadow-sm ring-1 ring-gray-100 bg-white">
                  {/* Avatar */}
                  <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                    <div className="relative group">
                      <div className="w-36 h-36 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border-4 border-white shadow-2xl overflow-hidden relative">
                        {profile.userAvatar ? <Image unoptimized fill src={profile.userAvatar} className="object-cover" alt="Avatar" /> : <User size={50} />}
                        {uploading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
                      </div>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-all border-2 border-white"><Camera size={18} /></button>
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
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-black text-gray-900">{profile.fullName || ''}</h3>
                      <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                        <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">{user?.role}</span>
                        {user?.isVerified && <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>}
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personal Details</h4>
                      <Input label="Full Name" value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} />
                      <Input label="Phone Number" value={profile.phoneNumber} onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })} />
                      <Input label="Physical Address" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
                    </div>

                    {user?.role !== 'admin' && (
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Data</h4>
                        <Input label="Business Name" value={profile.farmName} onChange={e => setProfile({ ...profile, farmName: e.target.value })} />
                        <Input label="Business Size" value={profile.farmSize} onChange={e => setProfile({ ...profile, farmSize: e.target.value })} />
                        <Input label="Location" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
                      </div>
                    )}
                  </div>

                  {/* Tags System */}
                  <div className="mt-12 grid md:grid-cols-2 gap-8 border-t border-gray-50 pt-12">
                    {/* Expertise */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between items-center px-1">
                        Area of Expertise
                        <button type="button" onClick={() => addTag('expertise')} className="text-emerald-600 hover:scale-110 transition-transform"><Plus size={16} /></button>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.areaOfExpertise.map((tag, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-2">
                            {tag} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeTag('expertise', i)} />
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between items-center px-1">
                        Area of Interest
                        <button type="button" onClick={() => addTag('interest')} className="text-emerald-600 hover:scale-110 transition-transform">
                          <Plus size={16} /></button>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profile.areaOfInterest.map((tag, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-2">
                            {tag} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeTag('interest', i)} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-end">
                    <Button type="submit" disabled={loading} className="bg-emerald-600 h-14 px-12 rounded-2xl font-black uppercase text-xs shadow-xl shadow-emerald-100">
                      {loading ? <Loader2 className="animate-spin" /> : "Commit All Updates"}
                    </Button>
                  </div>
                </Card>
              </form>




            </>
          ) : activeTab === 'store' ? (
            <>
              <div className="flex items-center gap-5">
                <h1 className="text-2xl font-bold">Shop Settings </h1>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${store
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {store ? "Active" : "Not Created"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <div className="md:col-span-2 space-y-6">
                  {/* Store Info */}
                  <Card className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Store size={18} /> Storefront Information
                    </h3>

                    <div className="flex gap-4 items-start">
                      <label className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed cursor-pointer relative overflow-hidden">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Store Logo"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="text-gray-400" />
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

                      <div className="flex-1 space-y-4">
                        <Input
                          label="Store Name"
                          value={form.businessName}
                          onChange={(e) =>
                            setForm({ ...form, businessName: e.target.value })
                          }
                        />

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            About Your Store
                          </label>
                          <textarea
                            rows={3}
                            value={form.bio}
                            onChange={(e) =>
                              setForm({ ...form, bio: e.target.value })
                            }
                            className="w-full border rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Contact */}
                  <Card className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin size={18} /> Location & Contact
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
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
                        icon={<Phone size={16} />}
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
                        icon={<Mail size={16} />}
                        value={form.businessEmail}
                        onChange={(e) =>
                          setForm({ ...form, businessEmail: e.target.value })
                        }
                      />
                    </div>
                  </Card>
                </div>

                <div className="flex justify-end md:col-span-2">
                  <Button onClick={handleSave} disabled={loading}>
                    <Save size={16} className="mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>



              </div>
            </>
          ) : (
            <>

              <Card className="space-y-6rounded-[2.5rem] border-none shadow-sm ring-1 ring-gray-100 animate-in fade-in duration-500">
                <form onSubmit={handleChangePassword} className="space-y-6 animate-in fade-in duration-500">
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-500" /> Password Management
                  </h3>

                  <div className="space-y-4">
                    <Input placeholder='**************' label="Current Password" type="password" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} />
                    <div className="h-px bg-gray-50 my-2" />
                    <Input placeholder='**************' label="New Password" type="password" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} />
                    <Input placeholder='**************' label="Confirm New Password" type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} />
                  </div>

                  <div className="mt-8">
                    <Button type="submit" disabled={loading} className="bg-gray-900 h-12 w-full rounded-xl font-bold">
                      {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
                    </Button>
                  </div>
                </form>
              </Card>

              <Card className="p-10 rounded-[3.5rem] border-none bg-emerald-950 text-white relative overflow-hidden">
                <ShieldAlert className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                  <div className="max-w-md">
                    <h3 className="text-2xl font-black text-black mb-3">Two-Factor Authentication</h3>
                    <p className="text-black/60 text-sm leading-relaxed">Secure your account. When enabled, Verification would be made for all sensitive actions.</p>
                  </div>
                  <button onClick={handleToggle2FA} className={`w-20 h-7 rounded-full relative transition-all duration-500 ${is2FAEnabled ? 'bg-emerald-500' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <div className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white transition-all duration-500 ${is2FAEnabled ? 'right-2 shadow-lg' : 'left-2'}`} />
                  </button>
                </div>
              </Card>

            </>
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
      </Suspense>

    </>
  );
};

export default Page;

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
    Users, Plus, Search, 
    MoreHorizontal, Globe, Lock, 
    DollarSign, Loader2, MessageSquare,
    Trash2, Edit3, Settings, Info
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';

export default function CreatorCirclesPage() {
    const fetcher = useApi();
    const [circles, setCircles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const hasFetched = useRef(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [circleForm, setCircleForm] = useState({
        name: '',
        slug: '',
        description: '',
        type: 'free'
    });

    const load = useCallback(async () => {
        try {
            const res = await fetcher('/api/community/circles');
            setCircles(res || []);
        } catch {
            toast.error('Failed to load your circles');
        } finally {
            setLoading(false);
        }
    }, [fetcher]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        load();
    }, [load]);

    const handleCreateCircle = async () => {
        if (!circleForm.name || !circleForm.slug) return toast.warn("Name and slug are required");
        setSubmitting(true);
        try {
            // This would ideally call a new endpoint: POST /community/circles
            // For now, I'll assume the backend handles circle creation in CommunityService
            const res = await fetcher('/api/community/circles/create', {
                method: 'POST',
                body: JSON.stringify(circleForm)
            });
            if (res) {
                toast.success("Circle created successfully!");
                setIsCreateModalOpen(false);
                load();
            }
        } catch (err) {
            toast.error("Failed to create circle");
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = circles.filter(c => 
        !search || c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Community Circles</h1>
                    <p className="text-gray-500 text-sm">Manage your groups and moderate conversations</p>
                </div>
                <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 gap-2 rounded-2xl shrink-0"
                >
                    <Plus size={18} /> Create Circle
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search your circles..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <Card className="p-20 text-center border-dashed border-2">
                    <Users className="mx-auto text-gray-200 mb-4" size={56} />
                    <h3 className="text-xl font-bold text-gray-400">No circles found</h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                        Create your first community circle to bring farmers together around your expertise.
                    </p>
                    <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 gap-2"
                    >
                        <Plus size={18} /> Start a Circle
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((circle) => (
                        <Card key={circle.id} className="overflow-hidden hover:shadow-md transition-all group border-gray-100">
                            <div className="h-32 relative bg-gray-900">
                                {circle.image ? (
                                    <Image fill src={circle.image} className="object-cover opacity-60" alt="" unoptimized />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Globe className="text-white/20" size={40} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                        circle.type === 'paid' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                                    }`}>
                                        {circle.type}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 relative">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-gray-900 text-lg leading-tight">#{circle.slug}</h3>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 text-gray-300 hover:text-gray-600 rounded-lg"><Edit3 size={16}/></button>
                                        <button className="p-1.5 text-gray-300 hover:text-gray-600 rounded-lg"><Settings size={16}/></button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-bold mb-4">{circle.name}</p>
                                
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Members</p>
                                        <p className="text-sm font-black text-gray-900">{circle.members?.length || 0}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
                                        <p className="text-sm font-black text-emerald-600">₦0.00</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-[10px] font-black text-blue-500 uppercase">Active</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button fullWidth variant="outline" className="rounded-xl border-gray-100 hover:bg-gray-50 text-gray-600 font-bold h-10 text-xs">
                                        Moderate Discussions
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Circle Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Start a Community Circle">
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                        <Info size={20} className="text-blue-600 shrink-0" />
                        <p className="text-xs text-blue-800 leading-relaxed font-medium">
                            Circles are interest-based groups. Use a catchy slug (e.g. #OrganicPoultry) to make it easy for farmers to find and join.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Input 
                            label="Circle Name" 
                            placeholder="e.g. Sustainable Poultry Farming"
                            value={circleForm.name}
                            onChange={e => setCircleForm({...circleForm, name: e.target.value})}
                        />
                        <Input 
                            label="Circle Slug (Unique)" 
                            placeholder="e.g. PoultryPros"
                            value={circleForm.slug}
                            onChange={e => setCircleForm({...circleForm, slug: e.target.value.replace(/[^a-zA-Z0-9]/g, '')})}
                        />
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Access Type</label>
                            <select 
                                className="w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={circleForm.type}
                                onChange={e => setCircleForm({...circleForm, type: e.target.value})}
                            >
                                <option value="free">FREE (Open to all)</option>
                                <option value="private">PRIVATE (Join by request)</option>
                                <option value="paid">PAID (Premium membership)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description</label>
                            <textarea 
                                className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="What is this circle about?"
                                rows={3}
                                value={circleForm.description}
                                onChange={e => setCircleForm({...circleForm, description: e.target.value})}
                            />
                        </div>
                    </div>

                    <Button 
                        fullWidth 
                        size="lg" 
                        disabled={submitting}
                        onClick={handleCreateCircle}
                        className="rounded-2xl h-14 bg-blue-600 font-bold shadow-xl shadow-blue-100"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : "Launch My Circle"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

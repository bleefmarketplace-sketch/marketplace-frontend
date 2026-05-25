'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Users, MessageCircle, Heart, 
    Plus, Image as ImageIcon, Send, 
    Hash, Info, ShieldCheck, Search,
    MoreHorizontal, Share2, Loader2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import Image from 'next/image';

export const CommunityHub = () => {
    const fetcher = useApi();
    const [posts, setPosts] = useState<any[]>([]);
    const [circles, setCircles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [postsRes, circlesRes] = await Promise.all([
                fetcher('/api/community/feed'),
                fetcher('/api/community/circles')
            ]);
            if (postsRes) setPosts(postsRes.data);
            if (circlesRes) setCircles(circlesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [fetcher]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleCreatePost = async () => {
        if (!newPost.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetcher('/api/community/posts', {
                method: 'POST',
                body: JSON.stringify({ content: newPost })
            });
            if (res) {
                toast.success("Post shared with the community!");
                setNewPost('');
                loadData();
            }
        } catch (err) {
            toast.error("Failed to share post");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex-1 flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-green-700" size={32} /></div>;

    return (
        <div className="flex-1 bg-zinc-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar: Circles */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6">
                        <div className="sticky top-24 font-mono text-xs">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Your Circles</h3>
                            <div className="space-y-2">
                                {circles.map((circle) => (
                                    <button 
                                        key={circle.id} 
                                        className="w-full flex items-center gap-3 p-3 border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors text-left group rounded-none"
                                    >
                                        <div className="w-9 h-9 border border-zinc-200 bg-zinc-50 text-zinc-700 flex items-center justify-center font-bold font-mono group-hover:border-green-700 group-hover:bg-green-50 group-hover:text-green-700 transition-colors rounded-none">
                                            {circle.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-950 uppercase tracking-wide">#{circle.slug}</p>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{circle.members?.length || 0} members</p>
                                        </div>
                                    </button>
                                ))}
                                <Button variant="ghost" fullWidth className="mt-4 text-green-700 font-mono text-xs uppercase font-bold tracking-wider hover:bg-green-50 justify-start px-4 w-full rounded-none">
                                    <Plus size={14} className="mr-2 text-green-700" /> Explore more circles
                                </Button>
                            </div>

                            <Card className="mt-8 p-6 bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-none shadow-none">
                                <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Be an Expert</h4>
                                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mb-4">Share your knowledge and build your own agricultural circle.</p>
                                <Button className="bg-green-700 text-white hover:bg-green-800 border-none rounded-none text-xs font-bold tracking-wider uppercase w-full">Get Started</Button>
                            </Card>
                        </div>
                    </aside>

                    {/* Middle: Feed */}
                    <main className="lg:col-span-6 space-y-6">
                        {/* Create Post */}
                        <Card className="p-6 border border-zinc-200 rounded-none shadow-none bg-white">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 border border-zinc-200 bg-zinc-50 shrink-0 rounded-none" />
                                <div className="flex-1 space-y-4">
                                    <textarea 
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-none p-4 text-xs font-mono focus:border-green-700 focus:ring-0 transition-colors outline-none resize-none text-zinc-900"
                                        placeholder="What's happening on the farm today?"
                                        rows={3}
                                        value={newPost}
                                        onChange={(e) => setNewPost(e.target.value)}
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <button className="p-2 hover:bg-green-50 text-green-700 border border-transparent hover:border-green-700/20 rounded-none transition-colors"><ImageIcon size={18} /></button>
                                            <button className="p-2 hover:bg-green-50 text-green-700 border border-transparent hover:border-green-700/20 rounded-none transition-colors"><Hash size={18} /></button>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            className="rounded-none px-6 bg-green-700 hover:bg-green-800 font-mono text-xs uppercase font-bold tracking-wider text-white"
                                            disabled={submitting || !newPost.trim()}
                                            onClick={handleCreatePost}
                                        >
                                            {submitting ? <Loader2 className="animate-spin" size={14} /> : <><Send size={14} className="mr-2" /> Post</>}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Feed Filter */}
                        <div className="flex gap-2 px-2 overflow-x-auto pb-2 no-scrollbar">
                            {['For You', 'Trending', 'Experts', 'My Circles'].map((tab, i) => (
                                <button 
                                    key={i} 
                                    className={`px-4 py-2 rounded-none text-xs font-mono font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
                                        i === 0 
                                            ? 'bg-green-700 text-white border-green-700' 
                                            : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Posts List */}
                        <div className="space-y-6">
                            {posts.length > 0 ? posts.map((post) => (
                                <Card key={post.id} className="p-6 border border-zinc-200 rounded-none shadow-none bg-white group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-3">
                                            <div className="relative w-12 h-12 shrink-0 border border-zinc-200 rounded-none overflow-hidden bg-zinc-50">
                                                <Image unoptimized fill src={post.author.userAvatar || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1'} className="object-cover" alt="" />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-700 border border-white rounded-none flex items-center justify-center text-[8px] text-white">
                                                    <ShieldCheck size={10} />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-zinc-950 font-mono text-xs uppercase tracking-wider leading-tight">{post.author.fullName}</h4>
                                                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                                    <span>{post.author.role}</span>
                                                    <span className="text-zinc-300 font-normal">|</span>
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 text-zinc-400 hover:text-zinc-950 rounded-none transition-colors"><MoreHorizontal size={18} /></button>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-zinc-650 font-sans text-xs leading-relaxed">{post.content}</p>
                                        {post.mediaUrl && (
                                            <div className="aspect-video relative rounded-none border border-zinc-200 overflow-hidden bg-zinc-100">
                                                <Image unoptimized fill src={post.mediaUrl} className="object-cover" alt="" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-zinc-150 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider">
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-1.5 text-zinc-400 hover:text-red-650 transition-colors">
                                                <Heart size={16} /> {post.likesCount}
                                            </button>
                                            <button className="flex items-center gap-1.5 text-zinc-400 hover:text-green-700 transition-colors">
                                                <MessageCircle size={16} /> {post.comments?.length || 0}
                                            </button>
                                        </div>
                                        <button className="text-zinc-400 hover:text-zinc-950 transition-colors"><Share2 size={16} /></button>
                                    </div>
                                </Card>
                            )) : (
                                <div className="py-20 text-center space-y-4 border border-zinc-200 border-dashed bg-white">
                                    <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-none flex items-center justify-center mx-auto text-zinc-400">
                                        <MessageCircle size={20} />
                                    </div>
                                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-950">No conversations yet</h3>
                                    <p className="text-xs text-zinc-500 max-w-xs mx-auto italic font-sans">Be the first to share an update with the Bleefy community!</p>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right Sidebar: Trends & Experts */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8">
                        <Card className="p-6 border border-zinc-200 rounded-none shadow-none bg-white font-mono text-xs">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-200 pb-2">Trending Topics</h3>
                            <div className="space-y-6">
                                {[
                                    { tag: 'CassavaPricing', count: '1.2k' },
                                    { tag: 'PrecisionAg', count: '850' },
                                    { tag: 'DrySeasonTips', count: '640' }
                                ].map((trend, i) => (
                                    <div key={i} className="flex justify-between items-center group cursor-pointer">
                                        <div>
                                            <p className="text-xs font-bold text-zinc-950 group-hover:text-green-700 transition-colors">#{trend.tag}</p>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{trend.count} discussions</p>
                                        </div>
                                        <ArrowRight size={12} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="px-2 font-mono text-xs">
                            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Top Experts</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-none border border-zinc-200 bg-zinc-50 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-mono font-bold text-zinc-950 uppercase truncate leading-none">Dr. Sarah Johnson</p>
                                            <p className="text-[9px] text-green-700 font-mono uppercase font-bold mt-1 tracking-wider leading-none">Soil Specialist</p>
                                        </div>
                                        <Button variant="outline" className="h-8 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider px-3 border border-green-750 text-green-750 hover:bg-green-50 shrink-0">Follow</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

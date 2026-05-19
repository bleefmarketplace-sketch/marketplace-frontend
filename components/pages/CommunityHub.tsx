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

    if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="flex-1 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar: Circles */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6">
                        <div className="sticky top-24">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Your Circles</h3>
                            <div className="space-y-1">
                                {circles.map((circle) => (
                                    <button key={circle.id} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all text-left group">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            {circle.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">#{circle.slug}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{circle.members?.length || 0} members</p>
                                        </div>
                                    </button>
                                ))}
                                <Button variant="ghost" fullWidth className="mt-4 text-blue-600 text-xs font-bold rounded-xl justify-start px-4">
                                    <Plus size={16} className="mr-2" /> Explore more circles
                                </Button>
                            </div>

                            <Card className="mt-8 p-6 bg-blue-600 text-white border-none rounded-[2rem] shadow-xl shadow-blue-200">
                                <h4 className="font-black text-lg leading-tight mb-2">Be an Expert</h4>
                                <p className="text-xs text-blue-100 mb-4 opacity-80">Share your knowledge and build your own agricultural circle.</p>
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none rounded-xl text-xs h-10 px-4">Get Started</Button>
                            </Card>
                        </div>
                    </aside>

                    {/* Middle: Feed */}
                    <main className="lg:col-span-6 space-y-6">
                        {/* Create Post */}
                        <Card className="p-6 border-none shadow-sm rounded-[2.5rem] bg-white">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0" />
                                <div className="flex-1 space-y-4">
                                    <textarea 
                                        className="w-full bg-gray-50 border-none rounded-3xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                                        placeholder="What's happening on the farm today?"
                                        rows={3}
                                        value={newPost}
                                        onChange={(e) => setNewPost(e.target.value)}
                                    />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><ImageIcon size={20} /></button>
                                            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Hash size={20} /></button>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700 font-bold"
                                            disabled={submitting || !newPost.trim()}
                                            onClick={handleCreatePost}
                                        >
                                            {submitting ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} className="mr-2" /> Post</>}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Feed Filter */}
                        <div className="flex gap-2 px-2 overflow-x-auto pb-2 no-scrollbar">
                            {['For You', 'Trending', 'Experts', 'My Circles'].map((tab, i) => (
                                <button key={i} className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-400 hover:text-gray-600 shadow-sm'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Posts List */}
                        <div className="space-y-6">
                            {posts.length > 0 ? posts.map((post) => (
                                <Card key={post.id} className="p-6 border-none shadow-sm rounded-[2.5rem] bg-white group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-3">
                                            <div className="relative w-12 h-12">
                                                <Image unoptimized fill src={post.author.userAvatar || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1'} className="rounded-2xl object-cover" alt="" />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white">
                                                    <ShieldCheck size={10} />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-sm">{post.author.fullName}</h4>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                                    <span className="uppercase">{post.author.role}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-gray-900 rounded-lg transition-colors"><MoreHorizontal size={20} /></button>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-gray-700 leading-relaxed text-sm">{post.content}</p>
                                        {post.mediaUrl && (
                                            <div className="aspect-video relative rounded-3xl overflow-hidden bg-gray-100">
                                                <Image unoptimized fill src={post.mediaUrl} className="object-cover" alt="" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors text-xs font-bold">
                                                <Heart size={18} /> {post.likesCount}
                                            </button>
                                            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors text-xs font-bold">
                                                <MessageCircle size={18} /> {post.comments?.length || 0}
                                            </button>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-900 transition-colors"><Share2 size={18} /></button>
                                    </div>
                                </Card>
                            )) : (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                        <MessageCircle size={40} />
                                    </div>
                                    <h3 className="font-black text-gray-900">No conversations yet</h3>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto italic">Be the first to share an update with the Bleefy community!</p>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right Sidebar: Trends & Experts */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8">
                        <Card className="p-6 border-none shadow-sm rounded-[2rem] bg-white">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Trending Topics</h3>
                            <div className="space-y-6">
                                {[
                                    { tag: 'CassavaPricing', count: '1.2k' },
                                    { tag: 'PrecisionAg', count: '850' },
                                    { tag: 'DrySeasonTips', count: '640' }
                                ].map((trend, i) => (
                                    <div key={i} className="flex justify-between items-center group cursor-pointer">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">#{trend.tag}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{trend.count} discussions</p>
                                        </div>
                                        <ArrowRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="px-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Top Experts</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-200" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-900">Dr. Sarah Johnson</p>
                                            <p className="text-[10px] text-emerald-600 font-black">Soil Specialist</p>
                                        </div>
                                        <Button variant="outline" className="h-8 rounded-lg text-[10px] px-3 border-gray-100 hover:bg-blue-600 hover:text-white hover:border-blue-600">Follow</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

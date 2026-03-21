'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { 
    Plus, Video, FileText, Globe, Zap, 
    ShieldCheck, BarChart, MoreVertical, 
    Clock, CheckCircle, AlertTriangle, Search,
    Sparkles, Layout,
    Loader2
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import Image from 'next/image';

export default function CreatorInventoryPage() {
    const fetcher = useApi();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await fetcher<any[]>('/api/creator/products');
            setProducts(data);
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <div className="max-w-7xl mx-auto py-5 px-4 space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Layout className="text-emerald-600" /> Creator Studio
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Publish agricultural guides, videos, and technical blueprints.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700  px-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-100 gap-2">
                    <Plus size={20} /> Create New 
                </Button>
            </div>

            {/* --- CREATOR STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-emerald-900 text-white border-none p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Content Revenue</p>
                        <h2 className="text-4xl font-black">₦1,250,000</h2>
                        <div className="mt-4 flex items-center gap-2 text-emerald-200 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                            <Zap size={14} className="fill-emerald-400 text-emerald-400" /> Instant Payouts Active
                        </div>
                    </div>
                    <Globe className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
                </Card>

                <Card className="p-8 rounded-[2.5rem] border-none ring-1 ring-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Students</p>
                        <h3 className="text-3xl font-black text-gray-900">482</h3>
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-emerald-600 text-xs font-bold">
                        <BarChart size={14} /> Top 5% of Creators
                    </div>
                </Card>

                <Card className="p-8 rounded-[2.5rem] border-none ring-1 ring-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Avg. Trust Score</p>
                        <h3 className="text-3xl font-black text-gray-900">94/100</h3>
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} /> AI Verified Content
                    </div>
                </Card>
            </div>

            {/* --- DIGITAL LISTINGS --- */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Published Content</h3>
                
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" /></div>
                ) : (
                    <div className="grid gap-4">
                        {products.map((item) => (
                            <Card key={item.id} className="p-0 overflow-hidden border-none ring-1 ring-gray-100 shadow-sm hover:shadow-md transition-all rounded-[2rem]">
                                <div className="flex flex-col md:flex-row items-center">
                                    {/* Thumbnail */}
                                    <div className="w-full md:w-48 h-48 md:h-auto aspect-square relative bg-gray-50 shrink-0">
                                        <Image unoptimized fill src={item.primaryImage} alt="" className="object-cover" />
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white p-1.5 rounded-lg">
                                            {item.digitalAssets?.[0]?.fileType === 'video' ? <Video size={14}/> : <FileText size={14}/>}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 p-6 md:p-8 grid md:grid-cols-2 gap-6 w-full">
                                        <div>
                                            <h4 className="text-xl font-black text-gray-900 mb-1 leading-tight">{item.title}</h4>
                                            <p className="text-xs text-gray-400 font-medium mb-4">{item.category?.name}</p>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">Price</p>
                                                    <p className="text-sm font-black text-emerald-600">₦{item.price}</p>
                                                </div>
                                                <div className="h-8 w-px bg-gray-100" />
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">Sales</p>
                                                    <p className="text-sm font-black text-gray-900">{item.totalSales || 0}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Audit Status Area */}
                                        <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 flex flex-col justify-center">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Sparkles size={10} className="text-emerald-500" /> AI Trust Audit
                                                </span>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                                                    item.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                                                    item.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            
                                            {item.status === 'processing' ? (
                                                <div className="flex items-center gap-2 text-xs text-blue-600 font-bold animate-pulse">
                                                    <Clock size={14} /> Currently analyzing technical accuracy...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                                                            style={{ width: `${item.digitalMetadata?.trustScore || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900">{item.digitalMetadata?.trustScore || 0}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Final Action */}
                                    <div className="p-6 border-t md:border-t-0 md:border-l border-gray-50 flex items-center justify-center">
                                        <button className="p-4 hover:bg-gray-50 rounded-2xl text-gray-400 transition-colors">
                                            <MoreVertical size={24} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
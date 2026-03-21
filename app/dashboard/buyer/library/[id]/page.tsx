'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ChevronLeft, Play, FileText, Download, 
    Lock, CheckCircle, ShieldCheck, Loader2, MessageSquare
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useApi } from '@/hooks/useApi';

export default function VaultViewerPage() {
    const { id } = useParams();
    const fetcher = useApi();
    const [assets, setAssets] = useState<any[]>([]);
    const [activeAsset, setActiveAsset] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                // Returns array of assets with secureUrl
                const data = await fetcher<any[]>(`/api/creator/vault/${id}`);
                setAssets(data);
                if (data.length > 0) setActiveAsset(data[0]);
            } finally { setLoading(false); }
        };
        fetchVault();
    }, [id, fetcher]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-black text-gray-900 tracking-tight">Content Vault</h1>
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1">
                            <ShieldCheck size={10} /> Secure Learning Environment
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold text-xs border-gray-200">
                    <MessageSquare size={16} /> Contact Creator
                </Button>
            </div>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* LEFT: CONTENT PLAYER (Col 8) */}
                <div className="lg:col-span-8 p-6 md:p-10 overflow-y-auto">
                    {activeAsset ? (
                        <div className="space-y-6">
                            <div className="bg-black aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                {activeAsset.fileType === 'video' ? (
                                    <video 
                                        src={activeAsset.downloadUrl} 
                                        controls 
                                        className="w-full h-full"
                                        controlsList="nodownload" // Basic anti-piracy
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-12 text-center">
                                        <FileText size={64} className="text-emerald-500 mb-6" />
                                        <h3 className="text-2xl font-bold mb-2">{activeAsset.title}</h3>
                                        <p className="text-gray-400 mb-8 max-w-sm">This is a PDF document. Please use the button below to open it securely.</p>
                                        <Button className="bg-emerald-600 px-10 h-14 rounded-2xl font-bold" onClick={() => window.open(activeAsset.downloadUrl, '_blank')}>
                                            View Document <Download className="ml-2" size={18} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-black text-gray-900 mb-2">{activeAsset.title}</h2>
                                <p className="text-gray-500 leading-relaxed">
                                    You are viewing secured content from the Bleefy Creator Marketplace. 
                                    This link is temporary and will expire soon for your protection.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 font-medium">Select a lesson to begin.</div>
                    )}
                </div>

                {/* RIGHT: PLAYLIST (Col 4) */}
                <aside className="lg:col-span-4 bg-white border-l border-gray-100 overflow-y-auto h-full">
                    <div className="p-6 border-b bg-gray-50/50">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Course Curriculum</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {assets.map((asset, idx) => (
                            <button
                                key={asset.id}
                                onClick={() => setActiveAsset(asset)}
                                className={`w-full p-6 text-left transition-all flex items-start gap-4 ${
                                    activeAsset?.id === asset.id ? 'bg-emerald-50/50 border-r-4 border-emerald-500' : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className={`p-2 rounded-lg shrink-0 ${activeAsset?.id === asset.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {asset.fileType === 'video' ? <Play size={16} fill="currentColor" /> : <FileText size={16} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Module {idx + 1}</p>
                                    <p className={`text-sm font-bold truncate ${activeAsset?.id === asset.id ? 'text-emerald-900' : 'text-gray-700'}`}>
                                        {asset.title}
                                    </p>
                                </div>
                                {activeAsset?.id === asset.id && <div className="ml-auto"><CheckCircle size={16} className="text-emerald-500" /></div>}
                            </button>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
}
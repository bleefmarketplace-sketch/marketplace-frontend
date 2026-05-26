'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ChevronLeft, Play, FileText, Download, 
    Lock, CheckCircle, ShieldCheck, Loader2, MessageSquare
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';

export default function VaultViewerPage() {
    const { id } = useParams();
    const router = useRouter();
    const fetcher = useApi();
    const [assets, setAssets] = useState<any[]>([]);
    const [activeAsset, setActiveAsset] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!id || hasFetched.current) return;
        hasFetched.current = true;

        const fetchVault = async () => {
            try {
                // Returns array of assets with secureUrl
                const data = await fetcher(`/api/creator/vault/${id}`);
                setAssets(data);
                if (data.length > 0) setActiveAsset(data[0]);
            } finally { setLoading(false); }
        };
        fetchVault();
    }, [id, fetcher]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center font-mono text-xs text-zinc-900 bg-zinc-50">
                <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
                <span>DECRYPTING SECURE TELEMETRY CHANNELS...</span>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center font-mono text-xs text-zinc-900 bg-zinc-50">
                <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
                <span>HYDRATING VAULT VIEWER...</span>
            </div>
        }>
            <div className="min-h-screen bg-zinc-50/50 flex flex-col font-mono text-zinc-900 text-xs antialiased">
                
                {/* Top Telemetry Bar */}
                <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 select-none">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push('/account/library')} 
                            className="p-2 border border-zinc-200 hover:bg-zinc-50 rounded-none cursor-pointer flex items-center justify-center"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div>
                            <span className="px-1.5 py-0.5 text-[8px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
                                CONTENT VAULT
                            </span>
                            <h1 className="font-bold text-sm uppercase tracking-wider text-zinc-950 mt-1">SECURE LEARNING CONTAINER</h1>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => router.push('/support')}
                        className="h-8 px-4 border border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-700 font-bold uppercase tracking-wider text-[9px] cursor-pointer flex items-center gap-1.5 transition-colors rounded-none"
                    >
                        <MessageSquare size={12} /> Contact Creator
                    </button>
                </div>

                <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden max-w-7xl mx-auto w-full p-4 gap-6">
                    {/* LEFT: CONTENT PLAYER (Col 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        {activeAsset ? (
                            <div className="space-y-6">
                                <div className="bg-zinc-950 aspect-video rounded-none border border-zinc-900 overflow-hidden relative shadow-md">
                                    {activeAsset.fileType === 'video' ? (
                                        <video 
                                            src={activeAsset.downloadUrl} 
                                            controls 
                                            className="w-full h-full object-contain"
                                            controlsList="nodownload" // Basic anti-piracy
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 p-8 text-center">
                                            <FileText size={48} className="text-green-700 mb-4" />
                                            <h3 className="text-base font-bold uppercase tracking-wider text-white mb-2">{activeAsset.title}</h3>
                                            <p className="text-zinc-500 max-w-md text-[10px] leading-relaxed mb-6 font-sans">
                                                This agronomic catalog document is secure and locked. Please click below to securely view it in your browser.
                                            </p>
                                            <button 
                                                className="h-10 px-6 bg-green-700 border border-green-800 hover:bg-green-800 text-white font-bold uppercase tracking-wider text-[10px] cursor-pointer flex items-center gap-2 rounded-none transition-colors"
                                                onClick={() => window.open(activeAsset.downloadUrl, '_blank')}
                                            >
                                                Open Secured Document <Download size={13} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bg-white p-6 border border-zinc-200 rounded-none shadow-none space-y-2">
                                    <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-green-50 text-green-800 border border-green-200">
                                        VERIFIED SECURED NODE
                                    </span>
                                    <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider mt-1">{activeAsset.title}</h2>
                                    <p className="text-zinc-500 leading-relaxed font-sans font-medium text-[11px] pt-1">
                                        You are currently viewing securing content telemetry from the Bleefy Creator Marketplace. 
                                        This active buffer link is temporary and will expire automatically for security and intellectual property protection.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border border-dashed border-zinc-200 bg-white flex items-center justify-center text-zinc-400 font-bold uppercase tracking-wider py-20 select-none">
                                Select a learning module to initiate stream.
                            </div>
                        )}
                    </div>

                    {/* RIGHT: PLAYLIST (Col 4) */}
                    <aside className="lg:col-span-4 bg-white border border-zinc-200 h-fit flex flex-col">
                        <div className="p-4 border-b border-zinc-200 bg-zinc-50 select-none">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                Telemetry Curriculum Modules
                            </span>
                        </div>
                        <div className="divide-y divide-zinc-150 overflow-y-auto max-h-[600px]">
                            {assets.map((asset, idx) => (
                                <button
                                    key={asset.id}
                                    onClick={() => setActiveAsset(asset)}
                                    className={`w-full p-4 text-left transition-colors flex items-start gap-4 cursor-pointer font-mono ${
                                        activeAsset?.id === asset.id 
                                            ? 'bg-green-50/40 border-r-4 border-green-700 text-green-900' 
                                            : 'hover:bg-zinc-50/50 text-zinc-700'
                                    }`}
                                >
                                    <div className={`p-1.5 border shrink-0 flex items-center justify-center ${
                                        activeAsset?.id === asset.id 
                                            ? 'bg-green-700 text-white border-green-800' 
                                            : 'bg-zinc-50 text-zinc-400 border-zinc-200'
                                    }`}>
                                        {asset.fileType === 'video' ? <Play size={13} fill="currentColor" /> : <FileText size={13} />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                                            MODULE {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <p className={`font-bold truncate text-[11px] uppercase tracking-wide ${
                                            activeAsset?.id === asset.id ? 'text-green-900 font-extrabold' : 'text-zinc-800'
                                        }`}>
                                            {asset.title}
                                        </p>
                                    </div>
                                    {activeAsset?.id === asset.id && (
                                        <div className="ml-auto text-green-700">
                                            <CheckCircle size={14} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>
                </main>
            </div>
        </Suspense>
    );
}

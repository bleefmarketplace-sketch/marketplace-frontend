'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    ChevronLeft, PlayCircle, BookOpen, 
    CheckCircle, Loader2, Menu, X, 
    Download, ShieldCheck, HelpCircle, ArrowRight,
    Clock
} from 'lucide-react';
import { Card } from '@/components/Card';
import { useApi } from '@/hooks/useApi';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { Button } from '@/components/Button';

export default function CoursePlayerPage() {
    const { id } = useParams();
    const router = useRouter();
    const fetcher = useApi();
    
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeAsset, setActiveAsset] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const loadContent = useCallback(async () => {
        try {
            const res = await fetcher(`/api/creator/vault/${id}`);
            if (res.success) {
                setCourse(res.data);
                if (res.data.digitalAssets?.length > 0) {
                    setActiveAsset(res.data.digitalAssets.sort((a:any, b:any) => a.sortOrder - b.sortOrder)[0]);
                }
            } else {
                toast.error("Access denied. Please ensure you are enrolled.");
                router.push(`/learning/${id}`);
            }
        } catch (err) {
            console.error(err);
            router.push(`/learning/${id}`);
        } finally {
            setLoading(false);
        }
    }, [id, fetcher, router]);

    useEffect(() => { loadContent(); }, [loadContent]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950"><Loader2 className="animate-spin text-green-700" size={32} /></div>;
    if (!course) return null;

    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-300 flex flex-col font-mono text-xs antialiased">
            {/* Player Header */}
            <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push(`/learning/${id}`)} 
                        className="p-2 hover:bg-zinc-900 border border-zinc-850 bg-transparent rounded-none transition-colors cursor-pointer text-white flex items-center justify-center"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="hidden sm:block">
                        <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Bleefy Academy</p>
                        <h1 className="text-xs font-bold uppercase tracking-wider truncate max-w-md text-white mt-0.5">{course.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-950/40 rounded-none border border-green-700/30">
                        <ShieldCheck size={14} className="text-green-400" />
                        <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Secure Content</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-zinc-900 border border-zinc-850 rounded-none cursor-pointer text-white">
                        {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Player Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-zinc-900">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Media Container */}
                        <div className="aspect-video bg-black rounded-none shadow-none border border-zinc-800 relative">
                            {activeAsset?.fileType === 'video' ? (
                                <video 
                                    src={activeAsset.fileUrl} 
                                    controls 
                                    className="w-full h-full object-contain"
                                    poster={course.primaryImage}
                                />
                            ) : activeAsset?.fileType === 'pdf' ? (
                                <iframe 
                                    src={activeAsset.fileUrl} 
                                    className="w-full h-full"
                                    title={activeAsset.title}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6">
                                    <div className="w-16 h-16 rounded-none bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-500">
                                        <BookOpen size={32} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">{activeAsset?.title}</h3>
                                        <p className="text-zinc-500 mt-2 text-xs font-sans">This module is a document or external resource.</p>
                                    </div>
                                    <Button className="rounded-none bg-green-700 hover:bg-green-800 text-white font-mono text-xs uppercase font-bold tracking-wider border-none px-6 py-3" onClick={() => window.open(activeAsset?.fileUrl, '_blank')}>
                                        <Download size={14} className="mr-1.5" /> Download Resource
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Description & Metadata */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-lg font-black tracking-widest uppercase font-mono text-white mb-2">{activeAsset?.title}</h2>
                                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                        <span className="flex items-center gap-1"><Clock size={12} /> 12:45 mins</span>
                                        <span className="text-zinc-800 font-normal">|</span>
                                        <span className="text-green-400">{activeAsset?.fileType} module</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="border-zinc-800 hover:bg-zinc-950 rounded-none font-mono text-xs uppercase font-bold tracking-wider px-4">
                                        <HelpCircle size={14} className="mr-1.5" /> Ask Expert
                                    </Button>
                                    <Button className="bg-green-700 text-white hover:bg-green-800 rounded-none font-mono text-xs uppercase font-bold tracking-wider px-4 border-none">
                                        Complete Lesson
                                    </Button>
                                </div>
                            </div>
                            
                            <hr className="border-zinc-850" />
                            
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-white font-mono">Lesson Overview</h4>
                                <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                                    In this module, we dive deep into the specific implementation of {activeAsset?.title}. 
                                    The instructor covers core principles and practical applications tailored for Nigerian soil and climatic conditions.
                                    {course.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Desktop Sidebar (Curriculum) */}
                <aside className={`fixed lg:relative inset-y-0 right-0 w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                    <div className="p-6 border-b border-zinc-850">
                        <h3 className="font-bold text-[10px] uppercase tracking-widest text-green-400">Academy Syllabus</h3>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="flex-1 h-2 bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden">
                                <div className="h-full bg-green-700" style={{ width: '33%' }} />
                            </div>
                            <span className="text-[10px] font-bold">33%</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
                        {course.digitalAssets?.sort((a:any, b:any) => a.sortOrder - b.sortOrder).map((asset:any, idx:number) => (
                            <button 
                                key={asset.id}
                                onClick={() => {
                                    setActiveAsset(asset);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full p-5 flex items-start gap-4 hover:bg-zinc-900/50 transition-colors text-left cursor-pointer border-none ${activeAsset?.id === asset.id ? 'bg-green-950/20 border-l-2 border-green-700' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border ${activeAsset?.id === asset.id ? 'border-green-700 bg-green-950/40 text-green-400' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}>
                                    {asset.fileType === 'video' ? <PlayCircle size={14} /> : <BookOpen size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${activeAsset?.id === asset.id ? 'text-green-400' : 'text-zinc-550'}`}>Lesson {idx + 1}</p>
                                    <h4 className={`text-xs font-bold uppercase tracking-wider truncate leading-tight ${activeAsset?.id === asset.id ? 'text-white' : 'text-zinc-400'}`}>{asset.title}</h4>
                                </div>
                                {idx === 0 && <CheckCircle size={12} className="text-green-700 mt-1 shrink-0" />}
                            </button>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

const IncludeItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="flex items-center gap-3 text-zinc-500">
        <Icon size={14} className="text-green-700" />
        <span className="text-[11px] font-medium font-sans">{label}</span>
    </div>
);

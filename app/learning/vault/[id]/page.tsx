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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;
    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            {/* Player Header */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push(`/learning/${id}`)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="hidden sm:block">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Bleefy Academy</p>
                        <h1 className="text-sm font-bold truncate max-w-md">{course.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Secure Content</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-white/10 rounded-full">
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Player Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Media Container */}
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative">
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
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                                    <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                        <BookOpen size={48} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold">{activeAsset?.title}</h3>
                                        <p className="text-gray-400 mt-2">This module is a document or external link.</p>
                                    </div>
                                    <Button className="rounded-xl bg-emerald-600 px-8" onClick={() => window.open(activeAsset?.fileUrl, '_blank')}>
                                        <Download size={18} className="mr-2" /> Download Resource
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Description & Metadata */}
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight mb-2">{activeAsset?.title}</h2>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> 12:45 mins</span>
                                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                        <span className="capitalize text-emerald-500">{activeAsset?.fileType} module</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
                                        <HelpCircle size={18} className="mr-2" /> Ask Expert
                                    </Button>
                                    <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold">
                                        Complete Lesson
                                    </Button>
                                </div>
                            </div>
                            
                            <hr className="border-white/5" />
                            
                            <div className="prose prose-invert max-w-none">
                                <h4 className="text-lg font-bold mb-4">Lesson Overview</h4>
                                <p className="text-gray-400 leading-relaxed">
                                    In this module, we dive deep into the specific implementation of {activeAsset?.title}. 
                                    The instructor covers core principles and practical applications tailored for Nigerian soil and climatic conditions.
                                    {course.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Desktop Sidebar (Curriculum) */}
                <aside className={`fixed lg:relative inset-y-0 right-0 w-80 bg-gray-900 border-l border-white/5 flex flex-col transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                    <div className="p-6 border-b border-white/5">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-500">Academy Syllabus</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-1/3" />
                            </div>
                            <span className="text-[10px] font-black">33%</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                        {course.digitalAssets?.sort((a:any, b:any) => a.sortOrder - b.sortOrder).map((asset:any, idx:number) => (
                            <button 
                                key={asset.id}
                                onClick={() => {
                                    setActiveAsset(asset);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full p-6 flex items-start gap-4 hover:bg-white/5 transition-colors text-left ${activeAsset?.id === asset.id ? 'bg-emerald-500/5' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeAsset?.id === asset.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-800 text-gray-500'}`}>
                                    {asset.fileType === 'video' ? <PlayCircle size={16} /> : <BookOpen size={16} />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeAsset?.id === asset.id ? 'text-emerald-500' : 'text-gray-500'}`}>Lesson {idx + 1}</p>
                                    <h4 className={`text-xs font-bold leading-tight ${activeAsset?.id === asset.id ? 'text-white' : 'text-gray-400'}`}>{asset.title}</h4>
                                </div>
                                {idx === 0 && <CheckCircle size={14} className="text-emerald-500 mt-1" />}
                            </button>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

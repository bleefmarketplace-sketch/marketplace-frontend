'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    ChevronLeft, Star, PlayCircle, Clock, BookOpen, 
    CheckCircle, ShieldCheck, ArrowRight, Loader2,
    Lock, Share2, Award, Zap
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useApi } from '@/hooks/useApi';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function CourseDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const fetcher = useApi();
    const { user } = useAuth();
    
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPurchased, setIsPurchased] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave'>('paystack');

    const loadCourse = useCallback(async () => {
        try {
            const [courseRes, purchaseRes] = await Promise.all([
                fetcher(`/api/products/${id}`),
                user ? fetcher(`/api/creator/vault/${id}`) : Promise.resolve({ success: false })
            ]);

            setCourse(courseRes.data);
            setIsPurchased(purchaseRes.success);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id, fetcher, user]);

    useEffect(() => { loadCourse(); }, [loadCourse]);

    const handleEnroll = async () => {
        if (!user) {
            toast.info("Please log in to enroll");
            router.push('/auth/login');
            return;
        }

        setEnrolling(true);
        try {
            const res = await fetcher('/api/orders', {
                method: 'POST',
                body: JSON.stringify({
                    items: [{ productId: id, quantity: 1 }],
                    shippingAddress: 'Digital Delivery',
                    paymentMethod: paymentMethod
                })
            });
            
            if (res.authorization_url) {
                window.location.href = res.authorization_url;
            } else {
                toast.success("Enrolled successfully!");
                loadCourse();
            }
        } catch (err: any) {
            toast.error(err.message || "Enrollment failed");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-green-700" size={32} /></div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center font-mono text-xs font-bold uppercase tracking-wider text-zinc-450 bg-zinc-50">Course not found</div>;

    return (
        <div className="min-h-screen bg-zinc-50 pb-20 text-zinc-900 font-mono text-xs antialiased">
            {/* Header */}
            <div className="bg-zinc-950 text-white pt-12 pb-24 md:pb-32 relative overflow-hidden border-b border-zinc-800">
                <div className="absolute inset-0 opacity-5">
                    <Image fill src={course.primaryImage} alt="" className="object-cover blur-lg" unoptimized />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors mb-8 font-mono text-[10px] uppercase font-bold tracking-widest border border-zinc-700 bg-transparent px-3 py-1.5 rounded-none cursor-pointer w-fit"
                    >
                        <ChevronLeft size={12} /> Back to Academy
                    </button>
                    
                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2.5 py-0.5 bg-green-950/40 text-green-400 border border-green-700/30 rounded-none text-[10px] font-bold uppercase tracking-wider">
                                    {course.category?.name || 'Agri-Expert'}
                                </span>
                                <span className="px-2.5 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-none text-[10px] font-bold uppercase tracking-wider">
                                    Course
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight uppercase font-mono">{course.title}</h1>
                            <p className="text-zinc-400 font-sans text-xs max-w-2xl leading-relaxed">
                                {course.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                    <Star size={14} className="text-yellow-600 fill-current" />
                                    <span className="text-white font-black">{course.digitalMetadata?.trustScore || '4.8'}</span>
                                    <span className="text-zinc-500 font-normal">(120+ Reviews)</span>
                                </div>
                                <div className="w-px h-3 bg-zinc-800" />
                                <div className="flex items-center gap-1.5 text-zinc-350">
                                    <Award size={14} className="text-green-500" /> Verified Instructor
                                </div>
                                <div className="w-px h-3 bg-zinc-800" />
                                <div className="flex items-center gap-1.5 text-zinc-350">
                                    <Zap size={14} className="text-yellow-600" /> {course.digitalMetadata?.aiAccuracyScore || '95'}% AI Certified
                                </div>
                            </div>
                        </div>

                        {/* Floating Purchase Card (Desktop) */}
                        <div className="hidden lg:block sticky top-24">
                            <Card className="p-0 border border-zinc-200 shadow-none rounded-none overflow-hidden bg-white font-mono text-xs">
                                <div className="aspect-video relative border-b border-zinc-200 bg-zinc-100">
                                    <Image fill src={course.primaryImage} alt="" className="object-cover" unoptimized />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer">
                                        <div className="w-12 h-12 rounded-none border border-white/40 bg-black/40 flex items-center justify-center text-white transform group-hover:scale-105 transition-all">
                                            <PlayCircle size={24} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-zinc-950 tracking-wider">₦{Number(course.price).toLocaleString()}</span>
                                        <span className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-700/20 px-2 py-0.5 rounded-none uppercase tracking-widest">Digital Access</span>
                                    </div>
                                    
                                    {!isPurchased && (
                                        <div className="space-y-4">
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Select Payment Gateway</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button 
                                                    onClick={() => setPaymentMethod('paystack')}
                                                    className={`py-2.5 rounded-none border transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
                                                        paymentMethod === 'paystack' 
                                                        ? 'border-green-700 bg-green-50/50' 
                                                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                                    }`}
                                                >
                                                    <span className="text-[9px] font-bold text-zinc-900 tracking-wide">PAYSTACK</span>
                                                </button>
                                                <button 
                                                    onClick={() => setPaymentMethod('flutterwave')}
                                                    className={`py-2.5 rounded-none border transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
                                                        paymentMethod === 'flutterwave' 
                                                        ? 'border-green-700 bg-green-50/50' 
                                                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                                                    }`}
                                                >
                                                    <span className="text-[9px] font-bold text-zinc-900 tracking-wide">FLUTTERWAVE</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {isPurchased ? (
                                        <Button fullWidth className="h-12 rounded-none bg-green-700 hover:bg-green-800 text-white font-mono text-xs uppercase font-bold tracking-wider border-none" onClick={() => router.push(`/learning/vault/${id}`)}>
                                            Access Course Content
                                        </Button>
                                    ) : (
                                        <Button fullWidth className="h-12 rounded-none bg-zinc-950 hover:bg-zinc-850 text-white font-mono text-xs uppercase font-bold tracking-wider border-none" onClick={handleEnroll} disabled={enrolling}>
                                            {enrolling ? <Loader2 className="animate-spin" size={14} /> : 'Enroll in Academy'}
                                        </Button>
                                    )}

                                    <div className="space-y-3 pt-4 border-t border-zinc-150">
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-center">Includes:</p>
                                        <div className="space-y-2">
                                            <IncludeItem icon={PlayCircle} label="On-demand video lessons" />
                                            <IncludeItem icon={BookOpen} label="Downloadable resources" />
                                            <IncludeItem icon={Award} label="Certificate of completion" />
                                            <IncludeItem icon={ShieldCheck} label="Expert Q&A access" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Highlights */}
                        <Card className="p-8 border border-zinc-200 shadow-none rounded-none bg-white font-mono text-xs">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-6 flex items-center gap-2">
                                <Sparkles size={14} className="text-green-700" /> What you&apos;ll master
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    "Modern precision farming techniques",
                                    "Sustainable soil fertility management",
                                    "Advanced pest and disease control",
                                    "Agribusiness financial planning",
                                    "Post-harvest loss mitigation",
                                    "Market access and supply chain logic"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="text-green-700 shrink-0 mt-0.5" size={14} />
                                        <span className="text-xs text-zinc-650 font-sans leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Syllabus */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-950 mb-4 px-2 font-mono">Academy Curriculum</h2>
                            <div className="space-y-3">
                                {course.digitalAssets?.length > 0 ? (
                                    course.digitalAssets.sort((a:any, b:any) => a.sortOrder - b.sortOrder).map((asset: any, i: number) => (
                                        <Card key={asset.id} className="p-4 border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors rounded-none shadow-none group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-none border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-500 group-hover:border-green-700 group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
                                                        {asset.fileType === 'video' ? <PlayCircle size={16} /> : <BookOpen size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Lesson {i + 1}</p>
                                                        <h4 className="font-bold text-zinc-950 font-mono text-xs uppercase tracking-wide leading-tight">{asset.title}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 font-mono uppercase">
                                                    <span className="capitalize">{asset.fileType}</span>
                                                    {!isPurchased && <Lock size={14} className="text-zinc-400" />}
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="p-12 text-center bg-white rounded-none border border-dashed border-zinc-300 text-zinc-400 font-mono font-bold uppercase tracking-widest">
                                        Syllabus is being finalized by the instructor.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Purchase Button (Sticky) */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-200 z-50">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total Price</p>
                                <p className="text-lg font-bold text-zinc-950 font-mono">₦{Number(course.price).toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                {!isPurchased && (
                                     <div className="flex gap-2 mb-1">
                                        <button onClick={() => setPaymentMethod('paystack')} className={`px-3 py-1 rounded-none text-[8px] font-mono font-bold uppercase tracking-wider border cursor-pointer ${paymentMethod === 'paystack' ? 'bg-green-50 border-green-700 text-green-700' : 'bg-white border-zinc-200 text-zinc-500'}`}>PAYSTACK</button>
                                        <button onClick={() => setPaymentMethod('flutterwave')} className={`px-3 py-1 rounded-none text-[8px] font-mono font-bold uppercase tracking-wider border cursor-pointer ${paymentMethod === 'flutterwave' ? 'bg-green-50 border-green-700 text-green-700' : 'bg-white border-zinc-200 text-zinc-500'}`}>FLUTTERWAVE</button>
                                     </div>
                                )}
                                <Button className="flex-1 h-12 rounded-none bg-green-700 hover:bg-green-800 text-white font-mono text-xs uppercase font-bold tracking-wider" onClick={handleEnroll} disabled={enrolling}>
                                    {enrolling ? <Loader2 className="animate-spin" size={14} /> : isPurchased ? 'Access Vault' : 'Enroll Now'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
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

const Sparkles = ({ className, size = 16 }: { className?: string, size?: number }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
    </svg>
);

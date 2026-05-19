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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">Course not found</div>;

    return (
        <div className="min-h-screen bg-gray-50/30 pb-20">
            {/* Header */}
            <div className="bg-gray-900 text-white pt-12 pb-24 md:pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image fill src={course.primaryImage} alt="" className="object-cover blur-lg" unoptimized />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 font-black uppercase tracking-widest text-[10px]">
                        <ChevronLeft size={16} /> Back to Academy
                    </button>
                    
                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex flex-wrap gap-3">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {course.category?.name || 'Agri-Expert'}
                                </span>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Course
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">{course.title}</h1>
                            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
                                {course.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Star size={18} className="text-yellow-500 fill-current" />
                                    <span className="font-black">{course.digitalMetadata?.trustScore || '4.8'}</span>
                                    <span className="text-gray-500 font-bold">(120+ Reviews)</span>
                                </div>
                                <div className="w-px h-4 bg-gray-700" />
                                <div className="flex items-center gap-2 text-gray-400 font-bold">
                                    <Award size={18} className="text-blue-400" /> Verified Instructor
                                </div>
                                <div className="w-px h-4 bg-gray-700" />
                                <div className="flex items-center gap-2 text-gray-400 font-bold">
                                    <Zap size={18} className="text-orange-400" /> {course.digitalMetadata?.aiAccuracyScore || '95'}% AI Certified
                                </div>
                            </div>
                        </div>

                        {/* Floating Purchase Card (Desktop) */}
                        <div className="hidden lg:block sticky top-24">
                            <Card className="p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                                <div className="aspect-video relative">
                                    <Image fill src={course.primaryImage} alt="" className="object-cover" unoptimized />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 transform group-hover:scale-110 transition-transform">
                                            <PlayCircle size={32} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-black text-gray-900 tracking-tighter">₦{Number(course.price).toLocaleString()}</span>
                                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Digital Access</span>
                                    </div>
                                    
                                    {!isPurchased && (
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Payment Gateway</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button 
                                                    onClick={() => setPaymentMethod('paystack')}
                                                    className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                                                        paymentMethod === 'paystack' 
                                                        ? 'border-emerald-500 bg-emerald-50' 
                                                        : 'border-gray-50 bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-black text-blue-600">PAYSTACK</span>
                                                </button>
                                                <button 
                                                    onClick={() => setPaymentMethod('flutterwave')}
                                                    className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                                                        paymentMethod === 'flutterwave' 
                                                        ? 'border-orange-500 bg-orange-50' 
                                                        : 'border-gray-50 bg-gray-50'
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-black text-orange-500">FLUTTERWAVE</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {isPurchased ? (
                                        <Button fullWidth className="h-14 rounded-2xl bg-emerald-600 font-black uppercase tracking-widest" onClick={() => router.push(`/learning/vault/${id}`)}>
                                            Access Course Content
                                        </Button>
                                    ) : (
                                        <Button fullWidth className="h-14 rounded-2xl bg-gray-900 hover:bg-gray-800 font-black uppercase tracking-widest shadow-xl shadow-gray-200" onClick={handleEnroll} disabled={enrolling}>
                                            {enrolling ? <Loader2 className="animate-spin" /> : 'Enroll in Academy'}
                                        </Button>
                                    )}

                                    <div className="space-y-3 pt-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Includes:</p>
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
                        <Card className="p-8 md:p-12 border-none shadow-xl rounded-[3rem] bg-white">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <Sparkles className="text-emerald-600" /> What you&apos;ll master
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
                                        <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                                        <span className="text-sm font-medium text-gray-600 leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Syllabus */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 px-4">Academy Curriculum</h2>
                            <div className="space-y-4">
                                {course.digitalAssets?.length > 0 ? (
                                    course.digitalAssets.sort((a:any, b:any) => a.sortOrder - b.sortOrder).map((asset: any, i: number) => (
                                        <Card key={asset.id} className="p-6 border-gray-100 hover:border-emerald-200 transition-colors rounded-2xl group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                        {asset.fileType === 'video' ? <PlayCircle size={20} /> : <BookOpen size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Lesson {i + 1}</p>
                                                        <h4 className="font-bold text-gray-900 text-sm">{asset.title}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-bold text-gray-400 capitalize">{asset.fileType}</span>
                                                    {!isPurchased && <Lock size={16} className="text-gray-300" />}
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="p-12 text-center bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold">
                                        Syllabus is being finalized by the instructor.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Purchase Button (Sticky) */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Price</p>
                                <p className="text-2xl font-black text-gray-900">₦{Number(course.price).toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                {!isPurchased && (
                                     <div className="flex gap-2 mb-1">
                                        <button onClick={() => setPaymentMethod('paystack')} className={`px-3 py-1 rounded-lg text-[8px] font-black border ${paymentMethod === 'paystack' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>PAYSTACK</button>
                                        <button onClick={() => setPaymentMethod('flutterwave')} className={`px-3 py-1 rounded-lg text-[8px] font-black border ${paymentMethod === 'flutterwave' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>FLUTTERWAVE</button>
                                     </div>
                                )}
                                <Button className="flex-1 h-14 rounded-2xl bg-emerald-600 font-black uppercase tracking-widest shadow-lg" onClick={handleEnroll} disabled={enrolling}>
                                    {enrolling ? <Loader2 className="animate-spin" /> : isPurchased ? 'Access Vault' : 'Enroll Now'}
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
    <div className="flex items-center gap-3 text-gray-600">
        <Icon size={16} className="text-emerald-500" />
        <span className="text-xs font-medium">{label}</span>
    </div>
);

const Sparkles = ({ className }: { className?: string }) => (
    <svg 
        width="24" 
        height="24" 
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

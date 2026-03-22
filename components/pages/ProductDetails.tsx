'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Star, ShieldCheck, Truck, ChevronRight, MessageCircle,
    Minus, Plus, Award, Heart, Share2,
    Info, MapPin
} from 'lucide-react';
import { Button } from '@/components/Button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-toastify';
import ReviewItem from '../Marketplace/ReviewItem';
import { useTracking } from '@/hooks/useTracking';
import { DiscoveryFeed } from '../Marketplace/DiscoveryFeed';

export default function ProductDetails() {
    const { trackEvent } = useTracking();
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', isAnonymous: false });

    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProductAndTrack = async () => {
            try {
                const res = await fetch(`/api/marketplace/${id}`);
                const data = await res.json();
                 
                setProduct(data);
                setActiveImage(data.primaryImage);
                if (data.reviews) setReviews(data.reviews);

                // OPTIMIZED TRACKING: Send metadata to build the "Interest Profile"
                trackEvent('view', id as string, {
                    categoryId: data.categoryId,
                    price: data.price,
                    sellerId: data.sellerProfileId
                });

            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndTrack();
    }, [id]);

    const handleAddToCart = () => {
        addItem(product, quantity);
        toast.success(`${quantity} unit(s) added to your basket`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500"></div>
                <p className="text-gray-400 text-sm font-medium">Loading harvest details...</p>
            </div>
        </div>
    );

    if (!product) return <div className="p-20 text-center">Produce not found.</div>;

    const allImages = [product.primaryImage, ...(product.otherImages || [])];

    const handleSubmitReview = async () => {
        if (!newReview.comment.trim()) return toast.error("Please add a comment");
        setSubmitting(true);
        try {
            const res = await fetch(`/api/reviews/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview)
            });

            const data = await res.json();

            if (data.id) {
                setReviews([data, ...reviews]);
                setIsReviewing(false);
                setNewReview({ rating: 5, comment: '', isAnonymous: false });

              
            } else {
                alert(data.message || "Failed to post review");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* --- TOP NAVIGATION / BREADCRUMBS --- */}
            <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <span className="hover:text-emerald-600 cursor-pointer">Market</span>
                        <ChevronRight size={12} />
                        <span className="text-gray-900 truncate max-w-50">{product.title}</span>
                    </nav>
                     
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* --- LEFT: VISUALS & SPECS --- */}
                    <div className="lg:col-span-7">
                        <div className="space-y-6">
                            {/* Main Image */}
                            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100">
                                <Image unoptimized fill src={activeImage} alt={product.title} className="object-cover" priority />
                                {product.isOrganic && (
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur shadow-sm px-4 py-2 rounded-2xl text-emerald-700 text-xs font-black flex items-center gap-2">
                                        <Award size={16} /> ORGANIC CERTIFIED
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className="flex gap-4 px-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-emerald-500 scale-105 shadow-lg' : 'border-transparent opacity-60'}`}
                                    >
                                        <Image unoptimized fill src={img} alt="" className="object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Detailed Description */}
                            <div className="pt-10 border-t border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">About this harvest</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                            </div>

                            {/* Attributes / Specs Table */}
                            <div className="pt-10">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Info size={18} className="text-emerald-500" /> Technical Specifications
                                </h3>
                                <div className="grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-3xl overflow-hidden">
                                    {Object.entries(product.attributes || {}).map(([key, value]) => (
                                        <div key={key} className="bg-white p-5 flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{key}</span>
                                            <span className="text-gray-900 font-semibold">{String(value)}</span>
                                        </div>
                                    ))}
                                    <div className="bg-white p-5 flex flex-col gap-1">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Location</span>
                                        <span className="text-gray-900 font-semibold flex items-center gap-1"><MapPin size={14} /> {product.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT: PURCHASE & TRUST (STICKY) --- */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                                <div className="mb-6">
                                    <h1 className="text-3xl font-black text-gray-900 mb-2">{product.title}</h1>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-sm font-bold">
                                            <Star size={14} fill="currentColor" /> {product.averageRating}
                                        </div>
                                        <span className="text-gray-300 text-sm">({product.reviewCount} verified reviews)</span>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-8">
                                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">Wholesale Price</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-gray-900">${product.price}</span>
                                        <span className="text-gray-400 font-medium">/ MT</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Minimum Order: 1 Metric Ton</p>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-3xl space-y-4 mb-8">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-700">Order Quantity</span>
                                        <div className="flex items-center gap-4 bg-white rounded-full px-3 py-1.5 border shadow-sm">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-emerald-600"><Minus size={18} /></button>
                                            <span className="font-black w-8 text-center">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-emerald-600"><Plus size={18} /></button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="text-sm text-gray-500">Total Est.</span>
                                        <span className="text-xl font-black text-gray-900">${(product.price * quantity).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button fullWidth size="lg" className="rounded-2xl h-16 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100" onClick={handleAddToCart}>
                                        Add to Basket
                                    </Button>
                                    <Button onClick={() => router.push("/marketplace/checkout")} fullWidth variant="outline" size="lg" className="rounded-2xl h-16 text-lg font-bold border-gray-200">
                                        Secure Checkout
                                    </Button>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                        <ShieldCheck size={16} className="text-emerald-500" /> Quality Guaranteed
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                        <Truck size={16} className="text-emerald-500" /> Global Logistics
                                    </div>
                                </div>
                            </div>

                            {/* Seller Card */}
                            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">The Supplier</p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 relative overflow-hidden">
                                            <Image unoptimized fill src={product.seller?.logo || '/placeholder-avatar.jpg'} alt="" className="object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold">{product.seller?.businessName}</h4>
                                            <p className="text-xs text-gray-400">{product.seller?.businessCity}, {product.seller?.businessState}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                                            <p className="text-lg font-bold">{product.seller?.rating || '5.0'}</p>
                                            <p className="text-[8px] uppercase text-gray-500">Rating</p>
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                                            <p className="text-lg font-bold">Verified</p>
                                            <p className="text-[8px] uppercase text-gray-500">Status</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 blur-[80px]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- REVIEWS SECTION --- */}
                <div className="mt-20 max-w-4xl">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-3xl font-black text-gray-900">User Reviews</h3>
                        <Button onClick={() => setIsReviewing(!isReviewing)} variant="ghost" className="text-emerald-600 font-bold">
                            {isReviewing ? "Dismiss" : "Write a Review"}
                        </Button>
                    </div>

                    {/* Review Form logic remains same but with better styling... */}
                    {isReviewing && (
                        <div className="mb-10 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-emerald-200">
                            <h4 className="font-bold mb-4">Your Experience</h4>

                            {/* Star Input */}
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })}>
                                        <Star
                                            size={24}
                                            className={s <= newReview.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className="w-full p-4 rounded-xl border-none ring-1 ring-gray-200 mb-4 text-sm"
                                placeholder="How was the quality of this harvest?"
                                rows={3}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newReview.isAnonymous}
                                        onChange={(e) => setNewReview({ ...newReview, isAnonymous: e.target.checked })}
                                        className="rounded text-emerald-600"
                                    />
                                    <span className="text-xs text-gray-500 font-medium">Post Anonymously</span>
                                </label>

                                <Button
                                    size="sm"
                                    onClick={handleSubmitReview}
                                    disabled={submitting}
                                >
                                    {submitting ? "Posting..." : "Post Review"}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map((rev: any) => <ReviewItem key={rev.id} review={rev} />)
                        ) : (
                            <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed">
                                <p className="text-gray-400 font-medium">No reviews yet. Be the first to rate this harvest.</p>
                            </div>
                        )}
                    </div>
                    <div className=" mx-auto px-4">
                        <DiscoveryFeed limit={4} excludeProductId={id as string} />
                    </div>
                </div>
            </main>
        </div>
    );
}
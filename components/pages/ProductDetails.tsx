'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Minus, Plus, ShieldCheck, Truck, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-toastify';
import ReviewItem from '../Marketplace/ReviewItem';
import { DiscoveryFeed } from '../Marketplace/DiscoveryFeed';

export default function ProductDetails() {
  const { slug } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);

  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/marketplace/${slug}`);
        const data = await res.json();
        setProduct(data.data);
        setActiveImage(data.data.primaryImage);
        setReviews(data.data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success('Added to basket');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-6 w-6 border-2 border-zinc-300 border-t-green-700 rounded-full" />

        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-mono text-xs p-10">
        <div className="text-center p-12 bg-white border border-dashed border-zinc-250 max-w-sm w-full">
          <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-950 uppercase tracking-tight">ASSET NOT REGISTERED</h3>
          <p className="text-zinc-500 text-xs font-sans mt-1 mb-4">The dynamic slug provided could not be matched.</p>
          <Button onClick={() => router.push('/marketplace')} size="sm">RETURN TO CATALOG</Button>
        </div>
      </div>
    );
  }

  const images = [product.primaryImage, ...(product.otherImages || [])];

  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-900 font-sans antialiased">
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb path */}
        <div className="flex justify-between items-center font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-6 border-b border-zinc-200 pb-3">
          <nav className="flex items-center gap-1.5">
            <span className="hover:text-green-700 cursor-pointer" onClick={() => router.push('/marketplace')}>MARKETPLACE CATALOG</span>
            <span>/</span>
            <span className="text-zinc-950 truncate max-w-xs">{product.title}</span>
          </nav>
          <span>INDEX REF: {product.id.substring(0, 8).toUpperCase()}</span>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-10 gap-8 items-start">

          {/* LEFT SPECS PANEL */}
          <div className="lg:col-span-6 space-y-6">

            {/* MAIN IMAGE */}
            <div className="aspect-[4/3] relative rounded-none border border-zinc-200 overflow-hidden bg-white">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                className="object-cover"
                unoptimized
              />
              {product.isOrganic && (
                <div className="absolute top-4 left-4 bg-zinc-950/90 text-white font-mono text-[9px] font-bold tracking-widest border border-zinc-800 px-3 py-1 uppercase rounded-none">
                  🧬 ORGANIC CERTIFIED
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-2">
              {images.map((img: string, i: number) => {
                const isActive = activeImage === img;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-none overflow-hidden relative border cursor-pointer transition-colors ${isActive ? 'border-green-600 ring-1 ring-green-600/30' : 'border-zinc-250 hover:border-zinc-400'
                      }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                );
              })}
            </div>

            {/* DESCRIPTION */}
            <div className="pt-6 border-t border-zinc-200">
              <h2 className="font-mono uppercase font-bold text-xs text-zinc-450 tracking-widest border-b border-zinc-100 pb-2 mb-3">
                Product Details
              </h2>
              <p className="text-zinc-650 text-xs font-sans leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* SPECS TABLE */}
            <div className="pt-6">
              <h2 className="font-mono uppercase font-bold text-xs text-zinc-450 tracking-widest border-b border-zinc-100 pb-2 mb-3">
                Product specifications
              </h2>
              <div className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-none overflow-hidden font-mono text-xs">
                {Object.entries(product.attributes || {}).map(([k, v]) => (
                  <div key={k} className="bg-white p-4 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{k}</span>
                    <span className="font-bold text-zinc-950 uppercase">{String(v)}</span>
                  </div>
                ))}
                <div className="bg-white p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">ORIGIN STATION</span>
                  <span className="font-bold text-zinc-950 uppercase">{product.location || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT TRANSACTION CONTROL BOARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-zinc-200 p-5 rounded-none shadow-none sticky top-20 font-mono text-xs space-y-5">

              {/* TITLE */}
              <div>
                <h1 className="text-md font-black text-zinc-950 uppercase leading-snug">{product.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase mt-2">
                  <div className="flex items-center gap-0.5 bg-amber-50 text-amber-705 px-1.5 py-0.5 border border-amber-200 rounded-none">
                    <Star size={9} className="fill-amber-600 text-amber-600" />
                    {product.averageRating}
                  </div>
                  <span className="text-zinc-400">({product.reviewCount} REVIEWS)</span>
                </div>
              </div>

              {/* PRICE */}
              <div className="border-y border-zinc-100 py-4 bg-zinc-50/30 px-3 border-x">
                <span className="text-[9px] font-bold text-zinc-400 block uppercase tracking-wider">MARKET RATE</span>
                <p className="text-2xl font-black text-zinc-950 mt-1">
                  ₦{product.price.toLocaleString()}
                </p>
                <p className="text-[9px] text-zinc-400 font-bold block uppercase tracking-wider mt-0.5">PRICE PER UNIT</p>
              </div>

              {/* QUANTITY CONTROL */}
              <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider border-b border-zinc-100 pb-3">
                <span className="text-zinc-500"> Quantity</span>
                <div className="flex items-center border border-zinc-300 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1.5 hover:text-green-700 cursor-pointer transition-colors border-r border-zinc-200"
                  >
                    <Minus size={11} strokeWidth={3} />
                  </button>
                  <span className="px-4 text-[11px] text-zinc-950 font-black text-center w-12">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1.5 hover:text-green-700 cursor-pointer transition-colors border-l border-zinc-200"
                  >
                    <Plus size={11} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider bg-zinc-50 p-3 border">
                <span className="text-zinc-500">AGGREGATE TOTAL</span>
                <span className="text-sm font-black text-green-800">₦{(product.price * quantity).toLocaleString()}</span>
              </div>

              {/* ACTIONS */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-11 text-xs tracking-wider"
                >
                  ADD TO BASKET
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    addItem(product, quantity);
                    router.push('/marketplace/checkout');
                  }}
                  className="w-full h-11 text-xs tracking-wider"
                >
                  SECURE CHECKOUT
                </Button>
              </div>

              {/* Badges strip */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-100 font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-green-700" /> QUALITY ASSURED
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={13} className="text-green-700" /> SECURE ROUTING
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-16 max-w-3xl font-mono text-xs">
          <h2 className="font-mono uppercase font-bold text-xs text-zinc-450 tracking-widest border-b border-zinc-200 pb-2 mb-6">
            buyer reviews ({reviews.length})
          </h2>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-50 border border-dashed border-zinc-200 p-8 text-center rounded-none text-zinc-400">
              NO VERIFIED REVIEWS REGISTERED FOR THIS ASSET
            </div>
          )}
        </div>

        {/* DISCOVERY */}
        <div className="mt-16 font-mono">
          <h2 className="font-mono uppercase font-bold text-xs text-zinc-450 tracking-widest border-b border-zinc-200 pb-2 mb-6">
            other listings
          </h2>
          <DiscoveryFeed limit={4} excludeProductId={product.id} />
        </div>

      </main>
    </div>
  );
}
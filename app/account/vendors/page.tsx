'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import {
  Search, ShieldCheck, Star, MapPin,
  Package, Loader2, Store, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface Seller {
  id: string;
  businessName: string;
  description: string;
  location: string;
  rating: number;
  totalProducts: number;
  isVerified: boolean;
  logoUrl?: string;
  user?: { isVerified: boolean };
}

export default function BuyerVendorsPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/marketplace/sellers?page=${page}&limit=12&search=${search}`);
        const data = await res.json();
        setSellers(data.data || data.stores || []);
        setTotal(data.total || 0);
      } catch {
        toast.error('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };
    const delay = setTimeout(load, 300);
    return () => clearTimeout(delay);
  }, [search, page]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8 font-mono text-zinc-900 text-xs antialiased">
      
      {/* Telemetry Header */}
      <div className="border border-zinc-200 bg-white p-5 select-none flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            REGISTERED CROP PRODUCERS & FARMS
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-1 flex items-center gap-2">
            <Store className="text-green-700" size={20} /> Verified Cooperative Vendors
          </h1>
          <p className="text-zinc-500 text-[10px] mt-0.5">
            Browse verified local crop producers, Precision Agronomists, and verified farming cooperatives.
          </p>
        </div>
        
        {/* Search Panel */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="SEARCH VENDOR BUSINESS NAME..."
            className="w-full pl-9 pr-4 py-2.5 border border-zinc-250 rounded-none bg-white font-mono text-xs uppercase tracking-wider text-zinc-900 focus:outline-none focus:border-green-700"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
          <span>RETRIVING REGISTERED COOPERATIVE VENDORS...</span>
        </div>
      ) : sellers.length === 0 ? (
        <Card className="p-16 text-center border border-zinc-200 border-dashed rounded-none bg-white shadow-none select-none">
          <Store className="mx-auto mb-4 text-zinc-300" size={40} />
          <h3 className="text-xs font-bold text-zinc-450 uppercase tracking-widest">NO MATCHING REGISTERED VENDORS FOUND</h3>
          <p className="text-zinc-500 text-[10px] mt-2">Adjust search credentials to query active directory.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map(seller => (
              <Card
                key={seller.id}
                className="p-5 bg-white border border-zinc-200 rounded-none shadow-none hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
                onClick={() => router.push(`/marketplace?seller=${seller.id}`)}
              >
                <div>
                  <div className="flex items-start gap-4 mb-4 select-none">
                    <div className="w-12 h-12 border border-zinc-200 bg-green-50/40 text-green-800 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden rounded-none">
                      {seller.logoUrl ? (
                        <Image src={seller.logoUrl} alt={seller.businessName} width={48} height={48} className="object-cover" unoptimized />
                      ) : (
                        seller.businessName?.[0]?.toUpperCase() || 'S'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-zinc-950 uppercase tracking-wider truncate text-xs">{seller.businessName}</h3>
                        {(seller.user?.isVerified || seller.isVerified) && (
                          <ShieldCheck size={14} className="text-green-700 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-zinc-400 font-mono text-[9px] font-bold">
                        <MapPin size={11} />
                        <span className="uppercase">{seller.location || 'Nigeria'}</span>
                      </div>
                    </div>
                  </div>

                  {seller.description && (
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-sans line-clamp-2 mb-4">{seller.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-zinc-100">
                  <div className="flex items-center gap-3 text-[9px] font-bold font-mono text-zinc-450 select-none">
                    {seller.rating > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <strong className="text-zinc-800 font-black">{Number(seller.rating).toFixed(1)}</strong>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Package size={11} />
                      {seller.totalProducts || 0} PRODUCTS
                    </span>
                  </div>
                  
                  <button
                    className="h-8 px-4 bg-zinc-950 text-white border border-zinc-800 hover:bg-zinc-900 font-bold uppercase tracking-wider text-[9px] cursor-pointer flex items-center gap-1 transition-colors rounded-none"
                  >
                    Visit Store <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {total > 12 && (
            <div className="flex justify-center gap-2 pt-6 font-mono text-xs select-none">
              <button 
                disabled={page === 1} 
                onClick={(e) => { e.stopPropagation(); setPage(p => p - 1); }}
                className="h-8 px-4 border border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-700 font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-colors disabled:opacity-40"
              >
                Previous
              </button>
              <span className="flex items-center text-[10px] font-bold text-zinc-650 px-4 bg-zinc-100 border border-zinc-200">
                PAGE {page}
              </span>
              <button 
                disabled={page * 12 >= total} 
                onClick={(e) => { e.stopPropagation(); setPage(p => p + 1); }}
                className="h-8 px-4 border border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-700 font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-colors disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">All Vendors</h1>
          <p className="text-gray-500 text-sm">Browse verified farms and suppliers</p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search vendors..."
            icon={<Search size={18} />}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      ) : sellers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <Store className="mx-auto mb-4 text-gray-200" size={48} />
          <h3 className="font-bold text-gray-400">No vendors found</h3>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map(seller => (
              <Card
                key={seller.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(`/marketplace?seller=${seller.id}`)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center font-black text-emerald-700 text-xl shrink-0 overflow-hidden">
                    {seller.logoUrl ? (
                      <Image src={seller.logoUrl} alt={seller.businessName} width={56} height={56} className="object-cover" unoptimized />
                    ) : (
                      seller.businessName?.[0] || 'S'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-gray-900 truncate">{seller.businessName}</h3>
                      {(seller.user?.isVerified || seller.isVerified) && (
                        <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{seller.location || 'Nigeria'}</span>
                    </div>
                  </div>
                </div>

                {seller.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{seller.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {seller.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <strong className="text-gray-700">{Number(seller.rating).toFixed(1)}</strong>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Package size={12} />
                      {seller.totalProducts || 0} products
                    </span>
                  </div>
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 group-hover:underline">
                    Visit Store <ArrowRight size={12} />
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {total > 12 && (
            <div className="flex justify-center gap-3 pt-4">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm font-bold text-gray-600 px-4">
                Page {page}
              </span>
              <Button variant="outline" disabled={page * 12 >= total} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
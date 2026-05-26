'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  BookOpen,
  PlayCircle,
  GraduationCap,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// ✅ Define proper types
type Product = {
  id: string;
  type?: string;
};

type OrderItem = {
  id: string;
  typeSnapshot?: string;
  product?: Product;
  productSnapshotImage?: string;
  productSnapshotTitle?: string;
  order?: {
    createdAt: string;
  };
};

type Order = {
  id: string;
  items: OrderItem[];
};

export default function DigitalLibraryPage() {
  const fetcher = useApi() as (url: string) => Promise<Order[]>;
  const router = useRouter();

  const [library, setLibrary] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadLibrary = async () => {
      try {
        const orders = await fetcher('/api/orders/my-orders');

        const digitalItems = orders.flatMap((order) =>
          order.items
            ?.filter(
              (item) =>
                item.product?.type === 'digital' ||
                item.typeSnapshot === 'digital'
            )
            .map((item) => ({
              ...item,
              order: {
                createdAt: item.order?.createdAt ?? new Date().toISOString(),
              },
            }))
        );

        setLibrary(digitalItems);
      } catch (error) {
        console.error('Failed to load library:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, [fetcher]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 font-mono text-xs">
        <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
        <span>RETRIVING SECURE LIBRARY VAULT...</span>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex justify-center py-20 font-mono text-xs">
        <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
        <span>HYDRATING DIGITAL TELEMETRY...</span>
      </div>
    }>
      <div className="max-w-7xl mx-auto py-10 px-4 space-y-8 font-mono text-zinc-900 text-xs antialiased">
        
        {/* Telemetry Header */}
        <div className="border border-zinc-200 bg-white p-5 select-none">
          <span className="px-2 py-0.5 text-[9px] font-mono bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-widest">
            DIGITAL REPOSITORY & TELEMETRY
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wider text-zinc-950 mt-2 flex items-center gap-2">
            <GraduationCap className="text-green-700" size={20} /> My Learning Vault
          </h1>
          <p className="text-zinc-500 text-[10px] mt-0.5">
            Access secure agronomy downloads, technical farming webinars, and precision agriculture handbooks.
          </p>
        </div>

        {library.length === 0 ? (
          <Card className="p-16 text-center border border-dashed border-zinc-200 bg-white rounded-none shadow-none">
            <BookOpen size={36} className="mx-auto text-zinc-300 mb-4" />
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
              Your digital library is currently empty.
            </h3>
            <button
              onClick={() => router.push('/marketplace')}
              className="mt-6 h-9 px-6 border border-green-700 bg-green-50 hover:bg-green-100 text-green-800 font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-colors"
            >
              Browse Technical Catalog
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {library.map((item) => (
              <Card
                key={item.id}
                className="p-0 overflow-hidden bg-white border border-zinc-200 rounded-none shadow-none hover:-translate-y-0.5 transition-all duration-200 flex flex-col group"
              >
                {/* Image Cover */}
                <div className="relative aspect-video w-full border-b border-zinc-200 bg-zinc-50 overflow-hidden select-none">
                  <Image
                    unoptimized
                    fill
                    src={item.productSnapshotImage || '/placeholder.jpg'}
                    alt={item.productSnapshotTitle || 'Product image'}
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-zinc-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 border border-zinc-700 bg-white/95 text-green-700 flex items-center justify-center shadow-lg transition-transform duration-200 scale-90 group-hover:scale-100">
                      <PlayCircle size={20} />
                    </div>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5 flex flex-col flex-1 space-y-4 justify-between">
                  <div className="space-y-1.5">
                    <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-650 border border-zinc-200 font-mono">
                      SECURE DIGITAL CATALOG
                    </span>
                    <h4 className="font-bold text-zinc-950 uppercase tracking-wider text-xs line-clamp-2 leading-tight">
                      {item.productSnapshotTitle ?? 'Untitled Produce Manual'}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                    <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                      LOAD DATE:{' '}
                      <span className="text-zinc-600">
                        {new Date(item.order?.createdAt ?? '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (item.product?.id) {
                          router.push(`/account/library/${item.product.id}`);
                        }
                      }}
                      className="h-8 px-4 bg-zinc-950 text-white border border-zinc-800 hover:bg-zinc-900 font-bold uppercase tracking-wider text-[9px] cursor-pointer flex items-center gap-1 transition-colors rounded-none"
                    >
                      Open Vault <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}

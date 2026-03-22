'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  BookOpen,
  PlayCircle,
  GraduationCap,
  Loader2,
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

  useEffect(() => {
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
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <Suspense fallback={
        <><div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-600" />
      </div></>
    } 
    >
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <GraduationCap className="text-emerald-600" /> My Learning Vault
        </h1>
        <p className="text-gray-500 font-medium">
          Access your purchased farming guides and technical courses.
        </p>
      </div>

      {library.length === 0 ? (
        <Card className="p-20 text-center border-2 border-dashed rounded-[3rem]">
          <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-400">
            Your library is empty.
          </h3>
          <Button
            onClick={() => router.push('/marketplace')}
            className="mt-4 bg-emerald-600"
          >
            Explore Courses
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {library.map((item) => (
            <Card
              key={item.id}
              className="p-0 overflow-hidden group border-none ring-1 ring-gray-100 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem]"
            >
              <div className="relative aspect-video">
                <Image
                  unoptimized
                  fill
                  src={item.productSnapshotImage || '/placeholder.jpg'} // ✅ fallback
                  alt={item.productSnapshotTitle || 'Product image'}
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-lg">
                    <PlayCircle size={24} />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-bold text-gray-900 line-clamp-1 mb-2">
                  {item.productSnapshotTitle ?? 'Untitled'}
                </h4>

                <div className="flex items-center justify-between mt-6">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Purchased{' '}
                    {new Date(item.order?.createdAt ?? '').toLocaleDateString()}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      if (item.product?.id) {
                        router.push(`/dashboard/library/${item.product.id}`);
                      }
                    }}
                    className="bg-emerald-600 h-10 rounded-xl px-5 font-bold text-xs"
                  >
                    Open Vault
                  </Button>
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
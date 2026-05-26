'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Heart, MapPin, Search, ShieldCheck,
  SlidersHorizontal, Star, X, Loader2,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CATEGORIES } from '@/components/constants';
import { useBuyer } from '@/context/BuyerContext';
import { Product } from '@/components/types';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-toastify';

const Page = () => {
  const router = useRouter();

  // Redirect buyers straight to the beautiful e-commerce account dashboard!
  useEffect(() => {
    router.replace('/account');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px] font-mono text-xs text-zinc-550 select-none">
      <Loader2 className="animate-spin text-green-700 mr-2" size={16} />
      <span>REDIRECTING SECURE ACCOUNT TERMINAL...</span>
    </div>
  );
};

export default Page;
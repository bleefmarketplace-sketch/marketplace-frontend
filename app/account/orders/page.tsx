'use client';

import React, { Suspense } from 'react';
import BuyerOrdersPage from '@/components/BuyerComponents/Orders';

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20 font-mono text-xs text-zinc-900 select-none">
        <span>LOADING PURCHASE RECORDS...</span>
      </div>
    }>
      <BuyerOrdersPage />
    </Suspense>
  );
}

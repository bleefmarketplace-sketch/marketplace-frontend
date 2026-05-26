'use client';

import React from 'react';
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Footer';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col justify-between">
      <LandingPagesNav />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

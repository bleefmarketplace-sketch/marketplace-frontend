'use client';

import React from 'react';
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Marketplace/Footer';
import { Community } from '@/components/pages/LandingCommunity';
import { CommunityHub } from '@/components/pages/CommunityHub';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Page = () => {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const onGetStarted = () => {
        router.push('/auth/signup');
    };

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-zinc-50 font-mono text-xs text-zinc-900 flex flex-col antialiased">
            <LandingPagesNav />
            <main className="flex-1 flex flex-col">
                {user ? <CommunityHub /> : <Community onGetStarted={onGetStarted} />}
            </main>
            {!user && <Footer />}
        </div>
    );
};

export default Page;
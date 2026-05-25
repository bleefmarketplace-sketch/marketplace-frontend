"use client"
import React from 'react'
import { Learning } from '../../components/pages/LandingLearning'
import { PendingAction } from '../../components/types';
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Marketplace/Footer';

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-zinc-50 font-mono text-xs text-zinc-900 flex flex-col antialiased">
        <LandingPagesNav  />
        <Learning />
        <Footer />
      </div>
    </>
  )
}

export default Page
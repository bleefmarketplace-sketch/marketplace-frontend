"use client"
import React from 'react'
import { Learning } from '../../components/pages/LandingLearning'
import { PendingAction } from '../../components/types';
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Footer';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onAction: (action: PendingAction) => void;
}

const Page: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onAction }) => {
  return (

    <>
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <LandingPagesNav onGetStarted={() => { }}  onAction={() => { }} />
        <Learning onGetStarted={onGetStarted} onAction={onAction} />
        <Footer />
      </div>
    </>
  )
}

export default Page
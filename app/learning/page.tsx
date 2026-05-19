"use client"
import React from 'react'
import { Learning } from '../../components/pages/LandingLearning'
import { PendingAction } from '../../components/types';
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Footer';

const Page = () => {
  return (
    <>
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <LandingPagesNav  />
        <Learning />
        <Footer />
      </div>
    </>
  )
}

export default Page
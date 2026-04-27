"use client"
import React from 'react'

import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/pages/ProductDetails';

interface LandingPageProps {
  onGetStarted: () => void;
  onAction: () => void;
}

const Page: React.FC<LandingPageProps> = () => {
  return (

    <>
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <LandingPagesNav  />
        <ProductDetails  />
        <Footer />
      </div>
    </>
  )
}

export default Page
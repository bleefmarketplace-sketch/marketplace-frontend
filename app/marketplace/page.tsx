"use client"
import React from 'react'
import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Footer';
import { Marketplace } from '@/components/pages/LandingMarketplace';

 

const Page = () => {
  return (

    <>
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <LandingPagesNav  />
        <Marketplace />
        <Footer />
      </div>
    </>
  )
}

export default Page
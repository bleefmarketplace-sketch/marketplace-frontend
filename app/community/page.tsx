"use client"
 import LandingPagesNav from '@/components/LandingPagesNav';
import Footer from '@/components/Footer';
import { Community } from '@/components/pages/LandingCommunity';
import { useRouter } from 'next/navigation';

 

const Page = () => {
  const router = useRouter();

   const onGetStarted = () => {
 router.push('/auth/signup');
  }
  return (

    <>
      <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
        <LandingPagesNav  />
        <Community onGetStarted={onGetStarted}  />
        <Footer />
      </div>
    </>
  )
}

export default Page
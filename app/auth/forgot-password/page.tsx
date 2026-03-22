"use client";
import { ForgotPassword } from '@/components/pages/Forgot-password'
import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" />
      </div>}>
      <ForgotPassword />
    </Suspense>
  )
}

export default Page
"use client"
import React, { useEffect, useState } from "react";
import { Home, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import LandingPagesNav from "@/components/LandingPagesNav";
import Footer from "@/components/Marketplace/Footer";

const NotFoundContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 font-mono text-xs antialiased select-none">

      {/* Official Landing Pages Navigation Bar */}
      <LandingPagesNav />


      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full space-y-6">

          {/* Core Card Panel */}
          <div className="border border-zinc-200 bg-white p-8 space-y-6 shadow-none rounded-none text-center">

            {/* Friendly Icon */}
            <div className="w-14 h-14 border border-green-200 bg-green-50 text-green-700 flex items-center justify-center mx-auto rounded-none">
              <ShoppingBag size={24} />
            </div>

            <div className="space-y-2">
              <span className="px-2 py-0.5 text-[8px] font-mono bg-zinc-100 text-zinc-650 border border-zinc-200 font-bold uppercase tracking-widest">
                STATE: OBJECT_NOT_FOUND
              </span>
              <h1 className="text-3xl font-black text-zinc-950 tracking-tight mt-2">
                404
              </h1>
              <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Page Not Located
              </h2>
              <p className="text-zinc-500 text-[10px] leading-relaxed max-w-xs mx-auto">
                The product sheet, knowledge module, or workspace directory you requested is currently unavailable. The link may have expired or been moved to a new partition.
              </p>
            </div>

            {/* Clean Telemetry Specs */}
            <div className="border-t border-zinc-150 pt-4 grid grid-cols-2 gap-3 text-[9px] text-left text-zinc-500 uppercase tracking-wider font-bold">
              <div>
                <span className="text-zinc-400 block text-[8px]">LOG REFERENCE</span>
                <span className="text-zinc-800 font-mono">#REF-ERR-404</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[8px]">SESSION STATE</span>
                <span className="text-green-700 font-mono">SECURE</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 select-none justify-center">
              <Link
                href="/"
                className="rounded-none h-10 px-5 bg-green-700 hover:bg-green-800 border border-green-700 text-white font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer shadow-none transition-colors"
              >
                <Home size={13} />
                Return to Marketplace
              </Link>
              <button
                onClick={() => window.history.back()}
                className="rounded-none h-10 px-5 bg-zinc-100 border border-zinc-300 text-zinc-700 hover:bg-zinc-200 font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft size={13} />
                Go Back
              </button>
            </div>

          </div>

        </div>
      </main>



    </div>
  );
};

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 text-zinc-500 font-mono text-xs flex items-center justify-center">LOADING DIAGNOSTIC INTERFACE...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
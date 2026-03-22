"use client"
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <Suspense>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        
        {/* 404 Number */}
        <h1 className="text-7xl md:text-8xl font-black text-gray-900 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-800">
          Page not found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-500 text-sm md:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          
          {/* Go Home */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            <Home size={18} />
            Go Home
          </Link>

          {/* Go Back */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

       
      </div>
    </div>
    </Suspense>
  );
}
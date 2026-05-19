"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      router.replace(`/auth/verify-email?token=${token}`);
    } else {
      router.replace("/auth/login");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Redirecting you to verification...</p>
      </div>
    </div>
  );
}

export default function VerifyEmailRedirect() {
  return (
    <Suspense fallback={null}>
      <RedirectPageContent />
    </Suspense>
  );
}

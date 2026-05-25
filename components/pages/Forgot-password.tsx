"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- COUNTDOWN TIMER -------------------- */
  useEffect(() => {
    if (retryAfter === 0) return;

    const timer = setInterval(() => {
      setRetryAfter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [retryAfter]);

  /* -------------------- SUBMIT HANDLER -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send reset email");
      }
   
      setIsSubmitted(true);
      setRetryAfter(30);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- RETRY HANDLER -------------------- */
  const handleRetry = () => {
    if (retryAfter > 0) return;
    setIsSubmitted(false);
  };

  return (
    <div className="py-16 w-full bg-zinc-50 flex items-center justify-center p-4 font-mono text-xs text-zinc-900 antialiased">
      <div className="max-w-md w-full bg-white border border-zinc-200 rounded-none shadow-none p-8">

        {!isSubmitted ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">
                Forgot Password?
              </h2>
              <p className="text-zinc-500 font-sans text-xs">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && (
                <p className="text-red-600 font-bold text-[10px] uppercase tracking-wide">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-none"
                isLoading={isLoading}
              >
                Reset Password
              </Button>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="text-xs font-bold text-green-700 hover:text-green-800 transition-colors uppercase tracking-wider"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">

            <div>
              <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">
                Check your email
              </h2>
              <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                We&apos;ve sent a password reset link to <br />
                <strong className="text-zinc-950 font-mono">{email}</strong>
              </p>
            </div>

            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wide">
              Didn&apos;t receive the email?{" "}
              <button
                onClick={handleRetry}
                disabled={retryAfter > 0}
                className={`font-black transition-colors uppercase tracking-wider cursor-pointer ${
                  retryAfter > 0
                    ? "text-zinc-350 cursor-not-allowed"
                    : "text-green-750 hover:underline hover:text-green-800"
                }`}
              >
                {retryAfter > 0
                  ? `Retry in ${retryAfter}s`
                  : "Click to retry"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

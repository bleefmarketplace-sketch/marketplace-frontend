"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { encrypt } from "@/secure/__enc";
import Link from "next/link";

const getCookieOptions = (hours = 6) => ({
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: hours * 60 * 60, // seconds
});


export const ForgotPassword = () => {
 

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
    setRetryAfter(30); // retry cooldown (seconds)
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 p-10">

        {!isSubmitted ? (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
                🔑
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-500 font-medium">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full py-4 text-lg rounded-2xl shadow-lg shadow-green-600/20"
                isLoading={isLoading}
              >
                Reset Password
              </Button>
            </form>

            <Link
              href="/login"
              className="w-full text-center text-sm font-bold text-gray-500 hover:text-green-600 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          <div className="space-y-8 text-center animate-fadeIn">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📩</span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                We&apos;ve sent a password reset link to <br />
                <strong className="text-gray-900">{email}</strong>
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email?{" "}
              <button
                onClick={handleRetry}
                disabled={retryAfter > 0}
                className={`font-bold transition-colors ${
                  retryAfter > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-600 hover:underline"
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

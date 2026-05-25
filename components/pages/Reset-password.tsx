"use client";

import React, { Suspense, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get("q");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /* -------------------- VALIDATION -------------------- */
    const validatePassword = () => {
        if (!password || !confirmPassword) {
            return "All fields are required";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match";
        }

        if (!q) {
            return "Invalid or expired reset link";
        }

        return null;
    };

    /* -------------------- SUBMIT HANDLER -------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validatePassword();
        if (validationError) {
            toast(validationError);
            return;
        }

        setIsLoading(true);
       
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: q,
                    newPassword: password,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Password reset failed");
            }

            setIsSuccess(true);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    /* -------------------- UI -------------------- */
    return (
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-mono text-xs text-zinc-950 uppercase tracking-widest font-bold">
            LOADING SETTINGS...
          </div>
        }>   
        <div className="py-16 w-full bg-zinc-50 flex items-center justify-center p-4 font-mono text-xs text-zinc-900 antialiased">
            <div className="max-w-md w-full bg-white border border-zinc-200 rounded-none shadow-none p-8">

                {!isSuccess ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">
                                Set New Password
                            </h2>
                            <p className="text-zinc-500 font-sans text-xs">
                                Please enter a secure password for your account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <Button
                                type="submit"
                                className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-none"
                                isLoading={isLoading}
                            >
                                Update Password
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6 text-center">

                        <div>
                            <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">
                                Password Reset!
                            </h2>
                            <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                                Your password has been successfully updated. <br />
                                You can now login with your new credentials.
                            </p>
                        </div>

                        <Button
                            className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-none"
                            onClick={() => router.push("/auth/login")}
                        >
                            Continue to Login
                        </Button>
                    </div>
                )}
            </div>
        </div>
        </Suspense>
    );
};

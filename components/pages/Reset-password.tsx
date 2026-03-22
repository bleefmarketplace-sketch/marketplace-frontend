"use client";

import React, { Suspense, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";


export const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get("q"); // ✅ from reset link

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
        <Suspense>   
                 <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 p-10">

                {!isSuccess ? (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
                                🛡️
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">
                                Set New Password
                            </h2>
                            <p className="text-gray-500 font-medium">
                                Please enter a secure password for your account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                className="w-full py-4 text-lg rounded-2xl shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700"
                                isLoading={isLoading}
                            >
                                Update Password
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-8 text-center animate-fadeIn">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">✅</span>
                        </div>

                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">
                                Password Reset!
                            </h2>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Your password has been successfully updated. <br />
                                You can now login with your new credentials.
                            </p>
                        </div>

                        <Button
                            className="w-full py-4 rounded-2xl"
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

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const Page = () => {
    const params = useSearchParams();
    const router = useRouter();
    const token = params.get("token");

    const [status, setStatus] = useState<
        "loading" | "success" | "error"
    >("loading");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(
                    `/api/auth/verify-email`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token }),
                    }
                );

                if (!res.ok) throw new Error("Verification failed");

                setStatus("success");

                // Redirect after short delay
                setTimeout(() => router.push("/auth/login"), 2500);
            } catch {
                setStatus("error");
            }
        };

        verifyEmail();
    }, [token, router]);

    const onBack = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gray-900 px-4">
            <div className="absolute inset-0 z-0">
                <Image
                    fill
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2532&q=80"
                    alt="Field background"
                    className="w-full h-full object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-gray-900/60 to-gray-900/90"></div>
            </div>

            <button
                onClick={onBack}
                className="absolute top-8 left-8 z-20 text-white/80 hover:text-white flex items-center gap-2 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20"
            >
                <ArrowLeft size={18} /> <span className="text-sm font-medium">Back to Home</span>
            </button>
            <div className="relative z-10 w-full max-w-md p-6 mx-4">
                <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8 text-center">
                    {status === "loading" && (
                        <>
                            <h2 className="text-xl font-semibold">Verifying your email</h2>
                            <p className="text-gray-500 mt-2">
                                Please wait a moment…
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <h2 className="text-2xl font-bold text-green-600">
                                Email Verified 🎉
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Your account is now active. Redirecting to login…
                            </p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <h2 className="text-2xl font-bold text-red-600">
                                Verification Failed
                            </h2>
                            <p className="text-gray-600 mt-2">
                                This verification link is invalid or expired.
                            </p>
                            <button
                                onClick={() => router.push("/auth/login")}
                                className="mt-6 w-full rounded-xl bg-black py-2 text-white hover:bg-gray-800"
                            >
                                Go to Login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page

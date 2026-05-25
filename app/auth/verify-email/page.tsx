"use client";

import { Suspense, useEffect, useState } from "react";
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
        <Suspense>
        <div className="py-16 w-full flex items-center justify-center relative bg-zinc-50 px-4 font-mono text-xs antialiased">
            
            <div className="relative z-10 w-full max-w-md p-6 mx-4">
                <div className="w-full max-w-md border border-zinc-200 bg-white rounded-none shadow-none p-8 text-center animate-in fade-in duration-300">
                    
                    {status === "loading" && (
                        <>
                            <h2 className="text-sm font-black text-zinc-950 uppercase tracking-tight mb-2">VERIFYING YOUR EMAIL</h2>
                            <p className="text-zinc-500 font-sans text-xs">
                                Please wait a moment…
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <h2 className="text-sm font-black text-green-700 uppercase tracking-tight mb-2">
                                EMAIL VERIFIED 🎉
                            </h2>
                            <p className="text-zinc-500 font-sans text-xs">
                                Your account is now active. Redirecting to login…
                            </p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <h2 className="text-sm font-black text-red-700 uppercase tracking-tight mb-2">
                                VERIFICATION FAILED
                            </h2>
                            <p className="text-zinc-500 font-sans text-xs">
                                This verification link is invalid or expired.
                            </p>
                            <button
                                onClick={() => router.push("/auth/login")}
                                className="mt-6 w-full rounded-none border border-zinc-950 bg-zinc-950 py-2.5 text-white hover:bg-zinc-800 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                            >
                                GO TO LOGIN
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
        </Suspense>
    );
}

export default Page;

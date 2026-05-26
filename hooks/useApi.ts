import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export const useApi = () => {
    const { logout } = useAuth();
    const router = useRouter();

    const fetcher = useCallback(async (url: string, options: RequestInit = {}) => {
        let response = await fetch(url, options);

        // 1. If we get a 401, try to refresh
        if (response.status === 401 || response.status === 403 && !url.includes('/api/auth/login')) {
            const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

            if (refreshRes.ok) {
                response = await fetch(url, options);
            }
        }

        // Check if the response is explicitly 403 Forbidden before parsing json
        if (response.status === 403 || response.status === 401) {
            router.push("/auth/login");
            return new Promise(() => { }); // Return a pending promise to halt downstream state updates/crashes
        }

        const data = await response.json();

        // Check if the response failed or message contains "forbidden"
        const isForbidden = response.status === 403 ||
            (data.message && typeof data.message === "string" && data.message.toLowerCase().includes("forbidden"));

        if (isForbidden) {
            router.push("/auth/login");
            return new Promise(() => { }); // Return a pending promise to halt downstream state updates/crashes
        }

        if (!response.ok || data.success === false) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    }, [logout, router]);

    return fetcher;
};
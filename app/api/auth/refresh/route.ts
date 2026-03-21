import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";
import { decrypt, encrypt } from "@/secure/__enc";
import { COOKIE_REFRESH_KEY, COOKIE_TOKEN_KEY, getCookieOptions } from "@/context/AuthContext";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const encryptedRefresh = cookieStore.get("_ref_")?.value;  

        if (!encryptedRefresh) throw new Error("No refresh token");

        const refreshToken = decrypt(encryptedRefresh);

        // 1. Call NestJS Refresh Endpoint
        const response = await axios.post(`${process.env.BASE_URL}/auth/refresh`, {
            refreshToken
        });

        const { token: newAccess, refreshToken: newRefresh } = response.data;

        // 2. Update Cookies
        const responseHeaders = NextResponse.json({ success: true });

        const options = getCookieOptions()

         setCookie(COOKIE_USER_KEY, JSON.stringify(updatedUser), getCookieOptions(7));
        
        responseHeaders.cookies.set(COOKIE_TOKEN_KEY, encrypt(newAccess), options);
        responseHeaders.cookies.set(COOKIE_REFRESH_KEY, encrypt(newRefresh), options);

        return responseHeaders;
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 401 });
    }
}
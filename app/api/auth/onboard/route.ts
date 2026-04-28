import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { decrypt } from "@/secure/__enc";
import * as jose from "jose";
import { getAuthToken } from "@/helpers/__helper";

type BackendErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export async function POST(request: Request) {
  try {
    /* ----------------------------- */
    /* 1. AUTH TOKEN                 */
    /* ----------------------------- */
    const token = await getAuthToken();
   

    if (!token) {
      return NextResponse.json(
        { success: false, code: "AUTH_REQUIRED", message: "Authentication required" },
        { status: 401 }
      );
    }

   

    /* ----------------------------- */
    /* 2. DECODE TOKEN TO GET USER ID */
    /* ----------------------------- */
    
    let userId: string;
    try {
      const decoded = jose.decodeJwt(token);
      userId = decoded.sub as string;
      if (!userId) throw new Error("No sub in token");
    } catch {
      return NextResponse.json(
        { success: false, code: "INVALID_TOKEN", message: "Invalid token" },
        { status: 401 }
      );
    }

    /* ----------------------------- */
    /* 3. REQUEST DATA               */
    /* ----------------------------- */
    const body = await request.json();

    /* ----------------------------- */
    /* 4. BACKEND REQUEST            */
    /* ----------------------------- */
    const response = await axios.patch(
      `${process.env.BASE_URL}/auth/${userId}/onboard`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    /* ----------------------------- */
    /* 5. SUCCESS RESPONSE           */
    /* ----------------------------- */
    return NextResponse.json(
      { success: true, user: response.data },
      { status: 200 }
    );
  } catch (error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data;
 
    let message = "Service temporarily unavailable";
    let code = "SERVER_ERROR";

    switch (status) {
      case 400:
        message = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message || "Invalid input";
        code = "VALIDATION_ERROR";
        break;
      case 401:
        message = "Unauthorized request";
        code = "AUTH_REQUIRED";
        break;
      case 403:
        message = "Your account has been suspended";
        code = "ACCOUNT_SUSPENDED";
        break;
      case 404:
        message = "User not found";
        code = "USER_NOT_FOUND";
        break;
      case 409:
        message = "User has already completed onboarding";
        code = "ONBOARDING_COMPLETED";
        break;
      case 429:
        message = "Too many attempts";
        code = "RATE_LIMITED";
        break;
    }

    return NextResponse.json({ success: false, code, message }, { status });
  }
}
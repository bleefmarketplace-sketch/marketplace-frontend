import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { getAuthToken } from "@/helpers/__helper";

type BackendErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export async function POST(request: Request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { success: false, code: "AUTH_REQUIRED", message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await axios.patch(
      `${process.env.BASE_URL}/auth/switch-role`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );



    const { user, accessToken, refreshToken } = response?.data?.data;

    return NextResponse.json(
      {
        success: true,
        user,
        token: accessToken,
        refreshToken,
      },
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
        message = "Forbidden action";
        code = "FORBIDDEN";
        break;
      case 404:
        message = "User not found";
        code = "USER_NOT_FOUND";
        break;
    }

    return NextResponse.json({ success: false, code, message }, { status });
  }
}

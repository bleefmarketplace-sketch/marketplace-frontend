import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();


    // 3. Call backend verification endpoint
  const response =   await axios.post(
      `${process.env.BASE_URL}/auth/forgot-password`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Forgot password response:", response.data);


    // 4. Return success (do NOT leak backend response object)
    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    const axiosError = error as AxiosError<any>;

    // Server-side logging ONLY
    

     

    // Network / backend unavailable
    return NextResponse.json(
      {
        success: false,
        message: "Forgot password service temporarily unavailable",
      },
      { status: 503 }
    );
  }
}

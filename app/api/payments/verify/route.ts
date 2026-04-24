import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    const gateway = searchParams.get("gateway") || "paystack";

    if (!reference) {
      return NextResponse.json({ success: false, message: "Missing reference" }, { status: 400 });
    }

    const token = await getAuthToken();

    const response = await axios.get(
      `${process.env.BASE_URL}/payment-gateways/verify`,
      {
        params: { reference, gateway },
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    
    return NextResponse.json(response.data);
  } catch (error) {
    return handleAxiosError(error);
  }
}
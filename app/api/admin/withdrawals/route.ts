import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const token = await getAuthToken();
   
    const response = await axios.get(
      `${process.env.BASE_URL}/admin/withdrawals`,
      { 
        params: { status },
        headers: { Authorization: `Bearer ${token}` } 
      }
    );
    return NextResponse.json({ success: true, data: response.data.data });
  } catch (e) {
    return handleAxiosError(e);
  }
}
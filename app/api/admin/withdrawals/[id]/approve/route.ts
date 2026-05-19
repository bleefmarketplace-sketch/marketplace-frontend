import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = await getAuthToken();
   
    const response = await axios.post(
      `${process.env.BASE_URL}/admin/withdrawals/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return NextResponse.json({ success: true, data: response.data.data });
  } catch (e) {
    return handleAxiosError(e);
  }
}
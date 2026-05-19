import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = await getAuthToken();
    const response = await axios.patch(
      `${process.env.BASE_URL}/support/admin/tickets/${id}/status`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return NextResponse.json({ success: true, data: response.data.data });
  } catch (e) { return handleAxiosError(e); }
}

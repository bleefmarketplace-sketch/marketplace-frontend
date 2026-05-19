import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET() {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${process.env.BASE_URL}/support/my-tickets`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return NextResponse.json({ success: true, data: response.data.data });
  } catch (e) { return handleAxiosError(e); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = await getAuthToken();
    const response = await axios.post(`${process.env.BASE_URL}/support/tickets`, body, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return NextResponse.json({ success: true, data: response.data.data });
  } catch (e) { return handleAxiosError(e); }
}

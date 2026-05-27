import { NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET(request: Request) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const response = await axios.get(
      `${process.env.BASE_URL}/admin/products?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return NextResponse.json({ success: true, data: response.data.data });
  } catch (e) {
    return handleAxiosError(e);
  }
}

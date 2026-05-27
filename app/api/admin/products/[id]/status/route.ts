import { NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const token = await getAuthToken();
    const body = await request.json();

    const response = await axios.patch(
      `${process.env.BASE_URL}/admin/products/${id}/status`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return NextResponse.json({ success: true, data: response.data.data });
  } catch (e) {
    return handleAxiosError(e);
  }
}

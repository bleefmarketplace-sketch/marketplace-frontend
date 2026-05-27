import { NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const token = await getAuthToken();
    await axios.delete(
      `${process.env.BASE_URL}/admin/products/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return NextResponse.json({ success: true, message: "Product deleted by admin" });
  } catch (e) {
    return handleAxiosError(e);
  }
}

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET(
    request: NextRequest,
        context: { params: Promise<{ id: string }> }
) {
    try {
        const token = await getAuthToken();
     
  const { id } = await context.params;
        const res = await axios.get(`${process.env.BASE_URL}/creator/vault/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return NextResponse.json({ success: true, data: res.data });
    } catch (e) { return handleAxiosError(e); }
}
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request,           context: { params: Promise<{ id: string }> }
 ) {
    try {
  const { id } = await context.params;
        const token = await getAuthToken();
        const res = await axios.post(`${process.env.BASE_URL}/wallet/admin/withdrawals/${id}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return NextResponse.json({ success: true, data: res.data });
    } catch (e) { return handleAxiosError(e); }
}
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getAuthToken();
        // The [id] in the URL is the productId
        const res = await axios.get(`${process.env.BASE_URL}/creator/vault/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return NextResponse.json({ success: true, data: res.data });
    } catch (e) { return handleAxiosError(e); }
}
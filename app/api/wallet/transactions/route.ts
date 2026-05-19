import { getAuthToken, handleAxiosError } from "@/helpers/__helper";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const token = await getAuthToken();
        const res = await axios.get(`${process.env.BASE_URL}/wallet/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return NextResponse.json({ success: true, data: res.data.data });
    } catch (e) { return handleAxiosError(e); }
}

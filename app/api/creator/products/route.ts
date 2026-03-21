import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET() {
    try {
        const token = await getAuthToken();
        const res = await axios.get(`${process.env.BASE_URL}/creator/my-content`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return NextResponse.json({ success: true, data: res.data });
    } catch (e) { return handleAxiosError(e); }
}

export async function POST(req: NextRequest) {
    try {
        const token = await getAuthToken();
        const body = await req.json();
        const res = await axios.post(`${process.env.BASE_URL}/creator/products`, body, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return NextResponse.json({ success: true, data: res.data });
    } catch (e) { return handleAxiosError(e); }
}
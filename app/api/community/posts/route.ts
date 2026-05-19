import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function POST(request: NextRequest) {
    try {
        const token = await getAuthToken();
        const body = await request.json();
        const res = await axios.post(`${process.env.BASE_URL}/community/posts`, body, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return NextResponse.json(res.data);
    } catch (e) { return handleAxiosError(e); }
}

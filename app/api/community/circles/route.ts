import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET() {
    try {
        const res = await axios.get(`${process.env.BASE_URL}/community/circles`);
        return NextResponse.json(res.data);
    } catch (e) { return handleAxiosError(e); }
}

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const joinId = searchParams.get('join');
        
        if (!joinId) return NextResponse.json({ success: false, message: 'Missing join ID' }, { status: 400 });

        const token = await getAuthToken();
        const res = await axios.post(`${process.env.BASE_URL}/community/circles/${joinId}/join`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return NextResponse.json(res.data);
    } catch (e) { return handleAxiosError(e); }
}

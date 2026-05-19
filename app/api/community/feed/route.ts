import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleAxiosError } from "@/helpers/__helper";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const res = await axios.get(`${process.env.BASE_URL}/community/feed`, {
            params: Object.fromEntries(searchParams)
        });
        return NextResponse.json(res.data);
    } catch (e) { return handleAxiosError(e); }
}

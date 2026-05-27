import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

// GET: Fetch cart items
export async function GET(request: NextRequest) {
    try {
        const token = await getAuthToken();
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");

        let url = `${process.env.BASE_URL}/cart`;
        if (sessionId) {
            url += `?sessionId=${sessionId}`;
        }

        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios.get(url, { headers });
        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}

// POST: Add item to cart
export async function POST(request: NextRequest) {
    try {
        const token = await getAuthToken();
        const body = await request.json();

        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios.post(`${process.env.BASE_URL}/cart`, body, { headers });
        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}

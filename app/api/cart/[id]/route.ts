import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

type RouteParams = {
    params: Promise<{ id: string }>;
};

// PATCH: Update item quantity in database
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const token = await getAuthToken();
        
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");
        
        const body = await request.json(); // contains { quantity }

        let url = `${process.env.BASE_URL}/cart/${id}`;
        if (sessionId) {
            url += `?sessionId=${sessionId}`;
        }

        const headers: Record<string, string> = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios.patch(url, body, { headers });
        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}

// DELETE: Remove item from database
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const token = await getAuthToken();
        
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");

        let url = `${process.env.BASE_URL}/cart/${id}`;
        if (sessionId) {
            url += `?sessionId=${sessionId}`;
        }

        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios.delete(url, { headers });
        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}

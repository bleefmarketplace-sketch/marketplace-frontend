import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

// POST: Merge guest session cart into authenticated user cart
export async function POST(request: NextRequest) {
    try {
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json(); // contains { sessionId }
        const response = await axios.post(`${process.env.BASE_URL}/cart/merge`, body, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}

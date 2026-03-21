import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

// GET ALL SETTINGS
export async function GET() {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${process.env.BASE_URL}/system-settings`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}

// UPDATE SETTINGS
export async function POST(request: NextRequest) {
    try {
        const token = await getAuthToken();
        const body = await request.json();


        const response = await axios.post(`${process.env.BASE_URL}/system-settings`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}
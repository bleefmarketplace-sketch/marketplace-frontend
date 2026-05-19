import { NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function GET() {
    const token = await getAuthToken();
    try {
        const res = await axios.get(`${process.env.BASE_URL}/disputes/my-disputes`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Assuming backend returns standard format
        return NextResponse.json({ success: true, data: res.data.data });
    } catch (error) {
        return handleAxiosError(error);
    }
}

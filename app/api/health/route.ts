import { NextResponse } from "next/server";
import axios from "axios";
import { handleAxiosError } from "@/helpers/__helper";

export async function GET() {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/health`);
        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}

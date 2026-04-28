import { getAuthToken, handleAxiosError } from "@/helpers/__helper";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const token = await getAuthToken();
        const body = await request.json();
 
        const response = await axios.post(
            `${process.env.BASE_URL}/newsletter/send-group-message`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        return NextResponse.json(response.data, { status: 201 });
    } catch (error:any) {
        console.log(error);
        return handleAxiosError(error);
    }
}
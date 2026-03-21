import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = await getAuthToken();
        const { id } = params;

        // Calls NestJS: @Patch('notifications/:id/read')
        const response = await axios.patch(
            `${process.env.BASE_URL}/notifications/${id}/read`, 
            {}, // Empty body for a status update
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        return NextResponse.json({ 
            success: true, 
            data: response.data 
        });
    } catch (error) {
        return handleAxiosError(error);
    }
}
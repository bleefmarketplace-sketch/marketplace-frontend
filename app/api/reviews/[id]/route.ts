import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAuthToken, handleAxiosError } from "@/helpers/__helper";

// GET REVIEWS for a product
export async function GET(
    request: NextRequest,
      context: { params: Promise<{ id: string }> }
) {
    try {
      const { id } = await context.params;
     
        const response = await axios.get(`${process.env.BASE_URL}/reviews/product/${id}`);

        return NextResponse.json(response.data);
    } catch (error) {
        return handleAxiosError(error);
    }
}

// POST A REVIEW
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
       const { id } = await context.params;
        
        const token = await getAuthToken();
        const body = await request.json();

        // This calls your NestJS: @Post('reviews/:productId')
        const response = await axios.post(
            `${process.env.BASE_URL}/reviews/${id}`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            }
        );

        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        return handleAxiosError(error);
    }
}
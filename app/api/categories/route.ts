import { handleAxiosError } from "@/helpers/__helper";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
       
        const response = await axios.get(`${process.env.BASE_URL}/categories`);

           return NextResponse.json({ success: true, data: response.data }); 
    } catch (error) {
        return handleAxiosError(error);
    }
}
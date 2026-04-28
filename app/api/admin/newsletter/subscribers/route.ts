import { getAuthToken, handleAxiosError } from "@/helpers/__helper";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token = await getAuthToken();

    // ✅ Extract query params from URL
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const search = searchParams.get("search") || "";

    // ✅ Call correct backend endpoint
    const response = await axios.get(
      `${process.env.BASE_URL}/newsletter/subscribers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
          search,
        },
      }
    );

    // ✅ Return clean response
    return NextResponse.json(response.data);

  } catch (error) {
    return handleAxiosError(error);
  }
}
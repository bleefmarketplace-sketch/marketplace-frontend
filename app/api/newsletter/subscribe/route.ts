import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.BASE_URL}/newsletter/subscribe`,
      { email, firstName }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || 'Something went wrong. Please try again.';
    return NextResponse.json({ success: false, message }, { status });
  }
}

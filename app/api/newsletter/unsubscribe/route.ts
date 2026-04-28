import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token is required' }, { status: 400 });
  }

  try {
    const res = await axios.get(`${process.env.BASE_URL}/newsletter/unsubscribe/${token}`);
    return NextResponse.json(res.data);
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || 'Unsubscribe failed';
    return NextResponse.json({ success: false, message }, { status });
  }
}

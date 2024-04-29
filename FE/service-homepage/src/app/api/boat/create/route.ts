import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const POST = apiHandler(async (req: NextRequest) => {
    const data = await req.json();
    console.log(data);
    const res = await serverAxios.post(`/boat/v1/create`, data);
    return NextResponse.json({
        result: res.data.statusCode,
        message: res.data.message,
        data: res.data.data,
    });
});

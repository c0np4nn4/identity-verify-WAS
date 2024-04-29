import { NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const GET = apiHandler(async () => {
    const res = await serverAxios.get(`/service/v1/get-user-info`, {});

    return NextResponse.json({
        result: res.data.statusCode,
        data: res.data,
    });
});

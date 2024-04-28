import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const POST = apiHandler(async (req: NextRequest) => {
    const session = await getSession();
    const { searchParams } = new URL(req.url);

    const res = await serverAxios.get(`/boat/v1/create`);
    return NextResponse.json({
        result: true,
        data: res.data.data,
    });
});

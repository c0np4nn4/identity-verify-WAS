import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const GET = apiHandler(async (req: NextRequest) => {
    const session = await getSession();
    const res = await serverAxios.get(
        `/alarm/v1/list?userPk=${session.userPk}`
    );
    return NextResponse.json({
        result: res.data.statusCode,
        data: res.data.data,
    });
});

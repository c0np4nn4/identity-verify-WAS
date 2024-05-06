import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const POST = apiHandler(async (req: NextRequest) => {
    const session = await getSession();
    const userPk = session.userPk;
    const { targetPk, name } = await req.json();
    const res = await serverAxios.post(`/match-log/v1/send/real-name`, {
        userPk,
        targetPk,
        name,
    });

    return NextResponse.json({
        result: res.data.statusCode,
        data: res.data.data,
    });
});

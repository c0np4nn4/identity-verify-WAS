import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const POST = apiHandler(async (req: NextRequest) => {
    const session = await getSession();
    const userPk = session.userPk;
    const { targetPk, label1, label2, label3 } = await req.json();
    const res = await serverAxios.post(`/match-log/v1/send/my-label`, {
        userPk,
        targetPk,
        label1,
        label2,
        label3,
    });

    return NextResponse.json({
        result: res.data.statusCode,
        data: res.data.data,
    });
});

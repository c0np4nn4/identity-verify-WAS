import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const POST = apiHandler(async (req: NextRequest) => {
    const session = await getSession();
    const userPk = session.userPk;
    const nickname = session.nickname;
    const { targetPk } = await req.json();
    console.log('nickname', nickname);
    console.log('userPk', userPk);
    console.log('targetPk', targetPk);
    const res = await serverAxios.post(`/match-log/v1/send/correct-sign`, {
        userPk,
        targetPk,
    });

    return NextResponse.json({
        result: res.data.statusCode,
        data: res.data.data,
    });
});

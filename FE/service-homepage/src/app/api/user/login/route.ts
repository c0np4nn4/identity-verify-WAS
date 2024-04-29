import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios, { apiHandler } from '@/lib/server-axios';

export const POST = apiHandler(async (req: NextRequest) => {
    const { id, password } = await req.json();

    const res = await serverAxios.post('/service/v1/login', {
        id,
        password,
    });

    // 세션에 토큰 저장
    const session = await getSession();
    session.id = id;
    session.token = res.data.data.token;
    session.userPk = res.data.data.userPk;
    session.nickname = res.data.data.nickname;
    await session.save();

    return NextResponse.json({
        result: res.data.statusCode,
        message: res.data.message,
        data: res.data.data,
    });
});

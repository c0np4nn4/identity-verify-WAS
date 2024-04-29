import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/server-axios';
import getSession from '@/lib/session';

export const GET = apiHandler(async () => {
    const session = await getSession();

    // check if the user is logged in
    if (!session.id) {
        return NextResponse.json({
            result: 401,
            message: '로그인이 필요합니다.',
        });
    }

    return NextResponse.json({
        result: 200,
        message: '로그인이 되어있습니다.',
        data: {
            id: session.id,
            nickname: session.nickname,
        },
    });
});

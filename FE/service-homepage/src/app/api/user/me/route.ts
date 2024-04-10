import getSession from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    if (!session.id) {
        return NextResponse.json({
            result: false,
            message: '로그인한 유저가 없다.',
        });
    }

    return NextResponse.json({
        result: true,
        message: '유저 정보 전송!',
        data: {
            id: session.id,
            nickname: session.nickname,
        },
    });
}

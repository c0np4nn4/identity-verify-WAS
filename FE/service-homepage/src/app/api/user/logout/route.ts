import getSession from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
    const session = await getSession();
    if (!session.id) {
        return NextResponse.json({
            result: false,
            message: '로그아웃 실패! 로그인한 유저가 없다.',
        });
    }

    session.destroy();

    return NextResponse.json({
        result: true,
        message: '로그아웃 성공',
    });
}

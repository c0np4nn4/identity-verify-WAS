import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios from '@/lib/server-axios';

export async function POST(req: NextRequest) {
    const { id, password } = await req.json();
    let data;
    try {
        const res = await serverAxios.post('/login', { id, password });
        if (res.data.statusCode >= 400) {
            console.error(res.data.data.message);
            throw new Error(res.data.data.message);
        }
        data = res.data.data;
        const session = await getSession();
        session.token = data.token;
        session.id = id;
        session.nickname = 'kimcookieya';
        await session.save();
    } catch (error) {
        return NextResponse.json(
            { result: false, message: '로그인 실패' },
            { status: 400 }
        );
    }

    return NextResponse.json({ result: true, message: '로그인 성공!', data });
}

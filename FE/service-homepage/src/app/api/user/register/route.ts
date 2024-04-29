import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios from '@/lib/server-axios';

export async function POST(req: NextRequest) {
    const data = await req.json();

    try {
        const res = await serverAxios.post('/service/v1/register', data);
        if (res.data.statusCode >= 400) {
            console.error(res.data.data.message);
            throw new Error(res.data.data.message);
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { result: false, message: '회원가입 실패' },
            { status: 400 }
        );
    }

    return NextResponse.json({ result: true, message: '회원가입 성공!' });
}

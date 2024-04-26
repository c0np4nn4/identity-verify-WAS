import getSession from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import serverAxios from '@/lib/server-axios';

export async function POST(req: NextRequest) {
    const session = await getSession();
    const { searchParams } = new URL(req.url);

    try {
        const res = await serverAxios.get(`/boat/v1/create`, {
            headers: {
                token: session.token,
            },
        });

        if (res.data.statusCode >= 400) {
            console.error(res.data.data.message);
            throw new Error(res.data.data.message);
        }
        console.log(res.data);
        return NextResponse.json({
            result: true,
            message: '종이배 생성 성공!',
            data: true,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { result: false, message: '종이배 생성 실패' },
            { status: 400 }
        );
    }
}
